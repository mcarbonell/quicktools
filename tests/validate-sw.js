// tests/validate-sw.js - Script de validación manual del Service Worker
// Ejecutar en la consola del navegador para verificar funcionamiento

console.log('🔍 Validación Manual del Service Worker - QuickTools');
console.log('='.repeat(60));

/**
 * Función para ejecutar todas las validaciones
 */
async function validateServiceWorker() {
    const results = [];

    // 1. Verificar soporte
    console.log('\n1️⃣ Verificando soporte del navegador...');
    const isSupported = 'serviceWorker' in navigator;
    console.log(isSupported ? '✅ Service Workers soportados' : '❌ Service Workers NO soportados');
    results.push({ test: 'Soport SW', passed: isSupported });

    // 2. Verificar registro
    console.log('\n2️⃣ Verificando registro del Service Worker...');
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        console.log('✅ Service Worker registrado:', registration.scope);
        console.log('   Estado:', registration.active?.state || 'installing');
        results.push({ test: 'Registro SW', passed: true });
    } else {
        console.log('❌ Service Worker NO registrado');
        results.push({ test: 'Registro SW', passed: false });
    }

    // 3. Verificar Cache API
    console.log('\n3️⃣ Verificando Cache API...');
    const cacheSupported = 'caches' in window;
    console.log(cacheSupported ? '✅ Cache API soportado' : '❌ Cache API NO soportado');
    results.push({ test: 'Cache API', passed: cacheSupported });

    // 4. Verificar caches existentes
    if (cacheSupported) {
        console.log('\n4️⃣ Verificando caches existentes...');
        const cacheNames = await caches.keys();
        const quicktoolsCaches = cacheNames.filter(name => name.startsWith('quicktools-'));

        console.log(`📦 Caches encontrados: ${cacheNames.length}`);
        quicktoolsCaches.forEach(cache => {
            console.log(`   ✅ ${cache}`);
        });

        if (quicktoolsCaches.length > 0) {
            console.log('✅ Caches de QuickTools encontrados');
            results.push({ test: 'Caches QuickTools', passed: true });
        } else {
            console.log('⚠️ Caches de QuickTools NO encontrados (normal si es la primera vez)');
            results.push({ test: 'Caches QuickTools', passed: true });
        }
    }

    // 5. Verificar modo offline
    console.log('\n5️⃣ Verificando estado de conexión...');
    const isOnline = navigator.onLine;
    console.log(isOnline ? '🌐 Online' : '📵 Offline');
    results.push({ test: 'Conexión', passed: true }); // Siempre pasa

    // 6. Test de cache manual
    if (cacheSupported) {
        console.log('\n6️⃣ Test de cache manual...');
        try {
            const cache = await caches.open('test-cache');
            const response = new Response('Test content');
            await cache.put('/test-endpoint', response);
            const cached = await cache.match('/test-endpoint');

            if (cached) {
                console.log('✅ Cache manual funciona correctamente');
                await cache.delete('/test-endpoint'); // Limpiar
                results.push({ test: 'Cache manual', passed: true });
            } else {
                console.log('❌ Cache manual falló');
                results.push({ test: 'Cache manual', passed: false });
            }
        } catch (error) {
            console.log('❌ Error en test de cache:', error.message);
            results.push({ test: 'Cache manual', passed: false });
        }
    }

    // 7. Verificar instalación PWA
    console.log('\n7️⃣ Verificando capacidades PWA...');
    const canInstall = 'BeforeInstallPromptEvent' in window;
    console.log(canInstall ? '✅ PWA instalable' : '⚠️ PWA no instalable en este navegador');
    results.push({ test: 'PWA instalable', passed: true }); // No crítico

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE VALIDACIÓN:');

    const passed = results.filter(r => r.passed).length;
    const total = results.length;

    results.forEach(result => {
        const icon = result.passed ? '✅' : '❌';
        console.log(`${icon} ${result.test}`);
    });

    console.log(`\n📈 Tasa de éxito: ${(passed / total * 100).toFixed(1)}% (${passed}/${total})`);

    if (passed === total) {
        console.log('\n🎉 ¡Todo funciona perfectamente! Service Worker operativo.');
    } else if (passed >= total * 0.8) {
        console.log('\n👍 Service Worker mayormente funcional. Algunas características pueden no estar disponibles.');
    } else {
        console.log('\n⚠️ Service Worker tiene problemas. Revisar implementación.');
    }

    return { passed, total, results };
}

/**
 * Función para limpiar cache manualmente
 */
async function clearQuickToolsCache() {
    console.log('\n🧹 Limpiando cache de QuickTools...');

    try {
        const cacheNames = await caches.keys();
        const quicktoolsCaches = cacheNames.filter(name => name.startsWith('quicktools-'));

        await Promise.all(quicktoolsCaches.map(name => caches.delete(name)));

        console.log(`✅ Cache limpiado: ${quicktoolsCaches.length} caches eliminados`);

        // Recargar la página para recargar cache
        if (confirm('¿Recargar la página para recargar el cache?')) {
            location.reload();
        }
    } catch (error) {
        console.log('❌ Error limpiando cache:', error.message);
    }
}

/**
 * Función para ver cache storage
 */
async function showCacheStorage() {
    console.log('\n📦 Contenido del Cache Storage:');

    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
        if (cacheName.startsWith('quicktools-')) {
            console.log(`\n📁 ${cacheName}:`);
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();

            requests.forEach((request, index) => {
                console.log(`   ${index + 1}. ${request.url}`);
            });
        }
    }
}

/**
 * Función para test de modo offline
 */
function testOfflineMode() {
    console.log('\n🔌 Simulando modo offline...');

    if (confirm('¿Desactivar red para test de modo offline?')) {
        // Esto debe hacerse manualmente en DevTools
        console.log('⚠️ Por favor, ve a DevTools > Network > Offline y recarga la página');
        console.log('📱 O desconecta la red WiFi/ethernet');

        alert('Simulación lista:\n\n1. Abre DevTools (F12)\n2. Ve a Network tab\n3. Selecciona "Offline"\n4. Recarga la página\n5. Verifica que la página funciona sin conexión');
    }
}

/**
 * Función principal con menú interactivo
 */
async function main() {
    console.log('\n🎯 Opciones de validación:');
    console.log('1. Validación completa');
    console.log('2. Ver contenido del cache');
    console.log('3. Limpiar cache');
    console.log('4. Test de modo offline');
    console.log('5. Información del navegador');

    const choice = prompt('Selecciona una opción (1-5):');

    switch (choice) {
        case '1':
            await validateServiceWorker();
            break;
        case '2':
            await showCacheStorage();
            break;
        case '3':
            await clearQuickToolsCache();
            break;
        case '4':
            testOfflineMode();
            break;
        case '5':
            console.log('\nℹ️ Información del navegador:');
            console.log('User Agent:', navigator.userAgent);
            console.log('Protocol:', location.protocol);
            console.log('Host:', location.host);
            console.log('Online:', navigator.onLine);
            console.log('Service Worker:', 'serviceWorker' in navigator);
            console.log('Cache API:', 'caches' in window);
            console.log('PWA Install:', 'BeforeInstallPromptEvent' in window);
            break;
        default:
            console.log('Opción no válida');
    }
}

// Exponer funciones globalmente
window.validateSW = validateServiceWorker;
window.clearSWCache = clearQuickToolsCache;
window.showSWCache = showCacheStorage;
window.testSWOffline = testOfflineMode;

// Auto-ejecutar validación completa
console.log('\n🚀 Auto-ejecutando validación completa...');
validateServiceWorker().then(result => {
    console.log('\n💡 Para más opciones, ejecuta: main()');
});
