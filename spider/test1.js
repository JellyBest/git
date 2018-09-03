const http = require('http');
const https = require('https');
const fs = require('fs');
const mysql = require('mysql');

const options = {
    key: fs.readFileSync('./privkey.pem'),
    cert: fs.readFileSync('./fullchain.pem')
}

const express = require('express');
const bodyParser = require('body-parser');
const app = express();


let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '!!!vutoys',
    database : 'dadan',
    timezone:  "08:00"

});
connection.connect();

let sql = "SELECT b.name,a.*,'' as 'sgt'  FROM history as a , code as b WHERE a.code= b.code and a.code=?" + "ORDER BY date DESC";

function querySql(code,callback){
    connection.query(sql,[code],(error,results)=>{
        if(error){
            console.log('[SELECT ERROR] - ',error.message);
        }
        console.log(results);
        callback(results);
    })
}

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.json({test:"test js"})
})
app.post('/query',(req,res)=>{
    console.log(req.body)
    let code = req.body.code;
	
	
    querySql(code,data=>{
       var myDate1 = new Date(data[0].date);//获取系统当前时间
       var myDate2 = new Date();//获取系统当前时间
  if(data[0].op == "buy"){
    if (myDate1 < myDate2){ data[0].sgt = "继续持有"; }else { data[0].sgt = "持有"; } }		
  if(data[0].op == "sell"){
    if (data[0].roi > 0){ data[0].sgt = "逢高止盈"; }else { data[0].sgt = "逢高止损"; } }
	    console.log(data[0]);
        res.json({errorCode:0,results:data,message:'请求成功'})
    })
})

https.createServer(options,app).listen(443);
console.log("https,Port:443,test js running")


//获取当前时间，格式YYYY-MM-DD
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }