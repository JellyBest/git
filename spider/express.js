/*
* @Author: Jelly
* @Date:   2018-05-20 10:42:17
* @Last Modified by:   Jelly
* @Last Modified time: 2018-05-20 14:00:37
*/

//连接数据库
var mysql = require('mysql');
var connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'jelly520',
  database  : 'stock_info'
});
connection.connect(err => {
  if(err){
    console.log(err)
    return;
  }
    console.log("connected!")
});



var express = require('express');
var app = express();

var bodyParser = require('body-parser')
// 处理请求参数
// 挂载参数处理中间件（post）
app.use(bodyParser.urlencoded({ extended: false }));
// 处理json格式的参数
app.use(bodyParser.json());
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    // console.log(res)
  res.json({ err_code: 200, message:'hello' })
});
app.post('/getInfo',(req,res)=>{
    const data = req.body;
    var symbol = data.symbol;
    connection.query("SELECT * FROM stocks where code=?",[symbol],(error,results)=>{
        if(error) console.log(error);
        console.log(results,'re')
        res.json({err_code: 0, message: '恭喜成功', results: results})
    })

})
app.listen(3000);