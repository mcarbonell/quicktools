Conversation Summary
Data Unification : Consolidated all project data into single source of truth build/data/fasttools-data.json containing toolCategories, audiences, and tools. Eliminated duplicate files ( web/data/tools-index-unified.json, web/data/audience-mapping.json, extension/data/tools-index-unified.json).

Build System Reorganization : Moved all build-related files into build/ directory structure. Relocated scripts/ → build/scripts/, generate-site.js → build/scripts/, site-config.json → build/data/. Updated all path references in scripts and package.json.

URL Structure Fix : Corrected homepage tool links that still showed /tools/ prefix. Updated generate-site.js to dynamically translate tools from fasttools-data.json instead of reading pre-translated files.

PWA Cache Strategy Fix : Resolved Service Worker caching issue where homepage showed stale content. Removed index.html from STATIC_ASSETS to use network-first strategy instead of cache-first, ensuring users always see latest version.

Documentation Updates : Updated .amazonq/rules/memory-bank/project-context.md and structure.md to reflect new build/ directory structure, consolidated data files, and updated build commands.

Files and Code Summary
build/data/fasttools-data.json : Single source of truth containing three main sections: toolCategories (9 categories), audiences (8 user profiles with tool mappings), and tools (41 tools with bilingual data). Created by consolidating multiple JSON files.

build/scripts/generate-site.js : Main site generator. Updated to read from build/data/fasttools-data.json and build/data/site-config.json. Changed to dynamically translate tools instead of reading pre-translated files. Path references updated to use .. for new directory structure.

build/scripts/generate-category-pages.js : Category page generator. Updated to read audiences from fasttools-data.json instead of separate audience-mapping file. Path references updated for new structure.

build/scripts/build-extension.js : Copies build/data/fasttools-data.json to extension/data/fasttools-data.json. Path references updated.

build/scripts/bump-version.js : Auto-increments Service Worker version. Path to web/sw.js updated for new directory structure.

build/scripts/clean-build.js : Cleans old build artifacts. Path to web directory updated.

package.json : Updated all script paths to use build/scripts/ prefix. Scripts: build:web (generate web), build:extension (sync data to extension), build:local (both).

web/sw.js : Service Worker v3.0.13. Removed index.html from STATIC_ASSETS array to enable network-first caching strategy for homepage, ensuring users always get latest version.

extension/data/fasttools-data.json : Synced copy from build/data/, updated via npm run build:extension.

Key Insights
DECISION : All build configuration consolidated in build/ directory - includes data, templates, and scripts. This separates development/build files from production files in web/.

ARCHITECTURE : Single source of truth is build/data/fasttools-data.json. Extension syncs via build script. No per-language JSON files needed - translation happens dynamically in generate-site.js.

BUILD COMMANDS :

npm run build:web - Generate web only (bump version + clean + generate-site + generate-categories)

npm run build:extension - Copy fasttools-data.json to extension/data/

npm run build:local - Build both web and extension

PWA CACHING : Homepage uses network-first strategy (not cache-first) to ensure users always see latest content. Static assets (CSS, JS) still use cache-first for performance.

URL STRUCTURE : All tool URLs are clean without /tools/ prefix. EN tools at root ( /tool-name.html), ES tools in subfolder ( /es/tool-name.html).

PROJECT STRUCTURE :

build/ - Build configuration (NOT deployed)

web/ - Production files only (deployed to Vercel)

extension/ - Browser extension with synced data

Root directory is clean with minimal files

SERVICE WORKER : Currently v3.0.13. Auto-increments on each npm run build:web. Uses network-first for HTML pages, cache-first for static assets.

Most Recent Topic
Topic : PWA cache issue causing homepage to show stale content (missing SEO category button) and footer formatting problems

Progress : Identified that index.html was in Service Worker's STATIC_ASSETS array, causing it to use cache-first strategy. This meant users saw cached old version even after deployment. Removed index.html from STATIC_ASSETS to switch to network-first strategy.

Tools Used :

fsRead (web/index.html) : Verified footer HTML is correctly formatted with proper structure

fsRead (web/sw.js) : Examined Service Worker caching strategy and identified index.html in STATIC_ASSETS

fsReplace (web/sw.js) : Removed index.html, /, and /privacy.html from STATIC_ASSETS array to enable network-first caching

executeBash (npm run build:web) : Regenerated site with Service Worker v3.0.13

executeBash (git commit & push) : Deployed fix with message "fix: cambiar estrategia de caché PWA - index.html usa network-first (v3.0.13)"

Result : Homepage now uses network-first caching - always fetches latest version from network when online, falls back to cache only when offline. This ensures SEO category button appears immediately and footer displays correctly without requiring hard refresh. Service Worker updated to v3.0.13 and deployed to production.

Conversation history has been compacted successfully!