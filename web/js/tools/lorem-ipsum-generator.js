const amountInput = document.getElementById('amount-input');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const unitSelect = document.getElementById('unit-select');
const generateBtn = document.getElementById('generate-btn');
const loremIpsumOutput = document.getElementById('lorem-ipsum-output');
const copyBtn = document.getElementById('copy-btn');

const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

function generateLoremIpsum(amount, unit) {
    const words = loremIpsumText.split(/\s+/);
    let result = [];

    if (unit === 'words') {
        for (let i = 0; i < amount; i++) {
            result.push(words[i % words.length]);
        }
        return result.join(' ');
    } else if (unit === 'sentences') {
        const sentences = loremIpsumText.match(/[^.!?]+[.!?]+/g) || [loremIpsumText];
        for (let i = 0; i < amount; i++) {
            result.push(sentences[i % sentences.length].trim());
        }
        return result.join(' ');
    } else if (unit === 'paragraphs') {
        const paragraphs = loremIpsumText.split('. ').map(s => s.trim() + '.');
        for (let i = 0; i < amount; i++) {
            result.push(paragraphs[i % paragraphs.length]);
        }
        return result.join('\n\n');
    }
    return '';
}

generateBtn.addEventListener('click', () => {
    const amount = parseInt(amountInput.value, 10);
    const unit = unitSelect.value;
    if (isNaN(amount) || amount < 1) {
        alert('Por favor, introduce una cantidad válida (mínimo 1).');
        return;
    }
    loremIpsumOutput.value = generateLoremIpsum(amount, unit);
});

copyBtn.addEventListener('click', () => {
    loremIpsumOutput.select();
    document.execCommand('copy');
    alert('Texto copiado al portapapeles!');
});

// Initial generation
loremIpsumOutput.value = generateLoremIpsum(parseInt(amountInput.value, 10), unitSelect.value);
