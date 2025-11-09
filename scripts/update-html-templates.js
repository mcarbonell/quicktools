const fs = require('fs').promises;
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'web', 'templates', 'tools-content');

// Common Spanish text to replace with placeholders
const replacements = [
  // Buttons
  { es: 'Formatear', key: 'formatButton' },
  { es: 'Minificar', key: 'minifyButton' },
  { es: 'Validar', key: 'validateButton' },
  { es: 'Copiar', key: 'copyButton' },
  { es: 'Limpiar', key: 'clearButton' },
  { es: 'Descargar', key: 'downloadButton' },
  { es: 'Subir', key: 'uploadButton' },
  { es: 'Procesar', key: 'processButton' },
  { es: 'Convertir', key: 'convertButton' },
  { es: 'Generar', key: 'generateButton' },
  { es: 'Calcular', key: 'calculateButton' },
  { es: 'Comprimir', key: 'compressButton' },
  { es: 'Recortar', key: 'cropButton' },
  { es: 'Extraer', key: 'extractButton' },
  { es: 'Unir', key: 'mergeButton' },
  { es: 'Dividir', key: 'splitButton' },
  { es: 'Codificar', key: 'encodeButton' },
  { es: 'Decodificar', key: 'decodeButton' },
  { es: 'Comparar', key: 'compareButton' },
  { es: 'Iniciar', key: 'startButton' },
  { es: 'Detener', key: 'stopButton' },
  { es: 'Reiniciar', key: 'resetButton' },
  
  // Labels
  { es: 'Entrada', key: 'inputLabel' },
  { es: 'Salida', key: 'outputLabel' },
  { es: 'Texto', key: 'textLabel' },
  { es: 'Archivo', key: 'fileLabel' },
  { es: 'Calidad', key: 'qualityLabel' },
  { es: 'Ancho', key: 'widthLabel' },
  { es: 'Alto', key: 'heightLabel' },
  { es: 'Longitud', key: 'lengthLabel' },
  { es: 'Formato', key: 'formatLabel' },
  { es: 'Párrafos', key: 'paragraphsLabel' },
  
  // Placeholders
  { es: 'Arrastra y suelta', key: 'dragDropPlaceholder' },
  { es: 'Selecciona un archivo', key: 'selectFilePlaceholder' },
  { es: 'Escribe aquí', key: 'typeHerePlaceholder' },
  { es: 'Pega tu texto', key: 'pasteTextPlaceholder' }
];

async function updateTemplate(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  let modified = false;
  
  for (const { es, key } of replacements) {
    // Replace in button text
    const buttonRegex = new RegExp(`>\\s*${es}\\s*<`, 'g');
    if (buttonRegex.test(content)) {
      content = content.replace(buttonRegex, `>{{t.${key}}}<`);
      modified = true;
    }
    
    // Replace in title attributes
    const titleRegex = new RegExp(`title="\\s*${es}\\s*"`, 'g');
    if (titleRegex.test(content)) {
      content = content.replace(titleRegex, `title="{{t.${key}}}"`);
      modified = true;
    }
    
    // Replace in placeholder attributes
    const placeholderRegex = new RegExp(`placeholder="[^"]*${es}[^"]*"`, 'g');
    if (placeholderRegex.test(content)) {
      content = content.replace(placeholderRegex, `placeholder="{{t.${key}}}"`);
      modified = true;
    }
    
    // Replace in label text
    const labelRegex = new RegExp(`<label[^>]*>\\s*${es}\\s*<`, 'g');
    if (labelRegex.test(content)) {
      content = content.replace(labelRegex, match => match.replace(es, `{{t.${key}}}`));
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
  console.log('Actualizando templates HTML con placeholders...\n');
  
  const files = await fs.readdir(templatesDir);
  let updated = 0;
  
  for (const file of files) {
    if (file.endsWith('-content.html')) {
      const filePath = path.join(templatesDir, file);
      const wasUpdated = await updateTemplate(filePath);
      if (wasUpdated) {
        console.log(`✅ ${file}`);
        updated++;
      } else {
        console.log(`⏭️  ${file} (sin cambios)`);
      }
    }
  }
  
  console.log(`\n✅ ${updated} templates actualizados`);
}

main().catch(console.error);
