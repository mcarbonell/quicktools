const pdfInput = document.getElementById('pdf-input');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const mergeBtn = document.getElementById('merge-btn');
const outputDiv = document.getElementById('output');
const dropZone = document.getElementById('dropZone');

// Inicializar zona de drop
dropZone?.addEventListener('click', () => pdfInput.click());

function handleFiles(files) {
    if (files.length === 0) return;
    pdfInput.files = files;
    dropZone.querySelector('.drop-message').textContent = `${files.length} archivo(s) seleccionado(s)`;
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

pdfInput.addEventListener('change', (e) => {
    if (e.target.files) handleFiles(e.target.files);
});

mergeBtn.addEventListener('click', async () => {
    if (pdfInput.files.length < 2) {
        alert('Por favor, selecciona al menos dos archivos PDF.');
        return;
    }

    outputDiv.innerHTML = '<p>Procesando...</p>';

    try {
        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of Array.from(pdfInput.files)) {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }

        const mergedPdfBytes = await mergedPdf.save();

        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        outputDiv.innerHTML = `<a href="${url}" download="merged.pdf">Descargar PDF unido</a>`;
    } catch (error) {
        console.error('Error al unir los PDFs:', error);
        outputDiv.innerHTML = '<p>Ocurrió un error al unir los PDFs. Por favor, inténtalo de nuevo.</p>';
    }
});