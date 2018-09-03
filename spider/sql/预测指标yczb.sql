/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-07-02 15:06:46
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for yczb
-- ----------------------------
DROP TABLE IF EXISTS `yczb`;
CREATE TABLE `yczb` (
  `code` varchar(6) COLLATE utf8mb4_bin NOT NULL,
  `yczb` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT '预测指标',
  `z2015` decimal(10,4) DEFAULT NULL COMMENT '2015年',
  `z2016` decimal(10,4) DEFAULT NULL COMMENT '2016年',
  `z2017` decimal(10,4) DEFAULT NULL COMMENT '2017年',
  `z2018` decimal(10,4) DEFAULT NULL COMMENT '2018年',
  `z2019` decimal(10,4) DEFAULT NULL COMMENT '2019年',
  `z2020` decimal(10,4) DEFAULT NULL COMMENT '2020年',
  `z2021` decimal(10,4) DEFAULT NULL COMMENT '2021年',
  `z2022` decimal(10,4) DEFAULT NULL COMMENT '2022年',
  PRIMARY KEY (`code`,`yczb`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
