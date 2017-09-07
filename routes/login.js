var express = require('express');
var debug = require('debug')('mytk:index');

var crypto = require('../utils/cryptoUtils');
var sessionUtils = require('../utils/sessionUtils');
var userdb = require('../models/user/userdb');

var router = express.Router();

router.get('/', function(req, res, next) {

  var result = sessionUtils.checkUsefulSession(req.session);

  if(result == 1){
    res.render('home', { title: '主页' });  
  }else if(result == -1){
    res.render('login', { title: '首页' });
  }else if(result == -2){
    userdb.getuser_byaccount(req.session.user.account,function(ret){
      if(!ret){
        res.render('login', { title: '首页' });
      }else{
        var user = ret[0];
        delete user.password;
        req.session.user = user;
        req.session.sign = true;
        res.render('home', { title: '主页' });  
      }
    });
  }
});

router.post('/signIn',function(req,res){
  var submitData = req.body;
  var $account = submitData.account;
  var $password = submitData.password;
  
  if (!/^[a-zA-Z0-9]{6,16}$/.test($account) || $account === 'admin') {//直接拒绝admin账号
    return res.json({ error: "用户名只能是6-16位英文字母+数字" });
  }
  
  if (!/^[a-zA-Z0-9]{6,16}$/.test($password)) {
    return res.json({ error: "密码只能是6-16位英文字母+数字" });
  } 

  userdb.getuser_byaccount($account,function(ret){
    if(!ret){
      return res.json({success:false,msg:'该账号已存在'});
    }else{
      var user = ret[0];
      var pwd = crypto.md5($password);
      if(pwd == user.password){

        delete user.password;
        req.session.user = user;
        req.session.sign = true;

        return res.json({success:true,msg:'success'});
      }else{
        return res.json({success:false,msg:'该账号已存在'});
      }
    }
  });
})

router.get('/logOut',function(req, res, next){
  delete req.session.user;
  delete req.session.sign;

  res.render('login', { title: '首页' });
});

module.exports = router;
