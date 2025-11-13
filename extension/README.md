# FastTools Browser Extension

Una extensión de navegador revolucionaria con **IA local** que proporciona acceso a más de 30 herramientas útiles y recomendaciones personalizadas de sitios web.

## 🌟 Características Destacadas

### 🤖 AI Smart Recommender (NUEVO)
**La única extensión que usa IA local para recomendarte sitios basándose en TU historial.**

- **🌍 Similar Pages**: Encuentra 5 sitios similares a la página actual en 1 click
- **🧠 Análisis Automático**: Infiere tu perfil profesional sin configuración
- **⚡ Caché Inteligente**: Resultados instantáneos después de la primera vez
- **🔒 100% Privado**: Todo procesado localmente con Chrome AI (Gemini Nano)

**Acceso rápido:**
- Click derecho → "🌍 Encontrar Páginas Similares"
- Atajo: `Ctrl+Shift+S` (Windows) / `Cmd+Shift+S` (Mac)
- Botón en New Tab

[📖 Ver documentación completa](AI_SMART_RECOMMENDER.md)

---

## 🛠️ Herramientas Incluidas (30+)

### 🖼️ Imagen
- Redimensionar, Convertir formato, Comprimir, Recortar
- Generador de paletas, Visor EXIF, Imagen a PDF

### 📁 Archivos
- Extraer texto de PDF, Unir PDFs, Dividir PDF, Comprimir PDF

### 📊 Datos
- Format JSON, CSV ↔ JSON, YAML ↔ JSON, XML ↔ JSON, TOML ↔ JSON

### 📝 Texto
- Limpiar texto, Codificar/Decodificar (URL, Base64, HTML)
- Comparar textos, Lorem Ipsum Generator

### 🔧 Utilidades
- Generador QR, Generador contraseñas, Hash Calculator
- Color Picker, Cronómetro/Temporizador

### 🤖 IA (con Chrome AI local)
- Chat con IA, Resumir texto, Mejorar texto
- Chat con PDF, Traductor IA, **Similar Pages**

### 🔍 SEO
- Meta Tags Analyzer, Heading Structure Checker
- Robots.txt Validator, Sitemap Validator
- Broken Links Checker, Open Graph Preview

---

## 🚀 Instalación

### Para Desarrollo

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/mcarbonell/quicktools.git
   cd quicktools/extension
   ```

2. **Carga en Chrome**:
   - Abre `chrome://extensions/`
   - Activa "Modo de desarrollador"
   - Click "Cargar extensión sin empaquetar"
   - Selecciona carpeta `extension/`

3. **Habilita Chrome AI** (para Similar Pages):
   - Ve a `chrome://flags/#optimization-guide-on-device-model`
   - Activa "Enabled BypassPerfRequirement"
   - Ve a `chrome://flags/#prompt-api-for-gemini-nano`
   - Activa "Enabled"
   - Reinicia Chrome

### Para Usuarios

Próximamente en Chrome Web Store.

---

## 🎮 Cómo Usar

### Similar Pages (Recomendado)
1. Navega a cualquier sitio web
2. Click derecho → "🌍 Encontrar Páginas Similares"
3. Espera ~1 minuto la primera vez
4. Explora 5 sitios recomendados
5. ¡Las siguientes veces serán instantáneas!

### Otras Herramientas
- **Nueva Pestaña**: Dashboard completo con todas las herramientas
- **Popup**: Click en icono de extensión
- **Context Menu**: Click derecho para acciones rápidas

### Atajos de Teclado
- `Ctrl+Shift+Q`: Abrir herramientas
- `Ctrl+Shift+C`: Capturar pantalla
- `Ctrl+Shift+N`: Nueva nota rápida
- `Ctrl+Shift+S`: Similar Pages

---

## 📁 Estructura del Proyecto

```
extension/
├── manifest.json                    # Configuración Manifest V3
├── background/
│   ├── service-worker.js           # Orquestador principal
│   ├── history-analyzer.js         # Análisis de historial
│   └── ai-offscreen.js             # Acceso a Chrome AI
├── shared/
│   ├── profile-inference.js        # Inferencia de perfil con IA
│   └── gemini-api.js               # Cliente Gemini API
├── popup/
│   ├── similar-pages.html/js       # Similar Pages popup
│   └── ai-recommender.html/js      # Análisis completo
├── newtab/
│   └── newtab.html/js              # Nueva pestaña personalizada
├── tools/
│   ├── ai/                         # Herramientas IA
│   └── seo/                        # Herramientas SEO
└── data/
    └── fasttools-data.json         # Catálogo de herramientas
```

---

## 🔧 Tecnologías

- **Manifest V3**: Última versión de Chrome Extensions
- **Chrome AI APIs**: Gemini Nano local (LanguageModel API)
- **ES6+ JavaScript**: Código moderno
- **Chrome Storage API**: Caché y configuración
- **Offscreen Documents**: Acceso a APIs web

---

## 🌐 Compatibilidad

### Navegadores
- Chrome 127+ (con Gemini Nano)
- Edge 127+ (Chromium)
- Brave (compatible)

### Requisitos para IA
- **RAM**: 16 GB o más
- **GPU**: Más de 4 GB VRAM
- **Almacenamiento**: 22 GB libres
- **SO**: Windows 10/11, macOS 13+, Linux, ChromeOS

---

## 🐛 Troubleshooting

### "Chrome AI no disponible"
1. Verifica Chrome 127+
2. Habilita flags (ver Instalación)
3. Descarga modelo en `chrome://on-device-internals`

### Similar Pages no funciona
1. Verifica que no estés en página interna de Chrome
2. Espera ~1 minuto la primera vez
3. Revisa consola para errores

### Caché no funciona
1. Verifica permisos en `chrome://extensions/`
2. Limpia storage: `chrome.storage.local.clear()`

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre Pull Request

---

## 📄 Licencia

ISC License - Ver [LICENSE](../LICENSE)

---

## 📚 Documentación

- [AI Smart Recommender](AI_SMART_RECOMMENDER.md) - Documentación completa
- [Chrome AI APIs](https://developer.chrome.com/docs/ai/built-in-apis)
- [Prompt API](https://developer.chrome.com/docs/ai/prompt-api)

---

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/mcarbonell/quicktools/issues)
- **Email**: contact@fasttools.tools
- **Web**: https://fasttools.tools

---

**FastTools** - Desarrollado con ❤️ y 🤖 IA local para mejorar tu productividad web.

**Versión**: 1.0.9 | **Estado**: ✅ Production Ready
