/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-06-29 14:50:55
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for code_dp
-- ----------------------------
DROP TABLE IF EXISTS `code_dp`;
CREATE TABLE `code_dp` (
  `code` char(6) NOT NULL COMMENT '股票代码',
  `name` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`code`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of code_dp
-- ----------------------------
INSERT INTO `code_dp` VALUES ('000001', '上证指数');
INSERT INTO `code_dp` VALUES ('399001', '深证成指');
INSERT INTO `code_dp` VALUES ('399005', '中小板');
INSERT INTO `code_dp` VALUES ('399006', '创业板');
INSERT INTO `code_dp` VALUES ('399300', '沪深300');
