// toml-json.js - Convierte TOML <-> JSON en el navegador
const inputText = document.getElementById('inputText');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const outputText = document.getElementById('outputText');
const tomlToJsonBtn = document.getElementById('tomlToJsonBtn');
const jsonToTomlBtn = document.getElementById('jsonToTomlBtn');
const prettyJsonBtn = document.getElementById('prettyJsonBtn');
const copyBtn = document.getElementById('copyBtn');
const msg = document.getElementById('msg');

function showMsg(text, isError = false) {
    msg.textContent = text;
    msg.style.color = isError ? 'crimson' : '';
}

// Intentar detectar la librería TOML desde el CDN expuesto globalmente
function getTomlLib() {
    if (typeof toml !== 'undefined') return toml;
    if (typeof TOML !== 'undefined') return TOML;
    if (typeof window !== 'undefined') {
        if (window.toml) return window.toml;
        if (window.TOML) return window.TOML;
        if (window['@iarna/toml']) return window['@iarna/toml'];
    }
    return null;
}

// Convertir TOML a JSON
tomlToJsonBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        showMsg('Introduce TOML para convertir', true);
        return;
    }
    const lib = getTomlLib();
    if (!lib || typeof lib.parse !== 'function') {
        showMsg('Librería TOML no encontrada. Comprueba la carga del CDN o añade manualmente una librería TOML.', true);
        return;
    }
    try {
        const obj = lib.parse(input);
        outputText.value = JSON.stringify(obj, null, 2);
        showMsg('TOML convertido a JSON');
    } catch (e) {
        showMsg('Error al parsear TOML: ' + e.message, true);
    }
});

// Convertir JSON a TOML
jsonToTomlBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        showMsg('Introduce JSON para convertir', true);
        return;
    }
    const lib = getTomlLib();
    if (!lib || typeof lib.stringify !== 'function') {
        showMsg('Librería TOML con stringify no encontrada. Comprueba la carga del CDN o añade manualmente una librería TOML.', true);
        return;
    }
    try {
        const obj = JSON.parse(input);
        const tomlStr = lib.stringify(obj);
        outputText.value = tomlStr;
        showMsg('JSON convertido a TOML');
    } catch (e) {
        showMsg('Error al convertir JSON a TOML: ' + e.message, true);
    }
});

prettyJsonBtn?.addEventListener('click', () => {
    const input = inputText.value;
    if (!input.trim()) {
        showMsg('Introduce JSON para formatear', true);
        return;
    }
    try {
        const obj = JSON.parse(input);
        outputText.value = JSON.stringify(obj, null, 2);
        showMsg(t.formatted || 'JSON formateado');
    } catch (e) {
        showMsg('Error al parsear JSON: ' + e.message, true);
    }
});

copyBtn?.addEventListener('click', async () => {
    if (!outputText.value) { showMsg('No hay resultado para copiar', true); return; }
    try {
        await navigator.clipboard.writeText(outputText.value);
        const original = copyBtn.textContent;
        copyBtn.innerHTML = '✔';
        showMsg(t.copied || 'Copiado al portapapeles');
        setTimeout(() => { copyBtn.innerHTML = original; showMsg(''); }, 1200);
    } catch (e) {
        try { outputText.select(); document.execCommand('copy'); showMsg(t.copied || 'Copiado al portapapeles'); } catch (err) { showMsg('Error al copiar: ' + err.message, true); }
    }
});