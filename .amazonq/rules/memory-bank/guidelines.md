# FastTools - Development Guidelines

## Code Quality Standards

### Formatting Conventions

**Indentation:**
- JavaScript: 4 spaces
- JSON: 2 spaces
- HTML: 2 spaces (when nested)

**Quotes:**
- JavaScript: Single quotes `'text'`
- HTML: Double quotes `"attribute"`
- JSON: Double quotes `"key": "value"`

**Naming Conventions:**
- Variables/Functions: `camelCase` (e.g., `handleImageUpload`, `userData`)
- Classes: `PascalCase` (e.g., `QuickToolsNewTab`, `GeminiAPI`)
- Files: `kebab-case` (e.g., `service-worker.js`, `automated-qa.js`)
- CSS Classes: `kebab-case` (e.g., `.quick-access-item`, `.tool-icon`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `CACHE_NAME`, `API_KEY`)

**Code Organization:**
- Section dividers: `// ====================`
- Section headers: `// SECTION NAME` (uppercase)
- Subsections: `// Subsection name` (sentence case)

**Example:**
```javascript
// ====================
// DATA LOADING
// ====================

async function loadUserData() {
    // Load user preferences
    const data = await chrome.storage.local.get(['user', 'settings']);
    this.userData = data.user;
}
```

### Console Logging Standards

**Emoji Prefixes:**
- 🚀 - Initialization/startup
- ✅ - Success/completion
- ❌ - Error/failure
- 📋 - Context menu/clipboard
- ⌨️ - Keyboard command
- 📨 - Message received
- 🔄 - Update/sync
- 💥 - Critical error
- 📸 - Capture/screenshot
- 📊 - Analytics/tracking

**Examples:**
```javascript
console.log('🚀 Inicializando QuickTools New Tab');
console.log('✅ QuickTools New Tab inicializado');
console.error('❌ Error inicializando new tab:', error);
console.log('📋 Context menu click:', info.menuItemId);
console.log('⌨️ Command triggered:', command);
```

### Comment Standards

**Function Documentation:**
```javascript
/**
 * Verificar si el navegador soporta Service Workers
 */
function isServiceWorkerSupported() {
    return 'serviceWorker' in navigator;
}
```

**Inline Comments:**
- Use for complex logic explanation
- Keep concise and meaningful
- Prefer self-documenting code over comments

**Section Comments:**
```javascript
// ====================
// UTILITY FUNCTIONS
// ====================
```

## Structural Conventions

### Class Structure Pattern

**Standard Class Organization:**
```javascript
class QuickToolsNewTab {
    constructor() {
        // Initialize properties
        this.userData = null;
        this.settings = null;
        this.tools = [];
        
        // Start initialization
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando...');
        
        try {
            // Load data
            await this.loadUserData();
            
            // Setup
            this.setupEventListeners();
            
            // Render
            this.renderInterface();
            
            console.log('✅ Inicializado');
        } catch (error) {
            console.error('❌ Error:', error);
        }
    }

    // ====================
    // DATA LOADING
    // ====================
    
    async loadUserData() {
        // Implementation
    }

    // ====================
    // EVENT HANDLERS
    // ====================
    
    setupEventListeners() {
        // Implementation
    }

    // ====================
    // RENDERING
    // ====================
    
    renderInterface() {
        // Implementation
    }
}
```

**Frequency:** Used in 100% of class-based modules (extension/newtab/newtab.js)

### Async/Await Pattern

**Always use async/await over promises:**
```javascript
// ✅ Good
async function loadTools() {
    const data = await chrome.storage.local.get('tools');
    return data.tools || [];
}

// ❌ Avoid
function loadTools() {
    return chrome.storage.local.get('tools').then(data => {
        return data.tools || [];
    });
}
```

**Frequency:** 95% of asynchronous operations use async/await

### Error Handling Pattern

**Standard try-catch with logging:**
```javascript
try {
    // Operation
    const result = await performOperation();
    console.log('✅ Operation completed');
    return result;
} catch (error) {
    console.error('❌ Error in operation:', error);
    this.showToast('Error message', 'error');
    throw error; // Re-throw if needed
}
```

**Frequency:** Used in 90% of async functions

## Semantic Patterns

### Storage Access Pattern

**Chrome Extension Storage:**
```javascript
// Get data
const data = await chrome.storage.local.get(['user', 'settings']);
this.userData = data.user;
this.settings = data.settings || this.getDefaultSettings();

// Set data
await chrome.storage.local.set({
    user: this.userData,
    settings: this.settings
});
```

**Frequency:** Used in 100% of extension storage operations

### Event Listener Pattern

**Data-action attribute for CSP compliance:**
```javascript
// HTML
<button data-action="save-note" data-modal="note-modal">Save</button>

// JavaScript
document.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    switch (action) {
        case 'save-note':
            this.saveNote();
            break;
        case 'delete-note':
            this.deleteNote();
            break;
    }
});
```

**Frequency:** Used in 80% of event handlers in extension code

### Modal Management Pattern

**Show/Hide modals:**
```javascript
showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    
    // Load specific modal content
    switch (modalId) {
        case 'settings-modal':
            this.loadSettingsModal();
            break;
    }
}

closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}
```

**Frequency:** Used in 100% of modal interactions

### Toast Notification Pattern

**Standard toast implementation:**
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

**Frequency:** Used in 90% of user feedback scenarios

## API Usage Patterns

### Chrome Extension APIs

**Message Passing:**
```javascript
// Send message
chrome.runtime.sendMessage({
    action: 'track-usage',
    toolId: toolId,
    source: source
});

// Receive message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'track-usage':
            trackToolUsage(request.toolId, request.source);
            break;
        case 'get-analytics':
            getAnalytics().then(sendResponse);
            return true; // Async response
    }
});
```

**Frequency:** Used in 100% of extension communication

**Context Menus:**
```javascript
// Create menu
chrome.contextMenus.create({
    id: 'tool-action',
    title: '🛠️ Tool Name',
    contexts: ['selection', 'page']
});

// Handle click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
        case 'tool-action':
            await handleToolAction(info, tab);
            break;
    }
});
```

**Frequency:** Used in 100% of context menu implementations

**Notifications:**
```javascript
chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon-128x128.png'),
    title: 'FastTools',
    message: message,
    buttons: [{ title: 'Action' }],
    requireInteraction: true
});
```

**Frequency:** Used in 80% of user notifications

### Service Worker Patterns

**Cache-First Strategy:**
```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

**Install Event:**
```javascript
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});
```

**Frequency:** Used in 100% of Service Worker implementations

### Analytics Tracking Pattern

**Tool Usage Tracking:**
```javascript
// Track when tool is used
if (window.analytics) {
    window.analytics.trackToolUsed({
        'file_type': file.type,
        'file_size': file.size
    });
}

// Track actions
if (window.analytics) {
    window.analytics.trackAction('download', {
        'format': outputFormat
    });
}

// Track errors
if (window.analytics) {
    window.analytics.trackError('operation_failed', error.message);
}
```

**Frequency:** Used in 85% of tool implementations

## Code Idioms

### Null Coalescing with Default Values

```javascript
// Get with default
this.settings = data.settings || this.getDefaultSettings();
this.notes = data.notes?.items || [];

// Array operations
const recentNotes = this.notes.slice(0, 3);
```

**Frequency:** Used in 95% of data loading operations

### Array Filtering and Mapping

```javascript
// Filter and map
const quickAccessTools = this.quickAccess
    .map(id => this.tools.find(t => t.id === id))
    .filter(Boolean);

// Reduce for aggregation
const totalUsage = Object.values(todayUsage)
    .reduce((sum, count) => sum + count, 0);
```

**Frequency:** Used in 80% of array operations

### Template Literals for HTML

```javascript
item.innerHTML = `
    <div class="tool-icon">${tool.icon}</div>
    <div class="tool-info">
        <div class="tool-name">${tool.name}</div>
        <div class="tool-description">${tool.description}</div>
    </div>
`;
```

**Frequency:** Used in 100% of dynamic HTML generation

### Object Destructuring

```javascript
// Destructure from storage
const { user, settings, analytics } = await chrome.storage.local.get([
    'user', 'settings', 'analytics'
]);

// Spread operator for updates
const newSettings = { ...this.settings, ...updates };
```

**Frequency:** Used in 70% of object operations

### Arrow Functions

```javascript
// Event listeners
button.addEventListener('click', () => this.handleClick());

// Array methods
tools.forEach(tool => this.renderTool(tool));

// Async operations
const data = await fetch(url).then(r => r.json());
```

**Frequency:** Used in 95% of function expressions

## Testing Patterns

### Test Structure

```javascript
function testFeature() {
    log(colors.cyan, '\n🧪 Testing Feature...\n');
    
    const testCases = [
        'file1.html',
        'file2.html'
    ];
    
    testCases.forEach(file => {
        const fullPath = path.join(process.cwd(), file);
        testResult(
            `Test: ${file}`,
            fileExists(fullPath),
            `Missing: ${file}`
        );
    });
}
```

**Frequency:** Used in 100% of test suites

### Test Result Tracking

```javascript
function testResult(name, passed, message = '') {
    results.total++;
    if (passed) {
        results.passed++;
        log(colors.green, `✅ ${name}`);
    } else {
        results.failed++;
        log(colors.red, `❌ ${name}`);
        if (message) {
            log(colors.red, `   ${message}`);
            results.errors.push({ test: name, error: message });
        }
    }
}
```

**Frequency:** Used in 100% of test assertions

## Best Practices

### 1. Always Check for API Availability

```javascript
if ('serviceWorker' in navigator) {
    // Use Service Worker
}

if (window.analytics) {
    // Track analytics
}

if (typeof chrome !== 'undefined' && chrome.storage) {
    // Use Chrome Storage
}
```

### 2. Provide Default Values

```javascript
getDefaultSettings() {
    return {
        theme: 'auto',
        accentColor: '#6366f1',
        autoCapture: false,
        saveToClipboard: true
    };
}
```

### 3. Use Semantic HTML

```javascript
// Create semantic elements
const item = document.createElement('article');
item.className = 'tool-item';
item.setAttribute('role', 'button');
item.setAttribute('tabindex', '0');
```

### 4. Handle Async Errors Gracefully

```javascript
try {
    const result = await operation();
    return result;
} catch (error) {
    console.error('❌ Error:', error);
    this.showToast('User-friendly error message', 'error');
    return null; // Return safe default
}
```

### 5. Clean Up Resources

```javascript
// Clear intervals
if (this.quickTimer.interval) {
    clearInterval(this.quickTimer.interval);
}

// Remove event listeners
element.removeEventListener('click', handler);

// Clear timeouts
clearTimeout(timeoutId);
```

### 6. Use Constants for Magic Numbers

```javascript
const MAX_NOTES = 50;
const TOAST_DURATION = 3000;
const CACHE_VERSION = 'v2.0.0';
```

### 7. Validate User Input

```javascript
if (!title && !content) {
    this.showToast('La nota debe tener título o contenido', 'warning');
    return;
}
```

### 8. Use Descriptive Variable Names

```javascript
// ✅ Good
const quickAccessTools = this.quickAccess
    .map(id => this.tools.find(t => t.id === id))
    .filter(Boolean);

// ❌ Avoid
const qat = this.qa.map(i => this.t.find(t => t.i === i)).filter(Boolean);
```

### 9. Keep Functions Small and Focused

```javascript
// Each function does one thing
async function loadUserData() { }
async function loadTools() { }
async function loadNotes() { }

// Called from init
async function init() {
    await this.loadUserData();
    await this.loadTools();
    await this.loadNotes();
}
```

### 10. Document Complex Logic

```javascript
/**
 * Calculate productivity score based on tool diversity and usage
 * Score = min(toolCount * 10, 50) + min(totalUsage * 2, 50)
 * Maximum score: 100
 */
calculateProductivityScore() {
    const diversityScore = Math.min(toolCount * 10, 50);
    const usageScore = Math.min(totalUsage * 2, 50);
    return Math.min(diversityScore + usageScore, 100);
}
```

## File Organization

### Module Structure

**Typical file structure:**
```
1. File header comment
2. Imports (if any)
3. Constants
4. Main class/function
5. Helper functions
6. Initialization code
7. Exports (if module)
```

**Example:**
```javascript
// service-worker.js - Service Worker registration
// For use in pages as module: import { registerSW } from './service-worker.js'

// Constants
const CACHE_VERSION = 'v2.0.0';

// Main functions
async function registerSW() { }
async function updateSW() { }

// Helper functions
function isServiceWorkerSupported() { }
function isSecureContext() { }

// Auto-initialization
if (typeof window !== 'undefined') {
    registerSW();
}

// Exports
export { registerSW, updateSW };
```

### Separation of Concerns

- **Logic:** Separate business logic from UI
- **Data:** Separate data loading from rendering
- **Events:** Centralize event handling
- **Utilities:** Extract reusable functions

## Performance Considerations

### 1. Lazy Loading

```javascript
// Load tools on demand
async function loadTool(toolId) {
    const module = await import(`./tools/${toolId}.js`);
    return module.default;
}
```

### 2. Debouncing

```javascript
// Debounce search input
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        this.handleSearch(e);
    }, 300);
});
```

### 3. Efficient DOM Updates

```javascript
// Batch DOM updates
const fragment = document.createDocumentFragment();
items.forEach(item => {
    fragment.appendChild(this.createItem(item));
});
container.appendChild(fragment);
```

### 4. Cache Results

```javascript
// Cache expensive calculations
if (!this._cachedResult) {
    this._cachedResult = this.expensiveCalculation();
}
return this._cachedResult;
```

## Security Practices

### 1. Content Security Policy Compliance

```javascript
// Use data-action instead of inline onclick
<button data-action="save">Save</button>

// Handle via event delegation
document.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (action === 'save') this.save();
});
```

### 2. Sanitize User Input

```javascript
// Escape HTML entities
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

### 3. Validate URLs

```javascript
// Validate before opening
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
```

## Accessibility

### 1. Semantic HTML

```javascript
// Use semantic elements
<button> instead of <div onclick>
<nav> for navigation
<main> for main content
<article> for independent content
```

### 2. ARIA Attributes

```javascript
element.setAttribute('role', 'button');
element.setAttribute('aria-label', 'Close modal');
element.setAttribute('aria-expanded', 'false');
```

### 3. Keyboard Navigation

```javascript
element.setAttribute('tabindex', '0');
element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        this.handleClick();
    }
});
```

## Internationalization

### 1. Use Translation Keys

```javascript
// Load translations
const translations = await fetch('/i18n/en.json').then(r => r.json());

// Apply translations
document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = translations[key];
});
```

### 2. Language Detection

```javascript
const userLang = navigator.language || navigator.userLanguage;
const lang = userLang.startsWith('es') ? 'es' : 'en';
```

## Version Control

### Commit Message Format

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

### Branch Naming

```
feature/tool-name
fix/bug-description
docs/update-readme
```
