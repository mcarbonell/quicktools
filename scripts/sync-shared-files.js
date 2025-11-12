/**
 * Sync Shared Files - Copia archivos compartidos desde build/shared a web y extension
 */

const fs = require('fs');
const path = require('path');

const BUILD_SHARED = path.join(__dirname, '../build/shared');
const WEB_LIB = path.join(__dirname, '../web/js/lib');
const EXT_SHARED = path.join(__dirname, '../extension/shared');

console.log('🔄 Syncing shared files...\n');

// Archivos a sincronizar
const files = [
    'gemini-api.js',
    'chat-ai.js',
    'image-generator-ai.js',
    'image-editor-ai.js'
];

files.forEach(file => {
    const src = path.join(BUILD_SHARED, file);
    
    if (!fs.existsSync(src)) {
        console.log(`  ⚠️  ${file} not found in build/shared`);
        return;
    }
    
    // Copiar a web (lib para gemini-api, tools para herramientas)
    const webDest = file === 'gemini-api.js' 
        ? path.join(WEB_LIB, file)
        : path.join(__dirname, '../web/js/tools', file);
    fs.copyFileSync(src, webDest);
    const webPath = file === 'gemini-api.js' ? 'web/js/lib/' : 'web/js/tools/';
    console.log(`  ✓ ${file} → ${webPath}`);
    
    // Copiar a extension (shared para gemini-api, tools/ai para herramientas)
    const extDest = file === 'gemini-api.js'
        ? path.join(EXT_SHARED, file)
        : path.join(__dirname, '../extension/tools/ai', file);
    fs.copyFileSync(src, extDest);
    const extPath = file === 'gemini-api.js' ? 'extension/shared/' : 'extension/tools/ai/';
    console.log(`  ✓ ${file} → ${extPath}`);
});

console.log('\n✅ Shared files synced!');
