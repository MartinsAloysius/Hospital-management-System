<?php
/**
 * API endpoint for creating a new prescription
 * Handles POST requests to save prescription data
 */

header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// If JSON decode failed, try form data
if (!$input) {
    $input = $_POST;
}

// Validate required fields
$required_fields = ['doctor_id', 'patient_id', 'prescription_date', 'medications'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing_fields)
    ]);
    exit;
}

// Validate medications array
if (!is_array($input['medications']) || empty($input['medications'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'At least one medication is required'
    ]);
    exit;
}

try {
    global $db;
    $conn = $db->getConnection();
    
    // Start transaction
    $conn->beginTransaction();
    
    // Insert prescription
    $stmt = $conn->prepare("INSERT INTO prescriptions (doctor_id, patient_id, prescription_date, diagnosis, notes, status) 
                           VALUES (?, ?, ?, ?, ?, 'active')");
    
    $doctor_id = (int)$input['doctor_id'];
    $patient_id = (int)$input['patient_id'];
    $prescription_date = $input['prescription_date'];
    $diagnosis = isset($input['diagnosis']) ? $input['diagnosis'] : '';
    $notes = isset($input['notes']) ? $input['notes'] : '';
    
    $stmt->execute([$doctor_id, $patient_id, $prescription_date, $diagnosis, $notes]);
    
    $prescription_id = $db->getLastInsertId();
    
    // Insert medications
    $med_stmt = $conn->prepare("INSERT INTO prescription_medications 
                                (prescription_id, medication_name, dosage, frequency, duration, instructions, quantity) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($input['medications'] as $medication) {
        $med_name = $medication['medication_name'] ?? '';
        $dosage = $medication['dosage'] ?? '';
        $frequency = $medication['frequency'] ?? '';
        $duration = $medication['duration'] ?? '';
        $instructions = $medication['instructions'] ?? '';
        $quantity = isset($medication['quantity']) ? (int)$medication['quantity'] : 1;
        
        if (empty($med_name) || empty($dosage) || empty($frequency) || empty($duration)) {
            throw new Exception("All medication fields are required");
        }
        
        $med_stmt->execute([$prescription_id, $med_name, $dosage, $frequency, $duration, $instructions, $quantity]);
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Prescription created successfully',
        'prescription_id' => $prescription_id
    ]);
    
} catch (Exception $e) {
    // Rollback on error
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

