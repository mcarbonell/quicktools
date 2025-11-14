# FastTools Extension - Sistema i18n

Sistema de internacionalización para la extensión FastTools con soporte EN/ES.

## 📁 Estructura

```
extension/
├── i18n/
│   ├── en.json          # Traducciones en inglés
│   ├── es.json          # Traducciones en español
│   └── README.md        # Esta documentación
└── shared/
    └── i18n.js          # Sistema i18n
```

## 🚀 Uso Básico

### 1. Inicializar i18n

```javascript
import { initI18n, t, translatePage } from '../shared/i18n.js';

// Inicializar al cargar la página
async function init() {
    await initI18n();
    translatePage(); // Traduce elementos con data-i18n
}

init();
```

### 2. Traducir en HTML

```html
<!-- Texto -->
<h1 data-i18n="popup.greeting_morning"></h1>

<!-- Placeholder -->
<input data-i18n-placeholder="popup.search_placeholder">

<!-- Title -->
<button data-i18n-title="common.save">💾</button>
```

### 3. Traducir en JavaScript

```javascript
import { t } from '../shared/i18n.js';

// Traducción simple
const greeting = t('popup.greeting_morning');
// → "¡Buenos días!" (ES) o "Good morning!" (EN)

// Con parámetros
const message = t('messages.color_copied', { color: '#FF0000' });
// → "Color #FF0000 copiado" (ES)

// Forzar idioma
const text = t('common.save', {}, 'en');
// → "Save" (siempre en inglés)
```

### 4. Categorías

```javascript
import { getCategoryName } from '../shared/i18n.js';

const name = getCategoryName('developers');
// → "💻 Desarrolladores" (ES) o "💻 Developers" (EN)
```

## 📝 Estructura de Traducciones

### Secciones disponibles:

- **common**: Textos comunes (save, cancel, close, etc.)
- **popup**: Textos del popup principal
- **newtab**: Textos de la nueva pestaña
- **options**: Textos de la página de configuración
- **onboarding**: Textos del wizard de bienvenida
- **categories**: Nombres de categorías
- **messages**: Mensajes de éxito/error

### Ejemplo de estructura:

```json
{
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar"
  },
  "popup": {
    "greeting_morning": "¡Buenos días!",
    "search_placeholder": "🔍 Buscar herramientas..."
  }
}
```

## 🔧 API Completa

### `initI18n()`
Inicializa el sistema i18n, carga traducciones y detecta idioma.

```javascript
const lang = await initI18n();
console.log('Idioma actual:', lang); // 'es' o 'en'
```

### `t(key, params, lang)`
Obtiene una traducción por clave.

- **key**: Clave de traducción (ej: 'common.save')
- **params**: Objeto con parámetros a reemplazar
- **lang**: Idioma opcional (por defecto usa el actual)

```javascript
t('common.save'); // "Guardar"
t('messages.color_copied', { color: '#FF0000' }); // "Color #FF0000 copiado"
t('common.save', {}, 'en'); // "Save"
```

### `translatePage()`
Traduce todos los elementos con atributos `data-i18n`.

```javascript
translatePage();
```

### `getCurrentLanguage()`
Obtiene el idioma actual desde storage.

```javascript
const lang = await getCurrentLanguage();
```

### `setLanguage(lang)`
Cambia el idioma y guarda en storage.

```javascript
await setLanguage('en');
```

### `getBrowserLanguage()`
Detecta el idioma del navegador.

```javascript
const lang = getBrowserLanguage(); // 'es' o 'en'
```

### `getCategoryName(category, lang)`
Obtiene el nombre traducido de una categoría.

```javascript
getCategoryName('developers'); // "💻 Desarrolladores"
getCategoryName('ai-tools'); // "🤖 IA"
```

## 🎯 Ejemplos Completos

### Popup con i18n

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module" src="popup.js"></script>
</head>
<body>
    <h1 data-i18n="popup.greeting_morning"></h1>
    <input data-i18n-placeholder="popup.search_placeholder">
    <button data-i18n="common.save"></button>
</body>
</html>
```

```javascript
// popup.js
import { initI18n, translatePage, t } from '../shared/i18n.js';

async function init() {
    await initI18n();
    translatePage();
    
    // Traducción dinámica
    document.querySelector('button').addEventListener('click', () => {
        alert(t('messages.settings_saved'));
    });
}

init();
```

### Cambiar idioma

```javascript
import { setLanguage, translatePage } from '../shared/i18n.js';

document.getElementById('lang-selector').addEventListener('change', async (e) => {
    await setLanguage(e.target.value);
    location.reload(); // Recargar para aplicar cambios
});
```

## 📋 Checklist de Implementación

Para añadir i18n a una nueva página:

- [ ] Importar `initI18n`, `t`, `translatePage` desde `../shared/i18n.js`
- [ ] Llamar `await initI18n()` al cargar
- [ ] Llamar `translatePage()` después de inicializar
- [ ] Añadir atributos `data-i18n` a elementos HTML
- [ ] Usar `t()` para traducciones dinámicas en JS
- [ ] Añadir nuevas claves a `en.json` y `es.json` si es necesario

## 🌐 Añadir Nuevas Traducciones

1. Editar `i18n/es.json` y `i18n/en.json`
2. Añadir la clave en la sección apropiada
3. Usar la clave con `t()` o `data-i18n`

```json
// es.json
{
  "popup": {
    "new_feature": "Nueva funcionalidad"
  }
}

// en.json
{
  "popup": {
    "new_feature": "New feature"
  }
}
```

```html
<div data-i18n="popup.new_feature"></div>
```

## 🔄 Sincronización con Web

El sistema i18n de la extensión está inspirado en el de la web (`web/i18n/`), pero adaptado para extensiones:

- **Web**: Carga JSON con `fetch()` relativo
- **Extensión**: Carga JSON con `chrome.runtime.getURL()`
- **Estructura**: Similar pero con secciones específicas de extensión

## 📚 Recursos

- [Chrome Extension i18n](https://developer.chrome.com/docs/extensions/reference/i18n/)
- [Web i18n System](../../web/i18n/README.md)
- [FastTools Guidelines](../../.amazonq/rules/memory-bank/guidelines.md)
