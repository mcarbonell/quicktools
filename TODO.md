# QuickTools - Plan de desarrollo y seguimiento

## ✅ MVP - Fase 1 (Completado)
- [x] Estructura base del proyecto
- [x] 5 herramientas iniciales funcionando:
  - [x] Redimensionar imagen (Canvas)
  - [x] Convertir formato imagen (PNG/JPG/WebP)
  - [x] Formatear JSON  
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

### 🔄 Conversores
- [x] CSV ↔ JSON — Completado ✓
- [x] YAML ↔ JSON — Completado ✓
- [x] XML ↔ JSON — Completado ✓
- [x] TOML ↔ JSON — Completado ✓
- [ ] Herramientas prioritarias:
  - [x] PDF a JPG/PNG — Completado ✓
  - [x] Imagen a PDF — Completado ✓
- [ ] Futuras adiciones:
  - [ ] Convertir tablas HTML ↔ CSV
  - [ ] Excel ↔ CSV (SheetJS)
  - [ ] Conversor de unidades (px ↔ rem, em, etc.)

### 🖼️ Imagen y multimedia
- [x] Redimensionar imagen — Completado ✓
- [x] Convertir formato de imagen — Completado ✓
- [x] Comprimir imagen — Completado ✓
- [ ] Herramientas prioritarias:
  - [ ] Filtros y efectos (brillo, contraste, B/N, sepia)
  - [x] Recortar imagen (crop) — Completado ✓
  - [x] Extraer paleta de colores de una imagen — Completado ✓
- [ ] Futuras adiciones:
  - [x] Editor de metadatos (EXIF) de imágenes — Completado ✓
  - [ ] Añadir marca de agua
  - [ ] Editor collage simple

### 📝 Texto y código
- [x] Limpiar texto — Completado ✓
- [x] Formatear JSON — Completado ✓
- [x] Diff/comparador de texto — Completado ✓
- [x] Encode/decode URL — Completado ✓
- [x] Base64 encode/decode — Completado ✓
- [x] HTML encode/decode — Completado ✓
- [ ] Futuras adiciones:
  - [ ] Markdown preview
  - [ ] Minificar CSS/JS/HTML
  - [ ] Formatear SQL
  - [ ] Contar caracteres/palabras/líneas
  - [ ] Convertir case (camelCase, kebab-case, etc)

### 📁 Archivos y documentos
- [x] Extraer texto de PDF — Completado ✓
- [x] Unir PDFs — Completado ✓
- [x] Dividir PDF por páginas — Completado ✓
- [x] Comprimir PDF — Completado ✓
- [ ] Futuras adiciones:
  - [ ] Rotar páginas PDF
  - [ ] Extraer imágenes de PDF

### 🎲 Generadores
- [x] Generador de QR — Completado ✓
- [x] Generador de contraseñas — Completado ✓
- [ ] Herramientas prioritarias:
  - [x] Generador de Lorem Ipsum — Completado ✓
  - [ ] Generador de UUIDs
- [ ] Futuras adiciones:
  - [ ] Generador de datos de prueba (mock data)

### 🛠️ Utilidades generales
- [x] Calculadora de hashes (MD5, SHA) — Completado ✓
- [ ] Futuras adiciones:
  - [ ] Calculadora de fechas (diff, añadir/restar)
  - [ ] Encriptación AES local
  - [ ] Color picker/conversor
  - [ ] Cronómetro/temporizador
  - [ ] Validador de tarjetas de crédito

### Tareas técnicas Fase 3
- [ ] Crear páginas HTML para cada herramienta y añadir ruta en `index.html`
- [ ] Reusar patrón UX (drop-zone, botones copiar, mensajes)
- [ ] Añadir tests unitarios básicos (scripts node/npm)
- [ ] Documentar uso en `README.md` y ejemplos rápidos
- [x] Configurar GitHub Actions para CI (tests) — Completado ✓

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