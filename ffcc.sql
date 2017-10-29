SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `calls` (
  `matchID` int(11) NOT NULL,
  `tourneyID` int(11) NOT NULL,
  `reporterID` text COLLATE utf8_unicode_ci NOT NULL,
  `winnerID` int(11) NOT NULL,
  `looserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------


CREATE TABLE `discord` (
  `discordID` bigint(20) NOT NULL,
  `report` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------


CREATE TABLE `seeds` (
  `tournamentID` int(11) NOT NULL,
  `tourneyID` int(11) NOT NULL,
  `seedNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `calls`
  ADD PRIMARY KEY (`matchID`,`tourneyID`);


ALTER TABLE `discord`
  ADD PRIMARY KEY (`discordID`);

ALTER TABLE `seeds`
  ADD PRIMARY KEY (`tournamentID`,`tourneyID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
