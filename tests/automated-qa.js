/**
 * FastTools - Automated QA Testing
 * Comprehensive testing suite for all 33 tools
 */

const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
};

// Test results
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    errors: []
};

// ====================
// UTILITY FUNCTIONS
// ====================

function log(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

function testResult(name, passed, message = '') {
    results.total++;
    if (passed) {
        results.passed++;
        log(colors.green, `✅ ${name}`);
    } else {
        results.failed++;
        log(colors.red, `❌ ${name}`);
        if (message) {
            log(colors.red, `   ${message}`);
            results.errors.push({ test: name, error: message });
        }
    }
}

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return null;
    }
}

// ====================
// TEST SUITES
// ====================

function testFileStructure() {
    log(colors.cyan, '\n📁 Testing File Structure...\n');

    const criticalFiles = [
        'web/index.html',
        'web/sitemap.xml',
        'web/robots.txt',
        'web/manifest.json',
        'web/sw.js',
        'web/privacy.html',
        'web/es/index.html',
        'web/es/privacy.html',
        'web/css/style.css',
        'web/css/style-v2.css',
        'web/js/main.js',
        'web/js/toast.js',
        'web/js/animations.js',
        'web/js/analytics.js',
        'web/js/cookie-consent.js'
    ];

    criticalFiles.forEach(file => {
        const fullPath = path.join(process.cwd(), file);
        testResult(
            `File exists: ${file}`,
            fileExists(fullPath),
            `Missing file: ${file}`
        );
    });
}

function testToolPages() {
    log(colors.cyan, '\n🛠️  Testing Tool Pages...\n');

    const tools = [
        // Image tools
        'tools/image/image-resizer.html',
        'tools/image/convert-image.html',
        'tools/image/color-palette-generator.html',
        'tools/image/exif-viewer-cleaner.html',
        'tools/image/image-cropper.html',
        'tools/image/image-compressor.html',
        // Data tools
        'tools/data/json-formatter.html',
        'tools/data/csv-json.html',
        'tools/data/yaml-json.html',
        'tools/data/xml-json.html',
        'tools/data/toml-json.html',
        // File tools
        'tools/files/pdf-to-text.html',
        'tools/files/merge-pdfs.html',
        'tools/files/split-pdf.html',
        'tools/files/compress-pdf.html',
        'tools/files/pdf-to-image.html',
        'tools/files/image-to-pdf.html',
        // Text tools
        'tools/text/text-cleaner.html',
        'tools/text/url-encoder.html',
        'tools/text/base64.html',
        'tools/text/html-encoder.html',
        'tools/text/diff.html',
        'tools/text/lorem-ipsum-generator.html',
        // Utils
        'tools/utils/qr-generator.html',
        'tools/utils/password-generator.html',
        'tools/utils/hash-calculator.html',
        'tools/utils/color-picker-converter.html',
        'tools/utils/stopwatch-timer.html',
        // AI tools
        'tools/ai/chat-ai.html',
        'tools/ai/summarize.html',
        'tools/ai/improve-text.html',
        'tools/ai/chat-pdf.html',
        'tools/ai/edit-image.html'
    ];

    tools.forEach(tool => {
        const enPath = path.join(process.cwd(), 'web', tool);
        const esPath = path.join(process.cwd(), 'web', 'es', tool);
        
        testResult(
            `Tool EN: ${tool}`,
            fileExists(enPath),
            `Missing EN version: ${tool}`
        );
        
        testResult(
            `Tool ES: ${tool}`,
            fileExists(esPath),
            `Missing ES version: ${tool}`
        );
    });
}

function testHTMLValidity() {
    log(colors.cyan, '\n📄 Testing HTML Validity...\n');

    const htmlFiles = [
        'web/index.html',
        'web/privacy.html',
        'web/tools/image/image-resizer.html'
    ];

    htmlFiles.forEach(file => {
        const fullPath = path.join(process.cwd(), file);
        const content = readFile(fullPath);
        
        if (content) {
            testResult(
                `HTML has <!DOCTYPE>: ${file}`,
                content.includes('<!DOCTYPE') || content.includes('<!doctype'),
                'Missing DOCTYPE declaration'
            );
            
            testResult(
                `HTML has <html> tag: ${file}`,
                content.includes('<html'),
                'Missing <html> tag'
            );
            
            testResult(
                `HTML has <head> tag: ${file}`,
                content.includes('<head>'),
                'Missing <head> tag'
            );
            
            testResult(
                `HTML has <body> tag: ${file}`,
                content.includes('<body>'),
                'Missing <body> tag'
            );
        }
    });
}

function testMetaTags() {
    log(colors.cyan, '\n🏷️  Testing Meta Tags...\n');

    const indexPath = path.join(process.cwd(), 'web/index.html');
    const content = readFile(indexPath);

    if (content) {
        testResult(
            'Has viewport meta',
            content.includes('name="viewport"'),
            'Missing viewport meta tag'
        );
        
        testResult(
            'Has description meta',
            content.includes('name="description"'),
            'Missing description meta tag'
        );
        
        testResult(
            'Has Open Graph tags',
            content.includes('property="og:'),
            'Missing Open Graph tags'
        );
        
        testResult(
            'Has Twitter Card tags',
            content.includes('property="twitter:'),
            'Missing Twitter Card tags'
        );
        
        testResult(
            'Has Google Search Console verification',
            content.includes('google-site-verification'),
            'Missing Google Search Console meta tag'
        );
    }
}

function testSEO() {
    log(colors.cyan, '\n🔍 Testing SEO...\n');

    // Test sitemap
    const sitemapPath = path.join(process.cwd(), 'web/sitemap.xml');
    const sitemap = readFile(sitemapPath);
    
    if (sitemap) {
        testResult(
            'Sitemap exists and valid',
            sitemap.includes('<?xml') && sitemap.includes('<urlset'),
            'Invalid sitemap format'
        );
        
        testResult(
            'Sitemap has fasttools.tools URLs',
            sitemap.includes('fasttools.tools'),
            'Sitemap missing domain URLs'
        );
        
        testResult(
            'Sitemap has hreflang',
            sitemap.includes('xhtml:link') && sitemap.includes('hreflang'),
            'Sitemap missing hreflang tags'
        );
    }

    // Test robots.txt
    const robotsPath = path.join(process.cwd(), 'web/robots.txt');
    const robots = readFile(robotsPath);
    
    if (robots) {
        testResult(
            'Robots.txt exists',
            robots.includes('User-agent'),
            'Invalid robots.txt format'
        );
        
        testResult(
            'Robots.txt has sitemap',
            robots.includes('Sitemap:'),
            'Robots.txt missing sitemap reference'
        );
    }
}

function testTranslations() {
    log(colors.cyan, '\n🌐 Testing Translations...\n');

    const enPath = path.join(process.cwd(), 'web/i18n/en.json');
    const esPath = path.join(process.cwd(), 'web/i18n/es.json');

    const enContent = readFile(enPath);
    const esContent = readFile(esPath);

    if (enContent && esContent) {
        try {
            const enJson = JSON.parse(enContent);
            const esJson = JSON.parse(esContent);

            testResult(
                'EN translations valid JSON',
                true,
                ''
            );
            
            testResult(
                'ES translations valid JSON',
                true,
                ''
            );
            
            testResult(
                'EN has common section',
                enJson.common !== undefined,
                'Missing common section in EN'
            );
            
            testResult(
                'ES has common section',
                esJson.common !== undefined,
                'Missing common section in ES'
            );
            
            testResult(
                'FastTools branding in EN',
                enJson.common.title === 'FastTools',
                'Wrong branding in EN'
            );
            
            testResult(
                'FastTools branding in ES',
                esJson.common.title === 'FastTools',
                'Wrong branding in ES'
            );
        } catch (error) {
            testResult('Translations JSON parse', false, error.message);
        }
    }
}

function testServiceWorker() {
    log(colors.cyan, '\n⚙️  Testing Service Worker...\n');

    const swPath = path.join(process.cwd(), 'web/sw.js');
    const sw = readFile(swPath);

    if (sw) {
        testResult(
            'Service Worker exists',
            true,
            ''
        );
        
        testResult(
            'SW has cache version',
            sw.includes('CACHE_NAME') && sw.includes('v2.0.0'),
            'Missing or wrong cache version'
        );
        
        testResult(
            'SW has FastTools branding',
            sw.includes('fasttools') || sw.includes('FastTools'),
            'Wrong branding in Service Worker'
        );
        
        testResult(
            'SW has install event',
            sw.includes("addEventListener('install'"),
            'Missing install event'
        );
        
        testResult(
            'SW has fetch event',
            sw.includes("addEventListener('fetch'"),
            'Missing fetch event'
        );
    }
}

function testAnalytics() {
    log(colors.cyan, '\n📊 Testing Analytics...\n');

    const analyticsPath = path.join(process.cwd(), 'web/js/analytics.js');
    const cookiePath = path.join(process.cwd(), 'web/js/cookie-consent.js');

    const analytics = readFile(analyticsPath);
    const cookie = readFile(cookiePath);

    if (analytics) {
        testResult(
            'Analytics.js exists',
            true,
            ''
        );
        
        testResult(
            'Has GA4 Measurement ID',
            analytics.includes('G-9XTNQMQKE2'),
            'Missing or wrong GA4 ID'
        );
    }

    if (cookie) {
        testResult(
            'Cookie consent exists',
            true,
            ''
        );
        
        testResult(
            'Cookie consent has accept button',
            cookie.includes('accept') || cookie.includes('Accept'),
            'Missing accept functionality'
        );
    }
}

function testDesignSystem() {
    log(colors.cyan, '\n🎨 Testing Design System...\n');

    const styleV2Path = path.join(process.cwd(), 'web/css/style-v2.css');
    const styleV2 = readFile(styleV2Path);

    if (styleV2) {
        testResult(
            'style-v2.css exists',
            true,
            ''
        );
        
        testResult(
            'Has CSS variables',
            styleV2.includes(':root') && styleV2.includes('--primary'),
            'Missing CSS variables'
        );
        
        testResult(
            'Has primary color #13a4ec',
            styleV2.includes('#13a4ec'),
            'Missing or wrong primary color'
        );
        
        testResult(
            'Has Inter font',
            styleV2.includes('Inter'),
            'Missing Inter font'
        );
        
        testResult(
            'Has animations',
            styleV2.includes('@keyframes') && styleV2.includes('fadeIn'),
            'Missing animations'
        );
        
        testResult(
            'Has toast styles',
            styleV2.includes('.toast'),
            'Missing toast notification styles'
        );
    }
}

function testJavaScriptModules() {
    log(colors.cyan, '\n📦 Testing JavaScript Modules...\n');

    const modules = [
        'web/js/main.js',
        'web/js/toast.js',
        'web/js/animations.js',
        'web/js/analytics.js',
        'web/js/cookie-consent.js'
    ];

    modules.forEach(module => {
        const fullPath = path.join(process.cwd(), module);
        const content = readFile(fullPath);
        
        if (content) {
            testResult(
                `Module exists: ${path.basename(module)}`,
                true,
                ''
            );
            
            testResult(
                `No syntax errors (basic check): ${path.basename(module)}`,
                !content.includes('undefined undefined') && content.length > 0,
                'Potential syntax issues'
            );
        } else {
            testResult(
                `Module exists: ${path.basename(module)}`,
                false,
                `Missing module: ${module}`
            );
        }
    });
}

// ====================
// MAIN TEST RUNNER
// ====================

function runAllTests() {
    log(colors.magenta, '\n' + '='.repeat(60));
    log(colors.magenta, '🧪 FastTools - Automated QA Testing Suite');
    log(colors.magenta, '='.repeat(60));

    testFileStructure();
    testToolPages();
    testHTMLValidity();
    testMetaTags();
    testSEO();
    testTranslations();
    testServiceWorker();
    testAnalytics();
    testDesignSystem();
    testJavaScriptModules();

    // Summary
    log(colors.magenta, '\n' + '='.repeat(60));
    log(colors.magenta, '📊 Test Summary');
    log(colors.magenta, '='.repeat(60));
    
    log(colors.cyan, `\nTotal Tests: ${results.total}`);
    log(colors.green, `Passed: ${results.passed}`);
    log(colors.red, `Failed: ${results.failed}`);
    log(colors.yellow, `Skipped: ${results.skipped}`);
    
    const passRate = ((results.passed / results.total) * 100).toFixed(2);
    log(colors.cyan, `\nPass Rate: ${passRate}%`);

    if (results.failed > 0) {
        log(colors.red, '\n❌ Failed Tests:');
        results.errors.forEach((error, index) => {
            log(colors.red, `${index + 1}. ${error.test}`);
            log(colors.red, `   ${error.error}`);
        });
    }

    // Save report
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            total: results.total,
            passed: results.passed,
            failed: results.failed,
            skipped: results.skipped,
            passRate: passRate + '%'
        },
        errors: results.errors
    };

    fs.writeFileSync(
        path.join(__dirname, 'qa-report.json'),
        JSON.stringify(report, null, 2)
    );

    log(colors.cyan, '\n📄 Report saved to: tests/qa-report.json\n');

    // Exit code
    process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
if (require.main === module) {
    runAllTests();
}

module.exports = { runAllTests };
