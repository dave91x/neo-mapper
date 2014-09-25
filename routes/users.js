var express   = require('express');
var router    = express.Router();

var User      = require('../app/models/user');

/* GET users listing. */
router.get('/', function(req, res) {
  // console.log(User.all);
  res.render('users', { title: 'User List', users: User.all(), userX: User.find(9) });
});

module.exports = router;
