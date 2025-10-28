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

### 🖼️ Imagen y multimedia
- [x] Redimensionar imagen — Completado ✓
- [x] Convertir formato — Completado ✓
- [ ] Herramientas prioritarias:
  - [ ] Comprimir imagen (reducir KB)
  - [ ] Filtros y efectos (brillo, contraste, B/N, sepia)
  - [ ] Recortar imagen (crop)
- [ ] Futuras adiciones:
  - [ ] OCR con Tesseract.js (texto en imágenes)
  - [ ] Extraer paleta de colores
  - [ ] Añadir marca de agua
  - [ ] Editor collage simple
  - [ ] EXIF viewer/cleaner

### 📝 Texto y código
- [x] Limpiar texto — Completado ✓
- [x] Herramientas prioritarias:
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
  - [ ] Escapar/desescapar strings
  - [ ] ROT13 y cifrados simples
  - [ ] Transliteración (quitar acentos)

### 📊 Datos y formatos
- [x] Formatear JSON — Completado ✓
- [x] CSV ↔ JSON — Completado ✓
- [ ] Herramientas prioritarias:
  - [ ] YAML ↔ JSON
  - [ ] XML ↔ JSON
  - [ ] TOML ↔ JSON
- [ ] Futuras adiciones:
  - [ ] Convertir tablas HTML ↔ CSV
  - [ ] Excel ↔ CSV (SheetJS)
  - [ ] Query URL parser
  - [ ] Validador de JSON Schema
  - [ ] GraphQL prettifier
  - [ ] Generador de datos de prueba (mock data)

### 📁 Archivos y documentos
- [x] Extraer texto de PDF — Completado ✓
- [ ] Herramientas prioritarias:
  - [ ] Unir PDFs
  - [ ] Dividir PDF por páginas
  - [ ] Comprimir PDF
- [ ] Futuras adiciones:
  - [ ] PDF a imágenes
  - [ ] Rotar páginas PDF
  - [ ] Extraer imágenes de PDF
  - [ ] Extraer metadatos (PDF/imágenes)
  - [ ] Conversor de documentos (MDI)

### 🛠️ Utilidades generales
- [ ] Herramientas prioritarias:
  - [ ] Generador de QR (crear/leer)
  - [ ] Generador de contraseñas
  - [ ] Calculadora de hashes (MD5, SHA)
- [ ] Futuras adiciones:
  - [ ] Conversor de unidades (longitud, peso, etc)
  - [ ] Calculadora de fechas (diff, añadir/restar)
  - [ ] UUID/GUID generator
  - [ ] Encriptación AES local
  - [ ] Color picker/conversor
  - [ ] Cronómetro/temporizador
  - [ ] Calculadora de regex
  - [ ] Generador de Lorem Ipsum
  - [ ] Validador de tarjetas de crédito
  - [ ] Calculadora IP/CIDR

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