/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-07-02 15:06:41
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
  `mair` int(9) DEFAULT NULL COMMENT '买入',
  `zhec` int(9) DEFAULT NULL COMMENT '增持',
  `zhox` int(9) DEFAULT NULL COMMENT '中性',
  `jianc` int(9) DEFAULT NULL COMMENT '减持',
  `maic` int(9) DEFAULT NULL COMMENT '卖出',
  `zji` int(9) DEFAULT NULL COMMENT '总家数',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据存入数据库的日期',
  PRIMARY KEY (`code`,`sjd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
