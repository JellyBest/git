/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-07-04 11:34:47
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for yczb
-- ----------------------------
DROP TABLE IF EXISTS `yczb`;
CREATE TABLE `yczb` (
  `code` varchar(6) COLLATE utf8mb4_bin NOT NULL,
  `rq` varchar(15) COLLATE utf8mb4_bin NOT NULL COMMENT '预测指标-时间段',
  `mgsy` decimal(10,4) DEFAULT NULL COMMENT '每股收益(元)',
  `syycmgsy` decimal(10,4) DEFAULT NULL COMMENT '上一个月预测每股收益(元)',
  `mgjzc` decimal(10,4) DEFAULT NULL COMMENT '每股净资产(元)',
  `jzcsyl` decimal(10,4) DEFAULT NULL COMMENT '净资产收益率(%)',
  `jlr` decimal(10,4) DEFAULT NULL COMMENT '归属于母公司股东的净利润(元)',
  `jlrdw` varchar(15) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '净利润单位-亿',
  `yyzsr` decimal(10,4) DEFAULT NULL COMMENT '营业总收入(元)',
  `zsrdw` varchar(15) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '总收入单位-亿',
  `yylr` decimal(10,4) DEFAULT NULL COMMENT '营业利润(元)',
  `lrdw` varchar(15) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '利润单位-亿',
  PRIMARY KEY (`code`,`rq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
