let ai;
let sourceLang = 'auto';

window.addEventListener('DOMContentLoaded', async () => {
    ai = new HybridAI();
    await ai.init();
    updateUI();
});

function updateUI() {
    const apiKeySetup = document.getElementById('apiKeySetup');
    const apiKeyManage = document.getElementById('apiKeyManage');
    const toolSection = document.getElementById('toolSection');
    
    if (ai.hasChromeAI || ai.hasGeminiAPI) {
        apiKeySetup.classList.add('d-none');
        toolSection.classList.remove('d-none');
        
        if (ai.hasGeminiAPI) {
            apiKeyManage.classList.remove('d-none');
        }
    }
}

document.getElementById('saveKeyBtn')?.addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) return alert('❌ Enter API key');
    
    await ChromeGeminiStorage.save(apiKey);
    await ai.init();
    updateUI();
});

document.getElementById('removeKeyBtn')?.addEventListener('click', async () => {
    await ChromeGeminiStorage.remove();
    location.reload();
});

document.getElementById('detectBtn')?.addEventListener('click', async () => {
    const text = document.getElementById('inputText').value;
    if (!text.trim()) return alert('❌ Enter text');
    
    const btn = document.getElementById('detectBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Detecting...';
    
    try {
        const result = await ai.detectLanguage(text);
        sourceLang = result.language;
        document.getElementById('detectedLang').textContent = `Detected: ${result.language}`;
    } catch (error) {
        alert(`❌ ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '🔍 Detect';
    }
});

document.getElementById('translateBtn')?.addEventListener('click', async () => {
    const text = document.getElementById('inputText').value;
    const targetLang = document.getElementById('targetLangSelect').value;
    const btn = document.getElementById('translateBtn');
    const output = document.getElementById('translationOutput');
    
    if (!text.trim()) return alert('❌ Enter text');
    
    btn.disabled = true;
    btn.textContent = '⏳ Translating...';
    output.textContent = '';
    document.getElementById('resultSection').classList.remove('d-none');
    
    try {
        const result = await ai.translate(text, sourceLang, targetLang);
        output.textContent = result;
    } catch (error) {
        alert(`❌ ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '🌐 Translate';
    }
});

document.getElementById('copyBtn')?.addEventListener('click', () => {
    const text = document.getElementById('translationOutput').innerText;
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied'));
});

document.getElementById('downloadBtn')?.addEventListener('click', () => {
    const text = document.getElementById('translationOutput').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('swapBtn')?.addEventListener('click', () => {
    const input = document.getElementById('inputText');
    const output = document.getElementById('translationOutput');
    const temp = input.value;
    input.value = output.innerText;
    output.textContent = temp;
});
