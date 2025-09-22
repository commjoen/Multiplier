class MultiplicationApp {
    constructor() {
        this.exercises = [];
        this.currentExercise = 0;
        this.score = 0;
        this.timeLimit = 5; // minutes
        this.timer = null;
        this.timeRemaining = 0;
        this.startTime = null;
        this.minMultiplier = 1;
        this.maxMultiplier = 10;
        this.totalExercises = 20;
        this.currentLanguage = 'en';
        this.translations = {};
        
        this.loadTranslations().then(() => {
            this.initializeElements();
            this.setupEventListeners();
            this.loadSettings();
            this.updateLanguage();
        });
    }
    
    async loadTranslations() {
        try {
            const response = await fetch('translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback translations
            this.translations = {
                en: {
                    title: "Multiplication Practice",
                    minNumber: "Minimum Number:",
                    maxNumber: "Maximum Number:",
                    timerMinutes: "Timer (minutes):",
                    readyButton: "Ready - Start Practice!",
                    progress: "Progress",
                    finish: "Finish",
                    settings: "Settings",
                    practiceComplete: "Practice Complete!",
                    time: "Time:",
                    yourAnswer: "Your answer:",
                    noAnswer: "No answer",
                    practiceAgain: "Practice Again"
                }
            };
        }
    }
    
    initializeElements() {
        // Screens
        this.settingsScreen = document.getElementById('settings-screen');
        this.exerciseScreen = document.getElementById('exercise-screen');
        this.resultsScreen = document.getElementById('results-screen');
        
        // Settings elements
        this.languageSelect = document.getElementById('language-select');
        this.minMultiplierInput = document.getElementById('min-multiplier');
        this.maxMultiplierInput = document.getElementById('max-multiplier');
        this.timerMinutesInput = document.getElementById('timer-minutes');
        this.totalExercisesInput = document.getElementById('total-exercises');
        this.operationTypeInput = document.getElementById('operation-type');
        this.showKeyboardInput = document.getElementById('show-keyboard');
        this.startButton = document.getElementById('start-button');
        
        // Exercise elements
        this.timerDisplay = document.getElementById('timer-display');
        this.progressDisplay = document.getElementById('progress');
        this.exercisesContainer = document.getElementById('exercises-container');
        this.finishButton = document.getElementById('finish-button');
        this.backToSettingsButton = document.getElementById('back-to-settings');
        
        // Results elements
        this.finalScore = document.getElementById('final-score');
        this.timeTaken = document.getElementById('time-taken');
        this.percentage = document.getElementById('percentage');
        this.resultsDetails = document.getElementById('results-details');
        this.restartButton = document.getElementById('restart-button');
        this.highscoreDisplay = document.getElementById('highscore-display');
        this.highscoreValue = document.getElementById('highscore-value');
        this.newHighscoreDisplay = document.getElementById('new-highscore');
        this.socialSharingContainer = document.getElementById('social-sharing');
        this.shareTwitterBtn = document.getElementById('share-twitter');
        this.shareFacebookBtn = document.getElementById('share-facebook');
        this.shareGenericBtn = document.getElementById('share-generic');
    }
    
    setupEventListeners() {
        // Only set up event listeners if the DOM elements exist (not in test environment)
        if (this.startButton) this.startButton.addEventListener('click', () => this.startExercise());
        if (this.finishButton) this.finishButton.addEventListener('click', () => this.finishExercise());
        if (this.backToSettingsButton) this.backToSettingsButton.addEventListener('click', () => this.showSettings());
        if (this.restartButton) this.restartButton.addEventListener('click', () => this.showSettings());
        
        // Language selection
        if (this.languageSelect) this.languageSelect.addEventListener('change', (e) => this.changeLanguage(e.target.value));
        
        // Social sharing
        if (this.shareTwitterBtn) this.shareTwitterBtn.addEventListener('click', () => this.shareOnTwitter());
        if (this.shareFacebookBtn) this.shareFacebookBtn.addEventListener('click', () => this.shareOnFacebook());
        if (this.shareGenericBtn) this.shareGenericBtn.addEventListener('click', () => this.shareGeneric());
        
        // Input validation
        if (this.minMultiplierInput) this.minMultiplierInput.addEventListener('input', () => this.validateRanges());
        if (this.maxMultiplierInput) this.maxMultiplierInput.addEventListener('input', () => this.validateRanges());
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('multiplicationSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            if (this.minMultiplierInput) this.minMultiplierInput.value = settings.minMultiplier || 1;
            if (this.maxMultiplierInput) this.maxMultiplierInput.value = settings.maxMultiplier || 10;
            if (this.timerMinutesInput) this.timerMinutesInput.value = settings.timeLimit || 5;
            if (this.totalExercisesInput) this.totalExercisesInput.value = settings.totalExercises || 20;
            if (this.operationTypeInput) this.operationTypeInput.value = settings.operationType || 'multiplication';
            if (this.showKeyboardInput) this.showKeyboardInput.checked = settings.showKeyboard !== false; // default to true
            this.currentLanguage = settings.language || 'en';
            if (this.languageSelect) this.languageSelect.value = this.currentLanguage;
        }
    }
    
    saveSettings() {
        const settings = {
            minMultiplier: this.minMultiplierInput ? parseInt(this.minMultiplierInput.value) : 1,
            maxMultiplier: this.maxMultiplierInput ? parseInt(this.maxMultiplierInput.value) : 10,
            timeLimit: this.timerMinutesInput ? parseInt(this.timerMinutesInput.value) : 5,
            totalExercises: this.totalExercisesInput ? parseInt(this.totalExercisesInput.value) : 20,
            operationType: this.operationTypeInput ? this.operationTypeInput.value : 'multiplication',
            showKeyboard: this.showKeyboardInput ? this.showKeyboardInput.checked : true,
            language: this.currentLanguage
        };
        localStorage.setItem('multiplicationSettings', JSON.stringify(settings));
    }
    
    getKeyboardSetting() {
        const savedSettings = localStorage.getItem('multiplicationSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            return settings.showKeyboard !== false; // default to true if not explicitly false
        }
        return true; // default to true for new users
    }
    
    loadHighscores() {
        const savedHighscores = localStorage.getItem('multiplicationHighscores');
        if (savedHighscores) {
            return JSON.parse(savedHighscores);
        }
        return {};
    }
    
    getDifficultyKey() {
        const minMult = this.minMultiplierInput ? parseInt(this.minMultiplierInput.value) : 1;
        const maxMult = this.maxMultiplierInput ? parseInt(this.maxMultiplierInput.value) : 10;
        const totalEx = this.totalExercisesInput ? parseInt(this.totalExercisesInput.value) : 20;
        return `${minMult}-${maxMult}-${totalEx}`;
    }
    
    saveHighscore(percentage, score, timeSeconds) {
        const highscores = this.loadHighscores();
        const difficultyKey = this.getDifficultyKey();
        
        // Only save if this is a new highscore (better percentage)
        if (!highscores[difficultyKey] || percentage > highscores[difficultyKey].percentage) {
            const minutes = Math.floor(timeSeconds / 60);
            const seconds = timeSeconds % 60;
            const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            highscores[difficultyKey] = {
                percentage: percentage,
                score: score,
                time: timeFormatted,
                date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
            };
            
            localStorage.setItem('multiplicationHighscores', JSON.stringify(highscores));
            return true; // New highscore achieved
        }
        return false; // No new highscore
    }
    
    getHighscore() {
        const highscores = this.loadHighscores();
        const difficultyKey = this.getDifficultyKey();
        return highscores[difficultyKey] || null;
    }
    
    changeLanguage(language) {
        this.currentLanguage = language;
        this.updateLanguage();
        this.saveSettings();
    }
    
    updateLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });
        
        // Update document title
        document.title = this.translations[this.currentLanguage]?.title || 'Multiplication Exercise';
    }
    
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations.en?.[key] || key;
    }
    
    validateRanges() {
        if (!this.minMultiplierInput || !this.maxMultiplierInput) return;
        
        const min = parseInt(this.minMultiplierInput.value);
        const max = parseInt(this.maxMultiplierInput.value);
        
        if (min > max) {
            this.maxMultiplierInput.value = min;
        }
    }
    
    generateExercises() {
        this.exercises = [];
        this.minMultiplier = parseInt(this.minMultiplierInput.value);
        this.maxMultiplier = parseInt(this.maxMultiplierInput.value);
        this.totalExercises = parseInt(this.totalExercisesInput.value);
        this.operationType = this.operationTypeInput ? this.operationTypeInput.value : 'multiplication';
        
        for (let i = 0; i < this.totalExercises; i++) {
            let operationType;
            
            if (this.operationType === 'mixed') {
                // Randomly choose between multiplication and division
                operationType = Math.random() < 0.5 ? 'multiplication' : 'division';
            } else {
                operationType = this.operationType;
            }
            
            let exercise;
            if (operationType === 'division') {
                // For division, we generate multiplication first then present as division
                // This ensures we always have whole number answers
                const num1 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const num2 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const product = num1 * num2;
                
                exercise = {
                    num1: product,  // dividend
                    num2: num2,     // divisor
                    answer: num1,   // quotient
                    operation: 'division',
                    userAnswer: null,
                    isCorrect: null,
                    index: i
                };
            } else {
                // Multiplication
                const num1 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const num2 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                
                exercise = {
                    num1: num1,
                    num2: num2,
                    answer: num1 * num2,
                    operation: 'multiplication',
                    userAnswer: null,
                    isCorrect: null,
                    index: i
                };
            }
            
            this.exercises.push(exercise);
        }
    }
    
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    startExercise() {
        this.saveSettings();
        this.generateExercises();
        this.timeLimit = parseInt(this.timerMinutesInput.value);
        this.timeRemaining = this.timeLimit * 60; // Convert to seconds
        this.startTime = Date.now();
        
        this.showScreen('exercise');
        this.renderExercises();
        this.startTimer();
        this.updateProgress();
    }
    
    renderExercises() {
        this.exercisesContainer.innerHTML = '';
        
        this.exercises.forEach((exercise, index) => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise-item';
            const symbol = exercise.operation === 'division' ? '÷' : '×';
            exerciseDiv.innerHTML = `
                <span class="exercise-question">${exercise.num1} ${symbol} ${exercise.num2} =</span>
                <input type="number" class="exercise-input" data-index="${index}" 
                       placeholder="?" inputmode="numeric" ${exercise.userAnswer !== null ? `value="${exercise.userAnswer}"` : ''}>
                <span class="exercise-status ${this.getStatusClass(exercise)}">
                    ${this.getStatusSymbol(exercise)}
                </span>
            `;
            
            if (exercise.isCorrect !== null) {
                exerciseDiv.classList.add(exercise.isCorrect ? 'correct' : 'incorrect');
            }
            
            this.exercisesContainer.appendChild(exerciseDiv);
        });
        
        // Add numerical keyboard if enabled
        const shouldShowKeyboard = this.showKeyboardInput ? this.showKeyboardInput.checked : this.getKeyboardSetting();
        if (shouldShowKeyboard) {
            this.addNumericalKeyboard();
        }
        
        // Add input event listeners
        this.exercisesContainer.querySelectorAll('.exercise-input').forEach(input => {
            input.addEventListener('input', (e) => this.handleAnswerInput(e));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    // Only move to next input if the current answer is correct
                    const index = parseInt(e.target.dataset.index);
                    if (this.exercises[index] && this.exercises[index].isCorrect === true) {
                        this.focusNextInput(e.target);
                    }
                }
            });
        });
    }
    
    addNumericalKeyboard() {
        const keyboardContainer = document.createElement('div');
        keyboardContainer.className = 'numerical-keyboard';
        keyboardContainer.innerHTML = `
            <div class="keyboard-row">
                <button class="keyboard-btn number-btn" data-number="1">1</button>
                <button class="keyboard-btn number-btn" data-number="2">2</button>
                <button class="keyboard-btn number-btn" data-number="3">3</button>
            </div>
            <div class="keyboard-row">
                <button class="keyboard-btn number-btn" data-number="4">4</button>
                <button class="keyboard-btn number-btn" data-number="5">5</button>
                <button class="keyboard-btn number-btn" data-number="6">6</button>
            </div>
            <div class="keyboard-row">
                <button class="keyboard-btn number-btn" data-number="7">7</button>
                <button class="keyboard-btn number-btn" data-number="8">8</button>
                <button class="keyboard-btn number-btn" data-number="9">9</button>
            </div>
            <div class="keyboard-row">
                <button class="keyboard-btn action-btn" data-action="backspace" data-i18n="backspace">⌫</button>
                <button class="keyboard-btn number-btn" data-number="0">0</button>
                <button class="keyboard-btn action-btn" data-action="enter" data-i18n="enter">Enter</button>
            </div>
        `;
        
        this.exercisesContainer.appendChild(keyboardContainer);
        
        // Update keyboard button text with translations
        this.updateLanguage();
        
        // Add event listeners to keyboard buttons
        keyboardContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('keyboard-btn')) {
                this.handleKeyboardInput(e.target);
            }
        });
    }
    
    handleKeyboardInput(button) {
        const activeInput = document.activeElement;
        
        // Use the currently focused input, or find the first empty input if none focused
        let targetInput = activeInput;
        if (!activeInput || !activeInput.classList.contains('exercise-input')) {
            const inputs = Array.from(this.exercisesContainer.querySelectorAll('.exercise-input'));
            targetInput = inputs.find(input => input.value === '') || inputs[0];
            if (targetInput) {
                targetInput.focus();
            }
        }
        
        if (!targetInput || !targetInput.classList.contains('exercise-input')) {
            return;
        }
        
        if (button.classList.contains('number-btn')) {
            const number = button.dataset.number;
            targetInput.value = (targetInput.value || '') + number;
            
            // Trigger input event to update exercise state
            const inputEvent = new Event('input', { bubbles: true });
            targetInput.dispatchEvent(inputEvent);
            
        } else if (button.dataset.action === 'backspace') {
            if (targetInput.value.length > 0) {
                targetInput.value = targetInput.value.slice(0, -1);
                
                // Trigger input event to update exercise state
                const inputEvent = new Event('input', { bubbles: true });
                targetInput.dispatchEvent(inputEvent);
            }
            
        } else if (button.dataset.action === 'enter') {
            // Only move to next input if the current answer is correct
            const index = parseInt(targetInput.dataset.index);
            if (this.exercises[index] && this.exercises[index].isCorrect === true) {
                this.focusNextInput(targetInput);
            }
        }
    }
    
    handleAnswerInput(e) {
        const index = parseInt(e.target.dataset.index);
        const inputValue = e.target.value.trim();
        
        if (inputValue === '') {
            // Handle empty input (cleared by backspace)
            this.exercises[index].userAnswer = null;
            this.exercises[index].isCorrect = null;
            
            // Reset visual feedback
            const exerciseItem = e.target.closest('.exercise-item');
            const statusElement = exerciseItem.querySelector('.exercise-status');
            
            exerciseItem.classList.remove('correct', 'incorrect');
            statusElement.className = 'exercise-status pending';
            statusElement.textContent = '?';
            
            this.updateProgress();
        } else {
            const userAnswer = parseInt(inputValue);
            
            if (!isNaN(userAnswer)) {
                this.exercises[index].userAnswer = userAnswer;
                this.exercises[index].isCorrect = userAnswer === this.exercises[index].answer;
                
                // Update the visual feedback
                const exerciseItem = e.target.closest('.exercise-item');
                const statusElement = exerciseItem.querySelector('.exercise-status');
                
                exerciseItem.classList.remove('correct', 'incorrect');
                if (this.exercises[index].isCorrect) {
                    exerciseItem.classList.add('correct');
                    statusElement.className = 'exercise-status correct';
                    statusElement.textContent = '✓';
                } else {
                    exerciseItem.classList.add('incorrect');
                    statusElement.className = 'exercise-status incorrect';
                    statusElement.textContent = '✗';
                }
                
                this.updateProgress();
            }
        }
    }
    
    focusNextInput(currentInput) {
        const inputs = Array.from(this.exercisesContainer.querySelectorAll('.exercise-input'));
        const currentIndex = inputs.indexOf(currentInput);
        const nextInput = inputs[currentIndex + 1];
        
        if (nextInput) {
            nextInput.focus();
        }
    }
    
    getStatusClass(exercise) {
        if (exercise.isCorrect === null) return 'pending';
        return exercise.isCorrect ? 'correct' : 'incorrect';
    }
    
    getStatusSymbol(exercise) {
        if (exercise.isCorrect === null) return '?';
        return exercise.isCorrect ? '✓' : '✗';
    }
    
    updateProgress() {
        const answeredCount = this.exercises.filter(ex => ex.userAnswer !== null).length;
        this.progressDisplay.textContent = `${answeredCount}/${this.totalExercises}`;
        
        if (answeredCount === this.totalExercises) {
            setTimeout(() => this.finishExercise(), 1000);
        }
    }
    
    startTimer() {
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 60) {
                this.timerDisplay.classList.add('timer-warning');
            }
            
            if (this.timeRemaining <= 0) {
                this.finishExercise();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    finishExercise() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.calculateResults();
        this.showResults();
    }
    
    calculateResults() {
        this.score = this.exercises.filter(ex => ex.isCorrect === true).length;
        
        const endTime = Date.now();
        const totalTimeMs = endTime - this.startTime;
        const totalTimeSeconds = Math.floor(totalTimeMs / 1000);
        const minutes = Math.floor(totalTimeSeconds / 60);
        const seconds = totalTimeSeconds % 60;
        
        this.timeTaken.innerHTML = `<span data-i18n="time">${this.t('time')}</span> ${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.finalScore.textContent = `${this.score}/${this.totalExercises}`;
        
        const percentage = Math.round((this.score / this.totalExercises) * 100);
        this.percentage.textContent = `${percentage}%`;
        
        if (percentage >= 90) {
            this.percentage.style.color = '#27ae60';
        } else if (percentage >= 70) {
            this.percentage.style.color = '#f39c12';
        } else {
            this.percentage.style.color = '#e74c3c';
        }
        
        // Handle highscore
        const isNewHighscore = this.saveHighscore(percentage, `${this.score}/${this.totalExercises}`, totalTimeSeconds);
        const currentHighscore = this.getHighscore();
        
        // Show highscore display
        if (currentHighscore && this.highscoreDisplay && this.highscoreValue) {
            this.highscoreDisplay.style.display = 'block';
            this.highscoreValue.textContent = `${currentHighscore.percentage}%`;
        }
        
        // Show new highscore notification
        if (isNewHighscore && this.newHighscoreDisplay) {
            this.newHighscoreDisplay.style.display = 'block';
        } else if (this.newHighscoreDisplay) {
            this.newHighscoreDisplay.style.display = 'none';
        }
        
        // Show social sharing if score is worth sharing (>= 50% or new highscore)
        if (this.socialSharingContainer && (percentage >= 50 || isNewHighscore)) {
            this.socialSharingContainer.style.display = 'block';
            // Store data for sharing
            this.shareData = {
                score: percentage,
                correct: this.score,
                total: this.totalExercises,
                time: `${minutes}:${seconds.toString().padStart(2, '0')}`
            };
        } else if (this.socialSharingContainer) {
            this.socialSharingContainer.style.display = 'none';
        }
    }
    
    showResults() {
        this.resultsDetails.innerHTML = '';
        
        this.exercises.forEach(exercise => {
            const resultDiv = document.createElement('div');
            resultDiv.className = `result-item ${exercise.isCorrect ? 'correct' : 'incorrect'}`;
            const symbol = exercise.operation === 'division' ? '÷' : '×';
            resultDiv.innerHTML = `
                <span class="result-question">${exercise.num1} ${symbol} ${exercise.num2} = ${exercise.answer}</span>
                <span class="result-answer">${this.t('yourAnswer')} ${exercise.userAnswer || this.t('noAnswer')}</span>
            `;
            this.resultsDetails.appendChild(resultDiv);
        });
        
        this.showScreen('results');
    }
    
    showSettings() {
        this.showScreen('settings');
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.classList.add('fade-in');
        }
    }
    
    // Social Media Sharing Methods
    getShareMessage() {
        if (!this.shareData) return '';
        
        const template = this.t('shareMessage');
        return template
            .replace('{score}', this.shareData.score)
            .replace('{correct}', this.shareData.correct)
            .replace('{total}', this.shareData.total)
            .replace('{time}', this.shareData.time);
    }
    
    getShareUrl() {
        return window.location.origin + window.location.pathname;
    }
    
    shareOnTwitter() {
        const message = this.getShareMessage();
        const url = this.getShareUrl();
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
    
    shareOnFacebook() {
        const url = this.getShareUrl();
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }
    
    async shareGeneric() {
        const message = this.getShareMessage();
        const url = this.getShareUrl();
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.t('title'),
                    text: message,
                    url: url
                });
            } catch (err) {
                console.log('Error sharing:', err);
                this.fallbackShare(message, url);
            }
        } else {
            this.fallbackShare(message, url);
        }
    }
    
    fallbackShare(message, url) {
        // Fallback: copy to clipboard
        const textToCopy = `${message} ${url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Share text copied to clipboard!');
            }).catch(() => {
                this.legacyFallbackShare(textToCopy);
            });
        } else {
            this.legacyFallbackShare(textToCopy);
        }
    }
    
    legacyFallbackShare(text) {
        // Legacy fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            alert('Share text copied to clipboard!');
        } catch (err) {
            console.log('Fallback copy failed:', err);
            alert('Unable to copy. Share manually: ' + text);
        }
        
        document.body.removeChild(textArea);
    }
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all elements are properly loaded
    setTimeout(() => {
        new MultiplicationApp();
    }, 100);
});