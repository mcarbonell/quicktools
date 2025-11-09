const fs = require('fs').promises;
const path = require('path');

// Common translations
const common = {
  en: {
    copyButton: "Copy",
    clearButton: "Clear",
    downloadButton: "Download",
    uploadButton: "Upload",
    processButton: "Process",
    validateButton: "Validate",
    resetButton: "Reset",
    copied: "✅ Copied to clipboard",
    processing: "⏳ Processing...",
    success: "✅ Success!",
    error: "❌ Error",
    inputLabel: "Input",
    outputLabel: "Output",
    textLabel: "Text",
    fileLabel: "File"
  },
  es: {
    copyButton: "Copiar",
    clearButton: "Limpiar",
    downloadButton: "Descargar",
    uploadButton: "Subir",
    processButton: "Procesar",
    validateButton: "Validar",
    resetButton: "Reiniciar",
    copied: "✅ Copiado al portapapeles",
    processing: "⏳ Procesando...",
    success: "✅ ¡Éxito!",
    error: "❌ Error",
    inputLabel: "Entrada",
    outputLabel: "Salida",
    textLabel: "Texto",
    fileLabel: "Archivo"
  }
};

// Tool-specific translations
const tools = {
  'csv-json': {
    en: { ...common.en, convertButton: "Convert", inputLabel: "Input", outputLabel: "Output" },
    es: { ...common.es, convertButton: "Convertir", inputLabel: "Entrada", outputLabel: "Salida" }
  },
  'yaml-json': {
    en: { ...common.en, convertButton: "Convert" },
    es: { ...common.es, convertButton: "Convertir" }
  },
  'xml-json': {
    en: { ...common.en, convertButton: "Convert" },
    es: { ...common.es, convertButton: "Convertir" }
  },
  'toml-json': {
    en: { ...common.en, convertButton: "Convert" },
    es: { ...common.es, convertButton: "Convertir" }
  },
  'base64': {
    en: { ...common.en, encodeButton: "Encode", decodeButton: "Decode" },
    es: { ...common.es, encodeButton: "Codificar", decodeButton: "Decodificar" }
  },
  'url-encoder': {
    en: { ...common.en, encodeButton: "Encode", decodeButton: "Decode" },
    es: { ...common.es, encodeButton: "Codificar", decodeButton: "Decodificar" }
  },
  'html-encoder': {
    en: { ...common.en, encodeButton: "Encode", decodeButton: "Decode" },
    es: { ...common.es, encodeButton: "Codificar", decodeButton: "Decodificar" }
  },
  'text-cleaner': {
    en: { ...common.en, cleanButton: "Clean", wordCount: "Words", charCount: "Characters" },
    es: { ...common.es, cleanButton: "Limpiar", wordCount: "Palabras", charCount: "Caracteres" }
  },
  'diff': {
    en: { ...common.en, compareButton: "Compare" },
    es: { ...common.es, compareButton: "Comparar" }
  },
  'qr-generator': {
    en: { ...common.en, generateButton: "Generate QR" },
    es: { ...common.es, generateButton: "Generar QR" }
  },
  'password-generator': {
    en: { ...common.en, generateButton: "Generate", lengthLabel: "Length" },
    es: { ...common.es, generateButton: "Generar", lengthLabel: "Longitud" }
  },
  'hash-calculator': {
    en: { ...common.en, calculateButton: "Calculate" },
    es: { ...common.es, calculateButton: "Calcular" }
  },
  'image-resizer': {
    en: { ...common.en, widthLabel: "Width", heightLabel: "Height" },
    es: { ...common.es, widthLabel: "Ancho", heightLabel: "Alto" }
  },
  'image-compressor': {
    en: { ...common.en, qualityLabel: "Quality", compressButton: "Compress" },
    es: { ...common.es, qualityLabel: "Calidad", compressButton: "Comprimir" }
  },
  'convert-image': {
    en: { ...common.en, convertButton: "Convert", formatLabel: "Format" },
    es: { ...common.es, convertButton: "Convertir", formatLabel: "Formato" }
  },
  'image-cropper': {
    en: { ...common.en, cropButton: "Crop" },
    es: { ...common.es, cropButton: "Recortar" }
  },
  'color-palette-generator': {
    en: { ...common.en, generateButton: "Generate Palette" },
    es: { ...common.es, generateButton: "Generar Paleta" }
  },
  'exif-viewer-cleaner': {
    en: { ...common.en, viewButton: "View EXIF", cleanButton: "Remove EXIF" },
    es: { ...common.es, viewButton: "Ver EXIF", cleanButton: "Eliminar EXIF" }
  },
  'lorem-ipsum-generator': {
    en: { ...common.en, generateButton: "Generate", paragraphsLabel: "Paragraphs" },
    es: { ...common.es, generateButton: "Generar", paragraphsLabel: "Párrafos" }
  },
  'stopwatch-timer': {
    en: { ...common.en, startButton: "Start", stopButton: "Stop", resetButton: "Reset" },
    es: { ...common.es, startButton: "Iniciar", stopButton: "Detener", resetButton: "Reiniciar" }
  },
  'color-picker-converter': {
    en: { ...common.en, pickButton: "Pick Color" },
    es: { ...common.es, pickButton: "Seleccionar Color" }
  },
  'pdf-to-text': {
    en: { ...common.en, extractButton: "Extract Text" },
    es: { ...common.es, extractButton: "Extraer Texto" }
  },
  'merge-pdfs': {
    en: { ...common.en, mergeButton: "Merge PDFs" },
    es: { ...common.es, mergeButton: "Unir PDFs" }
  },
  'split-pdf': {
    en: { ...common.en, splitButton: "Split PDF" },
    es: { ...common.es, splitButton: "Dividir PDF" }
  },
  'compress-pdf': {
    en: { ...common.en, compressButton: "Compress" },
    es: { ...common.es, compressButton: "Comprimir" }
  },
  'pdf-to-image': {
    en: { ...common.en, convertButton: "Convert" },
    es: { ...common.es, convertButton: "Convertir" }
  },
  'image-to-pdf': {
    en: { ...common.en, convertButton: "Convert" },
    es: { ...common.es, convertButton: "Convertir" }
  }
};

async function main() {
  const toolsDir = path.join(__dirname, '..', 'web', 'i18n', 'tools');
  
  console.log('Generando archivos de traducción...\n');
  
  for (const [toolName, translations] of Object.entries(tools)) {
    const filePath = path.join(toolsDir, `${toolName}.json`);
    await fs.writeFile(filePath, JSON.stringify(translations, null, 2), 'utf8');
    console.log(`✅ ${toolName}.json`);
  }
  
  console.log(`\n✅ ${Object.keys(tools).length} archivos generados`);
}

main().catch(console.error);
