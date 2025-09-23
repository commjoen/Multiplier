# Multiplication Practice SPA

A mobile-first Single Page Application for practicing multiplication exercises, designed for deployment on GitHub Pages.

## 🎮 Play the Game

**[► Play the game at https://commjoen.github.io/Multiplier/](https://commjoen.github.io/Multiplier/)**

Try the multiplication practice app directly in your browser - no installation required!

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Progressive Web App (PWA)**: Installable app with offline support
- **Configurable Exercise Count**: Set total number of exercises (5-50), defaults to 20
- **Configurable Range**: Set minimum and maximum numbers for multiplication (1-12)
- **Countdown Timer**: Adjustable timer (1-30 minutes) with visual warnings
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
   - Set the minimum and maximum numbers for multiplication
   - Choose the timer duration (in minutes)
   - Set the total number of exercises (5-50)
   - Select your preferred language
   - Click "Ready - Start Practice!" to begin

2. **Exercise Screen**:
   - Answer multiplication problems by typing in the input fields
   - Press Enter to move to the next question
   - Watch the timer countdown in the top-left
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

## License

Open source - feel free to use and modify for educational purposes.
