<?php
/**
 * Main page - Prescription Management Interface
 * Allows doctors to create and view prescriptions
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

// Get doctors and patients for dropdowns
$doctors = getAllDoctors();
$patients = getAllPatients();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hospital Management System - Prescription Module</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header>
        <div class="header-content">
            <h1>Hospital Management System</h1>
            <h2>View Prescriptions</h2>
        </div>
    </header>

    <nav class="page-nav">
        <div class="nav-container">
            <a href="index.php" class="nav-link active">View Prescriptions</a>
            <a href="create.php" class="nav-link">Create Prescription</a>
        </div>
    </nav>

    <div class="content-wrapper">
        <div class="view-container">
            <h3>Prescription Records</h3>
            
            <div class="filters">
                <select id="filter-doctor" onchange="loadPrescriptions()">
                    <option value="">All Doctors</option>
                    <?php foreach ($doctors as $doctor): ?>
                        <option value="<?php echo $doctor['doctor_id']; ?>">
                            <?php echo htmlspecialchars($doctor['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                
                <select id="filter-patient" onchange="loadPrescriptions()">
                    <option value="">All Patients</option>
                    <?php foreach ($patients as $patient): ?>
                        <option value="<?php echo $patient['patient_id']; ?>">
                            <?php echo htmlspecialchars($patient['name']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                
                <button class="btn-secondary" onclick="loadPrescriptions()">Refresh</button>
            </div>

            <div id="prescriptions-list" class="prescriptions-list">
                <!-- Prescriptions will be loaded here -->
            </div>
        </div>
    </div>

    <script src="assets/js/script.js"></script>
</body>
</html>

