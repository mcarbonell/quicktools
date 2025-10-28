# QuickTools — MVP (estático)

Proyecto MVP con 5 herramientas que funcionan 100% en el navegador. Estructura mínima para desplegar en GitHub Pages o abrir localmente.

Cómo probar localmente:

1. Abre `index.html` en tu navegador (doble clic). Algunas funcionalidades (PDF.js) requieren servir mediante HTTP en algunos navegadores; si ves errores, usa un servidor estático simple (ver opción abajo).

2. Páginas incluidas en `tools/`:
  - `image-resizer.html` — redimensionar imagen (Canvas)
  - `convert-image.html` — convertir formato (PNG/JPG/WebP)
  - `json-formatter.html` — formatear, validar y minificar JSON
  - `pdf-to-text.html` — extraer texto de PDF (PDF.js)
  - `text-cleaner.html` — limpiar texto y contar palabras

3. Placeholder de anuncios en `ads/adsense.html` (comentado). Reemplazar con tu código de AdSense cuando corresponda.

Opcional: servir con Python para evitar restricciones de CORS en algunos navegadores:

```powershell
# Desde la carpeta quicktools
python -m http.server 8000
# o usando PowerShell:
npx http-server -p 8000
```

Luego abre http://localhost:8000 en el navegador.

Siguientes pasos recomendados:
- Añadir tests/e2e básicos.
- Mejorar UI y accesibilidad.
- Agregar más herramientas del listado original.
