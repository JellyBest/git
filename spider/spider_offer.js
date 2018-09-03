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
const conn = require('./connect.js')
conn.handleDisconnection();
var connection = conn.connection;

// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'jelly520',
//     database: 'teststock',
//     timezone: "08:00"
// });

// connection.connect(err => {
//     console.log('Task -- Start');
//     Tasklog('Task -- Start');
//     if (err) {
//         Tasklog(err);
//         return;
//     }
//     console.log("Connected MySql...");
//     Tasklog("Connected MySql.");
//      console.log("Task is running...");
// });


charset(superagent);

const date = new Date();


let str = date.getFullYear()*10000 + (date.getMonth()+1) * 100 + date.getDate() + '';
let now = str.substring(0,4) + '-' + str.substring(4,6)+'-'+str.substring(6,8);


date.setDate(date.getDate()-7);
let sevenDaysAgoStr = date.getFullYear()*10000 + (date.getMonth()+1) * 100 + date.getDate() + '';
let sevenDaysAgo = sevenDaysAgoStr.substring(0,4) + '-' + sevenDaysAgoStr.substring(4,6)+'-'+sevenDaysAgoStr.substring(6,8);

function Spider()
{   
    this.apiUrl = `https://www.amazon.com/gp/offer-listing/B072J4CBK6`;
    this.params = [];
    
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




Spider.prototype.getAPILoad = function(url,callback)
{   
    let _this = this;
    superagent.get(url).end((err, res)  => {
        if(err){ 
            Tasklog('[get API error]:'+ url + '-----' +err)
            callback(null,'get url error')
            return;
        }
        Tasklog(url+'成功 getApi');
        // console.log(res.text,'res.text');
        const $ = cheerio.load(res.text, {
            decodeEntities: true,
        });
        $(".olpOffer").each(function(){
            let name = $(this).find('.olpSellerName a').text();
            let href = $(this).find('.olpSellerName a').attr('href');
            let sellerurl = `https://www.amazon.com${href}`;
            // console.log(name,sellerurl)
            let temp = [url,name,sellerurl]
            _this.params.push(temp);
        })
        console.log(this.params,'params')
        if(this.params.length > 0){
            insertStock([this.params]);
        }

        
        // if(this.mmtj.length > 0){
        //     insertStock([this.mmtj],callback);
        //     this.mmtj = [];
        // }else{
        //     if(typeof(callback) == 'function') callback(null,' ');
        // }
        
    })
}

Spider.prototype.Init = function()
{
    this.getAPILoad(this.apiUrl);
    // this.getCodes().then(codes=>{
    //     this.getUrlsNow().then(urls=>{
    //         async.mapLimit(urls,this.mapLimit,(url,callback)=>{
    //             this.getAPILoad(url,callback);
    //         },(err,result)=>{
    //             if (err) {
    //                 Tasklog('Result Summary----------------------------------');
    //                 Tasklog(err);
    //                 return;
    //             }
    //             // 关闭连接
    //             connection.end( error => {
    //                 if(error){
    //                     Tasklog(error);
    //                     return;
    //                 }
    //                 Tasklog( 'connection end');
    //                 console.log('connection end');
    //                 Tasklog('Task -- End');
    //                 console.log('Task -- End');
    //             });
    //         })
    //     });
    // })
}

let spider = new Spider();
spider.Init();

function Tasklog(message) {
    let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
    log.logger.log(`[${time}] - ${message}`);
}

//插入数据
function insertStock(params,callback) {
    let replaceSql = 'replace into sellerlist(offerlist,sellername,sellerurl) values ?';
    connection.query(replaceSql, params,
        function (error, rows, fields) {
            if (error) {
                Tasklog(error);
                return;
            }
            let message = rows.affectedRows + '条replace完成';
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


