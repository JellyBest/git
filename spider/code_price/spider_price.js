const request = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Entities = require('html-entities').XmlEntities;
const async = require("async");
var express = require('express');
const Promise = require("promise");
const log = require('./log.js');
var app = express();

const util = require('./util/util.js');

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
function getAPILoad(symbols,callback) {
    let codelist = util.GetMktByCodeList(symbols);
    let codelistStr = codelist.join(',')
    
    let url = 'http://hq.sinajs.cn/list=' + codelistStr;
    Tasklog(url)
    superagent.get(url).charset('GBK').buffer(true).end((err, res) => {

        if (err) {
            let errMessage = url + ' error Status: ' + err.status;
            Tasklog(errMessage);
            callback(null, 'Get url err.');
        } else {
            let arr = res.text.split(';');//字符串转数组
            // let params = [symbol,arr[0],arr[1],arr[2],arr[3],arr[4],];
            arr.pop();
            let resultList = [];
            for(let item of arr){
                // let temp = {
                //     code:'',
                //     result:[]
                // };
                let code = item.substr(item.indexOf('=')-6,6);
                let arr = item.substring(item.indexOf('=')+1,item.length).split(',');
                let params = [code,arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[30],arr[31]];
                resultList.push(params);
                
            }
            // console.log(resultList,'k')
            insertStock([resultList],callback)
            

        }
    })

}

// 获取股票代码集合
function getSymbols() {
    return new Promise((resolve, reject) => {
        let symbols = [];
        //let querySql = "select code from code WHERE 1=1 LIMIT 20 ";
        let querySql = "select code from code WHERE 1=1 order by code DESC";
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
    let number = 800
    // 895为限制数
    let arrNum = parseInt(symbols.length/number);
    let arrs = [];
    for(let i = 0 ;i < arrNum; i++){
        let arr = [];
        arr = symbols.slice(i*number,i*number + number);
        arrs.push(arr)
    }
    if(symbols.length > arrNum*number){
        let arr = symbols.slice(arrNum*number,symbols.length);
        arrs.push(arr)
    }
    async.mapLimit(arrs, 10,
        function (symbols, callback) {
            getAPILoad(symbols, callback)
        },

        function (err, result) {
            if (err) {
                Tasklog('Result Summary----------------------------------');
                Tasklog(err);
            }

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

function insertStock(params,callback) {
    let addStock = 'replace into code_price(code,name,oprice,cprice,price,hprice,lprice,date,time) values ?';
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


