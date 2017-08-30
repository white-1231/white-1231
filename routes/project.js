
var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('project', { title: '项目' });
  });

module.exports = router;