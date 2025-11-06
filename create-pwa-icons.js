// create-pwa-icons.js - Generador simple de iconos PWA
// No requiere dependencias externas
// Ejecutar: node create-pwa-icons.js

const fs = require('fs').promises;
const path = require('path');

// Generar un icono PNG simple usando datos base64 (1x1 pixel azul repetido)
const createSimplePNG = (width, height, r = 13, g = 110, b = 253) => {
    // PNG header
    const pngHeader = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
    ]);

    // IHDR chunk (Image header)
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0); // Width
    ihdrData.writeUInt32BE(height, 4); // Height
    ihdrData[8] = 8; // Bit depth
    ihdrData[9] = 2; // Color type (RGB)
    ihdrData[10] = 0; // Compression
    ihdrData[11] = 0; // Filter
    ihdrData[12] = 0; // Interlace

    const ihdr = createChunk('IHDR', ihdrData);

    // IDAT chunk (Image data) - Color sólido
    const imageData = Buffer.alloc((width * height * 3) + height); // RGB + filter bytes

    for (let y = 0; y < height; y++) {
        imageData[y * (width * 3 + 1)] = 0; // Filter type 0 (None)

        for (let x = 0; x < width; x++) {
            const offset = y * (width * 3 + 1) + 1 + (x * 3);
            imageData[offset] = r;     // R
            imageData[offset + 1] = g; // G
            imageData[offset + 2] = b; // B
        }
    }

    const compressedData = require('zlib').deflateSync(imageData);
    const idat = createChunk('IDAT', compressedData);

    // IEND chunk (Image end)
    const iend = createChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([pngHeader, ihdr, idat, iend]);
};

// Crear chunk PNG
const createChunk = (type, data) => {
    const typeBuffer = Buffer.from(type);
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32BE(data.length, 0);

    // CRC32
    const crc = require('crypto').createHash('crc32');
    crc.update(typeBuffer);
    crc.update(data);
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc.digest().readUInt32BE(0), 0);

    return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer]);
};

// Generar SVG iconos como alternativa
const createSVGIcon = (size) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d6efd;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0056b3;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="url(#grad)" stroke="#ffffff" stroke-width="${size * 0.02}"/>
  <text x="${size / 2}" y="${size / 2 + size * 0.05}" font-family="Arial, sans-serif" font-size="${size * 0.25}" font-weight="bold" text-anchor="middle" fill="white">QT</text>
  <g transform="translate(${size / 2 - size * 0.08}, ${size / 2 - size * 0.08})">
    <rect x="0" y="0" width="${size * 0.16}" height="${size * 0.35}" fill="white" rx="${size * 0.01}"/>
    <rect x="${size * 0.035}" y="${size * 0.035}" width="${size * 0.35}" height="${size * 0.16}" fill="white" rx="${size * 0.01}"/>
  </g>
</svg>`;
};

async function createPWAIcons() {
    const iconDir = path.join(__dirname, 'icons');

    try {
        // Crear directorio de iconos
        await fs.mkdir(iconDir, { recursive: true });

        // Tamaños requeridos por el manifest
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

        console.log('🎨 Generando iconos PWA...');

        for (const size of sizes) {
            try {
                // Intentar crear PNG
                const pngBuffer = createSimplePNG(size, size);
                await fs.writeFile(path.join(iconDir, `icon-${size}x${size}.png`), pngBuffer);
                console.log(`✅ PNG creado: icon-${size}x${size}.png`);
            } catch (error) {
                // Si falla PNG, crear SVG
                const svgContent = createSVGIcon(size);
                await fs.writeFile(path.join(iconDir, `icon-${size}x${size}.svg`), svgContent);
                console.log(`✅ SVG creado: icon-${size}x${size}.svg`);
            }
        }

        // Crear también iconos .png referencias en manifest usando SVG-to-PNG conversion simple
        console.log('\n📝 Para iconos PNG reales, considera:');
        console.log('1. Usar una herramienta online como favicon.io');
        console.log('2. O instalar: npm install canvas y usar create-icons.js');
        console.log('3. Por ahora, los SVG funcionan para PWA');

    } catch (error) {
        console.error('❌ Error generando iconos:', error.message);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    createPWAIcons();
}

module.exports = { createPWAIcons };
