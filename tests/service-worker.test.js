// tests/service-worker.test.js - Tests para Service Worker
// Ejecutar con: node tests/service-worker.test.js

const fs = require('fs').promises;
const path = require('path');

console.log('🧪 Iniciando tests del Service Worker...\n');

// Test 1: Verificar que el archivo sw.js existe
async function testSWFileExists() {
    console.log('Test 1: Verificando archivo sw.js...');

    try {
        const swPath = path.join(__dirname, '..', 'sw.js');
        const content = await fs.readFile(swPath, 'utf8');

        // Verificar contenido crítico
        const requiredElements = [
            'CACHE_NAME',
            'STATIC_CACHE',
            'DYNAMIC_CACHE',
            'addEventListener(\'install\'',
            'addEventListener(\'activate\'',
            'addEventListener(\'fetch\'',
            'cacheFirst',
            'networkFirst'
        ];

        const missingElements = requiredElements.filter(element => !content.includes(element));

        if (missingElements.length === 0) {
            console.log('✅ sw.js existe y contiene todos los elementos requeridos');
            return true;
        } else {
            console.log('❌ sw.js falta elementos:', missingElements);
            return false;
        }
    } catch (error) {
        console.log('❌ Error leyendo sw.js:', error.message);
        return false;
    }
}

// Test 2: Verificar registro en base.html
async function testSWRegistration() {
    console.log('\nTest 2: Verificando registro en base.html...');

    try {
        const basePath = path.join(__dirname, '..', 'templates', 'base.html');
        const content = await fs.readFile(basePath, 'utf8');

        const hasRegistration = content.includes('serviceWorker.register') &&
            content.includes('/sw.js');

        if (hasRegistration) {
            console.log('✅ Registro del Service Worker encontrado en base.html');
            return true;
        } else {
            console.log('❌ Registro del Service Worker NO encontrado en base.html');
            return false;
        }
    } catch (error) {
        console.log('❌ Error leyendo base.html:', error.message);
        return false;
    }
}

// Test 3: Verificar registro en index-base.html
async function testSWRegistrationIndex() {
    console.log('\nTest 3: Verificando registro en index-base.html...');

    try {
        const indexPath = path.join(__dirname, '..', 'templates', 'index-base.html');
        const content = await fs.readFile(indexPath, 'utf8');

        const hasRegistration = content.includes('serviceWorker.register') &&
            content.includes('/sw.js');

        if (hasRegistration) {
            console.log('✅ Registro del Service Worker encontrado en index-base.html');
            return true;
        } else {
            console.log('❌ Registro del Service Worker NO encontrado en index-base.html');
            return false;
        }
    } catch (error) {
        console.log('❌ Error leyendo index-base.html:', error.message);
        return false;
    }
}

// Test 4: Verificar cache-utils.js
async function testCacheUtils() {
    console.log('\nTest 4: Verificando cache-utils.js...');

    try {
        const utilsPath = path.join(__dirname, '..', 'js', 'cache-utils.js');
        const content = await fs.readFile(utilsPath, 'utf8');

        const requiredClasses = ['CacheManager', 'NetworkManager', 'PWAInstaller'];
        const missingClasses = requiredClasses.filter(cls => !content.includes(`class ${cls}`));

        if (missingClasses.length === 0) {
            console.log('✅ cache-utils.js existe y contiene todas las clases requeridas');
            return true;
        } else {
            console.log('❌ cache-utils.js falta clases:', missingClasses);
            return false;
        }
    } catch (error) {
        console.log('❌ Error leyendo cache-utils.js:', error.message);
        return false;
    }
}

// Test 5: Verificar service-worker.js utilities
async function testServiceWorkerUtils() {
    console.log('\nTest 5: Verificando service-worker.js...');

    try {
        const utilsPath = path.join(__dirname, '..', 'js', 'service-worker.js');
        const content = await fs.readFile(utilsPath, 'utf8');

        const requiredFunctions = [
            'registerSW',
            'updateSW',
            'getSWInfo',
            'clearCache',
            'debugSW'
        ];

        const missingFunctions = requiredFunctions.filter(fn => !content.includes(`function ${fn}`) && !content.includes(`${fn} =`));

        if (missingFunctions.length === 0) {
            console.log('✅ service-worker.js existe y contiene todas las funciones requeridas');
            return true;
        } else {
            console.log('❌ service-worker.js falta funciones:', missingFunctions);
            return false;
        }
    } catch (error) {
        console.log('❌ Error leyendo service-worker.js:', error.message);
        return false;
    }
}

// Test 6: Verificar estructura de directorios
async function testDirectoryStructure() {
    console.log('\nTest 6: Verificando estructura de directorios...');

    const requiredPaths = [
        path.join(__dirname, '..', 'sw.js'),
        path.join(__dirname, '..', 'js', 'service-worker.js'),
        path.join(__dirname, '..', 'js', 'cache-utils.js'),
        path.join(__dirname, '..', 'templates', 'base.html'),
        path.join(__dirname, '..', 'templates', 'index-base.html')
    ];

    let allExist = true;

    for (const filePath of requiredPaths) {
        try {
            await fs.access(filePath);
            console.log(`✅ ${path.basename(filePath)} existe`);
        } catch (error) {
            console.log(`❌ ${path.basename(filePath)} NO existe`);
            allExist = false;
        }
    }

    return allExist;
}

// Test 7: Verificar configuración de cache
async function testCacheConfiguration() {
    console.log('\nTest 7: Verificando configuración de cache...');

    try {
        const swPath = path.join(__dirname, '..', 'sw.js');
        const content = await fs.readFile(swPath, 'utf8');

        // Verificar configuración de cache
        const hasStaticAssets = content.includes('STATIC_ASSETS');
        const hasCacheStrategies = content.includes('cacheFirst') && content.includes('networkFirst');
        const hasOfflinePage = content.includes('getOfflinePage');

        if (hasStaticAssets && hasCacheStrategies && hasOfflinePage) {
            console.log('✅ Configuración de cache completa');
            return true;
        } else {
            console.log('❌ Configuración de cache incompleta');
            return false;
        }
    } catch (error) {
        console.log('❌ Error verificando configuración:', error.message);
        return false;
    }
}

// Función principal de testing
async function runTests() {
    console.log('🚀 QuickTools Service Worker - Suite de Tests\n');
    console.log('='.repeat(50));

    const tests = [
        { name: 'Archivo sw.js', test: testSWFileExists },
        { name: 'Registro en base.html', test: testSWRegistration },
        { name: 'Registro en index-base.html', test: testSWRegistrationIndex },
        { name: 'Cache utilities', test: testCacheUtils },
        { name: 'Service Worker utilities', test: testServiceWorkerUtils },
        { name: 'Estructura de directorios', test: testDirectoryStructure },
        { name: 'Configuración de cache', test: testCacheConfiguration }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            const result = await test.test();
            if (result) {
                passed++;
            } else {
                failed++;
            }
        } catch (error) {
            console.log(`❌ Error ejecutando ${test.name}:`, error.message);
            failed++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE TESTS:');
    console.log(`✅ Pasados: ${passed}`);
    console.log(`❌ Fallidos: ${failed}`);
    console.log(`📈 Tasa de éxito: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed === 0) {
        console.log('\n🎉 ¡Todos los tests pasaron! Service Worker listo para usar.');
        console.log('\n📋 Próximos pasos:');
        console.log('1. Abrir la aplicación en el navegador');
        console.log('2. Abrir DevTools > Application > Service Workers');
        console.log('3. Verificar que el SW está registrado y activo');
        console.log('4. Probar modo offline (Network > Offline)');
        console.log('5. Verificar cache en Application > Cache Storage');
    } else {
        console.log('\n⚠️ Algunos tests fallaron. Revisar implementación.');
    }

    return failed === 0;
}

// Ejecutar tests si se llama directamente
if (require.main === module) {
    runTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { runTests };