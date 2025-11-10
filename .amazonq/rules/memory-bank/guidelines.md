# QuickTools - Development Guidelines

## Code Quality Standards

### JavaScript Conventions
- **ES6+ Syntax**: Use modern JavaScript features (arrow functions, const/let, template literals, async/await)
- **Strict Mode**: Not explicitly declared but implied through module patterns
- **Semicolons**: Consistently used at end of statements
- **Quotes**: Single quotes for strings, double quotes for HTML attributes
- **Indentation**: 4 spaces for JavaScript, 2 spaces for JSON
- **Line Length**: No strict limit, but keep readable (typically under 120 characters)

### Naming Conventions
- **Variables/Functions**: camelCase (`stopwatchDisplay`, `updateTimerDisplay`, `trackToolUsage`)
- **Classes**: PascalCase (`QuickToolsNewTab`)
- **Constants**: camelCase for regular constants, UPPER_SNAKE_CASE for true constants
- **File Names**: kebab-case for HTML/CSS (`stopwatch-timer.js`, `service-worker.js`)
- **IDs/Classes**: kebab-case for HTML (`stopwatch-display`, `timer-start`)
- **Private Methods**: No special prefix, rely on closure scope

### Code Organization
- **Class-Based Architecture**: Use ES6 classes for complex components (extension new tab, service worker handlers)
- **Module Pattern**: Self-contained modules with clear initialization
- **Separation of Concerns**: Distinct sections for data loading, event handling, rendering, utilities
- **Comment Sections**: Use `// ====================` dividers with section titles in UPPERCASE

Example section structure:
```javascript
// ====================
// DATA LOADING
// ====================

// ====================
// EVENT HANDLERS
// ====================

// ====================
// RENDERING
// ====================

// ====================
// UTILITY FUNCTIONS
// ====================
```

### Documentation Standards
- **File Headers**: Include purpose and description at top of files
- **Section Comments**: Clear section dividers with descriptive titles
- **Function Comments**: Minimal inline comments, prefer self-documenting code
- **Console Logging**: Use emoji prefixes for log categorization:
  - 🚀 Initialization/startup
  - ✅ Success operations
  - ❌ Errors
  - 📋 Context menu actions
  - ⌨️ Keyboard commands
  - 📨 Message handling
  - 🔄 Updates/sync
  - 💥 Critical errors

## Architectural Patterns

### Client-Side Processing Pattern
All tools follow a consistent client-side processing approach:
```javascript
// 1. Load file/input from user
// 2. Process entirely in browser (Canvas API, PDF.js, native JS)
// 3. Generate output
// 4. Provide download/copy functionality
// No server communication for processing
```

### Event-Driven Architecture
- **DOMContentLoaded**: Primary initialization trigger
- **Event Delegation**: Use data-action attributes for CSP compliance
- **Message Passing**: Chrome extension messaging for cross-context communication

Example event delegation pattern:
```javascript
document.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    switch (action) {
        case 'start-timer':
            this.startTimer();
            break;
        // ... more actions
    }
});
```

### State Management
- **Local State**: Class properties for component state
- **Persistent Storage**: Chrome Storage API for extension, localStorage for web
- **No Global State**: Avoid global variables, use class instances or closures

### Async/Await Pattern
Consistently use async/await for asynchronous operations:
```javascript
async init() {
    await this.loadUserData();
    await this.loadTools();
    await this.loadNotes();
    this.setupEventListeners();
    this.renderInterface();
}
```

## Common Implementation Patterns

### Initialization Pattern
```javascript
// Wait for DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    new ComponentClass();
}
```

### Chrome Extension Patterns

#### Storage Access
```javascript
// Read from storage
const data = await chrome.storage.local.get(['key1', 'key2']);

// Write to storage
await chrome.storage.local.set({ key: value });

// Get all storage
chrome.storage.local.get(null, (data) => { /* ... */ });
```

#### Message Passing
```javascript
// Send message
chrome.runtime.sendMessage({
    action: 'action-name',
    data: payload
});

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'action-name') {
        // Handle action
        sendResponse({ success: true });
    }
    return true; // For async response
});
```

#### Notifications
```javascript
chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon-128x128.png'),
    title: 'Title',
    message: 'Message text'
});
```

### Internationalization Pattern
```javascript
// Translation object access
const t = window.toolTranslations || {};

// Use translations in code
button.textContent = t.startButton || 'Start';

// Translation files structure
{
  "en": { "startButton": "Start", "stopButton": "Stop" },
  "es": { "startButton": "Iniciar", "stopButton": "Detener" }
}
```

### Time Formatting Pattern
```javascript
function formatTime(ms) {
    const date = new Date(ms);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
```

### DOM Manipulation Pattern
```javascript
// Create elements programmatically
const item = document.createElement('div');
item.className = 'tool-item';
item.onclick = () => this.handleClick();
item.innerHTML = `
    <div class="icon">${icon}</div>
    <div class="name">${name}</div>
`;
container.appendChild(item);
```

### Toast Notification Pattern
```javascript
showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
```

## Testing Patterns

### Test File Structure
```javascript
// File header with purpose
// tests/test-name.test.js - Description

const fs = require('fs');
const path = require('path');

// Configuration object
const config = {
    colors: { /* ANSI color codes */ },
    testFiles: [ /* test files */ ]
};

// Utility functions
function log(color, message) { /* ... */ }

// Test functions
function testFeature() {
    const results = { passed: 0, total: 0, errors: [] };
    // Test logic
    return results;
}

// Main execution
async function main() {
    const testResults = [];
    testResults.push(testFeature());
    generateReport(testResults);
}

// Execute if called directly
if (require.main === module) {
    main();
}
```

### Test Result Pattern
```javascript
const results = { 
    passed: 0,      // Number of passed tests
    total: 0,       // Total number of tests
    errors: []      // Array of error messages
};

// Increment for each test
results.total++;
if (testPassed) {
    results.passed++;
} else {
    results.errors.push('Error description');
}
```

### Console Output with Colors
```javascript
const colors = {
    reset: '\\x1b[0m',
    green: '\\x1b[32m',
    red: '\\x1b[31m',
    yellow: '\\x1b[33m',
    cyan: '\\x1b[36m'
};

console.log(colors.green + '✅ Test passed' + colors.reset);
console.log(colors.red + '❌ Test failed' + colors.reset);
```

## Build and Generation Patterns

### Translation Generation
```javascript
// Common translations shared across tools
const common = {
    en: { copyButton: "Copy", clearButton: "Clear" },
    es: { copyButton: "Copiar", clearButton: "Limpiar" }
};

// Tool-specific translations extend common
const tools = {
    'tool-name': {
        en: { ...common.en, specificKey: "Value" },
        es: { ...common.es, specificKey: "Valor" }
    }
};

// Write to files
await fs.writeFile(
    filePath,
    JSON.stringify(translations, null, 2),
    'utf8'
);
```

### File System Operations
```javascript
// Check file existence
if (fs.existsSync(filePath)) { /* ... */ }

// Read file
const content = fs.readFileSync(filePath, 'utf8');

// Write file
fs.writeFileSync(filePath, content, 'utf8');

// Use promises for async
const fs = require('fs').promises;
await fs.writeFile(filePath, content, 'utf8');
```

## Error Handling

### Try-Catch Pattern
```javascript
try {
    await this.performOperation();
    this.showToast('Success', 'success');
} catch (error) {
    console.error('❌ Error:', error);
    this.showToast('Error: ' + error.message, 'error');
}
```

### Service Worker Error Handling
```javascript
// Global error handler
self.addEventListener('error', (event) => {
    console.error('💥 Service Worker error:', event.error);
});

// Unhandled promise rejection
self.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Unhandled promise rejection:', event.reason);
});
```

### Validation Pattern
```javascript
if (!requiredValue) {
    this.showToast('Required field missing', 'warning');
    return;
}

if (value < minValue || value > maxValue) {
    this.showToast('Value out of range', 'error');
    return;
}
```

## Performance Optimization

### Interval Management
```javascript
// Store interval reference
this.interval = setInterval(() => this.update(), 1000);

// Always clear intervals
clearInterval(this.interval);
this.interval = null;
```

### Debouncing User Input
```javascript
let timeout;
input.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        this.handleInput(e.target.value);
    }, 300);
});
```

### Efficient DOM Updates
```javascript
// Batch DOM operations
const fragment = document.createDocumentFragment();
items.forEach(item => {
    const element = this.createElement(item);
    fragment.appendChild(element);
});
container.appendChild(fragment);
```

## Security Practices

### Content Security Policy (CSP) Compliance
- **No Inline Handlers**: Use addEventListener instead of onclick attributes
- **Data Attributes**: Use data-action for event delegation
- **No eval()**: Never use eval or Function constructor with user input
- **Sanitize Input**: Always validate and sanitize user input before processing

### Chrome Extension Security
- **Manifest V3**: Use latest manifest version
- **Minimal Permissions**: Request only necessary permissions
- **Message Validation**: Validate sender.id in message listeners
- **Secure Storage**: Use chrome.storage, not localStorage for sensitive data

### Privacy-First Approach
- **No Server Upload**: All processing client-side
- **No Tracking**: Analytics only with user consent
- **Clear Data**: Provide clear data deletion options
- **Transparent Storage**: Inform users what's stored and where

## Code Review Checklist

Before committing code, verify:
- [ ] ES6+ syntax used consistently
- [ ] Proper error handling with try-catch
- [ ] Console logs use emoji prefixes
- [ ] Event listeners properly cleaned up
- [ ] Intervals/timeouts cleared when done
- [ ] No inline event handlers (CSP compliance)
- [ ] Translations used for user-facing text
- [ ] Comments use section dividers
- [ ] File has descriptive header comment
- [ ] No hardcoded credentials or API keys
- [ ] Client-side processing only (no server calls)
- [ ] Responsive design considerations
- [ ] Accessibility attributes where needed
