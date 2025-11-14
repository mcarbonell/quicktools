# FastTools - Project Structure

## Directory Organization

```
quicktools/                         # Project root
├── build/                          # Build configuration (NOT deployed)
├── web/                            # Production web app (deployed)
├── extension/                      # Browser extension
├── scripts/                        # Build automation
├── tests/                          # Testing suite
├── .amazonq/rules/memory-bank/     # AI context files
├── .local_docs/                    # Internal documentation
└── web_design/                     # Design assets
```

## Build System (`build/`)

**Purpose:** Central configuration hub - single source of truth for both web and extension

```
build/
├── data/
│   └── fasttools-data.json         # Single source of truth (tools, categories, audiences)
├── templates/                      # HTML templates for generation
│   ├── base.html                   # Base template for tool pages
│   ├── category-base.html          # Template for category pages
│   ├── index-base.html             # Homepage template
│   └── tools-content/              # 115+ tool-specific content files
│       ├── chat-ai-scripts.html
│       ├── image-generator-ai-content.html
│       └── [tool-name]-content.html
├── scripts/                        # Build scripts
│   ├── generate-site.js            # Main site generator
│   ├── generate-category-pages.js  # Category page generator
│   ├── build-extension.js          # Sync data to extension
│   ├── bump-version.js             # Auto-increment Service Worker version
│   └── clean-build.js              # Clean generated files
└── shared/                         # Shared JS files (web + extension)
    ├── gemini-api.js               # Gemini API client with env detection
    ├── chat-ai.js                  # Chat functionality
    ├── image-generator-ai.js       # Image generator
    └── image-editor-ai.js          # Image editor
```

**Key Concept:** `build/shared/` contains JS files that work in both web and extension environments through automatic environment detection.

## Web Application (`web/`)

**Purpose:** Production-ready static site deployed to Vercel

```
web/
├── index.html                      # Homepage (EN)
├── *.html                          # 47 tool pages (EN) - root level
├── developers.html                 # Category pages (8 total)
├── 404.html                        # Custom 404 page
├── privacy.html                    # Privacy policy
├── manifest.json                   # PWA manifest
├── sitemap.xml                     # SEO sitemap (100+ URLs)
├── robots.txt                      # Search engine directives
├── sw.js                           # Service Worker (root level)
├── es/                             # Spanish versions
│   ├── index.html
│   ├── *.html                      # 47 tool pages (ES)
│   └── [category].html             # 8 category pages (ES)
├── css/
│   ├── style-v2.css                # Main styles (design system)
│   ├── style.css                   # Legacy styles
│   └── cookie-banner.css
├── js/
│   ├── main.js                     # Main application logic
│   ├── service-worker.js           # SW registration
│   ├── analytics.js                # Google Analytics integration
│   ├── animations.js               # Scroll reveal animations
│   ├── lib/                        # Shared libraries
│   │   └── gemini-api.js           # Synced from build/shared/
│   ├── tools/                      # Tool-specific JS
│   │   ├── chat-ai.js              # Synced from build/shared/
│   │   ├── image-generator-ai.js
│   │   ├── image-editor-ai.js
│   │   └── [tool-name].js
│   └── vendor/                     # Third-party libraries
│       ├── pdf.min.js
│       ├── pdf-lib.min.js
│       ├── qrcode.min.js
│       └── js-yaml.min.js
├── i18n/                           # Internationalization
│   ├── en.json                     # English translations
│   ├── es.json                     # Spanish translations
│   ├── i18n.js                     # Translation engine
│   └── tools/                      # Tool-specific translations
│       ├── chat-ai-en.json
│       └── chat-ai-es.json
└── icons/                          # PWA icons (SVG)
    ├── icon-192x192.svg
    └── icon-512x512.svg
```

**URL Structure:**
- EN: `/tool-name.html` (root level, no `/tools/` prefix)
- ES: `/es/tool-name.html`
- Categories: `/developers.html`, `/es/developers.html`

## Browser Extension (`extension/`)

**Purpose:** Chrome/Firefox extension with AI features and SEO tools

```
extension/
├── manifest.json                   # Extension Manifest V3
├── background/                     # Service worker and offscreen docs
│   ├── service-worker.js           # Main background script
│   ├── ai-offscreen.js             # Chrome AI access (offscreen doc)
│   ├── ai-offscreen.html
│   ├── history-analyzer.js         # Analyze browsing history
│   ├── bookmarks-analyzer.js       # Analyze bookmarks
│   └── profile-manager.js          # User profile CRUD
├── content/                        # Content scripts
│   ├── content-script.js           # Injected into web pages
│   └── content-styles.css
├── popup/                          # Extension popup
│   ├── popup.html                  # Main popup
│   ├── popup.js
│   ├── similar-pages.html          # Similar pages feature
│   └── similar-pages.js
├── options/                        # Settings page
│   ├── options.html                # Options UI
│   ├── options.js                  # Settings logic + profile editor
│   └── options.css
├── newtab/                         # Custom new tab page
│   ├── newtab.html                 # New tab UI
│   ├── newtab.js                   # Top sites + AI recommendations
│   └── newtab.css
├── onboarding/                     # First-run experience
│   ├── setup.html                  # Onboarding wizard (4 screens)
│   ├── setup.js                    # Profile inference logic
│   └── setup.css
├── shared/                         # Shared code
│   ├── gemini-api.js               # Synced from build/shared/
│   ├── chrome-ai-apis.js           # Chrome AI wrapper
│   ├── hybrid-ai.js                # Chrome AI + Gemini fallback
│   ├── profile-inference.js        # AI profile inference
│   ├── utils.js                    # Utility functions
│   └── i18n.js                     # Translation helper
├── tools/                          # Tool implementations
│   ├── ai/                         # AI tools
│   │   ├── chat-ai.html
│   │   ├── chat-ai.js              # Synced from build/shared/
│   │   ├── image-generator-ai.html
│   │   └── image-editor-ai.html
│   └── seo/                        # SEO tools
│       ├── meta-tags-analyzer.html
│       ├── broken-links-checker.html
│       └── seo-utils.js
├── data/
│   └── fasttools-data.json         # Synced from build/data/
└── icons/                          # Extension icons
    ├── icon-16x16.png
    ├── icon-48x48.png
    └── icon-128x128.png
```

**Key Features:**
- AI Smart Recommender (similar pages based on history)
- Onboarding with automatic profile inference
- Personalized chat with user profile context
- SEO tools without CORS limitations

## Scripts (`scripts/`)

**Purpose:** Build automation and synchronization

```
scripts/
├── sync-shared-files.js            # Sync build/shared/ to web/ and extension/
└── build-extension-tools.js        # Build extension-specific tools
```

**Build Flow:**
1. `npm run build:web` → Generate web pages from templates
2. `npm run build:extension` → Sync fasttools-data.json to extension
3. `npm run sync:shared` → Sync shared JS files to web and extension
4. `npm run build:local` → Run all three in sequence

## Tests (`tests/`)

**Purpose:** Automated QA and validation

```
tests/
├── automated-qa.js                 # Main QA suite (134 tests)
├── run-all-tests.js                # Test runner
├── csv-parser.test.js              # CSV parsing tests
├── debug-yaml.js                   # YAML debugging
├── pwa-validation.js               # PWA validation
├── service-worker.test.js          # SW tests
├── validate-conversions.js         # Format conversion tests
├── web-tests.html                  # Browser-based test UI
└── qa-report.json                  # Test results
```

**Test Coverage:** 99.25% pass rate (134 tests)

## Architectural Patterns

### 1. Shared Code Architecture

**Problem:** Avoid code duplication between web and extension  
**Solution:** Single source in `build/shared/` with environment detection

```javascript
// Automatic environment detection
const isExtension = typeof chrome !== 'undefined' && chrome.storage;
const Storage = isExtension ? ChromeGeminiStorage : GeminiStorage;
```

**Distribution:**
- `build/shared/gemini-api.js` → `web/js/lib/` + `extension/shared/`
- `build/shared/chat-ai.js` → `web/js/tools/` + `extension/tools/ai/`

### 2. Template-Based Generation

**Problem:** Maintain 100+ HTML pages with consistent structure  
**Solution:** Templates + data-driven generation

- `build/data/fasttools-data.json` → Single source of truth
- `build/templates/base.html` → Base template
- `build/templates/tools-content/` → Tool-specific content
- `build/scripts/generate-site.js` → Generator script

### 3. Progressive Web App (PWA)

**Components:**
- `web/manifest.json` → App manifest
- `web/sw.js` → Service Worker (v3.0.35)
- `web/js/service-worker.js` → SW registration
- Auto-versioning via `build/scripts/bump-version.js`

### 4. Internationalization (i18n)

**Strategy:** Static generation with JSON translations

- `web/i18n/en.json` + `web/i18n/es.json` → Base translations
- `web/i18n/tools/` → Tool-specific translations
- `web/i18n/i18n.js` → Translation engine
- URL structure: `/tool.html` (EN), `/es/tool.html` (ES)

### 5. Category System

**Organization:** Tools grouped by user profile

- 8 category pages (developers, designers, writers, etc.)
- Schema.org CollectionPage for categories
- Schema.org BreadcrumbList for tools
- Category badges on each tool page

### 6. Extension Architecture

**Pattern:** Manifest V3 with offscreen documents

- Service Worker → Background logic
- Offscreen Document → Chrome AI access (window.ai)
- Content Scripts → Page interaction
- Popup/Options/NewTab → UI components
- Shared storage → Unified API keys

## Data Flow

### Build Process
```
build/data/fasttools-data.json
    ↓
build/scripts/generate-site.js
    ↓
web/*.html (47 tools × 2 languages = 94 pages)
web/[category].html (8 categories × 2 languages = 16 pages)
    ↓
Vercel deployment (web/ folder only)
```

### Shared Code Sync
```
build/shared/*.js
    ↓
scripts/sync-shared-files.js
    ↓
web/js/lib/ + web/js/tools/
extension/shared/ + extension/tools/ai/
```

### Extension Data Sync
```
build/data/fasttools-data.json
    ↓
build/scripts/build-extension.js
    ↓
extension/data/fasttools-data.json
```

## Key Files

### Configuration
- `package.json` → npm scripts, dependencies
- `vercel.json` → Deployment config (buildCommand: null)
- `.gitignore` → Git exclusions
- `.vercelignore` → Vercel exclusions

### Documentation
- `README.md` → Main project documentation
- `.local_docs/` → Internal documentation
- `.amazonq/rules/memory-bank/` → AI context files
- `extension/README.md` → Extension documentation

### Data
- `build/data/fasttools-data.json` → Single source of truth
- `web/sitemap.xml` → SEO sitemap
- `web/robots.txt` → Search engine directives

## Deployment Strategy

**Web App:**
- Source: `web/` folder only
- Platform: Vercel
- Domain: fasttools.ai
- Build: Pre-generated files (no build command)

**Extension:**
- Source: `extension/` folder
- Platform: Chrome Web Store (pending)
- Distribution: Manual load for development

**Testing:**
- Local server: `npm run serve` (port 8000)
- Tests: `npm test` (automated QA)
