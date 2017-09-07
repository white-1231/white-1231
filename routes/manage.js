var express = require('express');
var debug = require('debug')('mytk:index');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('manage', { title: '管理' });
});

module.exports = router;