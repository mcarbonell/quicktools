# FastTools - Technology Stack

## Programming Languages

### JavaScript (ES6+)
**Version:** ES2015+ (ES6, ES7, ES8 features)  
**Usage:** 100% of application logic  
**Style:** Vanilla JavaScript, no frameworks

**Key Features Used:**
- Arrow functions
- Async/await
- Promises
- Template literals
- Destructuring
- Spread operator
- Classes
- Modules (import/export)
- const/let (no var)

### HTML5
**Version:** HTML5  
**Usage:** Semantic markup, modern APIs

**Key Features Used:**
- Semantic elements (header, nav, main, footer, article, section)
- Canvas API (image processing)
- File API (client-side file handling)
- LocalStorage API
- Service Worker API
- Web App Manifest

### CSS3
**Version:** CSS3  
**Usage:** Styling, animations, responsive design

**Key Features Used:**
- CSS Variables (custom properties)
- Flexbox
- Grid
- Media queries
- Animations and transitions
- Transform
- Filter effects

## Frontend Framework

### Bootstrap 5.3.2
**Usage:** Base UI framework (minimal, custom CSS on top)  
**CDN:** Used via CDN (no npm install)

**Components Used:**
- Grid system
- Utilities (spacing, colors, typography)
- Forms
- Buttons
- Cards
- Modals
- Alerts

**Customization:**
- Custom CSS in style-v2.css overrides Bootstrap
- Custom color scheme (#13a4ec primary)
- Custom animations and transitions

## Libraries & Dependencies

### PDF Processing
- **PDF.js** - Mozilla's PDF renderer (text extraction, viewing)
- **pdf-lib** - PDF manipulation (merge, split, compress)

### Data Format Parsing
- **js-yaml** - YAML parser/serializer
- **fast-xml-parser** - XML parser/serializer
- **@iarna/toml** - TOML parser/serializer

### Image Processing
- **Canvas API** - Native browser API (resize, crop, convert, compress)
- **Cropper.js** - Image cropping UI

### Utilities
- **qrcode.js** - QR code generation
- **crypto-js** - Hash calculation (MD5, SHA-1, SHA-256, SHA-512)

### AI Integration
- **Google Gemini API** - AI chat, summarization, translation, image generation
- **Nano Banana API** - AI image generation and editing

### Development
- **http-server** - Local development server (npm package)

## Build System

### Node.js Scripts
**Version:** Node.js 14+  
**Package Manager:** npm

**Build Scripts:**
```json
{
  "clean": "node build/scripts/clean-build.js",
  "build:web": "node build/scripts/bump-version.js && npm run clean && node build/scripts/generate-site.js && node build/scripts/generate-category-pages.js",
  "build:extension": "node build/scripts/build-extension.js",
  "sync:shared": "node scripts/sync-shared-files.js",
  "build:local": "npm run build:web && npm run build:extension && npm run sync:shared",
  "test": "node tests/automated-qa.js",
  "serve": "npx http-server web -p 8000"
}
```

**Build Process:**
1. **bump-version.js** - Increment Service Worker version
2. **clean-build.js** - Remove old generated files
3. **generate-site.js** - Generate tool pages from templates
4. **generate-category-pages.js** - Generate category pages
5. **build-extension.js** - Sync data to extension
6. **sync-shared-files.js** - Distribute shared JS files

### Template Engine
**Custom:** Simple string replacement in Node.js  
**No Framework:** No Handlebars, Pug, or EJS - just string manipulation

**Template Variables:**
- `{{TOOL_NAME}}` - Tool name
- `{{TOOL_DESCRIPTION}}` - Tool description
- `{{TOOL_CONTENT}}` - Tool-specific HTML
- `{{LANG}}` - Language code (en/es)
- `{{VERSION}}` - Service Worker version

## Hosting & Deployment

### Vercel
**Plan:** Hobby (free)  
**Configuration:** vercel.json

```json
{
  "buildCommand": null,
  "installCommand": null,
  "outputDirectory": "web"
}
```

**Key Points:**
- No build on deploy (files pre-generated)
- Static file serving only
- Automatic HTTPS
- Global CDN
- Custom domain support

### Domain
**Registrar:** cdmon.com  
**Cost:** €10.95/year  
**DNS:** Configured to point to Vercel

## Progressive Web App (PWA)

### Service Worker
**Version:** v3.0.35 (auto-incremented)  
**Location:** web/sw.js (root) + web/js/service-worker.js (logic)

**Features:**
- Cache-first strategy for static assets
- Network-first for dynamic content
- Offline fallback
- Version-based cache invalidation

**Cache Strategy:**
```javascript
// Static assets: cache-first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### Web App Manifest
**Location:** web/manifest.json

**Configuration:**
```json
{
  "name": "FastTools",
  "short_name": "FastTools",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#13a4ec",
  "icons": [...]
}
```

## Browser Extension

### Manifest V3
**Location:** extension/manifest.json  
**Target:** Chrome, Edge, Firefox

**Key Permissions:**
- `storage` - Save user settings
- `activeTab` - Access current tab
- `contextMenus` - Right-click menus
- `offscreen` - Offscreen documents

**Architecture:**
- **Background Service Worker** - Persistent background logic
- **Content Scripts** - Inject into web pages
- **Popup** - Extension popup UI
- **Options** - Settings page
- **New Tab** - Custom new tab page

## Analytics

### Google Analytics 4
**Property ID:** G-9XTNQMQKE2  
**Implementation:** web/js/analytics.js

**Events Tracked:**
- Page views
- Tool usage
- File conversions
- Error events
- Performance metrics

**Privacy:**
- Cookie consent banner
- Anonymized IP
- No PII collection

## Internationalization (i18n)

### Custom JSON System
**Languages:** English (en), Spanish (es)  
**Location:** web/i18n/

**Structure:**
```
web/i18n/
├── en.json          # English translations
├── es.json          # Spanish translations
├── i18n.js          # Translation engine
└── tools/           # Tool-specific translations
```

**Usage:**
```javascript
// Load translations
const translations = await fetch('/i18n/en.json').then(r => r.json());

// Apply translations
document.querySelectorAll('[data-i18n]').forEach(el => {
  const key = el.getAttribute('data-i18n');
  el.textContent = translations[key];
});
```

## Testing

### Automated Testing
**Framework:** Custom Node.js test runner  
**Location:** tests/

**Test Suites:**
- **automated-qa.js** - Main QA suite (134 tests, 99.25% pass rate)
- **csv-parser.test.js** - CSV parsing tests
- **validate-conversions.js** - Format conversion tests
- **validate-format-edgecases.js** - Edge case tests
- **pwa-validation.js** - PWA validation
- **service-worker.test.js** - Service Worker tests

**Run Tests:**
```bash
npm test
# or
node tests/automated-qa.js
```

### Browser Testing
**Location:** tests/web-tests.html  
**Usage:** Open in browser for interactive testing

## Development Tools

### Local Development Server
```bash
# Serve web/ directory
npm run serve
# or
npx http-server web -p 8000

# Access at http://localhost:8000
```

### Code Editor
**Recommended:** VS Code with extensions:
- ESLint
- Prettier
- Live Server
- HTML CSS Support

### Version Control
**System:** Git  
**Repository:** GitHub  
**Branching:** Main branch (production-ready)

## Performance Optimization

### Techniques Used
- **Minification** - Vendor libraries minified
- **Lazy Loading** - Load tools on demand
- **Code Splitting** - Tool-specific JS files
- **Image Optimization** - SVG icons, optimized PNGs
- **Caching** - Service Worker caching strategy
- **CDN** - Vercel global CDN

### Lighthouse Targets
- **Performance:** 90+
- **Accessibility:** 90+
- **Best Practices:** 90+
- **SEO:** 90+

## Security

### Content Security Policy (CSP)
**Implementation:** Meta tags in HTML

**Directives:**
- `default-src 'self'`
- `script-src 'self' 'unsafe-inline'` (required for inline scripts)
- `style-src 'self' 'unsafe-inline'` (required for inline styles)

### Security Headers (Vercel)
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block"
}
```

### Privacy
- **No Server Uploads** - All processing client-side
- **No Tracking** - Minimal analytics, anonymized
- **No Cookies** - Except for consent banner
- **No Third-Party Scripts** - Except Google Analytics (opt-in)

## API Integrations

### Google Gemini API
**Purpose:** AI chat, summarization, translation  
**Authentication:** API key stored in localStorage  
**Endpoint:** https://generativelanguage.googleapis.com/v1beta/models/gemini-pro

### Nano Banana API
**Purpose:** AI image generation and editing  
**Authentication:** API key stored in localStorage  
**Endpoint:** https://api.nanobanana.com/v1/

## Development Commands

### Build Commands
```bash
# Full build (web + extension + sync)
npm run build:local

# Build web only
npm run build:web

# Build extension only
npm run build:extension

# Sync shared files only
npm run sync:shared

# Clean generated files
npm run clean
```

### Testing Commands
```bash
# Run all tests
npm test

# Run specific test
node tests/csv-parser.test.js

# Run PWA validation
node tests/pwa-validation.js
```

### Development Commands
```bash
# Start local server
npm run serve

# Install dependencies
npm install

# Update dependencies
npm update
```

### Git Commands
```bash
# Commit with conventional commits
git commit -m "feat: add new tool"
git commit -m "fix: resolve bug"
git commit -m "docs: update README"

# Push to deploy
git push origin main
```

## Environment Variables

**None required for web deployment** - All configuration in code

**Extension:**
- API keys stored in chrome.storage.local
- User preferences in chrome.storage.sync

## Browser Compatibility

### Minimum Versions
- **Chrome:** 80+
- **Firefox:** 75+
- **Safari:** 13+
- **Edge:** 80+
- **Mobile browsers:** Modern versions

### Polyfills
**None required** - Target modern browsers only

### Feature Detection
```javascript
// Check for required APIs
if ('serviceWorker' in navigator) {
  // Register Service Worker
}

if (window.File && window.FileReader && window.FileList && window.Blob) {
  // File API supported
}
```

## Code Quality

### Linting
**None configured** - Manual code review

### Formatting
**Style:**
- 4 spaces for JavaScript
- 2 spaces for JSON
- Single quotes for JS
- Double quotes for HTML

### Naming Conventions
- **Variables/Functions:** camelCase
- **Classes:** PascalCase
- **Files:** kebab-case
- **CSS:** kebab-case

## Documentation

### Code Comments
- Section dividers: `// ====================`
- Emoji prefixes: 🚀 init, ✅ success, ❌ error
- JSDoc for complex functions

### Project Documentation
- **README.md** - Project overview
- **local_docs/** - Detailed documentation
- **.amazonq/rules/memory-bank/** - AI context files
