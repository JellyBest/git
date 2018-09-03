/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-08-03 15:15:19
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sellerlist
-- ----------------------------
DROP TABLE IF EXISTS `sellerlist`;
CREATE TABLE `sellerlist` (
  `id` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `offerlist` char(255) DEFAULT NULL COMMENT '要爬取的URL',
  `sellername` varchar(255) DEFAULT NULL,
  `sellerurl` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据存入数据库的日期',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`offerlist`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of sellerlist
-- ----------------------------
