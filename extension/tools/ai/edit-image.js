let editImageUI;

document.addEventListener('DOMContentLoaded', async () => {
    editImageUI = new EditImageUI({
        storage: ChromeGeminiStorage,
        translations: {}
    });
    await editImageUI.init();

    document.getElementById('saveKeyBtn').onclick = saveApiKey;
    document.getElementById('removeKeyBtn').onclick = removeApiKey;
    document.getElementById('imageInput').onchange = handleImageUpload;
    document.getElementById('editBtn').onclick = editImage;
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
        const success = await editImageUI.saveApiKey(apiKey);
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
    if (confirm('Remove API key?')) editImageUI.removeApiKey();
}

async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const dataUrl = await editImageUI.loadImage(file);
        document.getElementById('previewImg').src = dataUrl;
        document.getElementById('imagePreview').classList.remove('d-none');
        document.getElementById('editBtn').disabled = false;
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}

async function editImage() {
    const instruction = document.getElementById('instructionText').value;
    const btn = document.getElementById('editBtn');

    if (!instruction.trim()) return alert('❌ Enter instructions');

    btn.disabled = true;
    btn.textContent = '⏳ Analyzing...';

    try {
        const suggestions = await editImageUI.editImage(instruction);
        const formatted = editImageUI.formatText(suggestions);
        document.getElementById('suggestionsOutput').innerHTML = formatted;
        document.getElementById('resultSection').classList.remove('d-none');
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Analyze & Suggest';
    }
}

function copyResult() {
    const text = document.getElementById('suggestionsOutput').innerText;
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied'));
}

function downloadResult() {
    const text = document.getElementById('suggestionsOutput').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-suggestions-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
