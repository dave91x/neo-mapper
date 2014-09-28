// this will eventually become the index.js file in the repo lib directory

// db (Neo4j via seraph npm)
var neoDb   = require('seraph')();
var Model   = require('./model');
var Schema  = require('./schema');
var pkg     = require('./package.json');
var utils   = require('./utils');

/*
 * Growler constructor.
 *
 * The exports object of the `growler` module is an instance of this class.
 * Most apps will only use this one instance.
 *
 * @api public
 */
 
function Growler () {
  this.connections = [];
  // this.plugins = [];
  this.models = {};
  this.modelSchemas = {};
  // default global options
  this.options = {
    pluralization: true
  };
  // var conn = this.createConnection(); // default connection
  // conn.models = this.models;
}

/*
 * Sets growler options
 *
 * #### Example:
 *
 *     growler.set('test', value) // sets the 'test' option to `value`
 *
 *     growler.set('debug', true) // enable logging collection methods + arguments to the console
 *
 * @param {String} key
 * @param {String} value
 * @api public
 */

Growler.prototype.set = function (key, value) {
  if (arguments.length == 1) {
    return this.options[key];
  }

  this.options[key] = value;
  return this;
};

/*
 * Gets growler options
 *
 * #### Example:
 *
 *     growler.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @method get
 * @api public
 */

Growler.prototype.get = Growler.prototype.set;

/*
 * Defines a model or retrieves it.
 *
 * Models defined on the `growler` instance are available to all connection created by the same `growler` instance.
 *
 * #### Example:
 *
 *     var growler = require('growler');
 *
 *     // define an Actor model with this growler instance
 *     growler.model('Actor', new Schema({ name: String }));
 *
 *     // create a new connection
 *     var conn = growler.createConnection(..);
 *
 *     // retrieve the Actor model
 *     var Actor = conn.model('Actor');
 *
 * _When no `collection` argument is passed, Growler produces a collection name by passing the model `name`
 *  to the [utils.toCollectionName](#utils_exports.toCollectionName) method. This method pluralizes the name. 
 *  If you don't like this behavior, either pass a collection name or set your schemas collection name option._
 *
 * #### Example:
 *
 *     var schema = new Schema({ name: String }, { collection: 'actor' });
 *
 *     // or
 *
 *     schema.set('collection', 'actor');
 *
 *     // or
 *
 *     var collectionName = 'actor'
 *     var M = growler.model('Actor', schema, collectionName)
 *
 * @param {String} name model name
 * @param {Schema} [schema]
 * @param {String} [collection] name (optional, induced from model name)
 * @param {Boolean} [skipInit] whether to skip initialization (defaults to false)
 * @api public
 */
 
Growler.prototype.model = function (name, schema) {
  
  if ('string' == typeof schema) {
    schema = false;
  }
  
  if (utils.isObject(schema) && !(schema instanceof Schema)) {
    schema = new Schema(schema);
  }
  
  // handle internal options from connection.model()
  var options = {};
  // if (skipInit && utils.isObject(skipInit)) {
  //   options = skipInit;
  //   skipInit = true;
  // } else {
  //   options = {};
  // }

  // look up schema for the collection. this might be a
  // default schema like system.indexes stored in SchemaDefaults.
  if (!this.modelSchemas[name]) {
    // if (!schema && name in SchemaDefaults) {
    //   schema = SchemaDefaults[name];
    // }

    if (schema) {
      // cache it so we only apply plugins once
      this.modelSchemas[name] = schema;
      // console.log(this.modelSchemas);
      // this._applyPlugins(schema);
    } else {
      // throw new mongoose.Error.MissingSchemaError(name);
      throw new Error('missing schema: ' + name);
    }
  }
  
  var model;
  
  // connection.model() may be passing a different schema for
  // an existing model name. in this case don't read from cache.
  if (this.models[name] && false !== options.cache) {
    if (schema instanceof Schema && schema != this.models[name].schema) {
      // throw new mongoose.Error.OverwriteModelError(name);
      throw new Error('overwrite model error: ' + name);
    }

    // if (collection) {
    //   // subclass current model with alternate collection
    //   model = this.models[name];
    //   schema = model.prototype.schema;
    //   sub = model.__subclass(this.connection, schema, collection);
    //   // do not cache the sub model
    //   return sub;
    // }

    return this.models[name];
  }

  // ensure a schema exists
  if (!schema) {
    schema = this.modelSchemas[name];
    if (!schema) {
      // throw new mongoose.Error.MissingSchemaError(name);
      throw new Error('missing schema: ' + name);
    }
  }

  // Apply relevant "global" options to the schema
  if (!('pluralization' in schema.options)) schema.options.pluralization = this.options.pluralization;


  // if (!collection) {
  //   collection = schema.get('collection') || format(name, schema.options);
  // }

  // var connection = options.connection || this.connection;
  model = Model.compile(name, schema, neoDb, this);

  // if (!skipInit) {
  //   model.init();
  // }

  if (false === options.cache) {
    return model;
  }
  
  // console.log(model);
  return this.models[name] = model;
};

/*
 * Returns an array of model names created on this instance of Growler.
 *
 * #### Note:
 *
 * _Does not include names of models created using `connection.model()`._
 *
 * @api public
 * @return {Array}
 */

Growler.prototype.modelNames = function () {
  var names = Object.keys(this.models);
  return names;
}

/*
 * The Growler version
 *
 * @property version
 * @api public
 */

Growler.prototype.version = pkg.version;

/*
 * The Growler constructor
 *
 * The exports of the growler module is an instance of this class.
 *
 * #### Example:
 *
 *     var growler = require('growler');
 *     var growler2 = new growler.Growler();
 *
 * @method Growler
 * @api public
 */

Growler.prototype.Growler = Growler;

/*
 * The Growler [Schema](#schema_Schema) constructor
 *
 * #### Example:
 *
 *     var growler = require('growler');
 *     var Schema = growler.Schema;
 *     var CatSchema = new Schema(..);
 *
 * @method Schema
 * @api public
 */

Growler.prototype.Schema = Schema;

/*
 * The Growler [Model](#model_Model) constructor.
 *
 * @method Model
 * @api public
 */

Growler.prototype.Model = Model;

/*!
 * The exports object is an instance of Growler.
 *
 * @api public
 */
 
var growler = module.exports = exports = new Growler;