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

/**
 * 获取全部用户计数
 */
exports.get_pjtotal = function (callback) {

    callback = callback == null ? noCallback : callback;

    var sql = 'SELECT count(id)as count FROM t_project ';
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

exports.get_allpj_bypage = function (order, offset, limit, callback) {

    callback = callback == null ? noCallback : callback;

    if (order == null || order == '' || order == undefined || (order != "asc" || order != "desc")) {
        order = 'ASC';
    }

    if (offset == null || offset == '' || offset == undefined) {
        offset = 0;
    }

    if (limit == null || limit == '' || limit == undefined) {
        limit = 10;
    }

    var sql = 'SELECT id,name,state,p_desc,creattime,endtime FROM t_project ORDER BY state {0} LIMIT {1},{2} ';
    sql = sql.format(order, parseInt(offset), parseInt(limit));
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

exports.update_pjByID = function (id, name, state, p_desc, endtime, callback) {
    callback = callback == null ? noCallback : callback;

    if (id == null || id == undefined || id == '') {
        callback(false);
        return;
    }

    var sql ='UPDATE t_project SET name="{0}", p_desc="{1}", state={2}, endtime={3} WHERE id={4}';
    sql =sql.format(name,p_desc,state,endtime,id);
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

/**
 * 根据用户id获取所属项目
 */
exports.getPeoject_byUid = function (uid,callback) {
    callback = callback == null ? noCallback : callback;

    if (uid == null || uid == undefined || uid == '') {
        callback(false);
        return;
    }

    var sql = 'SELECT id,name FROM t_project where id in (SELECT pid FROM t_group where uid = {0} group by pid) and state = {1}';
    // TODO  项目状态暂时没有配置，统一使用0  ------- 0914
    sql = sql.format(uid, 0);

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