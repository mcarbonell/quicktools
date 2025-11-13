# FastTools - Project Context & Memory

## Project Owner
**Name:** Mario Raúl Carbonell Martínez  
**Role:** Project Lead & Director  
**Contact:** contact@fasttools.tools

## Project Overview
**Name:** FastTools (formerly QuickTools)  
**Domain:** fasttools.tools  
**Staging:** fasttools-nine.vercel.app  
**Purpose:** Privacy-focused online tools suite (42 tools) that process everything client-side  
**Status:** ✅ PRODUCTION READY (Noviembre 2025)

## Key Decisions & Preferences

### Branding
- **Name:** FastTools (rebranded from QuickTools in November 2025)
- **Primary Color:** #13a4ec (cyan/blue)
- **Typography:** Inter font family (400-900 weights)
- **Icons:** Material Symbols Outlined
- **Tagline:** "Tools in your browser" / "Herramientas en tu navegador"

### Technical Stack
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Framework:** Bootstrap 5.3.2 (minimal, custom CSS on top)
- **Hosting:** Vercel (Hobby plan - free)
- **Domain:** cdmon.com (€10.95/year)
- **Analytics:** Google Analytics 4 (G-9XTNQMQKE2)
- **PWA:** Service Worker v3.0.7
- **i18n:** Custom JSON-based system (EN/ES)

### Architecture Principles
1. **Privacy-First:** All processing client-side, no file uploads to servers
2. **No Framework Bloat:** Vanilla JS preferred over React/Vue
3. **Progressive Enhancement:** Works without JS for basic content
4. **Mobile-First:** Responsive design from smallest screen up
5. **Performance:** Lighthouse scores 90+ target
6. **Accessibility:** WCAG 2.1 AA compliance

### Design System
- **CSS Variables:** Defined in style-v2.css
- **Color Palette:** Primary (#13a4ec), gradients for hero/features
- **Spacing:** 4px base unit system
- **Border Radius:** 8px (md), 12px (lg), 16px (xl)
- **Shadows:** Layered elevation system
- **Animations:** fadeIn, fadeInUp, scaleIn, slideInLeft, scroll reveal
- **Transitions:** 300ms cubic-bezier(0.4, 0, 0.2, 1)

### Code Style
- **JavaScript:** ES6+, arrow functions, async/await, const/let
- **Naming:** camelCase (variables/functions), PascalCase (classes), kebab-case (files/CSS)
- **Indentation:** 4 spaces for JS, 2 spaces for JSON
- **Quotes:** Single quotes for JS, double quotes for HTML
- **Comments:** Section dividers with `// ====================`
- **Console Logs:** Emoji prefixes (🚀 init, ✅ success, ❌ error, etc.)

## Project Structure

### Key Directories
```
quicktools/
├── build/                  # 🏗️ Build configuration (NOT deployed)
│   ├── data/
│   │   └── fasttools-data.json    # Single source of truth
│   └── templates/          # HTML templates for generation
│       ├── base.html
│       ├── category-base.html
│       ├── index-base.html
│       └── tools-content/  # 115 tool content files
├── web/                    # 🌐 Production deployment (main artifact)
│   ├── index.html          # Homepage (EN) - root level
│   ├── es/                 # Spanish versions
│   ├── *.html              # 42 tool pages (EN) - root level, NO /tools/ prefix
│   ├── developers.html     # Category pages (8 categories)
│   ├── css/                # Styles (style.css, style-v2.css)
│   ├── js/                 # JavaScript modules
│   └── i18n/               # Translation files
├── extension/              # 🧩 Browser extension
│   └── data/
│       └── fasttools-data.json    # Synced from build/data/
├── scripts/                # 🛠️ Build scripts
│   ├── build-extension.js  # Copy data to extension
│   ├── generate-category-pages.js
│   └── bump-version.js
├── tests/                  # 🧪 Testing suite
└── .amazonq/rules/         # 🤖 Amazon Q context files
```

### Important Files
- **build/data/fasttools-data.json:** Single source of truth (toolCategories, audiences, tools)
- **package.json:** npm scripts (build:web, build:extension, build:local, test, serve)
- **vercel.json:** Deployment config (buildCommand: null, installCommand: null)
- **sitemap.xml:** SEO sitemap (42 tools + 8 categories × 2 languages = 100 URLs)
- **robots.txt:** Search engine directives
- **manifest.json:** PWA manifest
- **sw.js:** Service Worker v3.0.17

## Tools Inventory (42 Total)

**URL Structure:** Clean URLs without /tools/ prefix
- EN: `/lorem-ipsum-generator.html`
- ES: `/es/lorem-ipsum-generator.html`

### Image Tools (7)
1. Image Resizer
2. Convert Image Format (JPG/PNG/WebP)
3. Color Palette Generator
4. EXIF Viewer & Cleaner
5. Crop Image
6. Compress Image
7. Image to PDF

### Data Tools (5)
1. Format JSON
2. CSV ↔ JSON
3. YAML ↔ JSON
4. XML ↔ JSON
5. TOML ↔ JSON

### File Tools (4)
1. Extract Text from PDF
2. Merge PDFs
3. Split PDF
4. Compress PDF

### Converters (2)
1. PDF to Image
2. Image to PDF

### Text Tools (6)
1. Clean Text
2. Encode/Decode URL
3. Encode/Decode Base64
4. Encode/Decode HTML
5. Compare Texts (diff)
6. Lorem Ipsum Generator

### Utilities (5)
1. QR Generator
2. Password Generator
3. Hash Calculator (MD5, SHA-1, SHA-256, SHA-512)
4. Color Picker & Converter
5. Stopwatch & Timer

### AI Tools (6)
1. AI Chat (Google Gemini)
2. Summarize Text with AI
3. Improve Text with AI
4. Chat with PDF
5. Edit Image with AI
6. AI Translator

### SEO Tools (8) - NEW!
1. Meta Tags Analyzer
2. Heading Structure Checker
3. Robots.txt Validator
4. Sitemap Validator
5. Broken Links Checker
6. Open Graph Preview
7. Schema.org Validator
8. SEO Score Calculator

**Note:** SEO tools are promotional pages on web (CORS limitations), full functionality in browser extension.

## User Categories (8 Total)

1. **💻 Developers** (10 tools) - `/developers.html`
2. **🎨 Designers** (8 tools) - `/designers.html`
3. **✍️ Writers** (6 tools) - `/writers.html`
4. **📊 Data Analysts** (6 tools) - `/data-analysts.html`
5. **📱 Marketers** (8 tools) - `/marketers.html`
6. **⚡ Productivity** (8 tools) - `/productivity.html`
7. **🤖 AI Tools** (6 tools) - `/ai.html`
8. **🔍 SEO Specialists** (8 tools) - `/seo.html` - NEW!

## Development Workflow

### Commands
```bash
npm run build:web        # Generate web only (bump + clean + generate-site + categories)
npm run build:extension  # Copy fasttools-data.json to extension/data/
npm run build:local      # Build both web + extension
npm test                 # Run automated QA
npm run serve            # Local server on :8000
```

**IMPORTANT:** No `npm run build` script to prevent Vercel from running build. Files are pre-generated and committed.

### Git Workflow
- **Main branch:** Production-ready code
- **Commit style:** Conventional commits (feat:, fix:, docs:, etc.)
- **Auto-deploy:** Push to main → Vercel deploys automatically

### Testing
- **Automated QA:** tests/automated-qa.js (99.25% pass rate)
- **Manual Testing:** Browser testing, responsive checks
- **Performance:** PageSpeed Insights, Lighthouse
- **SEO:** Google Search Console monitoring

## Known Issues & Quirks

### Service Worker Cache
- **Current Version:** v3.0.11
- **Auto-versioning:** scripts/bump-version.js increments on each web build
- **User Fix:** Hard refresh (Ctrl+Shift+R) or clear site data

### DNS Propagation
- **Issue:** fasttools.tools may take 1-48h to propagate globally
- **Workaround:** Use fasttools-nine.vercel.app during propagation
- **Check:** dnschecker.org for propagation status

### Vercel Deployment
- **Solution:** buildCommand and installCommand set to null in vercel.json
- **Reason:** Files are pre-generated and committed, no build needed
- **Result:** Vercel simply serves static files from web/ directory

## Future Enhancements

### Short-term (Next 1-3 months)
- [x] SEO tools category (8 tools) - COMPLETED
- [x] Category pages by user profile (8 categories) - COMPLETED
- [x] Schema.org structured data (CollectionPage + BreadcrumbList) - COMPLETED
- [x] Implement SEO tools functionality in browser extension
- [ ] Dark mode toggle
- [ ] Blog section for SEO
- [ ] More languages (Portuguese, French, German, Italian, Russian, Japanese)

### Medium-term (3-6 months)
- [ ] Browser extension launch (Chrome Web Store, Firefox Add-ons)
- [ ] Implement SEO tools in extension (no CORS restrictions)
- [ ] Dead Links Checker (MVP)
- [ ] PWA install promotion
- [ ] API for developers

### Long-term (6-12 months)
- [ ] Tool marketplace (user-submitted tools)
- [ ] Collaboration features
- [ ] Advanced analytics dashboard
- [ ] White-label solution

## Recent Changes (Noviembre 2025)

### Build System Reorganization (Latest)
- Created `build/` directory as central configuration hub
- Moved `fasttools-data.json` from `extension/data/` to `build/data/`
- Moved templates from `web/templates/` to `build/templates/`
- Eliminated `web/data/` directory completely
- Created separate build scripts: `build:web`, `build:extension`, `build:local`
- All scripts now read from single source: `build/data/fasttools-data.json`
- Extension data synced via `scripts/build-extension.js`

### SEO Tools Implementation
- Added 8 SEO tools as promotional pages on web
- Tools require extension for full functionality (CORS bypass)
- Created new "SEO Specialists" user category
- Updated sitemap with 16 new URLs (8 tools × 2 languages)

### URL Structure Cleanup
- Removed `/tools/` prefix from all URLs
- Tools now at root level: `/tool-name.html` (EN) and `/es/tool-name.html` (ES)
- Updated tools-index-unified.json slugs (no more `tools/` prefix)
- Synced unified JSON between web/ and extension/

### Build System Improvements
- Renamed `npm run build` to `npm run build:local`
- Set buildCommand: null in vercel.json to prevent auto-build
- Files are pre-generated and committed
- Auto-versioning with scripts/bump-version.js

### Category System
- 8 user profile categories with dedicated pages
- Category badges on each tool page
- Schema.org CollectionPage for categories
- Schema.org BreadcrumbList for tools
- Custom 404 page with tool suggestions

## Extension-Specific Ideas

### Dead Links Checker (Priority: HIGH)
**Inspiration:** Mario's previous project dead-links.com (PHP crawler, lost domain)
**Implementation:** JavaScript-based link checker in browser extension
**Approach:**
- **Phase 1 (MVP):** Single page checker - analyzes current page only
  - Content script extracts all links from current page
  - Background worker checks each link (HEAD requests)
  - Popup shows results with status codes
  - Export report as CSV/JSON
  - **Time:** 4-6 hours development
  - **Monetization:** Free in extension

- **Phase 2 (Premium):** Full site crawler
  - Recursive crawling with depth limit
  - Complete site audit
  - Advanced reporting
  - **Monetization:** Paid version ($5-10/month) with dedicated web app

**Advantages over server-based:**
- No CORS issues (extension can make cross-origin requests)
- Zero server costs
- Inherits user authentication
- Privacy-focused (no URLs sent to external servers)
- Instant results

**Target users:**
- Webmasters checking their sites
- SEO auditors
- Content writers verifying links
- Developers doing QA

### SEO Tools Suite (Extension Context)
**Key advantage:** Extensions bypass CORS, enabling powerful SEO tools

**Potential tools:**
1. **Meta Tags Analyzer** - Extract and validate meta tags, Open Graph, Twitter Cards
2. **Heading Structure Checker** - Validate H1-H6 hierarchy
3. **Image Alt Text Audit** - Find images missing alt attributes
4. **Internal Link Analyzer** - Map internal linking structure
5. **Schema Markup Validator** - Check structured data
6. **Page Speed Insights** - Basic performance metrics
7. **Mobile-Friendly Test** - Responsive design checker
8. **Robots.txt Viewer** - Fetch and analyze robots.txt
9. **Sitemap Detector** - Find and validate sitemaps
10. **Canonical URL Checker** - Verify canonical tags

**Monetization strategy:**
- Basic tools free in extension (user acquisition)
- Advanced features premium ($10-20/month)
- Standalone web app for agencies ($50-100/month)

**Market opportunity:**
- SEO tools market is huge (Ahrefs, SEMrush charge $100+/month)
- Privacy-focused alternative
- Extension format is unique angle

## SEO Strategy

### Keywords
- **Primary:** online tools, browser tools, free online tools
- **Tool-specific:** json formatter online, image resizer, pdf converter
- **Long-tail:** free json formatter no upload, resize image without losing quality

### Backlink Strategy
- Submit to: Product Hunt, AlternativeTo, Slant, ToolFinder
- Content marketing: Blog posts, tutorials
- Social media: Reddit (r/webdev, r/tools), HackerNews

### Monitoring
- Google Search Console: Weekly checks
- Analytics: Daily traffic review
- Performance: Monthly audits

## Contact & Resources

### URLs
- **Production:** https://fasttools.tools
- **Staging:** https://fasttools-nine.vercel.app
- **Analytics:** https://analytics.google.com (G-9XTNQMQKE2)

### Key Files
- **build/data/fasttools-data.json:** Single source of truth (toolCategories, audiences, tools)
- **generate-site.js:** Main site generator (reads from build/data/)
- **scripts/generate-category-pages.js:** Category page generator
- **scripts/build-extension.js:** Syncs data to extension

---

**Last Updated:** Noviembre 2025  
**Project Status:** ✅ PRODUCTION READY  
**Total Tools:** 43  
**Total Categories:** 8  
**Service Worker:** v3.0.35  
**Build System:** build/ directory with fasttools-data.json as single source

## Contact & Resources

### URLs
- **Production:** https://fasttools.tools
- **Staging:** https://fasttools-nine.vercel.app
- **Repository:** github.com/mcarbonell/quicktools
- **Analytics:** https://analytics.google.com (G-9XTNQMQKE2)

### Documentation
- **PROJECT_COMPLETE.md:** Full project summary
- **LAUNCH_CHECKLIST.md:** Pre-launch verification
- **SEO_SETUP_GUIDE.md:** SEO configuration
- **NEXT_STEPS.md:** Roadmap and progress
- **README.md:** Project overview

### Support
- **Email:** contact@fasttools.tools
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions

## Session History

### Noviembre 2025 - Initial Development
- **Duration:** ~2 semanas
- **Completed:** Desarrollo acelerado
- **Result:** Production-ready site with 43 tools, 99.25% test pass rate

### Key Achievements
- ✅ Complete rebranding from QuickTools to FastTools
- ✅ Modern design system with animations
- ✅ Full EN/ES bilingual support
- ✅ SEO optimization (sitemap, meta tags, hreflang)
- ✅ Automated testing suite (134 tests)
- ✅ Service Worker v2.0.0 for offline functionality
- ✅ Google Analytics 4 integration
- ✅ Privacy-focused architecture (no server uploads)

## Working Style Preferences

### Communication
- **Language:** Spanish preferred, English when technical
- **Style:** Direct, efficient, minimal fluff
- **Pace:** Fast-paced, multiple tasks in parallel
- **Feedback:** Real-time testing and iteration

### Code Preferences
- **Minimal:** Only essential code, no over-engineering
- **Readable:** Self-documenting code over comments
- **Tested:** Automated tests for critical functionality
- **Documented:** Key decisions and architecture documented

### Decision Making
- **Pragmatic:** Best solution for the problem, not perfect solution
- **Data-driven:** Test and measure, then optimize
- **User-focused:** Privacy and UX over features
- **Cost-conscious:** Free/cheap solutions preferred

---

**Last Updated:** Noviembre 2025  
**Project Status:** ✅ PRODUCTION READY  
**Project Age:** < 2 semanas  
**Next Session:** Continued development and optimization
