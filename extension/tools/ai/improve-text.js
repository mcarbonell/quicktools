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

document.getElementById('improveBtn')?.addEventListener('click', async () => {
    const text = document.getElementById('inputText').value;
    const mode = document.getElementById('modeSelect').value;
    const btn = document.getElementById('improveBtn');
    const output = document.getElementById('improvedOutput');
    
    if (!text.trim()) return alert('❌ Enter text');
    
    btn.disabled = true;
    btn.textContent = '⏳ Improving...';
    output.textContent = '';
    document.getElementById('resultSection').classList.remove('d-none');
    
    try {
        const toneMap = {
            'professional': 'more-formal',
            'casual': 'more-casual',
            'grammar': 'as-is',
            'clarity': 'as-is',
            'concise': 'as-is'
        };
        
        await ai.improveText(text, { tone: toneMap[mode] }, (chunk) => {
            output.textContent += chunk;
        });
    } catch (error) {
        alert(`❌ ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Improve Text';
    }
});

document.getElementById('copyBtn')?.addEventListener('click', () => {
    const text = document.getElementById('improvedOutput').innerText;
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied'));
});

document.getElementById('downloadBtn')?.addEventListener('click', () => {
    const text = document.getElementById('improvedOutput').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `improved-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
});
