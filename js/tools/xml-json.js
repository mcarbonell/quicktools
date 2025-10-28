// xml-json.js - Convierte XML <-> JSON usando fast-xml-parser (CDN)
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const xmlToJsonBtn = document.getElementById('xmlToJsonBtn');
const jsonToXmlBtn = document.getElementById('jsonToXmlBtn');
const prettyJsonBtn = document.getElementById('prettyJsonBtn');
const copyBtn = document.getElementById('copyBtn');
const preserveAttributes = document.getElementById('preserveAttributes');
const msg = document.getElementById('msg');

function showMsg(text, isError = false) {
    msg.textContent = text;
    msg.style.color = isError ? 'crimson' : '';
}

// Opciones por defecto para fast-xml-parser
function getParserOptions() {
    return {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        textNodeName: "#text",
        allowBooleanAttributes: true,
        parseAttributeValue: false,
        parseNodeValue: false,
        trimValues: true,
    };
}

xmlToJsonBtn?.addEventListener('click', () => {
    const input = inputText.value.trim();
    if (!input) {
        showMsg('Introduce XML para convertir', true);
        return;
    }
    try {
        const options = getParserOptions();
        // Si el usuario no quiere atributos, se pueden ignorar
        if (!preserveAttributes.checked) options.ignoreAttributes = true;

        const parser = new fastXmlParser.XMLParser(options);
        const jsonObj = parser.parse(input);
        outputText.value = JSON.stringify(jsonObj, null, 2);
        showMsg('XML convertido a JSON');
    } catch (e) {
        showMsg('Error al parsear XML: ' + e.message, true);
    }
});

jsonToXmlBtn?.addEventListener('click', () => {
    const input = inputText.value.trim();
    if (!input) {
        showMsg('Introduce JSON para convertir', true);
        return;
    }
    try {
        const obj = JSON.parse(input);
        const options = {
            attributeNamePrefix: "@_",
            textNodeName: "#text",
            ignoreAttributes: !preserveAttributes.checked,
            format: true,
            indentBy: "  ",
            supressEmptyNode: false
        };
        const j2x = new fastXmlParser.XMLBuilder(options);
        const xml = j2x.build(obj);
        outputText.value = xml;
        showMsg('JSON convertido a XML');
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
        showMsg('JSON formateado');
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
        showMsg('Copiado al portapapeles');
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
            showMsg('Copiado al portapapeles');
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                showMsg('');
            }, 1400);
        } catch (err) {
            showMsg('Error al copiar: ' + e.message, true);
        }
    }
});