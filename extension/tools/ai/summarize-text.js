let summarizeUI;

document.addEventListener('DOMContentLoaded', async () => {
    summarizeUI = new SummarizeUI({
        storage: ChromeGeminiStorage,
        translations: {}
    });
    await summarizeUI.init();

    document.getElementById('saveKeyBtn').onclick = saveApiKey;
    document.getElementById('removeKeyBtn').onclick = removeApiKey;
    document.getElementById('summarizeBtn').onclick = summarizeText;
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
        const success = await summarizeUI.saveApiKey(apiKey);
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
    if (confirm('Remove API key?')) summarizeUI.removeApiKey();
}

async function summarizeText() {
    const text = document.getElementById('inputText').value;
    const length = document.getElementById('lengthSelect').value;
    const btn = document.getElementById('summarizeBtn');

    if (!text.trim()) return alert('❌ Enter text');

    btn.disabled = true;
    btn.textContent = '⏳ Summarizing...';

    try {
        const summary = await summarizeUI.summarize(text, length);
        const formatted = summarizeUI.formatText(summary);
        document.getElementById('summaryOutput').innerHTML = formatted;
        document.getElementById('resultSection').classList.remove('d-none');
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Summarize';
    }
}

function copyResult() {
    const text = document.getElementById('summaryOutput').innerText;
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied'));
}

function downloadResult() {
    const text = document.getElementById('summaryOutput').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
