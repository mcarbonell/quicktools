// js/tools/hash-calculator.js - Calculadora de Hashes (MD5, SHA)

const inputText = document.getElementById('inputText');
const hashType = document.getElementById('hashType');
const calculateBtn = document.getElementById('calculateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultHash = document.getElementById('resultHash');
const msg = document.getElementById('msg');

function showMsg(text, isError = false) {
    msg.textContent = text;
    msg.style.color = isError ? 'crimson' : '';
}

async function calculateHash() {
    const text = inputText.value;
    const algorithm = hashType.value;

    if (!text) {
        showMsg('Por favor, introduce el texto a hashear.', true);
        resultHash.value = '';
        copyBtn.disabled = true;
        return;
    }

    try {
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(text);

        let hashBuffer;
        if (algorithm === 'MD5') {
            // MD5 no es parte de SubtleCrypto estándar, se necesitaría una librería externa
            // Por simplicidad, para MD5 mostraremos un mensaje o usaremos un polyfill/librería si se desea.
            showMsg('MD5 no es soportado directamente por la API Web Crypto. Usa SHA-1, SHA-256 o SHA-512.', true);
            resultHash.value = '';
            copyBtn.disabled = true;
            return;
        } else {
            hashBuffer = await crypto.subtle.digest(algorithm, data);
        }

        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        resultHash.value = hexHash;
        copyBtn.disabled = false;
        showMsg('Hash calculado correctamente.');

    } catch (e) {
        showMsg('Error al calcular el hash: ' + e.message, true);
        resultHash.value = '';
        copyBtn.disabled = true;
    }
}

async function copyHash() {
    const text = resultHash.value;
    if (!text || text.includes('(El hash aparecerá aquí)')) return;

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showMsg('Hash copiado al portapapeles');
            return;
        }
    } catch (e) {
        console.warn('navigator.clipboard.writeText falló:', e);
    }

    // Fallback a execCommand
    try {
        await fallbackCopyTextToClipboard(text);
        showMsg('Hash copiado al portapapeles (fallback)');
    } catch (e) {
        showMsg('Error al copiar: ' + (e && e.message ? e.message : e), true);
        console.error('Copy failed:', e);
    }
}

// Asumiendo que fallbackCopyTextToClipboard está en utils.js o definido globalmente
// Si no, necesitaríamos definirlo aquí o importarlo.
// Para este ejemplo, asumimos que utils.js ya lo provee.

calculateBtn.addEventListener('click', calculateHash);
copyBtn.addEventListener('click', copyHash);

// Calcular hash al cargar si hay texto predefinido (opcional)
// calculateHash();
