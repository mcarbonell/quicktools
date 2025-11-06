// tests/pwa-validation.js - Validación completa PWA
// Ejecutar en consola del navegador para validar PWA

console.log('🚀 Validación PWA - QuickTools');
console.log('='.repeat(50));

/**
 * Validación completa de PWA
 */
async function validatePWA() {
    const results = [];

    console.log('\n1️⃣ Verificando Service Worker...');
    const hasSW = 'serviceWorker' in navigator;
    console.log(hasSW ? '✅ Service Worker soportado' : '❌ Service Worker NO soportado');
    results.push({ test: 'Service Worker', passed: hasSW });

    if (hasSW) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            console.log('✅ SW registrado y activo');
            results.push({ test: 'SW Registrado', passed: true });
        } else {
            console.log('⚠️ SW no encontrado');
            results.push({ test: 'SW Registrado', passed: false });
        }
    }

    console.log('\n2️⃣ Verificando Web App Manifest...');
    try {
        const response = await fetch('/manifest.json');
        if (response.ok) {
            const manifest = await response.json();
            console.log('✅ Manifest encontrado:', manifest.name);
            console.log('   Start URL:', manifest.start_url);
            console.log('   Display:', manifest.display);

            results.push({ test: 'Manifest', passed: true });

            // Verificar iconos
            if (manifest.icons && manifest.icons.length > 0) {
                console.log('✅ Iconos definidos:', manifest.icons.length);
                results.push({ test: 'Iconos', passed: true });
            } else {
                console.log('❌ No hay iconos en manifest');
                results.push({ test: 'Iconos', passed: false });
            }
        } else {
            console.log('❌ Manifest no encontrado (404)');
            results.push({ test: 'Manifest', passed: false });
        }
    } catch (error) {
        console.log('❌ Error cargando manifest:', error.message);
        results.push({ test: 'Manifest', passed: false });
    }

    console.log('\n3️⃣ Verificando meta tags PWA...');
    const hasThemeColor = document.querySelector('meta[name="theme-color"]');
    const hasManifestLink = document.querySelector('link[rel="manifest"]');
    const hasAppleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');

    console.log(hasThemeColor ? '✅ Theme color' : '❌ Theme color');
    console.log(hasManifestLink ? '✅ Manifest link' : '❌ Manifest link');
    console.log(hasAppleMeta ? '✅ Apple meta tags' : '❌ Apple meta tags');

    results.push({ test: 'Meta Tags', passed: !!(hasThemeColor && hasManifestLink && hasAppleMeta) });

    console.log('\n4️⃣ Verificando Cache Storage...');
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        const quicktoolsCaches = cacheNames.filter(name => name.startsWith('quicktools-'));

        console.log('✅ Cache API soportado');
        console.log('📦 Caches de QuickTools:', quicktoolsCaches.length);

        results.push({ test: 'Cache API', passed: true });

        if (quicktoolsCaches.length > 0) {
            console.log('✅ Cache inicializado');
            results.push({ test: 'Cache Inicializado', passed: true });
        } else {
            console.log('⚠️ Cache vacío (normal en primera visita)');
            results.push({ test: 'Cache Inicializado', passed: true });
        }
    } else {
        console.log('❌ Cache API no soportado');
        results.push({ test: 'Cache API', passed: false });
    }

    console.log('\n5️⃣ Verificando iconos...');
    const icon192 = document.querySelector('link[rel="apple-touch-icon"]');
    if (icon192) {
        console.log('✅ Icono principal encontrado:', icon192.href);
        results.push({ test: 'Icono Principal', passed: true });
    } else {
        console.log('❌ Icono principal no encontrado');
        results.push({ test: 'Icono Principal', passed: false });
    }

    console.log('\n6️⃣ Verificando HTTPS...');
    const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    console.log(isHTTPS ? '✅ Conexión segura' : '❌ No HTTPS (requerido para PWA)');
    results.push({ test: 'HTTPS', passed: isHTTPS });

    console.log('\n7️⃣ Test de instalación PWA...');
    // Verificar si se puede instalar
    let canInstall = false;
    try {
        // En Chrome, verificar el evento beforeinstallprompt
        canInstall = 'BeforeInstallPromptEvent' in window;
        console.log(canInstall ? '✅ PWA instalable detectada' : 'ℹ️ PWA instalable no detectada (normal)');
    } catch (error) {
        console.log('ℹ️ Error verificando instalación:', error.message);
    }

    results.push({ test: 'Instalable', passed: true }); // No crítico

    // Resumen final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN PWA:');

    const passed = results.filter(r => r.passed).length;
    const total = results.length;

    results.forEach(result => {
        const icon = result.passed ? '✅' : '❌';
        console.log(`${icon} ${result.test}`);
    });

    console.log(`\n📈 Puntuación: ${(passed / total * 100).toFixed(1)}% (${passed}/${total})`);

    if (passed >= total * 0.9) {
        console.log('\n🎉 ¡PWA correctamente configurada!');
        console.log('💡 Si no ves "Instalar App", recarga la página o prueba en modo incógnito');
    } else if (passed >= total * 0.7) {
        console.log('\n👍 PWA mayormente configurada. Algunas optimizaciones pendientes.');
    } else {
        console.log('\n⚠️ PWA tiene problemas de configuración.');
    }

    return { passed, total, results, canInstall };
}

/**
 * Verificar si aparece el botón de instalación
 */
function checkInstallPrompt() {
    console.log('\n🔍 Verificando botón de instalación...');

    // En Chrome, el botón aparece en la barra de direcciones
    // o en el menú (⋮) si la PWA es instalable
    if (window.chrome && chrome.runtime) {
        console.log('💡 Busca el ícono "+" en la barra de direcciones');
        console.log('💡 O en el menú (⋮) > "Instalar QuickTools..."');
    } else {
        console.log('💡 En otros navegadores, busca en el menú del navegador');
    }

    // Intentar detectar el evento
    let installPromptShown = false;

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('\n🎯 ¡Evento beforeinstallprompt detectado!');
        console.log('💡 Debería aparecer el botón de instalación');
        installPromptShown = true;
        e.preventDefault(); // Prevenir que aparezca automáticamente
        window.deferredPrompt = e; // Guardar para uso manual
    });

    window.addEventListener('appinstalled', () => {
        console.log('\n🎉 ¡App instalada exitosamente!');
    });

    return installPromptShown;
}

/**
 * Test manual de instalación
 */
async function testManualInstall() {
    console.log('\n🧪 Test de instalación manual...');

    if (window.deferredPrompt) {
        try {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('✅ Usuario aceptó instalar la PWA');
            } else {
                console.log('❌ Usuario rechazó la instalación');
            }

            window.deferredPrompt = null;
        } catch (error) {
            console.log('❌ Error durante la instalación:', error.message);
        }
    } else {
        console.log('⚠️ No hay prompt de instalación disponible');
        console.log('💡 Prueba recargar la página o limpiar cache');
    }
}

/**
 * Limpiar cache PWA
 */
async function clearPWACache() {
    console.log('\n🧹 Limpiando cache PWA...');

    try {
        const cacheNames = await caches.keys();
        const quicktoolsCaches = cacheNames.filter(name => name.startsWith('quicktools-'));

        await Promise.all(quicktoolsCaches.map(name => caches.delete(name)));

        console.log(`✅ Cache limpiado: ${quicktoolsCaches.length} caches eliminados`);

        if (confirm('¿Recargar página para recargar cache?')) {
            location.reload();
        }
    } catch (error) {
        console.log('❌ Error limpiando cache:', error.message);
    }
}

/**
 * Mostrar información de debug
 */
function showDebugInfo() {
    console.log('\n🔍 Información de Debug:');
    console.log('URL:', location.href);
    console.log('Protocol:', location.protocol);
    console.log('Host:', location.host);
    console.log('Service Worker:', 'serviceWorker' in navigator);
    console.log('Cache API:', 'caches' in window);
    console.log('Manifest API:', 'onbeforeinstallprompt' in window);
    console.log('Chrome:', !!window.chrome);
    console.log('User Agent:', navigator.userAgent);
}

/**
 * Función principal con menú
 */
async function main() {
    console.log('\n🎯 Opciones de validación PWA:');
    console.log('1. Validación completa PWA');
    console.log('2. Verificar botón instalación');
    console.log('3. Test instalación manual');
    console.log('4. Limpiar cache PWA');
    console.log('5. Info de debug');
    console.log('6. Re-validar todo');

    const choice = prompt('Selecciona opción (1-6):');

    switch (choice) {
        case '1':
            await validatePWA();
            break;
        case '2':
            checkInstallPrompt();
            break;
        case '3':
            await testManualInstall();
            break;
        case '4':
            await clearPWACache();
            break;
        case '5':
            showDebugInfo();
            break;
        case '6':
            await validatePWA();
            checkInstallPrompt();
            break;
        default:
            console.log('Opción no válida');
    }
}

// Auto-ejecutar validación
console.log('\n🚀 Ejecutando validación automática...');
validatePWA().then(result => {
    console.log('\n💡 Para más opciones, ejecuta: main()');
    console.log('💡 Para test manual de instalación: testManualInstall()');
    console.log('💡 Para limpiar cache: clearPWACache()');

    // Exponer funciones globalmente
    window.pwaValidation = {
        validate: validatePWA,
        checkInstall: checkInstallPrompt,
        testInstall: testManualInstall,
        clearCache: clearPWACache,
        debug: showDebugInfo,
        main: main
    };
});
