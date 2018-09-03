/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-07-04 11:14:29
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for pjtj
-- ----------------------------
DROP TABLE IF EXISTS `pjtj`;
CREATE TABLE `pjtj` (
  `code` char(6) NOT NULL,
  `sjd` varchar(5) NOT NULL COMMENT '时间段',
  `pjxs` decimal(10,2) DEFAULT '0.00' COMMENT '评级系数',
  `zhpj` varchar(4) DEFAULT NULL COMMENT '综合评级',
  `mr` int(9) DEFAULT NULL COMMENT '买入',
  `zc` int(9) DEFAULT NULL COMMENT '增持',
  `zx` int(9) DEFAULT NULL COMMENT '中性',
  `jc` int(9) DEFAULT NULL COMMENT '减持',
  `mc` int(9) DEFAULT NULL COMMENT '卖出',
  `zjs` int(9) DEFAULT NULL COMMENT '总家数',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据存入数据库的日期',
  PRIMARY KEY (`code`,`sjd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
