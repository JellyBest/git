/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-07-20 10:44:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for code_price
-- ----------------------------
DROP TABLE IF EXISTS `code_price`;
CREATE TABLE `code_price` (
  `code` char(6) NOT NULL COMMENT '股票代码',
  `name` varchar(20) NOT NULL DEFAULT '',
  `oprice` decimal(10,2) DEFAULT '0.00' COMMENT '今日开盘价',
  `cprice` decimal(10,2) DEFAULT '0.00' COMMENT '昨日收盘价',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '当前价',
  `hprice` decimal(10,2) DEFAULT NULL COMMENT '今日最高价',
  `lprice` decimal(10,2) DEFAULT '0.00' COMMENT '今日最低价',
  `date` date DEFAULT NULL COMMENT '日期',
  `time` time DEFAULT NULL COMMENT '时间',
  PRIMARY KEY (`code`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
