/**
 * Extension Adapter - Detecta entorno y adapta comportamiento
 * Permite reusar código de web en extensión sin duplicación
 */

// Detectar si estamos en extensión
const isExtension = typeof chrome !== 'undefined' && chrome.storage;

// Si estamos en extensión, reemplazar GeminiStorage con ChromeGeminiStorage
if (isExtension && typeof GeminiStorage !== 'undefined') {
    // Guardar referencia al storage original
    window.WebGeminiStorage = GeminiStorage;
    
    // Reemplazar con ChromeGeminiStorage
    window.GeminiStorage = ChromeGeminiStorage;
    
    console.log('🔧 Extension adapter: Using ChromeGeminiStorage');
}

// Adaptar rutas de assets si es necesario
if (isExtension) {
    // Interceptar fetch para ajustar rutas si es necesario
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Ajustar rutas absolutas a relativas en extensión
        if (typeof url === 'string' && url.startsWith('/')) {
            url = '../..' + url;
        }
        return originalFetch(url, options);
    };
}
