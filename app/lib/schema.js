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
 *     var Tree = growler.model('Tree', schema);
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
    , _id: true
    , id: true
    // , pluralization: true  // only set this to override the global option
  }, options);

  // if (options.read) {
  //   options.read = utils.readPref(options.read);
  // }

  return options;
};

/*
 * Adds an instance method to documents constructed from Models compiled from this schema.
 *
 * #### Example
 *
 *     var schema = kittySchema = new Schema(..);
 *
 *     schema.method('meow', function () {
 *       console.log('meeeeeoooooooooooow');
 *     })
 *
 *     var Kitty = growler.model('Kitty', schema);
 *
 *     var fizz = new Kitty;
 *     fizz.meow(); // meeeeeooooooooooooow
 *
 * If a hash of name/fn pairs is passed as the only argument, each name/fn pair will be added as methods.
 *
 *     schema.method({
 *         purr: function () {}
 *       , scratch: function () {}
 *     });
 *
 *     // later
 *     fizz.purr();
 *     fizz.scratch();
 *
 * @param {String|Object} method name
 * @param {Function} [fn]
 * @api public
 */

Schema.prototype.method = function (name, fn) {
  if ('string' != typeof name)
    for (var i in name)
      this.methods[i] = name[i];
  else
    this.methods[name] = fn;
  return this;
};

/*
 * Sets/gets a schema option.
 *
 * @param {String} key option name
 * @param {Object} [value] if not passed, the current option value is returned
 * @api public
 */

Schema.prototype.set = function (key, value, _tags) {
  if (1 === arguments.length) {
    return this.options[key];
  }

  switch (key) {
    case 'read':
      // this.options[key] = utils.readPref(value, _tags)
      break;
    case 'safe':
      this.options[key] = false === value
        ? { w: 0 }
        : value
      break;
    default:
      this.options[key] = value;
  }

  return this;
}

/*
 * Gets a schema option.
 *
 * @param {String} key option name
 * @api public
 */

Schema.prototype.get = function (key) {
  return this.options[key];
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

/*
 * Reserved document keys.
 *
 * Keys in this object are names that are rejected in schema declarations b/c they conflict 
 * with growler functionality. Using these key name will throw an error.
 *
 *      on, emit, _events, db, get, set, init, isNew, errors, schema, options, modelName, collection, _pres, _posts, toObject
 *
 * _NOTE:_ Use of these terms as method names is permitted, but play at your own risk, as they may 
 *  be existing growler document methods you are stomping on.
 *
 *      var schema = new Schema(..);
 *      schema.methods.init = function () {} // potentially breaking
 */

Schema.reserved = Object.create(null);
var reserved = Schema.reserved;
reserved.on =
reserved.db =
reserved.set =
reserved.get =
reserved.init =
reserved.isNew =
reserved.errors =
reserved.schema =
reserved.options =
reserved.modelName =
reserved.collection =
reserved.toObject =
reserved.domain =
reserved.emit =    // EventEmitter
reserved._events = // EventEmitter
reserved._pres = reserved._posts = 1 // hooks.js

/*
 * Gets/sets schema paths.
 *
 * Sets a path (if arity 2)
 * Gets a path (if arity 1)
 *
 * ####Example
 *
 *     schema.path('name') // returns a SchemaType
 *     schema.path('name', Number) // changes the schemaType of `name` to Number
 *
 * @param {String} path
 * @param {Object} constructor
 * @api public
 */
 
Schema.prototype.path = function (path, obj) {
  if (obj == undefined) {
    if (this.paths[path]) return this.paths[path];
    if (this.subpaths[path]) return this.subpaths[path];

    // subpaths?
    return /\.\d+\.?.*$/.test(path)
      ? getPositionalPath(this, path)
      : undefined;
  }

  // some path names conflict with document methods
  if (reserved[path]) {
    throw new Error("`" + path + "` may not be used as a schema pathname");
  }

  // update the tree
  var subpaths = path.split(/\./)
    , last = subpaths.pop()
    , branch = this.tree;

  subpaths.forEach(function(sub, i) {
    if (!branch[sub]) branch[sub] = {};
    if ('object' != typeof branch[sub]) {
      var msg = 'Cannot set nested path `' + path + '`. '
              + 'Parent path `'
              + subpaths.slice(0, i).concat([sub]).join('.')
              + '` already set to type ' + branch[sub].name
              + '.';
      throw new Error(msg);
    }
    branch = branch[sub];
  });

  branch[last] = utils.clone(obj);

  this.paths[path] = obj;  // Schema.interpretAsType(path, obj);
  return this;
};

/*
 * Converts type arguments into Mongoose/Growler Types.
 *
 * @param {String} path
 * @param {Object} obj constructor
 * @api private
 */

Schema.interpretAsType = function (path, obj) {
  // if (obj.constructor) {
  //   var constructorName = utils.getFunctionName(obj.constructor);
  //   if (constructorName != 'Object') {
  //     obj = { type: obj };
  //   }
  // }
  return obj.constructor;
};

/**
 * Iterates the schemas paths similar to Array#forEach.
 *
 * The callback is passed the pathname and schemaType as arguments on each iteration.
 *
 * @param {Function} fn callback function
 * @return {Schema} this
 * @api public
 */

Schema.prototype.eachPath = function (fn) {
  var keys = Object.keys(this.paths)
    , len = keys.length;

  for (var i = 0; i < len; ++i) {
    fn(keys[i], this.paths[keys[i]]);
  }

  return this;
};

/**
 * Returns an Array of path strings that are required by this schema.
 *
 * @api public
 * @return {Array}
 */

Schema.prototype.requiredPaths = function requiredPaths () {
  if (this._requiredpaths) return this._requiredpaths;

  var paths = Object.keys(this.paths)
    , i = paths.length
    , ret = [];

  while (i--) {
    var path = paths[i];
    if (this.paths[path].isRequired) ret.push(path);
  }

  return this._requiredpaths = ret;
}

/**
 * Returns indexes from fields and schema-level indexes (cached).
 *
 * @api private
 * @return {Array}
 */

Schema.prototype.indexedPaths = function indexedPaths () {
  if (this._indexedpaths) return this._indexedpaths;

  return this._indexedpaths = this.indexes();
}

/**
 * Returns the pathType of `path` for this schema.
 *
 * Given a path, returns whether it is a real, virtual, nested, or ad-hoc/undefined path.
 *
 * @param {String} path
 * @return {String}
 * @api public
 */

Schema.prototype.pathType = function (path) {
  if (path in this.paths) return 'real';
  if (path in this.virtuals) return 'virtual';
  if (path in this.nested) return 'nested';
  if (path in this.subpaths) return 'real';

  if (/\.\d+\.|\.\d+$/.test(path) && getPositionalPath(this, path)) {
    return 'real';
  } else {
    return 'adhocOrUndefined'
  }
};

/*!
 * ignore
 */

function getPositionalPath (self, path) {
  var subpaths = path.split(/\.(\d+)\.|\.(\d+)$/).filter(Boolean);
  if (subpaths.length < 2) {
    return self.paths[subpaths[0]];
  }

  var val = self.path(subpaths[0]);
  if (!val) return val;

  var last = subpaths.length - 1
    , subpath
    , i = 1;

  for (; i < subpaths.length; ++i) {
    subpath = subpaths[i];

    if (i === last && val && !val.schema && !/\D/.test(subpath)) {
      if (val instanceof MongooseTypes.Array) {
        // StringSchema, NumberSchema, etc
        val = val.caster;
      } else {
        val = undefined;
      }
      break;
    }

    // ignore if its just a position segment: path.0.subpath
    if (!/\D/.test(subpath)) continue;

    if (!(val && val.schema)) {
      val = undefined;
      break;
    }

    val = val.schema.path(subpath);
  }

  return self.subpaths[path] = val;
}


/*!
 * Module exports.
 */
 
module.exports = exports = Schema;