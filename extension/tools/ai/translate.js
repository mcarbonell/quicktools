let translateUI;

document.addEventListener('DOMContentLoaded', async () => {
    translateUI = new TranslateUI({
        storage: ChromeGeminiStorage,
        translations: {},
        userLanguage: navigator.language.split('-')[0] || 'en'
    });
    await translateUI.init();
    document.getElementById('targetLangSelect').value = translateUI.userLanguage;

    document.getElementById('saveKeyBtn').onclick = saveApiKey;
    document.getElementById('removeKeyBtn').onclick = removeApiKey;
    document.getElementById('detectBtn').onclick = detectLanguage;
    document.getElementById('translateBtn').onclick = translateText;
    document.getElementById('copyBtn').onclick = copyResult;
    document.getElementById('downloadBtn').onclick = downloadResult;
    document.getElementById('swapBtn').onclick = swapLanguages;
});

async function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) return alert('❌ Enter API key');

    const btn = document.getElementById('saveKeyBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Validating...';

    try {
        const success = await translateUI.saveApiKey(apiKey);
        if (success) alert('✅ Saved');
        else alert('❌ Invalid key');
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '💾 Save';
    }
}

function removeApiKey() {
    if (confirm('Remove API key?')) translateUI.removeApiKey();
}

async function detectLanguage() {
    const text = document.getElementById('inputText').value;
    if (!text.trim()) return alert('❌ Enter text first');

    const span = document.getElementById('detectedLang');
    span.textContent = '⏳ Detecting...';

    try {
        const lang = await translateUI.detectLanguage(text);
        const langNames = { en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese' };
        span.textContent = `Detected: ${langNames[lang] || lang}`;
    } catch (error) {
        span.textContent = '❌ Failed';
    }
}

async function translateText() {
    const text = document.getElementById('inputText').value;
    const targetLang = document.getElementById('targetLangSelect').value;
    const btn = document.getElementById('translateBtn');

    if (!text.trim()) return alert('❌ Enter text');

    btn.disabled = true;
    btn.textContent = '⏳ Translating...';

    try {
        const translation = await translateUI.translate(text, targetLang);
        const formatted = translateUI.formatText(translation);
        document.getElementById('translationOutput').innerHTML = formatted;
        document.getElementById('resultSection').classList.remove('d-none');
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '🌐 Translate';
    }
}

function copyResult() {
    const text = document.getElementById('translationOutput').innerText;
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied'));
}

function downloadResult() {
    const text = document.getElementById('translationOutput').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function swapLanguages() {
    const input = document.getElementById('inputText');
    const output = document.getElementById('translationOutput');
    const temp = input.value;
    input.value = output.innerText;
    output.innerHTML = '';
    document.getElementById('resultSection').classList.add('d-none');
}
