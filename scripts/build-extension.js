const fs = require('fs').promises;
const path = require('path');

async function buildExtension() {
    console.log('🧩 Building extension...\n');
    
    const sourceFile = path.join(__dirname, '..', 'build', 'data', 'fasttools-data.json');
    const destFile = path.join(__dirname, '..', 'extension', 'data', 'fasttools-data.json');
    
    // Copy fasttools-data.json to extension
    const data = await fs.readFile(sourceFile, 'utf8');
    await fs.writeFile(destFile, data, 'utf8');
    
    console.log('✅ Copied fasttools-data.json to extension/data/');
    console.log('\n✨ Extension build complete!');
}

buildExtension().catch(console.error);
