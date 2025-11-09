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

## 5. Arquitectura de Plantillas

El proyecto utiliza un sistema de plantillas para generar las páginas de las herramientas, asegurando una estructura y diseño consistentes.

- **`templates/base.html`**: Es la plantilla principal que contiene la cabecera, el pie de página y la estructura común.
- **`templates/tools-content/`**: Contiene los fragmentos de HTML específicos de cada herramienta. Cada herramienta se divide en hasta tres archivos:
  - `[nombre-herramienta]-head.html`: (Opcional) CSS o `<link>` adicionales.
  - `[nombre-herramienta]-content.html`: El HTML principal de la herramienta.
  - `[nombre-herramienta]-scripts.html`: (Opcional) `<script>` adicionales, incluidas librerías externas.
- **`generate-tools.js`**: Es un script de Node.js que combina la plantilla base con los fragmentos de cada herramienta para generar los archivos HTML finales en el directorio `tools/`.

## 6. Cómo añadir o modificar una herramienta

1.  **Crear/Editar los fragmentos de contenido**:
    - Añade o modifica los archivos de la herramienta en `templates/tools-content/`. Como mínimo, necesitarás un archivo `[nombre-herramienta]-content.html`.
2.  **Crear/Editar el script de la herramienta**:
    - La lógica principal debe ir en `js/tools/[nombre-herramienta].js`.
3.  **Añadir librerías (si es necesario)**:
    - Las librerías de terceros van en `js/vendor/`. Asegúrate de incluirlas en el archivo `[nombre-herramienta]-scripts.html`.
4.  **Actualizar el índice de herramientas**:
    - Añade o actualiza la entrada de la herramienta en `data/tools-index.json`.
5.  **Regenerar los archivos HTML**:
    - Ejecuta el script de generación desde la raíz del proyecto:
      ```bash
      node generate-tools.js
      ```
    - **Importante**: No edites directamente los archivos HTML en el directorio `tools/`, ya que serán sobrescritos.

## 7. Estilo de Código

- **Consistencia:** Antes de añadir o modificar código, revisa los archivos existentes para entender y replicar el estilo de codificación, la estructura y las convenciones utilizadas.
- **Comentarios:** Añade comentarios solo cuando sea necesario para explicar lógica compleja.
