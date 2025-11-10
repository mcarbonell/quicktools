# 🚀 Guía de Deploy a Vercel - FastTools

## 📋 Pasos para Deploy

### 1. Preparar Repositorio GitHub

```bash
# Asegúrate de que todo está commiteado
git status

# Si hay cambios pendientes
git add .
git commit -m "Prepare for Vercel deploy - FastTools rebrand"
git push origin main
```

### 2. Crear Cuenta en Vercel

1. Ir a https://vercel.com
2. Click en "Sign Up"
3. Elegir "Continue with GitHub"
4. Autorizar Vercel en GitHub

### 3. Importar Proyecto

1. En Vercel Dashboard, click "Add New..." → "Project"
2. Buscar repositorio: `fasttools` (o el nombre de tu repo)
3. Click "Import"

### 4. Configurar Build Settings

Vercel debería detectar automáticamente la configuración desde `vercel.json`, pero verifica:

```
Framework Preset: Other
Build Command: npm run build
Output Directory: web
Install Command: npm install
```

### 5. Variables de Entorno (Opcional)

Si necesitas variables de entorno:
```
Environment Variables:
(ninguna necesaria por ahora)
```

### 6. Deploy

1. Click "Deploy"
2. Esperar 1-2 minutos
3. ¡Sitio desplegado! 🎉

URL temporal: `https://fasttools-xxx.vercel.app`

### 7. Configurar Custom Domain

#### En Vercel:
1. Ir a Project Settings → Domains
2. Click "Add Domain"
3. Escribir: `fasttools.tools`
4. Click "Add"
5. Vercel mostrará los registros DNS necesarios

#### En Namecheap:
1. Ir a https://www.namecheap.com
2. Dashboard → Domain List
3. Click "Manage" en `fasttools.tools`
4. Ir a "Advanced DNS"
5. Añadir registros DNS de Vercel:

**Registros DNS a añadir:**

```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

**Nota:** Los valores exactos los proporciona Vercel en el paso anterior.

### 8. Verificar Domain

1. Volver a Vercel → Domains
2. Click "Verify" en `fasttools.tools`
3. Esperar propagación DNS (5-60 minutos)
4. ✅ Domain verificado

### 9. Configurar SSL

- ✅ Automático con Vercel
- SSL certificate se genera automáticamente
- HTTPS forzado por defecto

### 10. Configurar Redirects

Añadir redirect de www a apex (ya configurado en `vercel.json`):
- `www.fasttools.tools` → `fasttools.tools`

## ✅ Checklist Post-Deploy

```
□ Sitio accesible en fasttools.tools
□ HTTPS funcionando
□ www redirect funcionando
□ Service Worker cargando
□ Todas las herramientas funcionan
□ Cambio de idioma funciona
□ PWA instalable
□ Lighthouse score > 90
```

## 🔧 Comandos Útiles

### Deploy desde CLI (Opcional)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Regenerar Build

```bash
# Local
npm run build

# Vercel (automático en cada push)
git push origin main
```

## 📊 Monitoreo

### Vercel Analytics (Gratis)

1. Ir a Project → Analytics
2. Ver métricas en tiempo real:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Vercel Logs

1. Ir a Project → Deployments
2. Click en deployment
3. Ver logs de build y runtime

## 🐛 Troubleshooting

### Build Falla

```bash
# Verificar local
npm run build

# Ver logs en Vercel
Project → Deployments → [deployment] → Build Logs
```

### Domain No Verifica

1. Verificar DNS propagación: https://dnschecker.org
2. Esperar hasta 48h (normalmente 5-60 min)
3. Verificar registros DNS en Namecheap

### Service Worker No Funciona

1. Verificar headers en `vercel.json`
2. Forzar HTTPS
3. Clear cache del navegador

## 🎯 Próximos Pasos

Después del deploy:

1. ✅ Verificar sitio en producción
2. ✅ Test todas las herramientas
3. ✅ Configurar Google Analytics
4. ✅ Configurar Google Search Console
5. ✅ Submit sitemap.xml

## 📝 Notas

- **Builds automáticos**: Cada push a `main` despliega automáticamente
- **Preview deployments**: Cada PR crea un preview deployment
- **Rollback**: Puedes volver a cualquier deployment anterior
- **Bandwidth**: 100GB/mes gratis (más que suficiente)
- **Build time**: ~1-2 minutos por deploy

---

**Creado:** Enero 2025  
**Última actualización:** Enero 2025  
**Estado:** ✅ Listo para deploy
