var express = require('express');
var debug = require('debug')('mytk:index');

var sessionUtils = require('../utils/sessionUtils');
var userdb = require('../models/user/userdb');
var permissiondb = require('../models/permission/permissiondb');

var router = express.Router();

/**
 * 进入管理页
 */
router.get('/', function (req, res, next) {
  var result = sessionUtils.checkUsefulSession(req.session);

  if (result == 1) {
    res.render('manage', { title: '管理' });
  } else {
    res.render('login', { title: '首页' })
  }

});

/**
 * AJAX
 * 获取全部用户，分页
 */
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

/**
 * 用户信息更新
 */
router.post('/userUpdate',function(req,res){
  var submitData = req.body;
  var $id = submitData.id;
  var $nickname = submitData.nickname;
  var $tel = submitData.tel;
  var $email = submitData.email;
  var $state = submitData.state;
  var $permission = submitData.permission;

  $permission =JSON.parse($permission);

  if (!/^(13[0-9]|14[5|7]|15\d|18\d)\d{8}$/.test($tel)) {
    return res.json({ error: "手机号无法接受" });
  }
  if (!/^[a-zA-z0-9]+@[a-zA-z0-9]+(\.[a-zA-z0-9]+)+$/.test($email)) {
    return res.json({ error: "邮箱无法接受" });
  }

  //修改权限
  if($permission.add.length >0){
    permissiondb.add_pms($id,$permission.add);
  }
  if($permission.del.length >0){
    permissiondb.del_pms($id,$permission.del.join(','));
  }

  userdb.update_UserByID($id,$tel,$email,$state,$nickname,function(ret){
    
    if(ret){
      return res.json({success:true,msg:'success'});
    }else{
      return res.json({success:false,msg:'db error'});
    }
  });  

})

/**
 * 获取个人权限
 */
router.get('/getpermission', function (req, res) {
  
  var $id = req.query.uid;

  console.log($id);

  permissiondb.get_by_id($id, function (data) {
    var permission = [0, 0, 0, 0, 0, 0];;
    if (data == -1 || data == 0) {
      //无权限，不操作
    } else {
      for (var i = 0; i < data.length; i++) {
        var temp = data[i];
        permission[parseInt(temp.pid)] = 1;
      }
    }
    return res.json({data:permission});
  });
});

module.exports = router;