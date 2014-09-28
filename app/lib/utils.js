/*!
 * Module dependencies.
 */

/*!
* Shallow copies defaults into options.
*
* @param {Object} defaults
* @param {Object} options
* @return {Object} the merged object
* @api private
*/

exports.options = function (defaults, options) {
 var keys = Object.keys(defaults)
   , i = keys.length
   , k ;

 options = options || {};

 while (i--) {
   k = keys[i];
   if (!(k in options)) {
     options[k] = defaults[k];
   }
 }

 return options;
};

/*!
 * Generates a random string
 *
 * @api private
 */

exports.random = function () {
  return Math.random().toString().substr(3);
};

/*!
 * Merges `from` into `to` without overwriting existing properties.
 *
 * @param {Object} to
 * @param {Object} from
 * @api private
 */

exports.merge = function merge (to, from) {
  var keys = Object.keys(from)
    , i = keys.length
    , key;

  while (i--) {
    key = keys[i];
    if ('undefined' === typeof to[key]) {
      to[key] = from[key];
    } else if (exports.isObject(from[key])) {
      merge(to[key], from[key]);
    }
  }
};

/*!
 * toString helper
 */

var toString = Object.prototype.toString;

/*!
 * Determines if `arg` is an object.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @api private
 * @return {Boolean}
 */

exports.isObject = function (arg) {
  return '[object Object]' == toString.call(arg);
}
