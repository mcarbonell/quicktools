# Instrucciones para Añadir Contenido SEO a las Herramientas

## Objetivo
Añadir contenido SEO keyword-rich a los archivos JSON de traducción de las 32 herramientas restantes (ya está hecho en `base64.json`).

## Ubicación de los Archivos

### Archivos JSON de traducción
Todos los archivos JSON están en: `web/i18n/tools/`

### Archivos de implementación de cada herramienta

Para entender mejor cómo funciona cada herramienta y escribir contenido SEO más preciso, puedes consultar:

**HTML (contenido y estructura):**
- Ubicación: `web/templates/tools-content/[nombre-herramienta]-content.html`
- Contiene: Formularios, botones, campos de entrada/salida, estructura de la interfaz
- Ejemplo: `web/templates/tools-content/base64-content.html`

**JavaScript (funcionalidad):**
- Ubicación: `web/js/tools/[nombre-herramienta].js`
- Contiene: Lógica de procesamiento, funciones principales, eventos
- Ejemplo: `web/js/tools/base64.js`

**Páginas generadas (referencia final):**
- Ubicación EN: `web/tools/[categoria]/[nombre-herramienta].html`
- Ubicación ES: `web/es/tools/[categoria]/[nombre-herramienta].html`
- Ejemplo: `web/tools/text/base64.html`

### Mapeo de nombres de archivo

La mayoría de herramientas siguen este patrón:
- JSON: `[nombre].json`
- HTML content: `[nombre]-content.html`
- JavaScript: `[nombre].js`

Ejemplos:
- `base64.json` → `base64-content.html` → `base64.js`
- `json-formatter.json` → `json-formatter-content.html` → `json-formatter.js`
- `image-resizer.json` → `image-resizer-content.html` → `image-resizer.js`

## Estructura del Contenido SEO

Cada herramienta debe tener una sección `seo` dentro de cada idioma (`en` y `es`) con la siguiente estructura:

```json
"seo": {
  "whatIsTitle": "Título de la sección '¿Qué es?'",
  "whatIsContent": "Párrafo explicativo con **negritas** y [enlaces](url)",
  "howToTitle": "Título de la sección 'Cómo usar'",
  "howToSteps": [
    "Paso 1 con **negritas** si es necesario",
    "Paso 2 con **negritas** si es necesario",
    "Paso 3 con **negritas** si es necesario",
    "Paso 4 con **negritas** si es necesario"
  ],
  "useCasesTitle": "Título de la sección 'Casos de uso'",
  "useCases": [
    "Caso de uso 1 con **negritas** y [enlaces](url) si aplica",
    "Caso de uso 2 con **negritas** y [enlaces](url) si aplica",
    "Caso de uso 3 con **negritas** y [enlaces](url) si aplica",
    "Caso de uso 4 con **negritas** y [enlaces](url) si aplica",
    "Caso de uso 5 con **negritas** y [enlaces](url) si aplica"
  ],
  "faqTitle": "Título de la sección FAQ",
  "faq": [
    {
      "question": "Pregunta frecuente 1",
      "answer": "Respuesta con **negritas** si es necesario"
    },
    {
      "question": "Pregunta frecuente 2",
      "answer": "Respuesta con **negritas** si es necesario"
    },
    {
      "question": "Pregunta frecuente 3",
      "answer": "Respuesta con **negritas** si es necesario"
    }
  ]
}
```

## Markdown Soportado

Solo se soporta markdown mínimo:
- `**texto**` → negritas (strong)
- `*texto*` → itálicas (em)
- `[texto](url)` → enlaces externos

## Ejemplo Completo (base64.json)

Ver el archivo `web/i18n/tools/base64.json` para referencia completa.

Extracto del inglés:
```json
"seo": {
  "whatIsTitle": "What is Base64 encoding?",
  "whatIsContent": "**Base64** is an encoding system that converts **binary data** into ASCII text using 64 different characters (A-Z, a-z, 0-9, +, /). It's widely used in web development, email systems, and data transmission. Learn more about [Base64 on Wikipedia](https://en.wikipedia.org/wiki/Base64).",
  "howToTitle": "How to use the Base64 encoder/decoder?",
  "howToSteps": [
    "Paste or type your **text** in the input area",
    "Click **'Encode to Base64'** to convert text to Base64 format",
    "Use **'Decode Base64'** to convert Base64 back to readable text",
    "Copy the result using the **copy button**"
  ],
  "useCasesTitle": "Common use cases for Base64",
  "useCases": [
    "Encode **images in CSS/HTML** using [data URIs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)",
    "Send **binary data** in JSON or XML formats",
    "Transmit **email attachments** (MIME encoding)",
    "Store credentials or tokens in **configuration files**",
    "Obfuscate text (not encryption, just encoding)"
  ],
  "faqTitle": "Frequently Asked Questions",
  "faq": [
    {
      "question": "Is Base64 encryption?",
      "answer": "No, **Base64 is not encryption**. It's an encoding method that can be easily reversed. Never use Base64 to protect sensitive data."
    },
    {
      "question": "Why does Base64 increase file size?",
      "answer": "Base64 encoding increases data size by approximately **33%** because it represents 3 bytes of binary data using 4 ASCII characters."
    },
    {
      "question": "Is this Base64 tool safe?",
      "answer": "Yes! All encoding and decoding happens **100% in your browser**. Your data never leaves your device."
    }
  ]
}
```

## Lista de Herramientas a Completar (32 archivos)

### Imagen (6 herramientas)
1. `image-resizer.json` - Redimensionar imagen
2. `convert-image.json` - Convertir formato de imagen
3. `color-palette-generator.json` - Generador de paleta de colores
4. `exif-viewer-cleaner.json` - Visor y limpiador EXIF
5. `image-cropper.json` - Recortar imagen
6. `image-compressor.json` - Comprimir imagen

### Archivos (6 herramientas)
7. `pdf-to-text.json` - Extraer texto de PDF
8. `merge-pdfs.json` - Unir PDFs
9. `split-pdf.json` - Dividir PDF
10. `compress-pdf.json` - Comprimir PDF
11. `pdf-to-image.json` - PDF a imagen
12. `image-to-pdf.json` - Imagen a PDF

### Datos (4 herramientas)
13. `json-formatter.json` - Formatear JSON
14. `csv-json.json` - CSV ↔ JSON
15. `yaml-json.json` - YAML ↔ JSON
16. `xml-json.json` - XML ↔ JSON
17. `toml-json.json` - TOML ↔ JSON

### Texto (5 herramientas)
18. `text-cleaner.json` - Limpiar texto
19. `url-encoder.json` - Codificar/Decodificar URL
20. `html-encoder.json` - Codificar/Decodificar HTML
21. `diff.json` - Comparar textos
22. `lorem-ipsum-generator.json` - Generador Lorem Ipsum

### Utilidades (5 herramientas)
23. `qr-generator.json` - Generador QR
24. `password-generator.json` - Generador de contraseñas
25. `hash-calculator.json` - Calculadora de hashes
26. `color-picker-converter.json` - Selector y conversor de color
27. `stopwatch-timer.json` - Cronómetro y temporizador

### IA (5 herramientas)
28. `chat-ai.json` - Chat con IA
29. `summarize.json` - Resumir texto con IA
30. `improve-text.json` - Mejorar texto con IA
31. `chat-pdf.json` - Chat con PDF
32. `edit-image.json` - Editar imagen con IA

## Cómo Investigar una Herramienta

Si no estás seguro de cómo funciona una herramienta:

1. **Lee el JSON existente** (`web/i18n/tools/[nombre].json`)
   - Mira los textos de botones, labels, mensajes
   - Identifica las acciones principales

2. **Consulta el HTML** (`web/templates/tools-content/[nombre]-content.html`)
   - Identifica campos de entrada (input, textarea, file upload)
   - Encuentra botones y sus acciones
   - Observa la estructura de la interfaz

3. **Revisa el JavaScript** (`web/js/tools/[nombre].js`)
   - Busca funciones principales (encode, decode, convert, compress, etc.)
   - Identifica qué librerías usa (PDF.js, Canvas API, etc.)
   - Entiende el flujo de procesamiento

4. **Consulta la página generada** (si existe)
   - Abre `web/tools/[categoria]/[nombre].html` en navegador
   - Prueba la herramienta para entender su funcionamiento

## Directrices de Contenido

### whatIsContent (1 párrafo, 50-80 palabras)
- Explicar qué es la tecnología/formato/herramienta
- Usar **negritas** en términos clave
- Incluir 1 enlace a Wikipedia o MDN si aplica
- Mencionar casos de uso principales

### howToSteps (3-5 pasos)
- Instrucciones claras y concisas
- Usar **negritas** en acciones clave (botones, campos)
- Orden lógico de uso de la herramienta

### useCases (4-6 casos)
- Casos de uso reales y prácticos
- Usar **negritas** en conceptos importantes
- Incluir enlaces a documentación técnica si aplica
- Variedad de contextos (desarrollo, diseño, SEO, etc.)

### faq (3 preguntas)
- Preguntas que usuarios realmente harían
- Respuestas claras y directas
- Usar **negritas** para énfasis
- Incluir pregunta sobre privacidad/seguridad siempre

### Keywords a Incluir
Para cada herramienta, usar keywords relevantes:
- Nombre de la herramienta + "online", "free", "tool"
- Formato/tecnología específica
- Verbos de acción (convert, resize, compress, encode, etc.)
- "browser", "offline", "privacy", "no upload"

### Enlaces Recomendados
- Wikipedia (en.wikipedia.org / es.wikipedia.org)
- MDN Web Docs (developer.mozilla.org)
- W3C specifications
- RFC documents (para protocolos)

## Idiomas

### Inglés (en)
- Títulos estándar:
  - `"whatIsTitle": "What is [Technology]?"`
  - `"howToTitle": "How to use the [Tool Name]?"`
  - `"useCasesTitle": "Common use cases for [Technology]"`
  - `"faqTitle": "Frequently Asked Questions"`

### Español (es)
- Títulos estándar:
  - `"whatIsTitle": "¿Qué es [Tecnología]?"`
  - `"howToTitle": "¿Cómo usar [Nombre de Herramienta]?"`
  - `"useCasesTitle": "Casos de uso comunes de [Tecnología]"`
  - `"faqTitle": "Preguntas frecuentes"`

## Formato JSON

**IMPORTANTE:**
- Mantener la estructura JSON válida
- Usar comillas dobles para strings
- Escapar caracteres especiales si es necesario
- La sección `seo` va DENTRO de cada idioma, al final, antes del cierre de `}`
- Añadir coma después del último campo existente antes de `seo`

Ejemplo de ubicación:
```json
{
  "en": {
    "title": "Tool Title",
    "description": "...",
    // ... otros campos ...
    "copyError": "Error copying",
    "seo": {
      // contenido SEO aquí
    }
  },
  "es": {
    "title": "Título de Herramienta",
    "description": "...",
    // ... otros campos ...
    "copyError": "Error al copiar",
    "seo": {
      // contenido SEO aquí
    }
  }
}
```

## Validación

Después de editar cada archivo:
1. Verificar que el JSON es válido (usar JSONLint.com si es necesario)
2. Comprobar que hay contenido en ambos idiomas (en y es)
3. Verificar que los enlaces funcionan
4. Asegurar que las negritas usan `**` correctamente

## Regeneración del Sitio

Una vez completados todos los archivos JSON, ejecutar:
```bash
node generate-site.js
```

Esto generará las páginas HTML con el contenido SEO incluido.

## Notas Adicionales

- **Privacidad**: Siempre mencionar que todo se procesa en el navegador
- **Longitud**: Apuntar a 400-600 palabras totales por herramienta
- **Tono**: Profesional pero accesible
- **SEO**: Usar variaciones de keywords naturalmente
- **Enlaces**: Solo a fuentes confiables (Wikipedia, MDN, W3C, RFC)

## Ejemplo de Pregunta FAQ sobre Privacidad

Incluir siempre una pregunta similar a:

**Inglés:**
```json
{
  "question": "Is this [tool name] safe?",
  "answer": "Yes! All processing happens **100% in your browser**. Your files/data never leave your device."
}
```

**Español:**
```json
{
  "question": "¿Esta herramienta [nombre] es segura?",
  "answer": "¡Sí! Todo el procesamiento ocurre **100% en tu navegador**. Tus archivos/datos nunca salen de tu dispositivo."
}
```

---

## Checklist por Herramienta

- [ ] Archivo JSON editado
- [ ] Sección `seo` añadida en `en`
- [ ] Sección `seo` añadida en `es`
- [ ] JSON válido (sin errores de sintaxis)
- [ ] 4 secciones completas (whatIs, howTo, useCases, faq)
- [ ] 3-5 pasos en howToSteps
- [ ] 4-6 casos en useCases
- [ ] 3 preguntas en faq
- [ ] Al menos 1 enlace externo
- [ ] Negritas usadas apropiadamente
- [ ] Pregunta sobre privacidad incluida
- [ ] Contenido relevante y útil

---

## Tabla de Referencia Rápida

| # | Herramienta | JSON | HTML Content | JavaScript |
|---|-------------|------|--------------|------------|
| 1 | Image Resizer | `image-resizer.json` | `image-resizer-content.html` | `image-resizer.js` |
| 2 | Convert Image | `convert-image.json` | `convert-image-content.html` | `convert-image.js` |
| 3 | Color Palette | `color-palette-generator.json` | `color-palette-generator-content.html` | `color-palette-generator.js` |
| 4 | EXIF Viewer | `exif-viewer-cleaner.json` | `exif-viewer-cleaner-content.html` | `exif-viewer-cleaner.js` |
| 5 | Image Cropper | `image-cropper.json` | `image-cropper-content.html` | `image-cropper.js` |
| 6 | Image Compressor | `image-compressor.json` | `image-compressor-content.html` | `image-compressor.js` |
| 7 | PDF to Text | `pdf-to-text.json` | `pdf-to-text-content.html` | `pdf-to-text.js` |
| 8 | Merge PDFs | `merge-pdfs.json` | `merge-pdfs-content.html` | `merge-pdfs.js` |
| 9 | Split PDF | `split-pdf.json` | `split-pdf-content.html` | `split-pdf.js` |
| 10 | Compress PDF | `compress-pdf.json` | `compress-pdf-content.html` | `compress-pdf.js` |
| 11 | PDF to Image | `pdf-to-image.json` | `pdf-to-image-content.html` | `pdf-to-image.js` |
| 12 | Image to PDF | `image-to-pdf.json` | `image-to-pdf-content.html` | `image-to-pdf.js` |
| 13 | JSON Formatter | `json-formatter.json` | `json-formatter-content.html` | `json-formatter.js` |
| 14 | CSV ↔ JSON | `csv-json.json` | `csv-json-content.html` | `csv-json.js` |
| 15 | YAML ↔ JSON | `yaml-json.json` | `yaml-json-content.html` | `yaml-json.js` |
| 16 | XML ↔ JSON | `xml-json.json` | `xml-json-content.html` | `xml-json.js` |
| 17 | TOML ↔ JSON | `toml-json.json` | `toml-json-content.html` | `toml-json.js` |
| 18 | Text Cleaner | `text-cleaner.json` | `text-cleaner-content.html` | `text-cleaner.js` |
| 19 | URL Encoder | `url-encoder.json` | `url-encoder-content.html` | `url-encoder.js` |
| 20 | HTML Encoder | `html-encoder.json` | `html-encoder-content.html` | `html-encoder.js` |
| 21 | Text Diff | `diff.json` | `diff-content.html` | `diff.js` |
| 22 | Lorem Ipsum | `lorem-ipsum-generator.json` | `lorem-ipsum-generator-content.html` | `lorem-ipsum-generator.js` |
| 23 | QR Generator | `qr-generator.json` | `qr-generator-content.html` | `qr-generator.js` |
| 24 | Password Generator | `password-generator.json` | `password-generator-content.html` | `password-generator.js` |
| 25 | Hash Calculator | `hash-calculator.json` | `hash-calculator-content.html` | `hash-calculator.js` |
| 26 | Color Picker | `color-picker-converter.json` | `color-picker-converter-content.html` | `color-picker-converter.js` |
| 27 | Stopwatch/Timer | `stopwatch-timer.json` | `stopwatch-timer-content.html` | `stopwatch-timer.js` |
| 28 | Chat AI | `chat-ai.json` | `chat-ai-content.html` | `chat-ai.js` |
| 29 | Summarize Text | `summarize.json` | `summarize-content.html` | `summarize.js` |
| 30 | Improve Text | `improve-text.json` | `improve-text-content.html` | `improve-text.js` |
| 31 | Chat with PDF | `chat-pdf.json` | `chat-pdf-content.html` | `chat-pdf.js` |
| 32 | Edit Image AI | `edit-image.json` | `edit-image-content.html` | `edit-image.js` |

**Rutas completas:**
- JSON: `web/i18n/tools/[nombre].json`
- HTML: `web/templates/tools-content/[nombre]-content.html`
- JS: `web/js/tools/[nombre].js`

---

**¡Buena suerte con la generación de contenido!** 🚀
