# Multiplication Practice SPA

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information in the instructions is incomplete or found to be in error.**

A mobile-first Single Page Application for practicing multiplication exercises, built with pure HTML/CSS/JavaScript and deployed to GitHub Pages.

## Working Effectively

Bootstrap and run the application:
- Clone the repository to your local machine
- Start a local web server: `python3 -m http.server 8080` (takes < 2 seconds)
- Open browser to `http://localhost:8080`
- Run tests: Open `http://localhost:8080/test.html` in browser

NEVER CANCEL: No build process required - this is a static HTML/CSS/JavaScript application with zero dependencies.

## Timeouts and Build Information

**NEVER CANCEL any commands** - All operations complete quickly except Docker builds:
- Server startup: Set timeout to 10+ seconds (actual: ~1 second)
- Test execution: Set timeout to 10+ seconds (actual: ~1-3 seconds)  
- Docker builds: Set timeout to 120+ seconds (actual: 60-90 seconds when network available)
- Playwright installation: Set timeout to 180+ seconds (actual: 60-120 seconds when network available)
- No builds, compilation, or long-running processes exist for core development

## Validation

ALWAYS manually validate changes by running through complete user scenarios:

### Core User Journey (REQUIRED after any changes):
1. Open `http://localhost:8080` in browser
2. Verify settings screen loads with default values (min: 1, max: 10, timer: 5 minutes)
3. Test language switching: Select "Nederlands" or "Deutsch" and verify UI text changes
4. Modify settings: Set min: 2, max: 8, timer: 3 minutes
5. Click "Ready - Start Practice!" button
6. Verify exercise screen shows 20 multiplication problems
7. Answer at least 3 problems with correct values
8. Click "Finish" button  
9. Verify results screen shows: score (X/20), time taken, percentage, detailed results
10. Click "Practice Again" to return to settings
11. Verify settings were saved (should show min: 2, max: 8, timer: 3)

### Testing Scenarios:
- **Multi-language**: Test all three languages (English, Nederlands, Deutsch)
- **Mobile responsive**: Resize browser to mobile width (< 768px) and verify layout
- **Timer functionality**: Start exercise and verify timer counts down correctly. Test with timer set to 0 to verify timer is disabled (shows ∞ symbol)
- **Answer validation**: Test correct answers (green background), incorrect answers (would show red), and no answers
- **Local storage**: Close browser, reopen, verify settings are preserved

### Known Issues:
- **Answer input bug**: Multiple rapid inputs may concatenate values. Users should input answers one at a time and press Enter between inputs.
- **Docker build**: Requires network access to npm registry. Build may fail in restricted environments due to network timeouts.
- **CI test runner**: Requires Playwright installation (`npm install && npx playwright install chromium`) which may fail in restricted networks.

### Test Suite:
- Run automated tests: Open `http://localhost:8080/test.html`
- EXPECTED: All 12 tests pass successfully 
- Test execution time: < 3 seconds
- Tests include: MultiplicationApp class, required methods, random number generator, exercise generation, translations system, focus navigation, progress updates, answer input handling, keyboard functionality, and highscore system

## Repository Structure

### Key Files:
- `index.html` - Main application entry point with three screens (settings, exercise, results)
- `script.js` - Main application logic (MultiplicationApp class)
- `styles.css` - Responsive CSS with mobile-first design
- `translations.json` - Internationalization support (en/nl/de)
- `test.html` - Simple test suite for core functionality
- `test-runner.js` - Playwright-based automated test runner for CI
- `package.json` - Contains Playwright dependency for testing
- `manifest.json` - PWA manifest for app installation
- `sw.js` - Service worker for offline functionality
- `icons/` - PWA icons in multiple sizes (72x72 to 512x512)
- `Dockerfile` - Container deployment configuration
- `.github/workflows/` - CI/CD workflows (deploy.yml, test.yml, docker.yml)

### Core Application Components:
- **Settings Screen**: Language selection, number range configuration, timer setup
- **Exercise Screen**: 20 randomly generated multiplication problems with timer and progress tracking
- **Results Screen**: Score display, time tracking, detailed answer review

## Development Workflow

### Making Changes:
1. Start local server: `python3 -m http.server 8080`
2. Make changes to HTML/CSS/JavaScript files
3. Refresh browser to see changes immediately (no build step required)
4. ALWAYS run the complete user journey validation scenario after changes
5. ALWAYS test in both desktop and mobile viewport sizes
6. ALWAYS test at least two languages to verify i18n still works

### Adding Features:
- Extend `MultiplicationApp` class in `script.js`
- Add translations to `translations.json` for all three languages
- Update CSS in `styles.css` following mobile-first responsive design principles
- Add corresponding tests to `test.html` if adding core functionality

### Debugging:
- Use browser developer tools console for JavaScript errors
- Check network tab for any failed requests (especially `translations.json`)
- Verify localStorage is working for settings persistence

## Common Tasks

### Repository root structure:
```
.
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       ├── deploy.yml
│       ├── test.yml
│       └── docker.yml
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   └── icon.svg
├── .dockerignore
├── .gitignore
├── Dockerfile
├── README.md
├── index.html
├── manifest.json
├── package.json
├── package-lock.json
├── script.js
├── styles.css
├── sw.js
├── test.html
├── test-runner.js
└── translations.json
```

## Common Tasks

### Starting development server:
```bash
cd /path/to/repository
python3 -m http.server 8080
# Application available at http://localhost:8080
# Tests available at http://localhost:8080/test.html
```

### Running CI tests locally:
```bash
# Install dependencies (requires network access)
npm install
npx playwright install chromium

# Start server in background
python3 -m http.server 8080 &
sleep 3

# Run automated tests
node test-runner.js
```

### Docker deployment:
```bash
# NEVER CANCEL: Docker build takes 60-90 seconds when network is available
# Set timeout to 120+ seconds for docker build commands
docker build -t multiplication-practice .  # May fail in restricted networks
docker run -p 3000:3000 multiplication-practice

# Or use published image
docker run -p 3000:3000 ghcr.io/commjoen/multiplier:main
```

### Key code locations:
- **Main app initialization**: `script.js` line 1-21 (constructor)
- **Exercise generation**: `script.js` generateExercises() method  
- **Translations handling**: `script.js` loadTranslations() and updateLanguage() methods
- **Responsive layout**: `styles.css` mobile-first approach with @media queries
- **GitHub Pages deployment**: `.github/workflows/deploy.yml` (automatic on main branch)

### Typical timings:
- Server startup: < 2 seconds (usually ~1 second)
- Page load: < 1 second (usually immediate)  
- Test suite execution: < 3 seconds (usually ~1 second)
- Docker build: 60-90 seconds (when network is available)
- Playwright installation: 60-120 seconds (when network is available)
- Complete user journey validation: < 2 minutes
- No build or compilation steps required for development

## Deployment

- **Automatic GitHub Pages**: Pushes to `main` branch trigger GitHub Actions deployment to GitHub Pages
- **Automatic Docker**: Pushes to `main` branch build and publish to GitHub Container Registry (GHCR)
- **Manual**: No manual deployment steps needed - everything is automatic
- **URLs**: 
  - GitHub Pages: `https://commjoen.github.io/Multiplier/`
  - Docker: `ghcr.io/commjoen/multiplier:main`

## Browser Support

Supports all modern browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile. Requires JavaScript enabled. No external dependencies or CDN resources.