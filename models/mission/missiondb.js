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

    var sql = 'SELECT id,name,state,status,pid,did,vid,m_desc,type,owner,pstime,petime,astime,aetime FROM t_mission where pid = "{3}" ORDER BY id {0} LIMIT {1},{2} ';
    sql = sql.format(order, parseInt(offset), parseInt(limit) + parseInt(offset), pid);
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