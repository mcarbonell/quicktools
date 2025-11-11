# Implementación de i18n Estático con URLs por Idioma

## 📋 Resumen

Se ha implementado un sistema de **internacionalización estática** que genera páginas HTML separadas para cada idioma, con URLs únicas y optimización SEO completa.

## 🎯 Arquitectura

### Estructura de URLs

```
quicktools.dev/                          → Inglés (idioma por defecto)
quicktools.dev/tools/data/json-formatter.html

quicktools.dev/es/                       → Español
quicktools.dev/es/tools/data/json-formatter.html
```

**Ventajas:**
- ✅ URLs únicas por idioma (compartibles)
- ✅ Contenido HTML estático (mejor SEO)
- ✅ Sin dependencia de JavaScript para contenido
- ✅ `hreflang` tags automáticos
- ✅ Sitemap multiidioma

### Estructura de Archivos Generados

```
web/
├── index.html                           # Inglés (default)
├── tools/
│   ├── data/
│   │   ├── json-formatter.html          # Inglés
│   │   └── csv-json.html
│   ├── image/
│   └── ...
├── es/                                  # Español
│   ├── index.html
│   └── tools/
│       ├── data/
│       │   ├── json-formatter.html
│       │   └── csv-json.html
│       └── ...
└── sitemap.xml                          # Sitemap con ambos idiomas
```

## 🛠️ Componentes del Sistema

### 1. `site-config.json`

Archivo de configuración central con variables globales:

```json
{
  "domain": "quicktools.dev",
  "defaultLanguage": "en",
  "languages": ["en", "es"],
  "siteName": "QuickTools",
  "description": {
    "en": "Fast, secure online tools...",
    "es": "Herramientas online rápidas..."
  }
}
```

### 1.5. `tools-index-{lang}.json`

Índice de herramientas traducido por idioma:

- `tools-index-en.json` - Títulos y descripciones en inglés
- `tools-index-es.json` - Títulos y descripciones en español

Cada herramienta incluye:
```json
{
  "title": "Resize Image",
  "slug": "tools/image/image-resizer.html",
  "description": "Resize images in the browser...",
  "category": "Image",
  "tags": ["image", "canvas"]
}
```

### 2. `generate-site.js`

Generador de sitio completo (reemplaza `generate-tools.js`):

**Funcionalidades:**
- Genera páginas para todos los idiomas configurados
- Inyecta `hreflang` tags automáticamente
- Crea `sitemap.xml` multiidioma
- Usa traducciones de `/i18n/*.json`

**Uso:**
```bash
npm run build
# o
node generate-site.js
```

### 3. Templates Actualizados

**`base.html`** y **`index-base.html`** ahora incluyen:
- Placeholder `{{hreflang_tags}}` para SEO
- Soporte para múltiples idiomas
- Atributo `lang` dinámico

### 4. Sitemap.xml

Generado automáticamente con:
- Todas las páginas en todos los idiomas
- `xhtml:link` para alternativas de idioma
- Prioridades y frecuencias de actualización
- Fecha de última modificación

## 📊 Estadísticas

- **33 herramientas** × **2 idiomas** = **66 páginas de herramientas**
- **2 páginas de inicio** (index)
- **Total: 68 páginas generadas**
- **1 sitemap.xml** con 68 URLs

## 🔍 SEO: Hreflang Tags

Cada página incluye automáticamente:

```html
<!-- En /tools/data/json-formatter.html -->
<link rel="alternate" hreflang="en" href="https://quicktools.dev/tools/data/json-formatter.html">
<link rel="alternate" hreflang="es" href="https://quicktools.dev/es/tools/data/json-formatter.html">
<link rel="alternate" hreflang="x-default" href="https://quicktools.dev/tools/data/json-formatter.html">
```

Esto le indica a Google:
- Qué versiones de idioma existen
- Cuál es la versión por defecto
- Evita contenido duplicado

## 🚀 Workflow de Desarrollo

### Añadir una Nueva Herramienta

1. Crear fragmentos en `/web/templates/tools-content/`:
   - `tool-name-head.html`
   - `tool-name-content.html`
   - `tool-name-scripts.html`

2. Añadir entrada en **todos** los archivos de idioma:
   - `/web/data/tools-index-en.json`
   - `/web/data/tools-index-es.json`

3. Regenerar sitio:
   ```bash
   npm run build
   ```

### Añadir un Nuevo Idioma

1. Crear archivo de traducción: `/web/i18n/fr.json`

2. Actualizar `site-config.json`:
   ```json
   {
     "languages": ["en", "es", "fr"]
   }
   ```

3. Regenerar sitio:
   ```bash
   npm run build
   ```

**Resultado:** Se generarán automáticamente 33 páginas adicionales en `/fr/`

## 📝 Scripts NPM

```json
{
  "build": "node generate-site.js",        // Genera todo el sitio
  "build:old": "node generate-tools.js",   // Generador antiguo (backup)
  "serve": "npx http-server web -p 8000",  // Servidor local
  "test": "node tests/run-all-tests.js"    // Tests
}
```

## 🌐 Despliegue

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
- name: Build site
  run: npm run build

- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    publish_dir: ./web
```

### Netlify/Vercel

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "web"
```

## 🔄 Migración desde Sistema Dinámico

**Antes (JavaScript dinámico):**
- ❌ Una sola URL: `/tools/data/json-formatter.html`
- ❌ Contenido inyectado por JS
- ❌ Sin URLs únicas por idioma
- ❌ Problemas de SEO

**Ahora (Estático):**
- ✅ URLs únicas: `/tools/data/json-formatter.html` y `/es/tools/data/json-formatter.html`
- ✅ HTML estático con contenido completo
- ✅ `hreflang` tags automáticos
- ✅ SEO optimizado

## 📈 Próximos Pasos

1. **Traducir contenido de herramientas** (actualmente solo UI traducida)
2. **Añadir más idiomas** (francés, alemán, portugués)
3. **Generar traducciones con IA** para escalar a 20+ idiomas
4. **Crear páginas legales** (privacy.html, terms.html) por idioma
5. **Implementar robots.txt** con referencia al sitemap

## 🎓 Recursos

- [Google: Hreflang Tags](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [MDN: lang attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)

---

**Fecha de implementación:** 2025-01-09  
**Versión:** 1.0.0  
**Estado:** ✅ Completado y funcional
