// Storage key for localStorage
const STORAGE_KEY = 'fiberOpticInstallations';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadProjects();
    setupFormSubmit();
    setupSearch();
    setupReportFilters();
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
            createdAt: new Date().toISOString()
        };
        
        saveInstallation(installation);
        form.reset();
        
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
