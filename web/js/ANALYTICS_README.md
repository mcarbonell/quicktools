# 📊 Analytics - Guía Rápida

## Archivos Implementados

- ✅ `analytics.js` - Wrapper de tracking
- ✅ `cookie-consent.js` - Banner de cookies GDPR
- ✅ `cookie-banner.css` - Estilos del banner
- ✅ `analytics-integration-example.js` - Ejemplos de uso

## Setup Inicial

### 1. Obtener Google Analytics ID

1. Ir a https://analytics.google.com
2. Crear cuenta "QuickTools"
3. Crear propiedad "QuickTools Web"
4. Obtener Measurement ID: `G-XXXXXXXXXX`

### 2. Configurar ID en el Código

Editar `cookie-consent.js` línea 7:

```javascript
this.gaId = 'G-XXXXXXXXXX'; // Reemplazar con tu ID real
```

### 3. Verificar Integración

Los scripts ya están incluidos en `templates/base.html`:
- ✅ Cookie banner CSS
- ✅ Cookie consent JS
- ✅ Analytics JS

## Uso en Herramientas

### Patrón Básico

```javascript
// Al cargar archivo
if (window.analytics) {
    window.analytics.trackToolUsed({
        'file_type': file.type,
        'file_size': file.size
    });
}

// Al realizar acción
if (window.analytics) {
    window.analytics.trackAction('download');
}

// En errores
if (window.analytics) {
    window.analytics.trackError('invalid_file', error.message);
}
```

## Eventos Disponibles

### trackToolUsed(details)
Cuando usuario empieza a usar la herramienta.

```javascript
window.analytics.trackToolUsed({
    'file_type': 'image/png',
    'file_size': 1024000
});
```

### trackAction(action, details)
Para acciones del usuario.

```javascript
// Acciones comunes
window.analytics.trackAction('download');
window.analytics.trackAction('copy');
window.analytics.trackAction('convert');
window.analytics.trackAction('processing_started');
window.analytics.trackAction('processing_completed');

// Con detalles
window.analytics.trackAction('download', {
    'format': 'jpg',
    'size': 500000
});
```

### trackError(errorType, errorMessage, details)
Para errores.

```javascript
window.analytics.trackError('invalid_file', 'File type not supported');
window.analytics.trackError('processing_failed', error.message);
window.analytics.trackError('api_error', 'API key invalid');
```

### trackLanguageChange(fromLang, toLang)
Para cambio de idioma.

```javascript
window.analytics.trackLanguageChange('es', 'en');
```

## Métricas Automáticas

El sistema trackea automáticamente:
- ✅ Page views
- ✅ Tiempo de engagement (al salir)
- ✅ Idioma de la página
- ✅ Categoría de herramienta
- ✅ Nombre de herramienta

## Privacy & GDPR

- ✅ Cookie consent banner
- ✅ Opt-out disponible
- ✅ IP anonymization
- ✅ No PII tracking
- ✅ Solo carga Analytics si usuario acepta

## Testing

### Local Testing

1. Abrir herramienta en navegador
2. Abrir DevTools Console
3. Aceptar cookies
4. Verificar mensaje: `📊 Analytics initialized`
5. Usar herramienta
6. Verificar eventos en Network tab (gtag/collect)

### Production Testing

1. Ir a Google Analytics
2. Real-Time → Events
3. Usar herramienta
4. Verificar eventos aparecen en tiempo real

## Reportes en GA4

### Custom Events

Todos los eventos personalizados:
- `tool_used` - Herramienta usada
- `tool_action` - Acción realizada
- `tool_error` - Error ocurrido
- `tool_engagement` - Tiempo de uso
- `language_change` - Cambio de idioma

### Parámetros

Cada evento incluye:
- `tool_name` - Nombre de la herramienta
- `tool_category` - Categoría (image, files, data, text, utils, ai)
- `language` - Idioma (en, es)
- Parámetros específicos del evento

## Próximos Pasos

1. ✅ Archivos implementados
2. ⏳ Obtener GA4 Measurement ID
3. ⏳ Configurar ID en cookie-consent.js
4. ⏳ Integrar tracking en 33 herramientas
5. ⏳ Configurar reportes en GA4
6. ⏳ Testing en producción

## Documentación Completa

Ver: `local_docs/ANALYTICS_IMPLEMENTATION.md`
