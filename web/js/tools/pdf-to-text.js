// pdf-to-text.js
const pdfInput = document.getElementById('pdfInput');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const extractBtn = document.getElementById('extractBtn');
const pdfText = document.getElementById('pdfText');
const copyBtn = document.getElementById('copyBtn');
const dropZonePDF = document.getElementById('dropZone');

// Inicializar zona de drop
dropZonePDF?.addEventListener('click', () => pdfInput.click());

// Eventos de drag & drop
dropZonePDF?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZonePDF.classList.add('drag-over');
});

dropZonePDF?.addEventListener('dragleave', () => {
    dropZonePDF.classList.remove('drag-over');
});

dropZonePDF?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZonePDF.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file?.type === 'application/pdf') {
        pdfInput.files = e.dataTransfer.files;
        const pdfMsg = (t.pdfLoaded || 'PDF cargado: {filename}').replace('{filename}', file.name); dropZonePDF.querySelector('.drop-message').textContent = pdfMsg;
    } else {
        alert(t.selectValidPdf || 'Por favor, selecciona un archivo PDF válido.');
    }
});

// Event listener para cambios en el input
pdfInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
        const pdfMsg = (t.pdfLoaded || 'PDF cargado: {filename}').replace('{filename}', file.name); dropZonePDF.querySelector('.drop-message').textContent = pdfMsg;
    }
});

extractBtn?.addEventListener('click', async () => {
    const f = pdfInput.files && pdfInput.files[0];
    if (!f) return alert(t.selectPdfFirst || 'Selecciona un archivo PDF primero.');
    pdfText.value = t.extractingText || 'Extrayendo texto...';
    const arrayBuffer = await f.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    try {
        const loadingTask = pdfjsLib.getDocument({ data: uint8 });
        const pdf = await loadingTask.promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            fullText += strings.join(' ') + '\n\n';
        }
        pdfText.value = fullText;
    } catch (e) {
        pdfText.value = '';
        alert((t.pdfExtractError || 'Error extrayendo PDF') + ': ' + e.message);
    }
});

copyBtn?.addEventListener('click', async () => {
    try {
        if (pdfText.value.trim() === '') {
            alert(t.noText || 'No hay texto para copiar');
            return;
        }
        await navigator.clipboard.writeText(pdfText.value);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
        `;
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    } catch (e) {
        // Fallback manual
        try {
            pdfText.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
            `;
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            alert((t.copyError || 'Error al copiar') + ': ' + e.message + '\n' + (err?.message || ''));
        }
    }
});
