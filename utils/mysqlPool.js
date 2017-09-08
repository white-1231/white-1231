var  mysql = require('mysql');

/**
 * 池对象
 */
var pool = null;

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

function getPool(){
    if(pool == null){
        init();
    }

    return pool;
}

exports.getPool = getPool ;