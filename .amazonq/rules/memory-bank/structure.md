# QuickTools - Project Structure

## Directory Organization

### Root Level
```
quicktools/
├── web/                    # Main web application (production deployment)
├── extension/              # Browser extension (Chrome/Firefox)
├── tests/                  # Test suite and validation
├── scripts/                # Build and automation scripts
├── local_docs/             # Internal documentation
├── tools_backup/           # Backup of tool implementations
├── web_design/             # Design mockups and prototypes
├── package.json            # Node.js dependencies
├── site-config.json        # Site-wide configuration
└── README.md               # Project documentation
```

### Web Application (`web/`)
**Primary deployment artifact - contains the complete web app**

```
web/
├── index.html              # Main landing page with tool catalog
├── privacy.html            # Privacy policy page
├── manifest.json           # PWA manifest
├── sitemap.xml             # SEO sitemap
├── sw.js                   # Service Worker for PWA
├── tools/                  # Individual tool pages
│   ├── ai/                 # AI-powered tools (chat-ai, chat-pdf, improve-text)
│   ├── image/              # Image processing tools (7 tools)
│   ├── files/              # PDF/file tools (6 tools)
│   ├── data/               # Data format converters (5 tools)
│   ├── text/               # Text utilities (6 tools)
│   └── utils/              # General utilities (4 tools)
├── js/                     # JavaScript modules
│   ├── main.js             # Common functionality
│   ├── service-worker.js   # PWA service worker logic
│   ├── cache-utils.js      # Caching utilities
│   ├── tools/              # Tool-specific JS (30+ files)
│   ├── lib/                # Helper libraries
│   └── vendor/             # Third-party libraries
├── css/                    # Stylesheets
│   ├── style.css           # Main styles
│   └── cropper.min.css     # Image cropper styles
├── i18n/                   # Internationalization
│   ├── en.json             # English translations (common)
│   ├── es.json             # Spanish translations (common)
│   ├── locales.json        # Language configuration
│   ├── i18n.js             # Translation engine
│   ├── language-selector.js # Language switcher
│   └── tools/              # Per-tool translations (30+ JSON files)
├── es/                     # Spanish version pages
│   ├── index.html          # Spanish landing page
│   ├── privacy.html        # Spanish privacy page
│   └── tools/              # Spanish tool pages (mirrors /tools/)
├── data/                   # Static data files
│   ├── tools-index-en.json # English tool catalog
│   └── tools-index-es.json # Spanish tool catalog
├── templates/              # HTML templates for generation
│   ├── base.html           # Base tool page template
│   ├── index-base.html     # Index page template
│   └── tools-content/      # Tool-specific content fragments
├── icons/                  # PWA icons (SVG, various sizes)
└── ads/                    # Ad integration files
```

### Browser Extension (`extension/`)
**Standalone browser extension with 30+ tools**

```
extension/
├── manifest.json           # Extension manifest (Manifest V3)
├── popup/                  # Extension popup UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── newtab/                 # Custom new tab page
│   ├── newtab.html
│   ├── newtab.js
│   └── newtab.css
├── options/                # Extension settings page
│   ├── options.html
│   ├── options.js
│   └── options.css
├── background/             # Background service worker
│   ├── service-worker.js   # Main background script
│   ├── offscreen.html      # Offscreen document for APIs
│   └── offscreen.js        # Offscreen processing
├── content/                # Content scripts
│   ├── content-script.js   # Injected page scripts
│   └── content-styles.css  # Injected styles
└── icons/                  # Extension icons (16, 32, 48, 128px)
```

### Testing Infrastructure (`tests/`)
```
tests/
├── run-all-tests.js        # Main test runner
├── csv-parser.test.js      # CSV parsing tests
├── debug-yaml.js           # YAML debugging
├── pwa-validation.js       # PWA compliance tests
├── service-worker.test.js  # Service Worker tests
├── validate-conversions.js # Data conversion tests
├── web-tests.html          # Browser-based test UI
└── test-report.json        # Test results output
```

### Build Scripts (`scripts/`)
```
scripts/
├── generate-tool-translations.js  # Generate i18n files for tools
├── update-html-templates.js       # Update HTML templates
├── update-js-translations.js      # Update JS translation calls
└── fix-relative-paths.js          # Fix path references
```

## Core Components

### 1. Tool Architecture
Each tool follows a consistent pattern:
- **HTML Page**: Individual page in `/web/tools/{category}/{tool-name}.html`
- **JavaScript Module**: Logic in `/web/js/tools/{tool-name}.js`
- **Translation Files**: i18n in `/web/i18n/tools/{tool-name}.json`
- **Template Fragments**: Content in `/web/templates/tools-content/{tool-name}-*.html`

### 2. Internationalization System
- **Static HTML**: Language-specific pages in `/web/` (English) and `/web/es/` (Spanish)
- **Dynamic Content**: JSON translation files loaded by `i18n.js`
- **Language Selector**: Client-side switcher with localStorage persistence
- **Tool Translations**: Per-tool JSON files with UI strings

### 3. PWA Infrastructure
- **Service Worker**: Caches assets for offline use (`sw.js`, `service-worker.js`)
- **Manifest**: PWA configuration with icons, shortcuts, display mode
- **Cache Strategy**: Network-first for HTML, cache-first for assets
- **Offline Fallback**: Tools work without internet after first load

### 4. Build System
- **Template Generation**: `generate-site.js` builds pages from templates
- **Translation Generation**: `generate-tool-translations.js` creates i18n files
- **Static Site**: No server-side rendering, pure static HTML/CSS/JS

## Architectural Patterns

### Client-Side Processing
All tools process data in the browser using:
- **Canvas API**: Image manipulation (resize, crop, convert, compress)
- **PDF.js**: PDF rendering and text extraction
- **pdf-lib**: PDF creation and manipulation
- **Native JS**: Data format parsing and conversion (JSON, CSV, YAML, XML, TOML)
- **Web Crypto API**: Hash generation (MD5, SHA-256, SHA-512)

### Modular Design
- **Shared Utilities**: Common functions in `main.js` and `lib/`
- **Tool Isolation**: Each tool is self-contained with minimal dependencies
- **Vendor Libraries**: Third-party code isolated in `vendor/`
- **Template System**: Reusable HTML fragments for consistent UI

### Deployment Strategy
- **Web App**: Deploy `/web/` folder to static hosting (GitHub Pages, Netlify, Vercel)
- **Extension**: Package `/extension/` folder for Chrome Web Store / Firefox Add-ons
- **Multi-Language**: Serve both `/` (English) and `/es/` (Spanish) paths
- **CDN-Ready**: All assets are static and cacheable
