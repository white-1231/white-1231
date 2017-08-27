var express = require('express');

var userdb = require('../models/user/userdb');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('闯入未知区域');
});

/**
 * 注册
 */
router.post('/reg', function (req, res) {
  var submitData = req.body;
  var $account = submitData.account;
  var $password = submitData.password;
  var $tel = submitData.tel;
  var $email = submitData.email;
  
  if (!/^[a-zA-Z0-9]{6,16}$/.test($account) || $account === 'admin') {//直接拒绝admin账号
    return res.json({ error: "用户名只能是6-16位英文字母+数字" });
  }
  if (!/^(13[0-9]|14[5|7]|15\d|18\d)\d{8}$/.test($tel)) {
    return res.json({ error: "手机号无法接受" });
  }
  if (!/^[a-zA-z0-9]+@[a-zA-z0-9]+(\.[a-zA-z0-9]+)+$/.test($email)) {
    return res.json({ error: "邮箱无法接受" });
  }
  if (!/^[a-zA-Z0-9]{6,16}$/.test($password)) {
    return res.json({ error: "密码只能是6-16位英文字母+数字" });
  } 

  userdb.is_account_exist($account,function(ret){
    if(!ret){
      userdb.create_account($account,$password,$tel,$email,function(ret){
        if(ret){
          return res.json({success:true,msg:'success'});
        }else{
          return res.json({success:false,msg:'db operate error'});
        }
      });
    }else{
      return res.json({success:false,msg:'该账号已存在'});
    }


  });
  
});

module.exports = router;
