// url-encoder.js - Codificador/decodificador de URLs
const inputText = document.getElementById('inputText');
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
        msg.textContent = 'Introduce texto para codificar';
        return;
    }
    try {
        outputText.value = encodeURI(input);
        msg.textContent = 'URL codificada';
    } catch (e) {
        msg.textContent = 'Error al codificar: ' + e.message;
    }
});

encodeComponentBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = 'Introduce texto para codificar';
        return;
    }
    try {
        outputText.value = encodeURIComponent(input);
        msg.textContent = 'Componente codificado';
    } catch (e) {
        msg.textContent = 'Error al codificar: ' + e.message;
    }
});

decodeBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = 'Introduce texto para decodificar';
        return;
    }
    try {
        outputText.value = decodeURI(input);
        msg.textContent = 'URL decodificada';
    } catch (e) {
        msg.textContent = 'Error al decodificar - la entrada parece inválida';
    }
});

decodeComponentBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = 'Introduce texto para decodificar';
        return;
    }
    try {
        outputText.value = decodeURIComponent(input);
        msg.textContent = 'Componente decodificado';
    } catch (e) {
        msg.textContent = 'Error al decodificar - la entrada parece inválida';
    }
});

// Copiar al portapapeles con fallback
copyBtn?.addEventListener('click', async () => {
    if (!outputText.value) {
        msg.textContent = 'No hay resultado para copiar';
        return;
    }
    try {
        await navigator.clipboard.writeText(outputText.value);
        const originalText = copyBtn.textContent;
        copyBtn.innerHTML = '✔';
        msg.textContent = 'Copiado al portapapeles';
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
            msg.textContent = 'Copiado al portapapeles';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                msg.textContent = '';
            }, 1800);
        } catch (err) {
            msg.textContent = 'Error al copiar: ' + e.message;
        }
    }
});