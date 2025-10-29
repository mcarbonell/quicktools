# Guía para desarrolladores de IA - Proyecto QuickTools

## 1. Objetivo del Proyecto

El objetivo de **QuickTools** es ser un sitio web de herramientas online que funcionan **100% en el navegador del cliente**. La privacidad, la velocidad y la simplicidad son los pilares fundamentales. No se requiere backend, bases de datos ni registro de usuarios.

## 2. Principios Fundamentales

- **Todo en el cliente:** Toda la lógica se ejecuta en el navegador. No se suben archivos a ningún servidor.
- **Privacidad primero:** Al no haber subida de datos, se garantiza la privacidad del usuario.
- **Sin registro:** Las herramientas son de acceso inmediato.
- **Rendimiento:** El sitio debe ser rápido y ligero.
- **Diseño consistente:** Se utiliza Bootstrap 5 para la interfaz. La consistencia visual es clave.

## 3. Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS:** Bootstrap 5
- **Librerías principales:**
  - **PDF:** `pdf-lib.js`, `pdf.js`
  - **Imágenes:** `Compressor.js`
  - **Conversión de datos:** Librerías específicas para TOML, YAML, etc., o Vanilla JS.

## 4. Estructura de Archivos

- `index.html`: Página principal que carga las herramientas dinámicamente.
- `data/tools-index.json`: Un array de objetos JSON que define cada herramienta disponible en el `index.html`.
- `tools/`: Contiene las páginas HTML para cada herramienta, organizadas en subcarpetas por categoría (e.g., `image`, `text`, `files`).
- `js/tools/`: Contiene los archivos JavaScript con la lógica para cada herramienta.
- `js/vendor/`: Librerías de terceros.
- `css/style.css`: Estilos personalizados.

## 5. Cómo añadir una nueva herramienta

1.  **Crear el HTML:** Añade un nuevo archivo HTML en la subcarpeta correspondiente dentro de `tools/` (e.g., `tools/text/new-tool.html`). Utiliza la estructura de Bootstrap 5 de los otros archivos para mantener la consistencia.
2.  **Crear el JavaScript:** Añade un nuevo archivo JS en `js/tools/` (e.g., `js/tools/new-tool.js`) con la lógica de la herramienta.
3.  **Añadir la librería (si es necesario):** Si usas una librería de terceros, añádela a `js/vendor/`.
4.  **Actualizar el índice:** Añade una nueva entrada en `data/tools-index.json` para que la herramienta aparezca en la página principal. Asegúrate de rellenar todos los campos (`title`, `slug`, `description`, `category`, `tags`).
5.  **Actualizar TODO.md:** Marca la tarea como completada en el `TODO.md`.

## 6. Estilo de Código

- **Consistencia:** Antes de añadir o modificar código, revisa los archivos existentes para entender y replicar el estilo de codificación, la estructura y las convenciones utilizadas.
- **Comentarios:** Añade comentarios solo cuando sea necesario para explicar lógica compleja.
