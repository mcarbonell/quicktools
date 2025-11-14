# Sistema de Herramientas - FastTools Extension

## 📊 Estado Actual

✅ **Extension**: 12 herramientas AI  
✅ **Web**: 12 herramientas AI  
✅ **Sincronizadas**: Sí

## 🏗️ Arquitectura del Sistema

### 1. Fuente de Datos Única

**Archivo**: `build/data/fasttools-data.json`

Este es el **single source of truth** que contiene:
- `toolCategories`: Categorías de herramientas (image, data, text, ai, seo, etc.)
- `audiences`: Perfiles de usuario (developers, designers, writers, etc.)
- `tools`: Array con TODAS las herramientas (47 total)

### 2. Sincronización a Extension

**Script**: `scripts/build-extension.js`

```bash
npm run build:extension
```

Este script copia `build/data/fasttools-data.json` → `extension/data/fasttools-data.json`

### 3. Carga de Herramientas en Extension

**Archivo**: `extension/shared/tools-loader.js`

```javascript
export async function loadTools(lang = 'es') {
    const response = await fetch(chrome.runtime.getURL('data/fasttools-data.json'));
    const data = await response.json();
    
    // Transforma tools del JSON a formato usado por la extensión
    return data.tools.map(tool => ({
        id: tool.id,
        slug: tool.extensionSlug || tool.slug,
        title: tool.title[lang],
        description: tool.description[lang],
        icon: tool.icon,
        category: tool.categories[0],
        url: getToolUrl(tool, lang)
    }));
}
```

### 4. Uso en Páginas

**Popup** (`popup/popup-simple.js`):
```javascript
import { loadTools } from '../shared/tools-loader.js';

this.tools = await loadTools(this.lang);
this.renderTools(); // Muestra todas las herramientas
```

**New Tab** (`newtab/newtab.js`):
```javascript
import { loadTools } from '../shared/tools-loader.js';

this.tools = await loadTools(this.lang);
// Filtra herramientas SEO (necesitan contexto de tab activo)
const filteredTools = this.tools.filter(tool => !tool.slug.startsWith('tools/seo/'));
```

## 📋 Herramientas AI Actuales (12)

1. ✅ **chat-ai** - Chat con IA (Gemini)
2. ✅ **summarize-text-ai** - Resumir texto
3. ✅ **improve-text-ai** - Mejorar texto
4. ✅ **chat-pdf** - Chat con PDF
5. ✅ **vision-chat-ai** - Chat con imagen
6. ✅ **translate-ai** - Traductor IA
7. ✅ **image-generator-ai** - Generador de imágenes (Nano Banana)
8. ✅ **image-editor-ai** - Editor de imágenes (Nano Banana)
9. ✅ **alt-text-generator-ai** - Generador de alt text
10. ✅ **audio-transcription-ai** - Transcripción de audio
11. ✅ **image-to-text-ocr** - OCR (imagen a texto)
12. ✅ **ai-meme-generator** - Generador de memes

## 🔍 Diferencias Web vs Extension

### Campo `availableIn`

Algunas herramientas tienen el campo `availableIn`:

```json
{
  "id": "chat-ai",
  "availableIn": ["web", "extension"]
}
```

- **Sin campo o con "web"**: Solo en web, redirige a fasttools.ai
- **Con "extension"**: Implementada localmente en extension

### Campo `extensionSlug`

Para herramientas con implementación local:

```json
{
  "id": "chat-ai",
  "slug": "chat-ai.html",
  "extensionSlug": "tools/ai/chat-ai.html"
}
```

- `slug`: Ruta en web
- `extensionSlug`: Ruta en extension

## 🛠️ Cómo Añadir una Nueva Herramienta

### Paso 1: Añadir a `build/data/fasttools-data.json`

```json
{
  "id": "nueva-herramienta-ai",
  "slug": "nueva-herramienta-ai.html",
  "extensionSlug": "tools/ai/nueva-herramienta-ai.html",
  "title": {
    "es": "Nueva Herramienta IA",
    "en": "New AI Tool"
  },
  "description": {
    "es": "Descripción en español",
    "en": "Description in English"
  },
  "categories": ["ai"],
  "icon": "🆕",
  "tags": ["ai", "new"],
  "availableIn": ["web", "extension"]
}
```

### Paso 2: Sincronizar a Extension

```bash
npm run build:extension
```

### Paso 3: Crear Implementación (si es local)

Crear archivo `extension/tools/ai/nueva-herramienta-ai.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Nueva Herramienta IA</title>
    <link rel="stylesheet" href="../../shared/styles.css">
</head>
<body>
    <!-- Implementación de la herramienta -->
    <script type="module" src="nueva-herramienta-ai.js"></script>
</body>
</html>
```

### Paso 4: Verificar

1. Recargar extensión
2. Abrir popup o new tab
3. Buscar la nueva herramienta
4. Verificar que funciona correctamente

## 🔄 Flujo de Actualización

```
1. Editar build/data/fasttools-data.json
   ↓
2. npm run build:extension
   ↓
3. Recargar extensión en Chrome
   ↓
4. Verificar en popup/newtab
```

## 📁 Estructura de Archivos

```
quicktools/
├── build/
│   └── data/
│       └── fasttools-data.json          # ← FUENTE ÚNICA
├── extension/
│   ├── data/
│   │   └── fasttools-data.json          # ← COPIA (sincronizada)
│   ├── shared/
│   │   └── tools-loader.js              # ← CARGADOR
│   ├── popup/
│   │   └── popup-simple.js              # ← USA loadTools()
│   ├── newtab/
│   │   └── newtab.js                    # ← USA loadTools()
│   └── tools/
│       └── ai/                          # ← IMPLEMENTACIONES
│           ├── chat-ai.html
│           ├── summarize-text.html
│           └── ...
└── scripts/
    └── build-extension.js               # ← SCRIPT DE SYNC
```

## 🎯 Herramientas por Categoría

### AI (12 herramientas)
- 8 implementadas en extension
- 4 solo en web (redirigen a fasttools.ai)

### SEO (8 herramientas)
- Todas implementadas en extension
- Requieren contexto de tab activo
- No se muestran en new tab

### Otras (27 herramientas)
- Todas redirigen a fasttools.ai
- Se muestran en popup y new tab

## 🔧 Tools Loader API

### `loadTools(lang)`
Carga todas las herramientas en el idioma especificado.

```javascript
const tools = await loadTools('es');
// Retorna array de objetos tool con title, description, etc. traducidos
```

### `getToolById(tools, id)`
Busca una herramienta por ID.

```javascript
const tool = getToolById(tools, 'chat-ai');
```

### `filterByCategory(tools, category)`
Filtra herramientas por categoría.

```javascript
const aiTools = filterByCategory(tools, 'ai');
```

### `getCategories(tools)`
Obtiene lista de categorías únicas.

```javascript
const categories = getCategories(tools);
// ['image', 'data', 'text', 'ai', 'seo', ...]
```

## 📊 Estadísticas

- **Total herramientas**: 47
- **Herramientas AI**: 12
- **Herramientas SEO**: 8
- **Implementadas en extension**: ~20
- **Redirigen a web**: ~27

## 🚀 Próximos Pasos

Si quieres añadir más herramientas AI a la extensión:

1. Verificar que están en `build/data/fasttools-data.json`
2. Añadir campo `extensionSlug` si tienen implementación local
3. Añadir a `availableIn: ["web", "extension"]`
4. Crear implementación en `extension/tools/ai/`
5. Sincronizar con `npm run build:extension`

---

**Nota**: El sistema está diseñado para mantener sincronizadas web y extension desde una única fuente de datos, facilitando el mantenimiento y evitando duplicación.
