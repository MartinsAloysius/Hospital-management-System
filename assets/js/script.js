// Hospital Management System - Prescription Module JavaScript

let medicationCount = 0;

// Tab switching functionality
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load prescriptions if viewing tab
    if (tabName === 'view') {
        loadPrescriptions();
    }
}

// Add medication field
function addMedication() {
    medicationCount++;
    const medicationsList = document.getElementById('medications-list');
    
    const medicationItem = document.createElement('div');
    medicationItem.className = 'medication-item';
    medicationItem.id = 'medication-' + medicationCount;
    
    medicationItem.innerHTML = `
        <div class="medication-item-header">
            <h5>Medication #${medicationCount}</h5>
            <button type="button" class="btn-remove" onclick="removeMedication(${medicationCount})">Remove</button>
        </div>
        <div class="medication-fields">
            <div class="form-group full-width">
                <label>Medication Name *</label>
                <input type="text" name="medications[${medicationCount}][medication_name]" 
                       placeholder="e.g., Paracetamol 500mg" required>
            </div>
            <div class="form-group">
                <label>Dosage *</label>
                <input type="text" name="medications[${medicationCount}][dosage]" 
                       placeholder="e.g., 500mg" required>
            </div>
            <div class="form-group">
                <label>Frequency *</label>
                <input type="text" name="medications[${medicationCount}][frequency]" 
                       placeholder="e.g., Twice daily" required>
            </div>
            <div class="form-group">
                <label>Duration *</label>
                <input type="text" name="medications[${medicationCount}][duration]" 
                       placeholder="e.g., 7 days" required>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" name="medications[${medicationCount}][quantity]" 
                       value="1" min="1">
            </div>
            <div class="form-group full-width">
                <label>Instructions</label>
                <textarea name="medications[${medicationCount}][instructions]" 
                          rows="2" placeholder="Special instructions for taking this medication..."></textarea>
            </div>
        </div>
    `;
    
    medicationsList.appendChild(medicationItem);
}

// Remove medication field
function removeMedication(id) {
    const medicationItem = document.getElementById('medication-' + id);
    if (medicationItem) {
        medicationItem.remove();
    }
}

// Reset form
function resetForm() {
    document.getElementById('prescription-form').reset();
    document.getElementById('medications-list').innerHTML = '';
    medicationCount = 0;
    hideMessage();
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideMessage();
    }, 5000);
}

// Hide message
function hideMessage() {
    const messageDiv = document.getElementById('form-message');
    messageDiv.style.display = 'none';
    messageDiv.className = 'message';
}

// Handle form submission
document.getElementById('prescription-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate that at least one medication is added
    const medications = document.querySelectorAll('.medication-item');
    if (medications.length === 0) {
        showMessage('Please add at least one medication', 'error');
        return;
    }
    
    // Collect form data
    const formData = new FormData(this);
    const data = {
        doctor_id: formData.get('doctor_id'),
        patient_id: formData.get('patient_id'),
        prescription_date: formData.get('prescription_date'),
        diagnosis: formData.get('diagnosis'),
        notes: formData.get('notes'),
        medications: []
    };
    
    // Collect medications
    medications.forEach((med, index) => {
        const medData = {
            medication_name: med.querySelector('input[name*="[medication_name]"]').value,
            dosage: med.querySelector('input[name*="[dosage]"]').value,
            frequency: med.querySelector('input[name*="[frequency]"]').value,
            duration: med.querySelector('input[name*="[duration]"]').value,
            quantity: med.querySelector('input[name*="[quantity]"]').value || 1,
            instructions: med.querySelector('textarea[name*="[instructions]"]').value
        };
        data.medications.push(medData);
    });
    
    // Validate medications
    for (let med of data.medications) {
        if (!med.medication_name || !med.dosage || !med.frequency || !med.duration) {
            showMessage('Please fill all required medication fields', 'error');
            return;
        }
    }
    
    // Submit to API
    try {
        const response = await fetch('api/create_prescription.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Prescription created successfully!', 'success');
            setTimeout(() => {
                resetForm();
            }, 2000);
        } else {
            showMessage(result.message || 'Failed to create prescription', 'error');
        }
    } catch (error) {
        showMessage('An error occurred: ' + error.message, 'error');
    }
});

// Load prescriptions
async function loadPrescriptions() {
    const prescriptionsList = document.getElementById('prescriptions-list');
    prescriptionsList.innerHTML = '<p style="text-align: center; padding: 20px;">Loading...</p>';
    
    const doctorId = document.getElementById('filter-doctor').value;
    const patientId = document.getElementById('filter-patient').value;
    
    let url = 'api/get_prescriptions.php?';
    if (doctorId) url += 'doctor_id=' + doctorId + '&';
    if (patientId) url += 'patient_id=' + patientId;
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success && result.prescriptions) {
            displayPrescriptions(result.prescriptions);
        } else {
            prescriptionsList.innerHTML = '<div class="empty-state"><h3>No prescriptions found</h3><p>Create a new prescription to get started.</p></div>';
        }
    } catch (error) {
        prescriptionsList.innerHTML = '<div class="empty-state"><h3>Error loading prescriptions</h3><p>' + error.message + '</p></div>';
    }
}

// Display prescriptions
function displayPrescriptions(prescriptions) {
    const prescriptionsList = document.getElementById('prescriptions-list');
    
    if (prescriptions.length === 0) {
        prescriptionsList.innerHTML = '<div class="empty-state"><h3>No prescriptions found</h3><p>Create a new prescription to get started.</p></div>';
        return;
    }
    
    let html = '';
    
    prescriptions.forEach(prescription => {
        const date = new Date(prescription.prescription_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        html += `
            <div class="prescription-card">
                <div class="prescription-header">
                    <div class="prescription-info">
                        <h4>Prescription #${prescription.prescription_id}</h4>
                        <p><strong>Patient:</strong> ${prescription.patient_name} (${prescription.age} years)</p>
                        <p><strong>Doctor:</strong> ${prescription.doctor_name} - ${prescription.specialization}</p>
                        <p><strong>Date:</strong> ${date}</p>
                        ${prescription.diagnosis ? '<p><strong>Diagnosis:</strong> ' + prescription.diagnosis + '</p>' : ''}
                    </div>
                    <span class="prescription-status status-${prescription.status}">${prescription.status}</span>
                </div>
                <div class="medications-preview">
                    <h5>Medications:</h5>
                    <p style="color: #999; font-size: 13px;">Click to view full details</p>
                </div>
            </div>
        `;
    });
    
    prescriptionsList.innerHTML = html;
}

// Initialize - add first medication field on page load
document.addEventListener('DOMContentLoaded', function() {
    addMedication();
});

