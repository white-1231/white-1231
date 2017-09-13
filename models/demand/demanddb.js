//引用
var  crypto = require('../../utils/cryptoUtils');
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
exports.add_demand = function(id,pid,name,d_desc,callback){
    callback = callback == null ? noCallback : callback;

    if (id == null || id == undefined || id == '') {
        callback(false);
        return;
    }

    if (pid == null || pid == undefined || pid == '') {
        callback(false);
        return;
    }

    if (name == null || name == undefined || name == '') {
        callback(false);
        return;
    }

    var sql='INSERT INTO t_demand (id,name,d_desc,state,pid) VALUES("{0}","{1}","{2}",0,"{3}"); ';
    sql = sql.format(id,name,d_desc,pid);

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

exports.get_alldm = function (order, offset, limit, pid, callback) {

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

    var sql = 'SELECT id,name,state,d_desc,pid FROM t_demand where pid = "{3}" ORDER BY id {0} LIMIT {1},{2} ';
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

exports.get_dmtotal = function (pid,callback) {

    callback = callback == null ? noCallback : callback;

    var sql = 'SELECT count(id)as count FROM t_demand where pid = "{0}" ';
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