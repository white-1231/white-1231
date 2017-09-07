var  mysql = require('mysql');
var  crypto = require('../../utils/cryptoUtils');

/**
 * 池对象
 */
var pool = null;

function query(sql,callback){

    if(pool == null){
        init();
    }

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
 * 初始化数据库
 */
function init(){
    pool = mysql.createPool({  
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'mytk',
        port: 3306
    });
};

/**
 * 创建账号
 */
exports.create_account = function(account,password,tel,email,callback){

    callback = callback == null? noCallback:callback;

    if(account == null || password == null || tel == null || email == null){
        callback(false);
        return;
    }
 
    var pwd = crypto.md5(password);

    var sql = 'INSERT INTO t_usr ( id ,account,password,tel,email,state) VALUES(0,"{0}","{1}","{2}","{3}",0)';
    
    sql =sql.format(account,pwd,tel,email);

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




};

/**
 * 检查账号是否存在
 * 
 */
exports.is_account_exist = function (account, callback) {

    callback = callback == null ? noCallback : callback;

    if (account == null) {
        callback(true);
        return;
    }

    var sql = 'SELECT id FROM t_usr WHERE account = "{0}"';
    sql = sql.format(String(account));

    console.log(sql);

    query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length > 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        }
    });

};

/**
 * 通过账号获取用户实体
 */
exports.getuser_byaccount = function(account,callback){
    callback = callback == null ? noCallback : callback;

    if (account == null) {
        callback(false);
        return;
    }

    var sql = 'SELECT * FROM t_usr WHERE account = "{0}"';
    sql = sql.format(String(account));

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
};

/**
 * 获取所有用户
 */
exports.get_alluser = function(order,offset,limit,callback){

    callback = callback == null? noCallback:callback;

    if(order == null || order == '' || order == undefined || (order !="asc"||order !="desc")){
        order = 'ASC';
    }

    if(offset == null || offset == '' || offset == undefined ){
        offset = 0;
    }

    if(limit == null || limit == '' || limit == undefined ){
        limit = 10;
    }

    var sql = 'SELECT id,nickname,state,tel,email FROM t_usr ORDER BY state {0} LIMIT {1},{2} ';
    sql =sql.format(order,parseInt(offset),parseInt(limit));
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