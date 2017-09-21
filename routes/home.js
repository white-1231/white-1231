var express = require('express');

var sessionUtils = require('../utils/sessionUtils');

var missiondb = require('../models/mission/missiondb');

var router = express.Router();

router.get('/', function (req, res, next) {
  var result = sessionUtils.checkUsefulSession(req.session);

  if (result == 1) {
    res.render('home', { title: '个人主页' });
  } else {
    res.render('login', { title: '首页' })
  }
});

router.get('/getOwnerMS',function(req,res){
  var result = sessionUtils.checkUsefulSession(req.session);
  if (result == 1) {
    var user = req.session.user;

    missiondb.getMS_byOwner(user.id,function(ret){
      var dataArr = [];

      for(var i = 0;i<ret.length;i++){
        dataArr.push(ret[i]);
      }

      return res.json(dataArr);
    })

  } else {
    return res.json([{}]);
  }
})

router.get('/markStaus',function(req,res){
  var result = sessionUtils.checkUsefulSession(req.session);
  if (result == 1) {
    var id = req.query.id;
    var status = req.query.status;

    var nowtime = Math.floor(new Date().getTime()/1000);

    missiondb.update_MSstatus_byid(id,status,nowtime,function(ret){
      if(ret){
        return res.json({success:true,msg:'success'});
      }else{
        return res.json({success:false,msg:'db error'});
      }
    });

  } else {
    return res.json({success:false,msg:'user not sign in'});
  }
})

module.exports = router;