
var express = require('express');

var sessionUtils = require('../utils/sessionUtils');

var demanddb = require('../models/demand/demanddb');

var router = express.Router();

router.post('/update',function(req,res){
    var result = sessionUtils.checkUsefulSession(req.session);   

    if(result == 1){
        var submitData = req.body;
        var $dmName = submitData.dmName;
        var $dmID = submitData.dmID;
        var $dmDesc = submitData.dmDesc;
        var $dmState = submitData.dmState;

        var oldobj = JSON.parse(submitData.oldobj);

        if($dmState == null || $dmState == undefined){
            $dmState = oldobj.state;
        }

        if($dmState == 3){
            if(oldobj.state == 2){
                return res.json({success:false,msg:'dm is finish,,can\'t be changed '});
            }
            if(oldobj.state == 4){
                return res.json({success:false,msg:'dm is error state,can\'t be changed '});
            }
        }

        if($dmState == 4){
            if(oldobj.state == 2){
                return res.json({success:false,msg:'dm is finish'});
            }
        }

        if($dmState == 2){
            //TODO 
            // 校验是否存在任务未完成
        }

        demanddb.update_msByid($dmID,$dmName,$dmState,$dmDesc,function(ret){
            if(ret){
                return res.json({success:true, msg:'add success'});
            }else{
                return res.json({success:false, msg:'db operate error'});
            }
        })

    }else{
        return res.json({success:false,msg:'user not sign in'});
    }

});


module.exports = router;