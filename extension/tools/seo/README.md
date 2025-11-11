# SEO Tools Suite - FastTools Extension

Suite completa de 8 herramientas SEO para análisis y optimización de sitios web.

## 🔧 Herramientas Disponibles

### 1. 🔗 Dead Links Checker (MVP)
**Estado:** ✅ Implementado

Verifica todos los enlaces de la página actual y detecta enlaces rotos.

**Características:**
- Extrae todos los enlaces `<a href>` de la página
- Verifica el estado HTTP de cada enlace (HEAD request)
- Categoriza enlaces: OK (200), Redirects (3xx), Errores (4xx/5xx)
- Estadísticas en tiempo real
- Exportar reporte a CSV
- Timeout de 10 segundos por enlace

**Archivos:**
- `dead-links-checker.html` - Interfaz
- `dead-links-checker.js` - Lógica

**Uso:**
1. Abrir la herramienta desde el popup de la extensión
2. Click en "Analizar Enlaces"
3. Ver resultados en tiempo real
4. Exportar reporte CSV si es necesario

---

### 2. 🏷️ Meta Tags Analyzer
**Estado:** 🚧 Pendiente

Analiza y valida todas las meta tags de la página.

**Características planeadas:**
- Title, description, keywords
- Open Graph tags
- Twitter Card tags
- Canonical URL
- Robots meta
- Validación de longitudes recomendadas
- Sugerencias de mejora

---

### 3. 📋 Heading Structure Checker
**Estado:** 🚧 Pendiente

Verifica la jerarquía de encabezados H1-H6.

**Características planeadas:**
- Extrae todos los headings
- Valida jerarquía (no saltos)
- Verifica H1 único
- Vista de árbol de estructura
- Detección de problemas

---

### 4. 🤖 Robots.txt Validator
**Estado:** 🚧 Pendiente

Obtiene y valida el archivo robots.txt del sitio.

**Características planeadas:**
- Fetch de robots.txt
- Validación de sintaxis
- Análisis de directivas
- Verificación de sitemap
- Sugerencias de mejora

---

### 5. 🗺️ Sitemap Validator
**Estado:** 🚧 Pendiente

Encuentra y valida sitemaps XML.

**Características planeadas:**
- Auto-detección de sitemap
- Validación de XML
- Conteo de URLs
- Verificación de estructura
- Análisis de prioridades

---

### 6. 📱 Open Graph Preview
**Estado:** 🚧 Pendiente

Vista previa de cómo se ve la página en redes sociales.

**Características planeadas:**
- Preview de Facebook
- Preview de Twitter
- Preview de LinkedIn
- Validación de imágenes OG
- Sugerencias de optimización

---

### 7. 📊 Schema.org Validator
**Estado:** 🚧 Pendiente

Valida structured data (JSON-LD, Microdata).

**Características planeadas:**
- Detección de JSON-LD
- Detección de Microdata
- Validación de sintaxis
- Tipos de schema detectados
- Sugerencias de implementación

---

### 8. 🎯 SEO Score Calculator
**Estado:** 🚧 Pendiente

Calcula puntuación SEO general de la página.

**Características planeadas:**
- Análisis completo de SEO on-page
- Puntuación de 0-100
- Checklist de optimizaciones
- Priorización de mejoras
- Comparación con competencia

---

## 🏗️ Arquitectura

### Archivos Compartidos

**seo-utils.js** - Utilidades compartidas:
- `extractMetaTags()` - Extrae meta tags
- `extractHeadings()` - Extrae headings
- `validateHeadingStructure()` - Valida jerarquía
- `extractSchemaOrg()` - Extrae structured data
- `analyzeImages()` - Analiza imágenes
- `analyzeLinks()` - Analiza enlaces
- `calculateSEOScore()` - Calcula puntuación SEO

### Integración con Extension

**Content Script** (`content/content-script.js`):
- `extractLinks` - Extrae enlaces de la página
- `getPageData` - Obtiene datos completos de la página

**Service Worker** (`background/service-worker.js`):
- `checkLink` - Verifica estado HTTP de un enlace
- Maneja requests sin restricciones CORS

### Permisos Necesarios

Ya configurados en `manifest.json`:
- `activeTab` - Acceso a pestaña actual
- `<all_urls>` - Verificación de enlaces externos
- `scripting` - Inyección de scripts

---

## 📝 Roadmap de Implementación

### Fase 1: Dead Links Checker (MVP) ✅
- [x] Interfaz HTML
- [x] Lógica de extracción de enlaces
- [x] Verificación de enlaces
- [x] Estadísticas en tiempo real
- [x] Exportar CSV

### Fase 2: Meta Tags & Headings (2-3h)
- [ ] Meta Tags Analyzer
- [ ] Heading Structure Checker
- [ ] Integración con seo-utils.js

### Fase 3: Robots & Sitemap (2-3h)
- [ ] Robots.txt Validator
- [ ] Sitemap Validator
- [ ] Fetch y parsing

### Fase 4: Social & Schema (2-3h)
- [ ] Open Graph Preview
- [ ] Schema.org Validator
- [ ] Previews visuales

### Fase 5: SEO Score (1-2h)
- [ ] SEO Score Calculator
- [ ] Dashboard completo
- [ ] Recomendaciones

---

## 🚀 Cómo Usar

### Desarrollo Local

1. Cargar extensión en Chrome:
   ```
   chrome://extensions/
   → Modo desarrollador
   → Cargar extensión sin empaquetar
   → Seleccionar carpeta extension/
   ```

2. Abrir herramienta SEO:
   ```
   Click en icono de extensión
   → Seleccionar herramienta SEO
   ```

3. Analizar página actual:
   ```
   La herramienta analiza automáticamente la página activa
   ```

### Testing

```bash
# Navegar a cualquier sitio web
# Abrir Dead Links Checker
# Click en "Analizar Enlaces"
# Verificar resultados
```

---

## 🎯 Ventajas vs Competencia

### vs Herramientas Web
- ✅ Sin restricciones CORS
- ✅ Análisis en tiempo real
- ✅ Funciona en cualquier sitio
- ✅ No requiere API keys
- ✅ Privacidad total (no envía datos)

### vs Otras Extensiones
- ✅ Suite completa (8 herramientas)
- ✅ Interfaz moderna
- ✅ Exportar reportes
- ✅ Gratis y open source
- ✅ Sin límites de uso

---

## 📊 Métricas de Éxito

- **Tiempo de análisis:** < 30 segundos para 100 enlaces
- **Precisión:** 99%+ en detección de enlaces rotos
- **UX:** Interfaz intuitiva, resultados en tiempo real
- **Performance:** No afecta rendimiento del navegador

---

## 🤝 Contribuir

Para añadir nuevas herramientas SEO:

1. Crear archivos HTML + JS en `tools/seo/`
2. Usar `seo-utils.js` para funciones compartidas
3. Seguir patrón de Dead Links Checker
4. Actualizar este README

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0  
**Estado:** MVP Dead Links Checker completado
