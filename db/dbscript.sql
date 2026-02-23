
CREATE DATABASE IF NOT EXISTS `artist_tribute`;
USE `artist_tribute`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: artist_tribute
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(145) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` (`id`, `username`, `password`) VALUES (3,'admin','$2a$10$l4p.CyKrAoxDC5zFIwvs/eTIY6kWT1ghyogPuOcOvMgKWtGEUbSr6');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `award_photos`
--

DROP TABLE IF EXISTS `award_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `award_photos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `caption` varchar(300) DEFAULT NULL,
  `year` int NOT NULL,
  `event` varchar(300) DEFAULT NULL,
  `image_url` varchar(300) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `award_photos`
--

LOCK TABLES `award_photos` WRITE;
/*!40000 ALTER TABLE `award_photos` DISABLE KEYS */;
INSERT INTO `award_photos` (`id`, `caption`, `year`, `event`, `image_url`, `modified_by`) VALUES (1,'ph1',2024,'','http://narappa-backend:8080/uploads/3b645d35-1cb9-4ebe-8c7c-d93c00ee62d0.jpg',NULL),(2,'ph2',2024,'','http://narappa-backend:8080/uploads/8e71676f-5c16-47f6-a405-45ed26cd037f.jpg',NULL),(3,'ph3',2024,'','http://narappa-backend:8080/uploads/73661a9e-b668-481c-9247-5cd1f0b6c100.jpg',NULL),(4,'ph4',2024,'','http://narappa-backend:8080/uploads/e0897d6f-8b58-4144-b19b-f23ce867d997.jpg',NULL),(5,'ph5',2024,'','http://narappa-backend:8080/uploads/ced06be1-4663-47fe-8faa-8c1003d6aa54.jpg',NULL),(6,'ph6',2024,'','http://narappa-backend:8080/uploads/b3db8b56-d833-4fa8-9a92-31c5c71a0061.jpg',NULL),(7,'ph7',2024,'','http://narappa-backend:8080/uploads/20c2b65e-1284-4d60-9134-36e571319882.jpg',NULL),(8,'ph8',2024,'','http://narappa-backend:8080/uploads/6365da26-9dd1-4475-ba5e-617afd3f5632.jpg',NULL),(9,'ph9',2024,'','http://narappa-backend:8080/uploads/ca181ee5-1f0e-48ae-a2c2-87466724cd1b.jpg',NULL),(10,'ph10',2024,'','http://narappa-backend:8080/uploads/1cd409a4-9079-4070-8fc7-89b4a42d972d.jpg',NULL),(11,'ph11',2024,'','http://narappa-backend:8080/uploads/40cf7f59-6a8d-4c58-8267-1fb5267b30a9.jpg',NULL),(12,'ph13',2024,'','http://narappa-backend:8080/uploads/4b3a6860-a3fa-409e-9e96-9afca383dad6.jpg',NULL),(13,'ph12',2024,'','http://narappa-backend:8080/uploads/9b6984fd-0565-4782-bb7d-4a906d45024f.jpg',NULL),(14,'ph14',2024,'','http://narappa-backend:8080/uploads/de9d2b13-073a-4c9c-b471-69dbffb6bf60.jpg',NULL),(15,'ph15',2024,'','http://narappa-backend:8080/uploads/f8003385-ed0f-44bb-adb9-4d8ba78a7d32.jpg',NULL),(16,'ph16',2024,'','http://narappa-backend:8080/uploads/24f0c08f-ddf0-4feb-a8a8-6f7aa073b9fa.jpg',NULL),(17,'ph17',2024,'','http://narappa-backend:8080/uploads/fe53dc28-7079-496b-a112-330b1157aa65.jpg',NULL),(18,'ph18',2024,'','http://narappa-backend:8080/uploads/5a409678-c694-4c84-88f5-6a09511d9983.jpg',NULL),(19,'ph19',2024,'','http://narappa-backend:8080/uploads/1c5da3ea-1982-4c10-9a21-82c241ea802c.jpg',NULL),(20,'ph20',2024,'','http://narappa-backend:8080/uploads/afa80a3c-813e-43d6-9ff3-a81cef3a22a5.jpg',NULL);
/*!40000 ALTER TABLE `award_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `awards`
--

DROP TABLE IF EXISTS `awards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `awards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `organization` varchar(45) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `awards`
--

LOCK TABLES `awards` WRITE;
/*!40000 ALTER TABLE `awards` DISABLE KEYS */;
INSERT INTO `awards` (`id`, `title`, `organization`, `year`, `description`) VALUES (1,'AP Artists Exhibition of Paintings, Drawings & Graphics','Group Shows',2020,''),(2,'All India Artist Friends Art Show, New Delhi','Group Shows',2013,''),(3,'Krishna Pushkramu Chitrakala Mahotsavam, Govt. of AP','Group Shows',2016,''),(5,'Lalit Kala Akademi, Hyderabad','Collections',NULL,''),(6,'Lalit Kala Akademi, Chennai','Collections',NULL,''),(7,'Central Lalit Kala Akademi, New Delhi','Collections',NULL,''),(8,'Regional Centre, Chennai','Collections',NULL,''),(9,'Jawaharlal Nehru University, New Delhi','Collections',NULL,''),(10,'A.P. Police Akademi','Collections',NULL,''),(11,'Contemporary Art Museum, Hyderabad','Collections',NULL,''),(12,'Many other private collections','Collections',NULL,''),(13,'A.P.Lalit Kala Akademi, Hyderabad','Awards',1985,''),(14,'Bharat Kala Parishad','Awards',1986,''),(15,'Hyderabad Art Society ','Awards',1986,''),(16,'A.P. Council of Artists','Awards',1987,''),(17,'Young Envoys International, Hyderabad','Honors',1996,''),(18,'Konaseema Chitrakala Parishad, Amalapuram','Honors',1996,''),(19,'Rajahmundry Chitrakala Niketam','Honors',1997,''),(20,'Potti Sriramulu Telugu University, Hyderabad','Honors',NULL,''),(21,'Creative Fine Arts Academy, Guntur, Amaravati','Honors',NULL,''),(22,'Sanskriti Puraskar','Honors',NULL,''),(23,'Kendriya Vidyalaya, AFS Hakimpet','Honors',NULL,''),(24,'Lalitha Kalabhirama Pinchamu','Honors',NULL,''),(25,'Ameer Art Academy, Nellore','Honors',NULL,''),(26,'Artists Camps sponsored by A.P.Lalit Kala Akademi at Hampi','Camps',1975,''),(27,'Artist Camp at Srisailam(A.P)','Camps',1984,''),(28,'Painting Camp at Amaravathi','Camps',1992,''),(29,'Painters camp sponsored by A.P. Cultural Department, Hyderabad','Camps',1994,''),(30,'Ceramic camp at Valley School, Bangalore','Camps',2004,''),(31,'Painting camp at Basara, Siddipet, Shilparamam','Camps',NULL,''),(32,'All India Artist Camp at Venkateswara Fine Arts College, Madhapur','Camps',NULL,''),(33,'Ceramic Camp, Chennai','Camps',NULL,''),(34,'Graphics Workshop organised by Paul Lingrin Regional Center, Madras','Workshops',1984,''),(35,'Printmaking Workshop at Sarojini Naidu School of Fine Arts University of Hyderabad','Workshops',1992,''),(36,'Soorya Festival, International Painting Exhibition, Kerala','Group Shows',NULL,''),(37,'Lavanya Group at Tirupathi ','Group Shows',2006,''),(38,'Petrichor, International Painting Exhibition, Amritsar','Group Shows',2016,''),(39,'Blooming Colours2, The Hyderabad Art Society','Group Shows',NULL,''),(40,'Chemi Luminescence, International Painting Exhibition, Kerala','Group Shows',2014,''),(41,'Andhra Kaladarshini, Art of Andhra Pradesh','Group Shows',2024,''),(42,'Andhra Shilpa, Chitrakala Shikaralu','Group Shows',NULL,''),(43,'AIFACS at Bikaner','Group Shows',2003,''),(44,'AP Artists Exhibition of Paintings, Drawings & Graphics','Group Shows',NULL,''),(45,'National Art Workshop, Amritsar','Workshops',2012,''),(46,'Solo and Group exhibitions at Hyderabad, Mumbai, Delhi, Kolkatta, Bangalore, Kerala, Visakhapatnam','Group Shows',NULL,'');
/*!40000 ALTER TABLE `awards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bio_paragraphs`
--

DROP TABLE IF EXISTS `bio_paragraphs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bio_paragraphs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `header` varchar(255) DEFAULT NULL,
  `order_no` int NOT NULL,
  `page` varchar(50) NOT NULL,
  `paragraph` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bio_paragraphs`
--

LOCK TABLES `bio_paragraphs` WRITE;
/*!40000 ALTER TABLE `bio_paragraphs` DISABLE KEYS */;
/*!40000 ALTER TABLE `bio_paragraphs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custom_pages`
--

DROP TABLE IF EXISTS `custom_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custom_pages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(10000) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `month` int NOT NULL,
  `published` bit(1) NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `year` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custom_pages`
--

LOCK TABLES `custom_pages` WRITE;
/*!40000 ALTER TABLE `custom_pages` DISABLE KEYS */;
INSERT INTO `custom_pages` (`id`, `content`, `created_at`, `month`, `published`, `title`, `updated_at`, `year`) VALUES (3,'[{\"type\":\"text\",\"html\":\"<b>txet </b>eht <font color=\\\"#c81414\\\">gnitseT</font>\",\"id\":1766600050690},{\"type\":\"text\",\"html\":\"gnineppaha siht si yhw <font color=\\\"#3e1919\\\">s<b>ow - </b>i want to remove this</font>\",\"id\":1766614841342},{\"type\":\"text\",\"html\":\"lufrednow - testing\",\"id\":1766614843376},{\"type\":\"image\",\"url\":\"http://narappa-backend:8080/uploads/b7fa7d0c-2914-4d9f-b3ab-f4c12edf652a.jpg\",\"width\":\"58\",\"position\":\"right\",\"id\":1766600089730}]','2025-12-24 17:21:46.300068',12,_binary '','Testing3','2026-01-25 16:07:13.410468',2025),(4,'[{\"type\":\"text\",\"html\":\"<u>lkjklkjl;kjl;kjlkjkj </u>jlkj;lkjl;jkj <font color=\\\"#b62020\\\"><i>kkkjlkjlkj</i></font>\",\"id\":1766617856109},{\"type\":\"text\",\"content\":\"\",\"id\":1768357688143,\"style\":{\"bold\":false,\"italic\":false,\"underline\":false,\"color\":\"#000000\",\"fontSize\":\"16px\",\"align\":\"left\"}},{\"type\":\"image\",\"url\":\"http://narappa-backend:8080/uploads/bfa82aa7-4630-4fab-9de2-08fb069c6991.jpg\",\"width\":\"65\",\"position\":\"center\",\"id\":1766622745529}]','2025-12-24 18:14:03.784390',12,_binary '','Testing4','2026-01-25 16:54:13.780322',2025),(5,'[{\"type\":\"image\",\"url\":\"http://narappa-backend:8080/uploads/7aa099a9-629f-4cde-a66e-669ecf9cbe4e.jpg\",\"width\":100,\"position\":\"center\",\"id\":1769921052422}]','2026-01-31 23:44:56.801075',1,_binary '','Movies','2026-01-31 23:44:56.801075',1985);
/*!40000 ALTER TABLE `custom_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guestbook_entries`
--

DROP TABLE IF EXISTS `guestbook_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guestbook_entries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `message` varchar(2000) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `guestbook_entries_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `guestbook_entries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guestbook_entries`
--

LOCK TABLES `guestbook_entries` WRITE;
/*!40000 ALTER TABLE `guestbook_entries` DISABLE KEYS */;
INSERT INTO `guestbook_entries` (`id`, `created_at`, `message`, `name`, `parent_id`) VALUES (1,'2025-12-22 17:47:38.776374','I want to share','testing',NULL),(2,'2025-12-24 23:38:07.768961','Thank you ','Narmada',1),(3,'2025-12-24 23:38:45.173184','I remember the paintings','Ganesh',NULL),(4,'2025-12-24 23:39:21.293115','Thank you for the remembering','Narmada',3),(5,'2025-12-24 23:39:43.566022','I too want to share','Ganesh',1),(6,'2025-12-24 23:40:50.967916','Thank you for your thoughts and memories','Admin',1);
/*!40000 ALTER TABLE `guestbook_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(200) DEFAULT NULL,
  `page` varchar(45) DEFAULT NULL,
  `imageOrderNo` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paintings`
--

DROP TABLE IF EXISTS `paintings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paintings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `year` int NOT NULL,
  `medium` varchar(300) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `image_url` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paintings`
--

LOCK TABLES `paintings` WRITE;
/*!40000 ALTER TABLE `paintings` DISABLE KEYS */;
INSERT INTO `paintings` (`id`, `title`, `year`, `medium`, `description`, `image_url`) VALUES (1,'Water color on paper',2024,'Water color','','http://narappa-backend:8080/uploads/5aab915d-5c66-4422-afcd-f84319c50f42.jpg'),(2,'p2',2024,'Water color on paper','','http://narappa-backend:8080/uploads/44784a3e-51b5-465e-82f0-e71c8f706a5e.jpg'),(3,'p3',2024,'Graphics','','http://narappa-backend:8080/uploads/22bdb349-4340-4cdf-8bc9-7a920f838bce.jpg'),(4,'p4',2024,'Graphics','','http://narappa-backend:8080/uploads/a78acb28-6f1e-42df-9425-181912d64f5a.jpg'),(5,'p5',2024,'Watercolor on paper','','http://narappa-backend:8080/uploads/831cd0b0-76c2-4e1d-bf27-590f60fa861c.jpg'),(6,'p6',2024,'Watercolor on paper','','http://narappa-backend:8080/uploads/3716d9f4-5f1c-44dd-9eec-3e34e8435d18.jpg'),(7,'p7',2024,'','','http://narappa-backend:8080/uploads/d1fae023-a304-4e53-a816-ed6b83bee115.jpg'),(8,'p8',2024,'','','http://narappa-backend:8080/uploads/db23e4d1-d12d-4e1a-a4e5-f468b79e2842.jpg'),(9,'p9',2024,'','','http://narappa-backend:8080/uploads/08c4d4cf-ea9f-4808-a595-be7f3f729fda.jpg'),(10,'p10',2024,'','','http://narappa-backend:8080/uploads/7aa53f35-3bd4-427d-9ef0-2f55647d6e32.jpg'),(11,'p11',2024,'','','http://narappa-backend:8080/uploads/9926e401-a14d-444c-a820-70f900e487ba.jpg'),(12,'p12',2024,'','','http://narappa-backend:8080/uploads/95ea9fe4-0d28-4022-be36-7efd24da20c2.jpg'),(13,'p13',2024,'','','http://narappa-backend:8080/uploads/ab7dae9b-cce0-4495-845f-39844f3750ac.jpg'),(14,'p14',2024,'','','http://narappa-backend:8080/uploads/704d4b15-0d96-43c4-8406-4ae035274421.jpg'),(15,'p15',2024,'','','http://narappa-backend:8080/uploads/4c650ce6-080e-4f67-bd06-7ad22128b099.jpg'),(16,'p20',2024,'','','http://narappa-backend:8080/uploads/e7b44f6a-7d3f-4b4b-a3b0-06ab651d640d.jpg');
/*!40000 ALTER TABLE `paintings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paragraphs`
--

DROP TABLE IF EXISTS `paragraphs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paragraphs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `paragraph` varchar(600) DEFAULT NULL,
  `page` varchar(45) DEFAULT NULL,
  `orderNo` int DEFAULT NULL,
  `header` varchar(100) DEFAULT NULL,
  `order_no` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paragraphs`
--

LOCK TABLES `paragraphs` WRITE;
/*!40000 ALTER TABLE `paragraphs` DISABLE KEYS */;
INSERT INTO `paragraphs` (`id`, `paragraph`, `page`, `orderNo`, `header`, `order_no`) VALUES (1,'Chintha Narappa was born in 1944 to Late Shri Nagappa and Obulamma in Simhadripuram, Cuddapah district, Andhra Pradesh. Raised in a modest middle-class family, his early life was shaped by simplicity, resilience, and a deep fascination for colors and forms. What began as a childhood curiosity gradually transformed into a lifelong devotion to art.','bio',1,'0',0),(7,'He pursued formal training at Jawaharlal Nehru Technological University College of Fine Arts, earning his Diploma in Fine Arts in 1969. During his academic years, his talent was recognized with a prestigious scholarship from the Andhra Pradesh Lalit Kala Akademy, marking the beginning of a distinguished artistic journey.','bio',2,'0',0),(8,'Narappa dedicated much of his professional life to teaching, serving as an Art Teacher at St. Peter\'s High School until his retirement in 2002. As a teacher, he inspired generations of students, nurturing not only technical skill but also a sensitivity toward beauty and observation. His commitment to the arts extended beyond the classroom; he was actively associated with The Hyderabad Art Society, where he served as Treasurer and contributed significantly to the local art community.','bio',3,'0',0),(9,'Alongside his independent artistic practice, Narappa assisted art directors in several notable Telugu films, including Daasi, Rangula Kala, Matti Manushulu, and Harivillu. These collaborations reflect his versatility and engagement with socially meaningful cinema. He also assisted in the creation of important public sculptures, including the Ambedkar statue at ECIL Cross Roads and the statue of a Hindi writer installed on Tank Bund in Hyderabad, contributing to the cultural landmarks of the city.','bio',4,'0',0),(10,'A versatile artist, Narappa worked across multiple mediums—painting in oil, acrylic, and watercolor; drawing with charcoal, graphite, and pastel; and sculpting in clay and metal. His artistic exploration extended to printmaking techniques such as lithography and woodcut, as well as photography and glass work. Among these, watercolor remained his most expressive and celebrated medium.','bio',5,'0',0),(11,'Narappa stands as a significant figure in contemporary Indian art, particularly for his evocative landscapes that capture the essence of rural India with remarkable sensitivity and atmospheric depth. His works reflect restrained color palettes, layered spatial compositions, and an economical yet expressive brushwork. Rather than dramatic spectacle, his paintings offer quiet contemplation—subtle plays of light across fields, gathering monsoon clouds, and the enduring dignity of village life.','bio',6,'0',0),(12,'Balancing traditional Indian sensibilities with impressionistic influences, he developed a distinctive visual language. His landscapes are not merely depictions of scenery; they are meditations on time, transience, and the intimate relationship between humanity and nature. In an era of rapid urbanization, his works gently remind viewers of the timeless rhythms of the countryside.','bio',7,'0',0),(13,'Beyond exhibitions and recognitions, Narappa’s true legacy lies in the inspiration he imparted—to students, fellow artists, and admirers of art. He faced many struggles and life’s ups and downs from a young age, yet his passion never wavered. His journey from a small village in Andhra Pradesh to becoming a respected artist and mentor exemplifies dedication, perseverance, and quiet excellence.','bio',8,'0',0),(14,'This biography stands as a tribute to an extraordinary artist whose life was defined not only by artistic achievement but by humility, discipline, and devotion to creative expression. Through every brushstroke and every sculpture, Chintha Narappa left behind more than art—he left behind a legacy of vision, sensitivity, and enduring beauty.','bio',9,'0',0),(15,'Beyond his accomplishments as an artist and teacher, Chintha Narappa was a man of deep warmth, integrity, and quiet strength. As a husband, he was a pillar of support—steadfast, understanding, and deeply devoted to his family. Through life’s many challenges, he stood with patience and dignity, offering encouragement and stability to those around him.','bio1',1,'0',0),(16,'As a father, he led not merely with words, but by example. His discipline, humility, and dedication to his craft became life lessons for his children. He taught the value of perseverance, hard work, and sincerity—qualities he himself embodied every day. His guidance was gentle yet firm, shaping lives with wisdom and compassion.','bio1',2,'0',0),(17,'To his siblings, he was a caring brother—supportive, responsible, and ever ready to help. He maintained strong family bonds and believed deeply in togetherness and mutual respect.','bio1',3,'0',0),(18,'Among colleagues and fellow artists, Narappa was admired not only for his artistic skill but for his generous spirit. He shared knowledge freely, encouraged younger artists, and contributed actively to artistic communities. He believed that art was not a competition, but a collective journey of expression and growth.','bio1',4,'0',0),(19,'Those who worked alongside him remember him as humble, disciplined, and sincere—someone who valued relationships as much as recognition. His legacy lives on not only in his paintings and sculptures, but in the hearts of those who knew him personally.','bio1',5,'0',0),(20,'The Man Beyond the Artist','bio1',1,'1',0);
/*!40000 ALTER TABLE `paragraphs` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-22 20:59:26
