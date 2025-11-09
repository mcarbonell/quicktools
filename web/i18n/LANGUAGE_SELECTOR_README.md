# Language Selector - URL-Based Redirection

## 🎯 Funcionamiento

El selector de idioma **NO inyecta texto dinámicamente**. En su lugar, **redirige a la URL correcta** del idioma seleccionado.

## 🔄 Lógica de Redirección

### Detección del Idioma Actual
```javascript
// Detecta el idioma desde la URL
/tools/data/json-formatter.html     → 'en' (default)
/es/tools/data/json-formatter.html  → 'es'
```

### Conversión de URLs

**De Inglés a Español:**
```
/tools/data/json-formatter.html
  ↓
/es/tools/data/json-formatter.html
```

**De Español a Inglés:**
```
/es/tools/data/json-formatter.html
  ↓
/tools/data/json-formatter.html
```

**Entre idiomas no-default:**
```
/es/tools/data/json-formatter.html
  ↓
/fr/tools/data/json-formatter.html
```

## 📝 Código Clave

```javascript
getUrlForLocale(locale) {
  const currentPath = window.location.pathname;
  const currentLocale = this.detectCurrentLocale();
  
  // Switching to default language (en)
  if (locale === 'en') {
    return currentPath.replace(/^\/es\//, '/');
  }
  
  // Switching to non-default language
  if (currentLocale === 'en') {
    return `/${locale}${currentPath}`;
  } else {
    return currentPath.replace(/^\/[a-z]{2}\//, `/${locale}/`);
  }
}
```

## ✅ Ventajas

1. **SEO perfecto**: Cada idioma tiene su propia URL
2. **Sin JavaScript para contenido**: HTML estático
3. **URLs compartibles**: Los usuarios pueden compartir enlaces en su idioma
4. **Historial del navegador**: Funciona correctamente con back/forward
5. **Sin estado**: No depende de localStorage ni cookies

## 🚫 Lo que NO hace

- ❌ No inyecta texto dinámicamente
- ❌ No usa `i18n.load()` para cambiar contenido
- ❌ No dispara eventos `localeChanged`
- ❌ No modifica el DOM actual

## 🔧 Añadir Nuevo Idioma

1. Añadir detección en `detectCurrentLocale()`:
```javascript
detectCurrentLocale() {
  const path = window.location.pathname;
  if (path.startsWith('/es/')) return 'es';
  if (path.startsWith('/fr/')) return 'fr';  // ← Nuevo
  return 'en';
}
```

2. Regenerar sitio con el nuevo idioma en `site-config.json`

## 📊 Flujo Completo

```
Usuario hace clic en "Español"
  ↓
detectCurrentLocale() → 'en'
  ↓
getUrlForLocale('es') → '/es/tools/data/json-formatter.html'
  ↓
window.location.href = newUrl
  ↓
Navegador carga la página en español (HTML estático)
```

## 🎨 UI del Selector

El selector muestra:
- **Bandera** del idioma actual
- **Nombre nativo** (English, Español)
- **Dropdown** con todos los idiomas disponibles
- **Marca "active"** en el idioma actual

Todo esto se renderiza desde `/i18n/locales.json`.
