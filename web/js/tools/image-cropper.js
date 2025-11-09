const imageInput = document.getElementById('image-input');
const imageToCrop = document.getElementById('image-to-crop');
const cropBtn = document.getElementById('crop-btn');
const outputDiv = document.getElementById('output');
const dropZone = document.getElementById('dropZone');

let cropper;

// Inicializar zona de drop
dropZone?.addEventListener('click', () => imageInput.click());

function handleFile(file) {
    if (!file) return;

    // Asignar el archivo al input para consistencia
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    imageInput.files = dataTransfer.files;

    dropZone.querySelector('.drop-message').textContent = `Imagen cargada: ${file.name}`;

    const reader = new FileReader();
    reader.onload = (e) => {
        imageToCrop.src = e.target.result;
        if (cropper) {
            cropper.destroy();
        }
        cropper = new Cropper(imageToCrop, {
            aspectRatio: NaN, // Free ratio
            viewMode: 1,
            autoCropArea: 0.8,
        });
        cropBtn.style.display = 'block';
        outputDiv.innerHTML = '';
    };
    reader.readAsDataURL(file);
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

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) handleFile(file);
});

cropBtn.addEventListener('click', () => {
    if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedImageURL = croppedCanvas.toDataURL('image/png'); // Default to PNG

        const downloadLink = document.createElement('a');
        downloadLink.href = croppedImageURL;
        downloadLink.download = 'cropped_image.png';
        downloadLink.classList.add('btn', 'btn-success', 'mt-2');
        downloadLink.textContent = 'Descargar Imagen Recortada';

        const previewImage = document.createElement('img');
        previewImage.src = croppedImageURL;
        previewImage.classList.add('img-fluid', 'mt-2');
        previewImage.style.maxWidth = '300px';

        outputDiv.innerHTML = '';
        outputDiv.appendChild(previewImage);
        outputDiv.appendChild(document.createElement('br'));
        outputDiv.appendChild(downloadLink);
    }
});
