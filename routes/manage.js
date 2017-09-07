var express = require('express');
var debug = require('debug')('mytk:index');

var userdb = require('../models/user/userdb');
var sessionUtils = require('../utils/sessionUtils');
var router = express.Router();

router.get('/', function (req, res, next) {
  var result = sessionUtils.checkUsefulSession(req.session);

  if (result == 1) {
    res.render('manage', { title: '管理' });
  } else {
    res.render('login', { title: '首页' })
  }

});

router.post('/getAllUser', function(req, res) {
  var queryData = req.body;
  var order = queryData.order;
  var offset = queryData.offset;
  var limit = queryData.limit;

  userdb.get_usertotal(function(count){

    if(count == 0){
      return res.json({total:count,rows:null});
    }

    userdb.get_alluser(order,offset,limit,function(ret){
      if(ret){
        return res.json({total:count,rows:ret});
      }
    });

  });


  
});

module.exports = router;