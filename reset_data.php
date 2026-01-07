<?php
/**
 * Reset Database Data
 * Clears all prescription data from the database
 * 
 * Access: http://localhost:8000/reset_data.php
 */

require_once __DIR__ . '/config/database.php';

$conn = $db->getConnection();

try {
    // Delete all prescription medications first (due to foreign key)
    $conn->exec('DELETE FROM prescription_medications');
    $deleted_meds = $conn->changes();
    
    // Delete all prescriptions
    $conn->exec('DELETE FROM prescriptions');
    $deleted_prescriptions = $conn->changes();
    
    echo "<!DOCTYPE html>
    <html>
    <head>
        <title>Reset Data</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .btn { display: inline-block; padding: 10px 20px; background: #333; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .btn:hover { background: #222; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>Database Reset</h1>
            <div class='success'>
                <strong>✓ Data Cleared Successfully!</strong><br><br>
                Prescriptions deleted: $deleted_prescriptions<br>
                Medications deleted: $deleted_meds
            </div>
            <p><strong>Note:</strong> Doctors and patients data remain unchanged.</p>
            <a href='index.php' class='btn'>← Back to View Prescriptions</a>
            <a href='create.php' class='btn'>Create New Prescription</a>
        </div>
    </body>
    </html>";
    
} catch (Exception $e) {
    echo "<!DOCTYPE html>
    <html>
    <head>
        <title>Reset Error</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='error'>
            <strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "
        </div>
        <a href='index.php'>← Back</a>
    </body>
    </html>";
}
?>

