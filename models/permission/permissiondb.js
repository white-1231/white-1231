//引用
var  mysqlpool = require('../../utils/mysqlPool');

function query(sql,callback){

    var pool = mysqlpool.getPool();

    pool.getConnection(function(err,conn){  
        if(err){  
            throw err; 
        }else{  
            conn.query(sql,function(error,results,fields){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(error,results,fields);  
            });  
        }  
    });  
};

function noCallback(a,b,c,d,e,f,g){
    console.log('has no callback!');
}

/**
 * 根据用户ID 获取权限
 */
exports.get_by_id = function (uid, callback) {

    callback = callback == null ? noCallback : callback;

    if (uid == null || uid == undefined || uid == '') {
        callback(false);
        return;
    }

    var sql = 'SELECT * FROM t_usr_permission WHERE uid = "{0}"';
    sql = sql.format(uid);

    console.log(sql);

    query(sql, function (err, rows, fields) {
        if (err) {
            callback(-1);
            throw err;
        }
        else {
            if (rows.length > 0) {
                callback(rows);
            } else {
                callback(0);
            }
        }
    })
}

/**
 * 添加权限
 */
exports.add_pms = function (uid, pid, callback) {
    callback = callback == null ? noCallback : callback;

    if (uid == null || uid == undefined || uid == '') {
        callback(false);
        return;
    }

    if (pid == null || pid == undefined || pid == '') {
        callback(false);
        return;
    }

    var sql = 'INSERT INTO t_usr_permission (id,uid,pid) VALUES';
    var values ='';
    for(var i = 0;i<pid.length ;i++){
        values += '('+ 0+ ' ,'+ uid + ',' + pid[i] +')';
        if( i == (pid.length -1)){
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
 * 删除权限
 */
exports.del_pms = function(uid,pid,callback){
    callback = callback == null ? noCallback : callback;

    if (uid == null || uid == undefined || uid == '') {
        callback(false);
        return;
    }

    if (pid == null || pid == undefined || pid == '') {
        callback(false);
        return;
    }

    var sql = 'delete from t_usr_permission where uid = {0} and pid in ({1});';
    sql = sql.format(uid,pid);

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
 * 获取全部用户权限分组，会造成笛卡尔积
 */
exports.get_user_pms = function (callback) {
    callback = callback == null ? noCallback : callback;

    var sql = 'select t.id,t.nickname,p.pid from t_usr t,t_usr_permission p where t.id = p.uid and t.state =1 and p.pid >1 order by pid';

    console.log(sql);

    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(rows);
        }
    });
}