// tests/validate-conversions.js
// Pruebas rápidas para YAML↔JSON, XML↔JSON y TOML↔JSON
const path = require('path');

console.log('Iniciando pruebas de conversiones...');

// YAML test
try {
    const jsyaml = require('js-yaml');
    const yamlSample = `
name: Proyecto
version: 1.0
authors:
  - name: Ana
    email: ana@ejemplo.com
  - name: Luis
    email: luis@ejemplo.com
features:
  enabled: true
  tags: [alpha, beta, release]
`;
    const obj = jsyaml.load(yamlSample);
    const json = JSON.stringify(obj);
    const back = jsyaml.dump(JSON.parse(json));
    console.log('YAML -> JSON -> YAML OK');
} catch (e) {
    console.error('YAML test FAILED:', e && e.message || e);
    process.exitCode = 2;
}

// XML test
try {
    const { XMLParser, XMLBuilder } = require('fast-xml-parser');
    const xmlSample = `<?xml version="1.0"?>\n<root><item id="1">One</item><item id="2"><![CDATA[Two & <escaped>]]></item></root>`;
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const parsed = parser.parse(xmlSample);
    const builder = new XMLBuilder({ attributeNamePrefix: '@_', format: true });
    const xmlBack = builder.build(parsed);
    console.log('XML -> JSON -> XML OK');
} catch (e) {
    console.error('XML test FAILED:', e && e.message || e);
    process.exitCode = 3;
}

// TOML test using vendored lib
try {
    const toml = require(path.join('..', 'js', 'vendor', 'toml-lib.js'));
    const tomlSample = `
[owner]
name = "Tom"
dob = "1979-05-27"

[database]
server = "192.168.1.1"
ports = [ 8001, 8001, 8002 ]
enabled = true
`;
    const obj = toml.parse(tomlSample);
    const tomlBack = toml.stringify(obj);
    const obj2 = toml.parse(tomlBack);
    console.log('TOML -> JSON -> TOML OK');
} catch (e) {
    console.error('TOML test FAILED:', e && e.message || e);
    process.exitCode = 4;
}

if (!process.exitCode) {
    console.log('Todas las pruebas pasaron correctamente.');
} else {
    console.error('Algunas pruebas fallaron. Revisa los mensajes arriba.');
}
