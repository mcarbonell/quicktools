// Generate language-specific JSON files from unified JSON

const fs = require('fs').promises;
const path = require('path');

async function generateToolsJSON() {
    console.log('📋 Generating tools JSON files from unified source...');

    // Read unified JSON
    const unifiedPath = path.join(__dirname, '../web/data/tools-index-unified.json');
    const unifiedData = JSON.parse(await fs.readFile(unifiedPath, 'utf8'));

    // Generate Spanish JSON
    const esTools = unifiedData.tools.map(tool => ({
        title: tool.title.es,
        slug: tool.slug,
        description: tool.description.es,
        category: tool.categories[0], // Primary category
        icon: tool.icon,
        tags: tool.tags
    }));

    // Generate English JSON
    const enTools = unifiedData.tools.map(tool => ({
        title: tool.title.en,
        slug: tool.slug,
        description: tool.description.en,
        category: tool.categories[0], // Primary category
        icon: tool.icon,
        tags: tool.tags
    }));

    // Write files
    await fs.writeFile(
        path.join(__dirname, '../web/data/tools-index-es.json'),
        JSON.stringify(esTools, null, 2),
        'utf8'
    );

    await fs.writeFile(
        path.join(__dirname, '../web/data/tools-index-en.json'),
        JSON.stringify(enTools, null, 2),
        'utf8'
    );

    console.log('✅ Generated tools-index-es.json (33 tools)');
    console.log('✅ Generated tools-index-en.json (33 tools)');
    console.log('✨ Done!');
}

generateToolsJSON().catch(console.error);
