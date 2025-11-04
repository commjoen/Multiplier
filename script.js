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
        this.deferredPrompt = null; // For PWA install
        this.selectedInput = null; // Track which input is selected for keyboard input
        
        this.loadTranslations().then(() => {
            this.initializeElements();
            this.setupEventListeners();
            this.loadSettings();
            this.updateLanguage();
            this.loadVersion();
            this.setupPWAInstall();
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
    
    async loadVersion() {
        try {
            const response = await fetch('package.json');
            const packageInfo = await response.json();
            const versionElement = document.getElementById('app-version');
            if (versionElement && packageInfo.version) {
                versionElement.textContent = packageInfo.version;
            }
        } catch (error) {
            console.error('Failed to load version information:', error);
            // Keep default version from HTML if loading fails
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
        this.displayModeInput = document.getElementById('display-mode');
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
        
        // Header buttons
        this.githubStarButton = document.getElementById('github-star-btn');
        this.installAppButton = document.getElementById('install-app-btn');
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
        
        // Header buttons
        if (this.githubStarButton) this.githubStarButton.addEventListener('click', () => this.openGitHubRepo());
        if (this.installAppButton) this.installAppButton.addEventListener('click', () => this.installApp());
        
        // Input validation
        if (this.minMultiplierInput) this.minMultiplierInput.addEventListener('input', () => this.validateRanges());
        if (this.maxMultiplierInput) this.maxMultiplierInput.addEventListener('input', () => this.validateRanges());
        
        // Cijferen submodes toggle
        if (this.operationTypeInput) {
            this.operationTypeInput.addEventListener('change', (e) => this.toggleCijferenSubmodes(e.target.value));
        }
    }
    
    toggleCijferenSubmodes(operationType) {
        const cijferenSubmodesDiv = document.getElementById('cijferen-submodes');
        const cijferenOvercountDiv = document.getElementById('cijferen-overcount-mode');
        if (cijferenSubmodesDiv) {
            cijferenSubmodesDiv.style.display = operationType === 'cijferen' ? 'block' : 'none';
        }
        if (cijferenOvercountDiv) {
            cijferenOvercountDiv.style.display = operationType === 'cijferen' ? 'block' : 'none';
        }
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
            if (this.displayModeInput) this.displayModeInput.value = settings.displayMode || 'grid';
            if (this.showKeyboardInput) this.showKeyboardInput.checked = settings.showKeyboard !== false; // default to true
            this.currentLanguage = settings.language || 'en';
            if (this.languageSelect) this.languageSelect.value = this.currentLanguage;
            
            // Load cijferen submodes
            if (settings.cijferenSubmodes) {
                const checkboxes = ['cijferen-plus', 'cijferen-minus', 'cijferen-multiply', 'cijferen-division'];
                checkboxes.forEach(id => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) {
                        checkbox.checked = settings.cijferenSubmodes[checkbox.value] || false;
                    }
                });
            }
            
            // Load cijferen overcount mode
            const cijferenOvercountSelect = document.getElementById('cijferen-overcount');
            if (cijferenOvercountSelect && settings.cijferenOvercount) {
                cijferenOvercountSelect.value = settings.cijferenOvercount;
            }
            
            // Toggle cijferen submodes visibility
            this.toggleCijferenSubmodes(settings.operationType || 'multiplication');
        }
    }
    
    saveSettings() {
        const settings = {
            minMultiplier: this.minMultiplierInput ? parseInt(this.minMultiplierInput.value) : 1,
            maxMultiplier: this.maxMultiplierInput ? parseInt(this.maxMultiplierInput.value) : 10,
            timeLimit: this.timerMinutesInput ? parseInt(this.timerMinutesInput.value) : 5,
            totalExercises: this.totalExercisesInput ? parseInt(this.totalExercisesInput.value) : 20,
            operationType: this.operationTypeInput ? this.operationTypeInput.value : 'multiplication',
            displayMode: this.displayModeInput ? this.displayModeInput.value : 'grid',
            showKeyboard: this.showKeyboardInput ? this.showKeyboardInput.checked : true,
            language: this.currentLanguage
        };
        
        // Save cijferen submodes
        if (this.operationTypeInput && this.operationTypeInput.value === 'cijferen') {
            settings.cijferenSubmodes = {
                plus: document.getElementById('cijferen-plus')?.checked || false,
                minus: document.getElementById('cijferen-minus')?.checked || false,
                multiply: document.getElementById('cijferen-multiply')?.checked || false,
                division: document.getElementById('cijferen-division')?.checked || false
            };
            
            // Save cijferen overcount mode
            const cijferenOvercountSelect = document.getElementById('cijferen-overcount');
            if (cijferenOvercountSelect) {
                settings.cijferenOvercount = cijferenOvercountSelect.value;
            }
        }
        
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
            } else if (this.operationType === 'cijferen') {
                // Get selected cijferen submodes
                const selectedSubmodes = this.getSelectedCijferenSubmodes();
                if (selectedSubmodes.length === 0) {
                    // Default to plus if no submodes selected
                    operationType = 'cijferenPlus';
                } else {
                    // Randomly select one of the selected submodes
                    const randomIndex = Math.floor(Math.random() * selectedSubmodes.length);
                    operationType = selectedSubmodes[randomIndex];
                }
            } else {
                operationType = this.operationType;
            }
            
            let exercise;
            if (operationType === 'cijferenPlus' || operationType === 'cijferenMinus' || 
                operationType === 'cijferenMultiply' || operationType === 'cijferenDivision') {
                exercise = this.generateCijferenExercise(operationType, i);
            } else if (operationType === 'division') {
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
            } else if (operationType === 'fractionSimplify') {
                // Fraction simplification: Given a/b = ?/d, find the missing numerator
                const baseNum = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const baseDen = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                
                // Multiply both to create a non-simplified fraction
                const multiplier = this.getRandomNumber(2, 4);
                const startNum = baseNum * multiplier;
                const startDen = baseDen * multiplier;
                
                // Target denominator (the simplified one)
                const targetDen = baseDen;
                
                exercise = {
                    operation: 'fractionSimplify',
                    startNum: startNum,
                    startDen: startDen,
                    targetDen: targetDen,
                    answer: baseNum, // The missing numerator
                    userAnswer: null,
                    isCorrect: null,
                    index: i
                };
            } else if (operationType === 'fractionAddSub') {
                // Fraction addition/subtraction
                const num1 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const den1 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const num2 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const den2 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                
                // Randomly choose add or subtract
                const isAddition = Math.random() < 0.5;
                const result = isAddition 
                    ? this.addFractions(num1, den1, num2, den2)
                    : this.subtractFractions(num1, den1, num2, den2);
                
                exercise = {
                    operation: 'fractionAddSub',
                    num1: num1,
                    den1: den1,
                    num2: num2,
                    den2: den2,
                    isAddition: isAddition,
                    answerNum: result.numerator,
                    answerDen: result.denominator,
                    answer: `${result.numerator}/${result.denominator}`,
                    userAnswer: null,
                    isCorrect: null,
                    index: i
                };
            } else if (operationType === 'fractionMultiply') {
                // Fraction multiplication
                const num1 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const den1 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const num2 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                const den2 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
                
                const result = this.multiplyFractions(num1, den1, num2, den2);
                
                exercise = {
                    operation: 'fractionMultiply',
                    num1: num1,
                    den1: den1,
                    num2: num2,
                    den2: den2,
                    answerNum: result.numerator,
                    answerDen: result.denominator,
                    answer: `${result.numerator}/${result.denominator}`,
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
    
    // Cijferen helper methods
    getSelectedCijferenSubmodes() {
        const selectedSubmodes = [];
        if (document.getElementById('cijferen-plus')?.checked) selectedSubmodes.push('cijferenPlus');
        if (document.getElementById('cijferen-minus')?.checked) selectedSubmodes.push('cijferenMinus');
        if (document.getElementById('cijferen-multiply')?.checked) selectedSubmodes.push('cijferenMultiply');
        if (document.getElementById('cijferen-division')?.checked) selectedSubmodes.push('cijferenDivision');
        return selectedSubmodes;
    }
    
    generateCijferenExercise(operationType, index) {
        // Generate multi-digit numbers for column arithmetic
        // Get overcount mode setting
        const cijferenOvercountSelect = document.getElementById('cijferen-overcount');
        const overcountMode = cijferenOvercountSelect ? cijferenOvercountSelect.value : 'with';
        
        let num1, num2, answer, operator;
        
        if (operationType === 'cijferenPlus') {
            // Addition: num1 + num2 = answer
            if (overcountMode === 'without') {
                // Generate numbers where each digit column sum is <= 9 (no carrying)
                num1 = this.generateNumberWithoutCarry();
                num2 = this.generateNumberWithoutCarry(num1);
                answer = num1 + num2;
            } else {
                // Normal addition with possible carries
                num1 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier * 10);
                num2 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier * 10);
                answer = num1 + num2;
            }
            operator = '+';
        } else if (operationType === 'cijferenMinus') {
            // Subtraction: num1 - num2 = answer (ensure positive result)
            if (overcountMode === 'without') {
                // Generate numbers where each digit column allows subtraction without borrowing
                num1 = this.generateNumberWithoutBorrow();
                num2 = this.generateNumberWithoutBorrow(num1);
                answer = num1 - num2;
            } else {
                // Normal subtraction with possible borrowing
                num1 = this.getRandomNumber(this.minMultiplier * 10, this.maxMultiplier * 10);
                num2 = this.getRandomNumber(this.minMultiplier, num1);
                answer = num1 - num2;
            }
            operator = '−';
        } else if (operationType === 'cijferenMultiply') {
            // Multiplication: num1 × num2 = answer
            num1 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
            num2 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
            answer = num1 * num2;
            operator = '×';
        } else if (operationType === 'cijferenDivision') {
            // Division: num1 ÷ num2 = answer (ensure whole number result)
            num2 = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
            answer = this.getRandomNumber(this.minMultiplier, this.maxMultiplier);
            num1 = num2 * answer;
            operator = '÷';
        }
        
        return {
            operation: operationType,
            num1: num1,
            num2: num2,
            answer: answer,
            operator: operator,
            userAnswer: null,
            isCorrect: null,
            index: index,
            answerDigits: {} // Will store user input for each digit position
        };
    }
    
    generateNumberWithoutCarry(existingNum = null) {
        // Generate a 2-digit number for addition where digits can be added without carrying
        // If existingNum is provided, ensure each digit sum is <= 9
        if (existingNum !== null) {
            const existingStr = String(existingNum).padStart(2, '0');
            const digit1 = parseInt(existingStr[0]);
            const digit0 = parseInt(existingStr[1]);
            
            // Generate complementary digits that won't cause carry
            const maxDigit1 = Math.min(9 - digit1, this.maxMultiplier);
            const minDigit1 = Math.max(0, this.minMultiplier);
            
            // Ensure we have a valid range
            if (maxDigit1 < minDigit1) {
                // If we can't meet the constraint, just return a small number
                return this.minMultiplier;
            }
            
            const newDigit1 = this.getRandomNumber(minDigit1, maxDigit1);
            const newDigit0 = this.getRandomNumber(0, Math.min(9 - digit0, 9));
            
            return newDigit1 * 10 + newDigit0;
        } else {
            // Generate a random 2-digit number
            const tens = this.getRandomNumber(this.minMultiplier, Math.min(this.maxMultiplier, 9));
            const ones = this.getRandomNumber(0, 9);
            return tens * 10 + ones;
        }
    }
    
    generateNumberWithoutBorrow(existingNum = null) {
        // Generate a 2-digit number for subtraction where digits can be subtracted without borrowing
        if (existingNum !== null) {
            const existingStr = String(existingNum).padStart(2, '0');
            const digit1 = parseInt(existingStr[0]);
            const digit0 = parseInt(existingStr[1]);
            
            // Generate numbers where each digit of num2 <= corresponding digit of num1
            // Ensure minMultiplier doesn't exceed digit1
            const maxDigit1 = digit1;
            const minDigit1 = Math.min(this.minMultiplier, digit1);
            
            const newDigit1 = this.getRandomNumber(minDigit1, maxDigit1);
            const newDigit0 = this.getRandomNumber(0, digit0);
            
            return newDigit1 * 10 + newDigit0;
        } else {
            // Generate a random 2-digit number (will be num1)
            // Ensure we have enough room for subtraction
            const maxTens = Math.min(this.maxMultiplier * 2, 9);
            const minTens = Math.max(this.minMultiplier * 2, this.minMultiplier);
            
            // If range is invalid, use a safe default
            const tens = minTens <= maxTens 
                ? this.getRandomNumber(minTens, maxTens)
                : this.getRandomNumber(Math.max(2, this.minMultiplier), 9);
            const ones = this.getRandomNumber(1, 9);
            return tens * 10 + ones;
        }
    }
    
    // Fraction helper methods
    gcd(a, b) {
        // Greatest Common Divisor using Euclidean algorithm
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    simplifyFraction(numerator, denominator) {
        // Simplify a fraction to its lowest terms
        const divisor = this.gcd(numerator, denominator);
        return {
            numerator: numerator / divisor,
            denominator: denominator / divisor
        };
    }
    
    addFractions(num1, den1, num2, den2) {
        // Add two fractions: num1/den1 + num2/den2
        const numerator = num1 * den2 + num2 * den1;
        const denominator = den1 * den2;
        return this.simplifyFraction(numerator, denominator);
    }
    
    subtractFractions(num1, den1, num2, den2) {
        // Subtract two fractions: num1/den1 - num2/den2
        const numerator = num1 * den2 - num2 * den1;
        const denominator = den1 * den2;
        return this.simplifyFraction(numerator, denominator);
    }
    
    multiplyFractions(num1, den1, num2, den2) {
        // Multiply two fractions: (num1/den1) * (num2/den2)
        const numerator = num1 * num2;
        const denominator = den1 * den2;
        return this.simplifyFraction(numerator, denominator);
    }
    
    formatFraction(numerator, denominator) {
        // Format fraction for display
        if (denominator === 1) {
            return `${numerator}`;
        }
        return `${numerator}/${denominator}`;
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
        
        // Get display mode setting
        const displayMode = this.displayModeInput ? this.displayModeInput.value : 'grid';
        
        // Apply display mode class to exercises container
        this.exercisesContainer.className = `exercises-container ${displayMode}-mode`;
        
        this.exercises.forEach((exercise, index) => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise-item';
            
            let questionHtml = '';
            let inputHtml = '';
            
            if (exercise.operation && exercise.operation.startsWith('cijferen')) {
                // Cijferen mode: column arithmetic
                exerciseDiv.classList.add('cijferen-mode');
                const cijferenHtml = this.renderCijferenExercise(exercise, index);
                questionHtml = cijferenHtml.question;
                inputHtml = cijferenHtml.input;
            } else if (exercise.operation === 'fractionSimplify') {
                // Simplify: startNum/startDen = ?/targetDen
                questionHtml = `<span class="exercise-question">
                    <span class="fraction"><sup>${exercise.startNum}</sup>/<sub>${exercise.startDen}</sub></span> = 
                    <span class="fraction"><sup>?</sup>/<sub>${exercise.targetDen}</sub></span>
                </span>`;
                inputHtml = `<input type="number" class="exercise-input" data-index="${index}" 
                       placeholder="?" inputmode="numeric" ${exercise.userAnswer !== null ? `value="${exercise.userAnswer}"` : ''}>`;
            } else if (exercise.operation === 'fractionAddSub') {
                // Add/Subtract: num1/den1 ± num2/den2 = ?/?
                const symbol = exercise.isAddition ? '+' : '-';
                questionHtml = `<span class="exercise-question">
                    <span class="fraction"><sup>${exercise.num1}</sup>/<sub>${exercise.den1}</sub></span> ${symbol} 
                    <span class="fraction"><sup>${exercise.num2}</sup>/<sub>${exercise.den2}</sub></span> = ?
                </span>`;
                inputHtml = `<input type="text" class="exercise-input fraction-input" data-index="${index}" 
                       placeholder="?/?" ${exercise.userAnswer !== null ? `value="${exercise.userAnswer}"` : ''}>`;
            } else if (exercise.operation === 'fractionMultiply') {
                // Multiply: num1/den1 × num2/den2 = ?/?
                questionHtml = `<span class="exercise-question">
                    <span class="fraction"><sup>${exercise.num1}</sup>/<sub>${exercise.den1}</sub></span> × 
                    <span class="fraction"><sup>${exercise.num2}</sup>/<sub>${exercise.den2}</sub></span> = ?
                </span>`;
                inputHtml = `<input type="text" class="exercise-input fraction-input" data-index="${index}" 
                       placeholder="?/?" ${exercise.userAnswer !== null ? `value="${exercise.userAnswer}"` : ''}>`;
            } else {
                // Standard multiplication or division
                const symbol = exercise.operation === 'division' ? '÷' : '×';
                questionHtml = `<span class="exercise-question">${exercise.num1} ${symbol} ${exercise.num2} =</span>`;
                inputHtml = `<input type="number" class="exercise-input" data-index="${index}" 
                       placeholder="?" inputmode="numeric" ${exercise.userAnswer !== null ? `value="${exercise.userAnswer}"` : ''}>`;
            }
            
            exerciseDiv.innerHTML = `
                ${questionHtml}
                ${inputHtml}
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
        
        // Remove any existing keyboard
        const existingKeyboard = document.querySelector('#exercise-screen .numerical-keyboard');
        if (existingKeyboard) {
            existingKeyboard.remove();
        }
        
        // Add container class for styling
        const container = document.querySelector('#exercise-screen .container');
        if (shouldShowKeyboard) {
            this.exercisesContainer.classList.add('has-keyboard');
            container.classList.add('has-keyboard');
            this.addNumericalKeyboard();
        } else {
            this.exercisesContainer.classList.remove('has-keyboard');
            container.classList.remove('has-keyboard');
        }
        
        // Add input event listeners for both regular and cijferen inputs
        this.exercisesContainer.querySelectorAll('.exercise-input, .cijferen-input').forEach(input => {
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
            
            // Add click handler for selecting input for keyboard use
            input.addEventListener('click', (e) => {
                this.selectInputForKeyboard(e.target);
            });
            
            // Add focus handler for selecting input for keyboard use
            input.addEventListener('focus', (e) => {
                this.selectInputForKeyboard(e.target);
            });
            
            // Add blur handler to remove visual selection when focus is lost completely
            input.addEventListener('blur', (e) => {
                // Only remove selection if focus is moving to something that's not a keyboard button
                setTimeout(() => {
                    const focusedElement = document.activeElement;
                    if (!focusedElement || !focusedElement.classList.contains('keyboard-btn')) {
                        if (this.selectedInput === e.target) {
                            this.selectedInput = null;
                            e.target.classList.remove('keyboard-selected');
                        }
                    }
                }, 10);
            });
        });
        
        // Auto-select first empty input for keyboard use
        if (shouldShowKeyboard) {
            const inputs = Array.from(this.exercisesContainer.querySelectorAll('.exercise-input, .cijferen-input'));
            const firstEmptyInput = inputs.find(input => input.value === '') || inputs[0];
            if (firstEmptyInput) {
                this.selectInputForKeyboard(firstEmptyInput);
            }
        }
    }
    
    renderCijferenExercise(exercise, index) {
        // Convert numbers to digit arrays - use proper alignment
        const num1Str = String(exercise.num1).padStart(3, '0');
        const num2Str = String(exercise.num2).padStart(3, '0');
        
        // Create digit display - show empty for leading zeros
        const renderDigit = (digitChar) => {
            return digitChar === '0' ? '&nbsp;' : digitChar;
        };
        
        // Determine which digits to show (hide leading zeros)
        const num1Digits = [];
        const num2Digits = [];
        let num1StartShow = false;
        let num2StartShow = false;
        
        for (let i = 0; i < 3; i++) {
            // For num1
            if (num1Str[i] !== '0' || i === 2) num1StartShow = true;
            num1Digits.push(num1StartShow ? num1Str[i] : '&nbsp;');
            
            // For num2
            if (num2Str[i] !== '0' || i === 2) num2StartShow = true;
            num2Digits.push(num2StartShow ? num2Str[i] : '&nbsp;');
        }
        
        const questionHtml = `
            <div class="cijferen-container">
                <div class="cijferen-row">
                    <span class="cijferen-label">H T E</span>
                    <div class="cijferen-digits">
                        <div class="cijferen-digit">${num1Digits[0]}</div>
                        <div class="cijferen-digit">${num1Digits[1]}</div>
                        <div class="cijferen-digit">${num1Digits[2]}</div>
                    </div>
                </div>
                <div class="cijferen-row">
                    <span class="cijferen-operator">${exercise.operator}</span>
                    <div class="cijferen-digits">
                        <div class="cijferen-digit">${num2Digits[0]}</div>
                        <div class="cijferen-digit">${num2Digits[1]}</div>
                        <div class="cijferen-digit">${num2Digits[2]}</div>
                    </div>
                </div>
                <div class="cijferen-separator"></div>
            </div>
        `;
        
        const inputHtml = `
            <div class="cijferen-answer-row">
                <div class="cijferen-digits">
                    <div class="cijferen-digit cijferen-answer-digit">
                        <input type="text" class="cijferen-input" data-index="${index}" data-position="0" 
                               maxlength="1" inputmode="numeric" value="${exercise.answerDigits[0] || ''}">
                    </div>
                    <div class="cijferen-digit cijferen-answer-digit">
                        <input type="text" class="cijferen-input" data-index="${index}" data-position="1" 
                               maxlength="1" inputmode="numeric" value="${exercise.answerDigits[1] || ''}">
                    </div>
                    <div class="cijferen-digit cijferen-answer-digit">
                        <input type="text" class="cijferen-input" data-index="${index}" data-position="2" 
                               maxlength="1" inputmode="numeric" value="${exercise.answerDigits[2] || ''}">
                    </div>
                </div>
            </div>
        `;
        
        return { question: questionHtml, input: inputHtml };
    }
    
    selectInputForKeyboard(input) {
        // Remove selection from previously selected input
        if (this.selectedInput) {
            this.selectedInput.classList.remove('keyboard-selected');
        }
        
        // Set new selected input
        this.selectedInput = input;
        
        // Add visual feedback for selected input
        if (input) {
            input.classList.add('keyboard-selected');
        }
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
                <button class="keyboard-btn number-btn" data-number="/">/</button>
            </div>
            <div class="keyboard-row">
                <button class="keyboard-btn action-btn" data-action="enter" data-i18n="enter">Enter</button>
            </div>
        `;
        
        // Add keyboard after the footer instead of in exercises container
        const footer = document.querySelector('#exercise-screen .footer');
        footer.parentNode.insertBefore(keyboardContainer, footer.nextSibling);
        
        // Update keyboard button text with translations
        this.updateLanguage();
        
        // Add event listeners to keyboard buttons
        keyboardContainer.addEventListener('mousedown', (e) => {
            // Prevent all keyboard buttons from getting focus
            if (e.target.classList.contains('keyboard-btn')) {
                e.preventDefault();
            }
        });
        
        keyboardContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('keyboard-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                // Find the target input: focused input, or first empty input, or first input
                let targetInput = document.activeElement;
                if (!targetInput || !targetInput.classList || 
                    (!targetInput.classList.contains('exercise-input') && !targetInput.classList.contains('cijferen-input'))) {
                    const inputs = Array.from(this.exercisesContainer.querySelectorAll('.exercise-input, .cijferen-input'));
                    targetInput = inputs.find(input => input.value === '') || inputs[0];
                }
                
                if (!targetInput || !targetInput.classList) {
                    return;
                }
                
                // Handle different button types
                if (e.target.classList.contains('number-btn')) {
                    const number = e.target.dataset.number;
                    targetInput.value = (targetInput.value || '') + number;
                    
                    // Trigger input event
                    const inputEvent = new Event('input', { bubbles: true });
                    targetInput.dispatchEvent(inputEvent);
                    
                } else if (e.target.dataset.action === 'backspace') {
                    if (targetInput.value.length > 0) {
                        targetInput.value = targetInput.value.slice(0, -1);
                        
                        // Trigger input event
                        const inputEvent = new Event('input', { bubbles: true });
                        targetInput.dispatchEvent(inputEvent);
                    }
                    
                } else if (e.target.dataset.action === 'enter') {
                    // Move to next input if current answer is correct
                    const index = parseInt(targetInput.dataset.index);
                    if (this.exercises[index] && this.exercises[index].isCorrect === true) {
                        this.focusNextInput(targetInput);
                        return; // Let focusNextInput handle the focus
                    }
                }
                
                // Always refocus the target input after keyboard interaction
                setTimeout(() => {
                    targetInput.focus();
                }, 1);
            }
        });
        
        // Make keyboard buttons non-focusable
        keyboardContainer.querySelectorAll('.keyboard-btn').forEach(btn => {
            btn.setAttribute('tabindex', '-1');
        });
    }
    
    handleKeyboardInput(button) {
        // For number buttons, try to work with any focused input first, then fall back to selected input
        if (button.classList && button.classList.contains('number-btn')) {
            let targetInput = document.activeElement;
            
            // If no input is focused or the focused element is not an exercise input, use selectedInput
            if (!targetInput || !targetInput.classList || 
                (!targetInput.classList.contains('exercise-input') && !targetInput.classList.contains('cijferen-input'))) {
                targetInput = this.selectedInput;
            }
            
            // If still no target, find the first empty input
            if (!targetInput || !targetInput.classList || 
                (!targetInput.classList.contains('exercise-input') && !targetInput.classList.contains('cijferen-input'))) {
                const inputs = Array.from(this.exercisesContainer.querySelectorAll('.exercise-input, .cijferen-input'));
                targetInput = inputs.find(input => input.value === '') || inputs[0];
                if (targetInput) {
                    this.selectInputForKeyboard(targetInput);
                }
            }
            
            if (!targetInput) {
                return; // No valid input found
            }
            
            const number = button.dataset.number;
            targetInput.value = (targetInput.value || '') + number;
            
            // Trigger input event to update exercise state
            const inputEvent = new Event('input', { bubbles: true });
            targetInput.dispatchEvent(inputEvent);
            
            // Keep focus on the input field, not the button
            targetInput.focus();
            // Also select this input for future keyboard use
            this.selectInputForKeyboard(targetInput);
            return;
        }
        
        // For backspace, use focused input or selected input
        if (button.dataset && button.dataset.action === 'backspace') {
            let targetInput = document.activeElement;
            
            // If no input is focused or the focused element is not an exercise input, use selectedInput  
            if (!targetInput || !targetInput.classList || 
                (!targetInput.classList.contains('exercise-input') && !targetInput.classList.contains('cijferen-input'))) {
                targetInput = this.selectedInput;
            }
            
            // If still no target, find first non-empty input
            if (!targetInput || !targetInput.classList || 
                (!targetInput.classList.contains('exercise-input') && !targetInput.classList.contains('cijferen-input'))) {
                const inputs = Array.from(this.exercisesContainer.querySelectorAll('.exercise-input, .cijferen-input'));
                targetInput = inputs.find(input => input.value !== '') || inputs[0];
                if (targetInput) {
                    this.selectInputForKeyboard(targetInput);
                }
            }
            
            if (!targetInput) {
                return; // No valid input found
            }
            
            if (targetInput.value.length > 0) {
                targetInput.value = targetInput.value.slice(0, -1);
                
                // Trigger input event to update exercise state
                const inputEvent = new Event('input', { bubbles: true });
                targetInput.dispatchEvent(inputEvent);
            }
            
            // Keep focus on the input field, not the button
            targetInput.focus();
            // Also select this input for future keyboard use
            this.selectInputForKeyboard(targetInput);
            return;
        }
        
        // For enter button, use focused input or selected input
        if (button.dataset && button.dataset.action === 'enter') {
            let targetInput = document.activeElement;
            
            // If no input is focused or the focused element is not an exercise input, use selectedInput
            if (!targetInput || !targetInput.classList || 
                (!targetInput.classList.contains('exercise-input') && !targetInput.classList.contains('cijferen-input'))) {
                targetInput = this.selectedInput;
            }
            
            // If still no target, find first empty input
            if (!targetInput || !targetInput.classList || 
                (!targetInput.classList.contains('exercise-input') && !targetInput.classList.contains('cijferen-input'))) {
                const inputs = Array.from(this.exercisesContainer.querySelectorAll('.exercise-input, .cijferen-input'));
                targetInput = inputs.find(input => input.value === '') || inputs[0];
                if (targetInput) {
                    this.selectInputForKeyboard(targetInput);
                }
            }
            
            if (!targetInput || !targetInput.classList || 
                (!targetInput.classList.contains('exercise-input') && !targetInput.classList.contains('cijferen-input'))) {
                return;
            }
            
            // Keep focus on the input field
            targetInput.focus();
            // Also select this input for future keyboard use
            this.selectInputForKeyboard(targetInput);
            
            // Only move to next input if the current answer is correct
            const index = parseInt(targetInput.dataset.index);
            if (this.exercises[index] && this.exercises[index].isCorrect === true) {
                this.focusNextInput(targetInput);
            }
        }
    }
    
    handleAnswerInput(e) {
        const index = parseInt(e.target.dataset.index);
        const exercise = this.exercises[index];
        
        // Handle cijferen inputs differently
        if (e.target.classList && e.target.classList.contains('cijferen-input')) {
            const position = parseInt(e.target.dataset.position);
            const inputValue = e.target.value.trim();
            
            // Store the digit in the exercise
            if (!exercise.answerDigits) {
                exercise.answerDigits = {};
            }
            exercise.answerDigits[position] = inputValue;
            
            // Check if all three digits are filled
            const digit0 = exercise.answerDigits[0] || '';
            const digit1 = exercise.answerDigits[1] || '';
            const digit2 = exercise.answerDigits[2] || '';
            
            if (digit0 || digit1 || digit2) {
                // Combine digits to form the complete answer
                const userAnswer = parseInt((digit0 || '0') + (digit1 || '0') + (digit2 || '0'));
                exercise.userAnswer = userAnswer;
                exercise.isCorrect = userAnswer === exercise.answer;
                
                // Update the visual feedback
                const exerciseItem = e.target.closest('.exercise-item');
                if (exerciseItem) {
                    const statusElement = exerciseItem.querySelector('.exercise-status');
                    
                    exerciseItem.classList.remove('correct', 'incorrect');
                    if (exercise.isCorrect) {
                        exerciseItem.classList.add('correct');
                        if (statusElement) {
                            statusElement.className = 'exercise-status correct';
                            statusElement.textContent = '✓';
                        }
                    } else {
                        exerciseItem.classList.add('incorrect');
                        if (statusElement) {
                            statusElement.className = 'exercise-status incorrect';
                            statusElement.textContent = '✗';
                        }
                    }
                }
                
                this.updateProgress();
                
                // Auto-focus next input if correct
                if (exercise.isCorrect && inputValue) {
                    // Find next cijferen input in a different exercise
                    const allInputs = Array.from(this.exercisesContainer.querySelectorAll('.cijferen-input'));
                    const currentInputIndex = allInputs.indexOf(e.target);
                    
                    // Jump to first input of next exercise (skip remaining digits of current exercise)
                    for (let i = currentInputIndex + 1; i < allInputs.length; i++) {
                        const nextInput = allInputs[i];
                        const nextIndex = parseInt(nextInput.dataset.index);
                        if (nextIndex !== index) {
                            nextInput.focus();
                            break;
                        }
                    }
                }
            } else {
                // All digits are empty, reset state
                exercise.userAnswer = null;
                exercise.isCorrect = null;
                
                // Reset visual feedback
                const exerciseItem = e.target.closest('.exercise-item');
                if (exerciseItem) {
                    const statusElement = exerciseItem.querySelector('.exercise-status');
                    
                    exerciseItem.classList.remove('correct', 'incorrect');
                    if (statusElement) {
                        statusElement.className = 'exercise-status pending';
                        statusElement.textContent = '?';
                    }
                }
                
                this.updateProgress();
            }
            
            // Auto-move to next digit input within same exercise
            if (inputValue && inputValue.length === 1 && position < 2) {
                const cijferenDigits = e.target.closest('.cijferen-digits');
                if (cijferenDigits) {
                    const nextInput = cijferenDigits.querySelectorAll('.cijferen-input')[position + 1];
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            }
            
            return;
        }
        
        // Original handleAnswerInput logic for non-cijferen inputs
        const inputValue = e.target.value.trim();
        
        if (inputValue === '') {
            // Handle empty input (cleared by backspace)
            exercise.userAnswer = null;
            exercise.isCorrect = null;
            
            // Reset visual feedback
            const exerciseItem = e.target.closest('.exercise-item');
            if (exerciseItem) {
                const statusElement = exerciseItem.querySelector('.exercise-status');
                
                exerciseItem.classList.remove('correct', 'incorrect');
                if (statusElement) {
                    statusElement.className = 'exercise-status pending';
                    statusElement.textContent = '?';
                }
            }
            
            this.updateProgress();
        } else {
            let isCorrect = false;
            
            // Handle different operation types
            if (exercise.operation === 'fractionSimplify') {
                // For simplify, just check the numerator
                const userAnswer = parseInt(inputValue);
                if (!isNaN(userAnswer)) {
                    exercise.userAnswer = userAnswer;
                    isCorrect = userAnswer === exercise.answer;
                }
            } else if (exercise.operation === 'fractionAddSub' || exercise.operation === 'fractionMultiply') {
                // For fraction operations, parse input like "3/4"
                const fractionMatch = inputValue.match(/^(\d+)\/(\d+)$/);
                if (fractionMatch) {
                    const userNum = parseInt(fractionMatch[1]);
                    const userDen = parseInt(fractionMatch[2]);
                    
                    // Simplify user's answer
                    const simplified = this.simplifyFraction(userNum, userDen);
                    
                    exercise.userAnswer = `${userNum}/${userDen}`;
                    
                    // Check if simplified version matches the correct answer
                    isCorrect = simplified.numerator === exercise.answerNum && 
                               simplified.denominator === exercise.answerDen;
                }
            } else {
                // Standard numeric answer (multiplication, division)
                const userAnswer = parseInt(inputValue);
                if (!isNaN(userAnswer)) {
                    exercise.userAnswer = userAnswer;
                    isCorrect = userAnswer === exercise.answer;
                }
            }
            
            exercise.isCorrect = isCorrect;
            
            // Update the visual feedback
            const exerciseItem = e.target.closest('.exercise-item');
            if (exerciseItem) {
                const statusElement = exerciseItem.querySelector('.exercise-status');
                
                exerciseItem.classList.remove('correct', 'incorrect');
                if (exercise.isCorrect) {
                    exerciseItem.classList.add('correct');
                    if (statusElement) {
                        statusElement.className = 'exercise-status correct';
                        statusElement.textContent = '✓';
                    }
                } else {
                    exerciseItem.classList.add('incorrect');
                    if (statusElement) {
                        statusElement.className = 'exercise-status incorrect';
                        statusElement.textContent = '✗';
                    }
                }
            }
            
            this.updateProgress();
        }
    }
    
    focusNextInput(currentInput) {
        if (!this.exercisesContainer) return;
        
        const inputs = Array.from(this.exercisesContainer.querySelectorAll('.exercise-input, .cijferen-input'));
        const currentIndex = inputs.indexOf(currentInput);
        
        // Calculate number of columns based on screen width to match CSS grid (max 3 columns)
        let columns = 1; // default mobile
        const screenWidth = window.innerWidth;
        
        if (screenWidth >= 1024) {
            columns = 3; // desktop - max 3 columns
        } else if (screenWidth >= 768) {
            columns = 2; // tablet - 2 columns
        }
        
        const totalInputs = inputs.length;
        let nextIndex;
        
        // Column-by-column navigation: go down to next row in same column
        const nextRowIndex = currentIndex + columns;
        
        if (nextRowIndex < totalInputs) {
            // Move to next row in same column
            nextIndex = nextRowIndex;
        } else {
            // At bottom of column, move to top of next column
            const currentCol = currentIndex % columns;
            const nextCol = (currentCol + 1) % columns;
            nextIndex = nextCol;
            
            // If wrapping around to first column, start from beginning
            if (nextCol === 0) {
                nextIndex = 0;
            }
        }
        
        // Focus the next input
        const nextInput = inputs[nextIndex];
        if (nextInput) {
            nextInput.focus();
            // Also select this input for keyboard use
            this.selectInputForKeyboard(nextInput);
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
            
            let questionText = '';
            let answerText = '';
            
            if (exercise.operation && exercise.operation.startsWith('cijferen')) {
                // Cijferen exercises
                questionText = `${exercise.num1} ${exercise.operator} ${exercise.num2} = ${exercise.answer}`;
                answerText = `${this.t('yourAnswer')} ${exercise.userAnswer !== null ? exercise.userAnswer : this.t('noAnswer')}`;
            } else if (exercise.operation === 'fractionSimplify') {
                questionText = `${exercise.startNum}/${exercise.startDen} = ${exercise.answer}/${exercise.targetDen}`;
                answerText = `${this.t('yourAnswer')} ${exercise.userAnswer || this.t('noAnswer')}`;
            } else if (exercise.operation === 'fractionAddSub') {
                const symbol = exercise.isAddition ? '+' : '-';
                questionText = `${exercise.num1}/${exercise.den1} ${symbol} ${exercise.num2}/${exercise.den2} = ${exercise.answer}`;
                answerText = `${this.t('yourAnswer')} ${exercise.userAnswer || this.t('noAnswer')}`;
            } else if (exercise.operation === 'fractionMultiply') {
                questionText = `${exercise.num1}/${exercise.den1} × ${exercise.num2}/${exercise.den2} = ${exercise.answer}`;
                answerText = `${this.t('yourAnswer')} ${exercise.userAnswer || this.t('noAnswer')}`;
            } else {
                const symbol = exercise.operation === 'division' ? '÷' : '×';
                questionText = `${exercise.num1} ${symbol} ${exercise.num2} = ${exercise.answer}`;
                answerText = `${this.t('yourAnswer')} ${exercise.userAnswer || this.t('noAnswer')}`;
            }
            
            resultDiv.innerHTML = `
                <span class="result-question">${questionText}</span>
                <span class="result-answer">${answerText}</span>
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
        
        // Show/hide star button based on screen
        const starButton = document.getElementById('github-star-btn');
        if (starButton) {
            if (screenName === 'exercise') {
                starButton.style.display = 'none';
            } else {
                starButton.style.display = 'inline-flex';
            }
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
    
    getShareTitle() {
        return this.t('shareTitle');
    }
    
    getShareHashtags() {
        return this.t('shareHashtags');
    }
    
    getShareUrl() {
        // Use GitHub Pages URL when deployed, or local URL when testing locally
        if (window.location.hostname === 'commjoen.github.io') {
            return 'https://commjoen.github.io/Multiplier/';
        } else {
            // For local development or other environments, use the current location
            return window.location.origin + window.location.pathname;
        }
    }
    
    shareOnTwitter() {
        const message = this.getShareMessage();
        const url = this.getShareUrl();
        const hashtags = this.getShareHashtags().replace(/^#/, '').replace(/ #/g, ',').replace(/#/g, '');
        
        // Create an engaging Twitter post with proper hashtags
        const twitterText = `${message}\n\n🌟 Try it yourself: ${url}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&hashtags=${encodeURIComponent(hashtags)}`;
        
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }
    
    shareOnFacebook() {
        const url = this.getShareUrl();
        const message = this.getShareMessage();
        
        // Facebook sharing with quote parameter for better engagement
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message + '\n\n🌟 Try this awesome multiplication practice app!')}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }
    
    async shareGeneric() {
        const message = this.getShareMessage();
        const url = this.getShareUrl();
        const title = this.getShareTitle();
        const fullMessage = `${message}\n\n🌟 Try it yourself: ${url}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: fullMessage,
                    url: url
                });
            } catch (err) {
                console.log('Error sharing:', err);
                this.fallbackShare(fullMessage, url);
            }
        } else {
            this.fallbackShare(fullMessage, url);
        }
    }
    
    fallbackShare(message, url) {
        // Fallback: copy to clipboard with enhanced message
        const fullMessage = `${message}\n\n${this.getShareHashtags()}\n\n🌟 Try it yourself: ${url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(fullMessage).then(() => {
                this.showShareSuccessMessage();
            }).catch(() => {
                this.legacyFallbackShare(fullMessage);
            });
        } else {
            this.legacyFallbackShare(fullMessage);
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
            this.showShareSuccessMessage();
        } catch (err) {
            console.log('Fallback copy failed:', err);
            this.showShareFailureMessage(text);
        }
        
        document.body.removeChild(textArea);
    }
    
    showShareSuccessMessage() {
        // Create a more engaging success message
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed; 
                top: 20px; 
                left: 50%; 
                transform: translateX(-50%); 
                background: #27ae60; 
                color: white; 
                padding: 12px 24px; 
                border-radius: 8px; 
                font-weight: bold; 
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideDown 0.3s ease-out;
            ">
                🎉 Share text copied! Paste it anywhere to share your achievement!
            </div>
            <style>
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(message);
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }
    
    showShareFailureMessage(text) {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed; 
                top: 20px; 
                left: 50%; 
                transform: translateX(-50%); 
                background: #e74c3c; 
                color: white; 
                padding: 12px 24px; 
                border-radius: 8px; 
                font-weight: bold; 
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 90%;
                text-align: center;
            ">
                📋 Copy manually:<br><small>${text.substring(0, 100)}...</small>
            </div>
        `;
        
        document.body.appendChild(message);
        setTimeout(() => {
            document.body.removeChild(message);
        }, 5000);
    }
    
    setupPWAInstall() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Show the install button
            if (this.installAppButton) {
                this.installAppButton.style.display = 'inline-flex';
            }
        });
        
        // Handle the app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            // Hide the install button
            if (this.installAppButton) {
                this.installAppButton.style.display = 'none';
            }
            this.deferredPrompt = null;
        });
    }
    
    installApp() {
        if (!this.deferredPrompt) {
            console.log('Install prompt not available');
            return;
        }
        
        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            this.deferredPrompt = null;
            // Hide the install button after user interaction
            if (this.installAppButton) {
                this.installAppButton.style.display = 'none';
            }
        });
    }
    
    openGitHubRepo() {
        const githubUrl = 'https://github.com/commjoen/Multiplier';
        window.open(githubUrl, '_blank', 'noopener,noreferrer');
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