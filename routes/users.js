var express   = require('express');
var router    = express.Router();

var User      = require('../app/models/user');

/* GET users listing. */
router.get('/', function(req, res) {
  // res.render('users', { title: 'User List', users: User.all(), userX: User.find(9) });
  res.render('users', { title: 'User List', userCount: User.count() });
});

module.exports = router;
