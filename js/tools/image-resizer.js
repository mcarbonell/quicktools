// image-resizer.js
const fileInput = document.getElementById('fileInput');
const widthInput = document.getElementById('widthInput');
const resizeBtn = document.getElementById('resizeBtn');
const keepRatio = document.getElementById('keepRatio');
const previewCanvas = document.getElementById('previewCanvas');
const dropZone = document.getElementById('dropZone');
const ctx = previewCanvas.getContext('2d');

// Inicializar zona de drop
dropZone?.addEventListener('click', () => fileInput.click());

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
    }
    const img = new Image();
    img.onload = () => {
        currentImage = img;
        previewCanvas.width = img.width;
        previewCanvas.height = img.height;
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        ctx.drawImage(img, 0, 0);
        widthInput.value = img.width;
        dropZone.querySelector('.drop-message').textContent = `Imagen cargada: ${file.name}`;
    };
    img.src = URL.createObjectURL(file);
}

// Eventos de drag & drop
dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone?.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
});

let currentImage = null;

fileInput?.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleFile(file);
});

resizeBtn?.addEventListener('click', async () => {
    if (!currentImage) return alert('Sube primero una imagen.');
    let targetW = parseInt(widthInput.value, 10);
    if (!targetW || targetW <= 0) return alert('Ancho inválido');
    let targetH = currentImage.height * (targetW / currentImage.width);
    const off = document.createElement('canvas');
    off.width = targetW;
    off.height = keepRatio.checked ? Math.round(targetH) : (currentImage.height);
    const offCtx = off.getContext('2d');
    offCtx.drawImage(currentImage, 0, 0, off.width, off.height);

    // Actualizar vista previa
    previewCanvas.width = off.width;
    previewCanvas.height = off.height;
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.drawImage(off, 0, 0);

    // Descargar
    off.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'resized.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }, 'image/png');
});
