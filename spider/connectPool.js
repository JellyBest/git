//连接数据库
const log = require('./log.js');
const mysql = require('mysql');
// const mysqlConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: '!!!vutoys',
//     database: 'dadan',
//     timezone: "08:00"
// }
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'jelly520',
    database: 'teststock',
    timezone: "08:00"
}
var pool = mysql.createPool(mysqlConfig);

var query = function(sql,options,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,options,function(err,results,fields){
                //事件驱动回调
                callback(err,results,fields);
            });
            //释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
            conn.release();
        }
    });
}
module.exports=query;

function Tasklog(message) {
    let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
    log.logger.log(`[${time}] - ${message}`);
}

// function handleDisconnection(){
//     var connection = mysql.createConnection(mysqlConfig);
//     connection.connect(err => {
//         console.log('Task -- Start');
//         Tasklog('Task -- Start');
//         if (err) {
//             Tasklog(err);
//             setTimeout(handleDisconnection(),2000);
//             return;
//         }
//         console.log("Connected MySql...");
//         Tasklog("Connected MySql.");
//     });
//     exports.connection = connection;
// }

// exports.handleDisconnection = handleDisconnection;
