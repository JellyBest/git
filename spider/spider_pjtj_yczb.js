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
    this.pjtj = [];
    this.yctj = [];
    this.apiUrl = 'http://emweb.securities.eastmoney.com/PC_HSF10/ProfitForecast/ProfitForecastAjax?code=';
    this.count = 20; //配置多少条code插入数据库一次
    this.mapLimit = 5; //配置并发数量
    this.codeList = [];
}

Spider.prototype.getCodes = function()
{
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
                item.code = util.GetMktByCode(item.code) + item.code
                symbols.push(item.code);
            }
            resolve(symbols);
            console.log("Task is running...");
        })
    })
}

Spider.prototype.getAPILoad = function(code, callback)
{
    let url = `${this.apiUrl}${code}`;
    
    superagent.get(url).end((err, res)  => {
        if(err){ 
            Tasklog('[get API error]:'+ url + '-----' +err)
            callback(null,'get url error')
            return;
        }
        Tasklog(url+'成功 getApi');
        this.codeList.push(code);
        res = JSON.parse(res.text);
        if(res.Status == 0){
            let result = res.Result;
            let pjtjArr = res.Result.pjtj;
            let yctjArr = res.Result.yctj.data;
            // this.pjtj = res.Result.pjtj
            code = code.substring(2,8);
            if(pjtjArr != null){
                for(item of pjtjArr){
                    let temp = [code, item.sjd, item.pjxs, item.zhpj, item.mr, item.zc, item.zx, item.jc, item.mc, item.zjs];
                    this.pjtj.push(temp);
                }
            }
            if(yctjArr != null){
                for(item of yctjArr){
                    let rq = item.rq;
                    let mgsy = item.mgsy != '--' ? parseFloat(item.mgsy) : '0';
                    let syycmgsy = item.syycmgsy != '--' ? parseFloat(item.syycmgsy) : '0';
                    let mgjzc = item.mgjzc != '--' ? parseFloat(item.mgjzc) : '0';
                    let jzcsyl = item.jzcsyl != '--' ? parseFloat(item.jzcsyl) : '0';
                    let jlr = item.jlr != '--' ? parseFloat(item.jlr) : '0';
                    let jlrdw = item.jlr != '--' ? item.jlr.match(/[\u4e00-\u9fa5]/)[0] : '--';
                    let yyzsr = item.yyzsr != '--' ? parseFloat(item.yyzsr) : '0';
                    let zsrdw = item.yyzsr != '--' ? item.yyzsr.match(/[\u4e00-\u9fa5]/)[0] : '--';
                    let yylr = item.yylr != '--' ? parseFloat(item.yylr) : '0';
                    let lrdw = item.yylr != '--' ? item.yylr.match(/[\u4e00-\u9fa5]/)[0] : '--';
                   
                    let yctjTemp = [code, rq, mgsy, syycmgsy, mgjzc, jzcsyl, jlr, jlrdw, yyzsr, zsrdw, yylr, lrdw];
                    this.yctj.push(yctjTemp)
                    // console.log(yctjTemp)
                }
            }
            // console.log(this.pjtj);
            if(this.codeList.length % this.count == 0){
                
                insertStock([this.pjtj],[this.yctj],callback);
                this.yctj = [];
                this.pjtj = [];
                this.codeList = [];
            }else{
                callback(null,'ok');
            }
            
        }
    })
}

Spider.prototype.Init = function()
{
    this.getCodes().then(codes => {
        async.mapLimit(codes,this.mapLimit,(code,callback)=>{
            this.getAPILoad(code,callback);
        },(err,result)=>{
            if (err) {
                Tasklog('Result Summary----------------------------------');
                Tasklog(err);
                return;
            }
            // console.log([this.pjtj])
            insertStock([this.pjtj],[this.yctj],null,true)
            // Tasklog(this.pjtj);
        })
    })
}

let spider = new Spider();
spider.Init();

function Tasklog(message) {
    let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
    log.logger.log(`[${time}] - ${message}`);
}

//插入数据
function insertStock(params1,params2, callback,flag) {
    let replaceSql = 'replace into pjtj(code,sjd,pjxs,zhpj,mr,zc,zx,jc,mc,zjs) values ?';
    if(params1[0].length > 0 && params2[0].length > 0){
        connection.query(replaceSql, params1,
            function (error, rows, fields) {
                if (error) {
                    Tasklog(error);
                    return;
                }
                let message ='pjtj ' + rows.affectedRows + '条replace完成';
                //callback(null, message);
                Tasklog(message);
    
                let yczbSql = 'replace into yczb(code, rq, mgsy, syycmgsy, mgjzc, jzcsyl, jlr, jlrdw, yyzsr, zsrdw, yylr, lrdw) values ?'
                connection.query(yczbSql,params2,function(error, rows, fields){
                    if(error){
                        Tasklog(error);
                        return;
                    }
                    let message ='yczb ' + rows.affectedRows + '条replace完成';
                    Tasklog(message);
    
                    if(flag){
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
                    }
                    if(callback){
                        callback(null,' ')
                    }
    
                })
    
    
                
                
            });
    }
    if(params1[0].length > 0 && params2[0].length == 0){
        connection.query(replaceSql, params1,
            function (error, rows, fields) {
                if (error) {
                    Tasklog(error);
                    return;
                }
                let message ='pjtj ' + rows.affectedRows + '条replace完成';
                //callback(null, message);
                Tasklog(message);
                // let yczbSql = 'replace into yczb(code, rq, mgsy, syycmgsy, mgjzc, jzcsyl, jlr, jlrdw, yyzsr, zsrdw, yylr, lrdw) values ?'
                // connection.query(yczbSql,params2,function(error, rows, fields){
                //     if(error){
                //         Tasklog(error);
                //         return;
                //     }
                    // let message ='yczb ' + rows.affectedRows + '条replace完成';
                    // Tasklog(message);
    
                    if(flag){
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
                    }
                    if(callback){
                        callback(null,' ')
                    }
                // })
            });
    }
    if(params1[0].length == 0 && params2[0].length > 0){
        // connection.query(replaceSql, params1,
        //     function (error, rows, fields) {
        //         if (error) {
        //             Tasklog(error);
        //             return;
        //         }
                let message ='pjtj ' + rows.affectedRows + '条replace完成';
                Tasklog(message);
                let yczbSql = 'replace into yczb(code, rq, mgsy, syycmgsy, mgjzc, jzcsyl, jlr, jlrdw, yyzsr, zsrdw, yylr, lrdw) values ?'
                connection.query(yczbSql,params2,function(error, rows, fields){
                    if(error){
                        Tasklog(error);
                        return;
                    }
                    let message ='yczb ' + rows.affectedRows + '条replace完成';
                    Tasklog(message);
    
                    if(flag){
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
                    }
                    if(callback){
                        callback(null,' ')
                    }
                })
            // });
    }
    
   
};


