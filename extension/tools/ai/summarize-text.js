let ai;

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

document.getElementById('summarizeBtn')?.addEventListener('click', async () => {
    const text = document.getElementById('inputText').value;
    const length = document.getElementById('lengthSelect').value;
    const btn = document.getElementById('summarizeBtn');
    const output = document.getElementById('summaryOutput');
    
    if (!text.trim()) return alert('❌ Enter text');
    
    btn.disabled = true;
    btn.textContent = '⏳ Summarizing...';
    output.textContent = '';
    document.getElementById('resultSection').classList.remove('d-none');
    
    try {
        await ai.summarize(text, { length }, (chunk) => {
            output.textContent += chunk;
        });
    } catch (error) {
        alert(`❌ ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Summarize';
    }
});

document.getElementById('copyBtn')?.addEventListener('click', () => {
    const text = document.getElementById('summaryOutput').innerText;
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied'));
});

document.getElementById('downloadBtn')?.addEventListener('click', () => {
    const text = document.getElementById('summaryOutput').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
});
