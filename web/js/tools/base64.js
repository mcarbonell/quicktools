// base64.js - Codificador/decodificador Base64
const inputText = document.getElementById('inputText');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const outputText = document.getElementById('outputText');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const copyBtn = document.getElementById('copyBtn');
const msg = document.getElementById('msg');

// Codificar en Base64
encodeBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = 'Introduce texto para codificar';
        return;
    }
    try {
        // Usamos TextEncoder para manejar correctamente caracteres Unicode
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        // Convertimos el array de bytes a una cadena base64
        const base64 = btoa(String.fromCharCode(...data));
        outputText.value = base64;
        msg.textContent = 'Texto codificado en Base64';
    } catch (e) {
        msg.textContent = 'Error al codificar: ' + e.message;
    }
});

// Decodificar Base64
decodeBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = 'Introduce texto Base64 para decodificar';
        return;
    }
    try {
        // Decodificamos el Base64 a un array de bytes
        const binary = atob(input.trim());
        const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
        // Usamos TextDecoder para convertir los bytes a texto
        const decoder = new TextDecoder();
        const text = decoder.decode(bytes);
        outputText.value = text;
        msg.textContent = 'Texto decodificado de Base64';
    } catch (e) {
        msg.textContent = 'Error al decodificar - la entrada no parece ser Base64 válido';
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
            msg.textContent = 'Error al copiar: ' + e.message;
        }
    }
});