# 🧪 Guía de Pruebas - QuickTools PWA

## 📋 Resumen de Pruebas Creadas

### 1. ✅ **Pruebas Unitarias CSV**
- **Archivo:** `tests/csv-parser.test.js`
- **Propósito:** Validar parsing y conversión de archivos CSV
- **Comando:** `npm test`

### 2. ✅ **Pruebas de Conversiones**
- **Archivo:** `tests/validate-conversions.js`
- **Propósito:** Validar todas las herramientas de conversión
- **Uso:** Importar en página de herramientas

### 3. ✅ **Pruebas de Casos Extremos**
- **Archivo:** `tests/validate-format-edgecases.js`
- **Propósito:** Validar manejo de datos inválidos/extremes
- **Uso:** Importar en página de herramientas

### 4. ✅ **Debug YAML**
- **Archivo:** `tests/debug-yaml.js`
- **Propósito:** Debug y validación de parser YAML
- **Uso:** Abrir en navegador o importar

### 5. ✅ **Validación PWA Completa**
- **Archivo:** `tests/pwa-validation.js`
- **Propósito:** Validación completa PWA
- **Uso:** Ejecutar en consola del navegador

## 🚀 Cómo Ejecutar las Pruebas

### **Pruebas de Node.js (CSV)**

```bash
# Instalar dependencias de prueba
npm install

# Ejecutar pruebas
npm test

# Ver resultados detallados
npm test -- --verbose
```

### **Pruebas en Navegador**

1. **Abrir consola del navegador** (F12)
2. **Importar script de prueba:**

```javascript
// Para validación PWA completa
const script = document.createElement('script');
script.src = '/tests/pwa-validation.js';
document.head.appendChild(script);

// O ejecutar directamente en consola:
// fetch('/tests/pwa-validation.js').then(r => r.text()).then(eval);
```

3. **Funciones disponibles:**
   - `validatePWA()` - Validación completa PWA
   - `checkInstallPrompt()` - Verificar botón de instalación
   - `testManualInstall()` - Test de instalación manual
   - `clearPWACache()` - Limpiar cache PWA
   - `showDebugInfo()` - Info de debug
   - `main()` - Menú interactivo

### **Pruebas de Herramientas**

#### **Método 1: Import en Página**
```html
<!-- En tools-content/*.html -->
<script src="/tests/validate-conversions.js"></script>
```

#### **Método 2: Test Directo en Consola**
```javascript
// En consola del navegador
fetch('/tests/validate-conversions.js')
  .then(r => r.text())
  .then(code => eval(code));
```

## 📊 Cobertura de Pruebas

### **CSV Parser**
- ✅ Parsing de CSV válido
- ✅ Detección de delimitadores
- ✅ Manejo de comillas
- ✅ Líneas vacías
- ✅ Caracteres especiales
- ✅ Detección automática de formato

### **Conversiones**
- ✅ Base64 Encoding/Decoding
- ✅ JSON Formatter/Validator
- ✅ CSV ↔ JSON
- ✅ URL Encoder
- ✅ HTML Encoder
- ✅ YAML ↔ JSON
- ✅ TOML ↔ JSON
- ✅ XML ↔ JSON

### **Casos Extremos**
- ✅ Datos muy grandes (>1MB)
- ✅ Datos con caracteres especiales
- ✅ JSON inválido
- ✅ CSV malformado
- ✅ Strings vacíos/nulos
- ✅ Encoding UTF-8

### **PWA**
- ✅ Service Worker
- ✅ Web App Manifest
- ✅ Meta Tags PWA
- ✅ Cache Storage
- ✅ Iconos
- ✅ HTTPS
- ✅ Instalabilidad

## 🔧 Configuración de CI/CD

### **GitHub Actions (opcional)**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    - run: npm install
    - run: npm test
```

### **Husky Pre-commit (opcional)**
```bash
# Instalar husky
npm install --save-dev husky

# Configurar pre-commit
npx husky install
npx husky add .husky/pre-commit "npm test"
```

## 📈 Métricas de Calidad

### **Objetivos de Cobertura**
- ✅ **CSV Parser:** 100% funciones críticas
- ✅ **Conversiones:** 95%+ casos válidos
- ✅ **PWA:** 100% funcionalidades core
- ✅ **Casos Extremos:** 90%+ edge cases

### **Criterios de Éxito**
- ✅ Todos los tests unitarios pasan
- ✅ No hay errores en consola navegador
- ✅ PWA pasa validación 90%+
- ✅ Todas las conversiones funcionan
- ✅ Manejo correcto de errores

## 🐛 Debugging

### **Problemas Comunes**

#### **1. Tests CSV fallan**
```bash
# Verificar Node.js version
node --version

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### **2. PWA no se valida**
```javascript
// Limpiar cache y recargar
clearPWACache();

// Verificar HTTPS
console.log(location.protocol); // Debe ser 'https:'

// Verificar Service Worker
navigator.serviceWorker.getRegistration();
```

#### **3. Conversiones fallan**
```javascript
// Test manual de conversión
const result = base64Encode('Test');
console.log(base64Decode(result)); // Debe ser 'Test'
```

### **Logs de Debug**

#### **CSV Tests**
```javascript
// Activar logs detallados
process.env.VERBOSE = 'true';
npm test
```

#### **PWA Validation**
```javascript
// Debug completo PWA
showDebugInfo();
validatePWA();
```

## 📝 Automatización

### **Script de Validación Completa**
```bash
#!/bin/bash
# run-all-tests.sh

echo "🧪 Ejecutando todas las pruebas..."

# Tests Node.js
npm test

# Verificar estructura archivos
node -e "require('./tests/validate-conversions')"

# Validar PWA (requiere servidor)
echo "💡 Abre /tests/pwa-validation.js en el navegador"

echo "✅ Pruebas completadas"
```

### **Build de Producción con Tests**
```bash
# En package.json
"scripts": {
  "prebuild": "npm test",
  "build": "node generate-tools.js",
  "postbuild": "echo 'Build completado con tests'",
  "test": "node tests/csv-parser.test.js"
}
```

## 🎯 Próximos Tests a Agregar

### **Prioridad Alta**
- [ ] Tests de performance para archivos grandes
- [ ] Tests de accesibilidad (a11y)
- [ ] Tests de compatibilidad cross-browser
- [ ] Tests de carga bajo múltiples herramientas

### **Prioridad Media**
- [ ] Tests de UI/UX automatizados
- [ ] Tests de internacionalización
- [ ] Tests de theme (claro/oscuro)
- [ ] Tests de responsive design

### **Prioridad Baja**
- [ ] Tests de analytics
- [ ] Tests de A/B features
- [ ] Tests de SEO
- [ ] Tests de social media

## 💡 Tips y Mejores Prácticas

### **1. Desarrollo**
- ✅ Escribir tests antes o junto con el código
- ✅ Tests pequeños y específicos
- ✅ Nombres descriptivos para tests
- ✅ Cleanup después de cada test

### **2. Debugging**
- ✅ Usar `console.log` estratégicamente
- ✅ Verificar inputs antes de procesar
- ✅ Manejar errores graciosamente
- ✅ Validar outputs

### **3. PWA**
- ✅ Testear en modo incógnito
- ✅ Verificar en diferentes dispositivos
- ✅ Limpiar cache entre tests
- ✅ Validar en Chrome DevTools

## 🆘 Soporte

### **Errores Comunes**

#### **"Cannot find module"**
```bash
# Instalar dependencias
npm install

# Verificar rutas
ls -la tests/
```

#### **"Permission denied"**
```bash
# Dar permisos
chmod +x tests/*.js

# En Windows:
# Ejecutar como Administrador
```

#### **"CORS errors"**
- Servir archivos desde servidor HTTP, no file://
- Usar `npx serve` o `python -m http.server`

### **Contact**
- 📧 Issues: Crear issue en GitHub
- 💬 Discussions: Usar Discussions
- 📖 Docs: Este README y código fuente

---

## ✅ Checklist de Validación Pre-Release

- [ ] `npm test` pasa sin errores
- [ ] Todos los CSV tests pasan
- [ ] Validación PWA > 90%
- [ ] No hay errores en consola navegador
- [ ] Todas las conversiones funcionan
- [ ] Cache se limpia correctamente
- [ ] Service Worker se registra
- [ ] Manifest.json es válido
- [ ] Tests de casos extremos pasan
- [ ] Debug YAML muestra información correcta

**🎉 ¡QuickTools PWA listo para producción!**
