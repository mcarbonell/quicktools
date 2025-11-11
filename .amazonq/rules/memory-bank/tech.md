# FastTools - Technology Stack

## Programming Languages

### JavaScript (ES6+)
- **Version:** ECMAScript 2015+
- **Usage:** All client-side logic, build scripts, tests
- **Features Used:**
  - Arrow functions
  - Async/await
  - Promises
  - Template literals
  - Destructuring
  - Modules (import/export)
  - Classes
  - Spread operator
  - Optional chaining
  - Nullish coalescing

### HTML5
- **Version:** HTML5
- **Usage:** All page structure and markup
- **Features Used:**
  - Semantic elements (header, nav, main, footer, article, section)
  - Canvas API for image processing
  - File API for file handling
  - LocalStorage/SessionStorage
  - Web Workers
  - Service Workers

### CSS3
- **Version:** CSS3
- **Usage:** All styling and animations
- **Features Used:**
  - CSS Grid
  - Flexbox
  - CSS Variables (custom properties)
  - Animations and transitions
  - Media queries
  - Transform and filter effects

## Frontend Framework & Libraries

### Bootstrap 5.3.2
- **Purpose:** UI framework for responsive design
- **Usage:** Grid system, components, utilities
- **Customization:** Custom CSS on top of Bootstrap
- **Components Used:**
  - Grid system
  - Cards
  - Buttons
  - Forms
  - Modals
  - Alerts
  - Navbar
  - Utilities

### PDF Processing
- **PDF.js** - Mozilla's PDF rendering library
  - Purpose: Extract text from PDFs
  - Usage: PDF to text tool
  
- **pdf-lib** - PDF manipulation library
  - Purpose: Create, merge, split PDFs
  - Usage: PDF utilities (merge, split, compress)

### Data Format Libraries
- **js-yaml** - YAML parser and serializer
  - Purpose: YAML ↔ JSON conversion
  - Usage: YAML-JSON tool

- **fast-xml-parser** - Fast XML parser
  - Purpose: XML ↔ JSON conversion
  - Usage: XML-JSON tool

- **@iarna/toml** - TOML parser
  - Purpose: TOML ↔ JSON conversion
  - Usage: TOML-JSON tool

### Image Processing
- **Canvas API** (Native)
  - Purpose: Image manipulation
  - Usage: Resize, crop, compress, convert images

- **Cropper.js** (Optional)
  - Purpose: Advanced image cropping
  - Usage: Image cropper tool

### Other Libraries
- **Material Symbols** - Google's icon font
  - Purpose: UI icons
  - Usage: Throughout the application

## Build System

### Node.js
- **Version:** 14+ (any modern version)
- **Purpose:** Build scripts and development tools
- **Package Manager:** npm

### Build Scripts
Located in `scripts/` directory:

1. **bump-version.js**
   - Increments version number in manifest files
   - Updates Service Worker version

2. **clean-build.js**
   - Removes old build artifacts
   - Prepares for fresh build

3. **generate-category-pages.js**
   - Generates category pages from templates
   - Creates EN and ES versions

4. **generate-tool-translations.js**
   - Generates translation files for tools
   - Syncs EN/ES content

5. **generate-tools-json.js**
   - Creates unified tool index
   - Generates EN/ES specific indexes

6. **update-html-templates.js**
   - Updates HTML templates with latest content
   - Applies changes across all tools

7. **update-js-translations.js**
   - Updates JavaScript translation files
   - Syncs with JSON translation sources

8. **fix-relative-paths.js**
   - Fixes relative path references
   - Ensures correct asset loading

### Main Build Script
Located at root: `generate-site.js`
- Orchestrates the build process
- Generates all pages from templates
- Applies translations
- Validates output

## Development Commands

### Installation
```bash
# Clone repository
git clone [repository-url]
cd quicktools

# Install dependencies
npm install
```

### Development
```bash
# Start local development server
npm run serve
# Opens http://localhost:8000

# Alternative: Python server
cd web
python -m http.server 8000
```

### Building
```bash
# Full build (recommended)
npm run build
# Runs: bump version → clean → generate site → generate categories

# Build only tools index
npm run build:tools

# Build only category pages
npm run build:categories

# Legacy build system
npm run build:old
```

### Testing
```bash
# Run automated QA suite (134 tests)
npm test

# Run legacy test suite
npm run test:old

# Run specific tests
node tests/csv-parser.test.js
node tests/pwa-validation.js
```

### Version Management
```bash
# Bump version number
npm run version:bump
```

### Cleaning
```bash
# Clean build artifacts
npm run clean
```

## PWA Technologies

### Service Worker
- **File:** `web/sw.js` and `web/js/service-worker.js`
- **Version:** v3.0.3
- **Strategy:** Cache-first for assets, network-first for pages
- **Features:**
  - Offline functionality
  - Asset caching
  - Background sync (planned)
  - Push notifications (planned)

### Web App Manifest
- **File:** `web/manifest.json`
- **Features:**
  - App name and description
  - Icons (SVG, multiple sizes)
  - Theme colors
  - Display mode (standalone)
  - Shortcuts to popular tools
  - Screenshots for app stores

### PWA Capabilities
- ✅ Installable on desktop and mobile
- ✅ Offline functionality
- ✅ App shortcuts
- ✅ Splash screen
- ✅ Theme color
- ⏳ Background sync (planned)
- ⏳ Push notifications (planned)

## Browser Extension Technologies

### Chrome Extension API (Manifest V3)
- **File:** `extension/manifest.json`
- **APIs Used:**
  - Storage API (chrome.storage)
  - Tabs API (chrome.tabs)
  - Context Menus API (chrome.contextMenus)
  - Runtime API (chrome.runtime)
  - Alarms API (chrome.alarms)
  - Permissions API

### Extension Components
- **Background Service Worker:** Long-running background tasks
- **Content Scripts:** Inject into web pages
- **Popup:** Quick access interface
- **Options Page:** Settings and preferences
- **New Tab Override:** Custom new tab page
- **Offscreen Documents:** Heavy processing

## Analytics & Tracking

### Google Analytics 4
- **Property ID:** G-9XTNQMQKE2
- **Implementation:** `web/js/analytics.js`
- **Features:**
  - Page views
  - Event tracking
  - User engagement
  - Privacy-focused (no PII)

### Cookie Consent
- **Implementation:** `web/js/cookie-consent.js`
- **Compliance:** GDPR compliant
- **Features:**
  - Cookie banner
  - User consent management
  - Analytics opt-in/opt-out

## Internationalization (i18n)

### Translation System
- **Engine:** Custom JSON-based system
- **Files:** `web/i18n/en.json`, `web/i18n/es.json`
- **Languages:** English (EN), Spanish (ES)
- **Implementation:** `web/i18n/i18n.js`

### Language Detection
- **Priority:**
  1. User preference (localStorage)
  2. URL path (`/es/` prefix)
  3. Browser language
  4. Default to English

### Translation Structure
```json
{
  "common": {
    "key": "value"
  },
  "tools": {
    "tool-name": {
      "title": "Tool Title",
      "description": "Tool description"
    }
  }
}
```

## Hosting & Deployment

### Vercel
- **Plan:** Hobby (free)
- **Features:**
  - Automatic deployments
  - HTTPS by default
  - CDN distribution
  - Zero configuration
  - Preview deployments

### Domain
- **Provider:** cdmon.com
- **Cost:** €10.95/year
- **DNS:** Configured for Vercel

### Deployment Configuration
- **File:** `vercel.json`
- **Settings:**
  - Build command: None (static site)
  - Output directory: `web/`
  - Redirects and rewrites configured
  - Headers for security and caching

## Development Tools

### Code Editor
- **Recommended:** VS Code
- **Extensions:**
  - ESLint
  - Prettier
  - Live Server
  - HTML CSS Support

### Browser DevTools
- **Chrome DevTools:** Primary development tool
- **Firefox DevTools:** Cross-browser testing
- **Lighthouse:** Performance and PWA audits

### Testing Tools
- **Node.js:** Test runner
- **Custom test suite:** `tests/automated-qa.js`
- **Browser tests:** `tests/web-tests.html`

## Version Control

### Git
- **Repository:** GitHub (private)
- **Branch Strategy:** Main branch for production
- **Commit Convention:** Conventional commits
  - `feat:` New features
  - `fix:` Bug fixes
  - `docs:` Documentation
  - `style:` Code style changes
  - `refactor:` Code refactoring
  - `test:` Test updates
  - `chore:` Maintenance tasks

## Performance Optimization

### Techniques Used
- **Minification:** CSS and JS minified for production
- **Lazy Loading:** Images and scripts loaded on demand
- **Code Splitting:** Separate JS files per tool
- **Caching:** Service Worker caching strategy
- **CDN:** Vercel's global CDN
- **Compression:** Gzip/Brotli compression

### Performance Targets
- **Lighthouse Score:** 90+ (all categories)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1

## Security

### Security Measures
- **HTTPS Only:** Enforced by Vercel
- **Content Security Policy:** Configured in headers
- **No Server Processing:** Client-side only = no server vulnerabilities
- **No Data Storage:** No user data stored on servers
- **Dependency Scanning:** Regular npm audit

### Privacy Features
- **No Tracking:** Minimal analytics, no PII
- **No Cookies:** Only for consent management
- **No File Uploads:** All processing local
- **No Registration:** No user accounts

## Browser Compatibility

### Supported Browsers
- **Chrome:** 80+ ✅
- **Firefox:** 75+ ✅
- **Safari:** 13+ ✅
- **Edge:** 80+ ✅
- **Mobile Browsers:** Modern versions ✅

### Polyfills
- **Not Required:** Modern browser features only
- **Graceful Degradation:** Fallbacks for older browsers

## External Services

### Google Services
- **Google Analytics 4:** Web analytics
- **Google Fonts:** Inter font family
- **Material Symbols:** Icon font
- **Google Gemini API:** AI tools (optional, user-provided key)

### CDN Resources
- **Bootstrap:** Via CDN
- **PDF.js:** Via CDN or local
- **Other libraries:** Bundled locally

## Development Environment

### System Requirements
- **OS:** Windows, macOS, or Linux
- **Node.js:** 14+ (any modern version)
- **Browser:** Chrome, Firefox, or Edge (latest)
- **RAM:** 4GB minimum
- **Disk Space:** 500MB for project

### Recommended Setup
- **Editor:** VS Code with extensions
- **Terminal:** Integrated terminal or external
- **Browser:** Chrome with DevTools
- **Git:** For version control

## Package.json Scripts Summary

```json
{
  "clean": "Clean build artifacts",
  "build": "Full build process",
  "build:old": "Legacy build system",
  "build:tools": "Generate tools index",
  "build:categories": "Generate category pages",
  "test": "Run automated QA",
  "test:old": "Run legacy tests",
  "serve": "Start local server",
  "version:bump": "Increment version"
}
```

## Dependencies

### Production Dependencies
- None (all libraries loaded via CDN or bundled)

### Development Dependencies
- **http-server:** ^14.1.1 (local development server)

### External Libraries (CDN/Bundled)
- Bootstrap 5.3.2
- PDF.js
- pdf-lib
- js-yaml
- fast-xml-parser
- @iarna/toml
- Cropper.js (optional)
