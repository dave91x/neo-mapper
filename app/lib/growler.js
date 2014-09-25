// db (Neo4j via seraph npm)
var neoDb   = require("seraph")();
var Model   = require('./model');
var Schema  = require('./schema');

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
  // this.modelSchemas = {};
  // default global options
  this.options = {
    pluralization: true
  };
  // var conn = this.createConnection(); // default connection
  // conn.models = this.models;
}


Growler.prototype.Model  = Model;

Growler.prototype.Schema = Schema;


var growler = module.exports = exports = new Growler;