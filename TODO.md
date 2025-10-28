# QuickTools - Plan de desarrollo y seguimiento

## ✅ MVP - Fase 1 (Completado)
- [x] Estructura base del proyecto
- [x] 6 herramientas iniciales funcionando:
  - [x] Redimensionar imagen (Canvas)
  - [x] Convertir formato imagen (PNG/JPG/WebP)
  - [x] Formatear JSON
  - [x] CSV ↔ JSON  
  - [x] Extraer texto de PDF
  - [x] Limpiar texto

## 🚀 Fase 2 - Mejoras inmediatas
- [x] SEO y metadata
  - [x] Metatags y OpenGraph en todas las páginas
  - [x] Schema.org markup para herramientas
  - [x] Sitemap.xml
- [~] UX/UI
  - [x] Botones para copiar resultados (JSON, PDF, texto)
  - [ ] Tooltips y mensajes de ayuda
  - [x] Feedback visual de operaciones (copiar)
  - [ ] Drag & drop para archivos
- [ ] Rendimiento
  - [ ] Lazy loading de librerías
  - [ ] Compresión de imagen con Compressor.js
  - [ ] Service Worker para offline
- [x] Legal/Privacidad
  - [x] Política de cookies y privacidad
  - [ ] Términos de uso
  - [x] GDPR compliance básico

## 📦 Fase 3 - Nuevas herramientas
- [ ] Imagen
  - [ ] Comprimir imagen (reducir KB)
  - [ ] OCR con Tesseract.js
  - [ ] Filtros básicos (B/N, brillo)
- [ ] Archivos
  - [ ] Unir PDFs
  - [ ] Dividir PDF por páginas
  - [ ] CSV ↔ JSON (importar/convertir/preview)
  - [ ] Extraer metadatos de archivos (imágenes, pdf)
- [ ] Utilidades
  - [ ] Generador de contraseñas
  - [ ] Encriptación AES local
  - [ ] Conversor de unidades

### Prioridad Fase 3 (MVP)
- [ ] CSV ↔ JSON (parser + preview + descarga)
- [ ] URL encoder / decoder
- [ ] Generador y lector de QR (canvas + descarga)
- [ ] Comparador / diff de texto (resaltar cambios)
- [ ] Conversor Base64 ↔ Imagen

### Tareas técnicas Fase 3
- [ ] Crear páginas HTML para cada herramienta y añadir ruta en `index.html`
- [ ] Reusar patrón UX (drop-zone, botones copiar, mensajes)
- [ ] Añadir tests unitarios básicos (scripts node/npm)
- [ ] Documentar uso en `README.md` y ejemplos rápidos

### Próximos pasos inmediatos
- [ ] Definir 3 herramientas a implementar en la próxima iteración (sugerido: CSV↔JSON, URL encoder, QR generator)
- [ ] Implementar la primera herramienta y PR local (branch `feature/phase3-csv`)
- [ ] Añadir una GitHub Action básica para lint/format en push

## 🔄 Fase 4 - Mejoras continuas
- [ ] Analytics e insights
  - [ ] Implementar Plausible/GA
  - [ ] Tracking de uso por herramienta
- [ ] Monetización
  - [ ] AdSense setup
  - [ ] A/B testing de posición de anuncios
- [ ] Comunidad
  - [ ] Botón de sugerencias
  - [ ] Widget de feedback
  - [ ] Sistema de votos para nuevas tools

## 🌐 Fase 5 - Internacionalización
- [ ] Framework i18n
- [ ] Traducciones
  - [ ] Inglés
  - [ ] Portugués
- [ ] Detección automática de idioma

## 📱 Fase 6 - PWA
- [ ] Manifest.json
- [ ] Service workers
- [ ] Offline support
- [ ] Push notifications (opcional)

## 🧪 Testing y QA
- [ ] Tests e2e (Playwright)
- [ ] Tests de accesibilidad
- [ ] Validación W3C
- [ ] Lighthouse scores > 90

## 📈 Marketing y Growth
- [ ] SEO contenido
  - [ ] Blog/tutoriales
  - [ ] Landing pages por herramienta
- [ ] Social media
  - [ ] Twitter/X cards
  - [ ] Open Graph metadata
- [ ] Newsletter (opcional)