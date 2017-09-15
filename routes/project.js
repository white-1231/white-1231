
var express = require('express');

var sessionUtils = require('../utils/sessionUtils');

var permissiondb = require('../models/permission/permissiondb');
var groupdb = require('../models/group/groupdb');
var projectdb = require('../models/project/projectdb');
var demanddb = require('../models/demand/demanddb');
var versiondb = require('../models/version/versiondb');

var  asyncdb = require('../models/async/asyncdb');

var router = express.Router();

router.get('/', function (req, res, next) {
  var result = sessionUtils.checkUsefulSession(req.session);
  if (result == 1) {
    //当前用户
    var user = req.session.user;
    //项目id  ，只用在项目页面，点击指定项目存在
    var pid = req.query.pid;

    //查询所属项目
    projectdb.getPeoject_byUid(user.id ,function(ret){
      if(ret){
        //pid 未指定，则查询第一个项目
        if(pid == undefined){
          pid = ret[0].id;
        }; 
        //同步查询项目组，项目版本 。--- 共同进行
        var data = Promise.all([asyncdb.getGroup_byPid(pid),asyncdb.getVersion_byPid(pid)]);
        //链式处理 ，results 为 同步查询结果
        data.then(function (results) {
          
          var groupname =['-1','M','PM','DE','TE','DA'];
          var statename = ['未开始','进行中','已完成','版本暂停','版本作废'];

          res.render('project', { 
            title: '项目' ,
            selectpj:pid,                   //用户选择的项目
            grouparr:results[0],           //组成员
            groupname:groupname,          //职能名称
            statename:statename,          //版本状态名称
            versionarr:results[1] ,       // 版本列表
            pjarr :ret                    //项目列表
          });
        });

      }else{
        res.render('project', { title: '项目' });
      }
    });

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

  versiondb.get_vstotal_bypj(pid,function(count){
    if(count == 0){
      return res.json({total:count,rows:null});
    }

    versiondb.get_allversion_bypj(order,offset,limit,pid,function(ret){
      if(ret){
        return res.json({total:count,rows:ret});
      }
    })

  });
});

router.post('/addVersion',function(req,res){
  var submitData = req.body;
  var $pid = submitData.pid;
  var $vName = submitData.vName;
  var $vpctime = submitData.vpctime;
  var $vpetime = submitData.vpetime;
  var $vdesc = submitData.vdesc;

  $vpctime = '' ;
  $vpetime = '' ;

  versiondb.add_version($pid,$vName,$vdesc,$vpctime,$vpetime,function(ret){
    if(ret){
      return res.json({success:true,msg:'add success'});
    }else{
      return res.json({success:false,msg:'db operate error'});
    }
  })
})

router.get('/pjdetails',function(req,res,next){
  var result = sessionUtils.checkUsefulSession(req.session);
  
    if (result == 1) {
      //获取项目 pid
      var pid = req.query.pid;

      //同步查询 版本列表，需求列表 。--- 共同进行
      var data = Promise.all([asyncdb.getvs_bypid(pid),asyncdb.getdm_bypid(pid)]);

      data.then(function(results){

        res.render('projectDetails', { 
          title: '项目详细',
          dmlist: results[1], //需求列表
          vslist: results[0]  //版本列表
        });
        
      })

    }else{
      res.render('login', { title: '首页' });
    }
});

module.exports = router;