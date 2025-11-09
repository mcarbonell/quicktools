# Guía Manual de Traducción de Templates

## 🎯 Objetivo

Extraer todo el texto visible de los templates HTML y moverlo a archivos JSON de traducción, reemplazándolo con placeholders `{{t.key}}`.

## 📋 Proceso por Herramienta

Para cada herramienta, sigue estos pasos:

### Paso 1: Identificar el archivo

**Template HTML:** `web/templates/tools-content/TOOL_NAME-content.html`  
**Archivo JSON:** `web/i18n/tools/TOOL_NAME.json`

Puede que el archivo .json no exista, si no existe hay que crearlo.


### Paso 2: Buscar texto en español

Busca en el template HTML:
- Texto dentro de botones: `<button>Texto</button>`
- Texto en labels: `<label>Texto</label>`
- Texto en options: `<option>Texto</option>`
- Texto en placeholders: `placeholder="Texto"`
- Texto en títulos: `title="Texto"`
- Cualquier texto visible en español

### Paso 3: Crear clave en JSON

Para cada texto encontrado:

1. **Decide el nombre de la clave** (en inglés, camelCase):
   - Botones: `xxxButton` (ej: `generateButton`, `copyButton`)
   - Labels: `xxxLabel` (ej: `paragraphsLabel`, `unitLabel`)
   - Placeholders: `xxxPlaceholder` (ej: `textPlaceholder`)
   - Opciones: `xxxOption` (ej: `paragraphsOption`)

2. **Añade al JSON** en ambos idiomas:
```json
{
  "en": {
    "unitLabel": "Unit",
    "paragraphsOption": "Paragraphs",
    "sentencesOption": "Sentences",
    "wordsOption": "Words"
  },
  "es": {
    "unitLabel": "Unidad",
    "paragraphsOption": "Párrafos",
    "sentencesOption": "Oraciones",
    "wordsOption": "Palabras"
  }
}
```

### Paso 4: Reemplazar en HTML

Reemplaza el texto español con el placeholder:

**Antes:**
```html
<label>Unidad</label>
<option value="paragraphs">Párrafos</option>
<option value="sentences">Oraciones</option>
<option value="words">Palabras</option>
```

**Después:**
```html
<label>{{t.unitLabel}}</label>
<option value="paragraphs">{{t.paragraphsOption}}</option>
<option value="sentences">{{t.sentencesOption}}</option>
<option value="words">{{t.wordsOption}}</option>
```

## 📝 Ejemplo Completo: lorem-ipsum-generator

### Archivo Original: `lorem-ipsum-generator-content.html`

```html
<div class="mb-3">
    <label for="unit-select" class="form-label">Unidad</label>
    <select class="form-select" id="unit-select">
        <option value="paragraphs">Párrafos</option>
        <option value="sentences">Oraciones</option>
        <option value="words">Palabras</option>
    </select>
</div>
<div class="mb-3">
    <label for="count-input" class="form-label">Cantidad</label>
    <input type="number" class="form-control" id="count-input" value="3" min="1" max="100">
</div>
<button id="generateBtn" class="btn btn-primary">Generar</button>
<button id="copyBtn" class="btn btn-outline-secondary">Copiar</button>
<div id="output" class="mt-3"></div>
```

### Paso 1: Identificar textos

- "Unidad" → `unitLabel`
- "Párrafos" → `paragraphsOption`
- "Oraciones" → `sentencesOption`
- "Palabras" → `wordsOption`
- "Cantidad" → `countLabel`
- "Generar" → `generateButton`
- "Copiar" → `copyButton`

### Paso 2: Actualizar JSON `lorem-ipsum-generator.json`

```json
{
  "en": {
    "unitLabel": "Unit",
    "paragraphsOption": "Paragraphs",
    "sentencesOption": "Sentences",
    "wordsOption": "Words",
    "countLabel": "Count",
    "generateButton": "Generate",
    "copyButton": "Copy",
    "copied": "✅ Copied to clipboard"
  },
  "es": {
    "unitLabel": "Unidad",
    "paragraphsOption": "Párrafos",
    "sentencesOption": "Oraciones",
    "wordsOption": "Palabras",
    "countLabel": "Cantidad",
    "generateButton": "Generar",
    "copyButton": "Copiar",
    "copied": "✅ Copiado al portapapeles"
  }
}
```

### Paso 3: Actualizar HTML

```html
<div class="mb-3">
    <label for="unit-select" class="form-label">{{t.unitLabel}}</label>
    <select class="form-select" id="unit-select">
        <option value="paragraphs">{{t.paragraphsOption}}</option>
        <option value="sentences">{{t.sentencesOption}}</option>
        <option value="words">{{t.wordsOption}}</option>
    </select>
</div>
<div class="mb-3">
    <label for="count-input" class="form-label">{{t.countLabel}}</label>
    <input type="number" class="form-control" id="count-input" value="3" min="1" max="100">
</div>
<button id="generateBtn" class="btn btn-primary">{{t.generateButton}}</button>
<button id="copyBtn" class="btn btn-outline-secondary">{{t.copyButton}}</button>
<div id="output" class="mt-3"></div>
```

## ✅ Checklist por Herramienta

- [ ] Abrir `web/templates/tools-content/TOOL_NAME-content.html`
- [ ] Identificar TODO el texto en español
- [ ] Crear claves descriptivas en inglés (camelCase)
- [ ] Añadir traducciones en `web/i18n/tools/TOOL_NAME.json`
- [ ] Reemplazar texto con `{{t.key}}` en el HTML
- [ ] Verificar que no quede texto hardcodeado
- [ ] Regenerar sitio: `npm run build` (o `node generate-site.js`)
- [ ] Probar en navegador ambos idiomas

## 🎨 Convenciones de Nombres

| Tipo | Sufijo | Ejemplo |
|------|--------|---------|
| Botón | `Button` | `generateButton`, `copyButton` |
| Label | `Label` | `unitLabel`, `countLabel` |
| Placeholder | `Placeholder` | `textPlaceholder`, `urlPlaceholder` |
| Opción de select | `Option` | `paragraphsOption`, `jpgOption` |
| Mensaje | Sin sufijo | `copied`, `success`, `error` |
| Título | `Title` | `modalTitle`, `sectionTitle` |

## 📂 Lista de Herramientas Pendientes

### Herramientas de Imagen (7)
- [x] `image-resizer-content.html` ✅
- [x] `convert-image-content.html` ✅
- [x] `image-compressor-content.html` ✅
- [x] `image-cropper-content.html` ✅
- [x] `color-palette-generator-content.html` ✅
- [x] `exif-viewer-cleaner-content.html` ✅

### Herramientas de Archivos/PDF (6)
- [x] `pdf-to-text-content.html` ✅
- [x] `merge-pdfs-content.html` ✅
- [x] `split-pdf-content.html` ✅
- [x] `compress-pdf-content.html` ✅
- [x] `pdf-to-image-content.html` ✅
- [x] `image-to-pdf-content.html` ✅

### Herramientas de Datos (5)
- [x] `toml-json-content.html` ✅
- [x] `xml-json-content.html` ✅
- [x] `yaml-json-content.html` ✅

### Herramientas de Utilidades (2)
- [x] `color-picker-converter-content.html`

### Herramientas IA (5)
- [x] `chat-ai-content.html` ✅
- [x] `summarize-content.html` ✅
- [x] `improve-text-content.html` ✅
- [x] `chat-pdf-content.html` ✅
- [x] `edit-image-content.html` ✅

### Otras Herramientas
- [ ] `lorem-ipsum-generator-content.html` ← **EJEMPLO ARRIBA**
- [ ] `base64-content.html`
- [ ] `csv-json-content.html`
- [ ] `diff-content.html`
- [ ] `hash-calculator-content.html`
- [ ] `html-encoder-content.html`
- [ ] `password-generator-content.html`
- [ ] `qr-generator-content-content.html`
- [ ] `stopwatch-timer-content.html`
- [ ] `text-cleaner-content.html`
- [ ] `url-encoder-content.html`



## 🚀 Después de Completar

1. Regenerar sitio:
   ```bash
   npm run build
   # o directamente:
   node generate-site.js
   ```

2. Probar en navegador:
   - `http://localhost:8000/tools/xxx/tool.html` (inglés)
   - `http://localhost:8000/es/tools/xxx/tool.html` (español)
3. Verificar que todo el texto esté traducido
4. Verificar que la funcionalidad siga funcionando

## 💡 Tips

- **No traduzcas valores técnicos**: `value="paragraphs"`, IDs, clases CSS
- **Sí traduce texto visible**: Botones, labels, placeholders, opciones
- **Usa nombres descriptivos**: `unitLabel` mejor que `label1`
- **Mantén consistencia**: Si usas `copyButton` en una herramienta, úsalo en todas
- **Reutiliza claves comunes**: `copyButton`, `clearButton`, `downloadButton` ya existen

---

**Fecha:** 2025-01-09  
**Estado:** 📝 Guía lista para uso manual
