/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-08-03 15:15:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for asin
-- ----------------------------
DROP TABLE IF EXISTS `asin`;
CREATE TABLE `asin` (
  `id` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `offerlist` char(255) DEFAULT NULL COMMENT '要爬取的URL',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`offerlist`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of asin
-- ----------------------------
INSERT INTO `asin` VALUES ('0000000001', '﻿https://www.amazon.com/gp/offer-listing/B072J4CBK6');
