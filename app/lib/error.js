/**
 * GrowlerError constructor
 *
 * @param {String} msg Error message
 * @inherits Error https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error
 */

function GrowlerError (msg) {
  Error.call(this);
  Error.captureStackTrace && Error.captureStackTrace(this, arguments.callee);
  this.message = msg;
  this.name = 'GrowlerError';
};

/*!
 * Inherits from Error.
 */

GrowlerError.prototype = Object.create(Error.prototype);
GrowlerError.prototype.constructor = Error;

/*!
 * Module exports.
 */

module.exports = exports = GrowlerError;

/**
 * The default built-in validator error messages.
 *
 * @see Error.messages #error_messages_GrowlerError-messages
 * @api public
 */

// GrowlerError.messages = require('./error/messages');

// backward compat
// GrowlerError.Messages = GrowlerError.messages;

/*!
 * Expose subclasses
 */

// GrowlerError.CastError = require('./error/cast');
// GrowlerError.ValidationError = require('./error/validation')
// GrowlerError.ValidatorError = require('./error/validator')
// GrowlerError.VersionError =require('./error/version')
// GrowlerError.OverwriteModelError = require('./error/overwriteModel')
// GrowlerError.MissingSchemaError = require('./error/missingSchema')
// GrowlerError.DivergentArrayError = require('./error/divergentArray')
