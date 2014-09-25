var express   = require('express');
var router    = express.Router();

var User      = require('../app/models/user');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('users', { title: 'Neo4j Mapper', User.all });
});

module.exports = router;
