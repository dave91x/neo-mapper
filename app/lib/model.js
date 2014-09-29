/*
 * Model constructor
 *
 * Provides the interface to MongoDB collections as well as creates document instances.
 *
 * @param {Object} doc values with which to create the document
 * @inherits Document
 * @event `error`: If listening to this event, it is emitted when a document was saved without 
 *  passing a callback and an `error` occurred. If not listening, the event bubbles to the connection 
 *  used to create this Model.
 * @event `index`: Emitted after `Model#ensureIndexes` completes. If an error occurred it is passed with the event.
 * @api public
 */
  
function Model () {}

/*
 * The name of the model
 *
 * @api public
 * @property modelName
 */

Model.prototype.modelName;

/*
 * Called when the model compiles.
 *
 * @api private
 */

// Model.init = function init () {
//   if (this.schema.options.autoIndex) {
//     this.ensureIndexes();
//   }
// 
//   this.schema.emit('init', this);
// };

/*
 * Schema the model uses.
 *
 * @property schema
 * @receiver Model
 * @api public
 */

Model.schema;

/*
 * Connection instance the model uses.
 *
 * @property db
 * @receiver Model
 * @api public
 */

Model.db;

/*
 * Base Growler instance the model uses.
 *
 * @property base
 * @receiver Model
 * @api public
 */

Model.base;


/*
 * Finds documents
 *
 * The `conditions` are cast to their respective SchemaTypes before the command is sent.
 *
 * #### Examples:
 *
 *     // named john and at least 18
 *     MyModel.find({ name: 'john', age: { $gte: 18 }});
 *
 *     // executes immediately, passing results to callback
 *     MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});
 *
 *     // name LIKE john and only selecting the "name" and "friends" fields, executing immediately
 *     MyModel.find({ name: /john/i }, 'name friends', function (err, docs) { })
 *
 *     // passing options
 *     MyModel.find({ name: /john/i }, null, { skip: 10 })
 *
 *     // passing options and executing immediately
 *     MyModel.find({ name: /john/i }, null, { skip: 10 }, function (err, docs) {});
 *
 *     // executing a query explicitly
 *     var query = MyModel.find({ name: /john/i }, null, { skip: 10 })
 *     query.exec(function (err, docs) {});
 *
 *     // using the promise returned from executing a query
 *     var query = MyModel.find({ name: /john/i }, null, { skip: 10 });
 *     var promise = query.exec();
 *     promise.addBack(function (err, docs) {});
 *
 * @param {Object} conditions
 * @param {Object} [fields] optional fields to select
 * @param {Object} [options] optional
 * @param {Function} [callback]
 * @return {Query}
 * @see field selection #query_Query-select
 * @see promise #promise-js
 * @api public
 */

Model.find = function find (conditions, fields, options, callback) {
  if ('function' == typeof conditions) {
    callback = conditions;
    conditions = {};
    fields = null;
    options = null;
  } else if ('function' == typeof fields) {
    callback = fields;
    fields = null;
    options = null;
  } else if ('function' == typeof options) {
    callback = options;
    options = null;
  }

  // get the raw mongodb collection object
  var mq = new Query({}, options, this, this.collection);
  mq.select(fields);
  if (this.schema.discriminatorMapping && mq.selectedInclusively()) {
    mq.select(this.schema.options.discriminatorKey);
  }

  return mq.find(conditions, callback);
};

/*
 * Returns all nodes in the database of this model.
 *
 * #### Example:
 *
 *     Adventure.all({ type: 'jungle' }, function (err, results) {
 *       if (err) ..
 *       console.log(results);
 *     });
 *
 * @param {Object} conditions
 * @param {Function} [callback]
 * @return {Query}
 * @api public
 */

Model.all = function all (conditions, callback) {
  if ('function' === typeof conditions)
    callback = conditions, conditions = {};
  
  qstr = "MATCH (n:" + this.modelName + ") RETURN n";
  
  return this.db.query(qstr, callback);
};

/*
 * Finds a single document by id.
 *
 * The `id` is cast based on the Schema before sending the command.
 *
 * #### Example:
 *
 *     // find adventure by id and execute immediately
 *     Adventure.findById(id, function (err, adventure) {});
 *
 *     // same as above
 *     Adventure.findById(id).exec(callback);
 *
 *     // select only the adventures name and length
 *     Adventure.findById(id, 'name length', function (err, adventure) {});
 *
 *     // same as above
 *     Adventure.findById(id, 'name length').exec(callback);
 *
 *     // include all properties except for `length`
 *     Adventure.findById(id, '-length').exec(function (err, adventure) {});
 *
 *     // passing options (in this case return the raw js objects, not mongoose documents by passing `lean`
 *     Adventure.findById(id, 'name', { lean: true }, function (err, doc) {});
 *
 *     // same as above
 *     Adventure.findById(id, 'name').lean().exec(function (err, doc) {});
 *
 * @param {ObjectId|HexId} id objectid, or a value that can be casted to one
 * @param {Object} [fields] optional fields to select
 * @param {Object} [options] optional
 * @param {Function} [callback]
 * @return {Query}
 * @see field selection #query_Query-select
 * @see lean queries #query_Query-lean
 * @api public
 */

Model.findById = function findById (conditions, callback) {
  if ('function' === typeof conditions)
    throw new Error('Have to include conditions for entity ID!');
  
  qstr = "MATCH (n:" + this.modelName + " " + conditions + ") RETURN n";
  console.log(qstr);
  
  return this.db.query(qstr, callback);
};

/*
 * Updates a single node by id.
 *
 * @api public
 */

Model.update = function update (conditions, callback) {
  if ('function' === typeof conditions)
    throw new Error('Have to include update conditions for entity ID!');
  
  console.log(conditions);
  
  var nodeUid = conditions.uid;
  delete conditions.uid;
  
  console.log(nodeUid + ":  " + JSON.stringify(conditions));
  // match (n:User) WHERE id(n)=1087 SET n += {score: 51, birthday: 1951};
  // var operation = this.db.operation('node/' + nodeId + '/properties', 'PUT', conditions);
  // return this.db.call(operation, callback);
  
  qstr = "MATCH (n:" + this.modelName + ") WHERE n.uid='" + nodeUid + "' SET n += " + conditions;
  console.log(qstr);
  
  return this.db.query(qstr, callback);
};

/*
 * Finds one document.
 *
 * The `conditions` are cast to their respective SchemaTypes before the command is sent.
 *
 * #### Example:
 *
 *     // find one iphone adventures - iphone adventures??
 *     Adventure.findOne({ type: 'iphone' }, function (err, adventure) {});
 *
 *     // same as above
 *     Adventure.findOne({ type: 'iphone' }).exec(function (err, adventure) {});
 *
 *     // select only the adventures name
 *     Adventure.findOne({ type: 'iphone' }, 'name', function (err, adventure) {});
 *
 *     // same as above
 *     Adventure.findOne({ type: 'iphone' }, 'name').exec(function (err, adventure) {});
 *
 *     // specify options, in this case lean
 *     Adventure.findOne({ type: 'iphone' }, 'name', { lean: true }, callback);
 *
 *     // same as above
 *     Adventure.findOne({ type: 'iphone' }, 'name', { lean: true }).exec(callback);
 *
 *     // chaining findOne queries (same as above)
 *     Adventure.findOne({ type: 'iphone' }).select('name').lean().exec(callback);
 *
 * @param {Object} conditions
 * @param {Object} [fields] optional fields to select
 * @param {Object} [options] optional
 * @param {Function} [callback]
 * @return {Query}
 * @see field selection #query_Query-select
 * @see lean queries #query_Query-lean
 * @api public
 */

Model.findOne = function findOne (conditions, fields, options, callback) {
  if ('function' == typeof options) {
    callback = options;
    options = null;
  } else if ('function' == typeof fields) {
    callback = fields;
    fields = null;
    options = null;
  } else if ('function' == typeof conditions) {
    callback = conditions;
    conditions = {};
    fields = null;
    options = null;
  }

  // get the mongodb collection object
  var mq = new Query({}, options, this, this.collection);
  mq.select(fields);
  if (this.schema.discriminatorMapping && mq.selectedInclusively()) {
    mq.select(this.schema.options.discriminatorKey);
  }

  return mq.findOne(conditions, callback);
};

/*
 * Counts number of matching documents in a database collection.
 *
 * #### Example:
 *
 *     Adventure.count({ type: 'jungle' }, function (err, count) {
 *       if (err) ..
 *       console.log('there are %d jungle adventures', count);
 *     });
 *
 * @param {Object} conditions
 * @param {Function} [callback]
 * @return {Query}
 * @api public
 */

Model.count = function count (conditions, callback) {
  // if ('function' === typeof conditions)
  //   callback = conditions, conditions = {};

  // get the mongodb collection object
  // var mq = new Query({}, {}, this, this.collection);

  // return mq.count(conditions, callback);
  return undefined;
};

/*!
 * Compiler utility.
 *
 * @param {String} name model name
 * @param {Schema} schema
 * @param {String} collectionName
 * @param {Connection} connection
 * @param {Mongoose} base mongoose instance
 */

Model.compile = function compile (name, schema, connection, base) {
  // var versioningEnabled = false !== schema.options.versionKey;

  // if (versioningEnabled && !schema.paths[schema.options.versionKey]) {
  //   // add versioning to top level documents only
  //   var o = {};
  //   o[schema.options.versionKey] = Number;
  //   schema.add(o);
  // }

  // generate new class
  function model (doc, fields, skipId) {
    if (!(this instanceof model))
      return new model(doc, fields, skipId);
    Model.call(this, doc, fields, skipId);
  };

  model.base = base;
  model.modelName = name;
  model.__proto__ = Model;
  model.prototype.__proto__ = Model.prototype;
  model.model = Model.prototype.model;
  model.db = model.prototype.db = connection;
  // model.discriminators = model.prototype.discriminators = undefined;

  // model.prototype.$__setSchema(schema);

  // var collectionOptions = {
  //     bufferCommands: schema.options.bufferCommands
  //   , capped: schema.options.capped
  // };

  // model.prototype.collection = connection.collection(
  //     collectionName
  //   , collectionOptions
  // );

  // apply methods
  for (var i in schema.methods) {
    if (typeof schema.methods[i] === 'function') {
      model.prototype[i] = schema.methods[i];
    } else {
      (function(_i) {
        Object.defineProperty(model.prototype, _i, {
          get: function() {
            var h = {};
            for (var k in schema.methods[_i]) {
              h[k] = schema.methods[_i][k].bind(this);
            }
            return h;
          }
        });
      })(i);
    }
  }

  for (var i in schema.methods)
    model.prototype[i] = schema.methods[i];

  // apply statics
  for (var i in schema.statics)
    model[i] = schema.statics[i];

  model.schema = model.prototype.schema;
  model.options = model.prototype.options;
  // model.collection = model.prototype.collection;

  return model;
};

/*!
 * Module exports.
 */

module.exports = exports = Model;