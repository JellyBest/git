const cheerio = require('cheerio');
const Entities = require('html-entities').XmlEntities;
const async = require("async");
var express = require('express');
const Promise = require("promise");
const log = require('./log.js');
const util = require('./util/util.js');
const entities = new Entities();
const charset = require('superagent-charset');
const superagent = require('superagent');

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
     console.log("Task is running...");
});


charset(superagent);

const date = new Date();


let str = date.getFullYear()*10000 + (date.getMonth()+1) * 100 + date.getDate() + '';
let now = str.substring(0,4) + '-' + str.substring(4,6)+'-'+str.substring(6,8);


date.setDate(date.getDate()-7);
let sevenDaysAgoStr = date.getFullYear()*10000 + (date.getMonth()+1) * 100 + date.getDate() + '';
let sevenDaysAgo = sevenDaysAgoStr.substring(0,4) + '-' + sevenDaysAgoStr.substring(4,6)+'-'+sevenDaysAgoStr.substring(6,8);

function Spider()
{   //机构地址
    this.apiUrl = `http://data.eastmoney.com/DataCenter_V3/stock2016/DailyStockListStatistics/pagesize=9999,page=1,sortRule=-1,sortType=PBuy,startDate=${sevenDaysAgo},endDate=${now},gpfw=0,js=var%20data_tab_1.html`
    this.apiUrl2 = `http://data.eastmoney.com/DataCenter_V3/stock2016/jymx.ashx?pagesize=9999&page=1&js=var%20ExYiMTgX&param=&sortRule=-1&sortType=&gpfw=0&code=`
    
    this.mmtj = [];
    this.mapLimit = 6; //配置并发数量


    this.history = false; //为true时跑历史数据,为false时跑实时数据
    this.startData;
    this.endData;
    this.pagesize;
    this.page = 1000;
    this.dateNum = [
        {"start":"2018-01-01","end":"2018-02-01"},
        {"start":"2018-02-02","end":"2018-03-01"},
        {"start":"2018-03-02","end":"2018-04-01"},{"start":"2018-04-02","end":"2018-05-01"},
        {"start":"2018-05-02","end":"2018-06-01"},{"start":"2018-06-02","end":"2018-07-16"}
    ];
    this.urlLists;

    this.salesCodes = []
}
Spider.prototype.getUrls = function(){
    return new Promise(resolve=>{
        let urlLists = [];
        for(item of this.dateNum){
            let url = `http://data.eastmoney.com/DataCenter_V3/stock2016/DailyStockListStatistics/pagesize=9999,page=1,sortRule=-1,sortType=PBuy,startDate=${item.start},endDate=${item.end},gpfw=0,js=var%20data_tab_1.html`
            urlLists.push(url);
        }
        this.urlLists = urlLists;
        resolve(this.urlLists);
    })
}

Spider.prototype.getCodes = function (param) {
    return new Promise((resolve, reject) => {
        let SalesCodes = [];
        //let querySql = "select code from code WHERE 1=1 LIMIT 20 ";
        let querySql = "select SalesCode from mmtj_code WHERE 1=1 order by SalesCode DESC ";
        connection.query(querySql, (error, results) => {
            if (error) {
                Tasklog(error);
                reject(error);
            }
            for (let item of results) {
                SalesCodes.push(item.SalesCode);
            }
            this.salesCodes = SalesCodes;
            resolve(this.salesCodes);
        })
    })
}

Spider.prototype.getUrlsNow = function(){
    return new Promise(resolve=>{
        let urlLists = [];

        urlLists.push(this.apiUrl);
        
        for(item of this.salesCodes){
            let url = `${this.apiUrl2}${item}`;
            urlLists.push(url);
        }
        this.urlLists = urlLists;
        resolve(this.urlLists);
    })
}


Spider.prototype.getAPILoad = function(url,callback)
{
    
    superagent.get(url).charset('gb2312').end((err, res)  => {
        if(err){ 
            Tasklog('[get API error]:'+ url + '-----' +err)
            callback(null,'get url error')
            return;
        }
        Tasklog(url+'成功 getApi');
        let result = res.text.substring(res.text.indexOf('=')+1,res.text.length)
        result = JSON.parse(result)
        
        if(result.success == true){
            let dataArr = result.data;
            if(dataArr && dataArr.length > 0){
                for(item of dataArr){
                    if(!item.SalesCode) item.SalesCode = 'jgmm';
                    if(!item.SalesName) item.SalesName = '机构专用'
                    if(!item.BMoney) item.BMoney = '0.00';
                    if(!item.SMoney) item.SMoney = '0.00';
                    let chgradio = 0;
                    if(item.ChgRadio || item.Chgradio){
                        chgradio = item.ChgRadio ? item.ChgRadio : item.Chgradio;
                    }
                    let temp = [item.SalesCode, item.TDate, item.SCode, item.BMoney, item.SMoney, item.PBuy, item.CPrice, chgradio, item.SalesName, item.SName];
                    this.mmtj.push(temp);
                }
            }
        }
        if(this.mmtj.length > 0){
            insertStock([this.mmtj],callback);
            this.mmtj = [];
        }else{
            if(typeof(callback) == 'function') callback(null,' ');
        }
        
    })
}

Spider.prototype.Init = function()
{
    if(!this.history){
        this.getCodes().then(codes=>{
            this.getUrlsNow().then(urls=>{
                async.mapLimit(urls,this.mapLimit,(url,callback)=>{
                    this.getAPILoad(url,callback);
                },(err,result)=>{
                    if (err) {
                        Tasklog('Result Summary----------------------------------');
                        Tasklog(err);
                        return;
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
                })
            });
        })
        

    }else{
        this.getUrls().then(urls=>{
            async.mapLimit(urls,this.mapLimit,(url,callback)=>{
                this.getAPILoad(url,callback);
            },(err,result)=>{
                if (err) {
                    Tasklog('Result Summary----------------------------------');
                    Tasklog(err);
                    return;
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
            })
        });
    }
    
}

let spider = new Spider();
spider.Init();

function Tasklog(message) {
    let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
    log.logger.log(`[${time}] - ${message}`);
}

//插入数据
function insertStock(params1,callback) {
    let replaceSql = 'replace into mmtj(SalesCode,TDate,SCode,BMoney,SMoney,PBuy,CPrice,Chgradio,SalesName,SName) values ?';
    connection.query(replaceSql, params1,
        function (error, rows, fields) {
            if (error) {
                Tasklog(error);
                return;
            }
            let message ='mmtj ' + rows.affectedRows + '条replace完成';
            Tasklog(message)
            if(typeof(callback) == 'function') {
                callback(null, message)
            }else{
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
                });
            }
            
            
            
        });
   
};


