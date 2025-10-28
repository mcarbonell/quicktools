// csv-parser.js
// Módulo simple (CommonJS) exportando parseCSV y csvToJson para uso en Node y pruebas.
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

// UMD-ish export: CommonJS + expose on window for browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseCSV, csvToJson };
}

if (typeof window !== 'undefined') {
    window.__qt_csv = window.__qt_csv || {};
    window.__qt_csv.parseCSV = parseCSV;
    window.__qt_csv.csvToJson = csvToJson;
}
