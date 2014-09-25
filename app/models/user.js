// user model declaration
// console.log('User model declaration');

// eventually tie in schema and model file here
// var model = require('../lib/model.js');
// var schema  = require('../lib/schema.js');

// console.log(model('dave'));

var _ = require('underscore');

var users = {

  data: [ {uid: 1, name: 'Dan'},
          {uid: 2, name: 'Dave'},
          {uid: 3, name: 'Amy'},
          {uid: 4, name: 'Sarah'},
          {uid: 5, name: 'Miranda'},
          {uid: 6, name: 'Roger'},
          {uid: 7, name: 'Tracey'},
          {uid: 8, name: 'Cindy'},
          {uid: 9, name: 'Bob'}  ],

  all: function() {
         return this.data;
       },

  find: function(id) {
          // return user from data pool whose id is x
          return _.findWhere(this.data, {uid: id});
        }
}

module.exports = users;
