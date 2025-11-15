// Storage key for localStorage
const STORAGE_KEY = 'fiberOpticInstallations';
const CHECKLIST_TEMPLATES_KEY = 'photoChecklistTemplates';

// Global array to store photos temporarily during form input
let currentPhotos = [];
// Global array for photo checklist items
let photoChecklist = [];
// Global array for OTDR files
let currentOtdrFiles = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadProjects();
    setupFormSubmit();
    setupSearch();
    setupReportFilters();
    setupPhotoUpload();
    setupPhotoChecklist();
    setupOtdrFileUpload();
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
            photoChecklist: photoChecklist, // Add checklist to installation data
            otdrFiles: currentOtdrFiles, // Add OTDR files
            createdAt: new Date().toISOString()
        };
        
        saveInstallation(installation);
        form.reset();
        currentPhotos = []; // Clear photos array
        currentOtdrFiles = []; // Clear OTDR files
        document.getElementById('photoPreviewContainer').innerHTML = ''; // Clear preview
        document.getElementById('otdrFilesPreview').innerHTML = ''; // Clear OTDR preview
        // Note: Keep checklist for reuse in next installation
        
        // Show success message
        alert('Installasjon dokumentert!');
        
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
                <h3>Ingen installasjoner dokumentert ennå</h3>
                <p>Start med å dokumentere din første fiberoptiske installasjon</p>
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
                <h3>Ingen prosjekter funnet</h3>
                <p>Prøv et annet søkeord</p>
            </div>
        `;
        return;
    }
    
    projectsList.innerHTML = filtered.map(inst => `
        <div class="project-card" onclick="viewProjectDetails(${inst.id})">
            <h3>${inst.projectName}</h3>
            <div class="detail"><strong>Lokasjon:</strong> ${inst.location}</div>
            <div class="detail"><strong>Kunde:</strong> ${inst.client || 'N/A'}</div>
            <div class="detail"><strong>Dato:</strong> ${formatDate(inst.installDate)}</div>
            <div class="detail"><strong>Kabel:</strong> ${inst.cableType} (${inst.fiberCount} fibre)</div>
            <div class="detail"><strong>Lengde:</strong> ${inst.cableLength}m</div>
            ${inst.photos && inst.photos.length > 0 ? `<div class="detail"><strong>Bilder:</strong> ${inst.photos.length}</div>` : ''}
            <span class="status-badge status-${inst.testResults.toLowerCase()}">${inst.testResults}</span>
            <button onclick="event.stopPropagation(); deleteInstallation(${inst.id})" class="btn-delete">Slett</button>
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
                    <label>Lokasjon</label>
                    <span>${inst.location}</span>
                </div>
                <div class="report-detail-item">
                    <label>Kunde</label>
                    <span>${inst.client || 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Installasjonsdato</label>
                    <span>${formatDate(inst.installDate)}</span>
                </div>
                <div class="report-detail-item">
                    <label>Tekniker</label>
                    <span>${inst.technician || 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Kabeltype</label>
                    <span>${inst.cableType}</span>
                </div>
                <div class="report-detail-item">
                    <label>Antall Fibre</label>
                    <span>${inst.fiberCount}</span>
                </div>
                <div class="report-detail-item">
                    <label>Kabellengde</label>
                    <span>${inst.cableLength}m</span>
                </div>
                <div class="report-detail-item">
                    <label>Produsent</label>
                    <span>${inst.manufacturer || 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Skjøtetype</label>
                    <span>${inst.spliceType || 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Antall Skjøter</label>
                    <span>${inst.spliceCount || '0'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Gj.snitt. Skjøtetap</label>
                    <span>${inst.avgSpliceLoss ? inst.avgSpliceLoss + ' dB' : 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>OTDR-test</label>
                    <span>${inst.otdrTest}</span>
                </div>
                <div class="report-detail-item">
                    <label>Innsetningstap</label>
                    <span>${inst.insertionLoss ? inst.insertionLoss + ' dB' : 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Returtap</label>
                    <span>${inst.returnLoss ? inst.returnLoss + ' dB' : 'N/A'}</span>
                </div>
                <div class="report-detail-item">
                    <label>Teststatus</label>
                    <span class="status-badge status-${inst.testResults.toLowerCase()}">${inst.testResults}</span>
                </div>
            </div>
            ${inst.notes ? `
                <div class="report-detail-item" style="margin-top: 15px;">
                    <label>Notater</label>
                    <span>${inst.notes}</span>
                </div>
            ` : ''}
            ${inst.issues ? `
                <div class="report-detail-item" style="margin-top: 15px;">
                    <label>Problemer</label>
                    <span>${inst.issues}</span>
                </div>
            ` : ''}
            ${inst.photoChecklist && inst.photoChecklist.length > 0 ? `
                <div class="report-detail-item" style="margin-top: 15px;">
                    <label>Bildsjekkliste (${inst.photoChecklist.filter(i => i.checked).length}/${inst.photoChecklist.length} fullført)</label>
                    <div class="photo-checklist-container" style="max-height: 200px;">
                        ${inst.photoChecklist.map(item => `
                            <div class="checklist-item ${item.checked ? 'checked' : ''}">
                                <input type="checkbox" ${item.checked ? 'checked' : ''} disabled>
                                <label>${item.text}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${inst.otdrFiles && inst.otdrFiles.length > 0 ? `
                <div class="report-detail-item" style="margin-top: 15px;">
                    <label>OTDR-målefiler (${inst.otdrFiles.length})</label>
                    <div class="files-preview-container">
                        ${inst.otdrFiles.map(file => `
                            <div class="file-preview-item">
                                <span class="file-icon">${getFileIcon(file.name)}</span>
                                <span class="file-name">${file.name}</span>
                                <span class="file-size">${formatFileSize(file.size)}</span>
                                <button onclick="downloadOtdrFile('${file.data}', '${file.name}')">Last ned</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${inst.photos && inst.photos.length > 0 ? `
                <div class="report-detail-item" style="margin-top: 15px;">
                    <label>Installasjonsbilder (${inst.photos.length})</label>
                    <div class="photo-gallery">
                        ${inst.photos.map(photo => `
                            <div class="photo-gallery-item">
                                <img src="${photo.data}" alt="${photo.name}">
                                <div class="photo-name">${photo.name}</div>
                                <button class="download-btn" onclick="downloadPhoto('${photo.data}', '${photo.name}')">Last ned</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="exportReportAsPDF(${inst.id})" class="btn btn-primary btn-pdf">Eksporter som PDF</button>
                <button onclick="sendReportByEmail(${inst.id})" class="btn btn-primary btn-email">Send via E-post</button>
            </div>
        </div>
    `).join('');
}

// Export to JSON
function exportToJSON() {
    const installations = getInstallations();
    
    if (installations.length === 0) {
        alert('Ingen data å eksportere');
        return;
    }
    
    const dataStr = JSON.stringify(installations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiberoptisk-installasjoner-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Clear all data
function clearAllData() {
    if (confirm('Er du sikker på at du vil slette alle installasjonsdata? Dette kan ikke angres.')) {
        if (confirm('Dette vil permanent slette alle oppføringer. Er du helt sikker?')) {
            localStorage.removeItem(STORAGE_KEY);
            loadProjects();
            renderReports();
            alert('Alle data er slettet');
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
    
    alert('E-postklient åpnet. Merk: Bilder må lastes ned separat fra rapporten og legges ved e-posten manuelt.');
}

// ========== PHOTO CHECKLIST FUNCTIONALITY ==========

// Setup photo checklist
function setupPhotoChecklist() {
    loadChecklistTemplates();
    renderPhotoChecklist();
    
    // Setup template selector
    const templateSelect = document.getElementById('checklistTemplate');
    templateSelect.addEventListener('change', function() {
        if (this.value) {
            loadChecklistTemplate(this.value);
        }
    });
    
    // Setup Enter key for adding items
    const newItemInput = document.getElementById('newChecklistItem');
    newItemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addChecklistItem();
        }
    });
}

// Load checklist templates from localStorage
function loadChecklistTemplates() {
    const templates = getChecklistTemplates();
    const templateSelect = document.getElementById('checklistTemplate');
    
    // Clear existing options except first
    templateSelect.innerHTML = '<option value="">Load a template...</option>';
    
    // Add template options
    Object.keys(templates).forEach(templateName => {
        const option = document.createElement('option');
        option.value = templateName;
        option.textContent = templateName;
        templateSelect.appendChild(option);
    });
}

// Get checklist templates from localStorage
function getChecklistTemplates() {
    const data = localStorage.getItem(CHECKLIST_TEMPLATES_KEY);
    return data ? JSON.parse(data) : getDefaultTemplates();
}

// Default checklist templates
function getDefaultTemplates() {
    return {
        'Standardinstallasjon': [
            'Hovedfordelingsramme',
            'Mellomfordelingsramme',
            'Kabelrute - Inngangspunkt',
            'Kabelrute - Horisontale Løp',
            'Kabelrute - Vertikale Løp',
            'Skjøteskuff',
            'Patch Panel',
            'Utstyrsrom',
            'Kabelmerkinger',
            'Testresultater Visning'
        ],
        'Bygningsinstallasjon': [
            'Bygningsinng',
            'Kjeller/Teknisk Rom',
            'Etasjestiger',
            'Telekommunikasjonsrom',
            'Skrivebordsuttag',
            'Kabelveier',
            'Endelige Termineringer'
        ]
    };
}

// Save checklist templates to localStorage
function saveChecklistTemplates(templates) {
    localStorage.setItem(CHECKLIST_TEMPLATES_KEY, JSON.stringify(templates));
}

// Load a specific template
function loadChecklistTemplate(templateName) {
    const templates = getChecklistTemplates();
    if (templates[templateName]) {
        photoChecklist = templates[templateName].map((item, index) => ({
            id: Date.now() + index,
            text: item,
            checked: false
        }));
        renderPhotoChecklist();
    }
}

// Add new checklist item
function addChecklistItem() {
    const input = document.getElementById('newChecklistItem');
    const text = input.value.trim();
    
    if (text) {
        photoChecklist.push({
            id: Date.now(),
            text: text,
            checked: false
        });
        renderPhotoChecklist();
        input.value = '';
    }
}

// Remove checklist item
function removeChecklistItem(itemId) {
    photoChecklist = photoChecklist.filter(item => item.id !== itemId);
    renderPhotoChecklist();
}

// Toggle checklist item
function toggleChecklistItem(itemId) {
    const item = photoChecklist.find(i => i.id === itemId);
    if (item) {
        item.checked = !item.checked;
        renderPhotoChecklist();
    }
}

// Render photo checklist
function renderPhotoChecklist() {
    const container = document.getElementById('photoChecklistContainer');
    
    if (photoChecklist.length === 0) {
        container.innerHTML = '<div class="checklist-empty">Ingen sjekkliste-elementer. Legg til elementer nedenfor eller last en mal.</div>';
        return;
    }
    
    container.innerHTML = photoChecklist.map(item => `
        <div class="checklist-item ${item.checked ? 'checked' : ''}">
            <input type="checkbox" 
                   id="check-${item.id}" 
                   ${item.checked ? 'checked' : ''} 
                   onchange="toggleChecklistItem(${item.id})">
            <label for="check-${item.id}">${item.text}</label>
            <button onclick="removeChecklistItem(${item.id})">Remove</button>
        </div>
    `).join('');
}

// Save current checklist as template
function saveChecklistAsTemplate() {
    if (photoChecklist.length === 0) {
        alert('Sjekklisten er tom. Legg til elementer før du lagrer som mal.');
        return;
    }
    
    const templateName = prompt('Skriv inn et navn for denne sjekklistemalen:');
    
    if (templateName && templateName.trim()) {
        const templates = getChecklistTemplates();
        templates[templateName.trim()] = photoChecklist.map(item => item.text);
        saveChecklistTemplates(templates);
        loadChecklistTemplates();
        alert(`Mal "${templateName.trim()}" lagret!`);
    }
}

// ========== OTDR FILE UPLOAD FUNCTIONALITY ==========

// Setup OTDR file upload
function setupOtdrFileUpload() {
    const otdrUpload = document.getElementById('otdrFiles');
    
    otdrUpload.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const fileData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: event.target.result
                };
                
                currentOtdrFiles.push(fileData);
                displayOtdrFilePreview(fileData);
            };
            
            reader.readAsDataURL(file);
        });
        
        // Clear input to allow same file to be selected again
        e.target.value = '';
    });
}

// Display OTDR file preview
function displayOtdrFilePreview(file) {
    const container = document.getElementById('otdrFilesPreview');
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-preview-item';
    fileItem.setAttribute('data-file-id', file.id);
    
    const fileSize = formatFileSize(file.size);
    const fileIcon = getFileIcon(file.name);
    
    fileItem.innerHTML = `
        <span class="file-icon">${fileIcon}</span>
        <span class="file-name">${file.name}</span>
        <span class="file-size">${fileSize}</span>
        <button onclick="removeOtdrFile(${file.id})">Remove</button>
    `;
    
    container.appendChild(fileItem);
}

// Remove OTDR file
function removeOtdrFile(fileId) {
    currentOtdrFiles = currentOtdrFiles.filter(f => f.id !== fileId);
    const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
    if (fileItem) {
        fileItem.remove();
    }
}

// Download OTDR file
function downloadOtdrFile(fileData, fileName) {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Get file icon
function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = {
        'sor': '📊',
        'pdf': '📄',
        'zip': '📦',
        'default': '📁'
    };
    return icons[ext] || icons['default'];
}

// ========== PDF EXPORT FUNCTIONALITY ==========

// Export installation report as PDF
function exportReportAsPDF(installationId) {
    const installations = getInstallations();
    const installation = installations.find(inst => inst.id === installationId);
    
    if (!installation) {
        alert('Installasjon ikke funnet');
        return;
    }
    
    // Create a print-friendly window
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>B2Bsluttdokumentasjon - ${installation.projectName}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 {
                    color: #667eea;
                    border-bottom: 3px solid #667eea;
                    padding-bottom: 10px;
                }
                h2 {
                    color: #764ba2;
                    margin-top: 30px;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 5px;
                }
                .section {
                    margin-bottom: 25px;
                }
                .detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                .detail-item {
                    margin-bottom: 10px;
                }
                .detail-label {
                    font-weight: bold;
                    color: #495057;
                }
                .detail-value {
                    color: #6c757d;
                }
                .status-badge {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 12px;
                    font-weight: bold;
                }
                .status-passed { background: #d4edda; color: #155724; }
                .status-failed { background: #f8d7da; color: #721c24; }
                .status-pending { background: #fff3cd; color: #856404; }
                .checklist {
                    margin-top: 15px;
                }
                .checklist-item {
                    padding: 8px;
                    margin-bottom: 5px;
                    border-left: 3px solid #667eea;
                    background: #f8f9fa;
                }
                .checklist-item.checked {
                    background: #d4edda;
                    text-decoration: line-through;
                }
                .photo-list {
                    margin-top: 10px;
                }
                .photo-item {
                    padding: 5px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .file-list {
                    margin-top: 10px;
                }
                .file-item {
                    padding: 5px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                @media print {
                    body { padding: 20px; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>📡 B2Bsluttdokumentasjon</h1>
            <h2>Fiberoptisk Installasjonsrapport</h2>
            
            <div class="section">
                <h2>Prosjektinformasjon</h2>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Prosjektnavn:</div>
                        <div class="detail-value">${installation.projectName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Lokasjon:</div>
                        <div class="detail-value">${installation.location}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Kunde:</div>
                        <div class="detail-value">${installation.client || 'N/A'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Installasjonsdato:</div>
                        <div class="detail-value">${formatDate(installation.installDate)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Tekniker:</div>
                        <div class="detail-value">${installation.technician || 'N/A'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">
                            <span class="status-badge status-${installation.testResults.toLowerCase()}">${installation.testResults}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Kabelspesifikasjoner</h2>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Kabeltype:</div>
                        <div class="detail-value">${installation.cableType}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Antall Fibre:</div>
                        <div class="detail-value">${installation.fiberCount}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Kabellengde:</div>
                        <div class="detail-value">${installation.cableLength}m</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Produsent:</div>
                        <div class="detail-value">${installation.manufacturer || 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Skjøteinformasjon</h2>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Skjøtetype:</div>
                        <div class="detail-value">${installation.spliceType || 'N/A'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Antall Skjøter:</div>
                        <div class="detail-value">${installation.spliceCount || '0'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Gj.snitt. Skjøtetap:</div>
                        <div class="detail-value">${installation.avgSpliceLoss ? installation.avgSpliceLoss + ' dB' : 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Testresultater</h2>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">OTDR-test:</div>
                        <div class="detail-value">${installation.otdrTest}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Innsetningstap:</div>
                        <div class="detail-value">${installation.insertionLoss ? installation.insertionLoss + ' dB' : 'N/A'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Returtap:</div>
                        <div class="detail-value">${installation.returnLoss ? installation.returnLoss + ' dB' : 'N/A'}</div>
                    </div>
                </div>
                ${installation.otdrFiles && installation.otdrFiles.length > 0 ? `
                    <div class="detail-item">
                        <div class="detail-label">OTDR-målefiler (${installation.otdrFiles.length}):</div>
                        <div class="file-list">
                            ${installation.otdrFiles.map(file => `
                                <div class="file-item">${getFileIcon(file.name)} ${file.name} (${formatFileSize(file.size)})</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            ${installation.notes ? `
                <div class="section">
                    <h2>Installasjonsnotater</h2>
                    <p>${installation.notes}</p>
                </div>
            ` : ''}
            
            ${installation.issues ? `
                <div class="section">
                    <h2>Problemer Påtruffet</h2>
                    <p>${installation.issues}</p>
                </div>
            ` : ''}
            
            ${installation.photoChecklist && installation.photoChecklist.length > 0 ? `
                <div class="section">
                    <h2>Bildsjekkliste</h2>
                    <p>Fullført: ${installation.photoChecklist.filter(i => i.checked).length}/${installation.photoChecklist.length}</p>
                    <div class="checklist">
                        ${installation.photoChecklist.map(item => `
                            <div class="checklist-item ${item.checked ? 'checked' : ''}">
                                ${item.checked ? '✓' : '☐'} ${item.text}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${installation.photos && installation.photos.length > 0 ? `
                <div class="section">
                    <h2>Installasjonsbilder</h2>
                    <p>Totalt antall bilder: ${installation.photos.length}</p>
                    <div class="photo-list">
                        ${installation.photos.map(photo => `
                            <div class="photo-item">📷 ${photo.name}</div>
                        `).join('')}
                    </div>
                    <p><em>Merk: Bilder er tilgjengelige for nedlasting i webapplikasjonen.</em></p>
                </div>
            ` : ''}
            
            <div class="section no-print" style="margin-top: 40px; text-align: center;">
                <button onclick="window.print()" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Skriv ut / Lagre som PDF</button>
                <button onclick="window.close()" style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; margin-left: 10px;">Lukk</button>
            </div>
            
            <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center; color: #6c757d; font-size: 12px;">
                Generert: ${new Date().toLocaleString('no-NO')}<br>
                B2Bsluttdokumentasjon - Fiberoptisk Installasjonsdokumentasjonssystem
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}
