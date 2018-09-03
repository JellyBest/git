/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-07-10 22:34:46
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for mmtj_url
-- ----------------------------
DROP TABLE IF EXISTS `mmtj_url`;
CREATE TABLE `mmtj_url` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL COMMENT '营业部代码',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据存入数据库的日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of mmtj_url
-- ----------------------------
-- INSERT INTO `mmtj_url` VALUES ('1', 'http://data.eastmoney.com/stock/jgmmtj.html', '2018-07-10 22:34:01');
-- INSERT INTO `mmtj_url` VALUES ('2', 'http://data.eastmoney.com/stock/lhb/yyb/80032107.html', '2018-07-10 22:34:01');
-- INSERT INTO `mmtj_url` VALUES ('3', 'http://data.eastmoney.com/stock/lhb/yyb/80090067.html', '2018-07-10 22:34:01');
-- INSERT INTO `mmtj_url` VALUES ('4', 'http://data.eastmoney.com/stock/lhb/yyb/80144552.html', '2018-07-10 22:34:01');
-- INSERT INTO `mmtj_url` VALUES ('5', 'http://data.eastmoney.com/stock/lhb/yyb/80144552.html', '2018-07-10 22:34:01');
-- INSERT INTO `mmtj_url` VALUES ('6', 'http://data.eastmoney.com/stock/lhb/yyb/80033815.html', '2018-07-10 22:34:01');
-- INSERT INTO `mmtj_url` VALUES ('7', 'http://data.eastmoney.com/stock/lhb/yyb/80033815.html', '2018-07-10 22:34:01');
-- INSERT INTO `mmtj_url` VALUES ('8', 'http://data.eastmoney.com/stock/lhb/yyb/80190854.html', '2018-07-10 22:34:01');
-- INSERT INTO `mmtj_url` VALUES ('9', 'http://data.eastmoney.com/stock/lhb/yyb/80034850.html', '2018-07-10 22:34:01');

INSERT INTO `mmtj_url` VALUES ('1', 'http://data.eastmoney.com/DataCenter_V3/stock2016/DailyStockListStatistics/pagesize=50,page=1,sortRule=-1,sortType=PBuy,startDate=2018-07-10,endDate=2018-07-10,gpfw=0,js=var%20data_tab_1.html');
INSERT INTO `mmtj_url` VALUES ('2', 'http://data.eastmoney.com/DataCenter_V3/stock2016/jymx.ashx?pagesize=50&page=1&sortRule=-1&gpfw=0&code=80032107');
INSERT INTO `mmtj_url` VALUES ('3', 'http://data.eastmoney.com/DataCenter_V3/stock2016/jymx.ashx?pagesize=50&page=1&js=var%20lwaqjwLI&param=&sortRule=-1&sortType=&gpfw=0&code=80090067', '2018-07-10 22:34:01');
INSERT INTO `mmtj_url` VALUES ('4', 'http://data.eastmoney.com/DataCenter_V3/stock2016/jymx.ashx?pagesize=50&page=1&js=var%20EJwbzgEU&param=&sortRule=-1&sortType=&gpfw=0&code=80144552', '2018-07-10 22:34:01');
INSERT INTO `mmtj_url` VALUES ('5', 'http://data.eastmoney.com/stock/lhb/yyb/80144552.html', '2018-07-10 22:34:01');
INSERT INTO `mmtj_url` VALUES ('6', 'http://data.eastmoney.com/stock/lhb/yyb/80033815.html', '2018-07-10 22:34:01');
INSERT INTO `mmtj_url` VALUES ('7', 'http://data.eastmoney.com/stock/lhb/yyb/80033815.html', '2018-07-10 22:34:01');
INSERT INTO `mmtj_url` VALUES ('8', 'http://data.eastmoney.com/stock/lhb/yyb/80190854.html', '2018-07-10 22:34:01');
INSERT INTO `mmtj_url` VALUES ('9', 'http://data.eastmoney.com/stock/lhb/yyb/80034850.html', '2018-07-10 22:34:01');
