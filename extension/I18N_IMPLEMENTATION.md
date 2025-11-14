# Sistema i18n - Implementación Completa

## ✅ Estado: LISTO PARA USAR

El sistema de internacionalización (i18n) está completamente implementado y listo para ser usado en todas las páginas de la extensión.

## 📦 Archivos Creados

### 1. Archivos de Traducción
- ✅ `extension/i18n/es.json` - Traducciones en español
- ✅ `extension/i18n/en.json` - Traducciones en inglés
- ✅ `extension/i18n/README.md` - Documentación completa

### 2. Sistema i18n
- ✅ `extension/shared/i18n.js` - Sistema actualizado con carga desde JSON
- ✅ `extension/manifest.json` - Actualizado con `i18n/*` en web_accessible_resources

## 🎯 Características

### ✨ Funcionalidades Implementadas

1. **Carga Dinámica de Traducciones**
   - Carga archivos JSON desde `i18n/` usando `chrome.runtime.getURL()`
   - Cache de traducciones en memoria
   - Precarga del idioma alternativo

2. **Detección Automática de Idioma**
   - Lee preferencia de usuario desde `chrome.storage.local`
   - Fallback a idioma del navegador
   - Soporte para cambio dinámico de idioma

3. **Traducción de HTML**
   - Atributo `data-i18n` para texto
   - Atributo `data-i18n-placeholder` para placeholders
   - Atributo `data-i18n-title` para títulos
   - Función `translatePage()` para traducir toda la página

4. **Traducción en JavaScript**
   - Función `t(key, params, lang)` con soporte para parámetros
   - Navegación de claves anidadas (ej: `common.save`)
   - Reemplazo de parámetros con `{param}`

5. **Categorías**
   - Función `getCategoryName(category, lang)` especializada
   - Normalización automática de slugs (guiones → underscores)

## 📋 Secciones de Traducción

### Disponibles en `es.json` y `en.json`:

- **common**: Textos comunes (save, cancel, close, delete, edit, etc.)
- **popup**: Textos del popup principal (saludos, búsqueda, secciones)
- **newtab**: Textos de la nueva pestaña (bienvenida, sitios, recomendaciones)
- **options**: Textos de configuración (perfil, apariencia, IA, about)
- **onboarding**: Textos del wizard de bienvenida (pasos, títulos, botones)
- **categories**: Nombres de categorías (developers, designers, writers, etc.)
- **messages**: Mensajes de éxito/error (guardado, eliminado, copiado, etc.)

## 🚀 Cómo Usar

### Paso 1: Importar en tu página

```javascript
import { initI18n, t, translatePage } from '../shared/i18n.js';
```

### Paso 2: Inicializar al cargar

```javascript
async function init() {
    await initI18n();
    translatePage();
}

init();
```

### Paso 3: Usar en HTML

```html
<!-- Texto -->
<h1 data-i18n="popup.greeting_morning"></h1>

<!-- Placeholder -->
<input data-i18n-placeholder="popup.search_placeholder">

<!-- Botón -->
<button data-i18n="common.save"></button>
```

### Paso 4: Usar en JavaScript

```javascript
// Traducción simple
const text = t('common.save');

// Con parámetros
const message = t('messages.color_copied', { color: '#FF0000' });

// Categorías
import { getCategoryName } from '../shared/i18n.js';
const name = getCategoryName('developers');
```

## 📝 Ejemplo Completo

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module" src="page.js"></script>
</head>
<body>
    <h1 data-i18n="popup.greeting_morning"></h1>
    <input data-i18n-placeholder="popup.search_placeholder">
    <button id="save-btn" data-i18n="common.save"></button>
    <div id="message"></div>
</body>
</html>
```

```javascript
// page.js
import { initI18n, translatePage, t } from '../shared/i18n.js';

async function init() {
    // Inicializar i18n
    await initI18n();
    
    // Traducir página
    translatePage();
    
    // Traducción dinámica
    document.getElementById('save-btn').addEventListener('click', () => {
        document.getElementById('message').textContent = t('messages.settings_saved');
    });
}

init();
```

## 🔄 Próximos Pasos

### Para implementar en páginas existentes:

1. **Popup** (`popup/popup-simple.html` + `popup-simple.js`)
   - [ ] Importar i18n
   - [ ] Añadir `data-i18n` a elementos
   - [ ] Llamar `initI18n()` y `translatePage()`

2. **New Tab** (`newtab/newtab.html` + `newtab.js`)
   - [ ] Importar i18n
   - [ ] Añadir `data-i18n` a elementos
   - [ ] Llamar `initI18n()` y `translatePage()`

3. **Options** (`options/options.html` + `options.js`)
   - [ ] Importar i18n
   - [ ] Añadir `data-i18n` a elementos
   - [ ] Llamar `initI18n()` y `translatePage()`
   - [ ] Conectar selector de idioma con `setLanguage()`

4. **Onboarding** (`onboarding/setup.html` + `setup.js`)
   - [ ] Importar i18n
   - [ ] Añadir `data-i18n` a elementos
   - [ ] Llamar `initI18n()` y `translatePage()`

5. **Herramientas AI** (`tools/ai/*.html`)
   - [ ] Importar i18n en cada herramienta
   - [ ] Añadir traducciones específicas si es necesario

6. **Herramientas SEO** (`tools/seo/*.html`)
   - [ ] Importar i18n en cada herramienta
   - [ ] Añadir traducciones específicas si es necesario

## 📚 Documentación

Ver `extension/i18n/README.md` para documentación completa con:
- API completa
- Ejemplos de uso
- Checklist de implementación
- Cómo añadir nuevas traducciones

## 🎨 Convenciones

### Claves de traducción:
- Usar snake_case: `greeting_morning`, `search_placeholder`
- Agrupar por sección: `common.save`, `popup.greeting_morning`
- Descriptivas: `btn_edit` mejor que `edit_btn`

### Parámetros:
- Usar llaves: `{color}`, `{count}`, `{name}`
- Nombres descriptivos en inglés

### Emojis:
- Incluir en las traducciones cuando sea apropiado
- Consistentes entre idiomas

## ✅ Testing

Para probar el sistema:

1. Cargar la extensión en Chrome
2. Abrir cualquier página (popup, options, newtab)
3. Verificar que los textos se muestran en el idioma correcto
4. Cambiar idioma en Options
5. Recargar y verificar que el idioma cambió

## 🐛 Troubleshooting

### Las traducciones no se cargan
- Verificar que `i18n/*` está en `web_accessible_resources` del manifest
- Verificar que los archivos JSON son válidos
- Revisar consola para errores de carga

### Textos aparecen como claves
- Verificar que la clave existe en el JSON
- Verificar que `initI18n()` se llamó antes de `translatePage()`
- Revisar consola para warnings

### Idioma no cambia
- Verificar que `setLanguage()` se llama correctamente
- Verificar que la página se recarga después del cambio
- Revisar `chrome.storage.local` para confirmar que se guardó

## 📊 Estadísticas

- **Idiomas soportados**: 2 (ES, EN)
- **Secciones de traducción**: 7
- **Claves totales**: ~80 por idioma
- **Páginas a actualizar**: 6 principales + herramientas

---

**Estado**: ✅ Sistema completo y funcional  
**Próximo paso**: Implementar en páginas existentes  
**Documentación**: `extension/i18n/README.md`
