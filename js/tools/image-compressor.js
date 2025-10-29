// js/tools/image-compressor.js - Compresor de Imágenes

const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('imageInput');
const qualityRange = document.getElementById('qualityRange');
const qualityValue = document.getElementById('qualityValue');
const compressBtn = document.getElementById('compressBtn');
const downloadBtn = document.getElementById('downloadBtn');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const msg = document.getElementById('msg');

let originalFile = null;
let compressedBlob = null;

function showMsg(text, isError = false) {
    msg.textContent = text;
    msg.style.color = isError ? 'crimson' : '';
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        showMsg('Por favor, arrastra o selecciona un archivo de imagen válido.', true);
        return;
    }

    originalFile = file;
    showMsg(`Imagen cargada: ${file.name} (${formatBytes(file.size)})`);

    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        originalSize.textContent = formatBytes(file.size);
        compressBtn.disabled = false;
        downloadBtn.disabled = true;
        compressedPreview.src = '';
        compressedSize.textContent = 'N/A';
    };
    reader.readAsDataURL(file);
}

dropZone.addEventListener('click', () => imageInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('hover');
});
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('hover');
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('hover');
    handleFile(e.dataTransfer.files[0]);
});
imageInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

qualityRange.addEventListener('input', () => {
    qualityValue.textContent = qualityRange.value;
    if (originalFile) {
        compressBtn.disabled = false; // Re-habilitar para permitir nueva compresión
    }
});

compressBtn.addEventListener('click', () => {
    if (!originalFile) {
        showMsg('Primero, carga una imagen.', true);
        return;
    }

    showMsg('Comprimiendo imagen...');
    compressBtn.disabled = true;
    downloadBtn.disabled = true;

    new Compressor(originalFile, {
        quality: Number(qualityRange.value) / 100,
        success(result) {
            compressedBlob = result;
            const reader = new FileReader();
            reader.onload = (e) => {
                compressedPreview.src = e.target.result;
                compressedSize.textContent = formatBytes(compressedBlob.size);
                downloadBtn.disabled = false;
                showMsg(`Imagen comprimida. Reducción: ${((1 - compressedBlob.size / originalFile.size) * 100).toFixed(2)}%`);
            };
            reader.readAsDataURL(compressedBlob);
        },
        error(err) {
            showMsg('Error al comprimir la imagen: ' + err.message, true);
            compressBtn.disabled = false;
        },
    });
});

downloadBtn.addEventListener('click', () => {
    if (!compressedBlob) {
        showMsg('Primero, comprime una imagen.', true);
        return;
    }
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-${originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMsg('Imagen descargada.');
});
