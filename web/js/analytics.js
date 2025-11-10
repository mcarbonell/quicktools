/**
 * QuickTools Analytics Wrapper
 * Tracking de uso de herramientas, idiomas y acciones
 */

class QuickToolsAnalytics {
    constructor() {
        this.language = document.documentElement.lang || 'en';
        this.toolName = this.extractToolName();
        this.toolCategory = this.getToolCategory(this.toolName);
        this.startTime = Date.now();
        this.actionsCount = 0;
        
        this.trackPageView();
        this.setupExitTracking();
    }

    extractToolName() {
        const path = window.location.pathname;
        const match = path.match(/\/tools\/[^/]+\/([^/.]+)/);
        
        if (match) return match[1];
        if (path === '/' || path === '/index.html' || path === '/es/' || path === '/es/index.html') {
            return 'homepage';
        }
        return 'unknown';
    }

    getToolCategory(toolName) {
        const categories = {
            'resize-image': 'image', 'compress-image': 'image', 'convert-image': 'image',
            'crop-image': 'image', 'color-palette': 'image', 'exif-viewer': 'image', 'image-to-pdf': 'image',
            'extract-text-pdf': 'files', 'merge-pdf': 'files', 'split-pdf': 'files',
            'compress-pdf': 'files', 'pdf-to-image': 'files', 'text-to-pdf': 'files',
            'json-formatter': 'data', 'csv-to-json': 'data', 'yaml-to-json': 'data',
            'xml-to-json': 'data', 'toml-to-json': 'data',
            'text-cleaner': 'text', 'url-encoder': 'text', 'base64-encoder': 'text',
            'html-encoder': 'text', 'text-diff': 'text', 'lorem-ipsum': 'text',
            'qr-generator': 'utils', 'password-generator': 'utils', 'hash-calculator': 'utils',
            'color-picker': 'utils', 'stopwatch-timer': 'utils',
            'chat-ai': 'ai', 'chat-pdf': 'ai', 'improve-text': 'ai',
            'edit-image-ai': 'ai', 'summarize-text': 'ai'
        };
        return categories[toolName] || 'other';
    }

    trackPageView() {
        if (typeof gtag === 'undefined') return;
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href,
            'page_path': window.location.pathname,
            'language': this.language,
            'tool_name': this.toolName,
            'tool_category': this.toolCategory
        });
    }

    trackToolUsed(details = {}) {
        if (typeof gtag === 'undefined') return;
        gtag('event', 'tool_used', {
            'tool_name': this.toolName,
            'tool_category': this.toolCategory,
            'language': this.language,
            ...details
        });
    }

    trackAction(action, details = {}) {
        if (typeof gtag === 'undefined') return;
        this.actionsCount++;
        gtag('event', 'tool_action', {
            'tool_name': this.toolName,
            'tool_category': this.toolCategory,
            'action': action,
            'language': this.language,
            'actions_count': this.actionsCount,
            ...details
        });
    }

    trackError(errorType, errorMessage = '', details = {}) {
        if (typeof gtag === 'undefined') return;
        gtag('event', 'tool_error', {
            'tool_name': this.toolName,
            'tool_category': this.toolCategory,
            'error_type': errorType,
            'error_message': errorMessage.substring(0, 100),
            'language': this.language,
            ...details
        });
    }

    trackEngagement() {
        if (typeof gtag === 'undefined') return;
        const engagementTime = Date.now() - this.startTime;
        if (engagementTime < 5000) return;
        
        gtag('event', 'tool_engagement', {
            'tool_name': this.toolName,
            'tool_category': this.toolCategory,
            'engagement_time_msec': engagementTime,
            'actions_count': this.actionsCount,
            'language': this.language
        });
    }

    trackLanguageChange(fromLang, toLang) {
        if (typeof gtag === 'undefined') return;
        gtag('event', 'language_change', {
            'from_language': fromLang,
            'to_language': toLang,
            'tool_name': this.toolName
        });
    }

    setupExitTracking() {
        window.addEventListener('beforeunload', () => {
            this.trackEngagement();
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEngagement();
            }
        });
    }
}

// ====================
// INICIALIZACIÓN
// ====================

let analytics = null;

function initQuickToolsAnalytics() {
    if (typeof gtag !== 'undefined') {
        analytics = new QuickToolsAnalytics();
        console.log('📊 Analytics initialized');
    }
}

if (localStorage.getItem('cookies_accepted') === 'true') {
    initQuickToolsAnalytics();
}

window.QuickToolsAnalytics = QuickToolsAnalytics;
window.analytics = analytics;
