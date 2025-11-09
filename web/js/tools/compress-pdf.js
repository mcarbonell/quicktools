const pdfInput = document.getElementById('pdf-input');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const qualityInput = document.getElementById('quality-input');
const compressBtn = document.getElementById('compress-btn');
const outputDiv = document.getElementById('output');
const dropZone = document.getElementById('dropZone');

// Handle file selection
function handleFile(file) {
    if (file) {
        // Create a new FileList object and assign it to the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        pdfInput.files = dataTransfer.files;

        // Update the drop zone message
        dropZone.querySelector('.drop-message').textContent = `Archivo seleccionado: ${file.name}`;
    }
}

// Event listeners for drag and drop
dropZone.addEventListener('click', () => pdfInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

// Event listener for file input change
pdfInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
});


compressBtn.addEventListener('click', async () => {
    if (!pdfInput.files.length) {
        alert('Por favor, selecciona un archivo PDF.');
        return;
    }

    outputDiv.innerHTML = '<p>Procesando... esto puede tardar un momento.</p>';

    try {
        const pdfBytes = await pdfInput.files[0].arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

        const newPdfDoc = await PDFLib.PDFDocument.create();

        const pages = pdfDoc.getPages();
        for (let i = 0; i < pages.length; i++) {
            const [page] = await newPdfDoc.copyPages(pdfDoc, [i]);
            const {
                width,
                height
            } = page.getSize();

            const images = page.getImages();
            if (images.length > 0) {
                for (const image of images) {
                    const imageUrl = await image.toDataUrl();
                    const compressedImage = await new Promise((resolve, reject) => {
                        new Compressor(dataURLtoBlob(imageUrl), {
                            quality: parseFloat(qualityInput.value),
                            success: (result) => {
                                const reader = new FileReader();
                                reader.readAsDataURL(result);
                                reader.onloadend = () => {
                                    resolve(reader.result);
                                };
                            },
                            error: (err) => {
                                reject(err);
                            },
                        });
                    });

                    const embeddedImage = await newPdfDoc.embedPng(compressedImage);
                    page.drawImage(embeddedImage, {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                    });
                }
            }
            newPdfDoc.addPage(page);
        }

        const newPdfBytes = await newPdfDoc.save();
        const blob = new Blob([newPdfBytes], {
            type: 'application/pdf'
        });
        const url = URL.createObjectURL(blob);

        const oldSize = (pdfInput.files[0].size / 1024 / 1024).toFixed(2);
        const newSize = (blob.size / 1024 / 1024).toFixed(2);

        outputDiv.innerHTML = `
            <p>Compresión completada.</p>
            <p>Tamaño original: ${oldSize} MB</p>
            <p>Tamaño nuevo: ${newSize} MB</p>
            <a href="${url}" download="compressed.pdf">Descargar PDF comprimido</a>
        `;

    } catch (error) {
        console.error('Error al comprimir el PDF:', error);
        outputDiv.innerHTML = '<p>Ocurrió un error al comprimir el PDF. Es posible que este PDF no se pueda comprimir.</p>';
    }
});

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}