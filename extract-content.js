const fs = require('fs').promises;
const path = require('path');

const projectRoot = 'C:\\Users\\mrcm_\\Local\\proj\\quicktools\\web';
const backupDir = path.join(projectRoot, 'tools_backup');
const templatesDir = path.join(projectRoot, 'templates');
const toolsContentDir = path.join(templatesDir, 'tools-content');
const dataDir = path.join(projectRoot, 'data');
const toolsIndexPath = path.join(dataDir, 'tools-index.json');

async function extractParts(tool, sourceHtmlPath) {
    const toolFileName = path.basename(tool.slug, '.html');

    try {
        const htmlContent = await fs.readFile(sourceHtmlPath, 'utf8');

        // --- Head Extraction ---
        const headRegex = /<link rel="stylesheet" href="..\/..\/css\/style.css">\s*([\s\S]*?)\s*<\/head>/s;
        const headMatch = htmlContent.match(headRegex);
        if (headMatch && headMatch[1].trim()) {
            await fs.writeFile(path.join(toolsContentDir, `${toolFileName}-head.html`), headMatch[1].trim(), 'utf8');
            console.log(`-> Cabecera extraída para ${toolFileName}`);
        }

        // --- Body and Scripts Extraction (DOM-like string manipulation) ---
        const bodyStartTag = '<body>';
        const bodyEndTag = '</body>';
        let bodyStartIndex = htmlContent.indexOf(bodyStartTag);
        let bodyEndIndex = htmlContent.lastIndexOf(bodyEndTag);

        if (bodyStartIndex === -1 || bodyEndIndex === -1) {
            console.warn(`Advertencia: No se encontró <body> en ${toolFileName}.`);
            return;
        }

        const bodyContent = htmlContent.substring(bodyStartIndex + bodyStartTag.length, bodyEndIndex);

        const pEndTag = '</p>';
        const h1EndTag = '</h1>';
        const pEndIndex = bodyContent.lastIndexOf(pEndTag);
        const h1EndIndex = bodyContent.lastIndexOf(h1EndTag);

        let headerEndIndex = -1;
        if (pEndIndex !== -1 && pEndIndex < 300) { // Heuristic: header p is near the top
            headerEndIndex = pEndIndex + pEndTag.length;
        } else if (h1EndIndex !== -1 && h1EndIndex < 200) { // Heuristic: header h1 is near the top
            headerEndIndex = h1EndIndex + h1EndTag.length;
        }

        if (headerEndIndex === -1) {
            console.warn(`Advertencia: No se pudo determinar el final de la cabecera para ${toolFileName}.`);
            return;
        }

        const contentAndScripts = bodyContent.substring(headerEndIndex);
        const lastDivIndex = contentAndScripts.lastIndexOf('</div>');

        if (lastDivIndex !== -1) {
            const mainContent = contentAndScripts.substring(0, lastDivIndex).trim();
            const scriptsContent = contentAndScripts.substring(lastDivIndex + '</div>'.length).trim();

            if (mainContent) {
                await fs.writeFile(path.join(toolsContentDir, `${toolFileName}-content.html`), mainContent, 'utf8');
                console.log(`-> Contenido extraído para ${toolFileName}`);
            } else {
                console.warn(`Advertencia: Contenido principal vacío para ${toolFileName}.`);
            }

            if (scriptsContent) {
                await fs.writeFile(path.join(toolsContentDir, `${toolFileName}-scripts.html`), scriptsContent, 'utf8');
                console.log(`-> Scripts extraídos para ${toolFileName}`);
            }
        } else {
            console.warn(`Advertencia: No se encontró el </div> de cierre del contenedor para ${toolFileName}.`);
        }

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: No se encontró el archivo de origen: ${sourceHtmlPath}`);
        } else {
            console.error(`Error procesando ${sourceHtmlPath}:`, error);
        }
    }
}

async function runExtraction() {
    try {
        const toolsIndex = JSON.parse(await fs.readFile(toolsIndexPath, 'utf8'));
        await fs.mkdir(toolsContentDir, { recursive: true });

        console.log('Iniciando proceso de extracción (enfoque de strings)...');
        for (const tool of toolsIndex) {
            const sourceHtmlPath = path.join(backupDir, ...tool.slug.split('/').slice(1));
            console.log(`Procesando: ${path.basename(sourceHtmlPath)}`);
            await extractParts(tool, sourceHtmlPath);
        }
        console.log('\nProceso de extracción de contenido completado.');

    } catch (error) {
        console.error('Error durante la extracción de contenido:', error);
    }
}

runExtraction();