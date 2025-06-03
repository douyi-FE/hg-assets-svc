-- MySQL dump 10.13  Distrib 8.0.41, for macos15 (arm64)
--
-- Host: localhost    Database: nest_admin
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sys_captcha_log`
--

DROP TABLE IF EXISTS `sys_captcha_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_captcha_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `account` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `provider` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_captcha_log`
--

LOCK TABLES `sys_captcha_log` WRITE;
/*!40000 ALTER TABLE `sys_captcha_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_captcha_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_config`
--

DROP TABLE IF EXISTS `sys_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_2c363c25cf99bcaab3a7f389ba` (`key`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_config`
--

LOCK TABLES `sys_config` WRITE;
/*!40000 ALTER TABLE `sys_config` DISABLE KEYS */;
INSERT INTO `sys_config` VALUES (1,'sys_user_initPassword','初始密码','123456','创建管理员账号的初始密码','2023-11-10 00:31:44.154921','2023-11-10 00:31:44.161263'),(2,'sys_api_token','API Token','nest-admin','用于请求 @ApiToken 的控制器','2023-11-10 00:31:44.154921','2024-01-29 09:52:27.000000');
/*!40000 ALTER TABLE `sys_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dept`
--

DROP TABLE IF EXISTS `sys_dept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dept` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `orderNo` int DEFAULT '0',
  `mpath` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '',
  `parentId` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int DEFAULT NULL COMMENT '创建者',
  `update_by` int DEFAULT NULL COMMENT '更新者',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_c75280b01c49779f2323536db67` (`parentId`) USING BTREE,
  CONSTRAINT `FK_c75280b01c49779f2323536db67` FOREIGN KEY (`parentId`) REFERENCES `sys_dept` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dept`
--

LOCK TABLES `sys_dept` WRITE;
/*!40000 ALTER TABLE `sys_dept` DISABLE KEYS */;
INSERT INTO `sys_dept` VALUES (1,'华东分部',1,'1.',NULL,'2023-11-10 00:31:43.996025','2023-11-10 00:31:44.008709',NULL,NULL),(2,'研发部',1,'1.2.',1,'2023-11-10 00:31:43.996025','2023-11-10 00:31:44.008709',NULL,NULL),(3,'市场部',2,'1.3.',1,'2023-11-10 00:31:43.996025','2023-11-10 00:31:44.008709',NULL,NULL),(4,'商务部',3,'1.4.',1,'2023-11-10 00:31:43.996025','2023-11-10 00:31:44.008709',NULL,NULL),(5,'财务部',4,'1.5.',1,'2023-11-10 00:31:43.996025','2023-11-10 00:31:44.008709',NULL,NULL),(6,'华南分部',2,'6.',NULL,'2023-11-10 00:31:43.996025','2023-11-10 00:31:44.008709',NULL,NULL),(7,'西北分部',3,'7.',NULL,'2023-11-10 00:31:43.996025','2023-11-10 00:31:44.008709',NULL,NULL),(8,'研发部',1,'6.8.',6,'2023-11-10 00:31:43.996025','2023-11-10 00:31:44.008709',NULL,NULL),(9,'市场部',1,'6.9.',6,'2023-11-10 00:31:43.996025','2023-11-10 00:31:44.008709',NULL,NULL),(10,'后端组',1,'1.2.10.',2,'2025-05-11 21:16:57.767361','2025-05-11 21:16:57.000000',9,NULL),(12,'员工',1,'1.2.10.12.',10,'2025-05-11 22:10:41.593710','2025-05-11 22:10:41.000000',9,NULL);
/*!40000 ALTER TABLE `sys_dept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dict`
--

DROP TABLE IF EXISTS `sys_dict`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dict` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int NOT NULL COMMENT '创建者',
  `update_by` int NOT NULL COMMENT '更新者',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_d112365748f740ee260b65ce91` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dict`
--

LOCK TABLES `sys_dict` WRITE;
/*!40000 ALTER TABLE `sys_dict` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_dict` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dict_item`
--

DROP TABLE IF EXISTS `sys_dict_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dict_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int DEFAULT NULL COMMENT '创建者',
  `update_by` int DEFAULT NULL COMMENT '更新者',
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `order` int DEFAULT NULL COMMENT '字典项排序',
  `status` tinyint NOT NULL DEFAULT '1',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type_id` int DEFAULT NULL,
  `orderNo` int DEFAULT NULL COMMENT '字典项排序',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dict_item`
--

LOCK TABLES `sys_dict_item` WRITE;
/*!40000 ALTER TABLE `sys_dict_item` DISABLE KEYS */;
INSERT INTO `sys_dict_item` VALUES (1,'2024-01-29 01:24:51.846135','2024-01-29 02:23:19.000000',1,1,'男','1',0,1,'性别男',1,3),(2,'2024-01-29 01:32:58.458741','2024-01-29 01:58:20.000000',1,1,'女','0',1,1,'性别女',1,2),(5,'2024-01-29 02:13:01.782466','2024-01-29 02:13:01.782466',1,1,'显示','1',NULL,1,'显示菜单',2,0),(6,'2024-01-29 02:13:31.134721','2024-01-29 02:13:31.134721',1,1,'隐藏','0',NULL,1,'隐藏菜单',2,0);
/*!40000 ALTER TABLE `sys_dict_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dict_type`
--

DROP TABLE IF EXISTS `sys_dict_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dict_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_by` int DEFAULT NULL COMMENT '创建者',
  `update_by` int DEFAULT NULL COMMENT '更新者',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_74d0045ff7fab9f67adc0b1bda` (`code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dict_type`
--

LOCK TABLES `sys_dict_type` WRITE;
/*!40000 ALTER TABLE `sys_dict_type` DISABLE KEYS */;
INSERT INTO `sys_dict_type` VALUES (1,'2024-01-28 08:19:12.777447','2024-02-08 13:05:10.000000',1,1,'性别',1,'性别单选','sys_user_gender'),(2,'2024-01-28 08:38:41.235185','2024-01-29 02:11:33.000000',1,1,'菜单显示状态',1,'菜单显示状态','sys_show_hide');
/*!40000 ALTER TABLE `sys_dict_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_login_log`
--

DROP TABLE IF EXISTS `sys_login_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_login_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ua` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `provider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_3029712e0df6a28edaee46fd470` (`user_id`) USING BTREE,
  CONSTRAINT `FK_3029712e0df6a28edaee46fd470` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_login_log`
--

LOCK TABLES `sys_login_log` WRITE;
/*!40000 ALTER TABLE `sys_login_log` DISABLE KEYS */;
INSERT INTO `sys_login_log` VALUES (1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36','内网IP',NULL,'2025-06-02 22:45:36.201676','2025-06-02 22:45:36.201676',1);
/*!40000 ALTER TABLE `sys_login_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_menu`
--

DROP TABLE IF EXISTS `sys_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` tinyint NOT NULL DEFAULT '0',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `order_no` int DEFAULT '0',
  `component` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `keep_alive` tinyint NOT NULL DEFAULT '1',
  `show` tinyint NOT NULL DEFAULT '1',
  `status` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `is_ext` tinyint NOT NULL DEFAULT '0',
  `ext_open_mode` tinyint NOT NULL DEFAULT '1',
  `active_menu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `create_by` int DEFAULT NULL COMMENT '创建者',
  `update_by` int DEFAULT NULL COMMENT '更新者',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_menu`
--

LOCK TABLES `sys_menu` WRITE;
/*!40000 ALTER TABLE `sys_menu` DISABLE KEYS */;
INSERT INTO `sys_menu` VALUES (1,NULL,'/system','系统管理','',0,'ant-design:setting-outlined',254,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(2,1,'/system/user','用户管理','system:user:list',1,'ant-design:user-outlined',0,'system/user/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(3,1,'/system/role','角色管理','system:role:list',1,'ep:user',1,'system/role/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(4,1,'/system/menu','菜单管理','system:menu:list',1,'ep:menu',2,'system/menu/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(5,1,'/system/monitor','系统监控','',0,'ep:monitor',5,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(6,5,'/system/monitor/online','在线用户','system:online:list',1,'',0,'system/monitor/online/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(7,5,'/sys/monitor/login-log','登录日志','system:log:login:list',1,'',0,'system/monitor/log/login/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(8,5,'/system/monitor/serve','服务监控','system:serve:stat',1,'',4,'system/monitor/serve/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(9,1,'/system/schedule','任务调度','',0,'ant-design:schedule-filled',6,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(10,9,'/system/task','任务管理','',1,'',0,'system/schedule/task/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(11,9,'/system/task/log','任务日志','system:task:list',1,'',0,'system/schedule/log/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(12,NULL,'/document','文档','',0,'ion:tv-outline',2,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(14,12,'https://www.typeorm.org/','Typeorm中文文档(外链)',NULL,1,'',3,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',1,1,NULL,NULL,NULL),(15,12,'https://docs.nestjs.cn/','Nest.js中文文档(内嵌)','',1,'',4,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',1,2,NULL,NULL,NULL),(20,2,NULL,'新增','system:user:create',2,'',0,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(21,2,'','删除','system:user:delete',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(22,2,'','更新','system:user:update',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(23,2,'','查询','system:user:read',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(24,3,'','新增','system:role:create',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(25,3,'','删除','system:role:delete',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(26,3,'','修改','system:role:update',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(27,3,'','查询','system:role:read',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(28,4,NULL,'新增','system:menu:create',2,NULL,0,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(29,4,NULL,'删除','system:menu:delete',2,NULL,0,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(30,4,'','修改','system:menu:update',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(31,4,NULL,'查询','system:menu:read',2,NULL,0,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(32,6,'','下线','system:online:kick',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(34,10,'','新增','system:task:create',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(35,10,'','删除','system:task:delete',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(36,10,'','执行一次','system:task:once',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(37,10,'','查询','system:task:read',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(38,10,'','运行','system:task:start',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(39,10,'','暂停','system:task:stop',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(40,10,'','更新','system:task:update',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(41,7,'','查询登录日志','system:log:login:list',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(42,7,'','查询任务日志','system:log:task:list',2,'',0,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(43,NULL,'/about','关于','',1,'ant-design:info-circle-outlined',260,'account/about',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(48,NULL,'/tool','系统工具',NULL,0,'ant-design:tool-outlined',254,'',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(49,48,'/tool/email','邮件工具','system:tools:email',1,'ant-design:send-outlined',1,'tool/email/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(50,49,NULL,'发送邮件','tools:email:send',2,'',0,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(51,48,'/tool/storage','存储管理','tool:storage:list',1,'ant-design:appstore-outlined',2,'tool/storage/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(52,51,NULL,'文件上传','upload:upload',2,'',0,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(53,51,NULL,'文件删除','tool:storage:delete',2,'',2,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(54,2,NULL,'修改密码','system:user:password',2,'',5,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(56,1,'/system/dict-type','字典管理','system:dict-type:list',1,'ant-design:book-outlined',4,'system/dict-type/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(57,56,NULL,'新增','system:dict-type:create',2,'',1,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(58,56,NULL,'更新','system:dict-type:update',2,'',2,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(59,56,NULL,'删除','system:dict-type:delete',2,'',3,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(60,56,NULL,'查询','system:dict-type:info',2,'',4,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(61,1,'/system/dept','部门管理','system:dept:list',1,'ant-design:deployment-unit-outlined',3,'system/dept/index',0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(62,61,NULL,'新增','system:dept:create',2,'',1,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(63,61,NULL,'更新','system:dept:update',2,'',2,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(64,61,NULL,'删除','system:dept:delete',2,'',3,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(65,61,NULL,'查询','system:dept:read',2,'',4,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(68,5,'/health','健康检查','',1,'',4,'',0,0,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(69,68,NULL,'网络','app:health:network',2,'',0,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(70,68,NULL,'数据库','app:health: database',2,'',0,NULL,0,1,1,'2023-11-10 00:31:44.023393','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(86,1,'/param-config','参数配置','system:param-config:list',1,'ep:edit',255,'system/param-config/index',0,1,1,'2024-01-10 17:34:52.569663','2024-01-19 02:11:27.000000',0,1,NULL,NULL,NULL),(87,86,NULL,'查询','system:param-config:read',2,'',255,NULL,0,1,1,'2024-01-10 17:39:20.983241','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(88,86,NULL,'新增','system:param-config:create',2,'',255,NULL,0,1,1,'2024-01-10 17:39:57.543510','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(89,86,NULL,'更新','system:param-config:update',2,'',255,NULL,0,1,1,'2024-01-10 17:40:27.355944','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(92,86,NULL,'删除','system:param-config:delete',2,'',255,NULL,0,1,1,'2024-01-10 17:57:32.059887','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(107,1,'system/dict-item/:id','字典项管理','system:dict-item:list',1,'ant-design:facebook-outlined',255,'system/dict-item/index',0,0,1,'2024-01-28 09:21:17.409532','2024-01-30 13:09:47.000000',0,1,'字典管理',NULL,NULL),(108,107,NULL,'新增','system:dict-item:create',2,'',255,NULL,0,1,1,'2024-01-28 09:22:39.401758','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(109,107,NULL,'更新','system:dict-item:update',2,'',255,NULL,0,1,1,'2024-01-28 09:26:43.911886','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(110,107,NULL,'删除','system:dict-item:delete',2,'',255,NULL,0,1,1,'2024-01-28 09:27:28.535225','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(111,107,NULL,'查询','system:dict-item:info',2,'',255,NULL,0,1,1,'2024-01-28 09:27:43.894820','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(112,12,'https://antdv.com/components/overview-cn','antdv文档(内嵌)',NULL,1,'',255,NULL,0,1,1,'2024-01-29 09:23:08.407723','2024-02-28 22:05:52.102649',1,2,NULL,NULL,NULL),(115,NULL,'netdisk','网盘管理',NULL,0,'ant-design:cloud-server-outlined',255,NULL,0,1,1,'2024-02-10 08:00:02.394616','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(116,115,'manage','文件管理','netdisk:manage:list',1,'',252,'netdisk/manage',0,1,1,'2024-02-10 08:03:49.837348','2024-02-10 09:34:41.000000',0,1,NULL,NULL,NULL),(117,116,NULL,'创建文件或文件夹','netdisk:manage:create',2,'',255,NULL,0,1,1,'2024-02-10 08:40:22.317257','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(118,116,NULL,'查看文件','netdisk:manage:read',2,'',255,NULL,0,1,1,'2024-02-10 08:41:22.008015','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(119,116,NULL,'更新','netdisk:manage:update',2,'',255,NULL,0,1,1,'2024-02-10 08:41:50.691643','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(120,116,NULL,'删除','netdisk:manage:delete',2,'',255,NULL,0,1,1,'2024-02-10 08:42:09.480601','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(121,116,NULL,'获取文件上传token','netdisk:manage:token',2,'',255,NULL,0,1,1,'2024-02-10 08:42:57.688104','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(122,116,NULL,'添加文件备注','netdisk:manage:mark',2,'',255,NULL,0,1,1,'2024-02-10 08:43:40.117321','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(123,116,NULL,'下载文件','netdisk:manage:download',2,'',255,NULL,0,1,1,'2024-02-10 08:44:01.338984','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(124,116,NULL,'重命名文件或文件夹','netdisk:manage:rename',2,'',255,NULL,0,1,1,'2024-02-10 08:44:27.233379','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(125,116,NULL,'复制文件或文件夹','netdisk:manage:copy',2,'',255,NULL,0,1,1,'2024-02-10 08:44:44.725391','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(126,116,NULL,'剪切文件或文件夹','netdisk:manage:cut',2,'',255,NULL,0,1,1,'2024-02-10 08:45:21.660511','2024-02-28 22:05:52.102649',0,1,NULL,NULL,NULL),(127,115,'overview','网盘概览','netdisk:overview:desc',1,'',254,'netdisk/overview',0,1,1,'2024-02-10 09:32:56.981190','2024-02-10 09:34:18.000000',0,1,NULL,NULL,NULL),(128,NULL,'/workspce','工作台',NULL,1,'ant-design:bank-filled',1,'workspace/index',0,1,1,'2025-04-01 22:44:14.823985','2025-04-01 22:44:14.823985',0,1,NULL,1,NULL),(129,NULL,'/template','模板管理',NULL,0,'ant-design:merge-cells-outlined',255,NULL,1,1,1,'2025-04-01 22:49:41.588575','2025-04-01 22:49:41.588575',0,1,NULL,1,NULL),(130,129,'/template/excel','Excel模板','system:template:list',1,'ant-design:file-excel-outlined',255,'template-manage/excel/index',0,1,1,'2025-04-01 22:50:40.710908','2025-05-19 20:24:38.000000',0,1,NULL,1,1),(131,129,'/template/word','Word模板',NULL,1,'ant-design:file-word-outlined',255,'template-manage/word/index',0,1,1,'2025-04-01 22:52:10.564495','2025-04-01 22:52:10.564495',0,1,NULL,1,NULL),(132,NULL,'/human','人力管理',NULL,0,'ant-design:user-switch-outlined',255,NULL,1,1,1,'2025-04-01 22:53:12.424556','2025-04-01 22:53:12.424556',0,1,NULL,1,NULL),(133,132,'/human/info','人员信息',NULL,1,'ep:user',255,'human-manage/users/index',0,1,1,'2025-04-01 22:53:47.168465','2025-05-17 14:56:47.000000',0,1,NULL,1,1),(134,134,'/project','项目管理',NULL,1,'ant-design:calendar-twotone',255,'',0,1,1,'2025-05-02 17:18:24.779706','2025-05-15 23:54:11.773118',0,1,NULL,1,1),(135,134,'/project/consult','咨询合同台账',NULL,1,'ant-design:book-outlined',255,'project/contract-manage/index',1,1,1,'2025-05-02 17:19:58.789663','2025-05-02 17:19:58.789663',0,1,NULL,1,NULL),(136,134,'/project/list','工程计量维护',NULL,1,'ant-design:control-outlined',255,'project-manage/index',1,1,1,'2025-05-02 17:20:59.796315','2025-05-15 23:45:22.000000',0,1,NULL,1,1),(137,132,'/human/leave','休假管理','',1,'ant-design:coffee-outlined',255,'human-manage/leave-manage/index',0,1,1,'2025-05-03 08:39:32.155598','2025-05-09 22:58:29.000000',0,1,NULL,1,1),(138,48,'/flow/design','流程设计',NULL,1,'ant-design:cluster-outlined',255,'system/flow-design/index',0,1,1,'2025-05-04 09:24:38.040821','2025-05-04 09:24:38.040821',0,1,NULL,1,NULL),(139,134,'/project-manage/device-dict','字段取值字典',NULL,1,'ant-design:book-outlined',255,'project-manage/device-dict/index',1,1,1,'2025-05-05 08:36:15.147954','2025-05-05 08:36:15.147954',0,1,NULL,1,NULL),(140,NULL,'/project','项目管理',NULL,0,'ant-design:bar-chart-outlined',255,NULL,1,1,1,'2025-05-15 23:57:37.623190','2025-05-15 23:57:37.623190',0,1,NULL,1,NULL),(141,140,'/project/consult','咨询合同台账',NULL,1,'ant-design:book-outlined',255,'project/contract-manage/index',1,1,1,'2025-05-15 23:59:35.000220','2025-05-15 23:59:35.000220',0,1,NULL,1,NULL),(142,140,'/project/list','工程计量维护',NULL,1,'ep:edit',265,'project-manage/index',1,1,1,'2025-05-16 00:00:54.667795','2025-05-16 00:01:34.000000',0,1,NULL,1,1),(143,140,'/project/show','工程计量查看',NULL,1,'ant-design:ordered-list-outlined',275,'project-manage/engineer_done',1,1,1,'2025-05-16 00:02:13.003223','2025-05-16 00:02:22.000000',0,1,NULL,1,1),(144,140,'/project-manage/device-dict','字段取值字典',NULL,1,'ep:notebook',285,'project-manage/device-dict/index',1,1,1,'2025-05-16 00:03:39.569959','2025-05-16 00:03:49.000000',0,1,NULL,1,1),(145,NULL,'/cad','绘图管理',NULL,0,'ep:grape',255,NULL,1,1,1,'2025-05-18 23:38:58.365473','2025-05-18 23:38:58.365473',0,1,NULL,1,NULL),(146,145,'/cad/view','制图管理',NULL,1,'ant-design:fund-outlined',255,'cad/index',1,1,1,'2025-05-18 23:40:10.397907','2025-05-18 23:40:10.397907',0,1,NULL,1,NULL);
/*!40000 ALTER TABLE `sys_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role`
--

DROP TABLE IF EXISTS `sys_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色标识',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `default` tinyint DEFAULT NULL,
  `create_by` int DEFAULT NULL COMMENT '创建者',
  `update_by` int DEFAULT NULL COMMENT '更新者',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_223de54d6badbe43a5490450c3` (`name`) USING BTREE,
  UNIQUE KEY `IDX_05edc0a51f41bb16b7d8137da9` (`value`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role`
--

LOCK TABLES `sys_role` WRITE;
/*!40000 ALTER TABLE `sys_role` DISABLE KEYS */;
INSERT INTO `sys_role` VALUES (1,'admin','管理员','超级管理员',1,'2023-11-10 00:31:44.058463','2025-05-09 22:14:46.000000',NULL,NULL,1),(2,'user','用户','',1,'2023-11-10 00:31:44.058463','2025-05-19 18:55:08.000000',1,NULL,1),(9,'test','测试',NULL,1,'2024-01-23 22:46:52.408827','2025-05-19 21:48:49.000000',NULL,NULL,1),(10,'departLeader','部门经理','部门领导',1,'2025-05-09 22:02:51.128991','2025-05-09 22:02:51.128991',NULL,NULL,NULL),(11,'teamLeader','组长',NULL,1,'2025-05-09 22:03:13.311733','2025-05-09 22:03:13.311733',NULL,NULL,NULL),(12,'engineer','研发员工',NULL,1,'2025-05-09 22:03:42.750116','2025-05-09 22:19:03.000000',NULL,NULL,9),(16,'ttt','ttt',NULL,1,'2025-05-19 23:04:35.218891','2025-05-19 23:04:35.218891',NULL,NULL,NULL);
/*!40000 ALTER TABLE `sys_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role_menus`
--

DROP TABLE IF EXISTS `sys_role_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_role_menus` (
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`) USING BTREE,
  KEY `IDX_35ce749b04d57e226d059e0f63` (`role_id`) USING BTREE,
  KEY `IDX_2b95fdc95b329d66c18f5baed6` (`menu_id`) USING BTREE,
  CONSTRAINT `FK_2b95fdc95b329d66c18f5baed6d` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_35ce749b04d57e226d059e0f633` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role_menus`
--

LOCK TABLES `sys_role_menus` WRITE;
/*!40000 ALTER TABLE `sys_role_menus` DISABLE KEYS */;
INSERT INTO `sys_role_menus` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,14),(1,15),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,48),(1,49),(1,50),(1,51),(1,52),(1,53),(1,54),(1,56),(1,57),(1,58),(1,59),(1,60),(1,61),(1,62),(1,63),(1,64),(1,65),(1,68),(1,69),(1,70),(1,86),(1,87),(1,88),(1,89),(1,92),(1,107),(1,108),(1,109),(1,110),(1,111),(1,115),(1,116),(1,117),(1,118),(1,119),(1,120),(1,121),(1,122),(1,123),(1,124),(1,125),(1,126),(1,127),(1,128),(1,129),(1,130),(1,131),(1,132),(1,133),(1,134),(1,135),(1,136),(1,137),(1,139),(2,1),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,14),(2,15),(2,32),(2,34),(2,35),(2,36),(2,37),(2,38),(2,39),(2,40),(2,41),(2,42),(2,43),(2,48),(2,49),(2,50),(2,51),(2,52),(2,53),(2,56),(2,57),(2,58),(2,59),(2,60),(2,68),(2,69),(2,70),(2,86),(2,87),(2,88),(2,89),(2,92),(2,107),(2,108),(2,109),(2,110),(2,111),(2,112),(2,129),(2,130),(2,131),(2,140),(2,141),(2,142),(2,143),(2,144),(9,1),(9,4),(9,28),(9,29),(9,30),(9,31),(10,1),(10,2),(10,3),(10,4),(10,5),(10,6),(10,7),(10,8),(10,9),(10,10),(10,11),(10,12),(10,14),(10,15),(10,20),(10,21),(10,22),(10,23),(10,24),(10,25),(10,26),(10,27),(10,28),(10,29),(10,30),(10,31),(10,32),(10,34),(10,35),(10,36),(10,37),(10,38),(10,39),(10,40),(10,41),(10,42),(10,43),(10,48),(10,49),(10,50),(10,51),(10,52),(10,53),(10,54),(10,56),(10,57),(10,58),(10,59),(10,60),(10,61),(10,62),(10,63),(10,64),(10,65),(10,68),(10,69),(10,70),(10,86),(10,87),(10,88),(10,89),(10,92),(10,107),(10,108),(10,109),(10,110),(10,111),(10,112),(10,115),(10,116),(10,117),(10,118),(10,119),(10,120),(10,121),(10,122),(10,123),(10,124),(10,125),(10,126),(10,127),(10,128),(10,129),(10,130),(10,131),(10,132),(10,133),(10,134),(10,135),(10,136),(10,137),(10,138),(10,139),(11,1),(11,2),(11,3),(11,4),(11,5),(11,6),(11,7),(11,8),(11,9),(11,10),(11,11),(11,12),(11,14),(11,15),(11,20),(11,21),(11,22),(11,23),(11,24),(11,25),(11,26),(11,27),(11,28),(11,29),(11,30),(11,31),(11,32),(11,34),(11,35),(11,36),(11,37),(11,38),(11,39),(11,40),(11,41),(11,42),(11,43),(11,48),(11,49),(11,50),(11,51),(11,52),(11,53),(11,54),(11,56),(11,57),(11,58),(11,59),(11,60),(11,61),(11,62),(11,63),(11,64),(11,65),(11,68),(11,69),(11,70),(11,86),(11,87),(11,88),(11,89),(11,92),(11,107),(11,108),(11,109),(11,110),(11,111),(11,112),(11,115),(11,116),(11,117),(11,118),(11,119),(11,120),(11,121),(11,122),(11,123),(11,124),(11,125),(11,126),(11,127),(11,128),(11,129),(11,130),(11,131),(11,132),(11,133),(11,134),(11,135),(11,136),(11,137),(11,138),(11,139),(12,1),(12,2),(12,3),(12,4),(12,5),(12,6),(12,7),(12,8),(12,9),(12,10),(12,11),(12,12),(12,14),(12,15),(12,20),(12,21),(12,22),(12,23),(12,24),(12,25),(12,26),(12,27),(12,28),(12,29),(12,30),(12,31),(12,32),(12,34),(12,35),(12,36),(12,37),(12,38),(12,39),(12,40),(12,41),(12,42),(12,48),(12,49),(12,50),(12,51),(12,52),(12,53),(12,54),(12,56),(12,57),(12,58),(12,59),(12,60),(12,61),(12,62),(12,63),(12,64),(12,65),(12,68),(12,69),(12,70),(12,86),(12,87),(12,88),(12,89),(12,92),(12,107),(12,108),(12,109),(12,110),(12,111),(12,112),(12,115),(12,116),(12,117),(12,118),(12,119),(12,120),(12,121),(12,122),(12,123),(12,124),(12,125),(12,126),(12,127),(12,128),(12,129),(12,130),(12,131),(12,132),(12,133),(12,134),(12,135),(12,136),(12,137),(12,138),(12,139),(16,128);
/*!40000 ALTER TABLE `sys_role_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_task`
--

DROP TABLE IF EXISTS `sys_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `service` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` tinyint NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '1',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `limit` int DEFAULT '0',
  `cron` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `every` int DEFAULT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `job_opts` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_ef8e5ab5ef2fe0ddb1428439ef` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_task`
--

LOCK TABLES `sys_task` WRITE;
/*!40000 ALTER TABLE `sys_task` DISABLE KEYS */;
INSERT INTO `sys_task` VALUES (2,'定时清空登录日志','LogClearJob.clearLoginLog',0,1,NULL,NULL,0,'0 0 3 ? * 1',0,'','{\"count\":1,\"key\":\"__default__:2:::0 0 3 ? * 1\",\"cron\":\"0 0 3 ? * 1\",\"jobId\":2}','定时清空登录日志','2023-11-10 00:31:44.197779','2025-06-03 00:21:43.000000'),(3,'定时清空任务日志','LogClearJob.clearTaskLog',0,1,NULL,NULL,0,'0 0 3 ? * 1',0,'','{\"count\":1,\"key\":\"__default__:3:::0 0 3 ? * 1\",\"cron\":\"0 0 3 ? * 1\",\"jobId\":3}','定时清空任务日志','2023-11-10 00:31:44.197779','2025-06-03 00:21:43.000000'),(4,'访问百度首页','HttpRequestJob.handle',0,0,NULL,NULL,1,'* * * * * ?',NULL,'{\"url\":\"https://www.baidu.com\",\"method\":\"get\"}',NULL,'访问百度首页','2023-11-10 00:31:44.197779','2023-11-10 00:31:44.206935'),(5,'发送邮箱','EmailJob.send',0,0,NULL,NULL,-1,'0 0 0 1 * ?',NULL,'{\"subject\":\"这是标题\",\"to\":\"zeyu57@163.com\",\"content\":\"这是正文\"}',NULL,'每月发送邮箱','2023-11-10 00:31:44.197779','2023-11-10 00:31:44.206935');
/*!40000 ALTER TABLE `sys_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_task_log`
--

DROP TABLE IF EXISTS `sys_task_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_task_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `consume_time` int DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_f4d9c36052fdb188ff5c089454b` (`task_id`) USING BTREE,
  CONSTRAINT `FK_f4d9c36052fdb188ff5c089454b` FOREIGN KEY (`task_id`) REFERENCES `sys_task` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_task_log`
--

LOCK TABLES `sys_task_log` WRITE;
/*!40000 ALTER TABLE `sys_task_log` DISABLE KEYS */;
INSERT INTO `sys_task_log` VALUES (1,3,1,NULL,0,'2025-06-02 03:00:00.061408','2025-06-02 03:00:00.061408');
/*!40000 ALTER TABLE `sys_task_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user`
--

DROP TABLE IF EXISTS `sys_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `psalt` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint DEFAULT '1',
  `qq` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_9e7164b2f1ea1348bc0eb0a7da` (`username`) USING BTREE,
  KEY `FK_96bde34263e2ae3b46f011124ac` (`dept_id`) USING BTREE,
  CONSTRAINT `FK_96bde34263e2ae3b46f011124ac` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user`
--

LOCK TABLES `sys_user` WRITE;
/*!40000 ALTER TABLE `sys_user` DISABLE KEYS */;
INSERT INTO `sys_user` VALUES (1,'admin','a11571e778ee85e82caae2d980952546','https://thirdqq.qlogo.cn/g?b=qq&s=100&nk=1743369777','1743369777@qq.com','10086','管理员','xQYCspvFb8cAW6GG1pOoUGTLqsuUSO3d',1,'1743369777','2023-11-10 00:31:44.104382','2024-01-29 09:49:43.000000','bqy',1),(2,'user','dbd89546dec743f82bb9073d6ac39361','https://thirdqq.qlogo.cn/g?b=qq&s=100&nk=1743369777','luffy@qq.com','10010','王路飞','qlovDV7pL5dPYPI3QgFFo1HH74nP6sJe',1,'1743369777','2023-11-10 00:31:44.104382','2025-05-25 16:43:57.000000','luffy',8),(8,'developer','f03fa2a99595127b9a39587421d471f6','/upload/cfd0d14459bc1a47-202402032141838.jpeg','nami@qq.com','10000','小贼猫','NbGM1z9Vhgo7f4dd2I7JGaGP12RidZdE',1,'1743369777','2023-11-10 00:31:44.104382','2024-02-03 21:41:18.000000','娜美',7),(9,'engineer','73a25f26e441bc15b7fae7b7338b0a13',NULL,'engineer@example.com',NULL,NULL,'0TrWuOKMngk385LAT6828FdXU3Q-A7v-',1,NULL,'2025-05-09 22:04:26.462092','2025-05-11 21:17:49.000000','窦乂',10),(10,'team-leader','3ced0c4c4b6d9837eeabebb9f25ab348',NULL,'test@qq.com',NULL,NULL,'zxXyw6cqNeunId3SfugzDTefIzE6wPbw',1,NULL,'2025-05-09 22:05:28.056456','2025-05-11 21:19:03.000000','张组长',10),(11,'depart-leader','7cd518a2fb5004370c9858c3b469b103',NULL,NULL,NULL,NULL,'y_fhRKFmlI1DgPNDZ0DH_oTANsrcH_h3',1,NULL,'2025-05-09 22:06:05.327441','2025-05-09 22:06:05.327441','刘部门长',2),(12,'walker','d8cf23168b5e9cc7eb7e79edf4be3839',NULL,NULL,NULL,NULL,'HZ8Wv7DvvY3bUwnaHOtPMrSdjMZS0UGj',1,NULL,'2025-05-19 18:31:58.884969','2025-05-19 20:19:28.000000','窦乂',1),(15,'ttttttt','2b159ad8b5042375fc93d6ef81b4dce6',NULL,NULL,NULL,NULL,'lVtfLWT-vHzr-_vGJh1MmQkJTuALhO-O',1,NULL,'2025-05-19 23:04:53.348299','2025-05-19 23:04:53.348299',NULL,1);
/*!40000 ALTER TABLE `sys_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user_roles`
--

DROP TABLE IF EXISTS `sys_user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`) USING BTREE,
  KEY `IDX_96311d970191a044ec048011f4` (`user_id`) USING BTREE,
  KEY `IDX_6d61c5b3f76a3419d93a421669` (`role_id`) USING BTREE,
  CONSTRAINT `FK_6d61c5b3f76a3419d93a4216695` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`),
  CONSTRAINT `FK_96311d970191a044ec048011f44` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user_roles`
--

LOCK TABLES `sys_user_roles` WRITE;
/*!40000 ALTER TABLE `sys_user_roles` DISABLE KEYS */;
INSERT INTO `sys_user_roles` VALUES (1,1),(2,1),(8,2),(9,12),(10,11),(11,10),(12,2),(15,16);
/*!40000 ALTER TABLE `sys_user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `todo`
--

DROP TABLE IF EXISTS `todo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `todo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `value` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_9cb7989853c4cb7fe427db4b260` (`user_id`) USING BTREE,
  CONSTRAINT `FK_9cb7989853c4cb7fe427db4b260` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `todo`
--

LOCK TABLES `todo` WRITE;
/*!40000 ALTER TABLE `todo` DISABLE KEYS */;
/*!40000 ALTER TABLE `todo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tool_storage`
--

DROP TABLE IF EXISTS `tool_storage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tool_storage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '文件名',
  `fileName` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '真实文件名',
  `ext_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `path` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `size` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tool_storage`
--

LOCK TABLES `tool_storage` WRITE;
/*!40000 ALTER TABLE `tool_storage` DISABLE KEYS */;
/*!40000 ALTER TABLE `tool_storage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_access_tokens`
--

DROP TABLE IF EXISTS `user_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_access_tokens` (
  `id` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `value` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `expired_at` datetime NOT NULL COMMENT '令牌过期时间',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '令牌创建时间',
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_e9d9d0c303432e4e5e48c1c3e90` (`user_id`) USING BTREE,
  CONSTRAINT `FK_e9d9d0c303432e4e5e48c1c3e90` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_access_tokens`
--

LOCK TABLES `user_access_tokens` WRITE;
/*!40000 ALTER TABLE `user_access_tokens` DISABLE KEYS */;
INSERT INTO `user_access_tokens` VALUES ('00d4213f-3a53-4907-a504-5fb6b5a5181b','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDgxNjI2NzYsImV4cCI6MTc0OTAyNjY3Nn0.1MMXlecGb7l067Q5Lkf75n2fylUA6GMYEyCrL6lolik','2025-06-04 16:44:37','2025-05-25 16:44:36.968473',2),('1701be4c-adef-4b42-b6e1-c12e74fdf4b5','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDgwNjg1MDUsImV4cCI6MTc0ODkzMjUwNX0.YiOoGSds3vFSN3YZ5PCmqyKj96Nv__9dPhayntxsxW0','2025-06-03 14:35:05','2025-05-24 14:35:05.205755',1),('97549582-30d0-408e-92bf-c67aa99ac368','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDgwOTEyMTksImV4cCI6MTc0ODk1NTIxOX0.ab7krPOj0FkFHhg7HfGzNKCmKMv_af2sm1weSoyo9fA','2025-06-03 20:53:39','2025-05-24 20:53:39.354469',1),('9e0f748e-b0fe-40a1-afa3-5bea1311c43b','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDg4NzU1MzYsImV4cCI6MTc0OTczOTUzNn0.6d8tlhl80rPvZgqnkMs4Ubnm1l1GLawrnCSnFtSYeLo','2025-06-12 22:45:36','2025-06-02 22:45:36.186853',1),('9ea755b6-186c-4d5d-9725-5c022b78f04c','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDgwNzUxMjYsImV4cCI6MTc0ODkzOTEyNn0.J0Cue31ASAVB48xwb9R-5tDTnwLwJw6Hru2qlWxoq-I','2025-06-03 16:25:26','2025-05-24 16:25:26.361704',1),('aad5eab2-5664-47a3-b34b-dc00549e3f98','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDgyNjA5NzcsImV4cCI6MTc0OTEyNDk3N30.pVDRJmNItdIzmQnlDtJCajLwuz5tBmEePsmN5HGftzQ','2025-06-05 20:02:57','2025-05-26 20:02:57.165985',1),('d278f32b-18ad-45ca-9a3c-f8ed8767f058','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDgyNTc5MjYsImV4cCI6MTc0OTEyMTkyNn0.0cnNuGQvct13kMvNF57-WFkkcmqBt1T8NZGHORX8ghU','2025-06-05 19:12:07','2025-05-26 19:12:06.689740',1),('f7cfd145-e188-4ed7-962c-e66580e98a83','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInB2IjoxLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDgwNzM0MTAsImV4cCI6MTc0ODkzNzQxMH0.8B4EMhPiDA69ztndNoMP_V3vMVWz89FDRLCh_k_3Fow','2025-06-03 15:56:50','2025-05-24 15:56:50.440709',1);
/*!40000 ALTER TABLE `user_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_refresh_tokens`
--

DROP TABLE IF EXISTS `user_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_refresh_tokens` (
  `id` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `value` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `expired_at` datetime NOT NULL COMMENT '令牌过期时间',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '令牌创建时间',
  `accessTokenId` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `REL_1dfd080c2abf42198691b60ae3` (`accessTokenId`) USING BTREE,
  CONSTRAINT `FK_1dfd080c2abf42198691b60ae39` FOREIGN KEY (`accessTokenId`) REFERENCES `user_access_tokens` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_refresh_tokens`
--

LOCK TABLES `user_refresh_tokens` WRITE;
/*!40000 ALTER TABLE `user_refresh_tokens` DISABLE KEYS */;
INSERT INTO `user_refresh_tokens` VALUES ('071549b3-6910-4be4-9661-deeefaf5c2a6','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiQVllTlZuTUM5clNYY091OF8zOTgtIiwiaWF0IjoxNzQ4MjYwOTc3LCJleHAiOjE3NDkxMjQ5Nzd9.6TP1DrphXEskGY1FuxFHer4GGvjWcNeZ4FkPrFbCDGk','2025-06-25 20:02:57','2025-05-26 20:02:57.169421','aad5eab2-5664-47a3-b34b-dc00549e3f98'),('080b93df-6b80-4e34-8972-4edfa4defb74','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoidEhEX0pWMzFnWmlHVDVHUVRCdnFyIiwiaWF0IjoxNzQ4MDY4NTA1LCJleHAiOjE3NDg5MzI1MDV9.y3sT1g7RAV94itdqtoojJQud8_LchvzNw3cEHDYn5No','2025-06-23 14:35:05','2025-05-24 14:35:05.344705','1701be4c-adef-4b42-b6e1-c12e74fdf4b5'),('494ab41b-dded-4f57-b158-e9e7b048670f','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDJxV2hNOUtNdVNIR1BQUGZoTVVHIiwiaWF0IjoxNzQ4MDczNDEwLCJleHAiOjE3NDg5Mzc0MTB9.h6AQIKD2eBJ-P1XYO_dcfwJaJts27tbWJ8MpALO4lcA','2025-06-23 15:56:51','2025-05-24 15:56:50.578181','f7cfd145-e188-4ed7-962c-e66580e98a83'),('598dc8d9-fcb0-4c21-99cb-ed327ca50988','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYlVJNkZ2cDI0WDdISlpMdnozOHF0IiwiaWF0IjoxNzQ4ODc1NTM2LCJleHAiOjE3NDk3Mzk1MzZ9.2UqDBItomDoTl3LWlQzNz403muBF1Ps6U46h5KnxulE','2025-07-02 22:45:36','2025-06-02 22:45:36.193528','9e0f748e-b0fe-40a1-afa3-5bea1311c43b'),('598f19db-491c-4e77-ab55-3095474fcf07','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiWnktN1BReWxkV25RNFltRzJmMW1yIiwiaWF0IjoxNzQ4MTYyNjc2LCJleHAiOjE3NDkwMjY2NzZ9.zeFB7gvIEV6kzcd_BDWycUew2FpUMoXJyJSdNacLncY','2025-06-24 16:44:37','2025-05-25 16:44:36.974610','00d4213f-3a53-4907-a504-5fb6b5a5181b'),('b1915ab1-d9de-4365-bef0-5bb6297b155a','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiODd5NVhBZGNGeVlzM0hDQVhMc3NiIiwiaWF0IjoxNzQ4MDkxMjE5LCJleHAiOjE3NDg5NTUyMTl9.WDaoTw5ANSGOJaoNiTeFI_zVBKwjIheGT_4xrOJyR1s','2025-06-23 20:53:40','2025-05-24 20:53:39.728882','97549582-30d0-408e-92bf-c67aa99ac368'),('c1a9cf81-04cb-48ad-9e57-1145a396ed85','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiVF9Kb2c4a251dDFwWWtkWFRWSmloIiwiaWF0IjoxNzQ4MjU3OTI2LCJleHAiOjE3NDkxMjE5MjZ9.0BfseTZJJJr5-k72lJO8sDugXg3iq8MTOhKfR9AwMLk','2025-06-25 19:12:07','2025-05-26 19:12:06.695594','d278f32b-18ad-45ca-9a3c-f8ed8767f058'),('d4ad7a4a-ce89-4718-a22a-2287917b2cd4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiVTZzaUtudHE4WGk1N09tZndYOXFKIiwiaWF0IjoxNzQ4MDc1MTI2LCJleHAiOjE3NDg5MzkxMjZ9.1d4ncDp9GHEC2eijPFgG0od31JW4Bf6HUQJD13K_bv0','2025-06-23 16:25:26','2025-05-24 16:25:26.508674','9ea755b6-186c-4d5d-9725-5c022b78f04c');
/*!40000 ALTER TABLE `user_refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-03  0:27:35
