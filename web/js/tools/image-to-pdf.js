const imageInput = document.getElementById('image-input');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const pageSizeSelect = document.getElementById('page-size-select');
const orientationSelect = document.getElementById('orientation-select');
const convertBtn = document.getElementById('convert-btn');
const outputDiv = document.getElementById('output');
const dropZone = document.getElementById('dropZone');

// Inicializar zona de drop
dropZone?.addEventListener('click', () => imageInput.click());

function handleFiles(files) {
    if (files.length === 0) return;
    imageInput.files = files;
    const filesMsg = (t.filesSelected || '{count} archivo(s) seleccionado(s)').replace('{count}', files.length); dropZone.querySelector('.drop-message').textContent = filesMsg;
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
    const files = e.dataTransfer?.files;
    if (files) handleFiles(files);
});

imageInput.addEventListener('change', (e) => {
    if (e.target.files) handleFiles(e.target.files);
});

convertBtn.addEventListener('click', async () => {
    if (!imageInput.files.length) {
        alert(t.selectAtLeastOneImage || 'Por favor, selecciona al menos una imagen.');
        return;
    }

    outputDiv.innerHTML = `<p>${t.processingMayTakeTime || 'Procesando... esto puede tardar un momento.'}</p>`;

    try {
        const pdfDoc = await PDFLib.PDFDocument.create();

        for (const file of Array.from(imageInput.files)) {
            const imgBytes = await file.arrayBuffer();
            let img;
            if (file.type === 'image/jpeg') {
                img = await pdfDoc.embedJpg(imgBytes);
            } else if (file.type === 'image/png') {
                img = await pdfDoc.embedPng(imgBytes);
            } else {
                continue; // Skip unsupported image types
            }

            const { width, height } = img.scale(1);

            let pageWidth, pageHeight;
            if (pageSizeSelect.value === 'A4') {
                pageWidth = PDFLib.PageSizes.A4[0];
                pageHeight = PDFLib.PageSizes.A4[1];
            } else if (pageSizeSelect.value === 'Letter') {
                pageWidth = PDFLib.PageSizes.Letter[0];
                pageHeight = PDFLib.PageSizes.Letter[1];
            }

            if (orientationSelect.value === 'landscape') {
                [pageWidth, pageHeight] = [pageHeight, pageWidth];
            }

            const page = pdfDoc.addPage([pageWidth, pageHeight]);

            // Calculate scaling to fit image within page while maintaining aspect ratio
            const scaleFactor = Math.min(pageWidth / width, pageHeight / height);
            const scaledWidth = width * scaleFactor;
            const scaledHeight = height * scaleFactor;

            // Center the image on the page
            const x = (pageWidth - scaledWidth) / 2;
            const y = (pageHeight - scaledHeight) / 2;

            page.drawImage(img, {
                x,
                y,
                width: scaledWidth,
                height: scaledHeight,
            });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        outputDiv.innerHTML = `<a href="${url}" download="converted.pdf">${t.downloadPdf || 'Descargar PDF'}</a>`;

    } catch (error) {
        console.error((t.errorConvertingImageToPdf || 'Error al convertir imagen a PDF:'), error);
        outputDiv.innerHTML = `<p>${t.errorConvertingImageGeneric || 'Ocurrió un error al convertir la imagen a PDF. Asegúrate de que los archivos son imágenes válidas.'}</p>`;
    }
});
