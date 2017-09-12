
var express = require('express');

var sessionUtils = require('../utils/sessionUtils');

var permissiondb = require('../models/permission/permissiondb');
var groupdb = require('../models/group/groupdb');
var projectdb = require('../models/project/projectdb');
var demanddb = require('../models/demand/demanddb');

var router = express.Router();

router.get('/', function (req, res, next) {
  var result = sessionUtils.checkUsefulSession(req.session);
  if (result == 1) {
    res.render('project', { title: '项目' });
  } else {
    res.render('login', { title: '首页' })
  }
});

router.get('/add', function (req, res, next) {
  var result = sessionUtils.checkUsefulSession(req.session);

  if (result == 1) {
    permissiondb.get_user_pms(function(data){

      //select 分组
      var group = {
        pm:new Array(),
        de:new Array(),
        te:new Array(),
        da:new Array()
      };

      //分组数据
      for(var i = 0 ;i<data.length;i++){
        var temp = data[i];
        if(temp.pid == 2){
          group.pm.push(temp);
        }else if(temp.pid == 3){
          group.de.push(temp);
        }else if(temp.pid == 4){
          group.te.push(temp);
        }else if(temp.pid == 5){
          group.da.push(temp);
        }
      };

      res.render('addProject', { title: '添加项目' ,group:group});

    })
  } else {
    res.render('login', { title: '首页' })
  }

});

router.post('/addProject',function(req,res){
  var submitData = req.body;
  var $pjName = submitData.pjName;
  var $pjId = submitData.pjId;
  var $pjDesc = submitData.pjDesc;

  var $pm_member = submitData.pm_member;
  var $de_member = submitData.de_member;
  var $te_member = submitData.te_member;
  var $da_member = submitData.da_member;

  if($pm_member.length>0){
    //负责人只有一个，编号 2
    groupdb.add_group($pjId,2,$pm_member);
  }
  if($de_member.length>0){
    var dem_arr = $de_member.split(',');
    //开发编号3
    groupdb.add_group($pjId,3,dem_arr);
  }
  if($te_member.length>0){
    var tem_arr = $te_member.split(',');
    //测试编号4
    groupdb.add_group($pjId,4,tem_arr);
  }
  if($da_member.length>0){
    var dam_arr = $da_member.split(',');
    //产品编号5
    groupdb.add_group($pjId,5,dam_arr);
  }

  projectdb.add_project($pjId,$pjName,$pjDesc,function(ret){
    if(ret){
      var resultData = {pjId:$pjId,pjName:$pjName};

      return res.json({
        success:true,
        msg:'add success',
        data:JSON.stringify(resultData)});

    }else{
      groupdb.del_group_Bypid($pjId,function(flag){
        if(flag){
          return res.json({success:false,msg:'db operate error'});
        }else{
          //TODO
          //项目未添加，却添加了组，需把组给删掉，但是缺没有删掉
          //记录入日志，需要之后手动处理
          return res.json({success:false,msg:'db operate error'});
        }
      })
    }
  })

})

router.get('/getAlldm',function(req,res){
  var queryData = req.query;
  var order = queryData.order;
  var offset = queryData.offset;
  var limit = queryData.limit;
  var pid = queryData.pid;

  //无项目编号
  if(pid == -1){
    return res.json({total:0,rows:null});
  }

  demanddb.get_dmtotal(pid,function(count){
    if(count == 0){
      return res.json({total:count,rows:null});
    }

    demanddb.get_alldm(order,offset,limit,pid,function(ret){
      if(ret){
        return res.json({total:count,rows:ret});
      }
    })

  });
});

router.post('/addDemand',function(req,res){
  var submitData = req.body;
  var $pid = submitData.pid;
  var $dmName = submitData.dmName;
  var $dmID = submitData.dmID;
  var $dmDesc = submitData.dmDesc;

  demanddb.add_demand($dmID,$pid,$dmName,$dmDesc,function(ret){
    if(ret){
      return res.json({success:true,msg:'add success'});
    }else{
      return res.json({success:false,msg:'db operate error'});
    }
  })
});

router.get('/getAllversion',function(req,res){
  var queryData = req.query;
  var order = queryData.order;
  var offset = queryData.offset;
  var limit = queryData.limit;
  var pid = queryData.pid;

  //无项目编号
  if(pid == -1){
    return res.json({total:0,rows:null});
  }

  demanddb.get_dmtotal_bypj(pid,function(count){
    if(count == 0){
      return res.json({total:count,rows:null});
    }

    demanddb.get_allversion_bypj(order,offset,limit,pid,function(ret){
      if(ret){
        return res.json({total:count,rows:ret});
      }
    })

  });
});

module.exports = router;