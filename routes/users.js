var express   = require('express');
var router    = express.Router();

var User      = require('../app/models/user');

/* GET users listing. */
router.get('/', function(req, res) {
  
  newUser = new User();
  console.log(newUser.testUser('raygun'));
  var users = [];
  User.all(function(err, results) {
    users = results;
    res.render('users', { title: 'User List', users: users, userCount: users.length });
  });
});

router.get('/:uid', function(req, res) {
  User.findById("{ uid: '" + req.param('uid') + "' }", function(err, results) {
    console.log(results[0]);
    res.render('user', { title: 'User Profile', user: results[0] });
  });
});

router.post('/:uid', function(req, res) {
  // console.log(req.body);
  var updates = req.body;
  updates.id = parseInt(updates.id);
  // console.log(updates);
  
  User.update(updates, function(err) {
    if (err) throw err;
    
    res.redirect('/users');
  });
});

module.exports = router;

// 08e45e37-2fc8-47ee-b5f5-bce29b771c92   Dave
