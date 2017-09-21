var express = require('express');
var debug = require('debug')('mytk:index');

var crypto = require('../utils/cryptoUtils');
var sessionUtils = require('../utils/sessionUtils');

var userdb = require('../models/user/userdb');
var permissiondb = require('../models/permission/permissiondb');

var router = express.Router();

router.get('/', function(req, res, next) {

  var result = sessionUtils.checkUsefulSession(req.session);

  if(result == 1){
    res.render('home', { title: '个人主页' });  
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

        //权限查询
        permissiondb.get_by_id(user.id,function(data){
          var permission = [0,0,0,0,0,0];;
          if(data == -1 || data == 0){
            //无权限，不操作
          }else {
            for(var i = 0 ;i <data.length ; i++){
              var temp = data[i];
              permission[parseInt(temp.pid)] = 1;
            }
          }
          req.session.permission = permission;

          res.render('home', { title: '个人主页' });
        }); 
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
      return res.json({success:false,msg:'帐号密码不匹配'});
    }else{
      var user = ret[0];
      var pwd = crypto.md5($password);

      if(pwd == user.password){

        delete user.password;
        req.session.user = user;
        req.session.sign = true;

        //权限查询
        permissiondb.get_by_id(user.id,function(data){
          var permission = [0,0,0,0,0,0];;
          if(data == -1 || data == 0){
            //无权限，不操作
          }else {
            for(var i = 0 ;i <data.length ; i++){
              var temp = data[i];
              permission[parseInt(temp.pid)] = 1;
            }
          }
          req.session.permission = permission;

          return res.json({success:true,msg:'success'});
        });
      }else{
        return res.json({success:false,msg:'帐号密码不匹配'});
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
