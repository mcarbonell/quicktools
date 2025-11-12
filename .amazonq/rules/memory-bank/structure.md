# FastTools - Project Structure

## Directory Overview

```
quicktools/                          # Project root
├── build/                           # 🏗️ Build configuration (NOT deployed)
├── web/                             # 🌐 Production web app (deployed)
├── extension/                       # 🧩 Browser extension
├── scripts/                         # 🛠️ Build automation scripts
├── tests/                           # 🧪 Testing suite
├── local_docs/                      # 📚 Internal documentation
├── web_design/                      # 🎨 Design mockups
└── .amazonq/rules/memory-bank/      # 🤖 AI context files
```

## Core Directories

### build/ - Build Configuration Hub
**Purpose:** Central source of truth for site generation (NOT deployed to production)

```
build/
├── data/
│   └── fasttools-data.json          # Single source of truth (tools, categories, audiences)
├── templates/
│   ├── base.html                    # Base template for all pages
│   ├── category-base.html           # Template for category pages
│   ├── index-base.html              # Homepage template
│   └── tools-content/               # 115+ tool content files (EN/ES)
├── scripts/
│   ├── generate-site.js             # Main site generator
│   ├── generate-category-pages.js   # Category page generator
│   ├── build-extension.js           # Extension data sync
│   ├── bump-version.js              # Auto-version incrementer
│   └── clean-build.js               # Clean generated files
└── shared/
    ├── gemini-api.js                # Shared Gemini API client
    ├── chat-ai.js                   # Shared chat functionality
    ├── image-generator-ai.js        # Shared image generator
    └── image-editor-ai.js           # Shared image editor
```

**Key Concepts:**
- **Single Source of Truth:** fasttools-data.json defines all tools, categories, and metadata
- **Template-Based Generation:** HTML pages generated from templates + data
- **Shared Code:** build/shared/ contains JS files used by both web and extension
- **Not Deployed:** This directory stays in repository, not in production

### web/ - Production Web Application
**Purpose:** Deployed static site (main artifact)

```
web/
├── index.html                       # Homepage (EN) - root level
├── es/                              # Spanish versions
│   ├── index.html                   # Homepage (ES)
│   └── *.html                       # 43 tool pages (ES)
├── *.html                           # 43 tool pages (EN) - root level
├── developers.html                  # Category pages (8 total)
├── designers.html
├── writers.html
├── data-analysts.html
├── marketers.html
├── productivity.html
├── ai.html
├── seo.html
├── 404.html                         # Custom 404 page
├── privacy.html                     # Privacy policy
├── manifest.json                    # PWA manifest
├── sitemap.xml                      # SEO sitemap
├── robots.txt                       # Search engine directives
├── sw.js                            # Service Worker (root)
├── css/
│   ├── style-v2.css                 # Main styles (current)
│   ├── style.css                    # Legacy styles
│   └── cookie-banner.css            # Cookie consent styles
├── js/
│   ├── main.js                      # Core functionality
│   ├── service-worker.js            # Service Worker logic
│   ├── analytics.js                 # Google Analytics integration
│   ├── animations.js                # Scroll animations
│   ├── cookie-consent.js            # Cookie banner
│   ├── toast.js                     # Toast notifications
│   ├── lib/                         # Shared libraries
│   │   └── gemini-api.js            # Gemini API client (synced from build/shared/)
│   ├── tools/                       # Tool-specific JS
│   │   ├── chat-ai.js               # Chat AI (synced from build/shared/)
│   │   ├── image-generator-ai.js    # Image generator (synced from build/shared/)
│   │   ├── image-editor-ai.js       # Image editor (synced from build/shared/)
│   │   └── *.js                     # Other tool scripts
│   └── vendor/                      # Third-party libraries
│       ├── pdf.min.js               # PDF.js
│       ├── pdf-lib.min.js           # PDF manipulation
│       ├── qrcode.min.js            # QR code generation
│       └── ...
├── i18n/
│   ├── en.json                      # English translations
│   ├── es.json                      # Spanish translations
│   ├── i18n.js                      # Translation engine
│   └── tools/                       # Tool-specific translations
├── icons/                           # PWA icons (SVG)
└── ads/
    └── adsense.html                 # AdSense configuration
```

**Key Concepts:**
- **Clean URLs:** Tools at root level (e.g., /json-formatter.html, /es/json-formatter.html)
- **No /tools/ Prefix:** Simplified URL structure for SEO
- **Bilingual:** Full EN/ES support with /es/ subdirectory
- **Static Generation:** All HTML pre-generated, no build on deploy
- **PWA Ready:** Service Worker, manifest, offline support

### extension/ - Browser Extension
**Purpose:** Chrome/Firefox extension with enhanced functionality

```
extension/
├── manifest.json                    # Extension Manifest V3
├── background/
│   ├── service-worker.js            # Background service worker
│   ├── offscreen.html               # Offscreen document for DOM operations
│   └── offscreen.js                 # Offscreen script
├── content/
│   ├── content-script.js            # Injected into web pages
│   └── content-styles.css           # Content script styles
├── popup/
│   ├── popup.html                   # Extension popup UI
│   ├── popup.js                     # Popup logic
│   ├── popup-simple.html            # Simplified popup
│   └── popup-simple.js              # Simplified popup logic
├── options/
│   ├── options.html                 # Settings page
│   ├── options.js                   # Settings logic
│   └── options.css                  # Settings styles
├── newtab/
│   ├── newtab.html                  # Custom new tab page
│   ├── newtab.js                    # New tab logic
│   ├── newtab-simple.html           # Simplified new tab
│   └── newtab-simple.js             # Simplified new tab logic
├── shared/
│   ├── gemini-api.js                # Gemini API client (synced from build/shared/)
│   ├── chat-ui.js                   # Chat UI component
│   ├── summarize-ui.js              # Summarize UI component
│   ├── improve-text-ui.js           # Improve text UI component
│   ├── translate-ui.js              # Translate UI component
│   ├── vision-chat-ui.js            # Vision chat UI component
│   ├── edit-image-ui.js             # Edit image UI component
│   ├── extension-adapter.js         # Environment detection
│   ├── tools-loader.js              # Dynamic tool loading
│   ├── i18n.js                      # Internationalization
│   └── utils.js                     # Utility functions
├── tools/
│   ├── ai/                          # AI tools (chat, summarize, etc.)
│   └── seo/                         # SEO tools (full functionality)
├── data/
│   └── fasttools-data.json          # Tool catalog (synced from build/data/)
└── icons/                           # Extension icons (16, 32, 48, 128)
```

**Key Concepts:**
- **Manifest V3:** Modern extension architecture
- **Shared Code:** Reuses code from build/shared/ via sync script
- **No CORS Limits:** Can access external resources unlike web version
- **Full SEO Tools:** Implements complete SEO tool functionality
- **Offline First:** All tools work without internet (except AI)

### scripts/ - Build Automation
**Purpose:** Build and sync scripts

```
scripts/
├── sync-shared-files.js             # Sync build/shared/ to web/ and extension/
└── build-extension-tools.js         # Build extension-specific tools
```

**Key Concepts:**
- **Sync Script:** Copies shared JS files to web/ and extension/
- **Single Source:** Ensures consistency across platforms
- **Automated:** Runs as part of build:local command

### tests/ - Testing Suite
**Purpose:** Automated testing and validation

```
tests/
├── automated-qa.js                  # Main QA suite (134 tests)
├── run-all-tests.js                 # Test runner
├── pwa-validation.js                # PWA validation
├── service-worker.test.js           # Service Worker tests
├── csv-parser.test.js               # CSV parser tests
├── validate-conversions.js          # Format conversion tests
├── validate-format-edgecases.js     # Edge case tests
├── web-tests.html                   # Browser-based tests
├── qa-report.json                   # QA results
└── test-report.json                 # Test results
```

**Key Concepts:**
- **99.25% Pass Rate:** High test coverage
- **Automated QA:** Runs on every build
- **PWA Validation:** Complete Service Worker testing
- **Browser Tests:** Interactive testing in browser

## Architectural Patterns

### Build System Architecture

**Flow:**
1. **Source:** build/data/fasttools-data.json (single source of truth)
2. **Templates:** build/templates/ (HTML templates)
3. **Generation:** build/scripts/generate-site.js (creates web/ pages)
4. **Sync:** scripts/sync-shared-files.js (distributes shared JS)
5. **Output:** web/ (deployed) + extension/ (packaged)

**Commands:**
```bash
npm run build:web        # Generate web pages
npm run build:extension  # Sync extension data
npm run sync:shared      # Sync shared JS files
npm run build:local      # Full build (all above)
```

### Shared Code Architecture

**Problem:** Code duplication between web and extension  
**Solution:** Centralized shared code in build/shared/

**Shared Files:**
- `gemini-api.js` - API client with environment detection
- `chat-ai.js` - Chat functionality
- `image-generator-ai.js` - Image generation
- `image-editor-ai.js` - Image editing

**Environment Detection:**
```javascript
const isExtension = typeof chrome !== 'undefined' && chrome.storage;
const Storage = isExtension ? ChromeGeminiStorage : GeminiStorage;
```

**Distribution:**
- `build/shared/` → `web/js/lib/` (gemini-api.js)
- `build/shared/` → `web/js/tools/` (tool scripts)
- `build/shared/` → `extension/shared/` (gemini-api.js)
- `build/shared/` → `extension/tools/ai/` (tool scripts)

### URL Structure

**Web:**
- EN: `/tool-name.html` (root level)
- ES: `/es/tool-name.html` (subdirectory)
- Categories: `/category-name.html` (root level)

**Examples:**
- `/json-formatter.html` (EN)
- `/es/json-formatter.html` (ES)
- `/developers.html` (category)
- `/es/developers.html` (category ES)

**No /tools/ Prefix:** Simplified for SEO and user experience

### Data Flow

**Tool Definition:**
```
build/data/fasttools-data.json
  ↓
build/scripts/generate-site.js
  ↓
web/*.html (generated pages)
  ↓
Vercel deployment
  ↓
https://fasttools.tools/tool-name.html
```

**Shared Code Flow:**
```
build/shared/*.js (source)
  ↓
scripts/sync-shared-files.js
  ↓
web/js/lib/*.js + web/js/tools/*.js
extension/shared/*.js + extension/tools/ai/*.js
  ↓
Used by both platforms
```

## Component Relationships

### Web Application Components
- **Homepage** → Lists all tools by category
- **Tool Pages** → Individual tool functionality
- **Category Pages** → Tools filtered by user profile
- **Service Worker** → Caching and offline support
- **Analytics** → Google Analytics 4 tracking
- **i18n System** → Bilingual support

### Extension Components
- **Background Service Worker** → Manages extension lifecycle
- **Content Scripts** → Interact with web pages
- **Popup** → Quick access to tools
- **Options** → User settings
- **New Tab** → Custom new tab with tools
- **Shared Code** → Reused from web version

### Build System Components
- **fasttools-data.json** → Defines all tools and metadata
- **Templates** → HTML structure
- **Generator Scripts** → Create pages from templates + data
- **Sync Scripts** → Distribute shared code
- **Version Bumper** → Auto-increment Service Worker version

## Key Files

### Configuration
- `package.json` - npm scripts and dependencies
- `vercel.json` - Deployment configuration (buildCommand: null)
- `manifest.json` - PWA manifest (web/) and Extension manifest (extension/)

### Data
- `build/data/fasttools-data.json` - Single source of truth
- `web/sitemap.xml` - SEO sitemap
- `web/robots.txt` - Search engine directives

### Core Scripts
- `build/scripts/generate-site.js` - Main site generator
- `build/scripts/generate-category-pages.js` - Category page generator
- `scripts/sync-shared-files.js` - Shared code distributor
- `build/scripts/bump-version.js` - Version incrementer

### Service Workers
- `web/sw.js` - PWA Service Worker (root)
- `web/js/service-worker.js` - Service Worker logic
- `extension/background/service-worker.js` - Extension Service Worker

## Deployment Architecture

### Web Deployment (Vercel)
- **Source:** web/ directory
- **Build:** None (pre-generated files)
- **Deploy:** Automatic on git push to main
- **URL:** https://fasttools.tools

### Extension Deployment
- **Source:** extension/ directory
- **Package:** Zip extension/ folder
- **Submit:** Chrome Web Store / Firefox Add-ons
- **Distribution:** Browser extension stores

## Version Management

- **Service Worker:** Auto-incremented on each build (v3.0.35)
- **Package:** Semantic versioning in package.json (1.0.0)
- **Git:** Conventional commits (feat:, fix:, docs:, etc.)
