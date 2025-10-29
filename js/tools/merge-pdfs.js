const pdfInput = document.getElementById('pdf-input');
const mergeBtn = document.getElementById('merge-btn');
const outputDiv = document.getElementById('output');

mergeBtn.addEventListener('click', async () => {
    if (pdfInput.files.length < 2) {
        alert('Por favor, selecciona al menos dos archivos PDF.');
        return;
    }

    outputDiv.innerHTML = '<p>Procesando...</p>';

    try {
        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of pdfInput.files) {
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