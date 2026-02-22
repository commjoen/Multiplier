# Multiplication Practice SPA

[![Deploy to GitHub Pages](https://github.com/commjoen/Multiplier/actions/workflows/deploy.yml/badge.svg)](https://github.com/commjoen/Multiplier/actions/workflows/deploy.yml)
[![Run Tests](https://github.com/commjoen/Multiplier/actions/workflows/test.yml/badge.svg)](https://github.com/commjoen/Multiplier/actions/workflows/test.yml)
[![Build and Push to GHCR](https://github.com/commjoen/Multiplier/actions/workflows/docker.yml/badge.svg)](https://github.com/commjoen/Multiplier/actions/workflows/docker.yml)
[![CodeQL](https://github.com/commjoen/Multiplier/actions/workflows/codeql.yml/badge.svg)](https://github.com/commjoen/Multiplier/actions/workflows/codeql.yml)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/commjoen/Multiplier)](https://github.com/commjoen/Multiplier/releases/latest)
[![GitHub stars](https://img.shields.io/github/stars/commjoen/Multiplier?style=social)](https://github.com/commjoen/Multiplier/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/commjoen/Multiplier?style=social)](https://github.com/commjoen/Multiplier/network/members)
[![Docker Image](https://img.shields.io/badge/docker-ghcr.io%2Fcommjoen%2Fmultiplier-blue?logo=docker)](https://github.com/commjoen/Multiplier/pkgs/container/multiplier)
[![License](https://img.shields.io/badge/license-Open%20Source-green)](./LICENSE)

A mobile-first Single Page Application for practicing multiplication/division/plus/minus/column arithmetic/facture exercises, designed for deployment on GitHub Pages.

## 🎮 Play the Game

**[► Play the game at https://commjoen.github.io/Multiplier/](https://commjoen.github.io/Multiplier/)**

Try the math practice app directly in your browser - no installation required!

> **Share this app:** [🔗 https://commjoen.github.io/Multiplier/](https://commjoen.github.io/Multiplier/)

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Progressive Web App (PWA)**: Installable app with offline support
- **Configurable Exercise Count**: Set total number of exercises (5-50), defaults to 20
- **Configurable Range**: Set minimum and maximum numbers for multiplication/division/plus/minus/column arithmetic/facture (1-1000)
- **Countdown Timer**: Adjustable timer (0-30 minutes, 0 = disabled) with visual warnings
- **Mobile-Optimized Input**: Numerical keyboard on mobile devices for easier input
- **Responsive Grid Layout**: Shows more exercises on larger screens (1 column on mobile, 2 on tablet, 3 on desktop)
- **Real-Time Feedback**: Instant visual feedback for correct/incorrect answers
- **Scrollable Interface**: Smooth scrolling through exercises
- **Results Summary**: Detailed results with score, time taken, and percentage
- **Local Storage**: Settings are saved between sessions
- **Offline Support**: Works completely offline after first visit
- **Installable**: Can be installed as a standalone app on mobile and desktop
- **Multi-language Support**: Available in English, Nederlands, and Deutsch
- **Docker Support**: Container deployment with GHCR publishing

## How to Use

### Regular Web Usage
1. **Settings Screen**: 
   - Set the minimum and maximum numbers for multiplication or other exercises
   - Choose the timer duration (0-30 minutes, set to 0 to disable timer)
   - Set the total number of exercises (5-50)
   - Select your preferred language
   - Click "Ready - Start Practice!" to begin

2. **Exercise Screen**:
   - Answer math problems by typing in the input fields
   - Press Enter to move to the next question
   - Watch the timer countdown in the top-left (or ∞ if timer is disabled)
   - See your progress (answered/total) in the top-right
   - Correct answers show green background with checkmark
   - Incorrect answers show red background with X mark

3. **Results Screen**:
   - View your final score and percentage
   - See time taken to complete
   - Review all questions with correct answers
   - Click "Practice Again" to start over

### PWA Installation
📱 **Install as App on Mobile:**
- Open the app in your browser (Chrome, Safari, Edge, etc.)
- Look for "Add to Home Screen" or "Install App" option
- Follow the prompts to install
- The app will appear on your home screen like a native app

💻 **Install as App on Desktop:**
- Open the app in Chrome, Edge, or other PWA-compatible browser
- Look for the install icon in the address bar
- Click "Install" to add to your desktop
- The app will run in standalone mode without browser chrome

🔄 **Offline Usage:**
- Once installed, the app works completely offline
- All features available without internet connection
- Settings and progress are saved locally

## Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks or dependencies
- **Progressive Web App (PWA)**: Service worker for offline functionality
- **Responsive Design**: CSS Grid and Flexbox for mobile-first layout
- **Local Storage**: Settings persistence across sessions
- **Web App Manifest**: Enables installation on mobile and desktop
- **Service Worker**: Caches resources for offline functionality
- **GitHub Pages Ready**: Static files optimized for GitHub Pages deployment

## Screenshots

### Mobile Interface
![Mobile Settings](https://github.com/user-attachments/assets/17362a54-d04f-412a-bf3d-24712306517a)
![Mobile Exercise](https://github.com/user-attachments/assets/8c031082-b332-4352-8e2f-e328ddae89dc)
![Mobile Results](https://github.com/user-attachments/assets/25d141ad-a545-4a85-8d69-efa562db3fc7)

### Desktop Interface
![Desktop Settings](https://github.com/user-attachments/assets/06ac545f-b66e-462a-96af-96c2f20bdc51)

## Deployment

This app is configured for automatic deployment to GitHub Pages via GitHub Actions. The deployment workflow runs on every push to the main branch.

## Docker Deployment

The app is also available as a Docker container and published to GitHub Container Registry (GHCR).

### Running with Docker

```bash
# Pull and run the latest image
docker run -p 3000:3000 ghcr.io/commjoen/multiplier:main

# Or build locally
docker build -t multiplication-practice .
docker run -p 3000:3000 multiplication-practice
```

The app will be available at `http://localhost:3000`.

### Container Registry

- **Registry**: GitHub Container Registry (GHCR)
- **Image**: `ghcr.io/commjoen/multiplier`
- **Tags**: `main` (latest), version tags, and commit SHAs
- **Base**: Node.js Alpine for minimal size
- **Size**: ~50MB compressed

## Browser Support

- Modern mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled

## Development

To run locally:
1. Clone the repository
2. Serve the files using any static web server (e.g., `python -m http.server`)
3. Open in browser

## Versioning

This project follows [Semantic Versioning](https://semver.org/) for releases:

- **App Version Display**: Current version is shown in the bottom-right corner of the settings screen
- **Release Process**: Both automated and manual releases via GitHub Actions workflows  
- **Docker Tags**: Each release creates versioned Docker images
  - `ghcr.io/commjoen/multiplier:v1.0.0` (specific version)
  - `ghcr.io/commjoen/multiplier:latest` (latest release)
  - `ghcr.io/commjoen/multiplier:main` (latest main branch)

### Creating a Release

#### Automatic Releases
Releases are automatically created when pushing commits with conventional commit prefixes to the main branch:

- `feat:` or `feature:` → Minor version bump (e.g., 1.0.0 → 1.1.0)
- `fix:`, `patch:`, `perf:`, `refactor:` → Patch version bump (e.g., 1.0.0 → 1.0.1)  
- `feat!:` or `BREAKING CHANGE:` → Major version bump (e.g., 1.0.0 → 2.0.0)
- Add `[skip release]` to commit message to prevent automatic release

#### Manual Releases
For custom releases or specific version numbers:

1. Go to Actions → "Create Release" workflow
2. Click "Run workflow"
3. Enter version (e.g., `v1.0.0`) and optional release notes
4. The workflow will:
   - Update `package.json` version
   - Create Git tag and GitHub release
   - Build and publish Docker images
   - Generate release notes with Docker run instructions

## License

Open source - feel free to use and modify for educational purposes.
