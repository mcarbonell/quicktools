// cache-utils.js - Utilities para manejo avanzado de cache
// Para usar como módulo: import { cacheManager } from './cache-utils.js'

/**
 * Cache Manager para QuickTools
 */
export class CacheManager {
    constructor() {
        this.CACHE_PREFIX = 'quicktools-';
        this.STATIC_CACHE = 'quicktools-static-v1.0.0';
        this.DYNAMIC_CACHE = 'quicktools-dynamic-v1.0.0';
    }

    /**
     * Verificar si las caches están disponibles
     */
    isSupported() {
        return 'caches' in window;
    }

    /**
     * Obtener información detallada de todos los caches
     */
    async getCacheInfo() {
        if (!this.isSupported()) {
            return { supported: false, caches: [] };
        }

        const cacheNames = await caches.keys();
        const cacheInfo = [];

        for (const cacheName of cacheNames) {
            if (cacheName.startsWith(this.CACHE_PREFIX)) {
                const cache = await caches.open(cacheName);
                const requests = await cache.keys();

                cacheInfo.push({
                    name: cacheName,
                    type: this.getCacheType(cacheName),
                    size: requests.length,
                    urls: requests.map(req => req.url)
                });
            }
        }

        return {
            supported: true,
            totalCaches: cacheInfo.length,
            totalItems: cacheInfo.reduce((sum, cache) => sum + cache.size, 0),
            caches: cacheInfo
        };
    }

    /**
     * Pre-cache recursos específicos
     */
    async preCacheResources(urls, cacheName = this.DYNAMIC_CACHE) {
        if (!this.isSupported()) {
            throw new Error('Cache API no soportado');
        }

        const cache = await caches.open(cacheName);
        const results = [];

        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response.clone());
                    results.push({ url, status: 'cached', ok: true });
                } else {
                    results.push({ url, status: 'failed', ok: false, error: response.statusText });
                }
            } catch (error) {
                results.push({ url, status: 'error', ok: false, error: error.message });
            }
        }

        return results;
    }

    /**
     * Cachear recursos críticos para modo offline
     */
    async cacheCriticalResources() {
        const criticalResources = [
            '/',
            '/index.html',
            '/css/style.css',
            '/js/main.js',
            '/templates/base.html',
            '/privacy.html'
        ];

        return await this.preCacheResources(criticalResources, this.STATIC_CACHE);
    }

    /**
     * Limpiar cache específico
     */
    async clearCache(cacheName = null) {
        if (!this.isSupported()) {
            return false;
        }

        if (cacheName) {
            // Limpiar cache específico
            return await caches.delete(cacheName);
        } else {
            // Limpiar todos los caches de QuickTools
            const cacheNames = await caches.keys();
            const quicktoolsCaches = cacheNames.filter(name => name.startsWith(this.CACHE_PREFIX));
            await Promise.all(quicktoolsCaches.map(name => caches.delete(name)));
            return true;
        }
    }

    /**
     * Obtener tamaño estimado del cache
     */
    async getCacheSize() {
        const info = await this.getCacheInfo();
        return {
            totalItems: info.totalItems,
            totalCaches: info.totalCaches,
            caches: info.caches.map(cache => ({
                name: cache.name,
                type: cache.type,
                items: cache.size
            }))
        };
    }

    /**
     * Verificar si un recurso está en cache
     */
    async isCached(url, cacheName = null) {
        if (!this.isSupported()) {
            return false;
        }

        const cacheNames = cacheName ? [cacheName] : await caches.keys();

        for (const name of cacheNames) {
            if (name.startsWith(this.CACHE_PREFIX)) {
                const cache = await caches.open(name);
                const match = await cache.match(url);
                if (match) {
                    return { cached: true, cacheName: name, response: match };
                }
            }
        }

        return { cached: false };
    }

    /**
     * Eliminar recurso específico del cache
     */
    async removeFromCache(url, cacheName = null) {
        if (!this.isSupported()) {
            return false;
        }

        const cacheNames = cacheName ? [cacheName] : await caches.keys();
        let removed = false;

        for (const name of cacheNames) {
            if (name.startsWith(this.CACHE_PREFIX)) {
                const cache = await caches.open(name);
                const wasDeleted = await cache.delete(url);
                if (wasDeleted) {
                    removed = true;
                }
            }
        }

        return removed;
    }

    /**
     * Obtener estadísticas de uso del cache
     */
    async getCacheStats() {
        const info = await this.getCacheInfo();

        // Simular estadísticas de uso (no disponible directamente en Cache API)
        return {
            ...info,
            estimatedSavings: {
                // Estimación basada en número de requests
                requests: info.totalItems,
                // Asumiendo 50KB promedio por recurso cacheado
                data: `${info.totalItems * 50}KB`,
                // Tiempo ahorrado (asumiendo 500ms por request de red)
                time: `${info.totalItems * 0.5}s`
            }
        };
    }

    /**
     * Determinar tipo de cache por nombre
     */
    getCacheType(cacheName) {
        if (cacheName.includes('static')) return 'static';
        if (cacheName.includes('dynamic')) return 'dynamic';
        return 'unknown';
    }

    /**
     * Optimizar cache (eliminar recursos obsoletos)
     */
    async optimizeCache() {
        const info = await this.getCacheInfo();
        let optimized = 0;

        for (const cache of info.caches) {
            if (cache.type === 'dynamic' && cache.size > 50) {
                // Cache dinámico muy grande, eliminar los más antiguos
                const cacheObj = await caches.open(cache.name);
                const requests = await cacheObj.keys();
                const toDelete = requests.slice(0, requests.length - 50);

                await Promise.all(toDelete.map(req => cacheObj.delete(req)));
                optimized += toDelete.length;
            }
        }

        return { optimized, remainingItems: info.totalItems - optimized };
    }
}

/**
 * Network Status Manager
 */
export class NetworkManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.listeners = [];

        // Configurar listeners
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    /**
     * Obtener estado actual de la red
     */
    getStatus() {
        return {
            online: navigator.onLine,
            connection: this.getConnectionInfo()
        };
    }

    /**
     * Obtener información de conexión (si está disponible)
     */
    getConnectionInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        return null;
    }

    /**
     * Verificar si una URL es accesible
     */
    async checkUrlAccessibility(url, timeout = 5000) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                method: 'HEAD',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            return {
                accessible: response.ok,
                status: response.status,
                statusText: response.statusText
            };
        } catch (error) {
            return {
                accessible: false,
                error: error.message
            };
        }
    }

    /**
     * Listener para cambios de estado
     */
    onStatusChange(callback) {
        this.listeners.push(callback);
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Manejar cuando la conexión se recupera
     */
    handleOnline() {
        console.log('[Network] Connection restored');
        this.isOnline = true;
        this.notifyListeners('online');
    }

    /**
     * Manejar cuando se pierde la conexión
     */
    handleOffline() {
        console.log('[Network] Connection lost');
        this.isOnline = false;
        this.notifyListeners('offline');
    }

    /**
     * Notificar a todos los listeners
     */
    notifyListeners(status) {
        this.listeners.forEach(callback => {
            try {
                callback(status, this.getStatus());
            } catch (error) {
                console.error('[Network] Error in status listener:', error);
            }
        });
    }
}

/**
 * PWA Install Manager
 */
export class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = this.checkIfInstalled();

        this.setupEventListeners();
    }

    /**
     * Verificar si la PWA ya está instalada
     */
    checkIfInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
    }

    /**
     * Configurar event listeners para PWA install
     */
    setupEventListeners() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallBanner();
        });

        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App was installed');
            this.isInstalled = true;
            this.hideInstallBanner();
        });
    }

    /**
     * Mostrar banner de instalación
     */
    showInstallBanner() {
        if (this.isInstalled) return;

        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: linear-gradient(135deg, #007bff, #0056b3);
                color: white;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 9999;
                font-family: system-ui, sans-serif;
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 400px;
                margin: 0 auto;
                backdrop-filter: blur(10px);
            ">
                <div>
                    <div style="font-weight: bold; margin-bottom: 5px;">📱 Instalar QuickTools</div>
                    <div style="font-size: 0.9em; opacity: 0.9;">Acceso rápido desde tu pantalla de inicio</div>
                </div>
                <div>
                    <button onclick="installPWA()" style="
                        background: white;
                        color: #007bff;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-right: 10px;
                    ">Instalar</button>
                    <button onclick="dismissInstallBanner()" style="
                        background: transparent;
                        color: white;
                        border: 1px solid white;
                        padding: 8px 16px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Más tarde</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Auto-ocultar después de 30 segundos
        setTimeout(() => {
            if (document.getElementById('pwa-install-banner')) {
                this.dismissInstallBanner();
            }
        }, 30000);
    }

    /**
     * Intentar instalar la PWA
     */
    async install() {
        if (!this.deferredPrompt) {
            return { success: false, reason: 'No install prompt available' };
        }

        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('[PWA] User accepted install prompt');
                return { success: true };
            } else {
                console.log('[PWA] User dismissed install prompt');
                return { success: false, reason: 'User dismissed' };
            }
        } catch (error) {
            console.error('[PWA] Error during installation:', error);
            return { success: false, reason: error.message };
        } finally {
            this.deferredPrompt = null;
            this.dismissInstallBanner();
        }
    }

    /**
     * Ocultar banner de instalación
     */
    dismissInstallBanner() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.remove();
        }
    }

    /**
     * Verificar si se puede instalar
     */
    canInstall() {
        return this.deferredPrompt && !this.isInstalled;
    }
}

// Funciones globales para onclick handlers
window.installPWA = async function () {
    if (window.pwaInstaller) {
        const result = await window.pwaInstaller.install();
        console.log('[PWA] Install result:', result);
    }
};

window.dismissInstallBanner = function () {
    if (window.pwaInstaller) {
        window.pwaInstaller.dismissInstallBanner();
    }
};

// Exportar instancias globales
export const cacheManager = new CacheManager();
export const networkManager = new NetworkManager();
export const pwaInstaller = new PWAInstaller();

// Hacer accesibles globalmente para debugging
if (typeof window !== 'undefined') {
    window.cacheManager = cacheManager;
    window.networkManager = networkManager;
    window.pwaInstaller = pwaInstaller;
}
