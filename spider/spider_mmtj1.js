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
});


charset(superagent);

function Spider()
{
    this.codes = [];
    this.mmtj = [];
    this.apiUrl = 'http://data.eastmoney.com/DataCenter_V3/stock2016/DailyStockListStatistics/pagesize=50,page=1,sortRule=-1,sortType=PBuy,startDate=2018-07-16,endDate=2018-07-16,gpfw=0,js=var%20data_tab_1.html';
    this.count = 20; //配置多少条code插入数据库一次
    this.mapLimit = 5; //配置并发数量
    this.codeList = [];

    this.startData;
    this.endData;
    this.pagesize;
    this.page = 1000;
    this.dateNum = [
        {"start":"2018-01-01","end":"2018-02-01"},{"start":"2018-02-02","end":"2018-03-01"},
        {"start":"2018-03-02","end":"2018-04-01"},{"start":"2018-04-02","end":"2018-05-01"},
        {"start":"2018-05-02","end":"2018-06-01"},{"start":"2018-06-02","end":"2018-07-16"}
    ];
    this.urlLists;
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

// Spider.prototype.getCodes = function()
// {
//     return new Promise((resolve, reject) => {
//         let symbols = [];
//         //let querySql = "select code from code WHERE 1=1 LIMIT 20 ";
//         let querySql = "select code from code WHERE 1=1 order by code DESC";
//         connection.query(querySql, (error, results) => {
//             if (error) {
//                 Tasklog(error);
//                 reject(error);
//             }
//             for (let item of results) {
//                 item.code = util.GetMktByCode(item.code) + item.code
//                 symbols.push(item.code);
//             }
//             resolve(symbols);
//             console.log("Task is running...");
//         })
//     })
// }
// CREATE TABLE `mmtj` (
//     `SalesCode` varchar(255) NOT NULL COMMENT '营业部代码',
//     `TDate` date NOT NULL COMMENT '日期',
//     `SCode` char(6) NOT NULL COMMENT '股票代码',
//     `BMoney` decimal(20,2) DEFAULT '0.00' COMMENT '买入额',
//     `SMoney` decimal(20,2) DEFAULT '0.00' COMMENT '卖出总额',
//     `PBuy` decimal(20,2) DEFAULT '0.00' COMMENT '买卖净额',
//     `CPrice` decimal(10,2) DEFAULT '0.00' COMMENT '收盘价',
//     `Chgradio` decimal(10,2) DEFAULT '0.00' COMMENT '收盘涨跌幅%',
//     `SalesName` varchar(255) DEFAULT NULL COMMENT '营业部名称',
//     `SName` varchar(255) DEFAULT NULL COMMENT '股票名称',
//     `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据存入数据库的日期',
//     PRIMARY KEY (`SalesCode`,`TDate`,`SCode`)
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
// (SalesCode,TDate,SCode,BMoney,SMoney,PBuy,CPrice,Chgradio,SalesName,SName)

Spider.prototype.getAPILoad = function(url,callback)
{
    // let url = this.apiUrl;
    
    superagent.get(url).charset('gb2312').end((err, res)  => {
        if(err){ 
            Tasklog('[get API error]:'+ url + '-----' +err)
            callback(null,'get url error')
            return;
        }
        Tasklog(url+'成功 getApi');
        let result = res.text.substring(15,res.text.length)
        result = JSON.parse(result)
        console.log(result ,"测试1");
        
        if(result.success == true){
            let dataArr = result.data;
            if(dataArr && dataArr.length > 0){
                for(item of dataArr){
                    let temp = ['jgmm', item.TDate, item.SCode, item.BMoney, item.SMoney, item.PBuy, item.CPrice, item.Chgradio, "机构专用", item.SName];
                    this.mmtj.push(temp);
                }
            }
        }
        if(this.mmtj.length > 0){
            insertStock([this.mmtj],callback);
        }else{
            callback(null,' ');
        }
        
        return;


        // this.codeList.push(code);
        // res = JSON.parse(res.text);
        // if(res.Status == 0){
        //     let result = res.Result;
        //     let pjtjArr = res.Result.pjtj;
        //     let yctjArr = res.Result.yctj.data;
        //     // this.pjtj = res.Result.pjtj
        //     code = code.substring(2,8);
        //     if(pjtjArr != null){
        //         for(item of pjtjArr){
        //             let temp = ['jgmm', item.sjd, item.pjxs, item.zhpj, item.mr, item.zc, item.zx, item.jc, item.mc, item.zjs];
        //             this.pjtj.push(temp);
        //         }
        //     }
            
        //     if(this.codeList.length % this.count == 0){
                
        //         insertStock([this.pjtj],[this.yctj],callback);
        //         this.yctj = [];
        //         this.pjtj = [];
        //         this.codeList = [];
        //     }else{
        //         callback(null,'ok');
        //     }
            
        // }
    })
}

Spider.prototype.Init = function()
{
    this.getUrls().then(urls=>{
        async.mapLimit(urls,this.mapLimit,(url,callback)=>{
            this.getAPILoad(url,callback);
        },(err,result)=>{
            if (err) {
                Tasklog('Result Summary----------------------------------');
                Tasklog(err);
                return;
            }
            // console.log([this.pjtj])
            // insertStock([this.pjtj],[this.yctj],null,true)
            // Tasklog(this.pjtj);
        })
    }

    )
        
            this.getAPILoad();
        
    
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
            //callback(null, message);
            Tasklog(message);
            
            
        });
   
};


