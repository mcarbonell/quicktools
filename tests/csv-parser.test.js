const assert = require('assert');
const { parseCSV, csvToJson } = require('../js/lib/csv-parser');

console.log('Running csv-parser tests...');

// Test 1: Simple CSV
(() => {
    const input = 'a,b,c\n1,2,3';
    const rows = parseCSV(input);
    assert.deepStrictEqual(rows, [['a', 'b', 'c'], ['1', '2', '3']]);
})();

// Test 2: Quoted fields with comma
(() => {
    const input = 'h1,h2\n"hello, world",2';
    const rows = parseCSV(input);
    assert.deepStrictEqual(rows, [['h1', 'h2'], ['hello, world', '2']]);
})();

// Test 3: Escaped double quotes inside quoted field
(() => {
    const input = 'h\n"line ""inner""",2';
    const rows = parseCSV(input);
    assert.deepStrictEqual(rows, [['h'], ['line "inner"', '2']]);
})();

// Test 4: CRLF handling and trailing newline
(() => {
    const input = 'a,b\r\n1,2\r\n';
    const rows = parseCSV(input);
    assert.deepStrictEqual(rows, [['a', 'b'], ['1', '2']]);
})();

// Test 5: csvToJson mapping headers
(() => {
    const input = 'name,age\nAlice,30\nBob,25';
    const data = csvToJson(input);
    assert.deepStrictEqual(data, [{ name: 'Alice', age: '30' }, { name: 'Bob', age: '25' }]);
})();

console.log('All csv-parser tests passed.');
