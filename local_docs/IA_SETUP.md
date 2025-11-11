# 🚀 Guía Rápida - Herramientas IA

## ✅ Estado: FUNCIONANDO

Las herramientas de IA están completamente funcionales usando Google Gemini API.

## 🔑 Configuración (5 minutos)

### Paso 1: Obtener API Key
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta Google
3. Crea un nuevo proyecto o selecciona uno existente
4. Haz clic en "Create API Key"
5. Copia la key (formato: `AIzaSy...`)

### Paso 2: Habilitar la API
1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)
2. Selecciona tu proyecto
3. Haz clic en "Enable" (Habilitar)
4. Espera unos segundos a que se active

### Paso 3: Configurar en QuickTools
1. Abre `web/tools/ai/chat-ai.html`
2. Pega tu API key en el campo
3. Haz clic en "Guardar"
4. ¡Listo! Ya puedes usar todas las herramientas de IA

## 🛠️ Herramientas Disponibles

### ✅ Chat IA (`chat-ai.html`)
- Conversación interactiva
- Historial completo
- Exportar a TXT
- Formateo de código

### ✅ Resumir Texto (`summarize.html`)
- 4 tipos de resumen
- Contador de caracteres
- Copiar resultado

### ✅ Mejorar Texto (`improve-text.html`)
- 6 tipos de mejora
- 4 idiomas soportados
- Comparación lado a lado

## 🔧 Detalles Técnicos

**Modelo usado:** `gemini-2.0-flash-exp`
**Endpoint:** `https://generativelanguage.googleapis.com/v1beta`
**Autenticación:** Header `X-goog-api-key`

## 🐛 Solución de Problemas

### Error 404 "model not found"
- ✅ **Solucionado**: Usar `gemini-2.0-flash-exp` en lugar de `gemini-1.5-flash`

### Error 401 "unauthorized"
- Verifica que la API key sea correcta
- Asegúrate de que la API esté habilitada en Google Cloud Console

### Error 403 "forbidden"
- Verifica las restricciones de la API key
- Asegúrate de no tener restricciones de IP o referrer

## 📊 Límites Gratuitos

- 60 requests/minuto
- 1,500 requests/día
- 1 millón tokens/mes

## 🔒 Seguridad

✅ API key guardada en `localStorage`
✅ Nunca se envía a servidores de QuickTools
✅ Llamadas directas a Google
✅ Puedes eliminarla cuando quieras

## 🎯 Próximos Pasos

- [ ] Añadir más herramientas (traducir, generar código, etc.)
- [ ] Integrar en la extensión de navegador
- [ ] Añadir soporte para imágenes (Gemini Vision)
- [ ] Historial persistente de conversaciones
