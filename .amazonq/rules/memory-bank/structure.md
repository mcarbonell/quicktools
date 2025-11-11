# FastTools - Project Structure

## Repository Organization

```
quicktools/
├── build/                          # 🏗️ Todo centralizado aquí
│   ├── data/
│   │   ├── fasttools-data.json    # Single source of truth
│   │   └── site-config.json       # Configuración del sitio
│   ├── templates/                  # Templates HTML
│   └── scripts/                    # Todos los scripts de build
│       ├── generate-site.js
│       ├── generate-category-pages.js
│       ├── build-extension.js
│       ├── bump-version.js
│       └── clean-build.js
├── web/                            # 🌐 Solo archivos públicos
├── extension/                      # 🧩 Extensión
├── tests/                          # 🧪 Tests
├── local_docs/                     # 📚 Internal documentation
├── web_design/                     # 🎨 Design mockups and assets
├── .amazonq/rules/memory-bank/     # 🤖 AI context files
└── [config files]                  # Package.json, vercel.json, etc.
```

## Core Components

### 1. Web Application (`web/`)

**Purpose:** Production-ready web application deployed to fasttools.tools

**Structure:**
```
web/
├── index.html                      # Homepage with tool catalog
├── [category].html                 # Category pages (developers, designers, etc.)
├── 404.html                        # Custom 404 page
├── privacy.html                    # Privacy policy
├── manifest.json                   # PWA manifest
├── sw.js                          # Service Worker (root level)
├── sitemap.xml                    # SEO sitemap
├── robots.txt                     # Search engine directives
├── *.html                         # 41 tool pages (flat structure, NO /tools/ prefix)
│   ├── image-resizer.html
│   ├── json-formatter.html
│   └── [39 more tools].html
├── es/                            # Spanish versions
│   ├── index.html
│   ├── [category].html
│   └── *.html                     # Spanish tool pages
├── js/                            # JavaScript modules
│   ├── main.js                    # Common functionality
│   ├── service-worker.js          # PWA service worker
│   ├── analytics.js               # GA4 integration
│   ├── cookie-consent.js          # Cookie banner
│   ├── animations.js              # Scroll animations
│   ├── toast.js                   # Toast notifications
│   ├── tools/                     # Tool-specific JS
│   ├── lib/                       # Helper libraries
│   └── vendor/                    # External dependencies
├── css/                           # Stylesheets
│   ├── style.css                  # Main styles
│   ├── style-v2.css               # Modern design system
│   ├── cookie-banner.css          # Cookie consent styles
│   └── cropper.min.css            # Image cropper library
├── i18n/                          # Internationalization
│   ├── en.json                    # English translations
│   ├── es.json                    # Spanish translations
│   ├── i18n.js                    # Translation engine
│   ├── language-selector.js       # Language switcher
│   └── tools/                     # Tool-specific translations
├── icons/                         # PWA icons (SVG)
└── ads/                           # Ad configuration
    └── adsense.html               # AdSense snippet
```

**Key Characteristics:**
- Flat URL structure for tools (`/tool-name.html`, NO /tools/ prefix)
- Bilingual support (EN/ES) with `/es/` prefix for Spanish
- Category pages for user profiles (developers, designers, writers, etc.)
- PWA-ready with Service Worker and manifest
- SEO-optimized with sitemap and meta tags
- NO data/ or templates/ directories (moved to build/)

### 2. Browser Extension (`extension/`)

**Purpose:** Chrome/Firefox extension with 30+ productivity tools

**Structure:**
```
extension/
├── manifest.json                   # Extension Manifest V3
├── popup/                         # Extension popup
│   ├── popup.html                 # Main popup interface
│   ├── popup.js                   # Popup logic
│   ├── popup.css                  # Popup styles
│   ├── popup-simple.html          # Simplified version
│   └── popup-simple.js
├── newtab/                        # Custom new tab page
│   ├── newtab.html                # Full tool access
│   ├── newtab.js                  # New tab logic
│   ├── newtab.css                 # New tab styles
│   ├── newtab-simple.html         # Simplified version
│   └── newtab-simple.js
├── background/                    # Background service worker
│   ├── service-worker.js          # Main background script
│   ├── offscreen.html             # Offscreen document
│   └── offscreen.js               # Heavy processing
├── content/                       # Content scripts
│   ├── content-script.js          # Injected into pages
│   └── content-styles.css         # Injected styles
├── options/                       # Extension settings
│   ├── options.html               # Settings page
│   ├── options.js                 # Settings logic
│   └── options.css                # Settings styles
├── shared/                        # Shared utilities
│   ├── utils.js                   # Common functions
│   ├── tools-loader.js            # Tool loading logic
│   ├── i18n.js                    # Internationalization
│   └── styles.css                 # Shared styles
├── data/                          # Extension data
│   └── fasttools-data.json        # Tool catalog
└── icons/                         # Extension icons
    ├── icon-16x16.png
    ├── icon-32x32.png
    ├── icon-48x48.png
    └── icon-128x128.png
```

**Key Characteristics:**
- Manifest V3 compatible (modern Chrome/Firefox)
- Multiple entry points (popup, new tab, options)
- Background processing with Service Workers
- Content scripts for page interaction
- Shared utilities with web application

### 3. Testing Suite (`tests/`)

**Purpose:** Automated testing and validation

**Structure:**
```
tests/
├── automated-qa.js                # Main QA script (134 tests)
├── run-all-tests.js               # Test runner
├── pwa-validation.js              # PWA validation
├── service-worker.test.js         # Service Worker tests
├── csv-parser.test.js             # CSV parser tests
├── csv-detect.test.js             # CSV detection tests
├── debug-yaml.js                  # YAML debugging
├── validate-conversions.js        # Format conversion tests
├── validate-format-edgecases.js   # Edge case tests
├── validate-sw.js                 # Service Worker validation
├── web-tests.html                 # Browser-based tests
├── qa-report.json                 # Test results
├── test-report.json               # Detailed test report
└── README.md                      # Testing documentation
```

**Test Coverage:**
- File structure validation (100%)
- JavaScript syntax validation (100%)
- JSON file validation (100%)
- Parser tests (CSV, YAML) (100%)
- PWA validation (complete)
- Service Worker tests (complete)
- Overall pass rate: 99.25%

### 4. Build Directory (`build/`)

**Purpose:** Central configuration hub (NOT deployed)

**Structure:**
```
build/
├── data/
│   └── fasttools-data.json        # Single source of truth
└── templates/
    ├── base.html                  # Base tool template
    ├── category-base.html         # Category page template
    ├── index-base.html            # Homepage template
    └── tools-content/             # 115 tool content files
```

**fasttools-data.json structure:**
- `toolCategories`: 9 categories (image, data, text, utils, ai, files, converters, generators, seo)
- `audiences`: 8 user profiles with tool mappings
- `tools`: 41 tools with bilingual data

### 5. Build Scripts (`scripts/`)

**Purpose:** Automation and build tools

**Structure:**
```
scripts/
├── bump-version.js                # Version management
├── clean-build.js                 # Clean build artifacts
├── generate-category-pages.js     # Generate category pages
├── build-extension.js             # Sync data to extension
└── [other scripts]
```

**Build Process:**
1. `npm run build:web`: Bump version → clean → generate-site → generate-categories
2. `npm run build:extension`: Copy fasttools-data.json to extension/data/
3. `npm run build:local`: Run both build:web and build:extension

### 6. Documentation (`local_docs/`)

**Purpose:** Internal project documentation

**Key Documents:**
- `PROYECTO_QUICKTOOLS.md` - Main project documentation
- `ROADMAP_QUICKTOOLS.md` - Development roadmap
- `ANALISIS_TECNICO.md` - Technical analysis
- `ANALISIS_NEGOCIO.md` - Business analysis
- `ADD_NEW_TOOL_GUIDE.md` - Guide for adding tools
- `ANALYTICS_IMPLEMENTATION.md` - Analytics setup
- `I18N_IMPLEMENTATION_SUMMARY.md` - i18n system
- `IA_INTEGRATION_SUMMARY.md` - AI integration
- `EXTENSION_OPPORTUNITY.md` - Extension strategy
- `TODO.md` - Task tracking

## Architectural Patterns

### 1. Client-Side Processing Architecture

**Pattern:** All data processing happens in the browser
**Benefits:**
- Zero server costs
- Complete privacy
- Instant processing
- Unlimited scalability

**Implementation:**
- JavaScript APIs (Canvas, FileReader, etc.)
- Web Workers for heavy processing
- IndexedDB for local storage
- Service Workers for offline functionality

### 2. Progressive Web App (PWA)

**Pattern:** Web app with native-like capabilities
**Components:**
- Service Worker for offline caching
- Web App Manifest for installability
- Responsive design for all devices
- App shortcuts for quick access

**Cache Strategy:**
- Cache-first for static assets
- Network-first for dynamic content
- Fallback to offline page when network fails

### 3. Internationalization (i18n)

**Pattern:** JSON-based translation system
**Structure:**
- Language files (`en.json`, `es.json`)
- Translation engine (`i18n.js`)
- Language selector component
- URL-based language routing (`/es/` prefix)

**Features:**
- Dynamic content translation
- SEO-friendly URLs
- Automatic language detection
- Manual language switching

### 4. Component-Based Tool Structure

**Pattern:** Each tool is self-contained
**Structure:**
- HTML page (`tools/tool-name.html`)
- JavaScript module (`js/tools/tool-name.js`)
- Translation file (`i18n/tools/tool-name.json`)
- Template content (`templates/tools-content/tool-name.json`)

**Benefits:**
- Easy to add new tools
- Independent testing
- Modular maintenance
- Clear separation of concerns

### 5. Category-Based Navigation

**Pattern:** Tools organized by user profile
**Categories:**
- Developers (10 tools)
- Designers (8 tools)
- Writers (6 tools)
- Data Analysts (6 tools)
- Marketers (6 tools)
- Productivity (8 tools)
- AI (5 tools)

**Implementation:**
- Dedicated category pages
- Audience mapping JSON
- Cross-linking between tools
- SEO optimization per category

## Data Flow

### Tool Execution Flow
1. User selects file/input
2. JavaScript reads data (FileReader API)
3. Processing happens in browser (Web Workers if heavy)
4. Result displayed immediately
5. User downloads/copies result
6. No data sent to server

### PWA Installation Flow
1. User visits site
2. Service Worker registers
3. Assets cached for offline use
4. Install prompt shown (if criteria met)
5. User installs as app
6. App works offline

### Translation Flow
1. User selects language or auto-detected
2. Language preference stored (localStorage)
3. Translation file loaded (`en.json` or `es.json`)
4. Content replaced dynamically
5. URL updated (`/es/` prefix for Spanish)
6. Preference persists across sessions

## Deployment Architecture

### Production Deployment
- **Platform:** Vercel (free tier)
- **Domain:** fasttools.tools (cdmon.com)
- **Deploy Source:** `web/` directory only
- **Build Command:** None (static site)
- **Auto-deploy:** Push to main branch

### Staging Environment
- **URL:** fasttools-nine.vercel.app
- **Purpose:** Testing before production
- **Same configuration as production**

### Extension Distribution
- **Chrome:** Chrome Web Store (planned)
- **Firefox:** Firefox Add-ons (planned)
- **Development:** Manual load from `extension/` directory

## File Naming Conventions

- **HTML files:** `kebab-case.html` (e.g., `image-resizer.html`)
- **JavaScript files:** `kebab-case.js` (e.g., `service-worker.js`)
- **CSS files:** `kebab-case.css` (e.g., `cookie-banner.css`)
- **JSON files:** `kebab-case.json` (e.g., `tools-index-unified.json`)
- **Directories:** `lowercase` or `kebab-case`

## Version Control

- **Main branch:** Production-ready code
- **Auto-deploy:** Vercel deploys on push to main
- **Commit style:** Conventional commits (feat:, fix:, docs:, etc.)
- **Version bumping:** Automated via `scripts/bump-version.js`
