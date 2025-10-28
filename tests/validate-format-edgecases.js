// tests/validate-format-edgecases.js
// Pruebas más exhaustivas (edge cases) para YAML, XML y TOML
const assert = require('assert');
const path = require('path');

console.log('Iniciando pruebas edge-cases para YAML / XML / TOML...');

// YAML Edge Cases
function testYAML() {
    const jsyaml = require('js-yaml');

    const samples = [
        {
            name: 'anchors and aliases',
            input: `defaults: &defaults\n  name: Default\n  items: [1, 2, 3]\nobj:\n  <<: *defaults\n  extra: true\n`
        },
        {
            name: 'multiline block and special types',
            // usar 'true' en lugar de 'yes' porque algunas implementaciones (js-yaml) rechazan el tag explícito !!bool con 'yes'
            input: `text: |\n  Line1\n  Line2\ndate: 2012-12-12\nflag: !!bool true\nnullval: null\n`
        },
        {
            name: 'sequence of mappings',
            input: `- name: A\n  value: 1\n- name: B\n  value: 2\n`
        }
    ];

    samples.forEach((s) => {
        console.log(`Running YAML sample: ${s.name}`);
        const obj = jsyaml.load(s.input);
        const dumped = jsyaml.dump(obj);
        const obj2 = jsyaml.load(dumped);
        try {
            assert.deepStrictEqual(obj2, obj);
            console.log(`YAML [${s.name}] OK`);
        } catch (e) {
            console.error(`YAML [${s.name}] FAILED`, e.message);
            throw e;
        }
    });
}

// XML Edge Cases
function testXML() {
    const { XMLParser, XMLBuilder } = require('fast-xml-parser');

    const samples = [
        {
            name: 'attributes and cdata and namespaces',
            input: `<?xml version="1.0"?>\n<root xmlns:ns="http://example.com/ns">\n  <parent attr="1">Hello<child><![CDATA[<cdata>&]]></child><child attr="x">more</child></parent>\n</root>`
        },
        {
            name: 'mixed content and repeated elements',
            input: `<?xml version="1.0"?>\n<doc>Text before<item>One</item><item>Two</item>Text after</doc>`
        }
    ];

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', cdataPropName: '#cdata', textNodeName: '#text' });
    const builder = new XMLBuilder({ attributeNamePrefix: '@_', cdataPropName: '#cdata', format: false });

    samples.forEach((s) => {
        console.log(`Running XML sample: ${s.name}`);
        const parsed = parser.parse(s.input);
        const xmlBack = builder.build(parsed);
        const parsed2 = parser.parse(xmlBack);
        // Normalize XML parsed objects to avoid false negatives from attribute type coercion
        function normalizeXml(obj) {
            if (Array.isArray(obj)) return obj.map(normalizeXml);
            if (obj && typeof obj === 'object') {
                // remove xml declaration artifacts
                if (obj['?xml'] !== undefined) delete obj['?xml'];
                if (obj['@_version'] !== undefined) delete obj['@_version'];
                for (const k of Object.keys(obj)) {
                    if (k.startsWith('@_')) {
                        // force attribute values to string
                        obj[k] = obj[k] == null ? obj[k] : String(obj[k]);
                    } else if (typeof obj[k] === 'object') {
                        obj[k] = normalizeXml(obj[k]);
                    }
                }
            }
            return obj;
        }
        const n1 = normalizeXml(JSON.parse(JSON.stringify(parsed)));
        const n2 = normalizeXml(JSON.parse(JSON.stringify(parsed2)));
        try {
            assert.deepStrictEqual(n2, n1);
            console.log(`XML [${s.name}] OK`);
        } catch (e) {
            console.error(`XML [${s.name}] FAILED`, e && e.message || e);
            // For debugging, print both objects when failing
            console.error('original parsed:', JSON.stringify(n1, null, 2));
            console.error('re-parsed after build:', JSON.stringify(n2, null, 2));
            throw e;
        }
    });
}

// TOML Edge Cases
function testTOML() {
    let toml;
    try {
        toml = require('@iarna/toml');
    } catch (e) {
        // Fallback to vendored parser if @iarna/toml isn't installed
        toml = require(path.join('..', 'js', 'vendor', 'toml-lib.js'));
    }

    const samples = [
        {
            name: 'datetime and arrays of tables',
            input: `title = "TOML Example"\n\n[owner]\nname = "Tom"\ndob = 1979-05-27T07:32:00Z\n\n[[products]]\nname = "Hammer"\nsku = 738594937\n\n[[products]]\nname = "Nail"\nsku = 284758393\n`
        },
        {
            name: 'dotted keys and mixed types',
            input: `a.b.c = 1\narr = [1, 2, 3]\nflag = true\nstr = "hi"\n`
        }
    ];

    samples.forEach((s) => {
        console.log(`Running TOML sample: ${s.name}`);
        let obj;
        let back;
        try {
            if (toml.parse && toml.stringify) {
                // @iarna/toml exposes parse/stringify
                obj = toml.parse(s.input);
                back = toml.stringify(obj);
                const obj2 = toml.parse(back);
                assert.deepStrictEqual(obj2, obj);
            } else if (toml.parse && toml.stringify === undefined) {
                // vendor minimal: adapt names
                obj = toml.parse(s.input);
                back = toml.stringify(obj);
                const obj2 = toml.parse(back);
                assert.deepStrictEqual(obj2, obj);
            } else {
                throw new Error('TOML parser API no reconocida');
            }
            console.log(`TOML [${s.name}] OK`);
        } catch (e) {
            console.error(`TOML [${s.name}] FAILED`, e.message);
            console.error('obj:', JSON.stringify(obj, null, 2));
            console.error('back:', back);
            throw e;
        }
    });
}

(async () => {
    try {
        testYAML();
        testXML();
        testTOML();
        console.log('Todas las pruebas edge-cases pasaron correctamente.');
        process.exitCode = 0;
    } catch (e) {
        console.error('Algunas pruebas edge-cases fallaron. Revisa los detalles arriba.');
        process.exitCode = 5;
    }
})();
