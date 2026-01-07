<?php
/**
 * API endpoint for creating a new patient
 * Handles POST requests to save patient data
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
$required_fields = ['name'];
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

try {
    $conn = $db->getConnection();
    
    // Insert patient
    $stmt = $conn->prepare("INSERT INTO patients (name, age, gender, phone, address) 
                           VALUES (?, ?, ?, ?, ?)");
    
    $name = trim($input['name']);
    $age = isset($input['age']) && !empty($input['age']) ? (int)$input['age'] : null;
    $gender = isset($input['gender']) && !empty($input['gender']) ? $input['gender'] : null;
    $phone = isset($input['phone']) && !empty($input['phone']) ? $input['phone'] : null;
    $address = isset($input['address']) && !empty($input['address']) ? $input['address'] : null;
    
    $stmt->execute([$name, $age, $gender, $phone, $address]);
    
    $patient_id = $conn->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Patient created successfully',
        'patient_id' => $patient_id,
        'patient' => [
            'patient_id' => $patient_id,
            'name' => $name,
            'age' => $age,
            'gender' => $gender,
            'phone' => $phone,
            'address' => $address
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

