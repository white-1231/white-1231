
var express = require('express');

var sessionUtils = require('../utils/sessionUtils');

var missiondb = require('../models/mission/missiondb');

var router = express.Router();

router.post('/add',function(req,res){
    var result = sessionUtils.checkUsefulSession(req.session);

    if (result == 1) {
        var submitData = req.body;
        var $name = submitData.name;
        var $pstime = submitData.pstime;
        var $petime = submitData.petime;
        var $type = submitData.type;
        var $vid = submitData.vid;
        var $did = submitData.did;
        var $desc = submitData.desc;
        var $pid = submitData.pid;

        missiondb.add_mission($name,$pstime,$petime,$type,$vid,$did,$desc,$pid,function(ret){
            if(ret){
                return res.json({success:true, msg:'add success'});
            }else{
                return res.json({success:false,msg:'db operate error'}); 
            } 
        });
    }else{
        return res.json({success:false,msg:'user not sign in'});
    }
});

router.get('/getMS',function(req,res){
    var queryData = req.query;
    var order = queryData.order;
    var offset = queryData.offset;
    var limit = queryData.limit;
    var pid = queryData.pid;
  
    //无项目编号
    if(pid == -1){
      return res.json({total:0,rows:null});
    }
  
    missiondb.get_MStotal_bypj(pid,function(count){
      if(count == 0){
        return res.json({total:count,rows:null});
      }
  
      missiondb.get_allMS_bypj(order,offset,limit,pid,function(ret){
        if(ret){
          return res.json({total:count,rows:ret});
        }
      })
  
    });
  });

module.exports = router;