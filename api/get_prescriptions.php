<?php
/**
 * API endpoint for retrieving prescriptions
 * Can filter by doctor_id, patient_id, or get all
 */

header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

global $db;
$conn = $db->getConnection();

// Get filter parameters
$doctor_id = isset($_GET['doctor_id']) ? (int)$_GET['doctor_id'] : null;
$patient_id = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : null;
$prescription_id = isset($_GET['prescription_id']) ? (int)$_GET['prescription_id'] : null;

try {
    // Build query based on filters
    if ($prescription_id) {
        // Get single prescription with details
        $sql = "SELECT p.*, 
                       d.name as doctor_name, d.specialization,
                       pt.name as patient_name, pt.age, pt.gender
                FROM prescriptions p
                LEFT JOIN doctors d ON p.doctor_id = d.doctor_id
                LEFT JOIN patients pt ON p.patient_id = pt.patient_id
                WHERE p.prescription_id = ?";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([$prescription_id]);
        $prescription = $stmt->fetch();
        
        if ($prescription) {
            // Get medications for this prescription
            $med_sql = "SELECT * FROM prescription_medications WHERE prescription_id = ? ORDER BY medication_id";
            $med_stmt = $conn->prepare($med_sql);
            $med_stmt->execute([$prescription_id]);
            $medications = $med_stmt->fetchAll();
            
            $prescription['medications'] = $medications;
            
            echo json_encode([
                'success' => true,
                'prescription' => $prescription
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Prescription not found'
            ]);
        }
        
    } else {
        // Get list of prescriptions
        $sql = "SELECT p.prescription_id, p.prescription_date, p.diagnosis, p.status,
                       d.name as doctor_name, d.specialization,
                       pt.name as patient_name, pt.age
                FROM prescriptions p
                LEFT JOIN doctors d ON p.doctor_id = d.doctor_id
                LEFT JOIN patients pt ON p.patient_id = pt.patient_id
                WHERE 1=1";
        
        $params = array();
        
        if ($doctor_id) {
            $sql .= " AND p.doctor_id = ?";
            $params[] = $doctor_id;
        }
        
        if ($patient_id) {
            $sql .= " AND p.patient_id = ?";
            $params[] = $patient_id;
        }
        
        $sql .= " ORDER BY p.prescription_date DESC, p.prescription_id DESC LIMIT 100";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $prescriptions = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'prescriptions' => $prescriptions,
            'count' => count($prescriptions)
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

