/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-06-29 14:51:01
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for history_dp
-- ----------------------------
DROP TABLE IF EXISTS `history_dp`;
CREATE TABLE `history_dp` (
  `code` char(6) NOT NULL,
  `date` date NOT NULL COMMENT '日期',
  `op` enum('sell','buy') NOT NULL COMMENT '操作',
  `first` decimal(10,2) NOT NULL COMMENT '开盘价',
  `last` decimal(10,2) NOT NULL COMMENT '收盘价',
  `high` decimal(10,2) NOT NULL COMMENT '最高价',
  `low` decimal(10,2) NOT NULL COMMENT '最低价',
  `price` decimal(10,2) NOT NULL COMMENT '(买入/卖出)价格',
  `roi` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '收益率(%)',
  PRIMARY KEY (`code`,`date`,`op`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of history_dp
-- ----------------------------
