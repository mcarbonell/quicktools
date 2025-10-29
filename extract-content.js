const fs = require('fs').promises;
const path = require('path');

const projectRoot = 'C:\\Users\\mrcm_\\Local\\proj\\quicktools';
const backupDir = path.join(projectRoot, 'tools_backup');
const toolsContentDir = path.join(projectRoot, 'templates', 'tools-content');
const dataDir = path.join(projectRoot, 'data');
const toolsIndexPath = path.join(dataDir, 'tools-index.json');

async function extractToolContent() {
    try {
        const toolsIndex = JSON.parse(await fs.readFile(toolsIndexPath, 'utf8'));
        await fs.mkdir(toolsContentDir, { recursive: true });

        for (const tool of toolsIndex) {
            const toolSlug = tool.slug; // e.g., "tools/utils/color-picker-converter.html"
            const toolFileName = path.basename(toolSlug, '.html'); // e.g., "color-picker-converter"
            
            // Adjust path for backup dir structure. slug is "tools/category/file.html", backup is "tools_backup/category/file.html"
            const sourceHtmlPath = path.join(backupDir, ...toolSlug.split('/').slice(1));

            try {
                const htmlContent = await fs.readFile(sourceHtmlPath, 'utf8');

                // Regex to find the content within the main container, after the header
                const contentRegex = /<div class="container py-4">[\s\S]*?<p class="text-muted">.*?<\/p>\s*([\s\S]*?)\s*(<\/div>\s*<script|<body)/;
                const match = htmlContent.match(contentRegex);

                if (match && match[1]) {
                    let extractedContent = match[1].trim();

                    if (extractedContent) {
                        const outputContentPath = path.join(toolsContentDir, `${toolFileName}-content.html`);
                        await fs.writeFile(outputContentPath, extractedContent, 'utf8');
                        console.log(`Contenido extraído para ${toolFileName}`);
                    } else {
                        console.warn(`Advertencia: No se extrajo contenido para ${toolFileName}. El bloque de contenido podría estar vacío.`);
                    }
                } else {
                    console.warn(`Advertencia: No se pudo encontrar el patrón de contenido en ${sourceHtmlPath}.`);
                }
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.error(`Error: No se encontró el archivo HTML de origen: ${sourceHtmlPath}`);
                } else {
                    console.error(`Error procesando ${sourceHtmlPath}:`, error);
                }
            }
        }
        console.log('Proceso de extracción de contenido completado.');

    } catch (error) {
        console.error('Error durante la extracción de contenido:', error);
    }
}

extractToolContent();
