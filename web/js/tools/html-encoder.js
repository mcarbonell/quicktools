// html-encoder.js - Codificador/decodificador HTML
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const encodeBtn = document.getElementById('encodeBtn');
const encodeAllBtn = document.getElementById('encodeAllBtn');
const decodeBtn = document.getElementById('decodeBtn');
const copyBtn = document.getElementById('copyBtn');
const msg = document.getElementById('msg');

// Caracteres especiales HTML básicos
const basicEntities = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
};

// Codificar caracteres especiales HTML básicos
encodeBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = 'Introduce texto para codificar';
        return;
    }
    try {
        const encoded = input.replace(/[<>&"']/g, char => basicEntities[char]);
        outputText.value = encoded;
        msg.textContent = 'Texto codificado en HTML';
    } catch (e) {
        msg.textContent = 'Error al codificar: ' + e.message;
    }
});

// Codificar todos los caracteres no ASCII
encodeAllBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = 'Introduce texto para codificar';
        return;
    }
    try {
        const encoded = Array.from(input).map(char => {
            const code = char.charCodeAt(0);
            // Si es ASCII y no es un carácter especial HTML, lo dejamos igual
            if (code < 128 && !basicEntities[char]) {
                return char;
            }
            // Si es un carácter especial HTML o no es ASCII, lo codificamos
            return `&#${code};`;
        }).join('');
        outputText.value = encoded;
        msg.textContent = 'Texto codificado completamente en HTML';
    } catch (e) {
        msg.textContent = 'Error al codificar: ' + e.message;
    }
});

// Decodificar entidades HTML
decodeBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        msg.textContent = 'Introduce texto HTML para decodificar';
        return;
    }
    try {
        // Usamos un elemento textarea temporal para decodificar
        const textarea = document.createElement('textarea');
        textarea.innerHTML = input;
        const decoded = textarea.value;
        outputText.value = decoded;
        msg.textContent = 'Texto decodificado de HTML';
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