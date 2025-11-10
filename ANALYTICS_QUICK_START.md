# 🚀 Analytics Quick Start

## ⚡ Setup en 5 Minutos

### 1️⃣ Obtener Google Analytics ID (2 min)

```
1. Ir a: https://analytics.google.com
2. Crear cuenta "QuickTools"
3. Crear propiedad "QuickTools Web"
4. Copiar Measurement ID: G-XXXXXXXXXX
```

### 2️⃣ Configurar ID en Código (1 min)

Editar `web/js/cookie-consent.js` línea 7:

```javascript
this.gaId = 'G-XXXXXXXXXX'; // ← Pegar tu ID aquí
```

### 3️⃣ Regenerar Sitio (1 min)

```bash
npm run build
```

### 4️⃣ Test Local (1 min)

```bash
npx http-server web -p 8000
```

Abrir http://localhost:8000, aceptar cookies, verificar en consola:
```
📊 Analytics initialized
```

### 5️⃣ Deploy (automático)

```bash
git add .
git commit -m "Add Google Analytics"
git push
```

---

## 🎯 Integrar en Herramientas

### Patrón Básico (copiar y pegar)

```javascript
// Al inicio de cualquier herramienta

// Cuando usuario carga archivo
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && window.analytics) {
        window.analytics.trackToolUsed({
            'file_type': file.type,
            'file_size': file.size
        });
    }
});

// Cuando descarga resultado
downloadButton.addEventListener('click', () => {
    if (window.analytics) {
        window.analytics.trackAction('download');
    }
    // ... código de descarga ...
});

// En errores
try {
    // ... código que puede fallar ...
} catch (error) {
    if (window.analytics) {
        window.analytics.trackError('processing_failed', error.message);
    }
    throw error;
}
```

---

## 📊 Ver Datos en GA4

1. Ir a https://analytics.google.com
2. Seleccionar propiedad "QuickTools Web"
3. Click en "Real-Time" → "Events"
4. Usar herramientas en tu sitio
5. Ver eventos aparecer en tiempo real ✨

---

## 📚 Documentación Completa

- **Guía Completa**: `local_docs/ANALYTICS_IMPLEMENTATION.md`
- **Checklist 33 Herramientas**: `local_docs/ANALYTICS_INTEGRATION_CHECKLIST.md`
- **Ejemplos de Código**: `web/js/analytics-integration-example.js`
- **README**: `web/js/ANALYTICS_README.md`
- **Resumen**: `ANALYTICS_IMPLEMENTATION_SUMMARY.md`

---

## ✅ Checklist Mínimo

```
□ Obtener GA4 Measurement ID
□ Configurar en cookie-consent.js
□ npm run build
□ Test local
□ Deploy
□ Verificar en GA4 Real-Time
□ Integrar en 5 herramientas prioritarias
□ Integrar en 28 herramientas restantes
```

---

## 🎉 ¡Listo!

Analytics está implementado y funcionando. Solo falta:
1. Configurar tu GA4 ID
2. Integrar tracking en las herramientas

**Tiempo total:** ~3 días para integración completa en 33 herramientas
