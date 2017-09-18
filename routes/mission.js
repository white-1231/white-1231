
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
                //TODO 如果有需求关联，应该修改需求状态为进行中

                return res.json({success:true, msg:'add success'});
            }else{
                return res.json({success:false,msg:'db operate error'}); 
            } 
        });
    }else{
        return res.json({success:false,msg:'user not sign in'});
    }
});

router.get('/getMS', function (req, res) {
    var queryData = req.query;
    var order = queryData.order;
    var offset = queryData.offset;
    var limit = queryData.limit;
    var pid = queryData.pid;

    //无项目编号
    if (pid == -1) {
        return res.json({ total: 0, rows: null });
    }

    missiondb.get_MStotal_bypj(pid, function (count) {
        if (count == 0) {
            return res.json({ total: count, rows: null });
        }

        missiondb.get_allMS_bypj(order, offset, limit, pid, function (ret) {
            if (ret) {
                return res.json({ total: count, rows: ret });
            }
        })

    });
});

router.post('/update',function(req,res){
    var result = sessionUtils.checkUsefulSession(req.session);   

    if(result == 1){
        var submitData = req.body;
        var $id = submitData.id;
        var $name = submitData.name;
        var $pstime = submitData.pstime;
        var $petime = submitData.petime;
        var $type = submitData.type;
        var $state = submitData.state;
        var $vid = submitData.vid;
        var $did = submitData.did;
        var $desc = submitData.desc;
        var $pid = submitData.pid;
        //修改前数据
        var oldobj = JSON.parse(submitData.oldobj);

        var astime = oldobj.astime;
        var aetime = oldobj.aetime;

        //原状态为0
        if(oldobj.state == 0){
            //任务状态置为1 延期，将计划开始，结束时间全部改为-1
            if($state == 1){
                $pstime =-1;
                $petime =-1;
            }
            //任务状态置为2 异常，将实际时间全部改为当前时间
            if($state == 2){
                aetime = Math.floor( new Date().getTime() / 1000);
            }

            //任务状态置为3 过期，将计划，实际时间全部改为-1
            if($state == 2){
                $pstime =-1;
                $petime =-1;
                astime = -1;
                aetime = -1;
            }
        }
        //原状态为1
        if(oldobj.state == 1){
            //延期转正常
            if($state == 0){
                if(pstime == -1){
                    $pstime =  Math.floor( new Date().getTime() / 1000);  
                }
                if(petime == -1){
                    $petime = $pstime + 86400;
                }
            }

            if($state == 2){
                aetime = Math.floor( new Date().getTime() / 1000);
            }

            if($state ==3){
                $pstime =-1;
                $petime =-1;
                astime = -1;
                aetime = -1;
            }

        }
        //原状态为2
        if(oldobj.state == 2){
             //异常转转正常
            if($state == 0){
                if(pstime == -1){
                    $pstime =  Math.floor( new Date().getTime() / 1000);  
                }
                if(petime == -1){
                    $petime = $pstime + 86400;
                }
                astime = -1;
                aetime = -1;
            }else{
                //其他情况时间不可变
                $pstime =oldobj.pstime;
                $petime =oldobj.pstime;
                astime = oldobj.astime;
                aetime = oldobj.aetime;
                //状态不可变
                $state = oldobj.state;
            }
        }
        //原状态为3
        if(oldobj.state == 3){
            //过期任务，状态时间都不可变
            $pstime =oldobj.pstime;
            $petime =oldobj.pstime;
            astime = oldobj.astime;
            aetime = oldobj.aetime;
            $state = oldobj.state;

       }

       missiondb.update_msByid($id,$pid,$did,$vid,$name,$state,$desc,$type,$pstime,$petime,astime,aetime,function(ret){
           if(ret){
               return res.json({success:true, msg:'add success'});
           }else{
               return res.json({success:false, msg:'db operate error'});
           }
       })


    }else{
        return res.json({success:false,msg:'user not sign in'});
    }

})

module.exports = router;