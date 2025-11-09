const pdfInput = document.getElementById('pdf-input');
const formatSelect = document.getElementById('format-select');
const convertBtn = document.getElementById('convert-btn');
const outputDiv = document.getElementById('output');
const dropZone = document.getElementById('dropZone');

pdfjsLib.GlobalWorkerOptions.workerSrc = '../../js/vendor/pdf.worker.js';

// Inicializar zona de drop
dropZone?.addEventListener('click', () => pdfInput.click());

function handleFile(file) {
    if (!file) return;
    pdfInput.files = new DataTransfer().files;
    pdfInput.files = file ? new DataTransfer().files = [file] : new DataTransfer().files;
    dropZone.querySelector('.drop-message').textContent = `Archivo cargado: ${file.name}`;
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

convertBtn.addEventListener('click', async () => {
    if (!pdfInput.files.length) {
        alert('Por favor, selecciona un archivo PDF.');
        return;
    }

    outputDiv.innerHTML = '<p>Procesando... esto puede tardar un momento.</p>';

    try {
        const pdfBytes = await pdfInput.files[0].arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;

        const numPages = pdfDoc.numPages;
        outputDiv.innerHTML = '';

        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;

            const imageUrl = canvas.toDataURL(formatSelect.value);
            const imageName = `page_${i}.${formatSelect.value.split('/')[1]}`;

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('mb-3');
            imageContainer.innerHTML = `
                <p>${imageName}</p>
                <img src="${imageUrl}" class="img-fluid mb-2">
                <a href="${imageUrl}" download="${imageName}" class="btn btn-secondary">Descargar</a>
            `;
            outputDiv.appendChild(imageContainer);
        }

    } catch (error) {
        console.error('Error al convertir el PDF:', error);
        outputDiv.innerHTML = '<p>Ocurrió un error al convertir el PDF.</p>';
    }
});
