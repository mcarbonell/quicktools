const assert = require('assert');
const { parseCSV, detectDelimiter } = require('../js/lib/csv-parser');

console.log('Running csv-detect tests...');

// Test: semicolon delimiter
(() => {
    const input = 'h1;h2\n1;2\n3;4';
    const rows = parseCSV(input, ';');
    assert.deepStrictEqual(rows, [['h1', 'h2'], ['1', '2'], ['3', '4']]);
})();

// Test: tab delimiter
(() => {
    const input = 'a\tb\n1\t2\n3\t4';
    const rows = parseCSV(input, '\t');
    assert.deepStrictEqual(rows, [['a', 'b'], ['1', '2'], ['3', '4']]);
})();

// Test: pipe delimiter
(() => {
    const input = 'col1|col2\nval1|val2';
    const rows = parseCSV(input, '|');
    assert.deepStrictEqual(rows, [['col1', 'col2'], ['val1', 'val2']]);
})();

// Test: detectDelimiter for semicolon
(() => {
    const txt = 'h1;h2\n1;2\n3;4\n';
    const d = detectDelimiter(txt);
    assert.strictEqual(d, ';');
})();

// Test: detectDelimiter for tab
(() => {
    const txt = 'a\tb\n1\t2\n3\t4';
    const d = detectDelimiter(txt);
    assert.strictEqual(d, '\t');
})();

// Test: detectDelimiter prefers comma when ambiguous?
(() => {
    const txt = 'a,b|c\n1,2|3';
    const d = detectDelimiter(txt);
    // In this contrived case, counts may pick comma or pipe; assert not null
    assert.ok(d === ',' || d === '|');
})();

console.log('All csv-detect tests passed.');
