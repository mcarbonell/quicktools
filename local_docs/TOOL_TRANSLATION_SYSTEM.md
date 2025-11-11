# Sistema de Traducción de Herramientas

## 🎯 Objetivo

Traducir las 33 herramientas individuales de forma eficiente usando archivos JSON pequeños en lugar de duplicar 66 archivos HTML.

## 📁 Estructura

```
web/i18n/tools/
├── json-formatter.json
├── csv-json.json
├── yaml-json.json
└── ... (33 archivos)
```

Cada archivo contiene:
```json
{
  "en": {
    "copyButton": "Copy",
    "formatButton": "Format",
    "minifyButton": "Minify"
  },
  "es": {
    "copyButton": "Copiar",
    "formatButton": "Formatear",
    "minifyButton": "Minificar"
  }
}
```

## 🔧 Uso en Templates y JavaScript

### En HTML Templates

En los templates (`web/templates/tools-content/`), usa placeholders:

```html
<button id="copyBtn">{{t.copyButton}}</button>
<button id="formatBtn">{{t.formatButton}}</button>
```

El generador reemplaza `{{t.key}}` con la traducción correcta según el idioma.

### En JavaScript

El generador inyecta las traducciones como variable global `window.toolTranslations`:

```javascript
// Acceder a traducciones
const t = window.toolTranslations || {};

// Usar en el código
showMsg(t.copied || 'Copiado al portapapeles.', 'success');
showMsg(t.invalidJson || 'JSON inválido', 'error');
```

**Ventaja:** El mismo archivo JS funciona para todos los idiomas.

## 🚀 Workflow

### 1. Crear archivo de traducción

```bash
# Crear manualmente o usar el script
node scripts/generate-tool-translations.js
```

### 2. Actualizar template con placeholders

```html
<!-- Antes -->
<button>Formatear</button>

<!-- Después -->
<button>{{t.formatButton}}</button>
```

### 3. Regenerar sitio

```bash
npm run build
```

## 📝 Traducciones Comunes

Todas las herramientas comparten estas traducciones base:

| Key | English | Español |
|-----|---------|---------|
| `copyButton` | Copy | Copiar |
| `clearButton` | Clear | Limpiar |
| `downloadButton` | Download | Descargar |
| `uploadButton` | Upload | Subir |
| `processButton` | Process | Procesar |
| `copied` | ✅ Copied to clipboard | ✅ Copiado al portapapeles |
| `processing` | ⏳ Processing... | ⏳ Procesando... |
| `success` | ✅ Success! | ✅ ¡Éxito! |
| `error` | ❌ Error | ❌ Error |

## 🛠️ Script de Generación

`scripts/generate-tool-translations.js` genera automáticamente archivos de traducción para herramientas comunes.

**Uso:**
```bash
node scripts/generate-tool-translations.js
```

**Genera:**
- 12+ archivos JSON con traducciones base
- Incluye traducciones comunes + específicas por herramienta

## 📊 Estado Actual

### ✅ Implementado (13 herramientas)
- json-formatter
- csv-json
- yaml-json
- xml-json
- toml-json
- base64
- url-encoder
- html-encoder
- text-cleaner
- diff
- qr-generator
- password-generator
- hash-calculator

### ⏳ Pendiente (20 herramientas)
- Herramientas de imagen (7)
- Herramientas de archivos/PDF (6)
- Herramientas de IA (5)
- Otras utilidades (2)

## 🎨 Ejemplo Completo

**Archivo:** `web/i18n/tools/json-formatter.json`
```json
{
  "en": {
    "title": "Format JSON",
    "description": "Format, validate and minify JSON instantly.",
    "formatButton": "Format",
    "minifyButton": "Minify",
    "copyButton": "Copy",
    "validJson": "✅ Valid JSON",
    "invalidJson": "❌ Invalid JSON"
  },
  "es": {
    "title": "Formatear JSON",
    "description": "Formatea, valida y minifica JSON al instante.",
    "formatButton": "Formatear",
    "minifyButton": "Minificar",
    "copyButton": "Copiar",
    "validJson": "✅ JSON válido",
    "invalidJson": "❌ JSON inválido"
  }
}
```

**Template:** `web/templates/tools-content/json-formatter-content.html`
```html
<button id="formatBtn">{{t.formatButton}}</button>
<button id="minifyBtn">{{t.minifyButton}}</button>
<button id="copyBtn" title="{{t.copyButton}}">Copy</button>
```

**Resultado en `/tools/data/json-formatter.html` (inglés):**
```html
<button id="formatBtn">Format</button>
<button id="minifyBtn">Minify</button>
<button id="copyBtn" title="Copy">Copy</button>
```

**Resultado en `/es/tools/data/json-formatter.html` (español):**
```html
<button id="formatBtn">Formatear</button>
<button id="minifyBtn">Minificar</button>
<button id="copyBtn" title="Copiar">Copy</button>
```

## 🔄 Proceso de Generación

1. `generate-site.js` lee `tools-index-{lang}.json`
2. Para cada herramienta, carga `i18n/tools/{tool}.json`
3. Lee templates de `templates/tools-content/`
4. Reemplaza `{{t.key}}` con traducciones
5. Genera HTML estático en `/tools/` y `/es/tools/`

## 📈 Ventajas

✅ **Mantenible**: Solo 33 archivos JSON pequeños  
✅ **Escalable**: Fácil añadir nuevos idiomas  
✅ **SEO**: HTML estático final  
✅ **DRY**: No duplicar HTML completo  
✅ **Flexible**: Cada herramienta tiene sus propias traducciones

## 🚧 Próximos Pasos

1. Crear archivos de traducción para las 20 herramientas restantes
2. Actualizar templates con placeholders `{{t.key}}`
3. Regenerar sitio completo
4. Verificar traducciones en navegador

---

**Fecha:** 2025-01-09  
**Estado:** ✅ Sistema implementado y funcional
