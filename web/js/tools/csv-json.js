// csv-json.js
const dropZone = document.getElementById('dropZone');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const fileInput = document.getElementById('fileInput');
const inputArea = document.getElementById('inputArea');
const resultArea = document.getElementById('resultArea');
const csvToJsonBtn = document.getElementById('csvToJsonBtn');
const jsonToCsvBtn = document.getElementById('jsonToCsvBtn');
const validateJsonBtn = document.getElementById('validateJsonBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const msg = document.getElementById('msg');
const delimiterSelect = document.getElementById('delimiterSelect');
const customDelimiter = document.getElementById('customDelimiter');
let detectedDelimiterCache = null;

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
        alert(t.selectCsvFile || 'Por favor, selecciona un archivo CSV.');
        return;
    }
    const reader = new FileReader();
    reader.onload = () => { inputArea.value = reader.result; const fileMsg = (t.fileLoaded || 'Archivo cargado: {filename}').replace('{filename}', f.name); msg.textContent = fileMsg; runAutoDetectIfNeeded && runAutoDetectIfNeeded(fileMsg); };
    reader.readAsText(f);
});

fileInput?.addEventListener('change', (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { inputArea.value = reader.result; const fileMsg = (t.fileLoaded || 'Archivo cargado: {filename}').replace('{filename}', f.name); msg.textContent = fileMsg; runAutoDetectIfNeeded && runAutoDetectIfNeeded(fileMsg); };
    reader.readAsText(f);
});

// Utilizar la librería compartida si está disponible
const CSVLib = (typeof window !== 'undefined' && window.__qt_csv) ? window.__qt_csv : null;

// Mostrar/ocultar campo de delimitador personalizado
delimiterSelect?.addEventListener('change', (e) => {
    if (delimiterSelect.value === 'custom') {
        customDelimiter.classList.remove('d-none');
        customDelimiter.focus();
    } else {
        customDelimiter.classList.add('d-none');
    }
    // Clear cached detection when user explicitly changes selection
    detectedDelimiterCache = null;
});

function getDelimiter() {
    if (!delimiterSelect) return ',';
    const v = delimiterSelect.value;
    if (v === 'custom') return customDelimiter?.value || ',';
    if (v === 'auto') {
        if (detectedDelimiterCache) {
            const delimiterText = detectedDelimiterCache === '\t' ? (t.delimiterTabFormat || '{delimiter} (tab)').replace('{delimiter}', '\\t') : detectedDelimiterCache; msg.textContent = (t.detectedDelimiter || 'Delimitador detectado: {delimiter}').replace('{delimiter}', delimiterText);
            return detectedDelimiterCache;
        }
        const detected = detectDelimiter(inputArea.value || '');
        detectedDelimiterCache = detected || null;
        const delimiterText = detected === '\t' ? (t.delimiterTabFormat || '{delimiter} (tab)').replace('{delimiter}', '\\t') : detected; msg.textContent = detected ? (t.detectedDelimiter || 'Delimitador detectado: {delimiter}').replace('{delimiter}', delimiterText) : (t.noDelimiterUsingComma || 'No se detectó delimitador, usando coma.');
        return detected || ',';
    }
    if (v === '\t') return '\t';
    return v;
}

function jsonToCsv(json, delimiter = ',') {
    // json: array of objects OR array of arrays
    if (!Array.isArray(json)) throw new Error(t.jsonMustBeArray || 'JSON debe ser un array.');
    if (json.length === 0) return '';
    // If array of arrays, just join
    if (Array.isArray(json[0])) {
        return json.map(r => r.map(cell => escapeCsv(String(cell), delimiter)).join(delimiter)).join('\n');
    }
    // Array of objects
    // Collect union of keys (order by first object's keys)
    const keys = Array.from(new Set(json.flatMap(obj => Object.keys(obj))));
    const header = keys.join(delimiter);
    const lines = json.map(obj => keys.map(k => escapeCsv(obj[k] ?? '', delimiter)).join(delimiter));
    return header + '\n' + lines.join('\n');
}

function escapeCsv(val, delimiter = ',') {
    if (val == null) return '';
    const s = String(val);
    // If contains quote, delimiter, or newlines, escape
    if (s.includes('"') || s.includes('\n') || s.includes('\r') || (delimiter && s.includes(delimiter))) {
        return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

// Detect delimiter by counting occurrences outside quotes in the first N non-empty lines
function detectDelimiter(text) {
    if (!text) return null;
    const candidates = [',', ';', '\t', '|'];
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '').slice(0, 10);
    if (lines.length === 0) return null;

    function countOutsideQuotes(line, ch) {
        let count = 0;
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') {
                if (inQuotes && line[i + 1] === '"') { i++; continue; }
                inQuotes = !inQuotes;
                continue;
            }
            if (!inQuotes) {
                if (ch === '\t') {
                    if (c === '\t') count++;
                } else if (c === ch) count++;
            }
        }
        return count;
    }

    const totals = candidates.map(d => {
        return lines.reduce((acc, ln) => acc + countOutsideQuotes(ln, d), 0);
    });

    // Find the candidate with the highest total count
    let max = 0;
    let idx = -1;
    for (let i = 0; i < totals.length; i++) {
        if (totals[i] > max) { max = totals[i]; idx = i; }
    }
    if (idx === -1 || max === 0) return null;
    return candidates[idx];
}

// Run auto-detection and update UI message if needed
function runAutoDetectIfNeeded(contextMsg) {
    if (delimiterSelect?.value !== 'auto') return;
    detectedDelimiterCache = detectDelimiter(inputArea.value || '') || null;
    if (detectedDelimiterCache) {
        const delimiterText = detectedDelimiterCache === '\t' ? (t.delimiterTabFormat || '{delimiter} (tab)').replace('{delimiter}', '\\t') : detectedDelimiterCache;
        if (contextMsg) msg.textContent = `${contextMsg} — ${(t.detectedDelimiter || 'Delimitador detectado: {delimiter}').replace('{delimiter}', delimiterText)}`;
        else msg.textContent = (t.detectedDelimiter || 'Delimitador detectado: {delimiter}').replace('{delimiter}', delimiterText);
    } else {
        if (contextMsg) msg.textContent = `${contextMsg} — ${t.noDelimiterUsingComma || 'No se detectó delimitador, usando coma.'}`;
    }
}

// Detect automatically after paste into textarea
inputArea?.addEventListener('paste', () => {
    setTimeout(() => runAutoDetectIfNeeded(t.pastedContent || 'Contenido pegado'), 50);
});

csvToJsonBtn?.addEventListener('click', () => {
    const csv = inputArea.value;
    if (!csv.trim()) { msg.textContent = t.enterCsvOrFile || 'Introduce CSV o carga un archivo.'; return; }
    try {
        const delim = getDelimiter();
        if (!CSVLib || !CSVLib.parseCSV) throw new Error(t.csvLibraryNotAvailable || 'CSV library no disponible en el navegador.');
        const rows = CSVLib.parseCSV(csv, delim);
        if (!rows || rows.length === 0) { resultArea.value = '[]'; msg.textContent = t.noRows || 'Sin filas.'; return; }
        const headers = rows[0].map(h => h.trim());
        const data = rows.slice(1).map(r => {
            const obj = {};
            for (let i = 0; i < headers.length; i++) {
                obj[headers[i] || `col${i}`] = (r[i] !== undefined) ? r[i] : '';
            }
            return obj;
        });
        resultArea.value = JSON.stringify(data, null, 2);
        msg.textContent = (t.convertedRows || 'Convertido: {count} filas').replace('{count}', data.length);
    } catch (e) {
        msg.textContent = (t.csvParseError || 'Error al parsear CSV') + ': ' + e.message;
    }
});

jsonToCsvBtn?.addEventListener('click', () => {
    const txt = inputArea.value;
    if (!txt.trim()) { msg.textContent = t.enterJsonOrFile || 'Introduce JSON o carga un archivo.'; return; }
    try {
        const parsed = JSON.parse(txt);
        const delim = getDelimiter();
        const csv = jsonToCsv(parsed, delim);
        resultArea.value = csv;
        msg.textContent = (t.convertedToCsv || 'Convertido a CSV ({lines} líneas)').replace('{lines}', csv.split('\n').length);
    } catch (e) {
        msg.textContent = (t.jsonConvertError || 'Error al convertir JSON') + ': ' + e.message;
    }
});

validateJsonBtn?.addEventListener('click', () => {
    const txt = inputArea.value;
    try {
        JSON.parse(txt);
        msg.textContent = t.validJson || 'JSON válido';
    } catch (e) {
        msg.textContent = (t.invalidJson || 'JSON inválido: {error}').replace('{error}', e.message);
    }
});

copyBtn?.addEventListener('click', async () => {
    try {
        if (resultArea.value.trim() === '') { msg.textContent = t.noResultToCopy || 'No hay resultado para copiar.'; return; }
        await navigator.clipboard.writeText(resultArea.value);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✔';
        msg.textContent = t.copied || 'Copiado al portapapeles';
        setTimeout(() => { copyBtn.innerHTML = originalText; msg.textContent = ''; }, 1800);
    } catch (e) {
        try {
            resultArea.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✔';
            msg.textContent = t.copied || 'Copiado al portapapeles';
            setTimeout(() => { copyBtn.innerHTML = originalText; msg.textContent = ''; }, 1800);
        } catch (err) {
            msg.textContent = (t.copyError || 'Error al copiar') + ': ' + (e?.message || '') + (err ? ' / ' + err.message : '');
        }
    }
});

downloadBtn?.addEventListener('click', () => {
    const txt = resultArea.value;
    if (!txt) { msg.textContent = t.noResultToDownload || 'No hay resultado para descargar.'; return; }
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
    msg.textContent = t.downloadStarted || 'Descarga iniciada.';
});

// Helper conversion wrapper
function csvToJsonWrapper(csv) {
    if (!CSVLib || !CSVLib.csvToJson) throw new Error(t.csvLibraryUnavailable || 'CSV library no disponible.');
    return CSVLib.csvToJson(csv);
}
// Nota: la librería CSV queda expuesta en window.__qt_csv por `js/lib/csv-parser.js`

// Si la opción por defecto es 'auto', ejecutar detección al cargar la página
setTimeout(() => {
    try {
        if (delimiterSelect?.value === 'auto') runAutoDetectIfNeeded(t.autoDetectionActive || 'Auto-detección activada');
    } catch (e) {
        // no-op
    }
}, 80);
