/**
 * Sync Shared Libraries - Sincroniza código compartido entre web y extensión
 * Copia librerías desde web/js/lib/ a extension/shared/
 */

const fs = require('fs');
const path = require('path');

const SHARED_LIBS = [
    'gemini-api.js',
    'chat-ui.js',
    'summarize-ui.js',
    'improve-text-ui.js',
    'vision-chat-ui.js',
    'translate-ui.js'
];

const SOURCE_DIR = path.join(__dirname, '../../web/js/lib');
const TARGET_DIR = path.join(__dirname, '../../extension/shared');

console.log('🔄 Sincronizando librerías compartidas...\n');

let copied = 0;
let errors = 0;

SHARED_LIBS.forEach(file => {
    const source = path.join(SOURCE_DIR, file);
    const target = path.join(TARGET_DIR, file);
    
    try {
        if (!fs.existsSync(source)) {
            console.log(`⚠️  ${file} - No existe en web/js/lib/`);
            errors++;
            return;
        }
        
        fs.copyFileSync(source, target);
        console.log(`✅ ${file} - Copiado correctamente`);
        copied++;
    } catch (error) {
        console.log(`❌ ${file} - Error: ${error.message}`);
        errors++;
    }
});

console.log(`\n📊 Resultado: ${copied} copiados, ${errors} errores`);

if (errors > 0) {
    process.exit(1);
}
