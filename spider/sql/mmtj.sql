/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-07-10 22:34:38
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for mmtj
-- ----------------------------
DROP TABLE IF EXISTS `mmtj`;
CREATE TABLE `mmtj` (
  `SalesCode` varchar(255) NOT NULL COMMENT '营业部代码',
  `TDate` date NOT NULL COMMENT '日期',
  `SCode` char(6) NOT NULL COMMENT '股票代码',
  `BMoney` decimal(20,2) DEFAULT '0.00' COMMENT '买入额',
  `SMoney` decimal(20,2) DEFAULT '0.00' COMMENT '卖出总额',
  `PBuy` decimal(20,2) DEFAULT '0.00' COMMENT '买卖净额',
  `CPrice` decimal(10,2) DEFAULT '0.00' COMMENT '收盘价',
  `Chgradio` decimal(10,2) DEFAULT '0.00' COMMENT '收盘涨跌幅%',
  `SalesName` varchar(255) DEFAULT NULL COMMENT '营业部名称',
  `SName` varchar(255) DEFAULT NULL COMMENT '股票名称',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据存入数据库的日期',
  PRIMARY KEY (`SalesCode`,`TDate`,`SCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
