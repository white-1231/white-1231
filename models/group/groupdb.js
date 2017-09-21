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
 * 添加项目组成员
 */
exports.add_group = function(pid,gid,uid,callback){
    callback = callback == null ? noCallback : callback;

    if (pid == null || pid == undefined || pid == '') {
        callback(false);
        return;
    }

    if (gid == null || gid == undefined || gid == '') {
        callback(false);
        return;
    }

    var sql='INSERT INTO t_group (id,uid,pid,gid) VALUES ';
    var values ='';

    for(var i = 0;i<uid.length ;i++){
        values += '('+ 0+ ' ,'+ uid[i] + ',' + pid +','+gid +')';
        if( i == (uid.length -1)){
            sql += values;
        }else{
            values +=',' ;
        }
    };

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

/**
 * 通过项目id删除组
 */
exports.del_group_Bypid = function(pid,callback){
    callback = callback == null ? noCallback : callback;

    if (pid == null || pid == undefined || pid == '') {
        callback(false);
        return;
    }

    var sql = 'delete from t_group where pid = {0} ;';
    sql = sql.format(pid);

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

exports.get_groupMember_byGidPid = function (order, offset, limit, pid, gid,callback){

    callback = callback == null ? noCallback : callback;

    if (pid == null || pid == '' || pid == undefined) {
        callback(false);
        return;
    }

    if (gid == null || gid == '' || gid == undefined) {
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
    
    var sql = 'SELECT g.id,g.uid,g.pid,g.gid,u.nickname FROM t_group g ,t_usr u where u.id = g.uid and g.pid = "{3}" and g.gid = {4} ORDER BY g.id {0} LIMIT {1},{2} ';
    sql = sql.format(order, parseInt(offset), parseInt(limit), pid,gid);
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

exports.get_GpMbtotal_byGidPid = function (pid,gid, callback) {
    
    callback = callback == null ? noCallback : callback;

    if (pid == null || pid == '' || pid == undefined) {
        callback(0);
        return;
    }

    if (gid == null || gid == '' || gid == undefined) {
        callback(0);
        return;
    }

    var sql = 'SELECT count(id)as count FROM t_group where pid = "{0}" and gid = {1} ';
    sql = sql.format(pid,gid);
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

exports.del_member_byuid = function(pid,gid,uid,callback){
    callback = callback == null ? noCallback : callback;
    
    if (pid == null || pid == undefined || pid == '') {
        callback(false);
        return;
    }

    if (gid == null || gid == undefined || gid == '') {
        callback(false);
        return;
    }

    if (uid == null || uid == undefined || uid == '') {
        callback(false);
        return;
    }

    var sql = 'delete from t_group where pid = {0} and gid ={1} and uid = {2};';
    sql = sql.format(pid,gid,uid);

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