var express = require('express');
var debug = require('debug')('mytk:index');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('demo', { title: 'Express' });
});

router.get('/session',function(req, res, next){
  res.send(req.session);
  res.end();
})

module.exports = router;
