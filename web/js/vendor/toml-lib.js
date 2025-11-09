/* toml-lib.js - Implementación mínima de TOML parse/stringify para usos comunes.
   Nota: No implementa toda la especificación TOML; cubre pares clave=valor, strings, números,
   booleanos, arrays simples, y tablas/nested tables. Suficiente para uso común en QuickTools.
*/
(function (global) {
    'use strict';

    function parseValue(raw) {
        raw = raw.trim();
        if (!raw) return '';
        // string (double or single quoted)
        if ((raw[0] === '"' && raw[raw.length - 1] === '"') || (raw[0] === '\'' && raw[raw.length - 1] === '\'')) {
            return raw.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'");
        }
        // array
        if (raw[0] === '[' && raw[raw.length - 1] === ']') {
            const inner = raw.slice(1, -1).trim();
            if (inner === '') return [];
            // split by commas not inside quotes (simple)
            const parts = inner.split(/,(?![^\"]*\")/).map(s => s.trim()).filter(s => s.length > 0);
            return parts.map(parseValue);
        }
        // boolean
        if (raw === 'true') return true;
        if (raw === 'false') return false;
        // null-like not supported
        // number (int or float)
        if (/^[+-]?[0-9]+(\.[0-9]+)?$/.test(raw)) return Number(raw);
        // fallback unquoted string
        return raw;
    }

    function setPath(obj, path, key, value) {
        let cur = obj;
        for (let p of path) {
            if (!cur[p]) cur[p] = {};
            cur = cur[p];
        }
        cur[key] = value;
    }

    function parse(tomlText) {
        const lines = tomlText.split(/\r?\n/);
        const result = {};
        let curPath = [];

        for (let rawLine of lines) {
            let line = rawLine.replace(/#.*/, ''); // remove comments
            if (!line.trim()) continue;
            line = line.trim();

            // table [a.b]
            const tableMatch = line.match(/^\[(.+)\]$/);
            if (tableMatch) {
                const pathStr = tableMatch[1].trim();
                curPath = pathStr.split('.').map(s => s.trim());
                continue;
            }

            // key = value
            const kv = line.split(/=(.*)/s);
            if (kv.length < 2) continue;
            const key = kv[0].trim();
            const valueRaw = kv[1].trim();
            const value = parseValue(valueRaw);
            setPath(result, curPath, key, value);
        }
        return result;
    }

    function encodeValue(val) {
        if (val === null || val === undefined) return '';
        if (Array.isArray(val)) return '[' + val.map(encodeValue).join(', ') + ']';
        if (typeof val === 'string') {
            // quote and escape
            return '"' + String(val).replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
        }
        if (typeof val === 'boolean') return val ? 'true' : 'false';
        if (typeof val === 'number') return String(val);
        return '"' + String(val) + '"';
    }

    function stringify(obj) {
        // We'll flatten top-level simple keys, and create tables for nested objects
        const lines = [];
        const tables = {};

        for (const [k, v] of Object.entries(obj)) {
            if (v && typeof v === 'object' && !Array.isArray(v)) {
                tables[k] = v;
            } else {
                lines.push(`${k} = ${encodeValue(v)}`);
            }
        }

        for (const [tableName, tableObj] of Object.entries(tables)) {
            lines.push('');
            lines.push(`[${tableName}]`);
            for (const [k, v] of Object.entries(tableObj)) {
                if (v && typeof v === 'object' && !Array.isArray(v)) {
                    // nested object -> dotted table
                    for (const [nk, nv] of Object.entries(v)) {
                        lines.push(`${k}.${nk} = ${encodeValue(nv)}`);
                    }
                } else {
                    lines.push(`${k} = ${encodeValue(v)}`);
                }
            }
        }

        return lines.join('\n').trim() + '\n';
    }

    const lib = { parse: parse, stringify: stringify };
    // expose
    if (typeof module !== 'undefined' && module.exports) module.exports = lib;
    if (typeof define === 'function' && define.amd) define(function () { return lib; });
    if (typeof window !== 'undefined') window.toml = lib;
    if (typeof global !== 'undefined') global.toml = lib;
})(typeof window !== 'undefined' ? window : this);
