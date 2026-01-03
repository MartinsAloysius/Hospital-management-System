<?php
/**
 * Helper functions for the prescription module
 */

require_once __DIR__ . '/../config/database.php';

/**
 * Get all doctors from database
 */
function getAllDoctors() {
    global $db;
    $doctors = array();
    
    $sql = "SELECT doctor_id, name, specialization FROM doctors ORDER BY name";
    $result = $db->query($sql);
    
    if ($result) {
        $doctors = $result->fetchAll();
    }
    
    return $doctors;
}

/**
 * Get all patients from database
 */
function getAllPatients() {
    global $db;
    $patients = array();
    
    $sql = "SELECT patient_id, name, age, gender, phone FROM patients ORDER BY name";
    $result = $db->query($sql);
    
    if ($result) {
        $patients = $result->fetchAll();
    }
    
    return $patients;
}

/**
 * Get patient by ID
 */
function getPatientById($patient_id) {
    global $db;
    
    $patient_id = (int)$patient_id;
    $sql = "SELECT * FROM patients WHERE patient_id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$patient_id]);
    $result = $stmt->fetch();
    
    return $result ? $result : null;
}

/**
 * Get doctor by ID
 */
function getDoctorById($doctor_id) {
    global $db;
    
    $doctor_id = (int)$doctor_id;
    $sql = "SELECT * FROM doctors WHERE doctor_id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$doctor_id]);
    $result = $stmt->fetch();
    
    return $result ? $result : null;
}

/**
 * Format date for display
 */
function formatDate($date) {
    if (empty($date)) return '';
    return date('F d, Y', strtotime($date));
}

