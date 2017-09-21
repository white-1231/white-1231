
var express = require('express');

var sessionUtils = require('../utils/sessionUtils');

var versiondb = require('../models/version/versiondb');

var router = express.Router();

router.post('/update',function(req,res){
    var result = sessionUtils.checkUsefulSession(req.session);   

    if(result == 1){
        var submitData = req.body;
        var $id = submitData.id;
        var $vName = submitData.vName;
        var $vstate = submitData.vstate;
        var $vpctime = submitData.vpctime;
        var $vpetime = submitData.vpetime;
        var $vdesc = submitData.vdesc;

        //时间传来的值为 yyyy-mm-dd
        $vpctime = (new Date($vpctime).getTime()/1000) ;
        $vpetime = (new Date($vpetime).getTime()/1000) ;

        var oldobj = JSON.parse(submitData.oldobj);

        var actime = oldobj.actime;
        var aetime = oldobj.aetime;

        //标记已完成
        if($vstate == 2){

            if(oldobj.state == 0){
                aetime = Math.floor( new Date().getTime()/1000);
            }

            if(oldobj.state == 1){
                //TODO 
                //校验版本的任务

                aetime = Math.floor( new Date().getTime()/1000);
            }
            
            if(oldobj.state == 2){

            }

            if(oldobj.state == 3){
                //TODO 
                //校验版本的任务

                aetime = Math.floor( new Date().getTime()/1000);
            }

            if(oldobj.state == 4){
                //版本作废，不可修改
                return res.json({success:false, msg:'version is cancel,can\'t md !'});
            }

        }
        
        //标记暂停
        if ($vstate == 3) {
            if (oldobj.state == 0 || oldobj.state == 1) {
                //TODO
                //处理任务状态

                aetime = Math.floor( new Date().getTime()/1000);

            }
            
            if (oldobj.state == 2) {
                return res.json({ success: false, msg: 'version is finished,can\'t md !' });
            }

            if (oldobj.state == 3) {
                
            }

            if (oldobj.state == 4) {
                //版本作废，不可修改
                return res.json({ success: false, msg: 'version is cancel,can\'t md !' });
            }

        }
        
        //标记作废
        if ($vstate == 4) {
            if (oldobj.state == 0 || oldobj.state == 1) {
                //TODO
                //处理任务状态

                aetime = Math.floor( new Date().getTime()/1000);

            }
            
            if (oldobj.state == 2) {
                return res.json({ success: false, msg: 'version is finished,can\'t md !' });
            }

            if (oldobj.state == 3) {
                aetime = Math.floor( new Date().getTime()/1000);
            }

            if (oldobj.state == 4) {
                
            }

        } 

        //版本标记未开始
        if ($vstate == 0) {
            if (oldobj.state > 0 ) {
                return res.json({ success: false, msg: 'version is running or has stoped,can\'t mark not start !' });

            }
        } 

        //版本标记进行中
        if ($vstate == 1) {
            if (oldobj.state == 0 ) {
                actime = Math.floor(new Date().getTime()/1000);
                aetime = -1;
            }

            if(oldobj.state == 1){

            }

            if (oldobj.state == 2) {
                return res.json({ success: false, msg: 'version is finished,can\'t md !' });
            }

            if (oldobj.state == 3) {
                actime = Math.floor( new Date().getTime()/1000);
                actime = -1;
            }

            if (oldobj.state == 4) {
                //版本作废，不可修改
                return res.json({ success: false, msg: 'version is cancel,can\'t md !' });
            }
        }

        versiondb.update_version_byid($id,$vName,$vstate,$vpctime,$vpetime,$vdesc,actime,aetime,function(ret){
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