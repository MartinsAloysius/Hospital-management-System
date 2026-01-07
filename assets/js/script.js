// Hospital Management System - Prescription Module JavaScript

let medicationCount = 0;
let isNewPatientMode = false;

// Toggle between select existing patient and add new patient
function togglePatientMode() {
    isNewPatientMode = !isNewPatientMode;
    const selectSection = document.getElementById('select-patient-section');
    const newPatientSection = document.getElementById('new-patient-section');
    const toggleButton = document.getElementById('toggle-patient-mode');
    const patientSelect = document.getElementById('patient_id');
    
    if (isNewPatientMode) {
        selectSection.style.display = 'none';
        newPatientSection.style.display = 'block';
        toggleButton.textContent = '← Select Existing Patient';
        patientSelect.removeAttribute('required');
        document.getElementById('new_patient_name').setAttribute('required', 'required');
    } else {
        selectSection.style.display = 'block';
        newPatientSection.style.display = 'none';
        toggleButton.textContent = '+ Add New Patient';
        patientSelect.setAttribute('required', 'required');
        document.getElementById('new_patient_name').removeAttribute('required');
    }
}

// Create new patient
async function createPatient() {
    const name = document.getElementById('new_patient_name').value.trim();
    if (!name) {
        showMessage('Patient name is required', 'error');
        return null;
    }
    
    const patientData = {
        name: name,
        age: document.getElementById('new_patient_age').value || null,
        gender: document.getElementById('new_patient_gender').value || null,
        phone: document.getElementById('new_patient_phone').value.trim() || null,
        address: document.getElementById('new_patient_address').value.trim() || null
    };
    
    try {
        const response = await fetch('api/create_patient.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Add new patient to dropdown
            const patientSelect = document.getElementById('patient_id');
            const option = document.createElement('option');
            option.value = result.patient_id;
            const displayText = result.patient.name + 
                (result.patient.age ? ' (' + result.patient.age + ' years' : '') +
                (result.patient.gender ? ', ' + result.patient.gender : '') + ')';
            option.textContent = displayText;
            patientSelect.appendChild(option);
            
            // Select the newly created patient
            patientSelect.value = result.patient_id;
            
            return result.patient_id;
        } else {
            showMessage(result.message || 'Failed to create patient', 'error');
            return null;
        }
    } catch (error) {
        showMessage('Error creating patient: ' + error.message, 'error');
        return null;
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
    
    // Reset patient mode to select existing
    if (isNewPatientMode) {
        togglePatientMode();
    }
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

// Handle form submission (only if form exists - for create.php)
const prescriptionForm = document.getElementById('prescription-form');
if (prescriptionForm) {
    prescriptionForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate that at least one medication is added
    const medications = document.querySelectorAll('.medication-item');
    if (medications.length === 0) {
        showMessage('Please add at least one medication', 'error');
        return;
    }
    
    // Collect form data
    const formData = new FormData(this);
    
    // If new patient mode, create patient first
    let patientId = null;
    if (isNewPatientMode) {
        patientId = await createPatient();
        if (!patientId) {
            return; // Stop if patient creation failed
        }
    } else {
        patientId = formData.get('patient_id');
        if (!patientId) {
            showMessage('Please select a patient', 'error');
            return;
        }
    }
    const data = {
        doctor_id: formData.get('doctor_id'),
        patient_id: patientId,
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
}

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
        
        html += `
            <div class="prescription-card" data-prescription-id="${prescription.prescription_id}" onclick="viewPrescriptionDetails(${prescription.prescription_id})" style="cursor: pointer;">
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
                    <p style="color: #999; font-size: 13px; text-decoration: underline;">Click to view full prescription details</p>
                </div>
                <div id="medications-${prescription.prescription_id}" class="medications-details" style="display: none; visibility: visible; opacity: 1; min-height: 0;">
                    <!-- Medications will be loaded here -->
                </div>
            </div>
        `;
    });
    
    // Set HTML
    prescriptionsList.innerHTML = html;
}

// View full prescription details
async function viewPrescriptionDetails(prescriptionId) {
    console.log('Viewing prescription details for ID:', prescriptionId);
    const medicationsDiv = document.getElementById('medications-' + prescriptionId);
    
    if (!medicationsDiv) {
        console.error('Medications div not found for prescription ID:', prescriptionId);
        alert('Error: Could not find medications container');
        return;
    }
    
    const isCurrentlyVisible = medicationsDiv.style.display === 'block' || window.getComputedStyle(medicationsDiv).display === 'block';
    const hasContent = medicationsDiv.innerHTML.trim() !== '' && !medicationsDiv.innerHTML.includes('<!-- Medications will be loaded here -->');
    
    // If already loaded and visible, toggle to hide
    if (isCurrentlyVisible && hasContent) {
        medicationsDiv.style.display = 'none';
        return;
    }
    
    // If already loaded but hidden, just show it
    if (!isCurrentlyVisible && hasContent) {
        medicationsDiv.style.display = 'block';
        medicationsDiv.style.visibility = 'visible';
        medicationsDiv.style.opacity = '1';
        return;
    }
    
    // Show loading
    medicationsDiv.innerHTML = '<p style="text-align: center; color: #333; padding: 20px; background: white; border-radius: 5px;">Loading medications...</p>';
    medicationsDiv.style.display = 'block';
    medicationsDiv.style.visibility = 'visible';
    medicationsDiv.style.opacity = '1';
    
    try {
        const url = `api/get_prescriptions.php?prescription_id=${prescriptionId}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.success && result.prescription) {
            const medications = result.prescription.medications || [];
            console.log('Medications found:', medications.length, medications);
            
            if (medications.length > 0) {
                displayMedications(prescriptionId, medications, result.prescription);
            } else {
                medicationsDiv.innerHTML = '<div style="color: #333; padding: 20px; text-align: center; background: white; border-radius: 5px;">No medications found for this prescription</div>';
            }
        } else {
            console.error('API returned error:', result.message || 'Unknown error');
            medicationsDiv.innerHTML = `<div style="color: #d32f2f; padding: 20px; text-align: center; background: white; border-radius: 5px;">${result.message || 'Failed to load prescription details'}</div>`;
        }
    } catch (error) {
        console.error('Error loading prescription details:', error);
        medicationsDiv.innerHTML = `<div style="color: #d32f2f; padding: 20px; text-align: center; background: white; border-radius: 5px;">Error loading details: ${error.message}</div>`;
    }
}

// Display medications for a prescription
function displayMedications(prescriptionId, medications, prescription) {
    const medicationsDiv = document.getElementById('medications-' + prescriptionId);
    if (!medicationsDiv) {
        console.error('Medications div not found for prescription ID:', prescriptionId);
        return;
    }
    
    console.log('Displaying medications:', medications);
    
    let html = '<div class="medications-list-full" style="display: block !important; visibility: visible !important; opacity: 1 !important; padding: 15px; background: #f9f9f9; border-radius: 5px; margin-top: 15px; width: 100%;">';
    
    if (medications && medications.length > 0) {
        html += '<h5 style="margin-bottom: 15px; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 8px;">Medication Details:</h5>';
        
        medications.forEach((med, index) => {
            html += `
                <div class="medication-detail-item" style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e0e0e0;">
                    <h6 style="margin-bottom: 12px; color: #333; font-weight: 600; font-size: 1rem;">${index + 1}. ${escapeHtml(med.medication_name || 'Unknown Medication')}</h6>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.9rem; color: #666;">
                        <p style="margin: 5px 0;"><strong>Dosage:</strong> ${escapeHtml(med.dosage || 'N/A')}</p>
                        <p style="margin: 5px 0;"><strong>Frequency:</strong> ${escapeHtml(med.frequency || 'N/A')}</p>
                        <p style="margin: 5px 0;"><strong>Duration:</strong> ${escapeHtml(med.duration || 'N/A')}</p>
                        <p style="margin: 5px 0;"><strong>Quantity:</strong> ${med.quantity || 1}</p>
                    </div>
                    ${med.instructions ? '<p style="margin-top: 12px; font-size: 0.9rem; color: #555; padding-top: 10px; border-top: 1px solid #f0f0f0;"><strong>Instructions:</strong> ' + escapeHtml(med.instructions) + '</p>' : ''}
                </div>
            `;
        });
    } else {
        html += '<p style="color: #999; text-align: center; padding: 20px;">No medications found</p>';
    }
    
    if (prescription && prescription.notes) {
        html += `<div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #ddd; color: #555;"><strong>Additional Notes:</strong> ${escapeHtml(prescription.notes)}</div>`;
    }
    
    html += '</div>';
    
    console.log('Setting innerHTML, length:', html.length);
    console.log('HTML preview:', html.substring(0, 300));
    
    // Clear and set content
    medicationsDiv.innerHTML = '';
    medicationsDiv.innerHTML = html;
    
    // Force display
    medicationsDiv.style.display = 'block';
    medicationsDiv.style.visibility = 'visible';
    medicationsDiv.style.opacity = '1';
    medicationsDiv.style.minHeight = '50px';
    medicationsDiv.style.width = '100%';
    
    // Force a reflow to ensure display
    void medicationsDiv.offsetHeight;
    
    // Verify content is there
    const children = medicationsDiv.children;
    console.log('Medications displayed successfully. Children count:', children.length);
    console.log('Div display:', window.getComputedStyle(medicationsDiv).display);
    console.log('Div visibility:', window.getComputedStyle(medicationsDiv).visibility);
    console.log('Div opacity:', window.getComputedStyle(medicationsDiv).opacity);
    console.log('Div innerHTML length:', medicationsDiv.innerHTML.length);
    
    if (children.length === 0) {
        console.error('WARNING: No children found in medications div after setting innerHTML!');
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize - add first medication field on page load and load prescriptions
document.addEventListener('DOMContentLoaded', function() {
    // Only add medication field if we're on create page
    if (document.getElementById('prescription-form')) {
        addMedication();
    }
    // Load prescriptions automatically on page load (only on view page)
    if (document.getElementById('prescriptions-list')) {
        loadPrescriptions();
    }
});


