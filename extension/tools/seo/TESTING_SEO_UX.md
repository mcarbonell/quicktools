# 🧪 Testing SEO Tools UX - Guía Rápida

## ✅ Checklist de Testing

### 1. Popup - Herramientas SEO Inline

**Preparación:**
1. Cargar extensión en Chrome: `chrome://extensions/`
2. Activar "Modo desarrollador"
3. Click en "Cargar extensión sin empaquetar"
4. Seleccionar: `quicktools/extension/`
5. Navegar a un sitio web (ej: https://fasttools.tools)

**Test 1: Cargar herramienta SEO**
- [ ] Click en icono de extensión
- [ ] Verificar popup se abre (500px ancho)
- [ ] Scroll hasta encontrar herramienta SEO (ej: "Meta Tags Analyzer")
- [ ] Click en herramienta
- [ ] ✅ Verificar: Popup se transforma, muestra botón "←" y título
- [ ] ✅ Verificar: Herramienta carga en iframe
- [ ] ✅ Verificar: Herramienta funciona correctamente

**Test 2: Navegación de vuelta**
- [ ] Click en botón "← Volver"
- [ ] ✅ Verificar: Regresa a listado de herramientas
- [ ] ✅ Verificar: Iframe se limpia correctamente

**Test 3: Probar todas las herramientas SEO**
- [ ] 🔗 Dead Links Checker
- [ ] 🏷️ Meta Tags Analyzer
- [ ] 📋 Heading Structure Checker
- [ ] 📊 Schema.org Validator
- [ ] 📱 Open Graph Preview
- [ ] 🤖 Robots.txt Validator
- [ ] 🎯 SEO Dashboard

**Test 4: Robots.txt (caso especial)**
- [ ] Abrir Robots.txt Validator
- [ ] Ingresar URL manualmente: https://www.google.com/
- [ ] Click "Analizar"
- [ ] ✅ Verificar: Obtiene y muestra robots.txt correctamente

---

### 2. NewTab - Herramientas SEO Ocultas

**Test 1: Verificar herramientas ocultas**
- [ ] Abrir nueva pestaña (Ctrl+T)
- [ ] ✅ Verificar: NO aparecen herramientas SEO en el grid
- [ ] ✅ Verificar: Otras herramientas (JSON, Image, etc.) SÍ aparecen

**Test 2: Búsqueda**
- [ ] Escribir "SEO" en buscador
- [ ] ✅ Verificar: NO aparecen resultados de herramientas SEO
- [ ] Escribir "JSON" en buscador
- [ ] ✅ Verificar: SÍ aparecen herramientas JSON

**Test 3: Categorías**
- [ ] Click en filtro "SEO" (si existe)
- [ ] ✅ Verificar: NO aparecen herramientas (categoría vacía en NewTab)

---

### 3. Funcionalidad de Herramientas

**Dead Links Checker:**
- [ ] Navegar a sitio con enlaces (ej: wikipedia.org)
- [ ] Abrir herramienta desde popup
- [ ] Click "Analizar Enlaces"
- [ ] ✅ Verificar: Extrae enlaces
- [ ] ✅ Verificar: Muestra progreso
- [ ] ✅ Verificar: Categoriza (OK, Redirects, Errors)
- [ ] ✅ Verificar: Botón "Exportar CSV" funciona

**Meta Tags Analyzer:**
- [ ] Navegar a sitio (ej: fasttools.tools)
- [ ] Abrir herramienta desde popup
- [ ] Click "Analizar Meta Tags"
- [ ] ✅ Verificar: Extrae title, description
- [ ] ✅ Verificar: Extrae Open Graph tags
- [ ] ✅ Verificar: Extrae Twitter Card
- [ ] ✅ Verificar: Muestra badges (OK/Warning/Error)

**Heading Structure:**
- [ ] Navegar a sitio con headings
- [ ] Abrir herramienta desde popup
- [ ] Click "Analizar Estructura"
- [ ] ✅ Verificar: Extrae H1-H6
- [ ] ✅ Verificar: Muestra jerarquía visual
- [ ] ✅ Verificar: Detecta problemas (múltiples H1, saltos)

**Schema.org Validator:**
- [ ] Navegar a sitio con schema (ej: amazon.com)
- [ ] Abrir herramienta desde popup
- [ ] Click "Analizar Schema"
- [ ] ✅ Verificar: Detecta JSON-LD
- [ ] ✅ Verificar: Muestra structured data
- [ ] ✅ Verificar: Valida sintaxis JSON

**Open Graph Preview:**
- [ ] Navegar a sitio con OG tags (ej: github.com)
- [ ] Abrir herramienta desde popup
- [ ] Click "Generar Preview"
- [ ] ✅ Verificar: Muestra card visual
- [ ] ✅ Verificar: Imagen, título, descripción correctos

**Robots.txt Validator:**
- [ ] Abrir herramienta desde popup
- [ ] Ingresar URL: https://www.google.com/
- [ ] Click "Obtener Robots.txt"
- [ ] ✅ Verificar: Fetch exitoso
- [ ] ✅ Verificar: Muestra contenido
- [ ] ✅ Verificar: Funciona sin pestaña activa

**SEO Dashboard:**
- [ ] Navegar a sitio completo (ej: fasttools.tools)
- [ ] Abrir herramienta desde popup
- [ ] Click "Analizar SEO"
- [ ] ✅ Verificar: Ejecuta todos los checks
- [ ] ✅ Verificar: Calcula score 0-100
- [ ] ✅ Verificar: Muestra checklist detallado
- [ ] ✅ Verificar: Círculo de score visual

---

### 4. Edge Cases

**Test 1: Sitio sin meta tags**
- [ ] Navegar a sitio básico sin meta tags
- [ ] Abrir Meta Tags Analyzer
- [ ] ✅ Verificar: Muestra mensaje apropiado
- [ ] ✅ Verificar: No crashea

**Test 2: Sitio sin enlaces**
- [ ] Navegar a página sin enlaces
- [ ] Abrir Dead Links Checker
- [ ] ✅ Verificar: Muestra "0 enlaces encontrados"
- [ ] ✅ Verificar: No crashea

**Test 3: Sitio sin schema**
- [ ] Navegar a sitio sin structured data
- [ ] Abrir Schema Validator
- [ ] ✅ Verificar: Muestra "No schema found"
- [ ] ✅ Verificar: No crashea

**Test 4: URL inválida en Robots.txt**
- [ ] Abrir Robots.txt Validator
- [ ] Ingresar URL inválida: "not-a-url"
- [ ] Click "Obtener Robots.txt"
- [ ] ✅ Verificar: Muestra error apropiado
- [ ] ✅ Verificar: No crashea

---

### 5. Performance

**Test 1: Dead Links con muchos enlaces**
- [ ] Navegar a Wikipedia (100+ enlaces)
- [ ] Abrir Dead Links Checker
- [ ] Click "Analizar Enlaces"
- [ ] ✅ Verificar: Progreso se actualiza
- [ ] ✅ Verificar: Completa en <60s
- [ ] ✅ Verificar: No bloquea UI

**Test 2: Múltiples herramientas**
- [ ] Abrir Meta Tags Analyzer → Analizar
- [ ] Volver → Abrir Heading Structure → Analizar
- [ ] Volver → Abrir Schema Validator → Analizar
- [ ] ✅ Verificar: Todas funcionan correctamente
- [ ] ✅ Verificar: No memory leaks

---

### 6. Seguridad

**Test 1: CSP Compliance**
- [ ] Abrir DevTools (F12)
- [ ] Ir a Console
- [ ] Abrir cualquier herramienta SEO
- [ ] ✅ Verificar: NO hay errores CSP
- [ ] ✅ Verificar: NO hay "Refused to execute inline script"

**Test 2: Iframe Sandbox**
- [ ] Abrir DevTools → Elements
- [ ] Inspeccionar iframe de herramienta SEO
- [ ] ✅ Verificar: Tiene atributo `sandbox="allow-scripts allow-same-origin"`

---

## 📊 Resultados Esperados

### ✅ Todos los tests pasan
- Herramientas SEO funcionan en Popup
- Herramientas SEO ocultas en NewTab
- Navegación fluida (botón volver)
- Sin errores CSP
- Performance aceptable
- Edge cases manejados

### ❌ Si algún test falla
1. Verificar que extensión está actualizada
2. Recargar extensión: `chrome://extensions/` → Reload
3. Limpiar caché: DevTools → Application → Clear storage
4. Verificar consola para errores
5. Reportar bug con detalles

---

## 🐛 Bugs Conocidos

### Ninguno (por ahora)

Si encuentras bugs durante testing:
1. Abrir DevTools (F12)
2. Ir a Console
3. Reproducir bug
4. Copiar error completo
5. Reportar con pasos para reproducir

---

## 📝 Notas de Testing

### Sitios Recomendados para Testing

**Completos (todos los features):**
- https://fasttools.tools
- https://github.com
- https://amazon.com

**Meta tags ricos:**
- https://github.com
- https://twitter.com
- https://linkedin.com

**Muchos enlaces:**
- https://wikipedia.org
- https://reddit.com

**Schema.org completo:**
- https://amazon.com
- https://ebay.com
- https://imdb.com

**Robots.txt interesantes:**
- https://www.google.com/robots.txt
- https://www.facebook.com/robots.txt
- https://www.amazon.com/robots.txt

---

## ⏱️ Tiempo Estimado de Testing

- **Testing básico (Popup + NewTab):** 10 minutos
- **Testing completo (todas las herramientas):** 30 minutos
- **Testing exhaustivo (edge cases + performance):** 60 minutos

---

## ✅ Checklist Final

- [ ] Popup: Herramientas SEO cargan inline
- [ ] Popup: Botón volver funciona
- [ ] Popup: Todas las 7 herramientas funcionan
- [ ] NewTab: Herramientas SEO ocultas
- [ ] NewTab: Búsqueda no muestra SEO tools
- [ ] Sin errores CSP en consola
- [ ] Performance aceptable
- [ ] Edge cases manejados
- [ ] Robots.txt funciona sin pestaña activa

**Si todos los checks pasan:** ✅ **LISTO PARA PRODUCCIÓN**

---

**Última actualización:** Noviembre 2025  
**Versión:** Opción A (Inline Popup)  
**Estado:** Ready for testing
