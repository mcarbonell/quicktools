const pdfInput = document.getElementById('pdf-input');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const pagesInput = document.getElementById('pages-input');
const splitBtn = document.getElementById('split-btn');
const outputDiv = document.getElementById('output');
const dropZone = document.getElementById('dropZone');

// Inicializar zona de drop
dropZone?.addEventListener('click', () => pdfInput.click());

function handleFile(file) {
    if (!file) return;

    // Create a new FileList object and assign it to the input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    pdfInput.files = dataTransfer.files;

    const fileMsg = (t.fileLoaded || 'Archivo cargado: {filename}').replace('{filename}', file.name); dropZone.querySelector('.drop-message').textContent = fileMsg;
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

pdfInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleFile(file);
});

splitBtn.addEventListener('click', async () => {
    if (!pdfInput.files.length) {
        alert(t.selectPdfFile || 'Por favor, selecciona un archivo PDF.');
        return;
    }

    if (!pagesInput.value) {
        alert(t.specifyPages || 'Por favor, especifica las páginas a extraer.');
        return;
    }

    outputDiv.innerHTML = `<p>${t.processingText || 'Procesando...'}</p>`;

    try {
        const pdfBytes = await pdfInput.files[0].arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
        const pageRanges = parsePageRanges(pagesInput.value, pdfDoc.getPageCount());

        if (!pageRanges.length) {
            alert(t.invalidPages || 'Las páginas especificadas no son válidas.');
            outputDiv.innerHTML = '';
            return;
        }

        const newPdf = await PDFLib.PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pageRanges.map(p => p - 1));
        copiedPages.forEach(page => newPdf.addPage(page));

        const newPdfBytes = await newPdf.save();
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        outputDiv.innerHTML = `<a href="${url}" download="split.pdf">${t.downloadSplitPdf || 'Descargar PDF dividido'}</a>`;

    } catch (error) {
        console.error((t.errorSplittingPdf || 'Error al dividir el PDF:'), error);
        outputDiv.innerHTML = `<p>${t.errorSplittingGeneric || 'Ocurrió un error al dividir el PDF. Por favor, inténtalo de nuevo.'}</p>`;
    }
});

function parsePageRanges(rangeStr, maxPage) {
    const ranges = rangeStr.split(',');
    const pages = new Set();

    for (const range of ranges) {
        const trimmedRange = range.trim();
        if (trimmedRange.includes('-')) {
            const [start, end] = trimmedRange.split('-').map(p => parseInt(p, 10));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    if (i > 0 && i <= maxPage) {
                        pages.add(i);
                    }
                }
            }
        } else {
            const page = parseInt(trimmedRange, 10);
            if (!isNaN(page) && page > 0 && page <= maxPage) {
                pages.add(page);
            }
        }
    }

    return Array.from(pages).sort((a, b) => a - b);
}
