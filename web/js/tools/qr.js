// qr.js - Generador de QR usando qrcodejs (CDN)
const qrText = document.getElementById('qrText');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const sizeInput = document.getElementById('size');
const ecLevel = document.getElementById('ecLevel');
const quietZone = document.getElementById('quietZone');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const qrPreview = document.getElementById('qrPreview');
const msg = document.getElementById('msg');

let qrInstance = null;

function showMsg(text, isError = false) {
    msg.textContent = text;
    msg.style.color = isError ? 'crimson' : '';
}

function clearPreview() {
    qrPreview.innerHTML = 'Aquí aparecerá el QR';
    downloadBtn.disabled = true;
    copyBtn.disabled = true;
    qrInstance = null;
}

function generateQR() {
    const text = qrText.value.trim();
    if (!text) {
        showMsg('Introduce texto o URL para generar', true);
        return;
    }
    const size = Math.max(64, Math.min(2048, Number(sizeInput.value) || 256));
    const ec = ecLevel.value || 'M';
    const quiet = quietZone.checked ? 4 : 0;

    // Limpiar preview
    qrPreview.innerHTML = '';

    // qrcode.js crea un <canvas> o <img>
    try {
        qrInstance = new QRCode(qrPreview, {
            text: text,
            width: size,
            height: size,
            correctLevel: QRCode.CorrectLevel[ec],
            quietZone: quiet
        });

        // Habilitar botones de descarga y copia
        setTimeout(() => {
            // Buscar canvas dentro de preview
            const canvas = qrPreview.querySelector('canvas');
            const img = qrPreview.querySelector('img');
            if (canvas) {
                downloadBtn.disabled = false;
                copyBtn.disabled = false;
            } else if (img) {
                downloadBtn.disabled = false;
                copyBtn.disabled = false;
            } else {
                downloadBtn.disabled = true;
                copyBtn.disabled = true;
            }
            showMsg('QR generado');
        }, 80);
    } catch (e) {
        showMsg('Error al generar QR: ' + e.message, true);
    }
}

async function downloadPNG() {
    try {
        const canvas = qrPreview.querySelector('canvas');
        if (!canvas) { showMsg('No hay QR para descargar', true); return; }
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'qrcode.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        showMsg('Descargando PNG');
    } catch (e) {
        showMsg('Error al descargar: ' + e.message, true);
    }
}

async function copyImage() {
    try {
        const canvas = qrPreview.querySelector('canvas');
        if (!canvas) { showMsg('No hay QR para copiar', true); return; }
        // Convertir a blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        // Copiar al portapapeles (ClipboardItem)
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        showMsg('Imagen copiada al portapapeles');
    } catch (e) {
        // Fallback: copiar dataURL en texto
        try {
            const canvas = qrPreview.querySelector('canvas');
            const dataUrl = canvas.toDataURL('image/png');
            await navigator.clipboard.writeText(dataUrl);
            showMsg('Data URL copiada al portapapeles (fallback)');
        } catch (err) {
            showMsg('Error al copiar: ' + (e.message || err.message), true);
        }
    }
}

generateBtn?.addEventListener('click', generateQR);
downloadBtn?.addEventListener('click', downloadPNG);
copyBtn?.addEventListener('click', copyImage);
clearBtn?.addEventListener('click', clearPreview);

// Inicializar
clearPreview();
