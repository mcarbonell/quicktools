# FastTools - Product Overview

## Project Identity

**Name:** FastTools (formerly QuickTools)  
**Domain:** https://fasttools.ai  
**Tagline:** "Herramientas online rápidas, seguras y sin registro. Todo se procesa en tu navegador."  
**Owner:** Mario Raúl Carbonell Martínez  
**Status:** ✅ Production Ready (November 2025)

## Value Proposition

FastTools is a privacy-first suite of 47 online tools that process everything client-side in the browser. No file uploads, no registration, no tracking - just instant, secure tools accessible from any device.

### Core Differentiators

1. **100% Privacy-Focused**: All processing happens locally in the browser - files never leave the user's device
2. **Zero Configuration**: No registration, no setup, no API keys required (except for premium AI features)
3. **Instant Access**: Tools load instantly and work offline via PWA Service Worker
4. **Bilingual Support**: Full EN/ES internationalization with custom i18n system
5. **Cross-Platform**: Web app + Browser extension with shared codebase
6. **AI-Powered**: 12 AI tools using Google Gemini, Nano Banana, and Chrome's local AI

## Product Offerings

### Web Application (47 Tools)

**Image Tools (7)**
- Image Resizer, Format Converter (JPG/PNG/WebP), Compressor, Cropper
- Color Palette Generator, EXIF Viewer/Cleaner, Image to PDF

**File Tools (4)**
- PDF Text Extractor, PDF Merger, PDF Splitter, PDF Compressor

**Converters (2)**
- PDF to Image, Image to PDF

**Data Tools (5)**
- JSON Formatter, CSV↔JSON, YAML↔JSON, XML↔JSON, TOML↔JSON

**Text Tools (6)**
- Text Cleaner, URL Encoder/Decoder, Base64 Encoder/Decoder
- HTML Encoder/Decoder, Text Diff Comparator, Lorem Ipsum Generator

**Utilities (5)**
- QR Generator, Password Generator, Hash Calculator (MD5/SHA)
- Color Picker/Converter, Stopwatch/Timer

**AI Tools (12)**
- AI Chat (Google Gemini), Text Summarizer, Text Improver
- Chat with PDF, Vision Chat, AI Translator
- Image Generator (Nano Banana), Image Editor (Nano Banana)
- Alt Text Generator, Audio Transcription, Image OCR, Meme Generator

**SEO Tools (8)**
- Meta Tags Analyzer, Heading Structure Checker
- Robots.txt Validator, Sitemap Validator, Broken Links Checker
- Open Graph Preview, Schema.org Validator, SEO Score Calculator

### Browser Extension

**Unique Features:**
- AI Smart Recommender: Analyzes browsing history with local Chrome AI to recommend similar sites
- Onboarding System: Automatic user profile inference from history + bookmarks
- Personalized New Tab: Top sites + AI recommendations
- SEO Tools: Full functionality without CORS limitations
- Context Menus: Quick access to tools from selected text
- Shared Storage: Unified API keys across all AI tools

**Technical Advantages:**
- Manifest V3 compliant
- Shared codebase with web app (build/shared/)
- No CORS restrictions for SEO tools
- Local AI processing with Chrome Gemini Nano

## Target Audiences

FastTools organizes tools by user profile with dedicated category pages:

1. **💻 Developers** (10 tools): JSON, CSV, YAML, XML, TOML, Base64, URL/HTML encoders, Hash calculator, Diff
2. **🎨 Designers** (8 tools): Image manipulation, format conversion, color tools, AI image generation/editing
3. **✍️ Writers** (6 tools): Text cleaning, comparison, Lorem Ipsum, AI summarization/improvement/chat
4. **📊 Data Analysts** (6 tools): Data format converters, PDF text extraction
5. **📱 Marketers** (8 tools): QR codes, image tools, color palettes, AI chat, SEO tools
6. **⚡ Productivity** (8 tools): Timer, password generator, QR, text cleaner, PDF utilities
7. **🤖 AI Enthusiasts** (12 tools): All AI-powered tools
8. **🔍 SEO Specialists** (8 tools): Complete SEO analysis toolkit

## Key Features

### Privacy & Security
- Client-side processing only
- No file uploads to servers
- No user tracking or analytics (optional Google Analytics)
- No registration required
- CSP compliant (no inline scripts)

### Performance
- PWA with Service Worker v3.0.35
- Offline functionality
- Lighthouse scores 90+ target
- Mobile-first responsive design
- Instant tool loading

### Developer Experience
- Vanilla JavaScript (no framework bloat)
- Bootstrap 5.3.2 for UI
- Custom CSS variables design system
- Automated testing suite (99.25% pass rate)
- Build system with shared code between web/extension

### Internationalization
- Full EN/ES support
- Custom JSON-based i18n system
- Tool-specific translations
- Clean URLs: `/tool-name.html` (EN), `/es/tool-name.html` (ES)

### SEO Optimization
- Individual pages for each tool
- Schema.org structured data (CollectionPage, BreadcrumbList)
- Sitemap with 100+ URLs
- Meta tags, Open Graph, Twitter Cards
- Category pages for user profiles

## Business Model

**Current:** Free with non-intrusive advertising  
**Future:** Freemium model with premium features
- Basic tools: Free forever
- Advanced AI features: Subscription ($5-10/month)
- Extension premium features: Sync, unlimited notes, exclusive tools
- White-label solution for agencies

## Competitive Advantages

1. **Privacy-First**: Unlike competitors (Smallpdf, iLovePDF), no files leave the device
2. **No Limits**: No file size restrictions, no daily limits, no paywalls for basic features
3. **Unique AI Features**: Local Chrome AI for recommendations and profile inference
4. **Extension + Web**: Dual platform with shared codebase
5. **SEO Tools**: Extension bypasses CORS for full functionality
6. **Open Source**: Transparent, auditable code

## Success Metrics

- **Tools:** 47 online tools
- **Languages:** 2 (EN/ES)
- **Test Coverage:** 99.25% (134 tests passing)
- **Service Worker:** v3.0.35
- **Pages Generated:** 100+ (tools + categories × languages)
- **Build System:** Unified with shared code architecture

## Future Roadmap

**Short-term (1-3 months)**
- Publish extension to Chrome Web Store
- Dark mode toggle
- Blog section for SEO
- More languages (PT, FR, DE, IT, RU, JA)

**Medium-term (3-6 months)**
- Dead Links Checker (MVP in extension)
- PWA install promotion
- API for developers
- Premium subscription launch

**Long-term (6-12 months)**
- Tool marketplace (user-submitted tools)
- Collaboration features
- Advanced analytics dashboard
- White-label solution for agencies

## Contact & Resources

- **Production:** https://fasttools.ai
- **Staging:** https://fasttools-nine.vercel.app
- **Repository:** github.com/mcarbonell/quicktools
- **Email:** contact@fasttools.ai
- **Analytics:** Google Analytics 4 (G-9XTNQMQKE2)
