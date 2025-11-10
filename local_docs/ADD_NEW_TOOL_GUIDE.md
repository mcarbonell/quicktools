# Guía para Añadir Nuevas Herramientas

## 🎯 Objetivo

Documentar el proceso completo para integrar una nueva herramienta en QuickTools, incluyendo archivos a crear, modificar y el sistema de traducciones.

## 📋 Checklist General

- [ ] Crear templates HTML (head, content, scripts)
- [ ] Crear archivo JavaScript de la herramienta
- [ ] Crear archivo JSON de traducciones
- [ ] Añadir entrada en tools-index (inglés y español)
- [ ] Regenerar sitio
- [ ] Probar en ambos idiomas

## 📁 Archivos a Crear

### 1. Templates HTML (3 archivos)

**Ubicación:** `web/templates/tools-content/`

#### a) `TOOL_NAME-head.html`
Contenido extra para el `<head>` (CSS específico, librerías externas)

```html
<style>
    /* Estilos específicos de la herramienta */
    .custom-class { color: blue; }
</style>
```

#### b) `TOOL_NAME-content.html`
Contenido HTML de la herramienta (UI, formularios, botones)

```html
<div class="mb-3">
    <label for="input">{{t.inputLabel}}</label>
    <input type="text" id="input" class="form-control" placeholder="{{t.placeholder}}">
</div>
<button id="processBtn" class="btn btn-primary">{{t.processButton}}</button>
<div id="output" class="mt-3"></div>
```

**Importante:** Usa placeholders `{{t.key}}` para todo el texto visible.

#### c) `TOOL_NAME-scripts.html`
Scripts JavaScript de la herramienta

```html
<script src="/js/tools/TOOL_NAME.js"></script>
```

### 2. Archivo JavaScript

**Ubicación:** `web/js/tools/TOOL_NAME.js`

```javascript
// Get translations (injected by generator)
const t = window.toolTranslations || {};

const input = document.getElementById('input');
const processBtn = document.getElementById('processBtn');
const output = document.getElementById('output');

processBtn?.addEventListener('click', () => {
    try {
        const value = input.value;
        if (!value) {
            alert(t.pleaseEnterValue || 'Por favor ingresa un valor');
            return;
        }
        
        // Lógica de la herramienta
        const result = processValue(value);
        output.textContent = t.success || '✅ ¡Éxito!';
    } catch (e) {
        output.textContent = (t.error || 'Error') + ': ' + e.message;
    }
});

function processValue(value) {
    // Implementación específica
    return value.toUpperCase();
}
```

**Importante:** 
- Siempre incluir `const t = window.toolTranslations || {};` al inicio
- Usar `t.key || 'fallback'` para todos los mensajes

### 3. Archivo de Traducciones

**Ubicación:** `web/i18n/tools/TOOL_NAME.json`

```json
{
  "en": {
    "inputLabel": "Input",
    "placeholder": "Type something...",
    "processButton": "Process",
    "success": "✅ Success!",
    "error": "❌ Error",
    "pleaseEnterValue": "Please enter a value",
    "copied": "✅ Copied to clipboard"
  },
  "es": {
    "inputLabel": "Entrada",
    "placeholder": "Escribe algo...",
    "processButton": "Procesar",
    "success": "✅ ¡Éxito!",
    "error": "❌ Error",
    "pleaseEnterValue": "Por favor ingresa un valor",
    "copied": "✅ Copiado al portapapeles"
  }
}
```

**Convenciones:**
- Botones: `xxxButton` (processButton, copyButton)
- Labels: `xxxLabel` (inputLabel, outputLabel)
- Placeholders: `xxxPlaceholder`
- Mensajes: sin sufijo (success, error, copied)

## 📝 Archivos a Modificar

### 4. tools-index-en.json

**Ubicación:** `web/data/tools-index-en.json`

Añadir entrada al final del array:

```json
{
  "title": "Tool Name",
  "slug": "tools/category/tool-name.html",
  "description": "Short description of what the tool does.",
  "category": "Category",
  "tags": ["tag1", "tag2", "tag3"]
}
```

**Categorías disponibles:**
- `Image` - Herramientas de imagen
- `Data` - Herramientas de datos
- `Files` - Herramientas de archivos/PDF
- `Text` - Herramientas de texto
- `Utilities` - Utilidades varias
- `Converters` - Conversores
- `Generators` - Generadores
- `AI` - Herramientas de IA

### 5. tools-index-es.json

**Ubicación:** `web/data/tools-index-es.json`

Añadir la misma entrada traducida al español:

```json
{
  "title": "Nombre de la Herramienta",
  "slug": "tools/category/tool-name.html",
  "description": "Descripción corta de lo que hace la herramienta.",
  "category": "Categoría",
  "tags": ["etiqueta1", "etiqueta2", "etiqueta3"]
}
```

**Categorías en español:**
- `Imagen`
- `Datos`
- `Archivos`
- `Texto`
- `Utilidades`
- `Conversores`
- `Generadores`
- `IA`

## 🚀 Proceso de Integración

### Paso 1: Crear los 3 templates HTML

```bash
# Crear archivos vacíos
touch web/templates/tools-content/my-tool-head.html
touch web/templates/tools-content/my-tool-content.html
touch web/templates/tools-content/my-tool-scripts.html
```

### Paso 2: Crear el JavaScript

```bash
touch web/js/tools/my-tool.js
```

### Paso 3: Crear el JSON de traducciones

```bash
touch web/i18n/tools/my-tool.json
```

### Paso 4: Añadir a tools-index

Editar ambos archivos:
- `web/data/tools-index-en.json`
- `web/data/tools-index-es.json`

### Paso 5: Regenerar el sitio

```bash
npm run build
# o
node generate-site.js
```

### Paso 6: Probar

```bash
npm run serve
```

Visitar:
- `http://localhost:8000/tools/category/my-tool.html` (inglés)
- `http://localhost:8000/es/tools/category/my-tool.html` (español)

## 📊 Estructura de Carpetas

```
quicktools/
├── web/
│   ├── templates/
│   │   └── tools-content/
│   │       ├── my-tool-head.html       ← Crear
│   │       ├── my-tool-content.html    ← Crear
│   │       └── my-tool-scripts.html    ← Crear
│   ├── js/
│   │   └── tools/
│   │       └── my-tool.js              ← Crear
│   ├── i18n/
│   │   └── tools/
│   │       └── my-tool.json            ← Crear
│   └── data/
│       ├── tools-index-en.json         ← Modificar
│       └── tools-index-es.json         ← Modificar
```

## 💡 Ejemplo Completo: "Text Reverser"

### 1. text-reverser-head.html
```html
<!-- Sin estilos especiales -->
```

### 2. text-reverser-content.html
```html
<div class="mb-3">
    <label for="textInput" class="form-label">{{t.inputLabel}}</label>
    <textarea id="textInput" class="form-control" rows="5" placeholder="{{t.placeholder}}"></textarea>
</div>
<button id="reverseBtn" class="btn btn-primary">{{t.reverseButton}}</button>
<button id="copyBtn" class="btn btn-outline-secondary">{{t.copyButton}}</button>
<div class="mt-3">
    <label class="form-label">{{t.outputLabel}}</label>
    <textarea id="textOutput" class="form-control" rows="5" readonly></textarea>
</div>
<div id="message" class="mt-2"></div>
```

### 3. text-reverser-scripts.html
```html
<script src="/js/tools/text-reverser.js"></script>
```

### 4. text-reverser.js
```javascript
const t = window.toolTranslations || {};

const input = document.getElementById('textInput');
const output = document.getElementById('textOutput');
const reverseBtn = document.getElementById('reverseBtn');
const copyBtn = document.getElementById('copyBtn');
const message = document.getElementById('message');

reverseBtn?.addEventListener('click', () => {
    const text = input.value;
    if (!text) {
        message.textContent = t.pleaseEnterText || 'Por favor ingresa un texto';
        return;
    }
    output.value = text.split('').reverse().join('');
    message.textContent = t.reversed || 'Texto invertido';
});

copyBtn?.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        message.textContent = t.copied || '✅ Copiado al portapapeles';
    } catch (e) {
        message.textContent = t.copyError || 'Error al copiar';
    }
});
```

### 5. text-reverser.json
```json
{
  "en": {
    "inputLabel": "Input Text",
    "placeholder": "Type or paste text here...",
    "reverseButton": "Reverse Text",
    "copyButton": "Copy",
    "outputLabel": "Reversed Text",
    "pleaseEnterText": "Please enter some text",
    "reversed": "Text reversed",
    "copied": "✅ Copied to clipboard",
    "copyError": "Error copying"
  },
  "es": {
    "inputLabel": "Texto de Entrada",
    "placeholder": "Escribe o pega el texto aquí...",
    "reverseButton": "Invertir Texto",
    "copyButton": "Copiar",
    "outputLabel": "Texto Invertido",
    "pleaseEnterText": "Por favor ingresa un texto",
    "reversed": "Texto invertido",
    "copied": "✅ Copiado al portapapeles",
    "copyError": "Error al copiar"
  }
}
```

### 6. Añadir a tools-index-en.json
```json
{
  "title": "Text Reverser",
  "slug": "tools/text/text-reverser.html",
  "description": "Reverse any text instantly in your browser.",
  "category": "Text",
  "tags": ["text", "reverse", "string"]
}
```

### 7. Añadir a tools-index-es.json
```json
{
  "title": "Invertir Texto",
  "slug": "tools/text/text-reverser.html",
  "description": "Invierte cualquier texto al instante en tu navegador.",
  "category": "Texto",
  "tags": ["texto", "invertir", "cadena"]
}
```

## ✅ Checklist Final

- [ ] 3 templates HTML creados con placeholders `{{t.key}}`
- [ ] JavaScript creado con `const t = window.toolTranslations || {}`
- [ ] JSON de traducciones con claves en inglés y español
- [ ] Entrada añadida a `tools-index-en.json`
- [ ] Entrada añadida a `tools-index-es.json`
- [ ] Sitio regenerado con `npm run build`
- [ ] Probado en inglés (`/tools/category/tool.html`)
- [ ] Probado en español (`/es/tools/category/tool.html`)
- [ ] Todas las funciones probadas (botones, validaciones, errores)
- [ ] Mensajes aparecen en el idioma correcto

## 🔧 Troubleshooting

**Problema:** La herramienta no aparece en el index  
**Solución:** Verifica que añadiste la entrada en ambos `tools-index-*.json` y regeneraste el sitio

**Problema:** Los textos no se traducen  
**Solución:** Verifica que usaste `{{t.key}}` en HTML y `t.key || 'fallback'` en JS

**Problema:** CSS o JS no cargan  
**Solución:** Usa rutas absolutas `/css/` y `/js/` en lugar de relativas `../../`

**Problema:** La herramienta funciona en inglés pero no en español  
**Solución:** Verifica que el JSON tiene ambas secciones `"en"` y `"es"` completas

## 📚 Referencias

- [TRANSLATION_MANUAL_GUIDE.md](TRANSLATION_MANUAL_GUIDE.md) - Traducción de templates HTML
- [JS_TRANSLATION_GUIDE.md](JS_TRANSLATION_GUIDE.md) - Traducción de JavaScript
- [STATIC_I18N_IMPLEMENTATION.md](STATIC_I18N_IMPLEMENTATION.md) - Sistema de i18n

---

**Fecha:** 2025-01-09  
**Estado:** 📝 Guía completa para añadir nuevas herramientas
