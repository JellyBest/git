const cheerio = require('cheerio');
const Entities = require('html-entities').XmlEntities;
// const async = require("async");
var express = require('express');
// const Promise = require("promise");
const log = require('./log.js');
var app = express();


// 连接数据库
const conn = require('./connect.js')
conn.handleDisconnection();
var connection = conn.connection;


const entities = new Entities();

const charset = require('superagent-charset');
const superagent = require('superagent');
charset(superagent);

function getAPILoad() 
{
    let url = 'http://www.gupiaodadan.com/buy-sell-home';
    superagent.get(url).charset('gb2312').end((err, res) => {
        if (err) {
            let errMessage = url + ' error Status: ' + err.status;
            Tasklog(errMessage);
            callback(null, 'Get url err.');
        } else {
            // let code = symbol;
            const $ = cheerio.load(res.text, {
                decodeEntities: true,
            });
            let tableData = [];
            $('#main_content_new2 #emailelert').each(function () {
                let code = '';
                switch($(this).index()){
                    case 0:
                        code = '000001';
                        break;
                    case 1:
                        code = '399001';
                        break;
                    case 2:
                        code = '399300';
                        break;
                    case 3:
                        code = '399005';
                        break;
                    case 4:
                        code = '399006';
                        break;
                }
                $(this).find('table tr').each(function () {
                    if($(this).index() > 0){
                        let trData = [];
                        let text = "";
                        let temp = [];
                        $(this).find('td').each(function(){
                                if ($(this).text() == '买入') {
                                    temp.push('buy');
                                } else if ($(this).text() == '卖出') {
                                    temp.push('sell');
                                } else if (!$(this).text()) {
                                    temp.push('0.00');
                                } else {
                                    temp.push($(this).text().replace(/\s/g, ''));
                                }
                            // console.log($(this).text())
                        })
                        trData = [code, temp[0], temp[5], temp[1], temp[2], temp[3], temp[4], temp[6], temp[7]];
                        tableData.push(trData);
                    }
                })
            })
            if (tableData.length > 0) {
                insertStock([tableData]);
            } else {
                Tasklog(url + '  No data.');
            }
        }  
    })
}


//插入数据
function insertStock(params) 
{
    let addStock = 'replace into history_dp(code,date,op,first,last,high,low,price,roi) values ?';
    connection.query(addStock, params,
        function (error, rows, fields) {
            if (error) {
                Tasklog(error);
                return;
            }
            let message = rows.affectedRows + '条replace完成';
            Tasklog(message);
            

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
            })
        });
};

function Tasklog(message) 
{
    let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
    log.logger.log(`[${time}] - ${message}`);
}

getAPILoad();
