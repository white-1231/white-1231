var express = require('express');

var sessionUtils = require('../utils/sessionUtils');
var router = express.Router();

router.get('/', function(req, res, next) {
    var result = sessionUtils.checkUsefulSession(req.session);

    if(result == 1){
      res.render('home', { title: '个人' });
    }else{
      res.render('login',{title:'首页'})
    }
  });

module.exports = router;