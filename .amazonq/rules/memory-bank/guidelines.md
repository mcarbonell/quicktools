# FastTools - Development Guidelines

## Code Quality Standards

### File Organization
- **Consistent structure:** All files follow a clear section-based organization with separator comments
- **Section dividers:** Use `// ====================` to separate major sections
- **Section headers:** Descriptive ALL CAPS comments after dividers (e.g., `// DATA LOADING`, `// EVENT HANDLERS`)
- **Logical grouping:** Related functions grouped together under clear section headers

### Naming Conventions

**Variables and Functions:**
- **camelCase** for variables and functions: `userData`, `loadUserData()`, `handleSearch()`
- **Descriptive names:** Self-documenting names that explain purpose
- **Boolean prefixes:** Use `is`, `has`, `should` for booleans: `isRunning`, `hasData`, `shouldUpdate`
- **Event handlers:** Prefix with `handle`: `handleSearch()`, `handleCategoryFilter()`
- **Async functions:** Prefix with `load`, `fetch`, `get` when appropriate: `loadTools()`, `getAnalytics()`

**Classes:**
- **PascalCase** for class names: `QuickToolsNewTab`
- **Descriptive class names:** Clearly indicate purpose and scope

**Files:**
- **kebab-case** for all files: `service-worker.js`, `automated-qa.js`, `newtab.js`
- **Descriptive filenames:** Name indicates file purpose and content

**Constants:**
- **UPPER_SNAKE_CASE** for true constants: `CACHE_NAME`, `ANSI_COLORS`
- **camelCase** for configuration objects: `colors`, `results`, `settings`

### Code Formatting

**Indentation:**
- **4 spaces** for JavaScript
- **Consistent indentation** throughout files
- **No tabs** - spaces only

**Quotes:**
- **Single quotes** for JavaScript strings: `'text'`
- **Template literals** for string interpolation: `` `Hello ${name}` ``
- **Double quotes** for HTML attributes: `<div class="container">`

**Semicolons:**
- **Always use semicolons** to terminate statements
- **Consistent placement** at end of statements

**Spacing:**
- **Space after keywords:** `if (condition)`, `function name()`
- **Space around operators:** `a + b`, `x === y`
- **No space before function parentheses:** `function name()` not `function name ()`
- **Blank lines** between logical sections

### Comments and Documentation

**Comment Style:**
- **Section dividers:** `// ====================` for major sections
- **Section headers:** `// SECTION NAME` in ALL CAPS
- **Inline comments:** Brief explanations for complex logic
- **JSDoc style:** For function documentation when needed

**Documentation Patterns:**
```javascript
/**
 * Function description
 * 
 * @param {Type} paramName - Description
 * @returns {Type} Description
 */
```

**Comment Frequency:**
- **Minimal inline comments:** Code should be self-documenting
- **Section headers:** Always present for organization
- **Complex logic:** Brief explanation when necessary
- **TODO comments:** Track pending work

### Console Logging

**Emoji Prefixes (Consistent Pattern):**
- 🚀 **Initialization:** `console.log('🚀 Inicializando...')`
- ✅ **Success:** `console.log('✅ Operación completada')`
- ❌ **Error:** `console.error('❌ Error:', error)`
- 📨 **Messages:** `console.log('📨 Message received:', data)`
- 📋 **Context menu:** `console.log('📋 Context menu click:', id)`
- ⌨️ **Keyboard:** `console.log('⌨️ Command triggered:', cmd)`
- 🔄 **Sync/Update:** `console.log('🔄 Sync data changed')`
- 💥 **Critical error:** `console.error('💥 Service Worker error')`
- 📁 **File operations:** `log(colors.cyan, '📁 Testing...')`
- 🛠️ **Tools:** `log(colors.cyan, '🛠️ Testing Tool Pages...')`
- 📄 **HTML:** `log(colors.cyan, '📄 Testing HTML...')`
- 🏷️ **Meta tags:** `log(colors.cyan, '🏷️ Testing Meta Tags...')`
- 🔍 **SEO:** `log(colors.cyan, '🔍 Testing SEO...')`
- 🌐 **i18n:** `log(colors.cyan, '🌐 Testing Translations...')`
- ⚙️ **Service Worker:** `log(colors.cyan, '⚙️ Testing Service Worker...')`
- 📊 **Analytics:** `log(colors.cyan, '📊 Testing Analytics...')`
- 🎨 **Design:** `log(colors.cyan, '🎨 Testing Design System...')`
- 📦 **Modules:** `log(colors.cyan, '📦 Testing JavaScript Modules...')`

**Logging Best Practices:**
- **Descriptive messages:** Clear context for what's happening
- **Include relevant data:** Log important variables and state
- **Consistent format:** Use emoji prefixes consistently
- **Error details:** Always log error objects in catch blocks

## Semantic Patterns

### Async/Await Pattern (Frequency: Very High)

**Standard async function pattern:**
```javascript
async function loadUserData() {
    const data = await chrome.storage.local.get(['user', 'settings']);
    this.userData = data.user;
    this.settings = data.settings || this.getDefaultSettings();
}
```

**Error handling with async/await:**
```javascript
async function init() {
    try {
        await this.loadUserData();
        await this.loadTools();
        console.log('✅ Initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing:', error);
        this.showToast('Error loading interface', 'error');
    }
}
```

**Usage:** All asynchronous operations use async/await, never raw promises or callbacks

### Class-Based Architecture (Frequency: High)

**Standard class structure:**
```javascript
class QuickToolsNewTab {
    constructor() {
        this.userData = null;
        this.settings = null;
        this.tools = [];
        this.init();
    }

    async init() {
        // Initialization logic
    }

    // Methods organized by section
}
```

**Patterns:**
- Constructor initializes properties to null/empty
- Constructor calls `init()` method
- `init()` is async and handles setup
- Methods grouped by functionality with section dividers

### Event Listener Pattern (Frequency: Very High)

**Centralized event setup:**
```javascript
setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('global-search');
    searchInput.addEventListener('input', this.handleSearch.bind(this));
    
    // Button clicks
    document.getElementById('settings-btn').onclick = () => this.showModal('settings-modal');
    
    // Delegated events for dynamic content
    document.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (!action) return;
        
        switch (action) {
            case 'save-settings':
                this.saveSettings();
                break;
        }
    });
}
```

**Patterns:**
- All event listeners set up in dedicated method
- Use `.bind(this)` for class methods
- Arrow functions for inline handlers
- Event delegation for dynamic content using `data-action` attributes

### Data-Action Pattern for CSP Compliance (Frequency: High)

**HTML with data-action:**
```html
<button data-action="save-settings" data-modal="settings-modal">Save</button>
```

**JavaScript handler:**
```javascript
document.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    switch (action) {
        case 'save-settings':
            this.saveSettings();
            break;
    }
});
```

**Usage:** Replaces inline onclick handlers for Content Security Policy compliance

### Storage Pattern (Frequency: High)

**Chrome Extension Storage:**
```javascript
// Get data
const data = await chrome.storage.local.get(['user', 'settings']);
this.userData = data.user;

// Set data
await chrome.storage.local.set({
    settings: this.settings,
    analytics: this.analytics
});
```

**Web Storage:**
```javascript
// LocalStorage for preferences
localStorage.setItem('language', 'es');
const lang = localStorage.getItem('language');
```

### Testing Pattern (Frequency: High)

**Test result tracking:**
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

**Test suite structure:**
```javascript
function testFileStructure() {
    log(colors.cyan, '\n📁 Testing File Structure...\n');
    
    const criticalFiles = ['web/index.html', 'web/manifest.json'];
    
    criticalFiles.forEach(file => {
        testResult(
            `File exists: ${file}`,
            fileExists(fullPath),
            `Missing file: ${file}`
        );
    });
}
```

### Error Handling Pattern (Frequency: Very High)

**Try-catch with logging:**
```javascript
try {
    // Operation
    const result = await processData();
    console.log('✅ Success:', result);
} catch (error) {
    console.error('❌ Error processing:', error);
    this.showToast('Error processing data', 'error');
}
```

**Validation before operation:**
```javascript
if (!title && !content) {
    this.showToast('Note must have title or content', 'warning');
    return;
}
```

### Modal Pattern (Frequency: Medium)

**Show/hide modals:**
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

**Modal event handling:**
```javascript
// Close on background click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        this.closeModal(e.target.id);
    }
});
```

### Dynamic HTML Generation (Frequency: High)

**Template literal pattern:**
```javascript
createToolItem(tool, index) {
    const item = document.createElement('div');
    item.className = `tool-item slide-in stagger-${Math.min(Math.floor(index / 5) + 1, 4)}`;
    item.dataset.category = tool.category;
    item.onclick = () => this.openTool(tool);
    
    item.innerHTML = `
        <div class="tool-icon">${tool.icon}</div>
        <div class="tool-info">
            <div class="tool-name">${tool.name}</div>
            <div class="tool-description">${tool.description}</div>
        </div>
        <div class="tool-category">${this.getCategoryName(tool.category)}</div>
    `;
    
    return item;
}
```

**Rendering pattern:**
```javascript
renderTools() {
    const container = document.getElementById('tools-grid');
    container.innerHTML = '';
    
    this.tools.forEach((tool, index) => {
        const item = this.createToolItem(tool, index);
        container.appendChild(item);
    });
}
```

### Analytics Tracking Pattern (Frequency: High)

**Track tool usage:**
```javascript
async function trackToolUsage(toolId, source) {
    if (!toolId) return;
    
    const data = await chrome.storage.local.get('analytics');
    const analytics = data.analytics || {};
    
    // Daily usage
    const today = new Date().toDateString();
    if (!analytics.dailyUsage[today]) {
        analytics.dailyUsage[today] = {};
    }
    
    if (!analytics.dailyUsage[today][toolId]) {
        analytics.dailyUsage[today][toolId] = 0;
    }
    analytics.dailyUsage[today][toolId]++;
    
    await chrome.storage.local.set({ analytics });
}
```

**Track actions:**
```javascript
if (window.analytics) {
    window.analytics.trackAction('download', {
        'format': outputFormat
    });
}
```

**Track errors:**
```javascript
catch (error) {
    if (window.analytics) {
        window.analytics.trackError('operation_failed', error.message);
    }
    throw error;
}
```

### Service Worker Pattern (Frequency: Medium)

**Registration:**
```javascript
async function registerSW() {
    if (!isServiceWorkerSupported()) {
        console.log('[SW] Service Workers not supported');
        return null;
    }
    
    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });
        
        console.log('[SW] Service Worker registered:', registration.scope);
        return registration;
    } catch (error) {
        console.error('[SW] Error registering:', error);
        return null;
    }
}
```

**Update handling:**
```javascript
registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    if (newWorker) {
        console.log('[SW] New version available');
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateAvailable();
            }
        });
    }
});
```

### Message Passing Pattern (Frequency: Medium)

**Send message:**
```javascript
const response = await chrome.runtime.sendMessage({
    action: 'capture-screen'
});
```

**Receive message:**
```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Message received:', request.action);
    
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

## Internal API Usage

### Chrome Extension APIs

**Storage API:**
```javascript
// Get data
const data = await chrome.storage.local.get(['key1', 'key2']);

// Set data
await chrome.storage.local.set({ key: value });

// Listen for changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.settings) {
        console.log('Settings changed:', changes.settings);
    }
});
```

**Runtime API:**
```javascript
// Send message
chrome.runtime.sendMessage({ action: 'do-something' });

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handle message
});

// Get extension URL
const url = chrome.runtime.getURL('icons/icon.png');
```

**Tabs API:**
```javascript
// Query tabs
const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

// Create tab
await chrome.tabs.create({ url: 'https://example.com', active: true });

// Send message to tab
chrome.tabs.sendMessage(tabId, { action: 'do-something' });
```

**Context Menus API:**
```javascript
// Create menu
chrome.contextMenus.create({
    id: 'menu-id',
    title: 'Menu Title',
    contexts: ['selection', 'page']
});

// Handle clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log('Menu clicked:', info.menuItemId);
});
```

**Notifications API:**
```javascript
chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon.png'),
    title: 'Title',
    message: 'Message'
});
```

### Web APIs

**File API:**
```javascript
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
        const content = event.target.result;
        processFile(content);
    };
    
    reader.readAsText(file);
});
```

**Canvas API:**
```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Draw image
ctx.drawImage(img, 0, 0, width, height);

// Get data URL
const dataUrl = canvas.toDataURL('image/png');
```

**Clipboard API:**
```javascript
// Copy to clipboard
await navigator.clipboard.writeText(text);

// Read from clipboard
const text = await navigator.clipboard.readText();
```

**LocalStorage API:**
```javascript
// Set item
localStorage.setItem('key', 'value');

// Get item
const value = localStorage.getItem('key');

// Remove item
localStorage.removeItem('key');
```

## Code Idioms

### Null Coalescing and Default Values

```javascript
// Default settings
this.settings = data.settings || this.getDefaultSettings();

// Default array
this.notes = data.notes?.items || [];

// Default with nullish coalescing
const count = usage ?? 0;
```

### Array Methods

```javascript
// Map and filter
const quickAccessTools = this.quickAccess
    .map(id => this.tools.find(t => t.id === id))
    .filter(Boolean);

// Reduce
const totalUsage = Object.values(todayUsage).reduce((sum, count) => sum + count, 0);

// ForEach with index
tools.forEach((tool, index) => {
    const item = this.createToolItem(tool, index);
    container.appendChild(item);
});

// Slice for limiting
this.recentItems.slice(0, 10);
```

### Object Destructuring

```javascript
// Destructure from storage
const { user, settings, analytics } = await chrome.storage.local.get(['user', 'settings', 'analytics']);

// Spread operator for merging
const newSettings = { ...this.settings, ...updates };
```

### Template Literals

```javascript
// String interpolation
const message = `Hello ${userName}!`;

// Multi-line HTML
item.innerHTML = `
    <div class="title">${title}</div>
    <div class="description">${description}</div>
`;

// Dynamic class names
item.className = `tool-item slide-in stagger-${index + 1}`;
```

### Ternary Operators

```javascript
// Simple conditionals
const greeting = hour < 12 ? 'Good morning' : 'Good afternoon';

// Inline rendering
container.innerHTML = items.length === 0 
    ? '<p>No items</p>' 
    : items.map(item => renderItem(item)).join('');
```

### Optional Chaining

```javascript
// Safe property access
const usage = this.analytics.dailyUsage?.[today]?.[toolId] || 0;

// Safe method calls
note.tags?.forEach(tag => allTags.add(tag));
```

### Arrow Functions

```javascript
// Event handlers
button.onclick = () => this.showModal('settings-modal');

// Array methods
tools.forEach(tool => console.log(tool.name));

// Async arrow functions
const loadData = async () => {
    const data = await fetchData();
    return data;
};
```

## Common Annotations

### JSDoc Comments

```javascript
/**
 * Track tool usage in analytics
 * 
 * @param {string} toolId - Tool identifier
 * @param {string} source - Usage source (newtab, popup, context-menu)
 */
async function trackToolUsage(toolId, source) {
    // Implementation
}
```

### TODO Comments

```javascript
// TODO: Implement dark mode
// TODO: Add more languages
// FIXME: Handle edge case for empty files
```

### Section Comments

```javascript
// ====================
// INITIALIZATION
// ====================

// ====================
// EVENT HANDLERS
// ====================

// ====================
// UTILITY FUNCTIONS
// ====================
```

## Best Practices Summary

1. **Always use async/await** for asynchronous operations
2. **Organize code with section dividers** for clarity
3. **Use descriptive names** that explain purpose
4. **Log with emoji prefixes** for easy scanning
5. **Handle errors gracefully** with try-catch and user feedback
6. **Use data-action attributes** for CSP-compliant event handling
7. **Track analytics** for important user actions
8. **Validate input** before processing
9. **Provide user feedback** with toasts/notifications
10. **Keep functions focused** on single responsibility
11. **Use template literals** for HTML generation
12. **Leverage modern JavaScript** features (optional chaining, nullish coalescing)
13. **Test thoroughly** with automated test suites
14. **Document complex logic** with comments
15. **Follow consistent formatting** throughout codebase
