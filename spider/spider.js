const request = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Entities = require('html-entities').XmlEntities;
const async = require("async");
var express = require('express');
const Promise = require("promise");
const log = require('./log.js');
var app = express();

//连接数据库
var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '!!!vutoys',
//     database: 'dadan',
//     timezone: "08:00"
// });
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'jelly520',
    database: 'teststock',
    timezone: "08:00"
});

connection.connect(err => {
    console.log('Task -- Start');
    Tasklog('Task -- Start');
    if (err) {
        Tasklog(err);
        return;
    }
    console.log("Connected MySql...");
    Tasklog("Connected MySql.");
});

const entities = new Entities();

const charset = require('superagent-charset');
const superagent = require('superagent');
charset(superagent);

let errCode = [];
function getAPILoad(symbol, callback) {
    let url = 'http://www.gupiaodadan.com/buy-sell-' + symbol;
    superagent.get(url).charset('gb2312').end((err, res) => {

        if (err) {
            let errMessage = url + ' error Status: ' + err.status;
            Tasklog(errMessage);
            callback(null, 'Get url err.');
        } else {
            let code = symbol;
            const $ = cheerio.load(res.text, {
                decodeEntities: true,
            });
            let allValues = [];
            $('.tablecontent tr').each(function () {
                if ($(this).index() > 0) {
                    let params = [];
                    let text = "";
                    let temp = [];
                    $(this).find('td').each(function () {
                        if ($(this).text() == '买入') {
                            temp.push('buy');
                        } else if ($(this).text() == '卖出') {
                            temp.push('sell');
                        } else if (!$(this).text()) {
                            temp.push('0');
                        } else {
                            temp.push($(this).text().replace(/\s/g, ''));
                        }

                    })
                    if (temp.length > 0) {
                        params = [code, temp[0], temp[5], temp[1], temp[2], temp[3], temp[4], temp[6], temp[7]];
                        allValues.push(params);
                    }
                }
            });
            if (allValues.length > 0) {
                insertStock([allValues], callback);
            } else {
                Tasklog(url + '  No data.');
                callback(null, 'No data.');
            }
        }
    })

}

// 获取股票代码集合
function getSymbols() {
    return new Promise((resolve, reject) => {
        let symbols = [];
        //let querySql = "select code from code WHERE 1=1 LIMIT 20 ";
        let querySql = "select code from code WHERE 1=1 order by code DESC ";
        connection.query(querySql, (error, results) => {
            if (error) {
                Tasklog(error);
                reject(error);
            }
            for (let item of results) {
                symbols.push(item.code);
            }
            resolve(symbols);
            console.log("Task is running...");
        })
    })
}

function Tasklog(message) {
    let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
    log.logger.log(`[${time}] - ${message}`);
}

// 从数据库获取symbols
getSymbols().then(symbols => {
    async.mapLimit(symbols, 10,
        function (symbol, callback) {
            getAPILoad(symbol, callback)
        },

        function (err, result) {
            if (err) {
                Tasklog('Result Summary----------------------------------');
                Tasklog(err);
            }
            //Tasklog(result);

            // 关闭连接
            connection.end( error => {
                if(error){
                    Tasklog(error);
                    return;
                }
                Tasklog( 'connection end');
                console.log('connection end');
                Tasklog('Task -- End');
                console.log('Task -- End');
            });
        });
});

//插入数据
function insertStock(params, callback) {
    let addStock = 'replace into history(code,date,op,first,last,high,low,price,roi) values ?';
    connection.query(addStock, params,
        function (error, rows, fields) {
            if (error) {
                Tasklog(error);
                return;
            }
            let message = params[0][0][0] + ' ' + rows.affectedRows + '条replace完成';
            //callback(null, message);
            Tasklog(message);
            callback(null, '');
        });
};

//关闭连接
// connection.end( error => {
//   if(error){
//     Tasklog(error);
//     return;
//   }
//   Tasklog( 'connection end');
// })
