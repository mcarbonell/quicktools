/**
 * Build Extension Tools - Copia y adapta herramientas de web a extensión
 * Mantiene un solo código fuente (web) y genera versiones para extensión
 */

const fs = require('fs');
const path = require('path');

const WEB_DIR = path.join(__dirname, '../web');
const EXT_DIR = path.join(__dirname, '../extension');

// Herramientas IA a copiar
const AI_TOOLS = [
    'chat-ai',
    'summarize-text-ai',
    'improve-text-ai',
    'chat-pdf',
    'vision-chat-ai',
    'translate-ai',
    'image-generator-ai',
    'image-editor-ai'
];

console.log('🏗️  Building extension tools from web sources...\n');

// 1. Copiar archivos compartidos
console.log('📦 Copying shared files...');
copySharedFiles();

// 2. Generar HTMLs simplificados para extensión
console.log('📄 Generating extension HTML files...');
AI_TOOLS.forEach(tool => {
    generateExtensionHTML(tool);
});

console.log('\n✅ Extension tools built successfully!');

// ====================
// FUNCIONES
// ====================

function copySharedFiles() {
    // Copiar gemini-api.js
    copyFile(
        path.join(WEB_DIR, 'js/lib/gemini-api.js'),
        path.join(EXT_DIR, 'shared/gemini-api.js')
    );
    
    // Copiar chat-ui.js si existe
    const chatUIPath = path.join(WEB_DIR, 'js/lib/chat-ui.js');
    if (fs.existsSync(chatUIPath)) {
        copyFile(chatUIPath, path.join(EXT_DIR, 'shared/chat-ui.js'));
    }
    
    console.log('  ✓ Shared JS files copied');
}

function generateExtensionHTML(toolName) {
    const webHTMLPath = path.join(WEB_DIR, `${toolName}.html`);
    const extHTMLPath = path.join(EXT_DIR, `tools/ai/${toolName}.html`);
    
    if (!fs.existsSync(webHTMLPath)) {
        console.log(`  ⚠️  ${toolName}.html not found in web, skipping`);
        return;
    }
    
    let html = fs.readFileSync(webHTMLPath, 'utf8');
    
    // Extraer solo el contenido del tool (entre tool-header y seo-content)
    const toolHeaderMatch = html.match(/<div class="tool-header">([\s\S]*?)<\/div>/);
    const contentMatch = html.match(/<div id="apiKeySetup"[\s\S]*?(?=<div class="seo-content|<script src="https:\/\/cdn.jsdelivr.net\/npm\/bootstrap))/);
    const scriptsMatch = html.match(/<script>\s*window\.toolTranslations[\s\S]*?<\/script>\s*<script src="\/js\/lib\/gemini-api\.js"><\/script>\s*<script>[\s\S]*?<\/script>/);
    
    if (!contentMatch) {
        console.log(`  ⚠️  Could not extract content from ${toolName}.html`);
        return;
    }
    
    // Generar HTML simplificado para extensión
    const extensionHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${getToolTitle(toolName)}</title>
    <link rel="stylesheet" href="../../shared/extension-styles.css">
</head>
<body>
    <div class="container">
        ${toolHeaderMatch ? toolHeaderMatch[0] : ''}
        ${contentMatch[0]}
    </div>

    ${scriptsMatch ? scriptsMatch[0] : ''}
    <script src="../../shared/gemini-api.js"></script>
    <script src="../../shared/extension-adapter.js"></script>
</body>
</html>`;
    
    // Crear directorio si no existe
    const extToolDir = path.dirname(extHTMLPath);
    if (!fs.existsSync(extToolDir)) {
        fs.mkdirSync(extToolDir, { recursive: true });
    }
    
    fs.writeFileSync(extHTMLPath, extensionHTML, 'utf8');
    console.log(`  ✓ ${toolName}.html generated`);
}

function getToolTitle(toolName) {
    const titles = {
        'chat-ai': 'AI Chat',
        'summarize-text-ai': 'Summarize Text with AI',
        'improve-text-ai': 'Improve Text with AI',
        'chat-pdf': 'Chat with PDF',
        'vision-chat-ai': 'AI Vision Chat',
        'translate-ai': 'AI Translator',
        'image-generator-ai': 'AI Image Generator',
        'image-editor-ai': 'AI Image Editor'
    };
    return titles[toolName] || toolName;
}

function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
}
