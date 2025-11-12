let improveTextUI;

document.addEventListener('DOMContentLoaded', async () => {
    improveTextUI = new ImproveTextUI({
        storage: ChromeGeminiStorage,
        translations: {}
    });
    await improveTextUI.init();

    document.getElementById('saveKeyBtn').onclick = saveApiKey;
    document.getElementById('removeKeyBtn').onclick = removeApiKey;
    document.getElementById('improveBtn').onclick = improveText;
    document.getElementById('copyBtn').onclick = copyResult;
    document.getElementById('downloadBtn').onclick = downloadResult;
});

async function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) return alert('❌ Enter API key');

    const btn = document.getElementById('saveKeyBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Validating...';

    try {
        const success = await improveTextUI.saveApiKey(apiKey);
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
    if (confirm('Remove API key?')) improveTextUI.removeApiKey();
}

async function improveText() {
    const text = document.getElementById('inputText').value;
    const mode = document.getElementById('modeSelect').value;
    const btn = document.getElementById('improveBtn');

    if (!text.trim()) return alert('❌ Enter text');

    btn.disabled = true;
    btn.textContent = '⏳ Improving...';

    try {
        const improved = await improveTextUI.improve(text, mode);
        const formatted = improveTextUI.formatText(improved);
        document.getElementById('improvedOutput').innerHTML = formatted;
        document.getElementById('resultSection').classList.remove('d-none');
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Improve Text';
    }
}

function copyResult() {
    const text = document.getElementById('improvedOutput').innerText;
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied'));
}

function downloadResult() {
    const text = document.getElementById('improvedOutput').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `improved-text-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
