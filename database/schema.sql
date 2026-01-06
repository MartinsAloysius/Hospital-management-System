-- Hospital Management System - Prescription Module Database Schema
-- Created for Group 8

CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Doctors table (assuming this exists or needs to be created)
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table (assuming this exists or needs to be created)
CREATE TABLE IF NOT EXISTS patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions table - main table for storing prescription data
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    prescription_date DATE NOT NULL,
    diagnosis TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    INDEX idx_doctor (doctor_id),
    INDEX idx_patient (patient_id),
    INDEX idx_date (prescription_date)
);

-- Prescription medications table - stores individual medications in a prescription
CREATE TABLE IF NOT EXISTS prescription_medications (
    medication_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    medication_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    INDEX idx_prescription (prescription_id)
);

-- Insert some sample data for testing (optional)
INSERT INTO doctors (name, specialization, email, phone) VALUES
('Dr. Sarah Johnson', 'General Medicine', 'sarah.johnson@hospital.com', '555-0101'),
('Dr. Michael Chen', 'Cardiology', 'michael.chen@hospital.com', '555-0102'),
('Dr. Emily Davis', 'Pediatrics', 'emily.davis@hospital.com', '555-0103')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO patients (name, age, gender, phone, address) VALUES
('John Smith', 45, 'Male', '555-1001', '123 Main Street'),
('Jane Doe', 32, 'Female', '555-1002', '456 Oak Avenue'),
('Robert Wilson', 28, 'Male', '555-1003', '789 Pine Road')
ON DUPLICATE KEY UPDATE name=name;


