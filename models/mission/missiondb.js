//引用
var mysqlpool = require('../../utils/mysqlPool');

function query(sql, callback) {

    var pool = mysqlpool.getPool();

    pool.getConnection(function (err, conn) {
        if (err) {
            throw err;
        } else {
            conn.query(sql, function (error, results, fields) {
                //释放连接  
                conn.release();
                //事件驱动回调  
                callback(error, results, fields);
            });
        }
    });
};

function noCallback(a, b, c, d, e, f, g) {
    console.log('has no callback!');
}

/**
 * 添加任务
 */
exports.add_mission = function (name, pstime, petime, type, vid, did, desc, pid, callback) {
    callback = callback == null ? noCallback : callback;

    if (vid == null || vid == undefined || vid == '') {
        callback(false);
        return;
    }

    if (did == null || did == undefined || did == '') {
        did = -1;
    }

    var sql = 'INSERT INTO t_mission (id,did,vid,name,state,status,m_desc,type,pstime,petime,pid) VALUES(0,"{0}",{1},"{2}",0,0,"{3}",{4},{5},{6},"{7}"); ';
    sql = sql.format(did, vid, name, desc, type, pstime, petime, pid);

    console.log(sql);

    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });

}

exports.get_MStotal_bypj = function (pid, callback) {

    callback = callback == null ? noCallback : callback;

    if (pid == null || pid == '' || pid == undefined) {
        callback(0);
        return;
    }

    var sql = 'SELECT count(id)as count FROM t_mission where pid = "{0}" ';
    sql = sql.format(pid);
    console.log(sql);

    query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        else {
            callback(rows[0].count);
        }
    });

}

exports.get_allMS_bypj = function (order, offset, limit, pid, callback) {

    callback = callback == null ? noCallback : callback;

    if (pid == null || pid == '' || pid == undefined) {
        callback(false);
        return;
    }

    if (order == null || order == '' || order == undefined || (order != "asc" || order != "desc")) {
        order = 'ASC';
    }

    if (offset == null || offset == '' || offset == undefined) {
        offset = 0;
    }

    if (limit == null || limit == '' || limit == undefined) {
        limit = 10;
    }
    
    var sql = 'SELECT id,name,state,status,pid,did,vid,m_desc,type,owner,pstime,petime,astime,aetime FROM t_mission where pid = "{3}" ORDER BY state {0} LIMIT {1},{2} ';
    sql = sql.format(order, parseInt(offset), parseInt(limit), pid);
    console.log(sql);

    query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length > 0) {
                callback(rows);
            }
            else {
                callback(false);
            }
        }
    });

}

exports.update_msByid = function (id,pid,did,vid,name,state,desc,type,pstime,petime,astime,aetime,callback){
    callback = callback == null ? noCallback : callback;

    if (id == null || id == undefined || id == '') {
        callback(false);
        return;
    }
    if (pid == null || pid == undefined || pid == '') {
        callback(false);
        return;
    }
    if (vid == null || vid == undefined || vid == '') {
        callback(false);
        return;
    }

    if (did == null || did == undefined || did == '') {
        did = -1;
    }

    var sql = 'UPDATE t_mission SET pid="{0}", did="{1}", vid={2}, name="{3}", state={4}, m_desc="{5}", type={6}, pstime={7}, petime={8}, astime={9}, aetime={10} WHERE id={11} ;';
    var sql = sql.format(pid,did,vid,name,state,desc,type,pstime,petime,astime,aetime,id);
    console.log(sql);

    query(sql, function(err, rows, fields) {
        if (err) {
            callback(false);
            throw err; 
        }
        else{
            callback(true);            
        }
    });

    
}

exports.getMS_byOwner = function (owner,callback){
    callback = callback == null ? noCallback : callback;

    if (owner == null || owner == '' || owner == undefined) {
        callback(false);
        return;
    }

    var sql = 'SELECT m.id,m.name,m.status,p.name pname,v.name vname,d.name dname,m.m_desc,m.type,m.pstime,m.petime,m.astime,m.aetime FROM t_mission m '+
    'left join t_project p on m.pid= p.id left join t_version v on m.vid = v.id left join t_demand d on m.did = d.id  where m.status <2 and m.owner = {0}';
    sql = sql.format(owner);
    console.log(sql);

    query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length > 0) {
                callback(rows);
            }
            else {
                callback(false);
            }
        }
    });

}

exports.update_MSstatus_byid = function(id,status,mdtime,callback){
    callback = callback == null ? noCallback : callback;

    if (id == null || id == '' || id == undefined) {
        callback(false);
        return;
    }

    if (status == null || status == '' || status == undefined) {
        callback(false);
        return;
    }

    var time;
    if(status == 2||status == 3){
        time = "aetime = {1}";
    }else{
        time = "astime = {1}";
    }

    var sql = 'UPDATE t_mission SET status="{0}",'+time+' WHERE id={2} ;'
    sql = sql.format(status,mdtime,id);
    console.log(sql);

    query(sql, function(err, rows, fields) {
        if (err) {
            callback(false);
            throw err; 
        }
        else{
            callback(true);            
        }
    });

}

