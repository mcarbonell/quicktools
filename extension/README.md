# QuickTools Browser Extension

Una extensión de navegador completa que proporciona acceso rápido a más de 25 herramientas útiles directamente desde tu navegador.

## 🚀 Características Principales

### 🛠️ Herramientas Incluidas
- **Cifrado de Datos**: Base64, HTML, URL Encoding
- **Procesamiento de Imágenes**: Compresión, redimensionado, recorte, conversión
- **Manejo de PDF**: Compresión, conversión, división, combinación
- **Utilidades de Texto**: Limpieza, formato JSON, generador Lorem Ipsum
- **Desarrollo**: Hash Calculator, Diff Tool, CSV ↔ JSON
- **Tiempo**: Stopwatch, Timer
- **Y mucho más...**

### 🎨 Funcionalidades de la Extensión
- **Panel Flotante**: Acceso rápido desde cualquier página
- **Nueva Pestaña Personalizada**: Dashboard completo con todas las herramientas
- **Configuraciones Avanzadas**: Personaliza la experiencia
- **Sincronización**: Guarda configuraciones en la nube
- **Atajos de Teclado**: Acceso ultrarrápido
- **Tema Claro/Oscuro**: Interfaz adaptable

## 📁 Estructura del Proyecto

```
extension/
├── manifest.json          # Configuración de la extensión
├── background/
│   └── service-worker.js  # Service Worker principal
├── popup/                 # Interfaz emergente
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── newtab/               # Nueva pestaña personalizada
│   ├── newtab.html
│   ├── newtab.css
│   └── newtab.js
├── content/              # Scripts inyectados
│   ├── content-script.js
│   └── content-styles.css
├── options/              # Página de configuraciones
│   ├── options.html
│   ├── options.css
│   └── options.js
└── icons/                # Iconos de la extensión
    ├── icon16x16.png
    ├── icon32x32.png
    ├── icon48x48.png
    └── icon128x128.png
```

## 🛠️ Instalación

### Para Desarrollo

1. **Descarga el código**:
   ```bash
   # Clona o descarga los archivos de la extensión
   cd quicktools
   ```

2. **Carga la extensión en Chrome**:
   - Abre Chrome y ve a `chrome://extensions/`
   - Activa el "Modo de desarrollador" (esquina superior derecha)
   - Haz clic en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta `extension/`

3. **¡Listo!** La extensión estará disponible

### Para Usuarios Finales

La extensión estará disponible próximamente en la Chrome Web Store.

## 🎮 Cómo Usar

### Acceso Rápido
- **Panel Flotante**: Haz clic en el icono de la extensión o usa `Ctrl+Shift+T`
- **Nueva Pestaña**: Ve a una nueva pestaña para acceder al dashboard completo
- **Atajos de Teclado**:
  - `Ctrl+Shift+T`: Mostrar/ocultar panel
  - `Ctrl+Shift+K`: Abrir herramientas
  - `Ctrl+Shift+Q`: Acciones rápidas

### Configuraciones
1. **Panel Flotante**: Ajusta posición, tamaño, tema y comportamientos
2. **Sincronización**: Guarda configuraciones en todos tus dispositivos
3. **Atajos**: Personaliza los atajos de teclado
4. **Privacidad**: Controla qué datos se recopilan

## 🔧 Desarrollo

### Tecnologías Utilizadas
- **Manifest V3**: Última versión de la API de extensiones
- **ES6+ JavaScript**: Código moderno y eficiente
- **CSS3**: Estilos avanzados con variables y animaciones
- **Web APIs**: Storage, Tabs, ActiveTab, Scripting

### Scripts Disponibles

```bash
# Verificar sintaxis
node -c extension/background/service-worker.js
node -c extension/popup/popup.js
node -c extension/newtab/newtab.js
node -c extension/content/content-script.js
node -c extension/options/options.js
```

### APIs de Chrome Utilizadas

- **chrome.tabs**: Gestión de pestañas
- **chrome.storage**: Almacenamiento local y sincronizado
- **chrome.scripting**: Inyección de scripts
- **chrome.action**: Control del icono y popup
- **chrome.declarativeNetRequest**: Bloqueo de anuncios
- **chrome.notifications**: Notificaciones del sistema
- **chrome.commands**: Atajos de teclado

## 📋 Configuraciones Detalladas

### General
- `openInNewTab`: Abrir herramientas en nueva pestaña
- `showNotifications`: Mostrar notificaciones
- `autoHidePanel`: Auto-ocultar panel flotante
- `autoHideDelay`: Delay en segundos para auto-ocultar

### Apariencia
- `theme`: Tema (light, dark, system)
- `primaryColor`: Color principal personalizable
- `enableAnimations`: Habilitar animaciones

### Privacidad
- `dataCollection`: Recopilar datos de uso
- `analyticsEnabled`: Habilitar analíticas
- `crashReports`: Enviar informes de errores
- `syncData`: Sincronizar datos en la nube

### Atajos de Teclado
- `toggle-panel`: Ctrl+Shift+T
- `open-tools`: Ctrl+Shift+K
- `quick-actions`: Ctrl+Shift+Q

## 🌐 Compatibilidad

- **Chrome**: Versión 88+ (Manifest V3)
- **Edge**: Versión 88+ (Chromium)
- **Brave**: Versión 1.20+
- **Otros navegadores Chromium**: Compatible

## 🐛 Solución de Problemas

### Problemas Comunes

**La extensión no carga:**
1. Verifica que el modo desarrollador esté habilitado
2. Revisa la consola en `chrome://extensions/`
3. Asegúrate de que todos los archivos estén presentes

**El panel flotante no aparece:**
1. Verifica que esté habilitado en las configuraciones
2. Comprueba los permisos de la página actual
3. Reinicia la extensión

**Los atajos de teclado no funcionan:**
1. Revisa las configuraciones de atajos
2. Verifica que no haya conflictos con otras extensiones
3. Cambia los atajos si es necesario

### Logs y Depuración

```javascript
// Habilitar logs detallados
chrome.storage.local.set({ debugMode: true });

// Ver logs en la consola de la página
console.log('QuickTools:', data);
```

## 🤝 Contribuir

### Proceso de Desarrollo

1. **Fork** el proyecto
2. Crea una **rama feature**: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un **Pull Request**

### Estándares de Código

- **JavaScript**: ES6+, JSDoc para documentación
- **CSS**: Variables CSS, metodología BEM
- **HTML**: HTML5 semántico
- **Accesibilidad**: WCAG 2.1 AA

### Lista de Tareas

- [ ] Implementar más herramientas de procesamiento de imágenes
- [ ] Agregar herramientas de desarrollo web
- [ ] Mejorar la integración con servicios en línea
- [ ] Optimizar el rendimiento de carga
- [ ] Añadir más idiomas de interfaz
- [ ] Implementar exportación/importación de configuraciones

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/mrcm-/quicktools/issues)
- **Email**: support@fasttools.tools
- **Documentación**: [Wiki](https://github.com/mrcm-/quicktools/wiki)

---

**QuickTools** - Desarrollado con ❤️ para mejorar tu productividad web.
