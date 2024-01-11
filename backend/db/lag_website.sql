-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 04, 2024 at 01:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `employeeId`, `department`, `username`, `password`, `status`) VALUES
(1, 1, 'general admin', 'admin', '$2a$12$RrTqhO6yECt2VcqsmH75x.tILH6mlzI8XGiOs3UkzxDjwotmdqdo6', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `admin_workflow_permissions`
--

CREATE TABLE `admin_workflow_permissions` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `client_details` tinyint(1) NOT NULL,
  `pre_survey` tinyint(1) NOT NULL,
  `documents` tinyint(1) NOT NULL,
  `payment` tinyint(1) NOT NULL,
  `job_order` tinyint(1) NOT NULL,
  `load_side` tinyint(1) NOT NULL,
  `final_process` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `sin_number` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `fname`, `mname`, `lname`, `contact_number`, `email_address`, `address`, `tin`, `sss`, `philhealth`, `pagibig`, `emergency_contact_name`, `emergency_contact_number`, `beneficiary`, `position`, `sin_number`, `status`) VALUES
(1, 'Ivan', 'Mendoza', 'Caliwanagan', '09090909099', 'ivan@gmail.com', 'naic', '000-0000-tin', '000-000-sss', '000-000-phi', '000-000-pag', 'ernie', '090909090', 'joy', 'IT', '000-000-sin-I', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `item_code` varchar(500) NOT NULL,
  `name` varchar(500) NOT NULL,
  `category` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(100) NOT NULL,
  `last_purchase_date` date NOT NULL,
  `last_stock_date` date NOT NULL,
  `status` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `item_code`, `name`, `category`, `quantity`, `unit`, `last_purchase_date`, `last_stock_date`, `status`) VALUES
(1, '202300010001', 'Letter-size Bond paper', 1, 10, 'rim', '2023-11-24', '2023-11-24', 'On Stock'),
(2, '202300020001', 'Computer Keyboard', 2, 4, 'unit', '2023-11-23', '2023-11-24', 'On Stock'),
(4, '202300010002', 'A4-size Bond paper', 1, 8, 'rim', '2023-11-27', '2023-11-28', 'On Stock'),
(5, '202300010003', 'Legal-size Bond Paper', 1, 10, 'rim', '2023-12-08', '2023-12-11', 'On Stock'),
(6, '202300020002', 'mouse', 2, 1, 'pcs', '2013-03-12', '2023-12-19', 'On Stock');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_category`
--

CREATE TABLE `inventory_category` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `process_date` date NOT NULL,
  `process_type` varchar(10) NOT NULL,
  `details` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_processes`
--

INSERT INTO `inventory_processes` (`id`, `item_code`, `process_count`, `process_date`, `process_type`, `details`) VALUES
(1, '202300010001', 2, '2023-11-24', 'OUT', 'document printing'),
(2, '202300010001', 2, '2023-11-24', 'IN', 'Refreshing Supplies');

-- --------------------------------------------------------

--
-- Table structure for table `leavetbl`
--

CREATE TABLE `leavetbl` (
  `id` int(11) NOT NULL,
  `employeeId` int(11) NOT NULL,
  `leave_type` int(11) NOT NULL,
  `reason` varchar(500) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `modified_by` int(11) NOT NULL,
  `date_modified` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_type`
--

CREATE TABLE `leave_type` (
  `id` int(11) NOT NULL,
  `leave_type` varchar(50) NOT NULL,
  `num_days_allowed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leave_type`
--

INSERT INTO `leave_type` (`id`, `leave_type`, `num_days_allowed`) VALUES
(1, 'Sick Leave', 5),
(2, 'Vacation Leave', 5),
(3, 'Emergency Leave', 5);

-- --------------------------------------------------------

--
-- Table structure for table `workflow_images`
--

CREATE TABLE `workflow_images` (
  `id` int(11) NOT NULL,
  `workflow_id` int(11) NOT NULL,
  `workflow_process_step` varchar(100) NOT NULL,
  `image_path` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_flow`
--

CREATE TABLE `work_flow` (
  `id` int(11) NOT NULL,
  `reference_code` varchar(500) NOT NULL,
  `client_name` varchar(500) NOT NULL,
  `client_address` varchar(500) NOT NULL,
  `client_contact_no` varchar(50) NOT NULL,
  `date_received` date NOT NULL,
  `initial_communicator` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_flow_documents`
--

CREATE TABLE `work_flow_documents` (
  `id` int(11) NOT NULL,
  `work_flow_id` int(11) NOT NULL,
  `complete_mark` varchar(50) NOT NULL,
  `remarks` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_flow_final_process`
--

CREATE TABLE `work_flow_final_process` (
  `id` int(11) NOT NULL,
  `work_flow_id` int(11) NOT NULL,
  `coordinator` varchar(500) NOT NULL,
  `tracker_status` varchar(500) NOT NULL,
  `reason` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_flow_job_order`
--

CREATE TABLE `work_flow_job_order` (
  `id` int(11) NOT NULL,
  `work_flow_id` int(11) NOT NULL,
  `remarks` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_flow_load_side`
--

CREATE TABLE `work_flow_load_side` (
  `id` int(11) NOT NULL,
  `work_flow_id` int(11) NOT NULL,
  `load_side_mark` varchar(50) NOT NULL,
  `remarks` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_flow_payment`
--

CREATE TABLE `work_flow_payment` (
  `id` int(11) NOT NULL,
  `work_flow_id` int(11) NOT NULL,
  `payment_mark` varchar(50) NOT NULL,
  `ar_or_number` varchar(50) NOT NULL,
  `remarks` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_flow_pre_survey`
--

CREATE TABLE `work_flow_pre_survey` (
  `id` int(11) NOT NULL,
  `work_flow_id` int(11) NOT NULL,
  `facility` varchar(50) NOT NULL,
  `structural_classification` varchar(50) NOT NULL,
  `service_data` varchar(50) NOT NULL,
  `private_pole` varchar(50) NOT NULL,
  `number_of_units` varchar(50) NOT NULL,
  `feasibility` varchar(50) NOT NULL,
  `plus_code` varchar(50) NOT NULL,
  `remarks` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_flow_status_update`
--

CREATE TABLE `work_flow_status_update` (
  `id` int(11) NOT NULL,
  `work_flow_id` int(11) NOT NULL,
  `action_date` date NOT NULL,
  `actions_taken` varchar(500) NOT NULL,
  `customers_feedback` varchar(500) NOT NULL,
  `action_taken_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for table `admin_workflow_permissions`
--
ALTER TABLE `admin_workflow_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

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
  ADD KEY `adminId` (`modified_by`),
  ADD KEY `leave_type` (`leave_type`);

--
-- Indexes for table `leave_type`
--
ALTER TABLE `leave_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workflow_images`
--
ALTER TABLE `workflow_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workflow_id` (`workflow_id`);

--
-- Indexes for table `work_flow`
--
ALTER TABLE `work_flow`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `work_flow_documents`
--
ALTER TABLE `work_flow_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_flow_id` (`work_flow_id`);

--
-- Indexes for table `work_flow_final_process`
--
ALTER TABLE `work_flow_final_process`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_flow_id` (`work_flow_id`);

--
-- Indexes for table `work_flow_job_order`
--
ALTER TABLE `work_flow_job_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_flow_id` (`work_flow_id`);

--
-- Indexes for table `work_flow_load_side`
--
ALTER TABLE `work_flow_load_side`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_flow_id` (`work_flow_id`);

--
-- Indexes for table `work_flow_payment`
--
ALTER TABLE `work_flow_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_flow_id` (`work_flow_id`);

--
-- Indexes for table `work_flow_pre_survey`
--
ALTER TABLE `work_flow_pre_survey`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_flow_id` (`work_flow_id`);

--
-- Indexes for table `work_flow_status_update`
--
ALTER TABLE `work_flow_status_update`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_flow_id` (`work_flow_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_workflow_permissions`
--
ALTER TABLE `admin_workflow_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `inventory_category`
--
ALTER TABLE `inventory_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `inventory_processes`
--
ALTER TABLE `inventory_processes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `leavetbl`
--
ALTER TABLE `leavetbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `leave_type`
--
ALTER TABLE `leave_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `workflow_images`
--
ALTER TABLE `workflow_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_flow`
--
ALTER TABLE `work_flow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_flow_documents`
--
ALTER TABLE `work_flow_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_flow_final_process`
--
ALTER TABLE `work_flow_final_process`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_flow_job_order`
--
ALTER TABLE `work_flow_job_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_flow_load_side`
--
ALTER TABLE `work_flow_load_side`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_flow_payment`
--
ALTER TABLE `work_flow_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_flow_pre_survey`
--
ALTER TABLE `work_flow_pre_survey`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_flow_status_update`
--
ALTER TABLE `work_flow_status_update`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`);

--
-- Constraints for table `admin_workflow_permissions`
--
ALTER TABLE `admin_workflow_permissions`
  ADD CONSTRAINT `admin_workflow_permissions_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`);

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
  ADD CONSTRAINT `leavetbl_ibfk_2` FOREIGN KEY (`modified_by`) REFERENCES `admin` (`id`),
  ADD CONSTRAINT `leavetbl_ibfk_3` FOREIGN KEY (`leave_type`) REFERENCES `leave_type` (`id`);

--
-- Constraints for table `work_flow_documents`
--
ALTER TABLE `work_flow_documents`
  ADD CONSTRAINT `work_flow_documents_ibfk_1` FOREIGN KEY (`work_flow_id`) REFERENCES `work_flow` (`id`);

--
-- Constraints for table `work_flow_final_process`
--
ALTER TABLE `work_flow_final_process`
  ADD CONSTRAINT `work_flow_final_process_ibfk_1` FOREIGN KEY (`work_flow_id`) REFERENCES `work_flow` (`id`);

--
-- Constraints for table `work_flow_job_order`
--
ALTER TABLE `work_flow_job_order`
  ADD CONSTRAINT `work_flow_job_order_ibfk_1` FOREIGN KEY (`work_flow_id`) REFERENCES `work_flow` (`id`);

--
-- Constraints for table `work_flow_load_side`
--
ALTER TABLE `work_flow_load_side`
  ADD CONSTRAINT `work_flow_load_side_ibfk_1` FOREIGN KEY (`work_flow_id`) REFERENCES `work_flow` (`id`);

--
-- Constraints for table `work_flow_payment`
--
ALTER TABLE `work_flow_payment`
  ADD CONSTRAINT `work_flow_payment_ibfk_1` FOREIGN KEY (`work_flow_id`) REFERENCES `work_flow` (`id`);

--
-- Constraints for table `work_flow_pre_survey`
--
ALTER TABLE `work_flow_pre_survey`
  ADD CONSTRAINT `work_flow_pre_survey_ibfk_1` FOREIGN KEY (`work_flow_id`) REFERENCES `work_flow` (`id`);

--
-- Constraints for table `work_flow_status_update`
--
ALTER TABLE `work_flow_status_update`
  ADD CONSTRAINT `work_flow_status_update_ibfk_1` FOREIGN KEY (`work_flow_id`) REFERENCES `work_flow` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
