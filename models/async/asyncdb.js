//引用
//同步使用方法库
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

/**
 * 根据项目id获取分组成员
 */
exports.getGroup_byPid = function (pid) {
    return new Promise(function (resolve, reject) {

        if (pid == null || pid == undefined || pid == '') {
            resolve([]);
            return ;
        }

        var sql = 'select u.id,u.nickname,g.gid from t_usr u,t_group g where u.id = g.uid and pid = "{0}" order by g.gid';
        sql = sql.format(pid);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });

    });

}

/**
 * 根据项目id获取版本
 */
exports.getVersion_byPid = function (pid) {
    return new Promise(function (resolve, reject) {

        if (pid == null || pid == undefined || pid == '') {
            resolve([]);
            return ;
        }

        var sql = 'SELECT id,name,state,pctime,petime,pid FROM t_version where pid = "{0}" ORDER BY pctime desc ';
        sql = sql.format(pid);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });

    });

}

/**
 * 根据项目id，查询版本id，名称
 */
exports.getvs_bypid = function (pid) {
    //TODO  根据版本状态筛选

    return new Promise(function (resolve, reject) {

        if (pid == null || pid == undefined || pid == '') {
            resolve([]);
            return ;
        }

        var sql = 'SELECT id,name FROM t_version where pid = "{0}" ORDER BY pctime desc ';
        sql = sql.format(pid);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });

    });
}

/**
 * 根据项目id，查询需求id，名称
 */
exports.getdm_bypid = function (pid) {

    return new Promise(function (resolve, reject) {

        if (pid == null || pid == undefined || pid == '') {
            resolve([]);
            return ;
        }

        var sql = 'SELECT id,name FROM t_demand where pid = "{0}" and state < 2 ';
        sql = sql.format(pid);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });

    });
}

/**
 * 根据项目id，获取项目对象
 */
exports.getpj_bypid = function (pid) {
    
    return new Promise(function (resolve, reject) {

        if (pid == null || pid == undefined || pid == '') {
            resolve([]);
            return ;
        }

        var sql = 'SELECT id,name,state,p_desc,creattime,endtime FROM t_project where id = "{0}" ';
        sql = sql.format(pid);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows[0]);
            }
        });

    });
}

/**
 * 根据组id，项目id 获取组成员
 */
exports.getMember_byPidGid = function (pid,gid) {
    
    return new Promise(function (resolve, reject) {

        if (pid == null || pid == undefined || pid == '') {
            resolve([]);
            return ;
        }

        if (gid == null || gid == undefined || gid == '') {
            resolve([]);
            return ;
        }

        var sql = 'SELECT uid FROM t_group where pid = "{0}" and gid = {1} ';
        sql = sql.format(pid,gid);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });

    });
}

/**
 * 根据pid 获取全部成员   pid 为权限id
 */
exports.getMember_byPid = function (pid) {
    
    return new Promise(function (resolve, reject) {

        if (pid == null || pid == undefined || pid == '') {
            resolve([]);
            return ;
        }

        var sql = 'SELECT p.uid,p.pid,u.nickname FROM t_usr_permission p,t_usr u where u.id = p.uid and pid = {0} ';
        sql = sql.format(pid);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });

    });
}

/**
 * 根据项目，类型，获取未开始的任务，未分配的任务
 */
exports.getMS_byPidType = function (pid,type) {
    return new Promise(function (resolve, reject) {

        if (pid == null || pid == undefined || pid == '') {
            resolve([]);
            return ;
        }

        if (type == null || type == undefined || type == '') {
            resolve([]);
            return ;
        }

        var sql = 'select m.id,m.name as mname,v.name as vname from t_mission m ,t_version v where m.vid = v.id and m.pid = "{0}" and m.type = {1} and m.state = 0 and m.owner is null';
        sql = sql.format(pid,type);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });

    });

}

/**
 * 根据项目，类型，用户获取所有已分配的任务
 */
exports.getMS_byOwnPidType = function (pid,type,owner) {
    return new Promise(function (resolve, reject) {

        if (pid == null || pid == undefined || pid == '') {
            resolve([]);
        }

        if (type == null || type == undefined || type == '') {
            resolve([]);
        }

        var sql = 'select m.id,m.name as mname,v.name as vname from t_mission m ,t_version v where m.vid = v.id and m.pid = "{0}" and m.type = {1} and m.owner = {2} and m.state =0';
        sql = sql.format(pid,type,owner);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });

    });

}

/**
 * 根据任务id，修改任务归属
 */
exports.update_msOwn_byid = function (ids, uid) {

    return new Promise(function (resolve, reject) {

        if (ids == null || ids == undefined || ids == '') {
            resolve(false);
            return ;
        }

        if (uid == null || uid == undefined || uid == '') {
            resolve(false);
            return ;
        }

        if(uid == -1){
            uid  = null ;
        }

        var sql = 'UPDATE t_mission SET owner = ' + uid + ' WHERE id in ({0})';
        sql = sql.format(ids);
        console.log(sql);

        query(sql, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });

    });
}