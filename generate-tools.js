const fs = require('fs').promises;
const path = require('path');

const projectRoot = 'C:\\Users\\mrcm_\\Local\\proj\\quicktools';
const templatesDir = path.join(projectRoot, 'templates');
const toolsContentDir = path.join(templatesDir, 'tools-content');
const dataDir = path.join(projectRoot, 'data');
const baseTemplatePath = path.join(templatesDir, 'base.html');
const toolsIndexPath = path.join(dataDir, 'tools-index.json');

async function generateTools() {
    try {
        const baseTemplate = await fs.readFile(baseTemplatePath, 'utf8');
        const toolsIndex = JSON.parse(await fs.readFile(toolsIndexPath, 'utf8'));

        console.log('Iniciando la generación de herramientas desde los fragmentos...');

        for (const tool of toolsIndex) {
            const toolSlug = tool.slug;
            const toolFileName = path.basename(toolSlug, '.html');

            // Paths for the extracted parts
            const headPath = path.join(toolsContentDir, `${toolFileName}-head.html`);
            const contentPath = path.join(toolsContentDir, `${toolFileName}-content.html`);
            const scriptsPath = path.join(toolsContentDir, `${toolFileName}-scripts.html`);

            // Read the parts, using empty string as fallback
            const headExtra = await fs.readFile(headPath, 'utf8').catch(() => '');
            const toolContent = await fs.readFile(contentPath, 'utf8').catch(() => {
                console.warn(`  -> Advertencia: No se encontró content para ${toolFileName}.`);
                return '';
            });
            const toolScript = await fs.readFile(scriptsPath, 'utf8').catch(() => '');

            // --- Start Templating ---
            let generatedHtml = baseTemplate;

            // Replace metadata
            generatedHtml = generatedHtml.replace(/{{title}}/g, tool.title || '');
            generatedHtml = generatedHtml.replace(/{{description}}/g, tool.description || '');
            generatedHtml = generatedHtml.replace(/{{keywords}}/g, tool.tags ? `<meta name="keywords" content="${tool.tags.join(', ')}">` : '');
            generatedHtml = generatedHtml.replace(/{{og_title}}/g, tool.title || '');
            generatedHtml = generatedHtml.replace(/{{og_description}}/g, tool.description || '');
            generatedHtml = generatedHtml.replace(/{{og_url}}/g, `/${toolSlug}` || '');
            
            // Replace structural parts
            generatedHtml = generatedHtml.replace(/{{head_extra}}/g, headExtra);
            generatedHtml = generatedHtml.replace(/{{tool_title}}/g, tool.title || '');
            generatedHtml = generatedHtml.replace(/{{tool_description}}/g, tool.description || '');
            generatedHtml = generatedHtml.replace(/{{tool_content}}/g, toolContent);
            generatedHtml = generatedHtml.replace(/{{tool_script}}/g, toolScript);

            // Replace unused placeholders to clean up the HTML
            generatedHtml = generatedHtml.replace(/{{schema_org_json}}/g, '');
            generatedHtml = generatedHtml.replace(/{{body_extra}}/g, '');

            // --- Write Final HTML ---
            const outputFilePath = path.join(projectRoot, toolSlug);
            const outputDir = path.dirname(outputFilePath);

            await fs.mkdir(outputDir, { recursive: true });
            await fs.writeFile(outputFilePath, generatedHtml, 'utf8');
            console.log(` -> Generado: ${path.basename(outputFilePath)}`);
        }
        console.log('\nProceso de generación de herramientas completado.');
    } catch (error)
        {
        console.error('Error durante la generación de herramientas:', error);
    }
}

generateTools();