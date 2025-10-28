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

    const totals = candidates.map(d => lines.reduce((acc, ln) => acc + countOutsideQuotes(ln, d), 0));
    let max = 0;
    let idx = -1;
    for (let i = 0; i < totals.length; i++) {
        if (totals[i] > max) { max = totals[i]; idx = i; }
    }
    if (idx === -1 || max === 0) return null;
    return candidates[idx];
}

// UMD-ish export: CommonJS + expose on window for browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseCSV, csvToJson, detectDelimiter };
}

if (typeof window !== 'undefined') {
    window.__qt_csv = window.__qt_csv || {};
    window.__qt_csv.parseCSV = parseCSV;
    window.__qt_csv.csvToJson = csvToJson;
}
