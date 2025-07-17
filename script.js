// DOM Elements
const startScreen = document.getElementById('startScreen');
const testScreen = document.getElementById('testScreen');
const resultsScreen = document.getElementById('resultsScreen');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const endBtn = document.getElementById('endBtn');
const retryBtn = document.getElementById('retryBtn');
const newTestBtn = document.getElementById('newTestBtn');
const shareBtn = document.getElementById('shareBtn');
const typingText = document.getElementById('typingText');
const typingInput = document.getElementById('typingInput');
const wpmStat = document.getElementById('wpmStat');
const accuracyStat = document.getElementById('accuracyStat');
const timeStat = document.getElementById('timeStat');
const progressBar = document.getElementById('progressBar');
const resultWpm = document.getElementById('resultWpm');
const resultAccuracy = document.getElementById('resultAccuracy');
const resultTime = document.getElementById('resultTime');
const resultKeystrokes = document.getElementById('resultKeystrokes');
const wpmCategory = document.getElementById('wpmCategory');
const accuracyCategory = document.getElementById('accuracyCategory');
const historyList = document.getElementById('historyList');
const themeToggle = document.querySelector('.theme-toggle');
const confettiContainer = document.getElementById('confettiContainer');

// App State
let state = {
    testActive: false,
    testPaused: false,
    startTime: null,
    endTime: null,
    timerInterval: null,
    quote: '',
    typedText: '',
    correctKeystrokes: 0,
    incorrectKeystrokes: 0,
    currentIndex: 0,
    timeLimit: 60, // in seconds
    difficulty: 'easy',
    strictMode: false,
    history: []
};

// Initialize the app
function init() {
    loadHistory();
    setupEventListeners();
    applyThemePreference();
}

// Set up event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startTest);
    pauseBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', restartTest);
    endBtn.addEventListener('click', endTest);
    retryBtn.addEventListener('click', retryTest);
    newTestBtn.addEventListener('click', newTest);
    shareBtn.addEventListener('click', shareResults);
    typingInput.addEventListener('input', handleTyping);
    typingInput.addEventListener('keydown', handleTabKey);
    themeToggle.addEventListener('click', toggleTheme);
}

// Load history from localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('typingTestHistory');
    if (savedHistory) {
        state.history = JSON.parse(savedHistory);
        renderHistory();
    }
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('typingTestHistory', JSON.stringify(state.history));
}

// Render history list
function renderHistory() {
    historyList.innerHTML = '';
    
    // Show only the last 5 tests
    const recentHistory = state.history.slice(-5).reverse();
    
    if (recentHistory.length === 0) {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.textContent = 'No tests completed yet';
        historyList.appendChild(li);
        return;
    }
    
    recentHistory.forEach((test, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const date = new Date(test.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        li.innerHTML = `
            <div>
                <strong>${test.wpm} WPM</strong> (${test.accuracy}% accuracy)
                <div class="history-difficulty">${test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}</div>
            </div>
            <div class="history-date">${dateStr}</div>
        `;
        
        historyList.appendChild(li);
    });
}

// Apply theme preference from localStorage or system preference
function applyThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '🌞';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌓';
    }
}

// Toggle between light and dark theme
function toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌓';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '🌞';
    }
}

// Start a new test
async function startTest() {
    // Get test settings
    state.difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    state.timeLimit = parseInt(document.querySelector('input[name="timeMode"]:checked').value);
    state.strictMode = document.getElementById('strictMode').checked;
    
    // Show loading state
    typingText.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading text...</p></div>';
    
    // Switch to test screen
    startScreen.classList.remove('active');
    testScreen.classList.add('active');
    testScreen.classList.remove('paused');
    
    try {
        // Try to fetch a random quote from API
        await fetchQuote();
    } catch (error) {
        console.error('Failed to fetch quote:', error);
        // Fallback to local quotes
        useLocalQuote();
    }
    
    // Initialize test state
    state.testActive = true;
    state.testPaused = false;
    state.typedText = '';
    state.correctKeystrokes = 0;
    state.incorrectKeystrokes = 0;
    state.currentIndex = 0;
    state.startTime = new Date();
    
    // Update UI
    typingInput.value = '';
    typingInput.focus();
    
    // Start timer if not in infinite mode
    if (state.timeLimit > 0) {
        startTimer();
    } else {
        timeStat.textContent = '∞';
        progressBar.style.width = '0%';
    }
    
    // Update stats
    updateStats();
}

// Fetch a random quote from API
async function fetchQuote() {
    let url = 'https://api.quotable.io/random';
    
    // Adjust quote length based on difficulty
    if (state.difficulty === 'easy') {
        url += '?maxLength=100';
    } else if (state.difficulty === 'medium') {
        url += '?minLength=100&maxLength=200';
    } else {
        url += '?minLength=200';
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch quote');
    
    const data = await response.json();
    state.quote = data.content;
    renderQuote();
}

// Use a local quote as fallback
function useLocalQuote() {
    const quotes = localQuotes[state.difficulty];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    state.quote = quotes[randomIndex];
    renderQuote();
}

// Render the quote with proper formatting
function renderQuote() {
    let html = '';
    
    // Split the quote into characters and wrap each in a span
    const characters = state.quote.split('');
    
    characters.forEach((char, index) => {
        // Handle special characters (spaces, newlines)
        if (char === ' ') {
            char = '&nbsp;';
        } else if (char === '\n') {
            char = '<br>';
        }
        
        html += `<span data-index="${index}">${char}</span>`;
    });
    
    typingText.innerHTML = html;
    
    // Highlight the first character
    highlightCurrentCharacter();
}

// Handle typing input
function handleTyping(e) {
    if (!state.testActive || state.testPaused) return;
    
    const inputText = e.target.value;
    const lastChar = inputText[inputText.length - 1];
    
    // In strict mode, don't allow incorrect characters
    if (state.strictMode && lastChar !== state.quote[state.currentIndex]) {
        e.target.value = inputText.slice(0, -1);
        return;
    }
    
    state.typedText = inputText;
    state.currentIndex = inputText.length;
    
    // Update character highlighting
    updateCharacterHighlighting();
    
    // Update stats
    updateStats();
    
    // Check if test is complete (all characters typed)
    if (state.currentIndex >= state.quote.length) {
        endTest();
    }
}

// Prevent tab from moving focus away from input
function handleTabKey(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        // Insert tab character
        const start = typingInput.selectionStart;
        const end = typingInput.selectionEnd;
        const value = typingInput.value;
        
        typingInput.value = value.substring(0, start) + '\t' + value.substring(end);
        typingInput.selectionStart = typingInput.selectionEnd = start + 1;
        
        // Trigger input event
        const event = new Event('input', { bubbles: true });
        typingInput.dispatchEvent(event);
    }
}

// Update character highlighting based on typed text
function updateCharacterHighlighting() {
    const spans = typingText.querySelectorAll('span');
    
    spans.forEach((span, index) => {
        span.className = '';
        
        if (index < state.currentIndex) {
            // Already typed characters
            const typedChar = state.typedText[index];
            const correctChar = state.quote[index];
            
            if (typedChar === correctChar) {
                span.classList.add('correct');
                state.correctKeystrokes++;
            } else {
                span.classList.add('incorrect');
                state.incorrectKeystrokes++;
            }
        } else if (index === state.currentIndex) {
            // Current character
            span.classList.add('current');
        }
    });
    
    // Add cursor to current character
    if (state.currentIndex < state.quote.length) {
        const currentSpan = typingText.querySelector(`span[data-index="${state.currentIndex}"]`);
        if (currentSpan) {
            currentSpan.classList.add('cursor');
        }
    }
    
    // Auto-scroll to keep current character visible
    highlightCurrentCharacter();
}

// Scroll to keep current character visible
function highlightCurrentCharacter() {
    if (state.currentIndex < state.quote.length) {
        const currentSpan = typingText.querySelector(`span[data-index="${state.currentIndex}"]`);
        if (currentSpan) {
            currentSpan.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }
}

// Start the test timer
function startTimer() {
    clearInterval(state.timerInterval);
    
    let timeLeft = state.timeLimit;
    updateTimeDisplay(timeLeft);
    
    state.timerInterval = setInterval(() => {
        timeLeft--;
        updateTimeDisplay(timeLeft);
        
        // Update progress bar
        const progress = ((state.timeLimit - timeLeft) / state.timeLimit) * 100;
        progressBar.style.width = `${progress}%`;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

// Update the time display
function updateTimeDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timeStat.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Toggle pause/resume
function togglePause() {
    if (!state.testActive) return;
    
    state.testPaused = !state.testPaused;
    
    if (state.testPaused) {
        clearInterval(state.timerInterval);
        typingInput.blur();
        testScreen.classList.add('paused');
    } else {
        if (state.timeLimit > 0) {
            startTimer();
        }
        typingInput.focus();
        testScreen.classList.remove('paused');
    }
}

// Restart the current test
function restartTest() {
    if (confirm('Are you sure you want to restart the test? Your progress will be lost.')) {
        endTest();
        startTest();
    }
}

// End the current test
function endTest() {
    if (!state.testActive) return;
    
    state.testActive = false;
    state.endTime = new Date();
    
    clearInterval(state.timerInterval);
    
    // Calculate final stats
    const timeElapsed = (state.endTime - state.startTime) / 1000;
    const wpm = calculateWPM(timeElapsed);
    const accuracy = calculateAccuracy();
    
    // Save to history
    const testResult = {
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy * 100),
        keystrokes: state.correctKeystrokes + state.incorrectKeystrokes,
        time: Math.round(timeElapsed),
        timestamp: new Date().toISOString(),
        difficulty: state.difficulty
    };
    
    state.history.push(testResult);
    saveHistory();
    
    // Show results screen
    showResults(testResult);
}

// Calculate WPM
function calculateWPM(timeElapsed) {
    // WPM = (correct characters / 5) / (time in minutes)
    const words = state.correctKeystrokes / 5;
    const minutes = timeElapsed / 60;
    return minutes > 0 ? words / minutes : 0;
}

// Calculate accuracy
function calculateAccuracy() {
    const totalKeystrokes = state.correctKeystrokes + state.incorrectKeystrokes;
    return totalKeystrokes > 0 ? state.correctKeystrokes / totalKeystrokes : 1;
}

// Update real-time stats
function updateStats() {
    if (!state.startTime) return;
    
    const timeElapsed = (new Date() - state.startTime) / 1000;
    const wpm = calculateWPM(timeElapsed);
    const accuracy = calculateAccuracy();
    
    wpmStat.textContent = Math.round(wpm);
    accuracyStat.textContent = `${Math.round(accuracy * 100)}%`;
}

// Show results screen
function showResults(result) {
    testScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    
    // Display results
    resultWpm.textContent = result.wpm;
    resultAccuracy.textContent = `${result.accuracy}%`;
    resultTime.textContent = `${result.time}s`;
    resultKeystrokes.textContent = result.keystrokes;
    
    // Determine WPM category
    let category;
    if (result.wpm >= 80) category = 'expert';
    else if (result.wpm >= 60) category = 'advanced';
    else if (result.wpm >= 40) category = 'intermediate';
    else if (result.wpm >= 20) category = 'beginner';
    else category = 'novice';
    wpmCategory.textContent = category;
    
    // Determine accuracy category
    let accCategory;
    if (result.accuracy >= 98) accCategory = 'perfect';
    else if (result.accuracy >= 95) accCategory = 'excellent';
    else if (result.accuracy >= 90) accCategory = 'good';
    else if (result.accuracy >= 80) accCategory = 'fair';
    else accCategory = 'poor';
    accuracyCategory.textContent = accCategory;
    
    // Show confetti for high scores
    if (result.wpm >= 60 && result.accuracy >= 95) {
        createConfetti();
    }
    
    // Update history
    renderHistory();
}

// Create confetti animation
function createConfetti() {
    // Clear any existing confetti
    confettiContainer.innerHTML = '';
    
    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        const size = Math.random() * 12 + 6;
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        const shape = Math.random() > 0.5 ? 'circle' : 'square';
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.opacity = '1';
        confetti.style.animation = `fall ${animationDuration}s linear ${delay}s forwards`;
        confetti.style.borderRadius = shape === 'circle' ? '50%' : '2px';
        
        // Add to container
        confettiContainer.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, (animationDuration + delay) * 1000);
    }
    
    // Add CSS for falling animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Retry the same test
function retryTest() {
    resultsScreen.classList.remove('active');
    startTest();
}

// Start a new test with different settings
function newTest() {
    resultsScreen.classList.remove('active');
    startScreen.classList.add('active');
}

// Share results
function shareResults() {
    const result = state.history[state.history.length - 1];
    const text = `I scored ${result.wpm} WPM with ${result.accuracy}% accuracy on Typing Quest!`;
    
    // Just copy to clipboard for local use
    navigator.clipboard.writeText(text).then(() => {
        alert('Results copied to clipboard!');
    }).catch(err => {
        console.log('Could not copy text:', err);
        prompt('Copy these results:', text);
    });
}

// Initialize the app
init();