const fs = require('fs').promises;
const path = require('path');

const scriptsDir = path.join(__dirname, '..', 'web', 'templates', 'tools-content');

async function fixPaths(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  let modified = false;
  
  // Fix JS paths: ../../js/ -> /js/
  if (content.includes('../../js/')) {
    content = content.replace(/\.\.\/\.\.\/js\//g, '/js/');
    modified = true;
  }
  
  // Fix lib paths: ../../js/lib/ -> /js/lib/
  if (content.includes('../../js/lib/')) {
    content = content.replace(/\.\.\/\.\.\/js\/lib\//g, '/js/lib/');
    modified = true;
  }
  
  // Fix vendor paths: ../../js/vendor/ -> /js/vendor/
  if (content.includes('../../js/vendor/')) {
    content = content.replace(/\.\.\/\.\.\/js\/vendor\//g, '/js/vendor/');
    modified = true;
  }
  
  if (modified) {
    await fs.writeFile(filePath, content, 'utf8');
    return true;
  }
  return false;
}

async function main() {
  console.log('Corrigiendo rutas relativas a absolutas...\n');
  
  const files = await fs.readdir(scriptsDir);
  let updated = 0;
  
  for (const file of files) {
    if (file.endsWith('-scripts.html')) {
      const filePath = path.join(scriptsDir, file);
      const wasUpdated = await fixPaths(filePath);
      if (wasUpdated) {
        console.log(`✅ ${file}`);
        updated++;
      }
    }
  }
  
  console.log(`\n✅ ${updated} archivos actualizados`);
}

main().catch(console.error);
