// sw.js - Service Worker para FastTools
// Cache name con version para invalidar cache cuando actualicemos
const CACHE_NAME = 'fasttools-v3.0.54';
const STATIC_CACHE = 'fasttools-static-v3.0.54';
const DYNAMIC_CACHE = 'fasttools-dynamic-v3.0.54';

// Recursos críticos que deben estar siempre en cache
const STATIC_ASSETS = [
    '/css/style.css',
    '/js/main.js',
    '/manifest.json',
    // Iconos PWA
    '/icons/icon-72x72.svg',
    '/icons/icon-96x96.svg',
    '/icons/icon-128x128.svg',
    '/icons/icon-144x144.svg',
    '/icons/icon-152x152.svg',
    '/icons/icon-192x192.svg',
    '/icons/icon-384x384.svg',
    '/icons/icon-512x512.svg',
    // CDN resources críticas
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

// Recursos que pueden requerir actualización frecuente
const DYNAMIC_EXTENSIONS = ['.html', '.js', '.css'];
const MAX_CACHE_SIZE = 50; // Máximo número de items en cache dinámico

/**
 * Instalación del Service Worker
 * Se ejecuta cuando el SW se instala por primera vez
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker v3.0.54');

    event.waitUntil(
        (async () => {
            try {
                // Abrir cache estático y agregar recursos críticos
                const staticCache = await caches.open(STATIC_CACHE);
                await staticCache.addAll(STATIC_ASSETS);

                console.log('[SW] Static cache populated with critical resources');
                console.log('[SW] Cached:', STATIC_ASSETS);

                // Activar inmediatamente
                await self.skipWaiting();

            } catch (error) {
                console.error('[SW] Error during installation:', error);
            }
        })()
    );
});

/**
 * Activación del Service Worker
 * Se ejecuta cuando el SW toma control de la página
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker v3.0.54');

    event.waitUntil(
        (async () => {
            try {
                // Obtener todas las caches existentes
                const cacheNames = await caches.keys();

                // Eliminar caches obsoletos
                const deletePromises = cacheNames
                    .filter(cacheName =>
                        cacheName !== STATIC_CACHE &&
                        cacheName !== DYNAMIC_CACHE &&
                        (cacheName.startsWith('quicktools-') || cacheName.startsWith('fasttools-'))
                    )
                    .map(cacheName => {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    });

                await Promise.all(deletePromises);

                // Tomar control inmediato de todas las pestañas
                await self.clients.claim();

                console.log('[SW] Service Worker activated and took control');

            } catch (error) {
                console.error('[SW] Error during activation:', error);
            }
        })()
    );
});

/**
 * Intercepta todas las peticiones de red
 * Aplica diferentes estrategias de cache según el tipo de recurso
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Solo manejar peticiones GET
    if (request.method !== 'GET') {
        return;
    }

    // Skip para peticiones de extensiones del navegador y otras URLs especiales
    if (url.protocol === 'chrome-extension:' ||
        url.protocol === 'moz-extension:' ||
        url.href.includes('chrome-extension://')) {
        return;
    }

    event.respondWith(handleFetch(request));
});

/**
 * Estrategia principal para manejar peticiones
 */
async function handleFetch(request) {
    const url = new URL(request.url);

    try {
        // 1. Recursos estáticos críticos - Cache First
        if (isStaticCritical(url)) {
            return await cacheFirst(request, STATIC_CACHE);
        }

        // 2. Archivos locales - Network First con fallback
        if (isLocalFile(url)) {
            return await networkFirst(request, DYNAMIC_CACHE);
        }

        // 3. APIs externas - Network Only
        if (isExternalAPI(url)) {
            return await fetch(request);
        }

        // 4. Imágenes - Cache First con límite
        if (isImage(url)) {
            return await cacheFirst(request, DYNAMIC_CACHE, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 días
        }

        // 5. Por defecto - Network First
        return await networkFirst(request, DYNAMIC_CACHE);

    } catch (error) {
        console.error('[SW] Error handling request:', request.url, error);

        // Fallback: devolver página offline si es una página HTML
        if (request.destination === 'document') {
            return await getOfflinePage();
        }

        // Para otros recursos, intentar cache como último recurso
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Si no hay nada, devolver error
        throw error;
    }
}

/**
 * Estrategia Cache First (para recursos estáticos)
 */
async function cacheFirst(request, cacheName, options = {}) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            await cache.put(request, responseClone);

            // Limpiar cache si es muy grande
            if (cacheName === DYNAMIC_CACHE) {
                await limitCacheSize(cache, MAX_CACHE_SIZE);
            }
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache first failed for:', request.url, error);
        throw error;
    }
}

/**
 * Estrategia Network First (para contenido dinámico)
 */
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            await cache.put(request, responseClone);
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache for:', request.url);

        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

/**
 * Limitar el tamaño del cache dinámico
 */
async function limitCacheSize(cache, maxItems) {
    const keys = await cache.keys();

    if (keys.length > maxItems) {
        // Eliminar los elementos más antiguos
        const keysToDelete = keys.slice(0, keys.length - maxItems);
        await Promise.all(keysToDelete.map(key => cache.delete(key)));
        console.log(`[SW] Cache size limited. Deleted ${keysToDelete.length} items.`);
    }
}

/**
 * Obtener página offline personalizada
 */
async function getOfflinePage() {
    const cache = await caches.open(STATIC_CACHE);
    const offlinePage = await cache.match('/index.html');

    if (offlinePage) {
        return new Response(offlinePage.body, {
            status: 200,
            statusText: 'OK (Offline)',
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Offline': 'true'
            }
        });
    }

    // Fallback básico si no hay cache
    return new Response(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>QuickTools - Modo Offline</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .offline-container {
                    max-width: 500px;
                    margin: 0 auto;
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 10px;
                    backdrop-filter: blur(10px);
                }
                h1 { margin-bottom: 20px; }
                p { margin-bottom: 20px; line-height: 1.6; }
                .retry-btn {
                    background: #fff;
                    color: #667eea;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: transform 0.2s;
                }
                .retry-btn:hover {
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <h1>🌐 Modo Offline</h1>
                <p>Parece que no tienes conexión a internet. Pero no te preocupes, FastTools puede seguir funcionando con muchas de sus herramientas.</p>
                <p>Las herramientas de procesamiento local funcionan sin conexión. ¡Inténtalo de nuevo cuando tengas internet!</p>
                <button class="retry-btn" onclick="window.location.reload()">
                    🔄 Intentar de nuevo
                </button>
            </div>
        </body>
        </html>
    `, {
        status: 200,
        statusText: 'OK (Offline)',
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Offline': 'true'
        }
    });
}

/**
 * Funciones de detección de tipos de recursos
 */
function isStaticCritical(url) {
    return STATIC_ASSETS.some(asset => url.href.endsWith(asset.replace('/', '')));
}

function isLocalFile(url) {
    return url.origin === location.origin &&
        (url.pathname.endsWith('.html') ||
            url.pathname.endsWith('.js') ||
            url.pathname.endsWith('.css'));
}

function isExternalAPI(url) {
    const externalDomains = ['api.', 'googleapis.com', 'facebook.com', 'twitter.com'];
    return externalDomains.some(domain => url.hostname.includes(domain));
}

function isImage(url) {
    return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname);
}

/**
 * Mensaje para invalidar cache manualmente
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        const { urls } = event.data;
        if (urls && Array.isArray(urls)) {
            event.waitUntil(
                caches.open(DYNAMIC_CACHE).then(cache => {
                    return cache.addAll(urls);
                })
            );
        }
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

/**
 * Log de eventos para debugging
 */
self.addEventListener('error', (event) => {
    console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker script loaded');
