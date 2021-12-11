-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2021 at 02:18 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `robot_money_collector`
--

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `id` int(11) NOT NULL,
  `user_id` varchar(50) NOT NULL COMMENT 'Hash  from "IPAddress BrowserName"',
  `movement_history` text NOT NULL,
  `total_money_available` double NOT NULL COMMENT '$',
  `total_money_found` double NOT NULL COMMENT '$',
  `interest_rate` double NOT NULL COMMENT '%',
  `total_money_earning` double NOT NULL COMMENT '$',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `score`
--

INSERT INTO `score` (`id`, `user_id`, `movement_history`, `total_money_available`, `total_money_found`, `interest_rate`, `total_money_earning`, `created_at`, `updated_at`) VALUES
(2, '432836768', '{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 1, y: 4},{x: 2, y: 4},{x: 2, y: 3},{x: 2, y: 2},{x: 2, y: 1},{x: 3, y: 1}', 38028, 27142, 16, 62109, '2021-12-11 11:59:27', '2021-12-11 11:59:27'),
(3, '432836768', '{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 1, y: 3},{x: 2, y: 3},{x: 2, y: 2},{x: 2, y: 1},{x: 3, y: 1}', 39628, 39628, 16, 66735, '2021-12-11 12:01:38', '2021-12-11 12:01:38'),
(4, '432836768', '{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 1, y: 3},{x: 2, y: 3},{x: 2, y: 2},{x: 2, y: 1},{x: 3, y: 1}', 39628, 39628, 16, 66735, '2021-12-11 12:01:58', '2021-12-11 12:01:58'),
(5, '1248504682', '{x: 1, y: 0},{x: 1, y: 1},{x: 1, y: 2},{x: 2, y: 2},{x: 2, y: 3},{x: 3, y: 3},{x: 4, y: 3},{x: 4, y: 4},{x: 3, y: 4},{x: 2, y: 4},{x: 1, y: 4},{x: 1, y: 3},{x: 0, y: 3},{x: 0, y: 4}', 27476, 27476, 7, 52275, '2021-12-11 13:17:24', '2021-12-11 13:17:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `score`
--
ALTER TABLE `score`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
