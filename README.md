# QuickTools — Herramientas Online 100% en el Navegador

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **Herramientas online rápidas, seguras y sin registro. Todo se procesa en tu navegador.**

QuickTools es una suite de 28 utilidades web que funcionan completamente del lado del cliente, sin necesidad de subir archivos a servidores. Privacidad total, acceso instantáneo y compatible con dispositivos móviles.

## ✨ Características Principales

- 🔒 **100% Privado**: Todos los archivos se procesan localmente en tu navegador
- 🚀 **Acceso Instantáneo**: Sin registro, sin esperas, sin configuración
- 📱 **Responsive Design**: Funciona perfectamente en móviles y escritorio
- 🎯 **SEO Optimizado**: Cada herramienta tiene su propia página optimizada
- 💰 **Gratis con Publicidad**: Modelo sostenible con anuncios no intrusivos
- 🌐 **Offline Ready**: Funciona sin conexión a internet una vez cargado

## 🛠️ Herramientas Disponibles (28)

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

### 🔧 Utilidades (4 herramientas)
- **Generador QR** - Crea códigos QR desde texto/URL
- **Generador contraseñas** - Contraseñas seguras personalizables
- **Calculadora Hashes** - MD5, SHA-1, SHA-256, SHA-512
- **Selector de color** - Conversor HEX ↔ RGB ↔ HSL
- **Cronómetro/Temporizador** - Herramienta de tiempo

## 🚀 Empezar Localmente

### Opción 1: Abrir directamente (recomendado para prueba rápida)
```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/quicktools.git
cd quicktools

# Abre index.html en tu navegador
# Doble clic en index.html o:
start index.html  # Windows
open index.html   # macOS
```

### Opción 2: Servidor local (recomendado para desarrollo)
```bash
# Con Python (preinstalado en la mayoría de sistemas)
python -m http.server 8000

# O con Node.js (requiere npm)
npx http-server -p 8000

# O con PowerShell (Windows)
npx http-server -p 8000
```

Luego visita **http://localhost:8000** en tu navegador.

## 🏗️ Arquitectura del Proyecto

```
quicktools/
├── index.html                 # Página principal con catálogo
├── tools/                     # Páginas individuales de herramientas
│   ├── image/                 # Herramientas de imagen
│   ├── files/                 # Herramientas de archivos
│   ├── data/                  # Herramientas de datos
│   ├── text/                  # Herramientas de texto
│   └── utils/                 # Utilidades varias
├── js/
│   ├── main.js               # Funcionalidad común
│   └── tools/                # JavaScript específico por herramienta
├── css/
│   └── style.css             # Estilos personalizados
├── data/
│   └── tools-index.json      # Catálogo de herramientas
├── templates/                # Sistema de generación de páginas
└── ads/                      # Configuración de anuncios
```

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología | Versión |
|------------|------------|---------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | - |
| **UI Framework** | Bootstrap | 5.3.2 |
| **PDF Processing** | PDF.js, pdf-lib | - |
| **Data Formats** | js-yaml, fast-xml-parser, @iarna/toml | - |
| **Image Processing** | Canvas API | - |
| **Build System** | Node.js scripts | - |

## 📱 Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Navegadores móviles modernos

## 🌐 Despliegue

### GitHub Pages (recomendado)
```bash
# Activa GitHub Pages en la configuración del repositorio
# Source: Deploy from a branch
# Branch: main
```

### Netlify/Vercel
```bash
# Conecta tu repositorio
# Build command: (vacío para sitio estático)
# Publish directory: ./
```

## 🧪 Testing

```bash
# Ejecutar tests de validación
npm test

# Tests incluidos:
# - Validación de conversiones de formato
# - Edge cases en formateo
# - Manejo de archivos corruptos
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

QuickTools incluye una **suite completa de testing y validación PWA** para garantizar la calidad y funcionalidad:

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

- **Demo**: https://quicktools.dev
- **Documentación**: [docs/PROYECTO_QUICKTOOLS.md](docs/PROYECTO_QUICKTOOLS.md)
- **Issues**: https://github.com/tu-usuario/quicktools/issues
- **Discussions**: https://github.com/tu-usuario/quicktools/discussions

---

**⭐ Si este proyecto te ayuda, considera darle una estrella en GitHub!**
