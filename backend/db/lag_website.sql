-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2023 at 06:50 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lag_website`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `employeeId` int(11) NOT NULL,
  `department` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `employeeId`, `department`, `username`, `password`, `status`) VALUES
(1, 5, 'general admin', 'admin', '$2a$12$RrTqhO6yECt2VcqsmH75x.tILH6mlzI8XGiOs3UkzxDjwotmdqdo6', 'Active'),
(2, 1, 'accounting', 'accounting', '$2a$12$1VMTCvGfgry2/q5CHuV5bOQ5BEG4Eo1eIt1FIOAEQvCpOsP6UOSg.', 'Active'),
(3, 2, 'hr', 'hr', '$2a$12$1VMTCvGfgry2/q5CHuV5bOQ5BEG4Eo1eIt1FIOAEQvCpOsP6UOSg.', 'Active'),
(6, 41, 'engineering', 'engineering', '$2a$12$S/xr45c7eKdmpiufiXuyXOpu.BfKtoaPs/HgE/83xgCCK7bgsc1Dq', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `mname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `address` varchar(500) NOT NULL,
  `tin` varchar(50) NOT NULL,
  `sss` varchar(50) NOT NULL,
  `philhealth` varchar(50) NOT NULL,
  `pagibig` varchar(50) NOT NULL,
  `emergency_contact_name` varchar(100) NOT NULL,
  `emergency_contact_number` varchar(15) NOT NULL,
  `beneficiary` varchar(100) NOT NULL,
  `position` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `fname`, `mname`, `lname`, `contact_number`, `email_address`, `address`, `tin`, `sss`, `philhealth`, `pagibig`, `emergency_contact_name`, `emergency_contact_number`, `beneficiary`, `position`, `status`) VALUES
(1, 'Leonardo', '', 'Garcia', '09123456789', 'lag@gmail.com', 'Tejeros', '000', '111', '222', '333', 'Leonardo Garcia', '09123456789', 'Someone Beneficial', 'C.E.O', 'Active'),
(2, 'Maria Fe', '', 'Garcia', '09876543210', 'lag@gmail.com', 'Tejeros', '000', '111', '222', '333', 'Leonardo Garcia', '09123456789', 'Someone Beneficial', 'General Manager', 'Active'),
(5, 'Ivan', 'Mendoza', 'Caliwanagan', '09090909099', 'ivan@gmail.com', 'naic cavite', '000-0000-tin', '000-000-sss', '000-000-phi', '000-000-pag', 'emer name', '09123456789', 'Merie Joy', 'IT personnel', 'Active'),
(41, 'Allen Claine', '', 'Reyes', '09090909099', 'lag@gmail.com', 'Tejeros Convention', '000', '111', '222', '333', 'Leonardo Garcia', '09123456789', 'Someone Beneficial', 'Electrical Engineer', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `item_code` varchar(500) NOT NULL,
  `name` varchar(500) NOT NULL,
  `category` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `last_stock_date` date NOT NULL,
  `status` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `item_code`, `name`, `category`, `stock`, `last_stock_date`, `status`) VALUES
(1, '202300010001', 'A4-size Bond Paper', 1, 8, '2023-11-15', 'On Stock'),
(2, '202300020001', 'Monitor', 2, 7, '2023-11-15', 'On Stock'),
(3, '202300010002', 'Letter-size Bond paper', 1, 6, '2023-11-15', 'On Stock'),
(4, '202300020002', 'Mouse', 2, 10, '2023-11-15', 'On Stock');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_category`
--

CREATE TABLE `inventory_category` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inventory_category`
--

INSERT INTO `inventory_category` (`id`, `name`) VALUES
(1, 'Office Supplies'),
(2, 'Computer Parts');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_processes`
--

CREATE TABLE `inventory_processes` (
  `id` int(11) NOT NULL,
  `item_code` varchar(100) NOT NULL,
  `process_count` int(11) NOT NULL,
  `count_date` date NOT NULL,
  `process_type` varchar(10) NOT NULL,
  `details` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inventory_processes`
--

INSERT INTO `inventory_processes` (`id`, `item_code`, `process_count`, `count_date`, `process_type`, `details`) VALUES
(1, '202300010002', 3, '2023-11-17', 'IN', 'Refreshing Supplies'),
(2, '202300010001', 2, '2023-11-17', 'OUT', 'magpprint lang'),
(3, '202300020001', 1, '2023-11-17', 'OUT', 'gagamitin lang'),
(4, '202300010002', 2, '2023-11-17', 'OUT', 'magpprint');

-- --------------------------------------------------------

--
-- Table structure for table `leavetbl`
--

CREATE TABLE `leavetbl` (
  `id` int(11) NOT NULL,
  `employeeId` int(11) NOT NULL,
  `leave_type` varchar(100) NOT NULL,
  `reason` varchar(500) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `modified_by` int(11) NOT NULL,
  `date_modified` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `leavetbl`
--

INSERT INTO `leavetbl` (`id`, `employeeId`, `leave_type`, `reason`, `from_date`, `to_date`, `modified_by`, `date_modified`) VALUES
(4, 1, 'Vacation Leave', 'invalid reason', '2023-11-13', '2023-11-17', 1, '2023-11-10'),
(5, 1, 'Sick Leave', 'Fever', '2023-11-20', '2023-11-21', 1, '2023-11-10'),
(6, 1, 'Sick Leave', 'Fever', '2023-11-22', '2023-11-23', 1, '2023-11-10'),
(7, 2, 'Sick Leave', 'Fever', '2023-11-22', '2023-11-23', 1, '2023-11-10'),
(8, 2, 'Emergency Leave', 'giving birth', '2023-11-24', '2023-12-01', 1, '2023-11-10'),
(9, 41, 'Vacation Leave', 'Pahinga', '2023-11-13', '2023-11-17', 1, '2023-11-10'),
(10, 41, 'Sick Leave', 'lagnat', '2023-11-20', '2023-11-20', 1, '2023-11-10'),
(11, 41, 'Sick Leave', 'Body Pain', '2023-11-13', '2023-11-14', 1, '2023-11-10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeId` (`employeeId`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ID` (`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_code` (`item_code`),
  ADD KEY `catetgory` (`category`);

--
-- Indexes for table `inventory_category`
--
ALTER TABLE `inventory_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory_processes`
--
ALTER TABLE `inventory_processes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_code` (`item_code`);

--
-- Indexes for table `leavetbl`
--
ALTER TABLE `leavetbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeId` (`employeeId`),
  ADD KEY `adminId` (`modified_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inventory_category`
--
ALTER TABLE `inventory_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inventory_processes`
--
ALTER TABLE `inventory_processes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `leavetbl`
--
ALTER TABLE `leavetbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`);

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`category`) REFERENCES `inventory_category` (`id`);

--
-- Constraints for table `inventory_processes`
--
ALTER TABLE `inventory_processes`
  ADD CONSTRAINT `inventory_processes_ibfk_1` FOREIGN KEY (`item_code`) REFERENCES `inventory` (`item_code`);

--
-- Constraints for table `leavetbl`
--
ALTER TABLE `leavetbl`
  ADD CONSTRAINT `leavetbl_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `leavetbl_ibfk_2` FOREIGN KEY (`modified_by`) REFERENCES `admin` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
