//引用
var  mysqlpool = require('../../utils/mysqlPool');

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
 * 添加需求
 */
exports.add_version = function(pid,vname,vdesc,vpctime,vpetime,callback){
    callback = callback == null ? noCallback : callback;

    if (pid == null || pid == undefined || pid == '') {
        callback(false);
        return;
    }

    if (vname == null || vname == undefined || vname == '') {
        callback(false);
        return;
    }

    if(vpctime == null || vpctime == undefined || vpctime == ""){
        vpctime = Math.floor(new Date().getTime()/1000);
    }

    if(vpetime == null || vpetime == undefined || vpetime == ""){
        vpetime = Math.floor(new Date().getTime()/1000) +604800;
    }

    var sql='INSERT INTO t_version (id,pid,name,v_desc,state,pctime,petime) VALUES(0,"{0}","{1}","{2}",0,{3},{4}); ';
    sql = sql.format(pid,vname,vdesc,vpctime,vpetime);

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

exports.get_allversion_bypj = function (order, offset, limit, pid, callback) {

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

    var sql = 'SELECT id,name,state,v_desc,pid,pctime,petime,actime,aetime FROM t_version where pid = "{3}" ORDER BY id {0} LIMIT {1},{2} ';
    sql = sql.format(order, parseInt(offset),parseInt(limit+offset),pid);
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

exports.get_dmtotal_bypj = function (pid,callback) {

    callback = callback == null ? noCallback : callback;

    var sql = 'SELECT count(id)as count FROM t_version where pid = "{0}" ';
    sql =sql.format(pid);
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