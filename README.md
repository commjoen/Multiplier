# Multiplication Practice SPA

A mobile-first Single Page Application for practicing multiplication exercises, designed for deployment on GitHub Pages.

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **20 Exercise Sets**: Each practice session includes 20 randomly generated multiplication problems
- **Configurable Range**: Set minimum and maximum numbers for multiplication (1-12)
- **Countdown Timer**: Adjustable timer (1-30 minutes) with visual warnings
- **Real-Time Feedback**: Instant visual feedback for correct/incorrect answers
- **Scrollable Interface**: Smooth scrolling through exercises
- **Results Summary**: Detailed results with score, time taken, and percentage
- **Local Storage**: Settings are saved between sessions

## How to Use

1. **Settings Screen**: 
   - Set the minimum and maximum numbers for multiplication
   - Choose the timer duration (in minutes)
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

## Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks or dependencies
- **Responsive Design**: CSS Grid and Flexbox for mobile-first layout
- **Local Storage**: Settings persistence across sessions
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