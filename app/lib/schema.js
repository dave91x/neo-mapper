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
}

module.exports = Schema;