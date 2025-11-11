# ✅ Deploy Checklist - FastTools

## Pre-Deploy

```
✅ Dominio registrado: fasttools.tools
✅ Código actualizado con FastTools
✅ vercel.json creado
✅ .vercelignore creado
✅ robots.txt creado
□ Commit y push a GitHub
```

## Deploy a Vercel

```
□ Crear cuenta Vercel (https://vercel.com)
□ Conectar con GitHub
□ Importar proyecto fasttools
□ Verificar build settings:
  - Build Command: npm run build
  - Output Directory: web
□ Click Deploy
□ Esperar build (1-2 min)
□ Verificar URL temporal funciona
```

## Configurar Custom Domain

```
□ En Vercel: Add Domain → fasttools.tools
□ Copiar registros DNS de Vercel
□ En Namecheap: Advanced DNS
□ Añadir A Record: @ → 76.76.21.21
□ Añadir CNAME: www → cname.vercel-dns.com
□ Esperar propagación (5-60 min)
□ Verificar domain en Vercel
□ SSL automático activado
```

## Post-Deploy Testing

```
□ Abrir https://fasttools.tools
□ Verificar HTTPS funciona
□ Test 5 herramientas aleatorias
□ Test cambio de idioma EN/ES
□ Test en móvil
□ Verificar Service Worker
□ Test PWA instalable
□ Lighthouse audit > 90
```

## Configuración Adicional

```
□ Google Analytics (siguiente paso)
□ Google Search Console
□ Submit sitemap.xml
□ Verificar en dnschecker.org
```

## URLs Importantes

- **Producción**: https://fasttools.tools
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Namecheap DNS**: https://www.namecheap.com
- **DNS Checker**: https://dnschecker.org

---

**Fecha**: Noviembre 2025  
**Estado**: Listo para deploy
