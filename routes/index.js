var express = require('express');
var router = express.Router();
var userService = require('../user_service');

async function getMenus() {
  var menus;
  await userService.firebase.database().ref(`/users/${userService.firebase.auth().currentUser.uid}/menus`)
    .once('value')
    .then((snapshot) => {
      menus = snapshot.val();
    })
  return menus
};


/* GET users listing. */
router.get('/', function(req, res, next) {
  var signedIn = false;
  if (userService.firebase.auth().currentUser != null) {
    res.render('index', {
      title: 'TasteBytes - POS',
      styles: ['style.css', 'receipt.css'],
      javascript: ['index.js', 'timer.js', 'menus.js', 'storage_helper.js']
    });
  } else {
    res.render('login', {
      title: 'TasteBytes - POS',
      styles: ['auth.css'],
      javascript: ['login.js']
    });
  }
});

/* GET users listing. */
router.get('/:tableNumber', function(req, res, next) {
  var signedIn = false;
  var menus;
  var tableNumber = req.params.tableNumber;
  if (userService.firebase.auth().currentUser != null) {
    getMenus()
      .then(menus => {
        res.render('menus', {
          signedIn: signedIn,
          menus: menus,
          tableNumber: tableNumber,
          title: 'POS - Menus',
          styles: ['style.css', 'receipt.css'],
          javascript: ['menus.js', 'storage_helper.js', 'timer.js']
        })
      })
  } else {
    res.render('login', {
      title: 'TasteBytes - POS',
      styles: ['auth.css'],
      javascript: ['login.js']
    });
  }
});

module.exports = router;
