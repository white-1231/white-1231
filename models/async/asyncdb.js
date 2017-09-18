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