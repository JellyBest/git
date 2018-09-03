/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : dadan

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2018-07-18 10:01:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for mmtj_code
-- ----------------------------
DROP TABLE IF EXISTS `mmtj_code`;
CREATE TABLE `mmtj_code` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `SalesCode` varchar(8) NOT NULL COMMENT '营业部代码',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据存入数据库的日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of mmtj_code
-- ----------------------------
INSERT INTO `mmtj_code` VALUES ('10', '80032107', '2018-07-18 10:01:19');
INSERT INTO `mmtj_code` VALUES ('11', '80090067', '2018-07-18 10:01:19');
INSERT INTO `mmtj_code` VALUES ('12', '80144552', '2018-07-18 10:01:19');
INSERT INTO `mmtj_code` VALUES ('13', '80033815', '2018-07-18 10:01:19');
INSERT INTO `mmtj_code` VALUES ('14', '80190854', '2018-07-18 10:01:19');
INSERT INTO `mmtj_code` VALUES ('15', '80034850', '2018-07-18 10:01:19');
