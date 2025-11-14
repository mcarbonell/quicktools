# FastTools - Development Guidelines

## Code Quality Standards

### File Organization
- **Section dividers:** Use `// ====================` with descriptive comments
- **Logical grouping:** Group related functions under section headers
- **Import statements:** Always at the top with clear section marker
- **Exports:** At the bottom with clear section marker

**Example:**
```javascript
// ====================
// IMPORTS
// ====================

importScripts('history-analyzer.js');
importScripts('bookmarks-analyzer.js');

// ====================
// INITIALIZATION
// ====================

let creating; // A promise to prevent race conditions

// ====================
// EXPORT
// ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { /* exports */ };
}
```

### Naming Conventions

**Variables and Functions:**
- camelCase for variables and functions: `generateUserId`, `trackToolUsage`
- Descriptive names that explain purpose: `showUpdateAvailable`, `setupOffscreenDocument`
- Boolean variables with `is/has` prefix: `isServiceWorkerSupported`, `hasAlt`

**Constants:**
- UPPER_SNAKE_CASE for true constants: `CACHE_NAME`, `MAX_SCORE`
- camelCase for configuration objects: `colors`, `results`

**Files:**
- kebab-case for filenames: `service-worker.js`, `automated-qa.js`, `seo-utils.js`
- Descriptive names matching content: `history-analyzer.js`, `profile-manager.js`

**CSS:**
- kebab-case for classes: `.sw-update-banner`, `.toast-notification`
- BEM-like naming for components: `.card__header`, `.button--primary`

### Code Formatting

**Indentation:**
- 4 spaces for JavaScript
- 2 spaces for JSON
- Consistent throughout file

**Quotes:**
- Single quotes for JavaScript strings: `'FastTools Extension'`
- Double quotes for HTML attributes: `<div class="container">`
- Template literals for multi-line or interpolated strings

**Semicolons:**
- Always use semicolons to terminate statements
- Consistent across all JavaScript files

**Line Length:**
- Prefer lines under 100 characters
- Break long lines at logical points
- Indent continuation lines

### Comments and Documentation

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
- Use `//` for single-line comments
- Explain WHY, not WHAT (code should be self-documenting)
- Add context for complex logic

**Section Headers:**
```javascript
// ====================
// CONTEXT MENUS
// ====================
```

**TODO Comments:**
- Use `// TODO:` for future improvements
- Include context or ticket reference

## Semantic Patterns

### Async/Await Pattern
**Frequency:** Very high (90%+ of async code)

```javascript
async function analyzeHistory(days = 30) {
    try {
        const analysis = await historyAnalyzer.analyzeHistory(days);
        return {
            success: true,
            analysis: analysis
        };
    } catch (error) {
        console.error('❌ Error analizando historial:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
```

**Key Points:**
- Always use try-catch with async functions
- Return structured objects with `success` flag
- Include error messages in return value
- Log errors with emoji prefixes

### Event Listener Pattern
**Frequency:** High (all user interactions)

```javascript
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log('📋 Context menu click:', info.menuItemId);

    try {
        switch (info.menuItemId) {
            case 'text-encode-url':
                await handleTextEncodeURL(info, tab);
                break;
            case 'text-base64':
                await handleTextBase64(info, tab);
                break;
        }

        await trackToolUsage(info.menuItemId, 'context-menu');

    } catch (error) {
        console.error('❌ Error en context menu:', error);
        showErrorNotification(error.message);
    }
});
```

**Key Points:**
- Use arrow functions for listeners
- Always wrap in try-catch
- Log action with emoji
- Track usage after successful action
- Show user-friendly error notifications

### Message Passing Pattern (Extension)
**Frequency:** High (extension communication)

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Message received:', request.action);

    switch (request.action) {
        case 'analyze-history':
            analyzeHistory(request.days).then(sendResponse);
            return true; // Async response
        case 'save-profile':
            saveProfile(request.profile).then(sendResponse);
            return true;
    }
});
```

**Key Points:**
- Always log received messages
- Use switch statement for action routing
- Return `true` for async responses
- Validate sender ID for security

### Storage Pattern
**Frequency:** High (data persistence)

```javascript
// Chrome Storage (Extension)
async function saveProfile(profile) {
    try {
        await chrome.storage.local.set({ userProfile: profile });
        return { success: true };
    } catch (error) {
        console.error('❌ Error guardando perfil:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// LocalStorage (Web)
function saveApiKey(key) {
    try {
        localStorage.setItem('gemini_api_key', key);
        return true;
    } catch (error) {
        console.error('❌ Error guardando API key:', error);
        return false;
    }
}
```

**Key Points:**
- Always wrap storage operations in try-catch
- Use descriptive keys: `userProfile`, `gemini_api_key`
- Return success/failure indicators
- Prefer chrome.storage in extensions (sync across devices)

### Testing Pattern
**Frequency:** All test files

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

// Usage
testResult(
    'File exists: web/index.html',
    fileExists(fullPath),
    `Missing file: web/index.html`
);
```

**Key Points:**
- Use emoji indicators (✅ ❌)
- Track total/passed/failed counts
- Store error details for reporting
- Descriptive test names
- Optional error messages

### Notification Pattern
**Frequency:** Medium (user feedback)

```javascript
function showNotification(message, type = 'info', buttons = [], notificationId = undefined, requireInteraction = false) {
    const icons = {
        success: 'icons/icon-128x128.png',
        error: 'icons/icon-128x128.png',
        info: 'icons/icon-128x128.png'
    };

    chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: chrome.runtime.getURL(icons[type]),
        title: 'FastTools',
        message: message,
        buttons: buttons,
        requireInteraction: requireInteraction
    });
}
```

**Key Points:**
- Default parameters for flexibility
- Icon mapping by type
- Consistent branding (title)
- Optional buttons and interaction

## Chrome Extension Patterns

### Offscreen Document Pattern
**Frequency:** Medium (Chrome AI access)

```javascript
async function setupOffscreenDocument(path) {
    // Check all existing contexts for a matching document
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
        documentUrls: [chrome.runtime.getURL(path)]
    });

    if (existingContexts.length > 0) {
        return;
    }

    // create offscreen document
    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: path,
            reasons: [chrome.offscreen.Reason.USER_MEDIA],
            justification: 'Screen capture requires getDisplayMedia API',
        });
        await creating;
        creating = null;
    }
}
```

**Key Points:**
- Check for existing contexts first
- Prevent race conditions with promise tracking
- Clear justification for Chrome Web Store review
- Appropriate reason enum

### Context Menu Pattern
**Frequency:** Medium (extension UI)

```javascript
function createContextMenus() {
    // Limpiar menus existentes
    chrome.contextMenus.removeAll(() => {
        // Similar Pages (principal)
        chrome.contextMenus.create({
            id: 'similar-pages',
            title: '🌍 Encontrar Páginas Similares',
            contexts: ['page']
        });

        // Separator
        chrome.contextMenus.create({
            id: 'separator1',
            type: 'separator',
            contexts: ['page']
        });

        // Herramientas de texto (solo en selección)
        chrome.contextMenus.create({
            id: 'text-encode-url',
            title: '🔗 Codificar URL',
            contexts: ['selection']
        });
    });
}
```

**Key Points:**
- Remove all existing menus first
- Use emoji in titles for visual appeal
- Appropriate contexts: `page`, `selection`, `image`
- Separators for grouping
- Descriptive IDs matching handler logic

### Chrome Storage Session Pattern
**Frequency:** Medium (temporary data)

```javascript
// Save URL for popup
await chrome.storage.session.set({ 'similar-pages-url': tab.url });

// Retrieve in popup
const data = await chrome.storage.session.get('similar-pages-url');
const url = data['similar-pages-url'];
```

**Key Points:**
- Use for temporary cross-context data
- Doesn't persist after browser restart
- Faster than local storage
- Good for passing data to popups

## Web Application Patterns

### Service Worker Registration
**Frequency:** Once per page load

```javascript
async function registerSW() {
    if (!isServiceWorkerSupported()) {
        console.log('[SW] Service Workers no soportados');
        return null;
    }

    if (!isSecureContext()) {
        console.warn('[SW] Service Workers requieren HTTPS');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });

        console.log('[SW] Service Worker registrado:', registration.scope);

        // Manejar actualizaciones
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateAvailable();
                    }
                });
            }
        });

        return registration;

    } catch (error) {
        console.error('[SW] Error registrando:', error);
        return null;
    }
}
```

**Key Points:**
- Check support and security context first
- Log with `[SW]` prefix for filtering
- Handle update notifications
- Return null on failure (graceful degradation)

### Analytics Integration Pattern
**Frequency:** High (all tools)

```javascript
function handleImageUpload(file) {
    // Track cuando usuario carga archivo
    if (window.analytics) {
        window.analytics.trackToolUsed({
            'file_type': file.type,
            'file_size': file.size
        });
    }
    
    // ... resto del código de carga ...
}

function resizeImage(width, height) {
    if (window.analytics) {
        window.analytics.trackAction('processing_started', {
            'target_width': width,
            'target_height': height
        });
    }
    
    try {
        // ... código de redimensionamiento ...
        
        if (window.analytics) {
            window.analytics.trackAction('processing_completed', {
                'output_width': outputWidth,
                'output_height': outputHeight
            });
        }
    } catch (error) {
        if (window.analytics) {
            window.analytics.trackError('resize_failed', error.message);
        }
        throw error;
    }
}
```

**Key Points:**
- Always check `window.analytics` exists
- Track tool usage on first interaction
- Track actions with descriptive names
- Track errors in catch blocks
- Include relevant metadata

### SEO Utilities Pattern
**Frequency:** Medium (SEO tools)

```javascript
function extractMetaTags(doc = document) {
    const metaTags = {};
    
    // Basic meta tags
    metaTags.title = doc.title || '';
    metaTags.description = doc.querySelector('meta[name="description"]')?.content || '';
    metaTags.canonical = doc.querySelector('link[rel="canonical"]')?.href || '';
    
    // Open Graph
    metaTags.og = {};
    doc.querySelectorAll('meta[property^="og:"]').forEach(meta => {
        const property = meta.getAttribute('property').replace('og:', '');
        metaTags.og[property] = meta.content;
    });
    
    return metaTags;
}
```

**Key Points:**
- Default to `document` parameter
- Use optional chaining `?.` for safety
- Fallback to empty string `|| ''`
- Group related data in objects
- Iterate with forEach for collections

## Error Handling

### Standard Error Pattern
**Frequency:** Very high (all async operations)

```javascript
async function operation() {
    try {
        // ... operation code ...
        return { success: true, data: result };
    } catch (error) {
        console.error('❌ Error en operación:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
```

**Key Points:**
- Always return structured objects
- Include `success` boolean flag
- Return error message, not error object
- Log with emoji prefix for visibility
- Never throw from top-level handlers

### User-Facing Error Pattern
**Frequency:** High (UI interactions)

```javascript
try {
    await processFile(file);
    showNotification('Archivo procesado correctamente', 'success');
} catch (error) {
    console.error('❌ Error procesando archivo:', error);
    showNotification('Error: ' + error.message, 'error');
}
```

**Key Points:**
- Show success notifications
- Show user-friendly error messages
- Always log technical details
- Use notification system consistently

## Logging Standards

### Console Logging Pattern
**Frequency:** Very high (debugging and monitoring)

```javascript
console.log('🚀 FastTools Extension instalado:', details.reason);
console.log('📋 Context menu click:', info.menuItemId);
console.log('📨 Message received:', request.action);
console.log('✅ FastTools inicializado correctamente');
console.error('❌ Error en context menu:', error);
console.warn('[SW] Service Workers requieren HTTPS');
```

**Emoji Prefixes:**
- 🚀 Initialization/startup
- ✅ Success/completion
- ❌ Errors
- 📋 User actions
- 📨 Messages/communication
- 🔄 Updates/sync
- 📊 Analytics/data
- 🎯 Important events
- 💥 Critical errors

**Key Points:**
- Always use emoji prefixes for visual scanning
- Include relevant context data
- Use appropriate log level (log/warn/error)
- Prefix Service Worker logs with `[SW]`

## Testing Standards

### Test Structure
**Frequency:** All test files

```javascript
function testSuiteName() {
    log(colors.cyan, '\\n📁 Testing Suite Name...\\n');

    const testCases = [
        'web/index.html',
        'web/sitemap.xml'
    ];

    testCases.forEach(testCase => {
        const result = performTest(testCase);
        testResult(
            `Test description: ${testCase}`,
            result,
            `Error message if failed`
        );
    });
}
```

**Key Points:**
- Group tests in suites with descriptive names
- Use colored output for readability
- Iterate over test cases
- Descriptive test names
- Clear error messages

### Test Reporting
**Frequency:** End of test runs

```javascript
// Summary
log(colors.magenta, '\\n' + '='.repeat(60));
log(colors.magenta, '📊 Test Summary');
log(colors.magenta, '='.repeat(60));

log(colors.cyan, `\\nTotal Tests: ${results.total}`);
log(colors.green, `Passed: ${results.passed}`);
log(colors.red, `Failed: ${results.failed}`);

const passRate = ((results.passed / results.total) * 100).toFixed(2);
log(colors.cyan, `\\nPass Rate: ${passRate}%`);

// Save report
const report = {
    timestamp: new Date().toISOString(),
    summary: {
        total: results.total,
        passed: results.passed,
        failed: results.failed,
        passRate: passRate + '%'
    },
    errors: results.errors
};

fs.writeFileSync('qa-report.json', JSON.stringify(report, null, 2));
```

**Key Points:**
- Visual separators with repeated characters
- Color-coded summary
- Calculate and display pass rate
- Save JSON report for CI/CD
- Include timestamp and all metrics

## Best Practices

### 1. Privacy First
- Never send user data to external servers
- Process everything client-side
- Clear user data on request
- Transparent about data usage

### 2. Progressive Enhancement
- Check feature support before using
- Graceful degradation when features unavailable
- Don't break core functionality

### 3. Performance
- Lazy load heavy libraries
- Cache API responses
- Minimize DOM operations
- Use Web Workers for heavy processing

### 4. Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

### 5. Security
- Validate all user input
- Sanitize HTML output
- Use CSP headers
- No inline scripts in extension

### 6. Maintainability
- DRY (Don't Repeat Yourself)
- Single Responsibility Principle
- Clear function names
- Comprehensive comments

### 7. User Experience
- Immediate feedback on actions
- Clear error messages
- Loading states
- Success confirmations

## Code Review Checklist

Before committing code, verify:

- [ ] Follows naming conventions
- [ ] Has section dividers
- [ ] Includes error handling
- [ ] Logs with emoji prefixes
- [ ] Returns structured objects
- [ ] Has descriptive comments
- [ ] No console.log in production (use proper logging)
- [ ] Analytics tracking added (if applicable)
- [ ] Tests written/updated
- [ ] No hardcoded credentials
- [ ] Responsive design (if UI)
- [ ] Accessibility considered
- [ ] Browser compatibility checked
- [ ] Performance optimized

## Common Pitfalls to Avoid

1. **Forgetting async/await:** Always await promises
2. **Missing error handling:** Every async operation needs try-catch
3. **Not checking analytics exists:** Always `if (window.analytics)`
4. **Inline scripts in extension:** Violates CSP
5. **Not returning true for async messages:** Extension messages need this
6. **Race conditions in offscreen docs:** Use promise tracking
7. **Not validating sender ID:** Security risk in message handlers
8. **Forgetting to track usage:** Analytics incomplete
9. **Not logging errors:** Debugging becomes impossible
10. **Hardcoding values:** Use constants or configuration

## File Templates

### JavaScript Module Template
```javascript
// ====================
// MODULE NAME
// ====================

// Brief description of module purpose

// ====================
// IMPORTS
// ====================

// Import statements here

// ====================
// CONSTANTS
// ====================

const CONFIG = {
    // Configuration here
};

// ====================
// MAIN FUNCTIONS
// ====================

async function mainFunction() {
    try {
        // Implementation
        return { success: true, data: result };
    } catch (error) {
        console.error('❌ Error:', error);
        return { success: false, error: error.message };
    }
}

// ====================
// HELPER FUNCTIONS
// ====================

function helperFunction() {
    // Implementation
}

// ====================
// EXPORT
// ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mainFunction, helperFunction };
}
```

### Test File Template
```javascript
// ====================
// TEST SUITE NAME
// ====================

const colors = {
    reset: '\\x1b[0m',
    green: '\\x1b[32m',
    red: '\\x1b[31m',
    cyan: '\\x1b[36m'
};

const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

function testResult(name, passed, message = '') {
    results.total++;
    if (passed) {
        results.passed++;
        console.log(`${colors.green}✅ ${name}${colors.reset}`);
    } else {
        results.failed++;
        console.log(`${colors.red}❌ ${name}${colors.reset}`);
        if (message) {
            results.errors.push({ test: name, error: message });
        }
    }
}

function runTests() {
    console.log(`${colors.cyan}\\n🧪 Running Tests...\\n${colors.reset}`);
    
    // Tests here
    
    // Summary
    const passRate = ((results.passed / results.total) * 100).toFixed(2);
    console.log(`\\nPass Rate: ${passRate}%`);
}

runTests();
```
