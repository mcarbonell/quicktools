// xml-json.js - Conversión XML <-> JSON usando APIs nativas (DOMParser / XMLSerializer)
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

// Convierte un nodo DOM a objeto JS
function nodeToObject(node, keepAttributes = true) {
    // Element node
    if (node.nodeType === Node.ELEMENT_NODE) {
        const obj = {};
        // Atributos
        if (keepAttributes && node.attributes && node.attributes.length) {
            for (let attr of node.attributes) {
                obj[`@_${attr.name}`] = attr.value;
            }
        }

        // Child nodes
        const childElements = Array.from(node.childNodes).filter(n => n.nodeType !== Node.COMMENT_NODE);
        if (childElements.length === 1 && childElements[0].nodeType === Node.TEXT_NODE) {
            // Solo texto
            const text = childElements[0].nodeValue.trim();
            if (text.length > 0) obj['#text'] = text;
            return obj;
        }

        for (let child of childElements) {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.nodeValue.trim();
                if (text.length === 0) continue;
                if (!obj['#text']) obj['#text'] = text; else obj['#text'] += text;
                continue;
            }
            const name = child.nodeName;
            const childObj = nodeToObject(child, keepAttributes);
            if (obj.hasOwnProperty(name)) {
                // Convertir en array si ya existe
                if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
                obj[name].push(childObj);
            } else {
                obj[name] = childObj;
            }
        }
        return obj;
    }
    // Text node
    if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue;
    }
    return null;
}

// Convierte un objeto JS a XML (string). Se espera que obj tenga una única propiedad raiz.
function objectToXml(obj, keepAttributes = true) {
    const indent = '  ';
    function build(nodeName, value, depth) {
        const pad = indent.repeat(depth);
        if (value === null || value === undefined) return `${pad}<${nodeName}></${nodeName}>\n`;
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return `${pad}<${nodeName}>${escapeXml(String(value))}</${nodeName}>\n`;
        }
        if (Array.isArray(value)) {
            return value.map(v => build(nodeName, v, depth)).join('');
        }
        // value is object
        // Extract attributes
        const attrs = [];
        const children = [];
        for (let [k, v] of Object.entries(value)) {
            if (keepAttributes && k.startsWith('@_')) {
                const attrName = k.slice(2);
                attrs.push(`${attrName}="${escapeXml(String(v))}"`);
            } else if (k === '#text') {
                // text node
                children.push(escapeXml(String(v)));
            } else {
                children.push(build(k, v, depth + 1));
            }
        }
        const attrString = attrs.length ? ' ' + attrs.join(' ') : '';
        if (children.length === 0) {
            return `${pad}<${nodeName}${attrString}></${nodeName}>\n`;
        }
        // If only text child and no element children, inline
        if (children.length === 1 && typeof children[0] === 'string' && !children[0].includes('\n')) {
            return `${pad}<${nodeName}${attrString}>${children[0]}</${nodeName}>\n`;
        }
        return `${pad}<${nodeName}${attrString}>\n${children.join('')}${pad}</${nodeName}>\n`;
    }

    // Expect root key
    const roots = Object.keys(obj);
    if (roots.length !== 1) {
        // wrap in root
        const wrapped = { root: obj };
        return objectToXml(wrapped, keepAttributes);
    }
    const rootName = roots[0];
    return build(rootName, obj[rootName], 0);
}

function escapeXml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

xmlToJsonBtn?.addEventListener('click', () => {
    const input = inputText.value.trim();
    if (!input) {
        showMsg('Introduce XML para convertir', true);
        return;
    }
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, 'application/xml');
        if (doc.querySelector('parsererror')) {
            throw new Error(doc.querySelector('parsererror').textContent || 'Error al parsear XML');
        }
        const root = doc.documentElement;
        const keepAttributes = preserveAttributes?.checked ?? true;
        const result = {};
        result[root.nodeName] = nodeToObject(root, keepAttributes);
        outputText.value = JSON.stringify(result, null, 2);
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
        const keepAttributes = preserveAttributes?.checked ?? true;
        const xml = objectToXml(obj, keepAttributes);
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