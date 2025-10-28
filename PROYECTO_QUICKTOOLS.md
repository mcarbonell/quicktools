
## 🔍Idea del proyecto
El proyecto consiste en crear un sitio web con muchas utilidades online, todo implementado del lado cliente, en html y javascript, como editores de imágenes, conversores, formateadores de texto, etc.

La idea es descargar toda la computación al lado cliente, eso permitiría usar servicios de alojamiento muy baratos que no usan scripts de servidor. Tampoco el usuario necesitaría un login o backend. La idea es ocupar el nicho de utilidades rápidas online de poco compromiso. La fuente de ingresos podría ser publicidad tipo adwords.

### Nombre tentativo del proyecto:
> **"QuickTools"**
- Herramientas online rápidas 100% en el navegador

### Propuesta de valor (Value Proposition):
> “Herramientas online rápidas, seguras y sin registro. Todo se procesa en tu navegador. Gratis, sin esperas, sin rastreo.”

---

## 🎯 Público objetivo

- Usuarios casuales que necesitan una tarea rápida: convertir una imagen, recortar un PDF, limpiar texto, cambiar el tamaño de una foto, etc.
- Personas que valoran la privacidad (no suben archivos a servidores).
- Usuarios con conexiones lentas (evitan subir/ descargar archivos).
- Estudiantes, profesionales no técnicos, redactores, diseñadores aficionados.

---

## 🧰 Tipos de herramientas (funcionalidades iniciales)

Vamos a dividir las herramientas en categorías. Empezamos con **10-15 herramientas clave** para lanzar un MVP (producto mínimo viable).

### 1. **Imagen**
- Redimensionar imagen (manteniendo proporción)
- Comprimir imagen (reducir peso en KB)
- Convertir entre formatos (JPG ↔ PNG ↔ WebP)
- Recortar imagen
- Aplicar filtros básicos (blanco y negro, brillo, contraste)
- Extraer texto de imagen (usando Tesseract.js)

### 2. **Texto**
- Formatear texto (mayúsculas, minúsculas, capitalizar)
- Eliminar espacios duplicados o saltos de línea extra
- Contador de palabras, caracteres, líneas
- Generar listas aleatorias (shuffle)
- Codificar/decodificar Base64
- Limpiar texto de caracteres especiales o HTML

### 3. **Archivos**
- Convertidor de texto a PDF (usando jsPDF)
- Unificador de PDFs (usando PDF-lib o similar)
- Dividir PDF por páginas
- Extraer texto de PDF (PDF.js)
- Conversión CSV ↔ JSON (en el navegador)

### 4. **Desarrolladores**
- Formateador de JSON
- Validador de JSON
- Minificador de HTML/CSS/JS
- Codificador/decodificador URL
- Generador de colores (paletas, hex, RGB)
- Conversor de unidades (px ↔ rem, em, etc.)

### 5. **Utilidades varias**
- Generador de contraseñas seguras
- Temporizador / cronómetro
- Calculadora básica
- Conversor de unidades (longitud, peso, temperatura)
- Encriptar/desencriptar simple (AES local con clave del usuario)

---

## 🚀 Ventajas competitivas

| Ventaja | Explicación |
|--------|-------------|
| ✅ 100% en el cliente | Sin subida de archivos, sin pérdida de privacidad |
| ✅ Sin registro | Acceso inmediato |
| ✅ Gratis con publicidad | Modelo sostenible |
| ✅ Muy rápido | Carga instantánea, procesamiento local |
| ✅ Móvil-friendly | Responsive por diseño |
| ✅ Bajo costo operativo | Hosting gratis o muy barato |

---

## 💰 Modelo de monetización

- **Google AdSense** (anuncios en banners, intersticiales suaves)
- **Propuesta de donaciones** (Ko-fi, Buy Me a Coffee)
- **Publicidad nativa** (ej: "¿Necesitas más funciones? Prueba nuestra app de escritorio")
- Opcional: versión premium (sin anuncios) mediante donación única (usando Stripe o Buy Me a Coffee)

---

## 🛠️ Tecnologías recomendadas

| Componente | Tecnología |
|----------|----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla o con librerías ligeras) |
| Framework (opcional) | Alpine.js, o solo Vanilla JS |
| Librerías clave |  
| - PDF | [PDF.js](https://mozilla.github.io/pdf.js/), [pdf-lib](https://pdf-lib.js.org/) |
| - Imagen | [Compressor.js](https://fengyuanchen.github.io/compressorjs/), [Tesseract.js](https://github.com/naptha/tesseract.js) |
| - Texto/JSON | Vanilla JS + validadores |
| - UI | Tailwind CSS o Bootstrap (para diseño rápido y responsive) |
| Hosting | GitHub Pages, Netlify, Vercel, Cloudflare Pages (todos gratis) |
| Analytics (opcional) | Google Analytics o Plausible (privacidad-first) |

---

## 🗺️ Estructura del sitio

```
/
├── index.html              → Página principal con lista de herramientas
├── tools/
│   ├── image-resizer.html
│   ├── pdf-to-text.html
│   ├── json-formatter.html
│   └── ... (una página por herramienta o SPA)
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── tools/
│   │   ├── image-tools.js
│   │   ├── pdf-tools.js
│   │   └── ...
├── libs/                   → Librerías externas (tesseract, pdf-lib, etc.)
└── ads/                    → Código de anuncios (opcional)
```

> Una página HTML estática por herramienta (más SEO-friendly).

---

## 🔍 SEO y descubrimiento

- Cada herramienta debe tener:
  - Meta tags claros (ej: "Convertir JPG a PNG online - sin subir archivos")
  - Títulos descriptivos
  - Schema.org markup (opcional)
- Nombre de dominio con palabras clave: `webutils.com`, `quicktools.dev`, `clienttools.io`, etc.
- Posicionamiento en búsquedas como: "convertir imagen online sin registro", "formatear JSON rápido", etc.

---

## 📅 Roadmap (Fases de desarrollo)

| Fase | Objetivo |
|------|--------|
| 1. MVP (1-2 semanas) | 5 herramientas clave (imagen, texto, PDF, JSON, conversor) + diseño básico + anuncios |
| 2. Expansión | Añadir 10 herramientas más, mejorar UI, añadir búsqueda |
| 3. Internacionalización | Traducir a inglés, español, portugués |
| 4. Progressive Web App (PWA) | Que se pueda instalar en móviles |
| 5. Comunidad | Sugerencias de usuarios, votar herramientas |

---

## 📄 Documento técnico final (para IA codificadora)

Ahora, vamos a crear un **documento técnico detallado** que puedas entregar a una IA programadora (como Claude, GPT-4, etc.) para que genere el código.

---

# 📄 **Documento de Especificaciones Técnicas: QuickTools**

## 🎯 Nombre del proyecto
**QuickTools** – Herramientas online rápidas 100% en el navegador

## 📦 Objetivo
Crear un sitio web estático con múltiples utilidades online que funcionen completamente del lado del cliente, sin necesidad de servidor, base de datos o registro de usuario.

## 🧩 Características clave
- 100% frontend (HTML, CSS, JS)
- Ningún archivo se sube a un servidor
- Procesamiento local en el navegador
- Hosting en servicios gratuitos (GitHub Pages, Netlify)
- Monetización con Google AdSense
- Diseño responsive (móvil y escritorio)

## 🛠️ Tecnologías
- **HTML5**, **CSS3**, **JavaScript (ES6+)**
- **Tesseract.js** (OCR)
- **pdf-lib** y **PDF.js** (manipulación de PDF)
- **Compressor.js** (compresión de imágenes)
- **jsPDF** (generar PDF desde texto)
- **Bootstrap 5** (para diseño rápido y responsive)

## 🗂️ Estructura de archivos
```
quicktools/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── tools/
│   │   ├── image-resizer.js
│   │   ├── pdf-to-text.js
│   │   ├── json-formatter.js
│   │   └── text-cleaner.js
├── libs/
│   ├── tesseract.min.js
│   ├── pdf-lib.min.js
│   ├── pdfjs-dist/
│   └── compressor.min.js
├── tools/
│   ├── image-resizer.html
│   ├── pdf-to-text.html
│   ├── json-formatter.html
│   └── text-cleaner.html
├── ads/
│   └── adsense.html
└── README.md
```

## 🧰 Herramientas iniciales (MVP)

### 1. **Redimensionar imagen**
- Subir imagen
- Ingresar ancho/alto
- Descargar imagen redimensionada
- Usar Canvas API + Compressor.js

### 2. **Convertir JPG ↔ PNG ↔ WebP**
- Subir imagen
- Seleccionar formato de salida
- Descargar archivo convertido

### 3. **Formatear JSON**
- Área de texto
- Botón "Formatear" (pretty print)
- Botón "Minificar"
- Validación con `try-catch JSON.parse`

### 4. **Extraer texto de PDF**
- Subir PDF
- Usar PDF.js para extraer texto
- Mostrar y permitir copiar

### 5. **Limpiador de texto**
- Eliminar espacios extra, saltos de línea dobles, tabulaciones
- Contador de palabras

## 🖼️ Diseño (UI/UX)
- Navbar con logo y búsqueda
- Grid de herramientas con iconos y nombres
- Cada herramienta: título, descripción, interfaz clara, botón de acción
- Footer con enlaces (Contacto, Privacy, Donar)

## 📢 Monetización
- Anuncios AdSense en:
  - Header (banner 728x90)
  - Debajo del título de cada herramienta
  - Al final de cada herramienta
- Evitar anuncios intrusivos

## 🌐 Hosting
- Publicar en **GitHub Pages** (gratis) o **Netlify**
- Dominio: `quicktools.dev` o similar

## 🚀 Instrucciones para la IA codificadora
> "Genera un archivo `index.html` con una lista de 5 herramientas. Cada herramienta debe tener un enlace a una página independiente. Crea las páginas HTML y JS necesarias para las siguientes funciones: redimensionar imagen, convertir formato de imagen, formatear JSON, extraer texto de PDF, limpiar texto. Usa librerías de JavaScript que funcionen en el cliente. Incluye Bootstrap 5 para diseño. Asegúrate de que todo funcione sin servidor."
