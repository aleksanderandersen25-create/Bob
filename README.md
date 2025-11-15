# B2Bsluttdokumentasjon - Fiber Optic Installation Documentation App

A professional web application for documenting fiber optic cable installations. Track projects, cable specifications, splice information, testing results, OTDR measurement files, and generate comprehensive reports.

## 🌐 Live App

**Access the app at:** `https://aleksanderandersen25-create.github.io/Bob/`

## Features

### 📋 Project Management
- Document multiple fiber optic installation projects
- Search and filter projects
- Track project details including location, client, and dates

### 🔌 Cable Specifications
- Support for various cable types (Single-mode, Multi-mode OM1-OM5)
- Track fiber count and cable length
- Document manufacturer information

### 🔧 Splice Documentation
- Record fusion and mechanical splice information
- Track splice counts and average splice loss
- Document splice quality metrics

### 📊 Testing Results
- OTDR test documentation
- Insertion loss and return loss measurements
- Test status tracking (Passed/Failed/Pending)

### 📝 Installation Details
- Technician assignment
- Installation notes
- Issues encountered documentation

### 📸 Photo Documentation
- Upload multiple photos per installation
- Custom naming for each photo
- Photo preview with editable names
- Photo gallery in reports
- Download individual photos
- Photos stored securely in browser

### 📋 Photo Checklist
- Customizable checklist to track required photos
- Pre-loaded templates: "Standard Installation" and "Building Installation"
- Add custom checklist items
- Check off items as photos are taken
- Save custom checklists as reusable templates
- Checklist persists across installations

### 📊 OTDR File Management
- Upload OTDR measurement files (SOR, PDF, ZIP formats)
- Multiple file support per installation
- File preview with name, size, and icon
- Download OTDR files from reports
- Files listed in PDF exports

### 📄 PDF Report Export
- "Export as PDF" button on each report
- Professional B2Bsluttdokumentasjon branded reports
- Complete installation details
- Photo checklist with completion status
- OTDR files list
- Print-friendly layout

### 📧 Email Reporting
- Send comprehensive reports via email
- Auto-generated email with all installation details
- Opens default email client
- Photos can be downloaded and attached manually

### 📈 Reporting
- Comprehensive installation reports
- Filter by test status
- Export data to JSON format
- Data persistence using browser localStorage

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Usage

1. **Access the App**
   - Visit: `https://aleksanderandersen25-create.github.io/Bob/`
   - Or open `index.html` locally in your browser

2. **Document a New Installation**
   - Click on "New Installation" tab
   - Fill in the required fields (marked with *)
   - **Add OTDR Files:**
     - Upload OTDR measurement files (.sor, .pdf, .zip)
     - Files will be stored with the installation
   - **Add Photos (Optional):**
     - Click "Choose Files" in the Installation Photos section
     - Select one or more image files
     - Edit photo names for easy identification
     - Remove photos if needed before saving
   - **Photo Checklist:**
     - Load a template or add custom items
     - Check off items as you photograph locations
     - Save your customized checklist as a template
   - Click "Save Installation"

3. **View Projects**
   - Click on "Projects" tab to see all documented installations
   - Use the search bar to find specific projects
   - Click on a project card to view detailed information
   - Delete projects as needed

4. **Generate Reports**
   - Click on "Reports" tab
   - Filter by test status (All/Passed/Failed/Pending)
   - View photo checklist completion status
   - Download OTDR files
   - View installation photos in the photo gallery
   - Download individual photos by clicking the download button
   - **Export as PDF:** Click "Export as PDF" for a professional B2Bsluttdokumentasjon report
   - **Send via Email:** Click "Send via Email" to open your email client with a pre-filled report
   - Export all data to JSON for backup or external processing
   - Clear all data if needed (with confirmation)

## Data Storage

All installation data is stored locally in your browser's localStorage. This means:
- ✅ Your data persists between sessions
- ✅ No internet connection required
- ✅ Complete privacy - data never leaves your browser
- ⚠️ Data is browser-specific (not synced across browsers)
- ⚠️ Clearing browser data will delete installations

**Recommendation**: Regularly export your data using the "Export All Data" button for backup purposes.

## Field Guide

### Required Fields
- **Project Name**: Unique identifier for the installation
- **Location**: Physical address or site location
- **Installation Date**: Date when the installation was performed
- **Cable Type**: Type of fiber optic cable used
- **Fiber Count**: Number of fibers in the cable
- **Cable Length**: Total length of cable installed (in meters)

### Optional Fields
All other fields are optional but recommended for comprehensive documentation.

### Cable Types
- **Single-mode**: For long-distance, high-bandwidth applications
- **Multi-mode OM1**: 62.5/125 μm, up to 275m @ 1 Gbps
- **Multi-mode OM2**: 50/125 μm, up to 550m @ 1 Gbps
- **Multi-mode OM3**: 50/125 μm, up to 300m @ 10 Gbps
- **Multi-mode OM4**: 50/125 μm, up to 550m @ 10 Gbps
- **Multi-mode OM5**: 50/125 μm, optimized for short wavelength division multiplexing

### Testing Metrics
- **OTDR Test**: Optical Time Domain Reflectometer test performed
- **Insertion Loss**: Signal loss through the link (lower is better)
- **Return Loss**: Reflected signal measurement (higher is better)

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Development

### File Structure
```
Bob/
├── index.html      # Main application structure
├── styles.css      # Styling and responsive design
├── app.js          # Application logic and data management
└── README.md       # Documentation
```

### Technologies Used
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- localStorage API

## Contributing

This is an open-source project. Feel free to fork, modify, and improve!

## License

Free to use and modify for personal and commercial projects.

## Support

For issues or feature requests, please use the GitHub issue tracker.

---

**Version**: 1.0.0  
**Last Updated**: November 2025
