// Storage key for localStorage
const STORAGE_KEY = 'fiberOpticInstallations';

// Global array to store photos temporarily during form input
let currentPhotos = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadProjects();
    setupFormSubmit();
    setupSearch();
    setupReportFilters();
    setupPhotoUpload();
    renderReports();
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Refresh data when switching to certain tabs
            if (targetTab === 'projects') {
                loadProjects();
            } else if (targetTab === 'reports') {
                renderReports();
            }
        });
    });
}

// Form submission
function setupFormSubmit() {
    const form = document.getElementById('installationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const installation = {
            id: Date.now(),
            projectName: document.getElementById('projectName').value,
            location: document.getElementById('location').value,
            client: document.getElementById('client').value,
            installDate: document.getElementById('installDate').value,
            cableType: document.getElementById('cableType').value,
            fiberCount: document.getElementById('fiberCount').value,
            cableLength: document.getElementById('cableLength').value,
            manufacturer: document.getElementById('manufacturer').value,
            spliceType: document.getElementById('spliceType').value,
            spliceCount: document.getElementById('spliceCount').value,
            avgSpliceLoss: document.getElementById('avgSpliceLoss').value,
            otdrTest: document.getElementById('otdrTest').value,
            insertionLoss: document.getElementById('insertionLoss').value,
            returnLoss: document.getElementById('returnLoss').value,
            testResults: document.getElementById('testResults').value,
            technician: document.getElementById('technician').value,
            notes: document.getElementById('notes').value,
            issues: document.getElementById('issues').value,
            photos: currentPhotos, // Add photos to installation data
            createdAt: new Date().toISOString()
        };
        
        saveInstallation(installation);
        form.reset();
        currentPhotos = []; // Clear photos array
        document.getElementById('photoPreviewContainer').innerHTML = ''; // Clear preview
        
        // Show success message
        alert('Installation documented successfully!');
        
        // Switch to projects tab
        document.querySelector('[data-tab="projects"]').click();
    });
}

// Save installation to localStorage
function saveInstallation(installation) {
    const installations = getInstallations();
    installations.push(installation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(installations));
}

// Get all installations from localStorage
function getInstallations() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Delete installation
function deleteInstallation(id) {
    if (confirm('Are you sure you want to delete this installation?')) {
        const installations = getInstallations();
        const filtered = installations.filter(inst => inst.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        loadProjects();
        renderReports();
    }
}

// Load and display projects
function loadProjects(searchTerm = '') {
    const installations = getInstallations();
    const projectsList = document.getElementById('projectsList');
    
    if (installations.length === 0) {
        projectsList.innerHTML = `
            <div class="empty-state">
                <h3>No installations documented yet</h3>
                <p>Start by documenting your first fiber optic installation</p>
            </div>
        `;
        return;
    }
    
    // Filter by search term
    const filtered = installations.filter(inst => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return inst.projectName.toLowerCase().includes(term) ||
               inst.location.toLowerCase().includes(term) ||
               inst.client.toLowerCase().includes(term);
    });
    
    if (filtered.length === 0) {
        projectsList.innerHTML = `
            <div class="empty-state">
                <h3>No projects found</h3>
                <p>Try a different search term</p>
            </div>
        `;
        return;
    }
    
    projectsList.innerHTML = filtered.map(inst => `
        <div class="project-card" onclick="viewProjectDetails(${inst.id})">
            <h3>${inst.projectName}</h3>
            <div class="detail"><strong>Location:</strong> ${inst.location}</div>
            <div class="detail"><strong>Client:</strong> ${inst.client || 'N/A'}</div>
            <div class="detail"><strong>Date:</strong> ${formatDate(inst.installDate)}</div>
            <div class="detail"><strong>Cable:</strong> ${inst.cableType} (${inst.fiberCount} fibers)</div>
            <div class="detail"><strong>Length:</strong> ${inst.cableLength}m</div>
            ${inst.photos && inst.photos.length > 0 ? `<div class="detail"><strong>Photos:</strong> ${inst.photos.length}</div>` : ''}
            <span class="status-badge status-${inst.testResults.toLowerCase()}">${inst.testResults}</span>
            <button onclick="event.stopPropagation(); deleteInstallation(${inst.id})" class="btn-delete">Delete</button>
        </div>
    `).join('');
}

// View project details
function viewProjectDetails(id) {
    const installations = getInstallations();
    const installation = installations.find(inst => inst.id === id);
    
    if (!installation) return;
    
    const details = `
Project: ${installation.projectName}
Location: ${installation.location}
Client: ${installation.client || 'N/A'}
Date: ${formatDate(installation.installDate)}
Technician: ${installation.technician || 'N/A'}

CABLE SPECIFICATIONS:
- Type: ${installation.cableType}
- Fiber Count: ${installation.fiberCount}
- Length: ${installation.cableLength}m
- Manufacturer: ${installation.manufacturer || 'N/A'}

SPLICE INFORMATION:
- Type: ${installation.spliceType || 'N/A'}
- Count: ${installation.spliceCount || '0'}
- Avg Loss: ${installation.avgSpliceLoss || 'N/A'} dB

TESTING RESULTS:
- OTDR Test: ${installation.otdrTest}
- Insertion Loss: ${installation.insertionLoss || 'N/A'} dB
- Return Loss: ${installation.returnLoss || 'N/A'} dB
- Status: ${installation.testResults}

NOTES:
${installation.notes || 'No notes'}

ISSUES:
${installation.issues || 'No issues reported'}
    `;
    
    alert(details);
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchProjects');
    searchInput.addEventListener('input', function(e) {
        loadProjects(e.target.value);
    });
}

// Setup report filters
function setupReportFilters() {
    const filterStatus = document.getElementById('filterStatus');
    filterStatus.addEventListener('change', function() {
        renderReports(this.value);
    });
}

// Render reports
function renderReports(statusFilter = 'all') {
    const installations = getInstallations();
    const reportsList = document.getElementById('reportsList');
    
    if (installations.length === 0) {
        reportsList.innerHTML = `
            <div class="empty-state">
                <h3>No installation data available</h3>
                <p>Document installations to generate reports</p>
            </div>
        `;
        return;
    }
    
    // Filter by status
    const filtered = statusFilter === 'all' 
        ? installations 
        : installations.filter(inst => inst.testResults === statusFilter);
    
    if (filtered.length === 0) {
        reportsList.innerHTML = `
            <div class="empty-state">
                <h3>No installations with ${statusFilter} status</h3>
            </div>
        `;
        return;
    }
    
    reportsList.innerHTML = filtered.map(inst => `
        <div class="report-card">
            <h3>${inst.projectName}</h3>
            <div class="report-details">
                <div class="report-detail-item">
                    <label>Location</label>
                    <span>${inst.location}</span>
                </div>
                <div class="report-detail-item">
                    <label>Client</label>
                    <span>${inst.client || 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Installation Date</label>
                    <span>${formatDate(inst.installDate)}</span>
                </div>
                <div class="report-detail-item">
                    <label>Technician</label>
                    <span>${inst.technician || 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Cable Type</label>
                    <span>${inst.cableType}</span>
                </div>
                <div class="report-detail-item">
                    <label>Fiber Count</label>
                    <span>${inst.fiberCount}</span>
                </div>
                <div class="report-detail-item">
                    <label>Cable Length</label>
                    <span>${inst.cableLength}m</span>
                </div>
                <div class="report-detail-item">
                    <label>Manufacturer</label>
                    <span>${inst.manufacturer || 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Splice Type</label>
                    <span>${inst.spliceType || 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Splice Count</label>
                    <span>${inst.spliceCount || '0'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Avg Splice Loss</label>
                    <span>${inst.avgSpliceLoss ? inst.avgSpliceLoss + ' dB' : 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>OTDR Test</label>
                    <span>${inst.otdrTest}</span>
                </div>
                <div class="report-detail-item">
                    <label>Insertion Loss</label>
                    <span>${inst.insertionLoss ? inst.insertionLoss + ' dB' : 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Return Loss</label>
                    <span>${inst.returnLoss ? inst.returnLoss + ' dB' : 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Test Status</label>
                    <span class="status-badge status-${inst.testResults.toLowerCase()}">${inst.testResults}</span>
                </div>
            </div>
            ${inst.notes ? `
                <div class="report-detail-item" style="margin-top: 15px;">
                    <label>Notes</label>
                    <span>${inst.notes}</span>
                </div>
            ` : ''}
            ${inst.issues ? `
                <div class="report-detail-item" style="margin-top: 15px;">
                    <label>Issues</label>
                    <span>${inst.issues}</span>
                </div>
            ` : ''}
            ${inst.photos && inst.photos.length > 0 ? `
                <div class="report-detail-item" style="margin-top: 15px;">
                    <label>Installation Photos (${inst.photos.length})</label>
                    <div class="photo-gallery">
                        ${inst.photos.map(photo => `
                            <div class="photo-gallery-item">
                                <img src="${photo.data}" alt="${photo.name}">
                                <div class="photo-name">${photo.name}</div>
                                <button class="download-btn" onclick="downloadPhoto('${photo.data}', '${photo.name}')">Download</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="sendReportByEmail(${inst.id})" class="btn btn-primary btn-email">Send via Email</button>
            </div>
        </div>
    `).join('');
}

// Export to JSON
function exportToJSON() {
    const installations = getInstallations();
    
    if (installations.length === 0) {
        alert('No data to export');
        return;
    }
    
    const dataStr = JSON.stringify(installations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiber-optic-installations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to delete all installation data? This cannot be undone.')) {
        if (confirm('This will permanently delete all records. Are you absolutely sure?')) {
            localStorage.removeItem(STORAGE_KEY);
            loadProjects();
            renderReports();
            alert('All data has been cleared');
        }
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Setup photo upload functionality
function setupPhotoUpload() {
    const photoUpload = document.getElementById('photoUpload');
    
    photoUpload.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const photoData = {
                        id: Date.now() + Math.random(),
                        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                        data: event.target.result,
                        type: file.type
                    };
                    
                    currentPhotos.push(photoData);
                    displayPhotoPreview(photoData);
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        // Clear input to allow same file to be selected again
        e.target.value = '';
    });
}

// Display photo preview with editable name
function displayPhotoPreview(photo) {
    const container = document.getElementById('photoPreviewContainer');
    
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-preview-item';
    photoItem.setAttribute('data-photo-id', photo.id);
    
    photoItem.innerHTML = `
        <img src="${photo.data}" alt="${photo.name}">
        <input type="text" value="${photo.name}" placeholder="Photo name" 
               onchange="updatePhotoName(${photo.id}, this.value)">
        <button onclick="removePhoto(${photo.id})">Remove</button>
    `;
    
    container.appendChild(photoItem);
}

// Update photo name
function updatePhotoName(photoId, newName) {
    const photo = currentPhotos.find(p => p.id === photoId);
    if (photo) {
        photo.name = newName;
    }
}

// Remove photo from current selection
function removePhoto(photoId) {
    currentPhotos = currentPhotos.filter(p => p.id !== photoId);
    const photoItem = document.querySelector(`[data-photo-id="${photoId}"]`);
    if (photoItem) {
        photoItem.remove();
    }
}

// Download photo
function downloadPhoto(photoData, photoName) {
    const link = document.createElement('a');
    link.href = photoData;
    link.download = photoName + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Send report via email
function sendReportByEmail(installationId) {
    const installations = getInstallations();
    const installation = installations.find(inst => inst.id === installationId);
    
    if (!installation) {
        alert('Installation not found');
        return;
    }
    
    // Create email body with installation details
    let emailBody = `FIBER OPTIC INSTALLATION REPORT\n\n`;
    emailBody += `Project: ${installation.projectName}\n`;
    emailBody += `Location: ${installation.location}\n`;
    emailBody += `Client: ${installation.client || 'N/A'}\n`;
    emailBody += `Installation Date: ${formatDate(installation.installDate)}\n`;
    emailBody += `Technician: ${installation.technician || 'N/A'}\n\n`;
    
    emailBody += `CABLE SPECIFICATIONS:\n`;
    emailBody += `- Type: ${installation.cableType}\n`;
    emailBody += `- Fiber Count: ${installation.fiberCount}\n`;
    emailBody += `- Length: ${installation.cableLength}m\n`;
    emailBody += `- Manufacturer: ${installation.manufacturer || 'N/A'}\n\n`;
    
    emailBody += `SPLICE INFORMATION:\n`;
    emailBody += `- Type: ${installation.spliceType || 'N/A'}\n`;
    emailBody += `- Count: ${installation.spliceCount || '0'}\n`;
    emailBody += `- Avg Loss: ${installation.avgSpliceLoss || 'N/A'} dB\n\n`;
    
    emailBody += `TESTING RESULTS:\n`;
    emailBody += `- OTDR Test: ${installation.otdrTest}\n`;
    emailBody += `- Insertion Loss: ${installation.insertionLoss || 'N/A'} dB\n`;
    emailBody += `- Return Loss: ${installation.returnLoss || 'N/A'} dB\n`;
    emailBody += `- Status: ${installation.testResults}\n\n`;
    
    if (installation.notes) {
        emailBody += `NOTES:\n${installation.notes}\n\n`;
    }
    
    if (installation.issues) {
        emailBody += `ISSUES:\n${installation.issues}\n\n`;
    }
    
    if (installation.photos && installation.photos.length > 0) {
        emailBody += `\nATTACHMENT NOTE: This installation includes ${installation.photos.length} photo(s).\n`;
        emailBody += `Photos can be downloaded from the web application.\n`;
    }
    
    // Create mailto link
    const subject = encodeURIComponent(`Fiber Optic Installation Report - ${installation.projectName}`);
    const body = encodeURIComponent(emailBody);
    
    // Open email client
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    
    alert('Email client opened. Note: Photos must be downloaded separately from the report and attached manually to the email.');
}
