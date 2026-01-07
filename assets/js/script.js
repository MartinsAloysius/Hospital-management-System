// Hospital Management System - Prescription Module JavaScript

let medicationCount = 0;

// Tab switching functionality removed - both sections now on same page

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
            showMessage('Prescription created successfully! Redirecting to view page...', 'success');
            // Redirect to view page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.php';
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
    if (!prescriptionsList) {
        console.error('Prescriptions list element not found');
        return;
    }
    
    // Check if view tab is visible
    const viewTab = document.getElementById('view-tab');
    if (viewTab) {
        const isVisible = window.getComputedStyle(viewTab).display !== 'none';
        console.log('View tab visible:', isVisible, 'Has active class:', viewTab.classList.contains('active'));
        if (!isVisible || !viewTab.classList.contains('active')) {
            console.warn('View tab is not active/visible, but loading prescriptions anyway');
        }
    }
    
    prescriptionsList.innerHTML = '<p style="text-align: center; padding: 20px;">Loading...</p>';
    
    const doctorId = document.getElementById('filter-doctor') ? document.getElementById('filter-doctor').value : '';
    const patientId = document.getElementById('filter-patient') ? document.getElementById('filter-patient').value : '';
    
    let url = 'api/get_prescriptions.php';
    const params = [];
    if (doctorId) params.push('doctor_id=' + doctorId);
    if (patientId) params.push('patient_id=' + patientId);
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        
        const result = await response.json();
        
        if (result.success && result.prescriptions && result.prescriptions.length > 0) {
            displayPrescriptions(result.prescriptions);
        } else {
            prescriptionsList.innerHTML = '<div class="empty-state"><h3>No prescriptions found</h3><p>Create a new prescription to get started.</p></div>';
        }
    } catch (error) {
        console.error('Error loading prescriptions:', error);
        prescriptionsList.innerHTML = '<div class="empty-state"><h3>Error loading prescriptions</h3><p>' + error.message + '</p><p style="font-size: 12px; margin-top: 10px;">Check browser console (F12) for details.</p></div>';
    }
}

// Display prescriptions
function displayPrescriptions(prescriptions) {
    console.log('displayPrescriptions called with:', prescriptions);
    const prescriptionsList = document.getElementById('prescriptions-list');
    
    if (!prescriptionsList) {
        console.error('Prescriptions list element not found');
        return;
    }
    
    if (!prescriptions || prescriptions.length === 0) {
        console.log('No prescriptions to display');
        prescriptionsList.innerHTML = '<div class="empty-state"><h3>No prescriptions found</h3><p>Create a new prescription to get started.</p></div>';
        return;
    }
    
    console.log('Building HTML for', prescriptions.length, 'prescriptions');
    let html = '';
    
    prescriptions.forEach(prescription => {
        // Handle date formatting safely
        let dateStr = 'N/A';
        try {
            if (prescription.prescription_date) {
                const date = new Date(prescription.prescription_date);
                dateStr = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        } catch (e) {
            dateStr = prescription.prescription_date || 'N/A';
        }
        
        // Escape HTML to prevent XSS
        const escapeHtml = (text) => {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        html += `
            <div class="prescription-card">
                <div class="prescription-header">
                    <div class="prescription-info">
                        <h4>Prescription #${prescription.prescription_id || 'N/A'}</h4>
                        <p><strong>Patient:</strong> ${escapeHtml(prescription.patient_name || 'Unknown')} ${prescription.age ? '(' + prescription.age + ' years)' : ''}</p>
                        <p><strong>Doctor:</strong> ${escapeHtml(prescription.doctor_name || 'Unknown')}${prescription.specialization ? ' - ' + escapeHtml(prescription.specialization) : ''}</p>
                        <p><strong>Date:</strong> ${dateStr}</p>
                        ${prescription.diagnosis ? '<p><strong>Diagnosis:</strong> ' + escapeHtml(prescription.diagnosis) + '</p>' : ''}
                    </div>
                    <span class="prescription-status status-${prescription.status || 'active'}">${prescription.status || 'active'}</span>
                </div>
                <div class="medications-preview">
                    <h5>Medications:</h5>
                    <p style="color: #999; font-size: 13px;">View full prescription details</p>
                </div>
            </div>
        `;
    });
    
    // Set HTML
    prescriptionsList.innerHTML = html;
}

// Initialize - add first medication field on page load and load prescriptions
document.addEventListener('DOMContentLoaded', function() {
    addMedication();
    // Load prescriptions automatically on page load
    loadPrescriptions();
});


