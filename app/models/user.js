// user model declaration

// eventually tie in growler db adapter here
var growler    = require('../lib/growler');
var bcrypt     = require('bcrypt-nodejs');
var _          = require('underscore');

// test setup verification
console.log('growler version: ' + growler.version);
// console.log(growler.model('User'));

var userSchema = growler.Schema({
  uid          : String,
  first_name   : String,
  email        : String,
  password     : String,
  phone        : String,
  zipcode      : String,
  birthday     : Number,
  score        : Number
});

// var users = {
// 
//   data: [ {uid: 1, name: 'Dan'},
//           {uid: 2, name: 'Dave'},
//           {uid: 3, name: 'Renee'},
//           {uid: 4, name: 'Sarah'},
//           {uid: 5, name: 'Moby'},
//           {uid: 6, name: 'Roger'},
//           {uid: 7, name: 'Tracey'},
//           {uid: 8, name: 'Cindy'},
//           {uid: 9, name: 'Bob'}  ],
// 
//   all: function() {
//          return this.data;
//        },
//   
//   find: function(id) {
//           // return user from data pool whose id is x
//           return _.findWhere(this.data, {uid: id});
//         }
// }

// methods =================================================================
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = growler.model('User', userSchema);
