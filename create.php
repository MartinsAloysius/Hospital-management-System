<?php
/**
 * Create Prescription Page
 * Allows doctors to create new prescriptions
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
    <title>Create Prescription - Hospital Management System</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header>
        <div class="header-content">
            <h1>Hospital Management System</h1>
            <h2>Create Prescription</h2>
        </div>
    </header>

    <nav class="page-nav">
        <div class="nav-container">
            <a href="index.php" class="nav-link">View Prescriptions</a>
            <a href="create.php" class="nav-link active">Create Prescription</a>
        </div>
    </nav>

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

    <script src="assets/js/script.js"></script>
</body>
</html>

