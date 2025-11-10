# Guía de Traducción de JavaScript

## 🎯 Objetivo

Completar la traducción de los archivos JavaScript de las herramientas, reemplazando todo el texto hardcodeado en español con referencias a `window.toolTranslations`.

## 📋 Estado Actual

Todos los archivos JS ya tienen:
- ✅ `const t = window.toolTranslations || {};` al inicio
- ✅ Algunos mensajes ya traducidos (ej: `t.copied`)
- ⏳ Muchos textos aún hardcodeados en español

## 🔍 Proceso por Archivo

### Paso 1: Abrir el archivo JS

**Ubicación:** `web/js/tools/TOOL_NAME.js`  
**JSON de traducciones:** `web/i18n/tools/TOOL_NAME.json`

### Paso 2: Buscar texto hardcodeado en español

Busca en el archivo JS:
- Strings entre comillas: `'Texto en español'` o `"Texto en español"`
- Mensajes de error: `alert('Error...')`, `showMsg('...')`
- Textos en `textContent`, `innerHTML`, `innerText`
- Placeholders dinámicos
- Mensajes de confirmación: `confirm('¿Seguro?')`

**Ignora:**
- Nombres de variables y funciones
- Comentarios (opcional traducirlos)
- Valores técnicos (IDs, clases CSS, etc.)

### Paso 3: Verificar si la clave existe en JSON

Antes de crear una nueva clave, verifica si ya existe en el JSON:

**Claves comunes que ya existen:**
- `copied` - "✅ Copiado al portapapeles"
- `error` - "❌ Error"
- `success` - "✅ ¡Éxito!"
- `processing` - "⏳ Procesando..."
- `copyButton`, `clearButton`, `downloadButton`, etc.

### Paso 4: Añadir clave al JSON (si no existe)

Si el texto no tiene clave, añádela al JSON:

```json
{
  "en": {
    "noTextToCopy": "No text to copy",
    "invalidFormat": "Invalid format",
    "fileLoaded": "File loaded successfully"
  },
  "es": {
    "noTextToCopy": "No hay texto para copiar",
    "invalidFormat": "Formato inválido",
    "fileLoaded": "Archivo cargado correctamente"
  }
}
```

### Paso 5: Reemplazar en el código JS

**Antes:**
```javascript
alert('No hay texto para copiar');
showMsg('Formato inválido', 'error');
msg.textContent = 'Archivo cargado correctamente';
```

**Después:**
```javascript
alert(t.noTextToCopy || 'No hay texto para copiar');
showMsg(t.invalidFormat || 'Formato inválido', 'error');
msg.textContent = t.fileLoaded || 'Archivo cargado correctamente';
```

## 📝 Ejemplo Completo: base64.js

### Archivo Original (parcialmente traducido)

```javascript
const t = window.toolTranslations || {};

const input = document.getElementById('base64Input');
const output = document.getElementById('base64Output');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const copyBtn = document.getElementById('copyBtn');
const msg = document.getElementById('msg');

encodeBtn?.addEventListener('click', () => {
    try {
        const text = input.value;
        if (!text) {
            msg.textContent = 'Por favor ingresa un texto';  // ❌ Hardcoded
            return;
        }
        output.value = btoa(unescape(encodeURIComponent(text)));
        msg.textContent = 'Codificado correctamente';  // ❌ Hardcoded
    } catch (e) {
        msg.textContent = 'Error al codificar: ' + e.message;  // ❌ Hardcoded
    }
});

decodeBtn?.addEventListener('click', () => {
    try {
        const text = input.value;
        if (!text) {
            msg.textContent = 'Por favor ingresa un texto';  // ❌ Hardcoded
            return;
        }
        output.value = decodeURIComponent(escape(atob(text)));
        msg.textContent = 'Decodificado correctamente';  // ❌ Hardcoded
    } catch (e) {
        msg.textContent = 'Error al decodificar: ' + e.message;  // ❌ Hardcoded
    }
});

copyBtn?.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        msg.textContent = t.copied || 'Copiado al portapapeles';  // ✅ Ya traducido
    } catch (e) {
        msg.textContent = 'Error al copiar';  // ❌ Hardcoded
    }
});
```

### Paso 1: Identificar textos hardcodeados

- "Por favor ingresa un texto" → `pleaseEnterText`
- "Codificado correctamente" → `encoded`
- "Error al codificar: " → `encodeError`
- "Decodificado correctamente" → `decoded`
- "Error al decodificar: " → `decodeError`
- "Error al copiar" → `copyError`

### Paso 2: Actualizar JSON

```json
{
  "en": {
    "copied": "✅ Copied to clipboard",
    "pleaseEnterText": "Please enter some text",
    "encoded": "Encoded successfully",
    "encodeError": "Error encoding",
    "decoded": "Decoded successfully",
    "decodeError": "Error decoding",
    "copyError": "Error copying"
  },
  "es": {
    "copied": "✅ Copiado al portapapeles",
    "pleaseEnterText": "Por favor ingresa un texto",
    "encoded": "Codificado correctamente",
    "encodeError": "Error al codificar",
    "decoded": "Decodificado correctamente",
    "decodeError": "Error al decodificar",
    "copyError": "Error al copiar"
  }
}
```

### Paso 3: Actualizar código JS

```javascript
const t = window.toolTranslations || {};

const input = document.getElementById('base64Input');
const output = document.getElementById('base64Output');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const copyBtn = document.getElementById('copyBtn');
const msg = document.getElementById('msg');

encodeBtn?.addEventListener('click', () => {
    try {
        const text = input.value;
        if (!text) {
            msg.textContent = t.pleaseEnterText || 'Por favor ingresa un texto';
            return;
        }
        output.value = btoa(unescape(encodeURIComponent(text)));
        msg.textContent = t.encoded || 'Codificado correctamente';
    } catch (e) {
        msg.textContent = (t.encodeError || 'Error al codificar') + ': ' + e.message;
    }
});

decodeBtn?.addEventListener('click', () => {
    try {
        const text = input.value;
        if (!text) {
            msg.textContent = t.pleaseEnterText || 'Por favor ingresa un texto';
            return;
        }
        output.value = decodeURIComponent(escape(atob(text)));
        msg.textContent = t.decoded || 'Decodificado correctamente';
    } catch (e) {
        msg.textContent = (t.decodeError || 'Error al decodificar') + ': ' + e.message;
    }
});

copyBtn?.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        msg.textContent = t.copied || 'Copiado al portapapeles';
    } catch (e) {
        msg.textContent = t.copyError || 'Error al copiar';
    }
});
```

## ✅ Checklist por Archivo

- [ ] Abrir `web/js/tools/TOOL_NAME.js`
- [ ] Buscar TODOS los strings en español
- [ ] Verificar claves existentes en `web/i18n/tools/TOOL_NAME.json`
- [ ] Añadir nuevas claves al JSON (en inglés y español)
- [ ] Reemplazar strings con `t.key || 'fallback'`
- [ ] Verificar que no quede texto hardcodeado
- [ ] Regenerar sitio: `npm run build`
- [ ] Probar funcionalidad en ambos idiomas

## 🎨 Convenciones de Nombres

| Tipo de Mensaje | Ejemplo de Clave | Ejemplo Valor |
|-----------------|------------------|---------------|
| Validación | `pleaseEnterText`, `invalidFormat` | "Please enter text" |
| Éxito | `encoded`, `decoded`, `converted` | "Encoded successfully" |
| Error | `encodeError`, `copyError` | "Error encoding" |
| Confirmación | `confirmClear`, `confirmDelete` | "Are you sure?" |
| Estado | `processing`, `loading` | "Processing..." |
| Información | `fileLoaded`, `noFileSelected` | "File loaded" |

## 🔍 Patrones Comunes a Buscar

### 1. Mensajes de validación
```javascript
// ❌ Antes
if (!text) {
    alert('Por favor ingresa un texto');
}

// ✅ Después
if (!text) {
    alert(t.pleaseEnterText || 'Por favor ingresa un texto');
}
```

### 2. Mensajes de error con detalles
```javascript
// ❌ Antes
catch (e) {
    showMsg('Error al procesar: ' + e.message, 'error');
}

// ✅ Después
catch (e) {
    showMsg((t.processingError || 'Error al procesar') + ': ' + e.message, 'error');
}
```

### 3. Confirmaciones
```javascript
// ❌ Antes
if (confirm('¿Seguro que quieres limpiar?')) {
    clear();
}

// ✅ Después
if (confirm(t.confirmClear || '¿Seguro que quieres limpiar?')) {
    clear();
}
```

### 4. Mensajes de estado
```javascript
// ❌ Antes
btn.textContent = 'Procesando...';
btn.disabled = true;

// ✅ Después
btn.textContent = t.processing || 'Procesando...';
btn.disabled = true;
```

### 5. Textos dinámicos
```javascript
// ❌ Antes
msg.textContent = `Archivo cargado: ${fileName}`;

// ✅ Después
msg.textContent = `${t.fileLoaded || 'Archivo cargado'}: ${fileName}`;
```

## 📂 Lista Completa de Archivos JS (28 archivos)

**Ubicación:** `web/js/tools/`

### Herramientas de Datos (5)
- ✅ `json-formatter.js` ✅ (ya completado)
- ✅ `csv-json.js`
- ✅ `yaml-json.js`
- ✅ `xml-json.js`
- ✅ `toml-json.js`

### Herramientas de Texto (6)
- [ ] `base64.js` ⏳ (ejemplo en esta guía)
- ✅ `url-encoder.js`
- ✅ `html-encoder.js`
- ✅ `text-cleaner.js`
- ✅ `diff.js`
- ✅ `lorem-ipsum-generator.js`

### Herramientas de Imagen (7)
- [ ] `image-resizer.js`
- [ ] `image-compressor.js`
- [ ] `convert-image.js`
- [ ] `image-cropper.js`
- [ ] `color-palette-generator.js`
- [ ] `exif-viewer-cleaner.js`
- [ ] `color-picker-converter.js`

### Herramientas de Archivos/PDF (6)
- ✅ `pdf-to-text.js`
- [ ] `merge-pdfs.js`
- [ ] `split-pdf.js`
- [ ] `compress-pdf.js`
- [ ] `pdf-to-image.js`
- [ ] `image-to-pdf.js`

### Herramientas de Utilidades (4)
- ✅ `qr.js`
- ✅ `password.js`
- ✅ `hash-calculator.js`
- ✅ `stopwatch-timer.js`

**Nota:** Las herramientas de IA (5) ya están completamente traducidas y no requieren trabajo adicionalator

## 🚀 Después de Completar

1. Regenerar sitio:
   ```bash
   npm run build
   ```

2. Probar en navegador:
   - Abrir herramienta en inglés: `http://localhost:8000/tools/xxx/tool.html`
   - Abrir herramienta en español: `http://localhost:8000/es/tools/xxx/tool.html`
   - Probar TODAS las funciones (botones, validaciones, errores)
   - Verificar que los mensajes aparezcan en el idioma correcto

3. Verificar casos especiales:
   - Mensajes de error (provocar errores intencionalmente)
   - Validaciones (dejar campos vacíos)
   - Confirmaciones (probar botones de limpiar/eliminar)

## 💡 Tips Importantes

- **Siempre usa fallback**: `t.key || 'Texto español'` para que funcione si falta la traducción
- **No traduzcas valores técnicos**: URLs, nombres de archivos, códigos de error HTTP
- **Mantén el formato**: Si el mensaje original tiene emojis o formato, mantenlo
- **Reutiliza claves**: Si `copied` ya existe, úsalo en lugar de crear `textCopied`
- **Prueba los errores**: No solo pruebes el caso exitoso, provoca errores para ver los mensajes
- **Consistencia**: Usa el mismo estilo de mensajes en todas las herramientas

## 🔧 Script Útil

Para buscar texto hardcodeado en un archivo:

```bash
# Buscar strings en español (con tildes, ñ, etc.)
grep -n "[áéíóúñ¿¡]" web/js/tools/TOOL_NAME.js
```

---

**Fecha:** 2025-01-09  
**Estado:** 📝 Guía lista para completar traducciones JS
