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
 * 添加项目
 */
exports.add_project = function(id,name,desc,callback){
    callback = callback == null ? noCallback : callback;

    if (id == null || id == undefined || id == '') {
        callback(false);
        return;
    }

    if (name == null || name == undefined || name == '') {
        callback(false);
        return;
    }

    var sql='INSERT INTO t_project (id,name,p_desc,state,creattime,endtime) VALUES("{0}","{1}","{2}",0,{3},-1); ';
    sql = sql.format(id,name,desc,Math.floor( new Date().getTime()/1000));

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