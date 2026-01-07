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
                    <label>Patient *</label>
                    <div style="margin-bottom: 10px;">
                        <button type="button" class="btn-secondary" id="toggle-patient-mode" onclick="togglePatientMode()" style="font-size: 0.85rem; padding: 8px 15px;">
                            + Add New Patient
                        </button>
                    </div>
                    
                    <!-- Select Existing Patient -->
                    <div id="select-patient-section">
                        <select id="patient_id" name="patient_id" required>
                            <option value="">Select Patient</option>
                            <?php foreach ($patients as $patient): ?>
                                <option value="<?php echo $patient['patient_id']; ?>">
                                    <?php echo htmlspecialchars($patient['name'] . ' (' . $patient['age'] . ' years, ' . $patient['gender'] . ')'); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <!-- Add New Patient Form -->
                    <div id="new-patient-section" style="display: none;">
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Patient Name *</label>
                                <input type="text" id="new_patient_name" placeholder="Enter patient name" style="width: 100%; padding: 10px; border: 1.5px solid #ddd; border-radius: 5px;">
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Age</label>
                                    <input type="number" id="new_patient_age" placeholder="Age" min="0" max="150" style="width: 100%; padding: 10px; border: 1.5px solid #ddd; border-radius: 5px;">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Gender</label>
                                    <select id="new_patient_gender" style="width: 100%; padding: 10px; border: 1.5px solid #ddd; border-radius: 5px;">
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Phone</label>
                                <input type="text" id="new_patient_phone" placeholder="Phone number" style="width: 100%; padding: 10px; border: 1.5px solid #ddd; border-radius: 5px;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Address</label>
                                <textarea id="new_patient_address" placeholder="Address" rows="2" style="width: 100%; padding: 10px; border: 1.5px solid #ddd; border-radius: 5px; resize: vertical;"></textarea>
                            </div>
                        </div>
                    </div>
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

