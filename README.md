# FastTools — Herramientas Online 100% en el Navegador

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **Herramientas online rápidas, seguras y sin registro. Todo se procesa en tu navegador.**

FastTools es una suite de 33 utilidades web que funcionan completamente del lado del cliente, sin necesidad de subir archivos a servidores. Privacidad total, acceso instantáneo y compatible con dispositivos móviles.

## ✨ Características Principales

- 🔒 **100% Privado**: Todos los archivos se procesan localmente en tu navegador
- 🚀 **Acceso Instantáneo**: Sin registro, sin esperas, sin configuración
- 📱 **Responsive Design**: Funciona perfectamente en móviles y escritorio
- 🎯 **SEO Optimizado**: Cada herramienta tiene su propia página optimizada + Schema.org JSON-LD
- 📂 **Categorías por Perfil**: Navegación optimizada para desarrolladores, diseñadores, escritores, etc.
- 💰 **Gratis con Publicidad**: Modelo sostenible con anuncios no intrusivos
- 🌐 **Offline Ready**: PWA con Service Worker v3.0.3

## 🛠️ Herramientas Disponibles (33)

### 🖼️ Imagen (7 herramientas)
- **Redimensionar imagen** - Cambia el tamaño manteniendo proporción
- **Convertir formato** - JPG ↔ PNG ↔ WebP
- **Comprimir imagen** - Reduce el tamaño sin perder calidad visible
- **Recortar imagen** - Recorta áreas específicas
- **Generador de paleta** - Extrae colores dominantes
- **Visor EXIF** - Visualiza y limpia metadatos
- **Imagen a PDF** - Convierte imágenes a PDF

### 📁 Archivos (6 herramientas)
- **Extraer texto de PDF** - OCR ligero con PDF.js
- **Unir PDFs** - Combina múltiples PDFs
- **Dividir PDF** - Extrae páginas específicas
- **Comprimir PDF** - Reduce tamaño de PDF
- **PDF a Imagen** - Convierte páginas a JPG/PNG
- **Texto a PDF** - Genera PDF desde texto

### 📊 Datos (5 herramientas)
- **Formatear JSON** - Validar, formatear y minificar
- **CSV ↔ JSON** - Conversión bidireccional
- **YAML ↔ JSON** - Conversión bidireccional
- **XML ↔ JSON** - Conversión bidireccional
- **TOML ↔ JSON** - Conversión bidireccional

### 📝 Texto (6 herramientas)
- **Limpiar texto** - Elimina espacios extra, cuenta palabras
- **Codificar/Decodificar URL** - Encoding/decoding
- **Codificar/Decodificar Base64** - Encoding/decoding
- **Codificar/Decodificar HTML** - Entidades HTML
- **Comparar textos** - Encuentra diferencias (diff)
- **Generador Lorem Ipsum** - Texto placeholder

### 🔧 Utilidades (5 herramientas)
- **Generador QR** - Crea códigos QR desde texto/URL
- **Generador contraseñas** - Contraseñas seguras personalizables
- **Calculadora Hashes** - MD5, SHA-1, SHA-256, SHA-512
- **Selector de color** - Conversor HEX ↔ RGB ↔ HSL
- **Cronómetro/Temporizador** - Herramienta de tiempo

### 🤖 IA (5 herramientas)
- **Chat con IA** - Conversa con Google Gemini
- **Resumir Texto con IA** - Resume textos largos automáticamente
- **Mejorar Texto con IA** - Mejora gramática y estilo
- **Chat con PDF** - Haz preguntas sobre tus PDFs
- **Editar Imagen con IA** - Edita imágenes con instrucciones de texto

## 📂 Navegación por Categorías

FastTools organiza las herramientas por perfil de usuario:

- **💻 Desarrolladores** (10 herramientas): JSON, CSV, YAML, XML, TOML, Base64, URL encoder, HTML encoder, Hash calculator, Diff
- **🎨 Diseñadores** (8 herramientas): Redimensionar, convertir, recortar, comprimir imágenes, paletas de colores, EXIF, editar con IA
- **✍️ Escritores** (6 herramientas): Limpiar texto, comparar, Lorem Ipsum, resumir con IA, mejorar con IA, chat IA
- **📊 Analistas de Datos** (6 herramientas): JSON, CSV, YAML, XML, TOML, extraer texto de PDF
- **📱 Marketing** (6 herramientas): QR, redimensionar imágenes, convertir, comprimir, paletas, chat IA
- **⚡ Productividad** (8 herramientas): Cronómetro, contraseñas, QR, limpiar texto, PDFs (extraer, unir, dividir, comprimir)
- **🤖 IA** (5 herramientas): Chat, resumir, mejorar texto, chat PDF, editar imágenes

**URLs de categorías:**
- `/developers.html` - Herramientas para desarrolladores
- `/designers.html` - Herramientas para diseñadores
- `/writers.html` - Herramientas para escritores
- `/data-analysts.html` - Herramientas para analistas
- `/marketers.html` - Herramientas para marketing
- `/productivity.html` - Herramientas de productividad
- `/ai.html` - Herramientas con IA

## 🚀 Empezar Localmente

### 🌐 Acceder a la Web (Para usuarios finales)
```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/fasttools.git
cd fasttools

# Abre la web en tu navegador
start web/index.html  # Windows
open web/index.html   # macOS
```

### 🖥️ Servidor local (recomendado para desarrollo)
```bash
# Con Node.js (en la raíz del proyecto)
npx http-server web -p 8000

# Con Python (desde la carpeta web)
cd web
python -m http.server 8000
```

Luego visita **http://localhost:8000** en tu navegador.

### 📁 Servidor con estructura completa (recomendado para testing)
```bash
# Desde la raíz del proyecto (permite acceso a tests, extensión, etc.)
npx http-server -p 8000

# La web estará en http://localhost:8000/web/
# Los tests en http://localhost:8000/tests/
```

## 🏗️ Arquitectura del Proyecto

```
fasttools/                          # 📁 Raíz del proyecto
├── web/                            # 🌐 Aplicación web (se despliega en producción)
│   ├── index.html                  # Página principal con catálogo
│   ├── manifest.json               # PWA Manifest
│   ├── privacy.html                # Política de privacidad
│   ├── sitemap.xml                 # Sitemap para SEO
│   ├── tools/                      # 33 herramientas (URLs simplificadas)
│   │   ├── image-resizer.html      # Ejemplo: /tools/image-resizer.html
│   │   ├── json-formatter.html     # Ejemplo: /tools/json-formatter.html
│   │   └── ...                     # (sin subcarpetas por categoría)
│   ├── developers.html             # Página categoría Desarrolladores
│   ├── designers.html              # Página categoría Diseñadores
│   ├── writers.html                # Página categoría Escritores
│   ├── data-analysts.html          # Página categoría Analistas
│   ├── marketers.html              # Página categoría Marketing
│   ├── productivity.html           # Página categoría Productividad
│   ├── ai.html                     # Página categoría IA
│   ├── 404.html                    # Página 404 personalizada
│   ├── js/                         # JavaScript
│   │   ├── main.js                 # Funcionalidad común
│   │   ├── service-worker.js       # Service Worker PWA
│   │   ├── tools/                  # JS específico por herramienta
│   │   ├── lib/                    # Librerías auxiliares
│   │   └── vendor/                 # Dependencias externas
│   ├── css/                        # Estilos
│   │   ├── style.css               # Estilos personalizados
│   │   └── *.css                   # Otros estilos
│   ├── data/                       # Datos
│   │   └── tools-index.json        # Catálogo de herramientas
│   ├── icons/                      # Iconos PWA
│   ├── templates/                  # Templates HTML
│   ├── ads/                        # Configuración de anuncios
│   └── generate-tools.js           # Script de generación (build)
├── extension/                      # 🧩 Extensión de navegador
│   ├── manifest.json               # Extension Manifest V3
│   ├── background/                 # Service Worker de extensión
│   ├── content/                    # Content Scripts
│   ├── popup/                      # Ventana emergente
│   ├── options/                    # Página de opciones
│   ├── newtab/                     # Nueva pestaña personalizada
│   └── icons/                      # Iconos de extensión
├── tests/                          # 🧪 Tests y validación
│   ├── *.test.js                   # Tests Node.js
│   ├── run-all-tests.js            # Runner de tests
│   ├── pwa-validation.js           # Validación PWA
│   └── web-tests.html              # Tests en navegador
├── local_docs/                     # 📚 Documentación interna
│   ├── PROYECTO_QUICKTOOLS.md      # Documentación del proyecto
│   ├── ROADMAP_QUICKTOOLS.md       # Roadmap
│   ├── ANALISIS_TECNICO.md         # Análisis técnico
│   └── *.md                        # Otros documentos
├── tools_backup/                   # 💾 Backup de herramientas
├── web_design/                     # 🎨 Mockups y diseños
├── scripts/                        # 🛠️ Scripts de desarrollo
│   ├── create-icons.js             # Generación de iconos
│   ├── create-pwa-icons.js         # Iconos PWA
│   ├── extract-content.js          # Extracción de contenido
│   └── generate-tools.js           # Generación automática
├── package.json                    # Configuración Node.js
├── index.html                      # Redirect a web/
└── sw.js                          # Service Worker PWA (raíz)
```

### 📦 Estructura de Despliegue

**Para producción:** Solo se despliega la carpeta `web/` que contiene la aplicación web completa.

**Para desarrollo local:** Se puede acceder a todo el proyecto desde la raíz, permitiendo testing, desarrollo de la extensión y acceso a documentación.

## 🧩 Extensión de Navegador

FastTools también incluye una **extensión de navegador** con 30+ herramientas para productividad:

### � Funcionalidades
- **Popup rápido** con herramientas más usadas
- **Nueva pestaña personalizada** con acceso completo
- **Context Menus** para texto seleccionado
- **Background processing** con Service Workers
- **Sincronización** con la versión web

### 📦 Instalación
```bash
# Desarrollo: Carga manual desde carpeta extension/
# Producción: Subir a Chrome Web Store / Firefox Add-ons
```

### 🎯 Características Técnicas
- **Manifest V3** compatible
- **Offline ready** con caching inteligente
- **Cross-origin requests** permitidos
- **Keyboard shortcuts** configurables
- **Local storage** para preferencias

## �🛠️ Tecnologías Utilizadas

| Componente | Tecnología | Versión |
|------------|------------|---------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | - |
| **UI Framework** | Bootstrap | 5.3.2 |
| **PDF Processing** | PDF.js, pdf-lib | - |
| **Data Formats** | js-yaml, fast-xml-parser, @iarna/toml | - |
| **Image Processing** | Canvas API | - |
| **Build System** | Node.js scripts | - |
| **Extension** | Chrome Extension API | Manifest V3 |
| **PWA** | Service Workers, Web App Manifest | - |

## 📱 Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Navegadores móviles modernos

## 🌐 Despliegue

### GitHub Pages (recomendado para web/)
```bash
# Activa GitHub Pages en la configuración del repositorio
# Source: Deploy from a branch
# Branch: main
# Folder: /web (como root del sitio)
```

### Netlify/Vercel (recomendado para web/)
```bash
# Conecta tu repositorio
# Build command: (vacío para sitio estático)
# Publish directory: web
```

### Extensión de Navegador (Chrome/Firefox)
```bash
# Despliegue manual desde extension/
# Chrome: Ve a chrome://extensions/ y carga el directorio extension/
# Firefox: Ve a about:debugging y carga el directorio extension/
```

### Despliegue Completo (raíz + web/)
```bash
# Para testing completo, despliega toda la estructura
# Publish directory: . (raíz completa)
```

## 🧪 Testing

```bash
# Desde la raíz del proyecto
cd fasttools
npm test

# O directamente
node tests/run-all-tests.js
```

### 📊 Tests Incluidos
- ✅ **Validación de conversiones** de formato (CSV, JSON, YAML, XML, TOML)
- ✅ **Edge cases** en formateo y parsing
- ✅ **Manejo de archivos corruptos** y malformados
- ✅ **Tests PWA** (Service Worker, manifest, caching)
- ✅ **Validación de estructura** de archivos
- ✅ **Tests de la extensión** de navegador
- ✅ **Tests interactivos** en navegador

### 🌐 Tests en Navegador
```bash
# Abre la interfaz de tests
start tests/web-tests.html    # Windows
open tests/web-tests.html     # macOS
```

## 📈 Roadmap

- [ ] **v1.1** - Mejorar UX (toast notifications, progress indicators)
- [ ] **v1.2** - Añadir tests unitarios y e2e
- [ ] **v1.3** - Internacionalización (inglés, portugués)
- [ ] **v2.0** - Progressive Web App (PWA)
- [ ] **v2.1** - Sistema de feedback y votación de herramientas

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Abre un issue para discutir nuevas herramientas
2. Haz fork del proyecto
3. Crea una rama para tu feature (`git checkout -b feature/nueva-herramienta`)
4. Commit tus cambios (`git commit -am 'Añadir nueva herramienta'`)
5. Push a la rama (`git push origin feature/nueva-herramienta`)
6. Abre un Pull Request

## 📄 Licencia

## 🧪 Testing y Validación

FastTools incluye una **suite completa de testing y validación PWA** para garantizar la calidad y funcionalidad:

### 📊 Estado de Testing
- ✅ **27/27 tests pasando (100%)**
- ✅ **Validación PWA completa**
- ✅ **Tests Node.js y navegador**
- ✅ **Documentación automática**

### 🧪 Herramientas de Testing Disponibles

**Tests Node.js:**
```bash
# Suite completa de tests
node tests/run-all-tests.js

# Tests individuales
node tests/csv-parser.test.js
node tests/debug-yaml.js
```

**Tests Navegador:**
- **Interfaz Web:** `/tests/web-tests.html`
- **Validación PWA:** `/tests/pwa-validation.js` (ejecutar en consola)
- **Tests interactivos** con métricas en tiempo real

### 📈 Cobertura de Tests
- 🔧 **Estructura de archivos** (100%)
- 📝 **Sintaxis JavaScript** (100%)
- 📄 **Archivos JSON válidos** (100%)
- 📊 **Parsers (CSV/YAML)** (100%)
- 🌐 **Herramientas web** (100%)
- 📱 **Validación PWA** (completa)

### 🚀 Funcionalidades de Testing
- **Validación Service Worker y PWA**
- **Tests de parsers CSV/YAML**
- **Validación de conversiones**
- **Tests interactivos web**
- **Reportes automáticos JSON**
- **Documentación CI/CD**

**Documentación completa:** [`tests/README.md`](tests/README.md)

Este proyecto está bajo la licencia ISC - ver el archivo [LICENSE](LICENSE) para detalles.

## 🔗 Enlaces

- **Demo**: https://fasttools.tools
- **Documentación**: [docs/PROYECTO_QUICKTOOLS.md](docs/PROYECTO_QUICKTOOLS.md)
- **Issues**: https://github.com/tu-usuario/fasttools/issues
- **Discussions**: https://github.com/tu-usuario/fasttools/discussions

---

**⭐ Si este proyecto te ayuda, considera darle una estrella en GitHub!**
