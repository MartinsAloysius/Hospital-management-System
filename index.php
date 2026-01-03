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
            <h2>Prescription Module</h2>
        </div>
    </header>

    <nav class="tabs">
        <div class="tabs-container">
            <button class="tab-btn active" onclick="showTab('create')">Create Prescription</button>
            <button class="tab-btn" onclick="showTab('view')">View Prescriptions</button>
        </div>
    </nav>

    <!-- Create Prescription Tab -->
    <div id="create-tab" class="tab-content active">
        <div class="content-wrapper">
            <div class="form-container">
                <h3>Create New Prescription</h3>
                <form id="prescription-form">
                    <div class="form-group">
                        <label for="doctor_id">Doctor *</label>
                        <select id="doctor_id" name="doctor_id" required>
                            <option value="">Select Doctor</option>
                            <?php foreach ($doctors as $doctor): ?>
                                <option value="<?php echo $doctor['doctor_id']; ?>">
                                    <?php echo htmlspecialchars($doctor['name'] . ' - ' . $doctor['specialization']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="patient_id">Patient *</label>
                        <select id="patient_id" name="patient_id" required>
                            <option value="">Select Patient</option>
                            <?php foreach ($patients as $patient): ?>
                                <option value="<?php echo $patient['patient_id']; ?>">
                                    <?php echo htmlspecialchars($patient['name'] . ' (' . $patient['age'] . ' years, ' . $patient['gender'] . ')'); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="prescription_date">Prescription Date *</label>
                        <input type="date" id="prescription_date" name="prescription_date" 
                               value="<?php echo date('Y-m-d'); ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="diagnosis">Diagnosis</label>
                        <textarea id="diagnosis" name="diagnosis" rows="3" 
                                  placeholder="Enter patient diagnosis..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="notes">Additional Notes</label>
                        <textarea id="notes" name="notes" rows="2" 
                                  placeholder="Any additional notes or instructions..."></textarea>
                    </div>

                    <div class="medications-section">
                        <h4>Medications *</h4>
                        <div id="medications-list">
                            <!-- Medications will be added here dynamically -->
                        </div>
                        <button type="button" class="btn-secondary" onclick="addMedication()">
                            <span>+</span> Add Medication
                        </button>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Save Prescription</button>
                        <button type="reset" class="btn-secondary" onclick="resetForm()">Clear Form</button>
                    </div>

                    <div id="form-message" class="message"></div>
                </form>
            </div>
        </div>

        <!-- View Prescriptions Tab -->
        <div id="view-tab" class="tab-content">
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
        </div>

    <script src="assets/js/script.js"></script>
</body>
</html>

