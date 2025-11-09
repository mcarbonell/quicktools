const fs = require('fs').promises;
const path = require('path');

const jsToolsDir = path.join(__dirname, '..', 'web', 'js', 'tools');

// Common Spanish phrases to replace
const replacements = [
  // Messages
  { es: 'Copiado al portapapeles', key: 'copied' },
  { es: 'Copiado', key: 'copied' },
  { es: 'No hay texto para copiar', key: 'noText' },
  { es: 'Error al copiar', key: 'error' },
  { es: 'Procesando...', key: 'processing' },
  { es: 'Éxito', key: 'success' },
  { es: 'Error', key: 'error' },
  
  // JSON specific
  { es: 'JSON formateado', key: 'formatted' },
  { es: 'JSON minificado', key: 'minified' },
  { es: 'JSON válido', key: 'validJson' },
  { es: 'JSON inválido', key: 'invalidJson' },
  
  // Conversions
  { es: 'Convertido correctamente', key: 'converted' },
  { es: 'Error en la conversión', key: 'conversionError' },
  
  // Encoding
  { es: 'Codificado', key: 'encoded' },
  { es: 'Decodificado', key: 'decoded' },
  
  // General
  { es: 'Archivo cargado', key: 'fileLoaded' },
  { es: 'Selecciona un archivo', key: 'selectFile' },
  { es: 'Descargando', key: 'downloading' }
];

async function updateJsFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  let modified = false;
  
  // Add translation access if not present
  if (!content.includes('window.toolTranslations')) {
    const firstConst = content.indexOf('const ');
    if (firstConst !== -1) {
      const insertPos = content.indexOf('\n', firstConst) + 1;
      content = content.slice(0, insertPos) + 
        '\n// Get translations (injected by generator)\nconst t = window.toolTranslations || {};\n' +
        content.slice(insertPos);
      modified = true;
    }
  }
  
  // Replace hardcoded Spanish text
  for (const { es, key } of replacements) {
    const regex = new RegExp(`['"]${es}\\.?['"]`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `t.${key} || '${es}'`);
      modified = true;
    }
  }
  
  if (modified) {
    await fs.writeFile(filePath, content, 'utf8');
    return true;
  }
  return false;
}

async function main() {
  console.log('Actualizando archivos JavaScript con traducciones...\n');
  
  const files = await fs.readdir(jsToolsDir);
  let updated = 0;
  
  for (const file of files) {
    if (file.endsWith('.js')) {
      const filePath = path.join(jsToolsDir, file);
      const wasUpdated = await updateJsFile(filePath);
      if (wasUpdated) {
        console.log(`✅ ${file}`);
        updated++;
      } else {
        console.log(`⏭️  ${file} (sin cambios)`);
      }
    }
  }
  
  console.log(`\n✅ ${updated} archivos actualizados`);
}

main().catch(console.error);
