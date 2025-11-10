/**
 * Cookie Consent Banner
 * GDPR/Privacy compliant
 */

class CookieConsent {
    constructor() {
        this.consentKey = 'cookies_accepted';
        this.gaId = 'G-9XTNQMQKE2';
        this.init();
    }

    init() {
        const consent = localStorage.getItem(this.consentKey);
        
        if (consent === null) {
            this.showBanner();
        } else if (consent === 'true') {
            this.loadAnalytics();
        }
    }

    showBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>
                    🍪 We use cookies to analyze site usage and improve your experience. 
                    <a href="/privacy.html" target="_blank">Privacy Policy</a>
                </p>
                <div class="cookie-buttons">
                    <button id="accept-cookies" class="btn btn-primary">Accept</button>
                    <button id="reject-cookies" class="btn btn-secondary">Reject</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        document.getElementById('accept-cookies').addEventListener('click', () => {
            this.accept();
        });
        
        document.getElementById('reject-cookies').addEventListener('click', () => {
            this.reject();
        });
    }

    accept() {
        localStorage.setItem(this.consentKey, 'true');
        this.hideBanner();
        this.loadAnalytics();
    }

    reject() {
        localStorage.setItem(this.consentKey, 'false');
        this.hideBanner();
    }

    hideBanner() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.remove();
        }
    }

    loadAnalytics() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
        document.head.appendChild(script);
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            gtag('js', new Date());
            gtag('config', this.gaId, {
                'anonymize_ip': true,
                'page_language': document.documentElement.lang || 'en'
            });
            
            if (typeof initQuickToolsAnalytics === 'function') {
                initQuickToolsAnalytics();
            }
        };
    }
}

// Inicializar al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CookieConsent();
    });
} else {
    new CookieConsent();
}
