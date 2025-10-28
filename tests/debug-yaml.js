const jsyaml = require('js-yaml');
const sample = `text: |\n  Line1\n  Line2\ndate: 2012-12-12\nflag: !!bool yes\nnullval: null\n`;
console.log('Sample:\n', sample);
try {
    const obj = jsyaml.load(sample);
    console.log('Parsed object:', obj);
    const dumped = jsyaml.dump(obj);
    console.log('Dumped YAML:\n', dumped);
    const obj2 = jsyaml.load(dumped);
    console.log('Re-parsed:', obj2);
    const util = require('util');
    console.log('deepEqual?', require('assert').deepStrictEqual(obj2, obj) === undefined ? 'equal' : 'not equal');
} catch (e) {
    console.error('Error in debug YAML test:', e && e.stack || e);
}
