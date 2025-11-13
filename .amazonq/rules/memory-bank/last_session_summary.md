# Última Sesión - Build System Unification

## Resumen

Reorganización completa del sistema de build para centralizar código fuente en `build/` y eliminar duplicación entre web y extensión. Implementación de archivos JS compartidos con detección automática de entorno.

## Cambios Principales

### 1. Reorganización de Estructura

**Antes:**
- Código duplicado entre `web/js/` y `extension/tools/`
- JS inline en templates (problemas con CSP en extensión)
- `gemini-api.js` copiado manualmente

**Después:**
- `build/shared/` como fuente única de verdad
- Script `sync:shared` para distribución automática
- JS externo en todos los templates (CSP compliant)

### 2. Archivos Compartidos Creados

**build/shared/**
- `gemini-api.js` - Cliente API con soporte web y extensión
- `chat-ai.js` - Chat con IA
- `image-generator-ai.js` - Generador de imágenes Nano Banana
- `image-editor-ai.js` - Editor de imágenes Nano Banana

**Características:**
- Detección automática de entorno: `const isExtension = typeof chrome !== 'undefined' && chrome.storage`
- Storage adaptativo: `const Storage = isExtension ? ChromeGeminiStorage : GeminiStorage`
- Sin duplicación de código

### 3. Scripts de Build

**Nuevo script: `scripts/sync-shared-files.js`**
```bash
npm run sync:shared
```
- Copia archivos de `build/shared/` a:
  - `web/js/lib/` (gemini-api.js)
  - `web/js/tools/` (herramientas IA)
  - `extension/shared/` (gemini-api.js)
  - `extension/tools/ai/` (herramientas IA)

**Flujo de build actualizado:**
```bash
npm run build:local
# 1. build:web (bump + clean + generate + categories)
# 2. build:extension (sync fasttools-data.json)
# 3. sync:shared (sync JS compartidos)
```

### 4. Templates Actualizados

**Antes (inline JS):**
```html
<script src="/js/lib/gemini-api.js"></script>
<script>
    let gemini = null;
    function saveApiKey() { ... }
    // 100+ líneas de código inline
</script>
```

**Después (JS externo):**
```html
<script src="/js/lib/gemini-api.js"></script>
<script src="/js/tools/chat-ai.js"></script>
```

**Templates actualizados:**
- `chat-ai-scripts.html` - Extraído a `chat-ai.js`
- `image-generator-ai-content.html` - Extraído a `image-generator-ai.js`
- `image-editor-ai-content.html` - Extraído a `image-editor-ai.js`

### 5. Extensión Actualizada

**Herramientas Nano Banana funcionando:**
- `extension/tools/ai/image-generator-ai.html` - Sin Bootstrap CDN, estilos inline
- `extension/tools/ai/image-editor-ai.html` - Sin Bootstrap CDN, estilos inline
- Comparten API key con otras herramientas IA
- Sin errores de CSP

**Archivos eliminados (duplicados):**
- `extension/tools/ai/chat-ai-storage.js` - Ahora usa `ChromeGeminiStorage` de `gemini-api.js`

### 6. Footer Web Arreglado

**Problema:** Footer no se veía bien por falta de flex container en body

**Solución en `web/css/style-v2.css`:**
```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
```

## Archivos Clave

### Build System
- `build/shared/gemini-api.js` - API client con ChromeGeminiStorage
- `build/shared/chat-ai.js` - Chat IA compartido
- `build/shared/image-generator-ai.js` - Generador compartido
- `build/shared/image-editor-ai.js` - Editor compartido
- `scripts/sync-shared-files.js` - Script de sincronización
- `package.json` - Actualizado con `sync:shared`

### Templates
- `build/templates/tools-content/chat-ai-scripts.html` - Solo imports
- `build/templates/tools-content/image-generator-ai-content.html` - JS extraído
- `build/templates/tools-content/image-editor-ai-content.html` - JS extraído (pendiente)

### Web
- `web/js/lib/gemini-api.js` - Copiado desde build/shared
- `web/js/tools/chat-ai.js` - Copiado desde build/shared
- `web/js/tools/image-generator-ai.js` - Copiado desde build/shared
- `web/js/tools/image-editor-ai.js` - Copiado desde build/shared
- `web/css/style-v2.css` - Footer fix

### Extension
- `extension/shared/gemini-api.js` - Copiado desde build/shared
- `extension/tools/ai/chat-ai.js` - Copiado desde build/shared
- `extension/tools/ai/image-generator-ai.js` - Copiado desde build/shared
- `extension/tools/ai/image-editor-ai.js` - Copiado desde build/shared
- `extension/shared/extension-adapter.js` - Adapter para detección de entorno (no usado actualmente)

## Estado Actual

- **Service Worker:** v3.0.35
- **Total herramientas:** 43
- **Páginas generadas:** 88 (44 EN + 44 ES)
- **Herramientas IA con JS compartido:** 4 (chat-ai, image-generator-ai, image-editor-ai, gemini-api)
- **Herramientas IA con clases UI:** 5 (summarize, improve, translate, vision-chat, chat-pdf)

## Ventajas del Nuevo Sistema

1. **Sin duplicación:** Un solo archivo fuente para web y extensión
2. **Mantenimiento fácil:** Cambios en `build/shared/` se propagan automáticamente
3. **CSP compliant:** Todo el JS en archivos externos
4. **Escalable:** Fácil añadir más herramientas compartidas
5. **Detección automática:** El mismo código funciona en ambos entornos

## Próximos Pasos

### Corto Plazo
1. ✅ Commit y push completado
2. ✅ Documentación actualizada
3. Extraer JS inline de `image-editor-ai-content.html` (pendiente onclick handlers)
4. Extraer JS inline de otras herramientas IA si tienen

### Medio Plazo
1. Llevar más herramientas a extensión (JSON formatter, CSV, etc.)
2. Sistema de versiones con backup (`web.3.0.35/` antes de regenerar)
3. Mover assets estáticos a `build/static/` (robots.txt, icons, etc.)

### Largo Plazo
1. Publicar extensión en Chrome Web Store
2. Deploy a producción con mejoras
3. Implementar sistema de i18n en extensión

## Comandos Útiles

```bash
# Build completo
npm run build:local

# Solo sincronizar archivos compartidos
npm run sync:shared

# Build solo web
npm run build:web

# Build solo extensión
npm run build:extension
```

## Notas Técnicas

### Detección de Entorno
```javascript
const isExtension = typeof chrome !== 'undefined' && chrome.storage;
const Storage = isExtension ? ChromeGeminiStorage : GeminiStorage;
```

### Storage Adaptativo
```javascript
// Web (síncrono)
const hasKey = Storage.exists();
const key = Storage.get();
Storage.save(apiKey);

// Extension (asíncrono)
const hasKey = await Storage.exists();
const key = await Storage.get();
await Storage.save(apiKey);
```

### Patrón de Uso
```javascript
// Funciona en ambos entornos
const hasKey = isExtension ? await Storage.exists() : Storage.exists();
if (hasKey) {
    const key = isExtension ? await Storage.get() : Storage.get();
    geminiAPI = new GeminiAPI(key);
}
```

---

**Última actualización:** Noviembre 2025
**Commit:** 1e76f81 - feat: unify build system with shared JS files
