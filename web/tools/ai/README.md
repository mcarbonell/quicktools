# 🤖 Herramientas de IA - QuickTools

Herramientas potenciadas con **Google Gemini API** que funcionan 100% en tu navegador.

## ✨ Características

- 🔒 **100% Privado**: Tu API key se guarda en localStorage, nunca en servidores
- 🆓 **Gratis**: Usa tu propia API key de Google (60 req/min gratis)
- ⚡ **Rápido**: Llamadas directas a Google, sin intermediarios
- 🌐 **Sin backend**: Todo funciona del lado del cliente

## 🛠️ Herramientas Disponibles

### 1. Chat IA (`chat-ai.html`)
Conversación interactiva con Gemini:
- Chat en tiempo real
- Historial de conversación
- Exportar chat a TXT
- Formateo de código y markdown

### 2. Resumir Texto (`summarize.html`)
Resume textos largos automáticamente:
- Resumen corto (3-5 líneas)
- Resumen medio (1 párrafo)
- Resumen largo (detallado)
- Puntos clave (bullets)

### 3. Mejorar Texto (`improve-text.html`)
Mejora gramática, estilo y claridad:
- Corrección gramatical
- Mejorar estilo
- Formalizar/Casualizar
- Hacer conciso/Expandir
- Soporte multiidioma

## 🚀 Cómo Usar

### Paso 1: Obtener API Key
1. Visita [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta Google
3. Crea una API key (gratis)
4. Copia la key

### Paso 2: Configurar
1. Abre `chat-ai.html`
2. Pega tu API key
3. Haz clic en "Guardar"
4. ¡Listo! Ya puedes usar todas las herramientas

### Paso 3: Usar
- La API key se guarda automáticamente
- Funciona en todas las herramientas de IA
- Puedes eliminarla cuando quieras

## 🔧 Arquitectura Técnica

```
web/tools/ai/
├── chat-ai.html          # Chat interactivo
├── summarize.html        # Resumir textos
├── improve-text.html     # Mejorar redacción
└── README.md            # Esta documentación

web/js/lib/
└── gemini-api.js        # Cliente API compartido
```

### Librería Compartida (`gemini-api.js`)

**Clase GeminiAPI:**
```javascript
const gemini = new GeminiAPI(apiKey);
const response = await gemini.chat(prompt, options);
```

**Gestión de Storage:**
```javascript
GeminiStorage.save(apiKey);    // Guardar
GeminiStorage.get();           // Obtener
GeminiStorage.remove();        // Eliminar
GeminiStorage.exists();        // Verificar
```

## 📊 Límites de Google Gemini (Tier Gratuito)

- **60 requests/minuto**
- **1,500 requests/día**
- **1 millón tokens/mes**
- Modelo: `gemini-2.0-flash-exp`

## 🔐 Seguridad y Privacidad

✅ **Tu API key:**
- Se guarda en `localStorage` del navegador
- Nunca se envía a nuestros servidores
- Solo tú tienes acceso

✅ **Tus datos:**
- Llamadas directas a Google
- No pasan por nuestro backend
- Google procesa según su [política de privacidad](https://policies.google.com/privacy)

✅ **Control total:**
- Puedes eliminar la key cuando quieras
- Puedes revocarla desde Google AI Studio
- Sin dependencias de terceros

## 🚀 Próximas Herramientas

- [ ] **Traducir con IA** - Traducción contextual
- [ ] **Generar código** - Snippets desde descripción
- [ ] **Analizar imagen** - Gemini Vision
- [ ] **Extraer datos** - Parsing inteligente
- [ ] **Generar prompts** - Optimizador de prompts

## 🧩 Integración con Extensión

Este código está listo para integrarse en la extensión de navegador:

```javascript
// En extension/background/service-worker.js
chrome.storage.sync.get(['gemini_api_key'], (result) => {
  const gemini = new GeminiAPI(result.gemini_api_key);
  // Usar en background
});
```

## 📝 Notas de Desarrollo

- **Bootstrap 5.3.2** para UI
- **Vanilla JS** sin frameworks
- **Fetch API** para llamadas HTTP
- **localStorage** para persistencia
- **Markdown básico** en respuestas

## 🤝 Contribuir

Para añadir nuevas herramientas de IA:

1. Crea un nuevo HTML en `web/tools/ai/`
2. Importa `gemini-api.js`
3. Usa `GeminiStorage` para la API key
4. Sigue el patrón de las herramientas existentes

## 📄 Licencia

ISC - Mismo que QuickTools
