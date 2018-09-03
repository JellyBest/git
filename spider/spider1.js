const request = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Entities = require('html-entities').XmlEntities;
const async = require("async");
var express = require('express');
const Promise = require("promise");
const log = require('./log.js');
var app = express();
// var fs = require("fs");
// var read_xlsx = require("read_xlsx");
// var symbols =require("./excel.js");
//连接数据库
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jelly520',
  database: 'teststock',
  timezone: "08:00"
});

connection.connect(err => {
  console.log('task -- start')
  if (err) {
    console.log('mysql connect error:', err)
    return;
  }
  console.log("connected mysql!")
});

const weather_url = 'http://rss.weather.gov.hk/rss/CurrentWeather_uc.xml';
const WEATHER_WARN_URL = 'http://www.gupiaodadan.com/buy-sell-601336';



const entities = new Entities();

const charset = require('superagent-charset');
const superagent = require('superagent');
charset(superagent);
let errCode = [];
function getAPILoad(symbol, callback) {
  //  errCode = [];
  let url = 'http://www.gupiaodadan.com/buy-sell-' + symbol;
  superagent.get(url).charset('gb2312').end((err, res) => {
    
    if (err) {
      // console.log(url);
      let errMessage = url + ' error Status: ' + err.status;
      logError(errMessage);
      callback(null,err.status)
    } else {
      console.log(url);
      let code = symbol;
      // console.log('--------------->', res.text);
      const $ = cheerio.load(res.text, {
        decodeEntities: true,
      });
      let allValues = [];
      $('.tablecontent tr').each(function () {
        // console.log($(this).index())

        if ($(this).index() > 0) {
          let params = [];

          let text = "";
          let temp = [];
          $(this).find('td').each(function () {
            // text += $(this).text().replace(/\s/g, '') + " "
            if ($(this).text() == '买入') {
              temp.push('buy');
            } else if ($(this).text() == '卖出') {
              temp.push('sell');
            }
            else if (!$(this).text()) {
              //temp.push(null);
              temp.push('0');
            }
            else {
              temp.push($(this).text().replace(/\s/g, ''));
            }

          })
          // console.log(temp,"temp")
          if (temp.length > 0) {
            params = [code, temp[0], temp[5], temp[1], temp[2], temp[3], temp[4], temp[6], temp[7]];
            allValues.push(params);
          }
        }
      });
      if(allValues.length > 0){
        insertStock([allValues],callback);
      }else{
        logError(url + '  页面无相关数据');
        callback(null,'bug')
      }
    }
    
  })
  

}

// 获取股票代码集合
function getSymbols() {
  return new Promise((resolve, reject) => {
    let symbols = [];
    let querySql = "select code from code";
    connection.query(querySql, (error, results) => {
      if (error) {
        logError(error);
        reject(error);
        return;
      }
      // console.log(results,'queryresult')
      for (let item of results) {
        symbols.push(item.code);
      }
      resolve(symbols);
    })
  })
}

function logError(message){
  let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
  log.logger.error(`[${time}] - ${message}`);
}

// 从数据库获取symbols
getSymbols().then(symbols => {
  logError(symbols);
  async.mapLimit(symbols, 10,
    function (symbol, callback) {
      getAPILoad(symbol, callback)
    }, function (err, result) {
      console.log('11111111111111')
      if (err) {
        console.log(err, 'maperr');
      }
      console.log(result)
      console.log('task -- end')
    })
});

// async.mapLimit(symbols, 10,
//   function (symbol, callback) {
//     getAPILoad(symbol, callback)
//   }, function (err, result) {
//     console.log('11111111111111')
//     if (err) {
//       console.log(err, 'maperr');
//     }
//     console.log(result)
//     console.log('task -- end')
//   })


//插入数据
function insertStock(params,callback) {

  // var delArr = [];
  //先按爬回来的数据去删除数据库
  // for (var L1 = 0; L1 < params[0].length; L1++) {
  //   var delSymbol = [params[0][L1][0], params[0][L1][1], params[0][L1][2]]
  //   delArr.push(delSymbol);
  // }

  // let str = JSON.stringify(delArr);
  // str = str.replace(/\[/g, '(');
  // str = str.replace(/\]/g, ')');
  
  // if (delArr.length > 0) {
  //   let DelStock = "DELETE FROM history WHERE (code,date,op) in " + str;
  //   connection.query(DelStock, (error, results) => {
  //     if (error) {
  //       console.log('[DEL ERROR] - ', DelStock, error.message);
  //     }
  //     console.log(delArr[0][0], 'DELETE affectedRows', results.affectedRows);
  //   });
  // }

  console.log(params[0][0])
  let addStock = 'replace into history(code,date,op,first,last,high,low,price,roi) values ?';
  connection.query(addStock, params, function (error, rows, fields) {
    if (error) {
      // console.log('[insert error]', error);
      logError('[insert error]'+error);
    }else{
      console.log(params[0][0][0],'执行完成');
      // let message = params[0][0][0] + ' ' +  rows.affectedRows + '条replace完成';
      // console.log(message)
    }
    callback(null,'ok')
    // console.log(params[0][0][0], rows.affectedRows+'条replace完成');
    
  });

};


//关闭连接
// connection.end( error => {
//   if(error){
//     console.log(error);
//     return;
//   }
//   console.log( 'connection end');
// })