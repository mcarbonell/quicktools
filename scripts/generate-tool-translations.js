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
    copied: "✅ Copied to clipboard",
    processing: "⏳ Processing...",
    success: "✅ Success!",
    error: "❌ Error"
  },
  es: {
    copyButton: "Copiar",
    clearButton: "Limpiar",
    downloadButton: "Descargar",
    uploadButton: "Subir",
    processButton: "Procesar",
    copied: "✅ Copiado al portapapeles",
    processing: "⏳ Procesando...",
    success: "✅ ¡Éxito!",
    error: "❌ Error"
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
