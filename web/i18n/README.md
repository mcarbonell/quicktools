# 🌍 Sistema de Internacionalización (i18n)

Sistema simple y ligero de internacionalización para QuickTools.

## 📁 Estructura

```
web/i18n/
├── i18n.js                 # Sistema principal
├── language-selector.js    # Componente selector de idioma
├── en.json                 # Traducciones inglés (principal)
├── es.json                 # Traducciones español
├── locales.json            # Metadata de idiomas
└── README.md               # Esta documentación
```

## 🚀 Uso Básico

### 1. Incluir en HTML

```html
<!-- En el <head> -->
<script src="/i18n/i18n.js"></script>

<!-- Antes de cerrar </body> -->
<script src="/i18n/language-selector.js"></script>
```

### 2. Selector de Idioma

```html
<!-- En el navbar o donde quieras el selector -->
<div id="languageSelector"></div>
```

El selector se inicializa automáticamente.

### 3. Usar Traducciones en JavaScript

```javascript
// Esperar a que se carguen las traducciones
window.addEventListener('DOMContentLoaded', async () => {
  await i18n.load();
  
  // Obtener traducción simple
  const title = i18n.t('common.title'); // "QuickTools"
  
  // Con parámetros
  const message = i18n.t('welcome.message', { name: 'John' });
  // Si en JSON: "welcome.message": "Hello {{name}}!"
  // Resultado: "Hello John!"
  
  // Actualizar contenido
  document.getElementById('title').textContent = i18n.t('common.title');
});
```

### 4. Actualizar Contenido al Cambiar Idioma

```javascript
// Escuchar cambios de idioma
window.addEventListener('localeChanged', (e) => {
  console.log('Nuevo idioma:', e.detail.locale);
  updatePageContent();
});

function updatePageContent() {
  // Actualizar todos los textos
  document.getElementById('title').textContent = i18n.t('common.title');
  document.getElementById('tagline').textContent = i18n.t('common.tagline');
  // ... etc
}
```

## 📝 Estructura de Traducciones

### Organización del JSON

```json
{
  "common": {
    "title": "QuickTools",
    "buttons": {
      "save": "Save",
      "cancel": "Cancel"
    }
  },
  "tools": {
    "chat": {
      "title": "AI Chat",
      "placeholder": "Type your message..."
    }
  }
}
```

### Acceso con Dot Notation

```javascript
i18n.t('common.title')              // "QuickTools"
i18n.t('common.buttons.save')       // "Save"
i18n.t('tools.chat.title')          // "AI Chat"
```

## 🔧 API del Sistema

### Clase I18n

```javascript
// Detectar idioma automáticamente
i18n.detectLocale()

// Cargar idioma específico
await i18n.load('en')

// Obtener traducción
i18n.t('key.path')
i18n.t('key.path', { param: 'value' })

// Obtener idioma actual
i18n.getCurrentLocale()  // 'en' o 'es'

// Obtener idiomas disponibles
i18n.getAvailableLocales()  // ['en', 'es']
```

### Eventos

```javascript
// Cuando cambia el idioma
window.addEventListener('localeChanged', (e) => {
  console.log(e.detail.locale);  // 'en' o 'es'
});

// Para actualizar contenido personalizado
window.addEventListener('updateContent', () => {
  // Tu lógica de actualización
});
```

## 🎨 Ejemplo Completo

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QuickTools</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="/i18n/i18n.js"></script>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <span class="navbar-brand" id="navTitle">QuickTools</span>
            <div id="languageSelector"></div>
        </div>
    </nav>

    <main class="container">
        <h1 id="heroTitle">Loading...</h1>
        <p id="heroSubtitle">Loading...</p>
        <button id="ctaButton" class="btn btn-primary">Loading...</button>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/i18n/language-selector.js"></script>
    <script>
        async function updateContent() {
            document.getElementById('navTitle').textContent = i18n.t('common.title');
            document.getElementById('heroTitle').textContent = i18n.t('hero.title');
            document.getElementById('heroSubtitle').textContent = i18n.t('hero.subtitle');
            document.getElementById('ctaButton').textContent = i18n.t('hero.cta');
        }

        // Initial load
        window.addEventListener('DOMContentLoaded', async () => {
            await i18n.load();
            updateContent();
        });

        // Update on language change
        window.addEventListener('localeChanged', updateContent);
    </script>
</body>
</html>
```

## 📋 Checklist de Implementación

### Para cada página:

```
□ Incluir i18n.js en <head>
□ Incluir language-selector.js antes de </body>
□ Añadir <div id="languageSelector"></div> en navbar
□ Crear función updateContent()
□ Llamar updateContent() en DOMContentLoaded
□ Escuchar evento 'localeChanged'
□ Añadir todas las traducciones a en.json y es.json
```

## 🌐 Añadir Nuevo Idioma

1. Crear archivo `web/i18n/fr.json` (ejemplo francés)
2. Copiar estructura de `en.json`
3. Traducir todos los textos
4. Actualizar `locales.json`:

```json
{
  "locales": [
    ...
    {
      "code": "fr",
      "name": "French",
      "nativeName": "Français",
      "flag": "🇫🇷",
      "default": false
    }
  ]
}
```

5. Actualizar `i18n.js`:

```javascript
// En detectLocale()
if (['en', 'es', 'fr'].includes(browser)) return browser;

// En getAvailableLocales()
return ['en', 'es', 'fr'];
```

## 🐛 Troubleshooting

### Las traducciones no se cargan

```javascript
// Verificar en consola
console.log('Locale:', i18n.getCurrentLocale());
console.log('Translations:', i18n.translations);
```

### Traducción faltante

Si una clave no existe, el sistema:
1. Muestra warning en consola
2. Devuelve la clave como fallback

```javascript
i18n.t('nonexistent.key')  // Devuelve: "nonexistent.key"
// Console: "Translation missing: nonexistent.key"
```

### Cambio de idioma no actualiza contenido

Asegúrate de escuchar el evento:

```javascript
window.addEventListener('localeChanged', () => {
  updateContent();
});
```

## 📊 Estado Actual

- ✅ Sistema i18n implementado
- ✅ Inglés (principal) - 100% traducido
- ✅ Español (secundario) - 100% traducido
- ✅ Selector de idioma funcional
- ✅ Auto-detección de idioma navegador
- ✅ Persistencia en localStorage
- ⏳ Integración en todas las páginas (pendiente)

## 🚀 Próximos Pasos

1. Integrar en templates base
2. Actualizar todas las 33 herramientas
3. Traducir páginas legales
4. Testing cross-browser
5. Documentar para contribuidores

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025
