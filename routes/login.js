var express = require('express');
var debug = require('debug')('mytk:index');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Sign In' });
});

module.exports = router;
