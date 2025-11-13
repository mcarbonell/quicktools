# 🤖 AI Smart Recommender - FastTools Extension

## Descripción

**AI Smart Recommender** es una funcionalidad única de FastTools que analiza tu historial de navegación usando **IA local de Chrome** (Gemini Nano) para:

1. **Inferir tu perfil automáticamente** (rol, nivel, intereses, stack tecnológico)
2. **Generar recomendaciones personalizadas** de sitios web que probablemente no conozcas
3. **Recomendaciones contextuales** basadas en el sitio que estás visitando

## 🎯 Características

- ✅ **100% Privado**: Todo procesado localmente con Chrome AI
- ✅ **Análisis automático**: No necesitas ingresar datos manualmente
- ✅ **Inferencia inteligente**: La IA detecta tu perfil profesional
- ✅ **Recomendaciones contextuales**: Sitios similares al que estás visitando
- ✅ **Caché inteligente**: Análisis rápido con caché de 5 minutos
- ✅ **Sin servidores**: Historial nunca sale de tu dispositivo

## 🚀 Cómo Usar

### Método 1: Context Menu (Click Derecho)
1. Haz click derecho en cualquier página
2. Selecciona **"🤖 Recomendar Sitios Similares"**
3. Se abrirá una ventana con tu perfil y recomendaciones

### Método 2: Página de Prueba
1. Abre `chrome-extension://[ID]/test-ai-recommender.html`
2. Usa los botones para probar cada funcionalidad
3. Observa los resultados en tiempo real

### Método 3: Desde Código
```javascript
// Analizar historial e inferir perfil
const response = await chrome.runtime.sendMessage({
    action: 'analyze-history',
    days: 30
});

// Obtener recomendaciones generales
const recommendations = await chrome.runtime.sendMessage({
    action: 'get-recommendations'
});

// Obtener recomendaciones para sitio actual
const contextual = await chrome.runtime.sendMessage({
    action: 'get-recommendations',
    currentUrl: 'https://github.com'
});

// Limpiar caché
await chrome.runtime.sendMessage({
    action: 'clear-profile-cache'
});
```

## 📊 Ejemplo de Análisis

**Input:** Historial de navegación de 30 días

**Output:**
```json
{
  "profile": "Desarrollador Web Full-Stack",
  "level": "senior",
  "interests": ["desarrollo web", "diseño UI/UX", "IA"],
  "stack": ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind"],
  "language": "es",
  "workStyle": "Autodidacta, colaborativo, aprendizaje continuo"
}
```

**Recomendaciones:**
- Storybook.js - Component development
- Frontend Mentor - Práctica de diseño
- Performance.dev - Optimización web
- WAI/WCAG - Accesibilidad
- Diagrams.net - Documentación de arquitectura

## 🏗️ Arquitectura

### Componentes

1. **history-analyzer.js** - Analiza historial y genera estadísticas
   - Agrupa visitas por dominio
   - Calcula métricas (visitas, tiempo, páginas únicas)
   - Filtra dominios internos
   - Caché de 5 minutos

2. **profile-inference.js** - Infiere perfil con IA
   - Usa Chrome AI (Gemini Nano)
   - Genera perfil JSON estructurado
   - Crea recomendaciones contextuales
   - Formatea prompts optimizados

3. **service-worker.js** - Maneja mensajes
   - `analyze-history` - Analiza historial
   - `get-recommendations` - Genera recomendaciones
   - `clear-profile-cache` - Limpia caché

4. **ai-recommender.html/js** - Interfaz de usuario
   - Muestra perfil inferido
   - Renderiza recomendaciones
   - Botones de actualización y limpieza

### Flujo de Datos

```
Usuario → Context Menu
    ↓
Service Worker recibe mensaje
    ↓
history-analyzer.js analiza historial
    ↓
profile-inference.js infiere perfil con IA
    ↓
profile-inference.js genera recomendaciones
    ↓
Popup muestra resultados
```

## 🔧 Configuración

### Permisos Requeridos (manifest.json)
```json
{
  "permissions": [
    "history",    // Leer historial de navegación
    "storage",    // Guardar caché
    "tabs"        // Obtener URL actual
  ]
}
```

### Imports en Service Worker
```javascript
importScripts('history-analyzer.js');
importScripts('../shared/profile-inference.js');
```

## 🧪 Testing

### Página de Prueba
Abre `test-ai-recommender.html` en la extensión para:
- ✅ Analizar historial
- ✅ Obtener recomendaciones generales
- ✅ Obtener recomendaciones contextuales
- ✅ Limpiar caché
- ✅ Abrir popup

### Console Logs
```javascript
// Activar logs detallados
console.log('🔍 Analizando historial...');
console.log('🤖 Infiriendo perfil...');
console.log('🎯 Generando recomendaciones...');
console.log('✅ Completado');
```

## 📈 Métricas

- **Análisis de historial**: ~1-2 segundos (10,000 items)
- **Inferencia de perfil**: ~3-5 segundos (Chrome AI)
- **Generación de recomendaciones**: ~5-8 segundos (Chrome AI)
- **Caché**: 5 minutos de duración
- **Total tiempo primera vez**: ~10-15 segundos
- **Total tiempo con caché**: ~5-8 segundos

## 🎨 UI/UX

### Popup Design
- **Ancho**: 500px
- **Alto**: 400px mínimo
- **Colores**: Gradiente púrpura (#667eea → #764ba2)
- **Secciones**:
  - Header con título y descripción
  - Perfil inferido (4 campos)
  - Recomendaciones (markdown renderizado)
  - Botones de acción

### Estados
- **Loading**: Spinner + mensaje
- **Success**: Perfil + recomendaciones
- **Error**: Mensaje de error con detalles

## 🔒 Privacidad

- ✅ **Todo local**: Historial procesado en dispositivo
- ✅ **Chrome AI local**: Gemini Nano ejecuta en navegador
- ✅ **Sin servidores**: Cero llamadas externas
- ✅ **Sin tracking**: No se envía información a terceros
- ✅ **Caché temporal**: Solo 5 minutos en memoria

## 🚧 Limitaciones

1. **Requiere Chrome AI**: Gemini Nano debe estar disponible
2. **Historial limitado**: Máximo 10,000 items por consulta
3. **Caché temporal**: 5 minutos de duración
4. **Idioma**: Prompts en español, pero detecta idioma del usuario

## 🔮 Futuras Mejoras

- [ ] Dashboard en New Tab con análisis completo
- [ ] Gráficos de uso (Chart.js)
- [ ] Notificaciones de nuevas recomendaciones
- [ ] Filtrado avanzado (excluir categorías)
- [ ] Exportar análisis (PDF/JSON)
- [ ] Análisis de tendencias temporales
- [ ] Comparación con otros usuarios (anónimo)

## 📚 Referencias

- [Chrome AI APIs](https://developer.chrome.com/docs/ai/built-in-apis)
- [Chrome History API](https://developer.chrome.com/docs/extensions/reference/history/)
- [Gemini Nano](https://ai.google.dev/gemini-api/docs/models/gemini)

---

**Desarrollado por:** FastTools Team  
**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025
