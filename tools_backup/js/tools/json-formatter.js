const jsonInput = document.getElementById('jsonInput');
const prettyBtn = document.getElementById('prettyBtn');
const minifyBtn = document.getElementById('minifyBtn');
const validateBtn = document.getElementById('validateBtn');
const copyBtn = document.getElementById('copyBtn');
const jsonMsg = document.getElementById('jsonMsg');

// Get translations (injected by generator)
const t = window.toolTranslations || {};

function showMsg(text, type = 'info') {
    jsonMsg.textContent = text;
    jsonMsg.className = '';
    jsonMsg.classList.add('mb-2');
    if (type === 'error') jsonMsg.classList.add('text-danger');
    else if (type === 'success') jsonMsg.classList.add('text-success');
    else jsonMsg.classList.add('text-muted');
}

prettyBtn?.addEventListener('click', () => {
    try {
        const obj = JSON.parse(jsonInput.value);
        jsonInput.value = JSON.stringify(obj, null, 2);
        showMsg(t.formatted || 'JSON formateado.', 'success');
    } catch (e) {
        showMsg((t.invalidJson || 'JSON inválido') + ': ' + e.message, 'error');
    }
});

minifyBtn?.addEventListener('click', () => {
    try {
        const obj = JSON.parse(jsonInput.value);
        jsonInput.value = JSON.stringify(obj);
        showMsg(t.minified || 'JSON minificado.', 'success');
    } catch (e) {
        showMsg((t.invalidJson || 'JSON inválido') + ': ' + e.message, 'error');
    }
});

validateBtn?.addEventListener('click', () => {
    try {
        JSON.parse(jsonInput.value);
        showMsg(t.validJson || 'JSON válido.', 'success');
    } catch (e) {
        showMsg((t.invalidJson || 'JSON inválido') + ': ' + e.message, 'error');
    }
});

copyBtn?.addEventListener('click', async () => {
    try {
        if (jsonInput.value.trim() === '') {
            showMsg(t.noText || 'No hay texto para copiar.', 'error');
            return;
        }
        await navigator.clipboard.writeText(jsonInput.value);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
        `;
        showMsg(t.copied || 'Copiado al portapapeles.', 'success');
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    } catch (e) {
        // Fallback manual
        try {
            jsonInput.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
            `;
            showMsg(t.copied || 'Copiado al portapapeles.', 'success');
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            showMsg((t.error || 'Error al copiar') + ': ' + e.message + '\n' + (err?.message || ''), 'error');
        }
    }
});
