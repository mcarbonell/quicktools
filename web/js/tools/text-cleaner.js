const textInput = document.getElementById('textInput');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const cleanBtn = document.getElementById('cleanBtn');
const countBtn = document.getElementById('countBtn');
const copyBtn = document.getElementById('copyBtn');
const resultDiv = document.getElementById('result');

function cleanText(s) {
    // Reemplaza múltiples espacios y tabs por uno, normaliza saltos de línea
    return s.replace(/\t+/g, ' ').replace(/ +/g, ' ').replace(/\r/g, '').replace(/\n{2,}/g, '\n\n').trim();
}

function countWords(s) {
    const cleaned = s.trim();
    if (!cleaned) return 0;
    return cleaned.split(/\s+/).length;
}

cleanBtn?.addEventListener('click', () => {
    textInput.value = cleanText(textInput.value);
    resultDiv.textContent = 'Texto limpiado.';
});

countBtn?.addEventListener('click', () => {
    const cnt = countWords(textInput.value);
    resultDiv.textContent = `Palabras: ${cnt}`;
});

copyBtn?.addEventListener('click', async () => {
    try {
        if (textInput.value.trim() === '') {
            resultDiv.textContent = t.noText || 'No hay texto para copiar';
            return;
        }
        await navigator.clipboard.writeText(textInput.value);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
        `;
        resultDiv.textContent = t.copied || 'Copiado al portapapeles';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            resultDiv.textContent = '';
        }, 2000);
    } catch (e) {
        // Fallback manual
        try {
            textInput.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
            `;
            resultDiv.textContent = t.copied || 'Copiado al portapapeles';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                resultDiv.textContent = '';
            }, 2000);
        } catch (err) {
            resultDiv.textContent = 'Error al copiar: ' + e.message + '\n' + (err?.message || '');
        }
    }
});
