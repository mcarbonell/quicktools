# QuickTools - Technology Stack

## Programming Languages
- **JavaScript (ES6+)**: Primary language for all client-side logic
- **HTML5**: Semantic markup with modern APIs (Canvas, File, Crypto)
- **CSS3**: Styling with responsive design and custom properties
- **JSON**: Configuration and translation files

## Core Technologies

### Frontend Framework
- **Vanilla JavaScript**: No framework dependencies for core functionality
- **Bootstrap 5.3.2**: UI components and responsive grid system
- **Custom CSS**: Additional styling in `style.css` and `style-new.css`

### Client-Side Libraries

#### PDF Processing
- **PDF.js**: Mozilla's PDF rendering library for viewing and text extraction
- **pdf-lib**: PDF creation, manipulation, merging, and splitting

#### Data Format Parsing
- **js-yaml**: YAML parsing and serialization
- **fast-xml-parser**: XML to JSON conversion and vice versa
- **@iarna/toml**: TOML format parsing and generation
- **PapaParse** (implied): CSV parsing and generation

#### Image Processing
- **Canvas API**: Native browser API for image manipulation
- **Cropper.js**: Image cropping functionality (`cropper.min.css`)

#### Utilities
- **QRCode.js** (implied): QR code generation
- **CryptoJS** (implied): Hash calculation (MD5, SHA-1, SHA-256, SHA-512)
- **diff** library (implied): Text comparison functionality

### PWA Technologies
- **Service Workers**: Offline caching and background sync
- **Web App Manifest**: PWA installation and configuration
- **Cache API**: Asset caching for offline functionality
- **IndexedDB** (potential): Client-side storage for larger data

### Browser Extension APIs
- **Chrome Extension API (Manifest V3)**: Extension functionality
- **Storage API**: Extension settings persistence
- **Context Menus API**: Right-click menu integration
- **Tabs API**: Tab management and interaction
- **Offscreen Documents**: Background processing capabilities

## Build System

### Node.js Scripts
- **Version**: Node.js 14+ (implied from package.json)
- **Package Manager**: npm (package-lock.json present)

### Build Commands
```bash
npm run build          # Generate site from templates (generate-site.js)
npm run build:old      # Legacy build system (generate-tools.js)
npm test               # Run test suite (run-all-tests.js)
npm run serve          # Local development server on port 8000
```

### Build Scripts
- **generate-site.js**: Main site generator from templates
- **generate-tools.js**: Legacy tool page generator
- **generate-tool-translations.js**: i18n file generation
- **update-html-templates.js**: Template synchronization
- **update-js-translations.js**: JS translation updates
- **create-icons.js**: Icon generation
- **create-pwa-icons.js**: PWA icon generation

## Development Tools

### Local Development
```bash
# HTTP Server (recommended)
npx http-server web -p 8000

# Python alternative
cd web && python -m http.server 8000

# Direct file access (limited functionality)
open web/index.html
```

### Testing Framework
- **Custom Test Runner**: `tests/run-all-tests.js`
- **Node.js Tests**: Unit tests for parsers and converters
- **Browser Tests**: `tests/web-tests.html` for UI testing
- **PWA Validation**: `tests/pwa-validation.js` for compliance

### Development Dependencies
```json
{
  "http-server": "^14.1.1"  // Local development server
}
```

## Browser Compatibility

### Minimum Versions
- Chrome 80+ (2020)
- Firefox 75+ (2020)
- Safari 13+ (2019)
- Edge 80+ (2020)
- Modern mobile browsers (iOS Safari 13+, Chrome Mobile 80+)

### Required Browser APIs
- **File API**: File reading and processing
- **Canvas API**: Image manipulation
- **Blob API**: File creation and download
- **Web Crypto API**: Hash generation
- **Service Workers**: PWA offline functionality
- **LocalStorage**: Settings persistence
- **Fetch API**: Resource loading

## Deployment Platforms

### Web Application
- **GitHub Pages**: Static hosting from `/web` folder
- **Netlify**: Automatic deployment with build commands
- **Vercel**: Edge network deployment
- **Any Static Host**: Cloudflare Pages, AWS S3, etc.

### Browser Extension
- **Chrome Web Store**: Chrome/Edge extension distribution
- **Firefox Add-ons**: Firefox extension distribution
- **Manual Installation**: Developer mode loading

## Configuration Files

### package.json
```json
{
  "name": "quicktools",
  "version": "1.0.0",
  "main": "generate-site.js",
  "license": "ISC"
}
```

### site-config.json
```json
{
  "domain": "quicktools.dev",
  "defaultLanguage": "en",
  "languages": ["en", "es"],
  "version": "1.0.0"
}
```

### web/manifest.json
PWA manifest with:
- App name and description
- Icons (72x72 to 512x512 SVG)
- Display mode: standalone
- Theme colors
- Shortcuts to popular tools

### extension/manifest.json
Extension manifest with:
- Manifest version: 3
- Permissions: storage, tabs, contextMenus
- Background service worker
- Content scripts
- Popup and options pages

## Third-Party Services

### Optional Integrations
- **Google Analytics**: Traffic tracking (configurable)
- **Google AdSense**: Ad monetization (configurable)
- **Google AI Studio API**: AI-powered tools (chat-ai, chat-pdf, improve-text)

### Privacy-First Approach
- No required external services
- No user tracking by default
- No file uploads to servers
- All processing client-side
- Optional analytics with user consent

## Performance Optimizations

### Caching Strategy
- Service Worker caches static assets
- Network-first for HTML pages
- Cache-first for CSS/JS/images
- Offline fallback pages

### Code Splitting
- Tool-specific JS loaded per page
- Vendor libraries loaded on demand
- Minimal shared dependencies

### Asset Optimization
- SVG icons for scalability
- Minified CSS (cropper.min.css)
- Lazy loading for tool scripts
- Efficient Canvas operations
