// url-encoder.js - Codificador/decodificador de URLs
const inputText = document.getElementById('inputText');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const outputText = document.getElementById('outputText');
const encodeBtn = document.getElementById('encodeBtn');
const encodeComponentBtn = document.getElementById('encodeComponentBtn');
const decodeBtn = document.getElementById('decodeBtn');
const decodeComponentBtn = document.getElementById('decodeComponentBtn');
const copyBtn = document.getElementById('copyBtn');
const msg = document.getElementById('msg');

// URL encode/decode
encodeBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = t.pleaseEnterTextToEncode || 'Introduce texto para codificar';
        return;
    }
    try {
        outputText.value = encodeURI(input);
        msg.textContent = t.urlEncoded || 'URL codificada';
    } catch (e) {
        msg.textContent = (t.encodeError || 'Error al codificar') + ': ' + e.message;
    }
});

encodeComponentBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = t.pleaseEnterTextToEncode || 'Introduce texto para codificar';
        return;
    }
    try {
        outputText.value = encodeURIComponent(input);
        msg.textContent = t.componentEncoded || 'Componente codificado';
    } catch (e) {
        msg.textContent = (t.encodeError || 'Error al codificar') + ': ' + e.message;
    }
});

decodeBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = t.pleaseEnterTextToDecode || 'Introduce texto para decodificar';
        return;
    }
    try {
        outputText.value = decodeURI(input);
        msg.textContent = t.urlDecoded || 'URL decodificada';
    } catch (e) {
        msg.textContent = t.decodeError || 'Error al decodificar - la entrada parece inválida';
    }
});

decodeComponentBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = t.pleaseEnterTextToDecode || 'Introduce texto para decodificar';
        return;
    }
    try {
        outputText.value = decodeURIComponent(input);
        msg.textContent = t.componentDecoded || 'Componente decodificado';
    } catch (e) {
        msg.textContent = t.decodeError || 'Error al decodificar - la entrada parece inválida';
    }
});

// Copiar al portapapeles con fallback
copyBtn?.addEventListener('click', async () => {
    if (!outputText.value) {
        msg.textContent = t.noResultToCopy || 'No hay resultado para copiar';
        return;
    }
    try {
        await navigator.clipboard.writeText(outputText.value);
        const originalText = copyBtn.textContent;
        copyBtn.innerHTML = '✔';
        msg.textContent = t.copied || 'Copiado al portapapeles';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            msg.textContent = '';
        }, 1800);
    } catch (e) {
        try {
            outputText.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✔';
            msg.textContent = t.copied || 'Copiado al portapapeles';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                msg.textContent = '';
            }, 1800);
        } catch (err) {
            msg.textContent = (t.copyError || 'Error al copiar') + ': ' + e.message;
        }
    }
});