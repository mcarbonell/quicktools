// yaml-json.js - Convierte YAML <-> JSON usando js-yaml (CDN)
const inputText = document.getElementById('inputText');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const outputText = document.getElementById('outputText');
const yamlToJsonBtn = document.getElementById('yamlToJsonBtn');
const jsonToYamlBtn = document.getElementById('jsonToYamlBtn');
const prettyJsonBtn = document.getElementById('prettyJsonBtn');
const copyBtn = document.getElementById('copyBtn');
const msg = document.getElementById('msg');

function showMsg(text, isError = false) {
    msg.textContent = text;
    msg.style.color = isError ? 'crimson' : '';
}

yamlToJsonBtn?.addEventListener('click', () => {
    const input = inputText.value.trim();
    if (!input) {
        showMsg('Introduce YAML para convertir', true);
        return;
    }
    try {
        const obj = jsyaml.load(input);
        const json = JSON.stringify(obj, null, 2);
        outputText.value = json;
        showMsg('YAML convertido a JSON');
    } catch (e) {
        showMsg('Error al parsear YAML: ' + e.message, true);
    }
});

jsonToYamlBtn?.addEventListener('click', () => {
    const input = inputText.value.trim();
    if (!input) {
        showMsg('Introduce JSON para convertir', true);
        return;
    }
    try {
        const obj = JSON.parse(input);
        const yaml = jsyaml.dump(obj, { noRefs: true, lineWidth: 1000 });
        outputText.value = yaml;
        showMsg('JSON convertido a YAML');
    } catch (e) {
        showMsg('Error al parsear JSON: ' + e.message, true);
    }
});

prettyJsonBtn?.addEventListener('click', () => {
    const input = inputText.value.trim();
    if (!input) {
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
    if (!outputText.value) {
        showMsg('No hay resultado para copiar', true);
        return;
    }
    try {
        await navigator.clipboard.writeText(outputText.value);
        const originalText = copyBtn.textContent;
        copyBtn.innerHTML = '✔';
        showMsg(t.copied || 'Copiado al portapapeles');
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            showMsg('');
        }, 1400);
    } catch (e) {
        try {
            outputText.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✔';
            showMsg(t.copied || 'Copiado al portapapeles');
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                showMsg('');
            }, 1400);
        } catch (err) {
            showMsg('Error al copiar: ' + e.message, true);
        }
    }
});