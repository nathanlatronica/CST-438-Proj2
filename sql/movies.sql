SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- CREATE TABLE FOR USERS
DROP TABLE IF EXISTS `loginInfo`;
CREATE TABLE `loginInfo` (
  `id` tinyint(2) NOT NULL,
  `username` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(25) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `loginInfo` (`id`, `username`, `password`) VALUES
(1, 'Leroy', 'Jenkins'),
(2, 'geo', 'woods'),
(3, 'Jose', 'C'),
(4,'Mahandus', 'Lincoln'),
(5, 'Abraham', 'Gandhi'),
(6, 'Benjamin', 'Keller'),
(7, 'Hellen', 'Franklin');

-- CREATE TABLE FOR MOVIES
DROP TABLE IF EXISTS `movies`;
CREATE TABLE `movies`(
    -- movie_id, title, genre, rating, ticketPrice, Director, Summary, poster;
    `movie_id` mediumint(20) NOT NULL,
    `title`    varchar(25) COLLATE utf8_unicode_ci NOT NULL,
    `genre`    varchar(25) COLLATE utf8_unicode_ci NOT NULL,
    `rating`   mediumint(20) NOT NULL,
    'ticketPrice`  varchar(500) COLLATE utf8_unicode_ci NOT NULL,
    `director`  varchar(500) COLLATE utf8_unicode_ci NOT NULL,
    `summary`  varchar(500) COLLATE utf8_unicode_ci NOT NULL,
    `poster` varchar(500) COLLATE utf8_unicode_ci NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `videoGames` (`videogame_id`, `title`, `genre`, `rating`, `pricing`, `companyName`, `summary`, `cover`) VALUES
(1, 'Rando Movie', 'Action',  '9/10', '59.99', 'Micheal Bay', 'Random Movie Description', 'insert Image link'),

(2, 'Rando Movie', 'Action',  '9/10', '59.99', 'Micheal Bay', 'Random Movie Description', 'insert Image link'),

(3, 'Rando Movie', 'Action',  '9/10', '59.99', 'Micheal Bay', 'Random Movie Description', 'insert Image link');

ALTER TABLE `loginInfo`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `movies`
  ADD PRIMARY KEY (`movie_id`);
  
ALTER TABLE `loginInfo`
  MODIFY `id` tinyint(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `movies`
  MODIFY `movie_id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

COMMIT;