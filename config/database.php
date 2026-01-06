<?php
/**
 * Database Configuration
 * Handles database connection for the Hospital Management System
 * Uses SQLite - no MySQL server required!
 */

// SQLite database file path
define('DB_PATH', __DIR__ . '/../database/hospital_management.db');

class Database {
    private $conn;
    
    public function __construct() {
        $this->connect();
        $this->initializeDatabase();
    }
    
    /**
     * Establish database connection using SQLite
     */
    private function connect() {
        try {
            // Create database directory if it doesn't exist
            $dbDir = dirname(DB_PATH);
            if (!is_dir($dbDir)) {
                if (!mkdir($dbDir, 0755, true)) {
                    throw new Exception("Failed to create database directory: " . $dbDir . ". Please check folder permissions.");
                }
            }
            
            // Check if directory is writable
            if (!is_writable($dbDir)) {
                // Try to make it writable
                @chmod($dbDir, 0755);
                if (!is_writable($dbDir)) {
                    throw new Exception("Database directory is not writable: " . $dbDir . ". Please set permissions to 755.");
                }
            }
            
            // Connect to SQLite database
            $this->conn = new PDO('sqlite:' . DB_PATH);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
            // Enable foreign keys for SQLite
            $this->conn->exec("PRAGMA foreign_keys = ON");
            
        } catch (PDOException $e) {
            $errorMsg = "Database connection error: " . $e->getMessage();
            $errorMsg .= "<br><br><strong>Troubleshooting:</strong><br>";
            $errorMsg .= "1. Make sure the 'database' folder exists and is writable<br>";
            $errorMsg .= "2. Check file permissions (folder should be 755)<br>";
            $errorMsg .= "3. Ensure PHP has SQLite extension enabled (pdo_sqlite)<br>";
            die($errorMsg);
        } catch (Exception $e) {
            die("Database setup error: " . $e->getMessage());
        }
    }
    
    /**
     * Initialize database tables if they don't exist
     */
    private function initializeDatabase() {
        try {
            // Check if tables exist
            $tables = $this->conn->query("SELECT name FROM sqlite_master WHERE type='table' AND name='doctors'")->fetch();
            
            if (!$tables) {
                // Create tables
                $this->conn->exec("
                    CREATE TABLE IF NOT EXISTS doctors (
                        doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name VARCHAR(100) NOT NULL,
                        specialization VARCHAR(100),
                        email VARCHAR(100) UNIQUE,
                        phone VARCHAR(20),
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    CREATE TABLE IF NOT EXISTS patients (
                        patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name VARCHAR(100) NOT NULL,
                        age INTEGER,
                        gender VARCHAR(10),
                        phone VARCHAR(20),
                        address TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    CREATE TABLE IF NOT EXISTS prescriptions (
                        prescription_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        doctor_id INTEGER NOT NULL,
                        patient_id INTEGER NOT NULL,
                        prescription_date DATE NOT NULL,
                        diagnosis TEXT,
                        notes TEXT,
                        status VARCHAR(20) DEFAULT 'active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
                        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
                    );
                    
                    CREATE TABLE IF NOT EXISTS prescription_medications (
                        medication_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        prescription_id INTEGER NOT NULL,
                        medication_name VARCHAR(200) NOT NULL,
                        dosage VARCHAR(100) NOT NULL,
                        frequency VARCHAR(100) NOT NULL,
                        duration VARCHAR(100) NOT NULL,
                        instructions TEXT,
                        quantity INTEGER DEFAULT 1,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE
                    );
                    
                    CREATE INDEX IF NOT EXISTS idx_doctor ON prescriptions(doctor_id);
                    CREATE INDEX IF NOT EXISTS idx_patient ON prescriptions(patient_id);
                    CREATE INDEX IF NOT EXISTS idx_date ON prescriptions(prescription_date);
                    CREATE INDEX IF NOT EXISTS idx_prescription ON prescription_medications(prescription_id);
                ");
                
                // Insert sample data
                $this->conn->exec("
                    INSERT OR IGNORE INTO doctors (name, specialization, email, phone) VALUES
                    ('Dr. Sarah Johnson', 'General Medicine', 'sarah.johnson@hospital.com', '555-0101'),
                    ('Dr. Michael Chen', 'Cardiology', 'michael.chen@hospital.com', '555-0102'),
                    ('Dr. Emily Davis', 'Pediatrics', 'emily.davis@hospital.com', '555-0103');
                    
                    INSERT OR IGNORE INTO patients (name, age, gender, phone, address) VALUES
                    ('John Smith', 45, 'Male', '555-1001', '123 Main Street'),
                    ('Jane Doe', 32, 'Female', '555-1002', '456 Oak Avenue'),
                    ('Robert Wilson', 28, 'Male', '555-1003', '789 Pine Road');
                ");
            }
        } catch (PDOException $e) {
            // Silently fail if tables already exist
        }
    }
    
    /**
     * Get database connection
     */
    public function getConnection() {
        return $this->conn;
    }
    
    /**
     * Execute a query and return result
     */
    public function query($sql) {
        return $this->conn->query($sql);
    }
    
    /**
     * Prepare a statement
     */
    public function prepare($sql) {
        return $this->conn->prepare($sql);
    }
    
    /**
     * Get last insert ID
     */
    public function getLastInsertId() {
        return $this->conn->lastInsertId();
    }
    
    /**
     * Close database connection
     */
    public function close() {
        $this->conn = null;
    }
    
    /**
     * Escape string to prevent SQL injection (not needed with PDO, but kept for compatibility)
     */
    public function escape($string) {
        return $this->conn->quote($string);
    }
}

// Create global database instance
$db = new Database();

