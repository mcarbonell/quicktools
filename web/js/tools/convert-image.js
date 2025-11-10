const fileInputCI = document.getElementById('fileInput');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const formatSelect = document.getElementById('formatSelect');
const convertBtn = document.getElementById('convertBtn');
const previewCanvasCI = document.getElementById('previewCanvas');
const dropZoneCI = document.getElementById('dropZone');
const ctxCI = previewCanvasCI?.getContext('2d');

let imgCI = null;

// Inicializar zona de drop
dropZoneCI?.addEventListener('click', () => fileInputCI.click());

function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert(t.selectValidImage || 'Por favor selecciona un archivo de imagen válido.');
        return;
    }
    const im = new Image();
    im.onload = () => {
        imgCI = im;
        previewCanvasCI.width = im.width;
        previewCanvasCI.height = im.height;
        ctxCI.clearRect(0, 0, previewCanvasCI.width, previewCanvasCI.height);
        ctxCI.drawImage(im, 0, 0);
        const imgMsg = (t.imageLoaded || 'Imagen cargada: {filename}').replace('{filename}', file.name); dropZoneCI.querySelector('.drop-message').textContent = imgMsg;
    };
    im.src = URL.createObjectURL(file);
}

// Eventos de drag & drop
dropZoneCI?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZoneCI.classList.add('drag-over');
});

dropZoneCI?.addEventListener('dragleave', () => {
    dropZoneCI.classList.remove('drag-over');
});

dropZoneCI?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZoneCI.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file) handleImageFile(file);
});

fileInputCI?.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleImageFile(file);
});

convertBtn?.addEventListener('click', () => {
    if (!imgCI) return alert(t.uploadImageFirst || 'Sube primero una imagen.');
    const mime = formatSelect.value || 'image/png';
    const off = document.createElement('canvas');
    off.width = imgCI.width;
    off.height = imgCI.height;
    const octx = off.getContext('2d');
    octx.drawImage(imgCI, 0, 0);
    let quality = mime === 'image/jpeg' ? 0.92 : 0.92;
    off.toBlob((blob) => {
        const a = document.createElement('a');
        const ext = mime.split('/')[1].replace('jpeg', 'jpg');
        a.href = URL.createObjectURL(blob);
        a.download = `converted.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }, mime, quality);
});
