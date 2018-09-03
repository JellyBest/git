// import xlsx from 'node-xlsx';
var xlsx = require('node-xlsx').default;
var fs = require("fs");
 
// Parse a buffer
const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/op1.xlsx`));
// Parse a file
const workSheetsFromFile = xlsx.parse(`${__dirname}/op1.xlsx`);
// console.log(workSheetsFromBuffer,'buffer');
// console.log(workSheetsFromFile,'file');
var excelObj = workSheetsFromFile[1].data;
// console.log(excelObj[1][0])
var symbols = [];
for(var i = 1; i<excelObj.length; i++){
    symbols.push(excelObj[i][0]);
}
// console.log(symbols);
module.exports = symbols;
