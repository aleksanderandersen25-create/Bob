# B2Bsluttdokumentasjon - Fiberoptisk Installasjonsdokumentasjon

En profesjonell nettapplikasjon for dokumentasjon av fiberoptiske kabelinstallasjoner. Spor prosjekter, kabelspesifikasjoner, skjøteinformasjon, testresultater, OTDR-målefiler, og generer omfattende rapporter på norsk.

## 🌐 Live App

**Tilgang til appen:** `https://aleksanderandersen25-create.github.io/Bob/`

## Funksjoner

### 📋 Prosjektstyring
- Dokumenter flere fiberoptiske installasjonsprosjekter
- Søk og filtrer prosjekter
- Spor prosjektdetaljer inkludert lokasjon, kunde og datoer

### 🔌 Kabelspesifikasjoner
- Støtte for ulike kabeltyper (Single-mode, Multi-mode OM1-OM5)
- Spor fiberantall og kabellengde
- Dokumenter produsentinformasjon

### 🔧 Skjøtedokumentasjon
- Registrer fusjons- og mekanisk skjøteinformasjon
- Spor skjøteantall og gjennomsnittlig skjøtetap
- Dokumenter skjøtekvalitetsmålinger

### 📊 Testresultater
- OTDR-testdokumentasjon
- Innsetningstap og returtap målinger
- Teststatussporing (Godkjent/Ikke godkjent/Avventer)

### 📝 Installasjonsdetaljer
- Teknikertildeling
- Installasjonsnotater
- Dokumentasjon av problemer påtruffet

### 📸 Bildedokumentasjon
- Last opp flere bilder per installasjon
- Egendefinerte navn for hvert bilde
- Bildeforhåndsvisning med redigerbare navn
- Bildegalleri i rapporter
- Last ned individuelle bilder
- Bilder lagret sikkert i nettleser

### 📋 Bildsjekkliste
- Tilpassbar sjekkliste for å spore nødvendige bilder
- Forhåndsinnlastede maler: "Standardinstallasjon" og "Bygningsinstallasjon"
- Legg til egendefinerte sjekkliste-elementer
- Kryss av elementer etter som bilder tas
- Lagre egendefinerte sjekklister som gjenbrukbare maler
- Sjekkliste vedvarer på tvers av installasjoner

### 🎨 Fargekoder-referanse (NY!)
- Komplett visuell guide for standard fiberoptiske fargekoder
- Primære farger for fibre 1-12 (Blå, Oransje, Grønn, Brun, Grå, Hvit, Rød, Sort, Gul, Fiolett, Rosa, Turkis)
- Tube/Bundle fargekoding (12 tuber)
- Vanlige kabelkonfigurasjoner:
  - 12-fiber kabel (1 tube)
  - 24-fiber kabel (2 tuber)
  - 48-fiber kabel (4 tuber)
  - 72-fiber kabel (6 tuber)
  - 96-fiber kabel (8 tuber)
  - 144-fiber kabel (12 tuber)
- Skjøteveiledning med generelle regler
- Viktige merknader og advarsler
- Best practice tips for skjøting

### 📊 OTDR-filhåndtering
- Last opp OTDR-målefiler (SOR, PDF, ZIP-formater)
- Støtte for flere filer per installasjon
- Filforhåndsvisning med navn, størrelse og ikon
- Last ned OTDR-filer fra rapporter
- Filer listet i PDF-eksporter

### 📄 PDF-rapporteksport
- "Eksporter som PDF" knapp på hver rapport
- Profesjonelle B2Bsluttdokumentasjon merkede rapporter
- Fullstendige installasjonsdetaljer
- Bildsjekkliste med fullføringsstatus
- OTDR-filliste
- Utskriftsvennlig layout

### 📧 E-postrapportering
- Send omfattende rapporter via e-post
- Auto-generert e-post med alle installasjonsdetaljer
- Åpner standard e-postklient
- Bilder kan lastes ned og legges ved manuelt

### 📈 Rapportering
- Omfattende installasjonsrapporter
- Filtrer etter teststatus
- Eksporter data til JSON-format
- Datapersistens ved hjelp av nettleser localStorage

## Komme i gang

### Forutsetninger
- En moderne nettleser (Chrome, Firefox, Safari, Edge)
- Ingen server eller installasjon nødvendig!

### Bruk

1. **Tilgang til Appen**
   - Besøk: `https://aleksanderandersen25-create.github.io/Bob/`
   - Eller åpne `index.html` lokalt i nettleseren din

2. **Dokumenter en Ny Installasjon**
   - Klikk på "Ny Installasjon" fanen
   - Fyll inn de påkrevde feltene (merket med *)
   - **Legg til OTDR-filer:**
     - Last opp OTDR-målefiler (.sor, .pdf, .zip)
     - Filer vil bli lagret med installasjonen
   - **Legg til Bilder (Valgfritt):**
     - Klikk "Velg Filer" i Installasjonsbilder-seksjonen
     - Velg én eller flere bildefiler
     - Rediger bildenavn for enkel identifikasjon
     - Fjern bilder om nødvendig før lagring
   - **Bildsjekkliste:**
     - Last inn en mal eller legg til egendefinerte elementer
     - Kryss av elementer etter som du fotograferer lokasjoner
     - Lagre din tilpassede sjekkliste som en mal
   - Klikk "Lagre Installasjon"

3. **Se Prosjekter**
   - Klikk på "Prosjekter" fanen for å se alle dokumenterte installasjoner
   - Bruk søkefeltet for å finne spesifikke prosjekter
   - Klikk på et prosjektkort for å se detaljert informasjon
   - Slett prosjekter etter behov

4. **Generer Rapporter**
   - Klikk på "Rapporter" fanen
   - Filtrer etter teststatus (Alle/Godkjent/Ikke godkjent/Avventer)
   - Se fullføringsstatus for bildsjekkliste
   - Last ned OTDR-filer
   - Se installasjonsbilder i bildegalleriet
   - Last ned individuelle bilder ved å klikke på nedlastingsknappen
   - **Eksporter som PDF:** Klikk "Eksporter som PDF" for en profesjonell B2Bsluttdokumentasjon rapport
   - **Send via E-post:** Klikk "Send via E-post" for å åpne e-postklienten din med en forhåndsutfylt rapport
   - Eksporter alle data til JSON for backup eller ekstern behandling
   - Slett alle data om nødvendig (med bekreftelse)

5. **Bruk Fargekoder-referansen (NY!)**
   - Klikk på "Fargekoder" fanen
   - Se primære fiberfarger (1-12) med visuell fremstilling
   - Se tube/bundle fargekoding
   - Finn din kabelkonfigurasjon (12, 24, 48, 72, 96, 144 fibre)
   - Les skjøteveiledning og best practice tips
   - Bruk som referanse under skjøtearbeid

## Datalagring

All installasjonsdata lagres lokalt i nettleserens localStorage. Dette betyr:
- ✅ Dataene dine vedvarer mellom økter
- ✅ Ingen internettforbindelse nødvendig
- ✅ Fullstendig personvern - data forlater aldri nettleseren din
- ⚠️ Data er nettleserspesifikk (ikke synkronisert på tvers av nettlesere)
- ⚠️ Sletting av nettleserdata vil slette installasjoner

**Anbefaling**: Eksporter regelmessig dataene dine ved hjelp av "Eksporter Alle Data" knappen for backup-formål.

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
