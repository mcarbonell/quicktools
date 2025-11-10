const imageInput = document.getElementById('image-input');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const exifDataPre = document.getElementById('exif-data');
const cleanExifBtn = document.getElementById('clean-exif-btn');
const cleanedImageOutput = document.getElementById('cleaned-image-output');
const cleanedImagePreview = document.getElementById('cleaned-image-preview');
const downloadCleanedImage = document.getElementById('download-cleaned-image');
const dropZone = document.getElementById('dropZone');

// Inicializar zona de drop
dropZone?.addEventListener('click', () => imageInput.click());

function handleFile(file) {
    if (!file) return;

    // Create a new FileList object and assign it to the input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    imageInput.files = dataTransfer.files;

    const imgMsg = (t.imageLoaded || 'Imagen cargada: {filename}').replace('{filename}', file.name); dropZone.querySelector('.drop-message').textContent = imgMsg;

    try {
        exifr.parse(file).then(exif => {
            if (exif) {
                exifDataPre.textContent = JSON.stringify(exif, null, 2);
                cleanExifBtn.style.display = 'block';
            } else {
                exifDataPre.textContent = t.noExifFound || 'No se encontraron metadatos EXIF.';
                cleanExifBtn.style.display = 'none';
            }
            cleanedImageOutput.style.display = 'none';
        }).catch(error => {
            console.error((t.errorReadingExif || 'Error al leer metadatos EXIF:'), error);
            exifDataPre.textContent = t.errorReadingExifGeneric || 'Error al leer metadatos EXIF.';
            cleanExifBtn.style.display = 'none';
            cleanedImageOutput.style.display = 'none';
        });
    } catch (error) {
        console.error((t.errorReadingExif || 'Error al leer metadatos EXIF:'), error);
        exifDataPre.textContent = t.errorReadingExifGeneric || 'Error al leer metadatos EXIF.';
        cleanExifBtn.style.display = 'none';
        cleanedImageOutput.style.display = 'none';
    }
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

imageInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) handleFile(file);
});

cleanExifBtn.addEventListener('click', async () => {
    const file = imageInput.files[0];
    if (!file) return;

    try {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Export as PNG to ensure no EXIF data is carried over
                const cleanedDataUrl = canvas.toDataURL('image/png');
                cleanedImagePreview.src = cleanedDataUrl;
                downloadCleanedImage.href = cleanedDataUrl;
                downloadCleanedImage.download = `cleaned_${file.name.split('.')[0]}.png`;
                cleanedImageOutput.style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

    } catch (error) {
        console.error((t.errorCleaningExif || 'Error al limpiar metadatos EXIF:'), error);
        cleanedImageOutput.style.display = 'none';
        alert(t.errorCleaningExifGeneric || 'Ocurrió un error al limpiar los metadatos EXIF.');
    }
});
