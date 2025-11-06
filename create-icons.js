// create-icons.js - Generador de iconos para PWA
// Requiere: npm install canvas
// Ejecutar: node create-icons.js

const fs = require('fs').promises;
const path = require('path');

async function createIcons() {
    // Intentar cargar canvas, si no está disponible, crear archivos de placeholder
    let canvas, Image;

    try {
        ({ createCanvas, loadImage } = require('canvas'));
        canvas = createCanvas;
        Image = loadImage;
        console.log('✅ Canvas disponible, generando iconos reales...');
    } catch (error) {
        console.log('⚠️ Canvas no disponible, creando placeholders...');
        await createIconPlaceholders();
        return;
    }

    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const iconDir = path.join(__dirname, 'icons');

    // Asegurar que el directorio existe
    await fs.mkdir(iconDir, { recursive: true });

    for (const size of sizes) {
        await createIcon(size, iconDir);
    }

    console.log('✅ Iconos generados exitosamente!');
}

async function createIcon(size, iconDir) {
    try {
        const { createCanvas, loadImage } = require('canvas');

        // Crear canvas
        const c = createCanvas(size, size);
        const ctx = c.getContext('2d');

        // Fondo degradado (QuickTools blue)
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, '#0d6efd');
        gradient.addColorStop(1, '#0056b3');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        // Borde redondeado
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(2, size * 0.02);
        ctx.strokeRect(size * 0.05, size * 0.05, size * 0.9, size * 0.9);

        // Icono tipo "herramientas" simple
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(3, size * 0.03);

        // Círculo central
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.25;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();

        // "Herramientas" cruzadas (rectángulos)
        const toolWidth = size * 0.15;
        const toolHeight = size * 0.4;

        // Herramienta 1 (horizontal)
        ctx.fillRect(centerX - toolWidth / 2, centerY - toolHeight / 2, toolWidth, toolHeight);

        // Herramienta 2 (vertical)
        ctx.fillRect(centerX - toolHeight / 2, centerY - toolWidth / 2, toolHeight, toolWidth);

        // Texto "QT" pequeño para tamaños grandes
        if (size >= 128) {
            ctx.fillStyle = '#0d6efd';
            ctx.font = `${size * 0.15}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('QT', centerX, centerY + size * 0.1);
        }

        // Guardar como PNG
        const buffer = c.toBuffer('image/png');
        await fs.writeFile(path.join(iconDir, `icon-${size}x${size}.png`), buffer);

        console.log(`✅ Creado: icon-${size}x${size}.png`);

    } catch (error) {
        console.log(`❌ Error creando icono ${size}x${size}:`, error.message);
    }
}

async function createIconPlaceholders() {
    // Crear archivos SVG simples como placeholders
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const iconDir = path.join(__dirname, 'icons');

    await fs.mkdir(iconDir, { recursive: true });

    for (const size of sizes) {
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d6efd;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0056b3;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="url(#grad)" stroke="#ffffff" stroke-width="${size * 0.02}"/>
  <text x="${size / 2}" y="${size / 2 + size * 0.05}" font-family="Arial" font-size="${size * 0.3}" font-weight="bold" text-anchor="middle" fill="white">QT</text>
</svg>`;

        await fs.writeFile(path.join(iconDir, `icon-${size}x${size}.svg`), svgContent);
        console.log(`✅ Creado placeholder: icon-${size}x${size}.svg`);
    }

    console.log('📝 Placeholders SVG creados. Para iconos reales, instala canvas: npm install canvas');
}

// Ejecutar
if (require.main === module) {
    createIcons().catch(console.error);
}

module.exports = { createIcons };
