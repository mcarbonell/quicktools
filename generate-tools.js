const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\mrcm_\\Local\\proj\\quicktools';
const templatesDir = path.join(projectRoot, 'templates');
const toolsContentDir = path.join(templatesDir, 'tools-content');
const dataDir = path.join(projectRoot, 'data');
const jsToolsDir = path.join(projectRoot, 'js', 'tools');

const baseTemplatePath = path.join(templatesDir, 'base.html');
const toolsIndexPath = path.join(dataDir, 'tools-index.json');

async function generateTools() {
    try {
        const baseTemplate = await fs.promises.readFile(baseTemplatePath, 'utf8');
        const toolsIndex = JSON.parse(await fs.promises.readFile(toolsIndexPath, 'utf8'));

        for (const tool of toolsIndex) {
            const toolSlug = tool.slug; // e.g., "tools/utils/color-picker-converter.html"
            const toolFileName = path.basename(toolSlug, '.html'); // e.g., "color-picker-converter"

            const toolContentPath = path.join(toolsContentDir, `${toolFileName}-content.html`);
            const toolScriptPath = path.join(jsToolsDir, `${toolFileName}.js`);

            let toolContent = '';
            try {
                toolContent = await fs.promises.readFile(toolContentPath, 'utf8');
            } catch (error) {
                console.warn(`Advertencia: No se encontró el archivo de contenido para ${toolFileName} en ${toolContentPath}. Se usará contenido vacío.`);
            }

            let toolScriptTag = '';
            try {
                // Check if the script file actually exists before creating the tag
                await fs.promises.access(toolScriptPath, fs.constants.F_OK);
                // Calculate relative path for the script
                const relativeScriptPath = path.relative(path.dirname(path.join(projectRoot, toolSlug)), toolScriptPath).replace(/\\/g, '/');
                toolScriptTag = `<script src="${relativeScriptPath}"></script>`;
            } catch (error) {
                console.warn(`Advertencia: No se encontró el script para ${toolFileName} en ${toolScriptPath}. No se incluirá script.`);
            }

            let generatedHtml = baseTemplate;

            // Replace metadata placeholders
            generatedHtml = generatedHtml.replace(/{{title}}/g, tool.title || '');
            generatedHtml = generatedHtml.replace(/{{description}}/g, tool.description || '');
            generatedHtml = generatedHtml.replace(/{{keywords}}/g, tool.tags ? `<meta name="keywords" content="${tool.tags.join(', ')}">` : '');
            generatedHtml = generatedHtml.replace(/{{og_title}}/g, tool.title || '');
            generatedHtml = generatedHtml.replace(/{{og_description}}/g, tool.description || '');
            generatedHtml = generatedHtml.replace(/{{og_url}}/g, `/${toolSlug}` || ''); // Assuming root relative URL
            generatedHtml = generatedHtml.replace(/{{schema_org_json}}/g, ''); // Placeholder, not in tools-index.json
            generatedHtml = generatedHtml.replace(/{{head_extra}}/g, ''); // Placeholder for extra head content
            generatedHtml = generatedHtml.replace(/{{tool_title}}/g, tool.title || '');
            generatedHtml = generatedHtml.replace(/{{tool_description}}/g, tool.description || '');
            generatedHtml = generatedHtml.replace(/{{body_extra}}/g, ''); // Placeholder for extra body content

            // Replace tool-specific content and script
            generatedHtml = generatedHtml.replace(/{{tool_content}}/g, toolContent);
            generatedHtml = generatedHtml.replace(/{{tool_script}}/g, toolScriptTag);

            const outputFilePath = path.join(projectRoot, toolSlug);
            const outputDir = path.dirname(outputFilePath);

            await fs.promises.mkdir(outputDir, { recursive: true });
            await fs.promises.writeFile(outputFilePath, generatedHtml, 'utf8');
            console.log(`Generado: ${outputFilePath}`);
        }
        console.log('Proceso de generación de herramientas completado.');
    } catch (error) {
        console.error('Error durante la generación de herramientas:', error);
    }
}

generateTools();
