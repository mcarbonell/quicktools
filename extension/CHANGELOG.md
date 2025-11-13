# Changelog - FastTools Extension

## [1.0.9] - 2025-11-13

### 🎉 Added - AI Smart Recommender
- **Similar Pages**: Encuentra sitios similares usando IA local (Gemini Nano)
- **Análisis de historial**: Infiere perfil automáticamente
- **Sistema de caché**: Resultados instantáneos (7 días de validez)
- **Múltiples accesos**: Context menu, atajo `Ctrl+Shift+S`, botón en New Tab
- **Offscreen document**: Para acceder a Chrome LanguageModel API
- **Profile inference**: Detecta rol, nivel, intereses y stack tecnológico

### 🔧 Technical
- Nuevo módulo `history-analyzer.js` para análisis de historial
- Nuevo módulo `profile-inference.js` para inferencia con IA
- Nuevo módulo `ai-offscreen.js` para acceso a Chrome AI
- Popup `similar-pages.html` con interfaz compacta (420x500px)
- Caché inteligente en `chrome.storage.local` por dominio
- Parsing avanzado de recomendaciones markdown

### 📝 Documentation
- Documentación completa en `AI_SMART_RECOMMENDER.md`
- README actualizado con feature destacada
- Ejemplos de uso y troubleshooting

---

## [1.0.0] - 2025-11-01

### 🎉 Initial Release
- 30+ herramientas online
- Nueva pestaña personalizada
- Herramientas de imagen, PDF, texto, datos
- Herramientas IA con Gemini API
- Herramientas SEO
- Context menus y atajos de teclado
- Manifest V3
