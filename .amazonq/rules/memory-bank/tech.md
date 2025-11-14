# FastTools - Technology Stack

## Programming Languages

### JavaScript (ES6+)
- **Version:** ES2020+ features
- **Style:** Modern syntax with arrow functions, async/await, destructuring
- **Modules:** ES6 modules where supported, script tags for browser compatibility
- **Transpilation:** None (native browser support)

### HTML5
- **Semantic markup:** `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`
- **Accessibility:** ARIA labels, alt text, semantic structure
- **SEO:** Meta tags, Open Graph, Twitter Cards, Schema.org JSON-LD

### CSS3
- **Methodology:** Custom CSS with BEM-like naming
- **Variables:** CSS custom properties for theming
- **Layout:** Flexbox, Grid
- **Responsive:** Mobile-first with media queries
- **Animations:** CSS transitions, keyframe animations

## Frontend Technologies

### UI Framework
- **Bootstrap 5.3.2**
  - Minimal usage (grid, utilities, components)
  - Custom CSS overrides in `style-v2.css`
  - No JavaScript components (vanilla JS preferred)

### Design System
- **CSS Variables:** Defined in `web/css/style-v2.css`
- **Color Palette:** Primary (#13a4ec), gradients for hero/features
- **Typography:** Inter font family (400-900 weights)
- **Icons:** Material Symbols Outlined
- **Spacing:** 4px base unit system
- **Border Radius:** 8px (md), 12px (lg), 16px (xl)

### Client-Side Libraries

**PDF Processing:**
- `pdf.js` → PDF rendering and text extraction
- `pdf-lib` → PDF manipulation (merge, split, compress)

**Data Formats:**
- `js-yaml` → YAML parsing/serialization
- `fast-xml-parser` → XML parsing/serialization
- `@iarna/toml` → TOML parsing/serialization

**Image Processing:**
- Canvas API → Native browser image manipulation
- `cropper.js` → Image cropping UI

**Utilities:**
- `qrcode.js` → QR code generation
- Native Crypto API → Hash calculation

## AI Integration

### Google Gemini API
- **Models:** 
  - `gemini-2.0-flash-exp` → Text generation, chat
  - `gemini-2.5-flash-preview-0205` → Image generation
- **Features:** Chat, summarization, translation, text improvement
- **Storage:** API key in localStorage (web) or chrome.storage (extension)

### Chrome AI (Gemini Nano)
- **API:** `window.ai.languageModel` (Prompt API)
- **Access:** Via offscreen document in extension
- **Features:** Local AI inference, profile generation, recommendations
- **Fallback:** Hybrid strategy (Chrome AI → Gemini Cloud)

### Nano Banana API
- **Endpoints:** Image generation, image editing
- **Features:** Text-to-image, image-to-image with prompts
- **Storage:** API key in localStorage/chrome.storage

## Build System

### Node.js Scripts
- **Runtime:** Node.js 14+
- **Package Manager:** npm
- **Build Scripts:** Custom JavaScript in `build/scripts/`

### Build Commands

```bash
# Full build (web + extension + sync)
npm run build:local

# Web only (bump version + clean + generate + categories)
npm run build:web

# Extension only (sync fasttools-data.json)
npm run build:extension

# Sync shared JS files
npm run sync:shared

# Clean generated files
npm run clean

# Run tests
npm test

# Local development server
npm run serve
```

### Build Process

**1. Version Bump** (`build/scripts/bump-version.js`)
- Increments Service Worker version
- Updates `web/sw.js` cache version

**2. Clean** (`build/scripts/clean-build.js`)
- Removes generated HTML files
- Preserves static assets

**3. Generate Site** (`build/scripts/generate-site.js`)
- Reads `build/data/fasttools-data.json`
- Applies templates from `build/templates/`
- Generates 94 tool pages (47 × 2 languages)
- Outputs to `web/` and `web/es/`

**4. Generate Categories** (`build/scripts/generate-category-pages.js`)
- Creates 16 category pages (8 × 2 languages)
- Uses `build/templates/category-base.html`

**5. Sync Extension** (`build/scripts/build-extension.js`)
- Copies `build/data/fasttools-data.json` → `extension/data/`

**6. Sync Shared Files** (`scripts/sync-shared-files.js`)
- Copies `build/shared/*.js` → `web/js/lib/` + `web/js/tools/`
- Copies `build/shared/*.js` → `extension/shared/` + `extension/tools/ai/`

## Progressive Web App (PWA)

### Service Worker
- **Version:** v3.0.35 (auto-incremented)
- **Location:** `web/sw.js` (root level)
- **Strategy:** Cache-first for static assets, network-first for API calls
- **Cache:** HTML, CSS, JS, icons, vendor libraries

### Web App Manifest
- **Location:** `web/manifest.json`
- **Features:** 
  - App name, description, icons
  - Theme color (#13a4ec)
  - Display mode (standalone)
  - Start URL (/)

### Offline Support
- Cached pages work offline
- Tools function without network
- Service Worker handles cache updates

## Browser Extension

### Manifest V3
- **Location:** `extension/manifest.json`
- **Version:** 1.2.0
- **Permissions:** 
  - `storage` → API keys, user profile
  - `history` → Browsing history analysis
  - `bookmarks` → Bookmark analysis
  - `tabs` → Active tab access
  - `contextMenus` → Right-click menus
  - `offscreen` → Chrome AI access

### Extension APIs

**Chrome Storage API:**
```javascript
// Sync storage (cross-device)
chrome.storage.sync.set({ key: value });
chrome.storage.sync.get(['key']);

// Local storage (device-specific)
chrome.storage.local.set({ key: value });
chrome.storage.local.get(['key']);

// Session storage (temporary)
chrome.storage.session.set({ key: value });
```

**Chrome AI API:**
```javascript
// Check availability
const availability = await LanguageModel.availability();

// Create session
const session = await LanguageModel.create({
  systemPrompt: "You are a helpful assistant"
});

// Generate text
const result = await session.prompt("Hello");
```

**History API:**
```javascript
chrome.history.search({
  text: '',
  startTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
  maxResults: 10000
});
```

**Bookmarks API:**
```javascript
chrome.bookmarks.getTree();
```

## Internationalization (i18n)

### Translation System
- **Format:** JSON files (`en.json`, `es.json`)
- **Location:** `web/i18n/`
- **Engine:** Custom `i18n.js` script
- **Scope:** Global + tool-specific translations

### Translation Files
```json
{
  "nav.home": "Home",
  "nav.tools": "Tools",
  "footer.privacy": "Privacy Policy"
}
```

### Usage
```javascript
// Load translations
const i18n = new I18n('en');
await i18n.load();

// Translate
const text = i18n.t('nav.home'); // "Home"
```

## Testing

### Automated Testing
- **Framework:** Custom Node.js test runner
- **Location:** `tests/`
- **Coverage:** 99.25% pass rate (134 tests)

### Test Types
1. **Structure Tests:** File existence, valid JSON
2. **Parser Tests:** CSV, YAML, XML, TOML conversion
3. **Format Tests:** Edge cases, malformed data
4. **PWA Tests:** Service Worker, manifest validation
5. **Integration Tests:** End-to-end tool functionality

### Test Commands
```bash
# Run all tests
npm test

# Individual test files
node tests/csv-parser.test.js
node tests/pwa-validation.js

# Browser tests
# Open tests/web-tests.html in browser
```

## Development Tools

### Code Editor
- **Recommended:** VS Code
- **Extensions:** ESLint, Prettier, Live Server

### Local Server
```bash
# Node.js http-server
npm run serve
# → http://localhost:8000

# Python SimpleHTTPServer
cd web
python -m http.server 8000
```

### Browser DevTools
- **Chrome DevTools:** Debugging, network, performance
- **Extension DevTools:** chrome://extensions/ → Inspect views
- **Service Worker:** chrome://serviceworker-internals/
- **Chrome AI:** chrome://on-device-internals/

## Deployment

### Vercel (Web App)
- **Platform:** Vercel Hobby (free)
- **Domain:** fasttools.ai (cdmon.com registrar)
- **Config:** `vercel.json`
  - `buildCommand: null` (pre-generated files)
  - `installCommand: null`
  - `outputDirectory: web`
- **Deployment:** Auto-deploy on push to main branch

### Chrome Web Store (Extension)
- **Status:** Pending publication
- **Requirements:** 
  - Screenshots, promotional images
  - Privacy policy
  - Store listing description

## Analytics

### Google Analytics 4
- **Property ID:** G-9XTNQMQKE2
- **Location:** `web/js/analytics.js`
- **Features:** 
  - Page views
  - Tool usage events
  - User demographics
  - Traffic sources

### Cookie Consent
- **Location:** `web/js/cookie-consent.js`
- **Compliance:** GDPR-friendly banner
- **Storage:** User consent in localStorage

## Performance Optimization

### Strategies
1. **Lazy Loading:** Load tools on demand
2. **Code Splitting:** Separate vendor libraries
3. **Caching:** Service Worker cache-first strategy
4. **Minification:** Vendor libraries minified
5. **CDN:** Bootstrap, fonts from CDN

### Lighthouse Targets
- **Performance:** 90+
- **Accessibility:** 90+
- **Best Practices:** 90+
- **SEO:** 90+

## Security

### Content Security Policy (CSP)
- **Extension:** Strict CSP (no inline scripts)
- **Web:** Relaxed for third-party scripts (ads, analytics)

### Privacy
- **No tracking:** Optional analytics only
- **No uploads:** All processing client-side
- **No registration:** No user accounts
- **No cookies:** Minimal cookie usage (consent only)

## Dependencies

### Production Dependencies
None (all libraries loaded via CDN or vendored)

### Development Dependencies
```json
{
  "http-server": "^14.1.1"
}
```

## Version Control

### Git
- **Repository:** github.com/mcarbonell/quicktools
- **Branch:** main (production)
- **Commit Style:** Conventional commits (feat:, fix:, docs:)

### Versioning
- **Web:** Service Worker version (v3.0.35)
- **Extension:** Manifest version (1.2.0)
- **Semantic Versioning:** MAJOR.MINOR.PATCH

## Environment Variables

### Web App
None (all configuration in code)

### Extension
- API keys stored in chrome.storage
- No environment variables needed

## Browser Compatibility

### Minimum Versions
- Chrome 80+ (ES2020 support)
- Firefox 75+ (ES2020 support)
- Safari 13+ (ES2020 support)
- Edge 80+ (Chromium-based)

### Extension Compatibility
- Chrome 88+ (Manifest V3)
- Edge 88+ (Manifest V3)
- Firefox: Requires Manifest V2 port (future work)

## API Keys Required

### Optional (for AI features)
1. **Google Gemini API Key**
   - Free tier: 60 requests/minute
   - Required for: Chat, summarization, translation, text improvement
   
2. **Nano Banana API Key**
   - Required for: Image generation, image editing

3. **Chrome AI (Gemini Nano)**
   - No API key required
   - Built-in Chrome feature (experimental)
   - Requires Chrome 128+ with AI features enabled
