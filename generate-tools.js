const fs = require('fs').promises;
const path = require('path');

const projectRoot = 'C:\\Users\\mrcm_\\Local\\proj\\quicktools';
const templatesDir = path.join(projectRoot, 'templates');
const toolsContentDir = path.join(templatesDir, 'tools-content');
const dataDir = path.join(projectRoot, 'data');
const baseTemplatePath = path.join(templatesDir, 'base.html');
const indexTemplatePath = path.join(templatesDir, 'index-base.html');
const toolsIndexPath = path.join(dataDir, 'tools-index.json');

async function generateIndex(toolsIndex) {
    console.log('Iniciando la generación del index.html...');
    
    const indexTemplate = await fs.readFile(indexTemplatePath, 'utf8');
    
    // Group tools by category
    const byCat = toolsIndex.reduce((acc, t) => {
        (acc[t.category] = acc[t.category] || []).push(t);
        return acc;
    }, {});

    let toolsGridHtml = '';
    for (const [cat, items] of Object.entries(byCat)) {
        toolsGridHtml += `<section class="mb-4">\n`;
        toolsGridHtml += `  <h3 class="h5 mb-3">${cat}</h3>\n`;
        toolsGridHtml += `  <div class="row g-4">\n`;
        
        items.forEach(item => {
            toolsGridHtml += `
    <div class="col-md-6 col-lg-4">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description}</p>
                <a href="${item.slug}" class="btn btn-primary">Abrir herramienta</a>
            </div>
        </div>
    </div>`;
        });

        toolsGridHtml += `\n  </div>\n</section>\n`;
    }

    const finalIndexHtml = indexTemplate.replace('{{tools_grid}}', toolsGridHtml);
    await fs.writeFile(path.join(projectRoot, 'index.html'), finalIndexHtml, 'utf8');
    console.log(' -> Generado: index.html');
}

async function generateTools(toolsIndex) {
    console.log('\nIniciando la generación de herramientas desde los fragmentos...');
    const baseTemplate = await fs.readFile(baseTemplatePath, 'utf8');

    for (const tool of toolsIndex) {
        const toolSlug = tool.slug;
        const toolFileName = path.basename(toolSlug, '.html');

        const headPath = path.join(toolsContentDir, `${toolFileName}-head.html`);
        const contentPath = path.join(toolsContentDir, `${toolFileName}-content.html`);
        const scriptsPath = path.join(toolsContentDir, `${toolFileName}-scripts.html`);

        const headExtra = await fs.readFile(headPath, 'utf8').catch(() => '');
        const toolContent = await fs.readFile(contentPath, 'utf8').catch(() => '');
        const toolScript = await fs.readFile(scriptsPath, 'utf8').catch(() => '');

        let generatedHtml = baseTemplate;
        generatedHtml = generatedHtml.replace(/{{title}}/g, tool.title || '');
        generatedHtml = generatedHtml.replace(/{{description}}/g, tool.description || '');
        generatedHtml = generatedHtml.replace(/{{keywords}}/g, tool.tags ? `<meta name="keywords" content="${tool.tags.join(', ')}">` : '');
        generatedHtml = generatedHtml.replace(/{{og_title}}/g, tool.title || '');
        generatedHtml = generatedHtml.replace(/{{og_description}}/g, tool.description || '');
        generatedHtml = generatedHtml.replace(/{{og_url}}/g, `/${toolSlug}` || '');
        generatedHtml = generatedHtml.replace(/{{head_extra}}/g, headExtra);
        generatedHtml = generatedHtml.replace(/{{tool_title}}/g, tool.title || '');
        generatedHtml = generatedHtml.replace(/{{tool_description}}/g, tool.description || '');
        generatedHtml = generatedHtml.replace(/{{tool_content}}/g, toolContent);
        generatedHtml = generatedHtml.replace(/{{tool_script}}/g, toolScript);
        generatedHtml = generatedHtml.replace(/{{schema_org_json}}/g, '');
        generatedHtml = generatedHtml.replace(/{{body_extra}}/g, '');

        const outputFilePath = path.join(projectRoot, toolSlug);
        await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
        await fs.writeFile(outputFilePath, generatedHtml, 'utf8');
        console.log(` -> Generado: ${path.basename(outputFilePath)}`);
    }
}

async function main() {
    try {
        const toolsIndex = JSON.parse(await fs.readFile(toolsIndexPath, 'utf8'));
        await generateIndex(toolsIndex);
        await generateTools(toolsIndex);
        console.log('\nProceso de generación completado.');
    } catch (error) {
        console.error('Error durante el proceso de generación:', error);
    }
}

main();
