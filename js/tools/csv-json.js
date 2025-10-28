// csv-json.js
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const inputArea = document.getElementById('inputArea');
const resultArea = document.getElementById('resultArea');
const csvToJsonBtn = document.getElementById('csvToJsonBtn');
const jsonToCsvBtn = document.getElementById('jsonToCsvBtn');
const validateJsonBtn = document.getElementById('validateJsonBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const msg = document.getElementById('msg');

// Drag & drop
dropZone?.addEventListener('click', () => fileInput.click());
dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const f = e.dataTransfer?.files?.[0];
    if (!f) return;
    if (!f.type.includes('csv') && !f.name.toLowerCase().endsWith('.csv')) {
        alert('Por favor, selecciona un archivo CSV.');
        return;
    }
    const reader = new FileReader();
    reader.onload = () => { inputArea.value = reader.result; msg.textContent = `Archivo cargado: ${f.name}`; };
    reader.readAsText(f);
});

fileInput?.addEventListener('change', (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { inputArea.value = reader.result; msg.textContent = `Archivo cargado: ${f.name}`; };
    reader.readAsText(f);
});

// CSV parser (soporta comillas y comillas dobles)
function parseCSV(str, delimiter = ',') {
    const rows = [];
    let row = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (ch === '"') {
            if (inQuotes && str[i + 1] === '"') { cur += '"'; i++; }
            else { inQuotes = !inQuotes; }
        } else if (ch === delimiter && !inQuotes) {
            row.push(cur);
            cur = '';
        } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
            if (ch === '\r' && str[i + 1] === '\n') { i++; }
            row.push(cur);
            rows.push(row);
            row = [];
            cur = '';
        } else {
            cur += ch;
        }
    }
    // Push remaining
    if (cur !== '' || row.length > 0) {
        row.push(cur);
        rows.push(row);
    }
    // Remove possible trailing empty row caused by newline at end
    if (rows.length > 0) {
        const last = rows[rows.length - 1];
        if (last.length === 1 && last[0] === '') rows.pop();
    }
    return rows;
}

function csvToJson(csvText) {
    const rows = parseCSV(csvText);
    if (rows.length === 0) return [];
    const headers = rows[0].map(h => h.trim());
    const data = rows.slice(1).map(r => {
        const obj = {};
        for (let i = 0; i < headers.length; i++) {
            obj[headers[i] || `col${i}`] = (r[i] !== undefined) ? r[i] : '';
        }
        return obj;
    });
    return data;
}

function jsonToCsv(json) {
    // json: array of objects OR array of arrays
    if (!Array.isArray(json)) throw new Error('JSON debe ser un array.');
    if (json.length === 0) return '';
    // If array of arrays, just join
    if (Array.isArray(json[0])) {
        return json.map(r => r.map(cell => escapeCsv(String(cell))).join(',')).join('\n');
    }
    // Array of objects
    // Collect union of keys (order by first object's keys)
    const keys = Array.from(new Set(json.flatMap(obj => Object.keys(obj))));
    const header = keys.join(',');
    const lines = json.map(obj => keys.map(k => escapeCsv(obj[k] ?? '')).join(','));
    return header + '\n' + lines.join('\n');
}

function escapeCsv(val) {
    if (val == null) return '';
    const s = String(val);
    if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
        return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

csvToJsonBtn?.addEventListener('click', () => {
    const csv = inputArea.value;
    if (!csv.trim()) { msg.textContent = 'Introduce CSV o carga un archivo.'; return; }
    try {
        const data = csvToJson(csv);
        resultArea.value = JSON.stringify(data, null, 2);
        msg.textContent = `Convertido: ${data.length} filas`;
    } catch (e) {
        msg.textContent = 'Error al parsear CSV: ' + e.message;
    }
});

jsonToCsvBtn?.addEventListener('click', () => {
    const txt = inputArea.value;
    if (!txt.trim()) { msg.textContent = 'Introduce JSON o carga un archivo.'; return; }
    try {
        const parsed = JSON.parse(txt);
        const csv = jsonToCsv(parsed);
        resultArea.value = csv;
        msg.textContent = `Convertido a CSV (${csv.split('\n').length} líneas)`;
    } catch (e) {
        msg.textContent = 'Error al convertir JSON: ' + e.message;
    }
});

validateJsonBtn?.addEventListener('click', () => {
    const txt = inputArea.value;
    try {
        JSON.parse(txt);
        msg.textContent = 'JSON válido.';
    } catch (e) {
        msg.textContent = 'JSON inválido: ' + e.message;
    }
});

copyBtn?.addEventListener('click', async () => {
    try {
        if (resultArea.value.trim() === '') { msg.textContent = 'No hay resultado para copiar.'; return; }
        await navigator.clipboard.writeText(resultArea.value);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✔';
        msg.textContent = 'Copiado al portapapeles.';
        setTimeout(() => { copyBtn.innerHTML = originalText; msg.textContent = ''; }, 1800);
    } catch (e) {
        try {
            resultArea.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✔';
            msg.textContent = 'Copiado al portapapeles.';
            setTimeout(() => { copyBtn.innerHTML = originalText; msg.textContent = ''; }, 1800);
        } catch (err) {
            msg.textContent = 'Error al copiar: ' + (e?.message || '') + (err ? ' / ' + err.message : '');
        }
    }
});

downloadBtn?.addEventListener('click', () => {
    const txt = resultArea.value;
    if (!txt) { msg.textContent = 'No hay resultado para descargar.'; return; }
    const isJson = txt.trim().startsWith('{') || txt.trim().startsWith('[');
    const blob = new Blob([txt], { type: isJson ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isJson ? 'data.json' : 'data.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    msg.textContent = 'Descarga iniciada.';
});

// Helper conversion wrapper
function csvToJsonWrapper(csv) {
    try { return csvToJson(csv); } catch (e) { throw e; }
}

// Expose in console for debugging
window.__qt_csv = { parseCSV, csvToJson, jsonToCsv };
