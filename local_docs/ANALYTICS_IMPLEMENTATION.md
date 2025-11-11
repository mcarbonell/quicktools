# 📊 Google Analytics 4 - Guía de Implementación

**Proyecto:** QuickTools  
**Fecha:** Noviembre 2025  
**Objetivo:** Tracking detallado de uso por herramienta, idioma y acciones

---

## 🎯 Objetivos de Analytics

### Métricas Clave
1. **Herramientas más usadas** - Identificar top performers
2. **Distribución por idioma** - EN vs ES usage
3. **Tasa de conversión** - Visita → Uso de herramienta
4. **Engagement** - Tiempo de uso por herramienta
5. **Errores** - Identificar problemas técnicos
6. **User journey** - Flujo de navegación

---

## 🚀 Setup Inicial

### 1. Crear Cuenta Google Analytics 4

```
1. Ir a https://analytics.google.com
2. Crear cuenta "QuickTools"
3. Crear propiedad "QuickTools Web"
4. Configurar data stream:
   - Platform: Web
   - Website URL: https://quicktools.dev
   - Stream name: QuickTools Production
5. Obtener Measurement ID: G-XXXXXXXXXX
```

### 2. Configuración de Propiedad

**Settings recomendados:**
```
- Data retention: 14 months
- User-ID tracking: Disabled (privacy)
- Google Signals: Enabled (demographics)
- Enhanced measurement: Enabled
  ✅ Page views
  ✅ Scrolls
  ✅ Outbound clicks
  ✅ Site search
  ✅ File downloads
  ❌ Video engagement (no aplica)
```

---

## 💻 Implementación en Código

### Archivo 1: `web/js/analytics.js`

```javascript
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
        
        // Auto-track page view
        this.trackPageView();
        
        // Track engagement on exit
        this.setupExitTracking();
    }

    /**
     * Extrae nombre de herramienta desde URL
     */
    extractToolName() {
        const path = window.location.pathname;
        
        // Match: /tools/category/tool-name.html o /es/tools/category/tool-name.html
        const match = path.match(/\/tools\/[^/]+\/([^/.]+)/);
        
        if (match) {
            return match[1];
        }
        
        // Homepage
        if (path === '/' || path === '/index.html' || path === '/es/' || path === '/es/index.html') {
            return 'homepage';
        }
        
        return 'unknown';
    }

    /**
     * Obtiene categoría de herramienta
     */
    getToolCategory(toolName) {
        const categories = {
            // Image tools
            'resize-image': 'image',
            'compress-image': 'image',
            'convert-image': 'image',
            'crop-image': 'image',
            'color-palette': 'image',
            'exif-viewer': 'image',
            'image-to-pdf': 'image',
            
            // File/PDF tools
            'extract-text-pdf': 'files',
            'merge-pdf': 'files',
            'split-pdf': 'files',
            'compress-pdf': 'files',
            'pdf-to-image': 'files',
            'text-to-pdf': 'files',
            
            // Data tools
            'json-formatter': 'data',
            'csv-to-json': 'data',
            'yaml-to-json': 'data',
            'xml-to-json': 'data',
            'toml-to-json': 'data',
            
            // Text tools
            'text-cleaner': 'text',
            'url-encoder': 'text',
            'base64-encoder': 'text',
            'html-encoder': 'text',
            'text-diff': 'text',
            'lorem-ipsum': 'text',
            
            // Utilities
            'qr-generator': 'utils',
            'password-generator': 'utils',
            'hash-calculator': 'utils',
            'color-picker': 'utils',
            'stopwatch-timer': 'utils',
            
            // AI tools
            'chat-ai': 'ai',
            'chat-pdf': 'ai',
            'improve-text': 'ai',
            'edit-image-ai': 'ai',
            'summarize-text': 'ai'
        };
        
        return categories[toolName] || 'other';
    }

    /**
     * Track page view
     */
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

    /**
     * Track cuando usuario usa una herramienta
     */
    trackToolUsed(details = {}) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'tool_used', {
            'tool_name': this.toolName,
            'tool_category': this.toolCategory,
            'language': this.language,
            ...details
        });
    }

    /**
     * Track acciones específicas (download, copy, convert, etc.)
     */
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

    /**
     * Track errores
     */
    trackError(errorType, errorMessage = '', details = {}) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'tool_error', {
            'tool_name': this.toolName,
            'tool_category': this.toolCategory,
            'error_type': errorType,
            'error_message': errorMessage.substring(0, 100), // Limitar longitud
            'language': this.language,
            ...details
        });
    }

    /**
     * Track engagement (tiempo de uso)
     */
    trackEngagement() {
        if (typeof gtag === 'undefined') return;
        
        const engagementTime = Date.now() - this.startTime;
        
        // Solo trackear si pasó más de 5 segundos
        if (engagementTime < 5000) return;
        
        gtag('event', 'tool_engagement', {
            'tool_name': this.toolName,
            'tool_category': this.toolCategory,
            'engagement_time_msec': engagementTime,
            'actions_count': this.actionsCount,
            'language': this.language
        });
    }

    /**
     * Track cambio de idioma
     */
    trackLanguageChange(fromLang, toLang) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'language_change', {
            'from_language': fromLang,
            'to_language': toLang,
            'tool_name': this.toolName
        });
    }

    /**
     * Setup tracking al salir de la página
     */
    setupExitTracking() {
        // Track engagement antes de salir
        window.addEventListener('beforeunload', () => {
            this.trackEngagement();
        });
        
        // Track también en visibilitychange (cambio de tab)
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

// Inicializar solo si cookies aceptadas
let analytics = null;

function initQuickToolsAnalytics() {
    if (typeof gtag !== 'undefined') {
        analytics = new QuickToolsAnalytics();
        console.log('📊 Analytics initialized');
    }
}

// Auto-init si cookies ya aceptadas
if (localStorage.getItem('cookies_accepted') === 'true') {
    initQuickToolsAnalytics();
}

// Exponer globalmente
window.QuickToolsAnalytics = QuickToolsAnalytics;
window.analytics = analytics;
```

### Archivo 2: `web/js/cookie-consent.js`

```javascript
/**
 * Cookie Consent Banner
 * GDPR/Privacy compliant
 */

class CookieConsent {
    constructor() {
        this.consentKey = 'cookies_accepted';
        this.init();
    }

    init() {
        const consent = localStorage.getItem(this.consentKey);
        
        if (consent === null) {
            // No ha decidido, mostrar banner
            this.showBanner();
        } else if (consent === 'true') {
            // Aceptó, cargar analytics
            this.loadAnalytics();
        }
        // Si rechazó, no hacer nada
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
        
        // Event listeners
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
        // Cargar Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
        document.head.appendChild(script);
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
                'anonymize_ip': true,
                'page_language': document.documentElement.lang || 'en'
            });
            
            // Inicializar QuickTools Analytics
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
```

### Archivo 3: `web/css/cookie-banner.css`

```css
/* Cookie Consent Banner */
.cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1F2937;
    color: white;
    padding: 1rem;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 9999;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

.cookie-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}

.cookie-content p {
    margin: 0;
    flex: 1;
    min-width: 250px;
}

.cookie-content a {
    color: #3B82F6;
    text-decoration: underline;
}

.cookie-buttons {
    display: flex;
    gap: 0.5rem;
}

.cookie-buttons button {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
}

.cookie-buttons .btn-primary {
    background: #3B82F6;
    color: white;
}

.cookie-buttons .btn-primary:hover {
    background: #2563EB;
}

.cookie-buttons .btn-secondary {
    background: #6B7280;
    color: white;
}

.cookie-buttons .btn-secondary:hover {
    background: #4B5563;
}

@media (max-width: 768px) {
    .cookie-content {
        flex-direction: column;
        text-align: center;
    }
    
    .cookie-buttons {
        width: 100%;
        justify-content: center;
    }
}
```

---

## 🔧 Integración en Templates

### En `web/templates/base.html`

```html
<!DOCTYPE html>
<html lang="{{language}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{tool_title}} | QuickTools</title>
    
    <!-- ... otros meta tags ... -->
    
    <!-- Cookie Banner CSS -->
    <link rel="stylesheet" href="/css/cookie-banner.css">
</head>
<body>
    <!-- ... contenido ... -->
    
    <!-- Scripts al final -->
    <script src="/js/cookie-consent.js"></script>
    <script src="/js/analytics.js"></script>
    {{tool_script}}
</body>
</html>
```

---

## 📝 Uso en Herramientas

### Ejemplo: `web/js/tools/resize-image.js`

```javascript
// Al inicio del archivo
const t = window.toolTranslations || {};

// Cuando usuario carga archivo
function handleFileLoad(file) {
    // Track file loaded
    if (window.analytics) {
        window.analytics.trackToolUsed({
            'file_type': file.type,
            'file_size': file.size
        });
    }
    
    // ... resto del código ...
}

// Cuando procesa imagen
function processImage() {
    if (window.analytics) {
        window.analytics.trackAction('processing_started');
    }
    
    try {
        // ... procesamiento ...
        
        if (window.analytics) {
            window.analytics.trackAction('processing_completed', {
                'output_format': outputFormat,
                'output_size': outputSize
            });
        }
    } catch (error) {
        if (window.analytics) {
            window.analytics.trackError('processing_failed', error.message);
        }
        throw error;
    }
}

// Cuando descarga resultado
function downloadImage() {
    if (window.analytics) {
        window.analytics.trackAction('download', {
            'format': outputFormat
        });
    }
    
    // ... código de descarga ...
}

// Cuando copia al portapapeles
function copyToClipboard() {
    if (window.analytics) {
        window.analytics.trackAction('copy');
    }
    
    // ... código de copia ...
}
```

---

## 📊 Reportes y Dashboards

### Custom Reports en GA4

**1. Tool Performance Report**
```
Dimensions:
- Event name (tool_used, tool_action)
- Tool name
- Tool category
- Language

Metrics:
- Event count
- Users
- Average engagement time
- Actions per user

Filters:
- Event name = tool_used OR tool_action
```

**2. Language Analytics Report**
```
Dimensions:
- Language
- Tool name
- Tool category

Metrics:
- Users
- Sessions
- Event count
- Engagement rate

Comparison:
- EN vs ES
```

**3. Error Tracking Report**
```
Dimensions:
- Tool name
- Error type
- Error message

Metrics:
- Error count
- Affected users
- Error rate (errors/total events)

Filters:
- Event name = tool_error
```

### Explorations (Advanced Analysis)

**User Journey Flow:**
```
1. Landing page
2. Tool category selected
3. Tool used
4. Actions performed
5. Exit or next tool
```

**Funnel Analysis:**
```
Step 1: Page view (tool page)
Step 2: Tool used (file loaded)
Step 3: Action completed (download/copy)

Conversion rate: Step 3 / Step 1
```

---

## 🎯 KPIs y Alertas

### KPIs Principales

```
1. Daily Active Tools (DAT)
   - Herramientas únicas usadas por día
   - Target: 20+ tools/day

2. Tool Usage Rate
   - (tool_used events / page_views) * 100
   - Target: >40%

3. Error Rate
   - (tool_error events / tool_used events) * 100
   - Target: <5%

4. Language Distribution
   - EN users / Total users
   - ES users / Total users
   - Target: 70% EN, 30% ES

5. Average Engagement Time
   - Por herramienta
   - Target: >60 seconds

6. Actions per Session
   - Promedio de acciones por visita
   - Target: >2 actions
```

### Alertas Configuradas

```
1. Error Spike Alert
   - Trigger: Error rate > 10% en 1 hora
   - Action: Email notification

2. Traffic Drop Alert
   - Trigger: Users < 50% del promedio 7 días
   - Action: Email notification

3. Tool Failure Alert
   - Trigger: Herramienta específica con >20 errores/hora
   - Action: Email + Slack notification

4. Language Anomaly Alert
   - Trigger: Cambio >30% en distribución idioma
   - Action: Email notification
```

---

## ✅ Checklist de Implementación

### Fase 1: Setup (Día 2)
```
□ Crear cuenta Google Analytics 4
□ Obtener Measurement ID
□ Crear analytics.js
□ Crear cookie-consent.js
□ Crear cookie-banner.css
□ Añadir scripts a base.html
□ Test tracking básico en localhost
```

### Fase 2: Integración (Día 7)
```
□ Integrar analytics en 33 herramientas
□ Añadir trackToolUsed() en cada herramienta
□ Añadir trackAction() para acciones clave
□ Añadir trackError() en catch blocks
□ Test eventos en todas las herramientas
□ Verificar datos en GA4 Real-Time
```

### Fase 3: Reportes (Día 12)
```
□ Crear custom reports en GA4
□ Configurar explorations
□ Configurar alertas
□ Documentar eventos y parámetros
□ Crear dashboard para stakeholders
□ Test completo de tracking
```

### Fase 4: Validación (Día 14)
```
□ Verificar tracking en producción
□ Validar todos los eventos
□ Verificar reportes funcionando
□ Test alertas
□ Documentación final
```

---

## 🔒 Privacy & Compliance

### GDPR Compliance
```
✅ Cookie consent banner
✅ Opt-out option
✅ IP anonymization
✅ No PII tracking
✅ Privacy policy updated
✅ Data retention: 14 months
```

### Data Collected
```
✅ Tool usage (anonymous)
✅ Language preference
✅ Actions performed
✅ Error types
✅ Engagement time
✅ Device type
✅ Browser type

❌ NO personal information
❌ NO file contents
❌ NO user identification
❌ NO cross-site tracking
```

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0  
**Mantenedor:** QuickTools Team
