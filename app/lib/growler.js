// db (Neo4j via seraph npm)
var neoDb   = require("seraph")();
var Model   = require('./model');
var Schema  = require('./schema');
var pkg     = require('./package.json');

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
 
Growler.prototype.model  = function (name, schema) {
  
  return this.models[name] = model;
};

/*
 * Returns an array of model names created on this instance of Mongoose.
 *
 * #### Note:
 *
 * _Does not include names of models created using `connection.model()`._
 *
 * @api public
 * @return {Array}
 */

Mongoose.prototype.modelNames = function () {
  var names = Object.keys(this.models);
  return names;
}

/*
 * The Mongoose version
 *
 * @property version
 * @api public
 */

Mongoose.prototype.version = pkg.version;

/*
 * The Mongoose constructor
 *
 * The exports of the mongoose module is an instance of this class.
 *
 * #### Example:
 *
 *     var mongoose = require('mongoose');
 *     var mongoose2 = new mongoose.Mongoose();
 *
 * @method Mongoose
 * @api public
 */

Mongoose.prototype.Mongoose = Mongoose;

/*
 * The Mongoose [Schema](#schema_Schema) constructor
 *
 * #### Example:
 *
 *     var mongoose = require('mongoose');
 *     var Schema = mongoose.Schema;
 *     var CatSchema = new Schema(..);
 *
 * @method Schema
 * @api public
 */

Growler.prototype.Schema = Schema;

/*!
 * The exports object is an instance of Mongoose.
 *
 * @api public
 */
 
var growler = module.exports = exports = new Growler;