// service-worker.js - Registro y gestión del Service Worker
// Para usar en las páginas como módulo: import { registerSW, updateSW } from './service-worker.js'

/**
 * Verificar si el navegador soporta Service Workers
 */
function isServiceWorkerSupported() {
    return 'serviceWorker' in navigator;
}

/**
 * Verificar si estamos en un contexto seguro (HTTPS o localhost)
 */
function isSecureContext() {
    return location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

/**
 * Registrar el Service Worker
 */
async function registerSW() {
    // Verificaciones previas
    if (!isServiceWorkerSupported()) {
        console.log('[SW] Service Workers no soportados en este navegador');
        return null;
    }

    if (!isSecureContext()) {
        console.warn('[SW] Service Workers requieren contexto seguro (HTTPS o localhost)');
        return null;
    }

    try {
        console.log('[SW] Registrando Service Worker...');

        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });

        console.log('[SW] Service Worker registrado exitosamente:', registration.scope);

        // Manejar actualizaciones del Service Worker
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
                console.log('[SW] Nueva versión del Service Worker disponible');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Nueva versión está lista, notificar al usuario
                        showUpdateAvailable();
                    }
                });
            }
        });

        // Evento cuando el Service Worker toma control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW] Service Worker ha tomado control de la página');
        });

        // Log del Service Worker actual
        if (navigator.serviceWorker.controller) {
            console.log('[SW] Página controlada por Service Worker');
        }

        return registration;

    } catch (error) {
        console.error('[SW] Error registrando Service Worker:', error);
        return null;
    }
}

/**
 * Mostrar notificación de actualización disponible
 */
function showUpdateAvailable() {
    // Crear banner de notificación
    const updateBanner = document.createElement('div');
    updateBanner.id = 'sw-update-banner';
    updateBanner.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 9999;
            font-family: system-ui, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        ">
            <span style="margin-right: 15px;">🚀 Nueva versión de QuickTools disponible</span>
            <button onclick="updateServiceWorker()" style="
                background: white;
                color: #28a745;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                margin-right: 10px;
            ">Actualizar</button>
            <button onclick="dismissUpdateBanner()" style="
                background: transparent;
                color: white;
                border: 1px solid white;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
            ">Después</button>
        </div>
    `;

    document.body.appendChild(updateBanner);

    // Auto-ocultar después de 10 segundos si no se actúa
    setTimeout(() => {
        if (document.getElementById('sw-update-banner')) {
            dismissUpdateBanner();
        }
    }, 10000);
}

/**
 * Función para actualizar el Service Worker (global para onclick)
 */
window.updateServiceWorker = async function () {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Enviar mensaje para skip waiting
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });

        // Recargar la página para usar la nueva versión
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }
};

/**
 * Función para dismiss el banner (global para onclick)
 */
window.dismissUpdateBanner = function () {
    const banner = document.getElementById('sw-update-banner');
    if (banner) {
        banner.remove();
    }
};

/**
 * Actualizar el Service Worker manualmente
 */
async function updateSW() {
    if (!('serviceWorker' in navigator)) {
        return false;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        await registration.update();
        return true;
    }
    return false;
}

/**
 * Obtener información del Service Worker actual
 */
async function getSWInfo() {
    if (!('serviceWorker' in navigator)) {
        return null;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
        return null;
    }

    return {
        registration,
        state: registration.active?.state,
        scope: registration.scope,
        updatefound: !!registration.updatefound
    };
}

/**
 * Verificar si hay una nueva versión disponible
 */
async function checkForUpdates() {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        await registration.update();
    }
}

/**
 * Desregistrar el Service Worker (útil para desarrollo)
 */
async function unregisterSW() {
    if (!('serviceWorker' in navigator)) {
        return false;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        return await registration.unregister();
    }
    return false;
}

/**
 * Obtener tamaño del cache
 */
async function getCacheSize() {
    if (!('caches' in window)) {
        return 0;
    }

    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
        if (cacheName.startsWith('quicktools-')) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            // Nota: No podemos obtener el tamaño real sin descargar cada recurso
            totalSize += requests.length;
        }
    }

    return totalSize;
}

/**
 * Limpiar cache manualmente
 */
async function clearCache() {
    if (!('caches' in window)) {
        return false;
    }

    const cacheNames = await caches.keys();
    const quicktoolsCaches = cacheNames.filter(name => name.startsWith('quicktools-'));

    await Promise.all(quicktoolsCaches.map(name => caches.delete(name)));

    console.log('[SW] Cache limpiado:', quicktoolsCaches);
    return true;
}

/**
 * Mostrar estado del Service Worker en consola (debug)
 */
async function debugSW() {
    console.group('[SW] Debug Info');

    console.log('Supported:', isServiceWorkerSupported());
    console.log('Secure Context:', isSecureContext());
    console.log('Current URL:', location.href);
    console.log('Protocol:', location.protocol);

    const info = await getSWInfo();
    console.log('Service Worker Info:', info);

    if (navigator.serviceWorker.controller) {
        console.log('Controller URL:', navigator.serviceWorker.controller.scriptURL);
    }

    const cacheSize = await getCacheSize();
    console.log('Cache items:', cacheSize);

    console.groupEnd();
}

/**
 * Auto-registro cuando el script se carga directamente
 */
if (typeof window !== 'undefined') {
    // Auto-registrar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerSW());
    } else {
        registerSW();
    }

    // Exponer funciones útiles globalmente para debugging
    window.SWUtils = {
        register: registerSW,
        update: updateSW,
        info: getSWInfo,
        checkUpdates: checkForUpdates,
        unregister: unregisterSW,
        clearCache,
        getCacheSize,
        debug: debugSW
    };
}

// Exportar funciones para módulos ES6
export {
    registerSW,
    updateSW,
    getSWInfo,
    checkForUpdates,
    unregisterSW,
    clearCache,
    getCacheSize,
    debugSW
};
