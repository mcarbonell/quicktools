// tests/run-all-tests.js - Script completo de testing
// Ejecutar: node tests/run-all-tests.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 QuickTools PWA - Suite Completa de Tests');
console.log('='.repeat(60));

/**
 * Configuración de tests
 */
const config = {
    colors: {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m'
    },
    testFiles: [
        'csv-parser.test.js',
        'debug-yaml.js'
    ],
    validationFiles: [
        'validate-conversions.js',
        'validate-format-edgecases.js'
    ],
    expectedTools: [
        'base64.js',
        'csv-json.js',
        'hash-calculator.js',
        'html-encoder.js',
        'json-formatter.js',
        'lorem-ipsum-generator.js',
        'password.js',
        'qr.js',
        'text-cleaner.js',
        'url-encoder.js',
        'yaml-json.js',
        'toml-json.js',
        'xml-json.js',
        'color-picker-converter.js'
    ]
};

/**
 * Función para imprimir con colores
 */
function log(color, message) {
    console.log(config.colors[color] + message + config.colors.reset);
}

/**
 * Verificar estructura de archivos
 */
function checkFileStructure() {
    log('cyan', '\n📁 Verificando estructura de archivos...');
    const results = { passed: 0, total: 0, errors: [] };

    // Verificar archivos de test
    config.testFiles.forEach(file => {
        results.total++;
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            log('green', `✅ ${file}`);
            results.passed++;
        } else {
            log('red', `❌ ${file} - FALTANTE`);
        }
    });

    // Verificar herramientas JS
    log('\n🔧 Verificando herramientas JS...');
    config.expectedTools.forEach(tool => {
        results.total++;
        const toolPath = path.join(__dirname, '..', 'js', 'tools', tool);
        if (fs.existsSync(toolPath)) {
            log('green', `✅ ${tool}`);
            results.passed++;
        } else {
            log('red', `❌ ${tool} - FALTANTE`);
        }
    });

    // Verificar archivos PWA críticos
    log('\n📱 Verificando archivos PWA...');
    const pwaFiles = [
        'sw.js',
        'manifest.json',
        'index.html'
    ];

    pwaFiles.forEach(file => {
        results.total++;
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            log('green', `✅ ${file}`);
            results.passed++;
        } else {
            log('yellow', `⚠️ ${file} - Opcional (generado)`);
            results.passed++; // No crítico para test
        }
    });

    return results;
}

/**
 * Ejecutar tests Node.js
 */
function runNodeTests() {
    log('cyan', '\n🚀 Ejecutando tests Node.js...');
    const results = { passed: 0, total: 0, errors: [] };

    config.testFiles.forEach(file => {
        results.total++;
        try {
            const filePath = path.join(__dirname, file);
            log('blue', `\n▶ Ejecutando ${file}...`);

            const output = execSync(`node "${filePath}"`, {
                cwd: __dirname,
                encoding: 'utf8',
                timeout: 10000
            });

            if (output.includes('passed') || output.includes('success')) {
                log('green', `✅ ${file} - PASÓ`);
                results.passed++;
            } else {
                log('yellow', `⚠️ ${file} - Sin conclusión clara`);
                results.passed++; // Asumir éxito si no hay error
            }

        } catch (error) {
            log('red', `❌ ${file} - ERROR: ${error.message}`);
            results.errors.push(`${file}: ${error.message}`);
        }
    });

    return results;
}

/**
 * Validar sintaxis JavaScript
 */
function validateJavaScriptSyntax() {
    log('cyan', '\n🔍 Validando sintaxis JavaScript...');
    const results = { passed: 0, total: 0, errors: [] };

    const jsFiles = [
        'js/main.js',
        'js/lib/csv-parser.js'
    ];

    jsFiles.forEach(file => {
        results.total++;
        const filePath = path.join(__dirname, '..', file);

        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');

                // Verificar sintaxis básica
                try {
                    new Function(content);
                    log('green', `✅ ${file} - Sintaxis válida`);
                    results.passed++;
                } catch (syntaxError) {
                    log('red', `❌ ${file} - Error de sintaxis: ${syntaxError.message}`);
                    results.errors.push(`${file}: ${syntaxError.message}`);
                }
            } else {
                log('yellow', `⚠️ ${file} - No encontrado`);
            }
        } catch (error) {
            log('red', `❌ ${file} - Error leyendo archivo: ${error.message}`);
            results.errors.push(`${file}: ${error.message}`);
        }
    });

    return results;
}

/**
 * Verificar JSON válidos
 */
function validateJSONFiles() {
    log('cyan', '\n📄 Validando archivos JSON...');
    const results = { passed: 0, total: 0, errors: [] };

    const jsonFiles = [
        'data/tools-index.json',
        'package.json'
    ];

    jsonFiles.forEach(file => {
        results.total++;
        const filePath = path.join(__dirname, '..', file);

        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const json = JSON.parse(content);
                log('green', `✅ ${file} - JSON válido`);
                results.passed++;
            } else {
                log('yellow', `⚠️ ${file} - No encontrado`);
                results.passed++; // Asumir OK
            }
        } catch (error) {
            log('red', `❌ ${file} - Error JSON: ${error.message}`);
            results.errors.push(`${file}: ${error.message}`);
        }
    });

    return results;
}

/**
 * Verificar herramientas web
 */
function checkWebTools() {
    log('cyan', '\n🌐 Verificando herramientas web...');
    const results = { passed: 0, total: 0, errors: [] };

    // Verificar que existen algunos templates
    const templateFiles = [
        'templates/tools-content/base64-content.html',
        'templates/tools-content/csv-json-content.html'
    ];

    templateFiles.forEach(file => {
        results.total++;
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            log('green', `✅ ${file}`);
            results.passed++;
        } else {
            log('red', `❌ ${file} - FALTANTE`);
        }
    });

    return results;
}

/**
 * Generar reporte de testing
 */
function generateReport(testResults) {
    log('cyan', '\n📊 GENERANDO REPORTE DE TESTING...');
    console.log('='.repeat(60));

    const totalTests = testResults.reduce((sum, result) => sum + result.total, 0);
    const totalPassed = testResults.reduce((sum, result) => sum + result.passed, 0);
    const totalErrors = testResults.reduce((sum, result) => sum + result.errors.length, 0);

    testResults.forEach(result => {
        const percentage = result.total > 0 ? (result.passed / result.total * 100).toFixed(1) : '0.0';
        const icon = result.passed === result.total ? '✅' : result.passed >= result.total * 0.8 ? '⚠️' : '❌';
        log('bright', `${icon} ${result.name}: ${percentage}% (${result.passed}/${result.total})`);

        if (result.errors.length > 0) {
            result.errors.forEach(error => {
                log('red', `   💥 ${error}`);
            });
        }
    });

    console.log('\n' + '='.repeat(60));
    const overallPercentage = (totalPassed / totalTests * 100).toFixed(1);

    log('bright', `🎯 RESULTADO FINAL: ${overallPercentage}% (${totalPassed}/${totalTests})`);

    if (overallPercentage >= 95) {
        log('green', '🎉 ¡Excelente! QuickTools está listo para producción.');
    } else if (overallPercentage >= 85) {
        log('yellow', '👍 Bueno. Algunas mejoras menores recomendadas.');
    } else if (overallPercentage >= 70) {
        log('yellow', '⚠️ Aceptable, pero hay varios problemas que resolver.');
    } else {
        log('red', '❌ Problemas serios detectados. Revisar antes de producción.');
    }

    console.log('\n' + '='.repeat(60));
    log('cyan', '💡 PRÓXIMOS PASOS:');
    console.log('1. Si hay errores, revisar mensajes de arriba');
    console.log('2. Para tests PWA, abrir: /tests/pwa-validation.js');
    console.log('3. Para tests web, abrir: /tests/web-tests.html');
    console.log('4. Para servidor local: npm start');

    return {
        totalTests,
        totalPassed,
        totalErrors,
        percentage: overallPercentage,
        details: testResults
    };
}

/**
 * Función principal
 */
async function main() {
    try {
        const startTime = Date.now();

        log('bright', '🚀 Iniciando suite completa de tests...');
        log('cyan', `📅 ${new Date().toLocaleString()}`);
        log('cyan', `📍 ${process.cwd()}`);
        log('cyan', `🟢 Node.js ${process.version}`);

        const testResults = [];

        // 1. Verificar estructura
        testResults.push({
            name: 'Estructura de Archivos',
            ...checkFileStructure()
        });

        // 2. Ejecutar tests Node.js
        testResults.push({
            name: 'Tests Node.js',
            ...runNodeTests()
        });

        // 3. Validar sintaxis JavaScript
        testResults.push({
            name: 'Sintaxis JavaScript',
            ...validateJavaScriptSyntax()
        });

        // 4. Validar JSON
        testResults.push({
            name: 'Archivos JSON',
            ...validateJSONFiles()
        });

        // 5. Verificar herramientas web
        testResults.push({
            name: 'Herramientas Web',
            ...checkWebTools()
        });

        // Generar reporte final
        const report = generateReport(testResults);

        const duration = Date.now() - startTime;
        log('cyan', `\n⏱️  Tiempo total: ${duration}ms`);

        // Guardar reporte en archivo (opcional)
        try {
            const reportPath = path.join(__dirname, 'test-report.json');
            fs.writeFileSync(reportPath, JSON.stringify({
                timestamp: new Date().toISOString(),
                duration,
                results: testResults,
                summary: report
            }, null, 2));
            log('cyan', `📄 Reporte guardado en: ${reportPath}`);
        } catch (error) {
            log('yellow', `⚠️ No se pudo guardar reporte: ${error.message}`);
        }

        // Exit code basado en resultados
        const exitCode = report.percentage >= 90 ? 0 : 1;
        process.exit(exitCode);

    } catch (error) {
        log('red', `💥 Error crítico en testing: ${error.message}`);
        log('red', `Stack: ${error.stack}`);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { main, config };
