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
        values += '('+ 0+ ' ,'+ uid[0] + ',' + pid +','+gid +')';
        if( i == (uid.length -1)){
            sql += values;
        }else{
            values +=',' ;
        }
    };
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