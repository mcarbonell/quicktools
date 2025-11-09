// password.js - Generador de contraseñas seguro
const lengthInput = document.getElementById('length');
const lowercase = document.getElementById('lowercase');
const uppercase = document.getElementById('uppercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const noAmbiguous = document.getElementById('noAmbiguous');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const reloadBtn = document.getElementById('reloadBtn');
const result = document.getElementById('result');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const msg = document.getElementById('msg');

const CHARSETS = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.<>/?|~'
};
const AMBIGUOUS = /[O0Il1]/g;

function showMsg(text, isError = false) {
    msg.textContent = text;
    msg.style.color = isError ? 'crimson' : '';
}

function getCharset() {
    let set = '';
    if (lowercase.checked) set += CHARSETS.lower;
    if (uppercase.checked) set += CHARSETS.upper;
    if (numbers.checked) set += CHARSETS.numbers;
    if (symbols.checked) set += CHARSETS.symbols;
    if (noAmbiguous.checked) set = set.replace(AMBIGUOUS, '');
    return set;
}

function secureRandomInt(max) {
    // retorna entero entre 0 y max-1
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

function generatePassword() {
    const len = Math.max(4, Math.min(256, Number(lengthInput.value) || 16));
    const charset = getCharset();
    if (!charset) {
        showMsg('Selecciona al menos un tipo de carácter', true);
        return '';
    }

    // Asegurar que al menos un caracter de cada tipo seleccionado aparece
    const required = [];
    if (lowercase.checked) required.push(pickRandom(CHARSETS.lower));
    if (uppercase.checked) required.push(pickRandom(CHARSETS.upper));
    if (numbers.checked) required.push(pickRandom(CHARSETS.numbers));
    if (symbols.checked) required.push(pickRandom(CHARSETS.symbols));

    const remaining = len - required.length;
    const chars = [];
    for (let i = 0; i < remaining; i++) chars.push(pickRandom(charset));
    // mezclar required dentro
    const all = chars.concat(required);
    shuffleArray(all);
    return all.join('');
}

function pickRandom(str) {
    const idx = secureRandomInt(str.length);
    return str.charAt(idx);
}

function shuffleArray(arr) {
    // Fisher-Yates usando crypto RNG
    for (let i = arr.length - 1; i > 0; i--) {
        const j = secureRandomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function calcEntropy(password) {
    // Estimación básica: log2(charset_size^length) = length * log2(charset_size)
    const charset = new Set(password.split(''));
    const charsetSize = charset.size || 1;
    const entropy = password.length * Math.log2(charsetSize);
    return Math.round(entropy);
}

function updateStrength(pw) {
    if (!pw) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'progress-bar';
        strengthText.textContent = '—';
        return;
    }
    const entropy = calcEntropy(pw);
    let pct = Math.min(100, Math.round((entropy / 80) * 100)); // 80 bits considered very strong
    strengthBar.style.width = pct + '%';
    strengthBar.classList.remove('bg-success', 'bg-warning', 'bg-danger');
    if (entropy >= 80) { strengthBar.classList.add('bg-success'); strengthText.textContent = `${entropy} bits — Muy fuerte`; }
    else if (entropy >= 50) { strengthBar.classList.add('bg-warning'); strengthText.textContent = `${entropy} bits — Bien`; }
    else { strengthBar.classList.add('bg-danger'); strengthText.textContent = `${entropy} bits — Débil`; }
}

function setResult(pw) {
    result.textContent = pw || '(aquí aparecerá la contraseña)';
    if (pw) { copyBtn.disabled = false; } else { copyBtn.disabled = true; }
    updateStrength(pw);
}

// Fallback copy function using a temporary textarea and execCommand
function fallbackCopyTextToClipboard(text) {
    return new Promise((resolve, reject) => {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            // Move it off-screen
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);

            const selection = document.getSelection && document.getSelection();
            const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);

            const ok = document.execCommand && document.execCommand('copy');

            document.body.removeChild(textarea);

            // restore previous selection
            if (range && selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }

            if (ok) resolve();
            else reject(new Error('execCommand copy failed'));
        } catch (err) {
            reject(err);
        }
    });
}

async function copyPassword() {
    const text = result.textContent;
    if (!text || text.includes('(aquí aparecerá')) return;

    // Primero intenta la API moderna
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showMsg('Contraseña copiada al portapapeles');
            return;
        }
    } catch (e) {
        // Si falla por políticas de permisos, intentaremos el fallback
        console.warn('navigator.clipboard.writeText falló:', e);
    }

    // Fallback a execCommand
    try {
        await fallbackCopyTextToClipboard(text);
        showMsg('Contraseña copiada al portapapeles (fallback)');
    } catch (e) {
        showMsg('Error al copiar: ' + (e && e.message ? e.message : e), true);
        console.error('Copy failed:', e);
    }
}

generateBtn?.addEventListener('click', () => {
    const pw = generatePassword();
    if (pw) { setResult(pw); showMsg('Contraseña generada'); }
});

reloadBtn?.addEventListener('click', () => {
    const pw = generatePassword();
    if (pw) { setResult(pw); showMsg('Contraseña regenerada'); }
});

copyBtn?.addEventListener('click', copyPassword);

// generar una por defecto al cargar
(() => {
    const pw = generatePassword();
    if (pw) setResult(pw);
})();
