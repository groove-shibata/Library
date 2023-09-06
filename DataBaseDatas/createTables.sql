CREATE TABLE `auto_incremental_num_for_user_num` (
  `auto_increment` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`auto_increment`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
CREATE TABLE `book` (
  `bookNum` char(8) NOT NULL,
  `bookBranchNum` char(3) NOT NULL,
  `bookName` varchar(64) NOT NULL,
  `authorName` varchar(64) NOT NULL,
  `bookPlace` char(3) NOT NULL,
  `genreNum` char(3) NOT NULL,
  PRIMARY KEY (`bookNum`,`bookBranchNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `genre` (
  `genreNum` char(3) NOT NULL,
  `genreName` varchar(64) NOT NULL,
  PRIMARY KEY (`genreNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `rent_admin_table` (
  `userNum` char(8) NOT NULL,
  `bookNum` char(5) NOT NULL,
  `bookBranchNum` char(3) NOT NULL,
  `returnDate` date NOT NULL,
  `extensionCount` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`bookNum`,`bookBranchNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `user` (
  `userNum` char(8) NOT NULL,
  `userName` varchar(256) NOT NULL,
  `telNum` varchar(11) NOT NULL,
  `add1` varchar(64) NOT NULL,
  `add2` varchar(64) NOT NULL,
  `penaDay` int(11) NOT NULL DEFAULT '0',
  `penaUpdateDay` date DEFAULT NULL,
  PRIMARY KEY (`userNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
