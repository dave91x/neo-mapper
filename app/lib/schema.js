/*!
 * Module dependencies.
 */

var utils = require('./utils');


/*
 * Schema constructor.
 *
 * #### Example:
 *
 *     var child = new Schema({ name: String });
 *     var schema = new Schema({ name: String, age: Number, children: [child] });
 *     var Tree = mongoose.model('Tree', schema);
 *
 *     // setting schema options
 *     new Schema({ name: String }, { _id: false, autoIndex: false })
 *
 * #### Options:
 *
 * - [autoIndex](/docs/guide.html#autoIndex): bool - defaults to true
 * - [bufferCommands](/docs/guide.html#bufferCommands): bool - defaults to true
 * - [capped](/docs/guide.html#capped): bool - defaults to false
 * - [collection](/docs/guide.html#collection): string - no default
 * - [id](/docs/guide.html#id): bool - defaults to true
 * - [_id](/docs/guide.html#_id): bool - defaults to true
 * - `minimize`: bool - controls [document#toObject](#document_Document-toObject) behavior when called manually - defaults to true
 * - [read](/docs/guide.html#read): string
 * - [safe](/docs/guide.html#safe): bool - defaults to true.
 * - [shardKey](/docs/guide.html#shardKey): bool - defaults to `null`
 * - [strict](/docs/guide.html#strict): bool - defaults to true
 * - [toJSON](/docs/guide.html#toJSON) - object - no default
 * - [toObject](/docs/guide.html#toObject) - object - no default
 * - [validateBeforeSave](/docs/guide.html#validateBeforeSave) - bool - defaults to `true`
 * - [versionKey](/docs/guide.html#versionKey): bool - defaults to "__v"
 *
 * #### Note:
 *
 * When nesting schemas, (`children` in the example above), always declare the child schema first before passing it into is parent.
 *
 * @param {Object} definition
 * @inherits NodeJS EventEmitter http://nodejs.org/api/events.html#events_class_events_eventemitter
 * @event `init`: Emitted after the schema is compiled into a `Model`.
 * @api public
 */

function Schema (obj, options) {
  if (!(this instanceof Schema))
    return new Schema(obj, options);

  this.paths = {};
  this.subpaths = {};
  this.virtuals = {};
  this.nested = {};
  this.inherits = {};
  this.callQueue = [];
  this._indexes = [];
  this.methods = {};
  this.statics = {};
  this.tree = {};
  this._requiredpaths = undefined;
  this.discriminatorMapping = undefined;
  this._indexedpaths = undefined;

  this.options = this.defaultOptions(options);

  // build paths
  if (obj) {
    this.add(obj);
  }

  // ensure the documents get an auto _id unless disabled
  //var auto_id = !this.paths['_id'] && (!this.options.noId && this.options._id);
  //if (auto_id) {
  //  this.add({ _id: {type: Schema.ObjectId, auto: true} });
  //}

  // ensure the documents receive an id getter unless disabled
  //var autoid = !this.paths['id'] && (!this.options.noVirtualId && this.options.id);
  //if (autoid) {
  //  this.virtual('id').get(idGetter);
  //}

  // adds updatedAt and createdAt timestamps to documents if enabled
  //var timestamps = this.options.timestamps;
  //if (timestamps) {
  //  var createdAt = timestamps.createdAt || 'createdAt'
  //    , updatedAt = timestamps.updatedAt || 'updatedAt'
  //    , schemaAdditions = {};
  //
  //  schemaAdditions[updatedAt] = Date;
  //
  //  if (!this.paths[createdAt]) {
  //    schemaAdditions[createdAt] = Date;
  //  }
  //
  //  this.add(schemaAdditions);
  //
  //  this.pre('save', function (next) {
  //    var defaultTimestamp = new Date();
  //
  //    if (!this[createdAt]){
  //      this[createdAt] = auto_id ? this._id.getTimestamp() : defaultTimestamp;
  //    }
  //
  //    this[updatedAt] = this.isNew ? this[createdAt] : defaultTimestamp;
  //
  //    next();
  //  });
  //}
};

/*
 * Returns default options for this schema, merged with `options`.
 *
 * @param {Object} options
 * @return {Object}
 * @api private
 */

Schema.prototype.defaultOptions = function (options) {
  if (options && false === options.safe) {
    options.safe = { w: 0 };
  }

  if (options && options.safe && 0 === options.safe.w) {
    // if you turn off safe writes, then versioning goes off as well
    options.versionKey = false;
  }

  options = utils.options({
      strict: true
    , bufferCommands: true
    , capped: false // { size, max, autoIndexId }
    , versionKey: '__v'
    , discriminatorKey: '__t'
    , minimize: true
    , autoIndex: true
    , shardKey: null
    , read: null
    , validateBeforeSave: true
    // the following are only applied at construction time
    , noId: false // deprecated, use { _id: false }
    , _id: true
    , noVirtualId: false // deprecated, use { id: false }
    , id: true
//    , pluralization: true  // only set this to override the global option
  }, options);

  if (options.read) {
    options.read = utils.readPref(options.read);
  }

  return options;
};

/*
 * Adds key path / schema type pairs to this schema.
 *
 * #### Example:
 *
 *     var ToySchema = new Schema;
 *     ToySchema.add({ name: 'string', color: 'string', price: 'number' });
 *
 * @param {Object} obj
 * @param {String} prefix
 * @api public
 */

Schema.prototype.add = function add (obj, prefix) {
  prefix = prefix || '';
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];

    if (null == obj[key]) {
      throw new TypeError('Invalid value for schema path `'+ prefix + key +'`');
    }

    if (utils.isObject(obj[key]) && (!obj[key].constructor || 'Object' == utils.getFunctionName(obj[key].constructor)) && (!obj[key].type || obj[key].type.type)) {
      if (Object.keys(obj[key]).length) {
        // nested object { last: { name: String }}
        this.nested[prefix + key] = true;
        this.add(obj[key], prefix + key + '.');
      } else {
        this.path(prefix + key, obj[key]); // mixed type
      }
    } else {
      this.path(prefix + key, obj[key]);
    }
  }
};

/*!
 * Module exports.
 */
 
module.exports = exports = Schema;