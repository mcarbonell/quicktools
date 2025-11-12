let geminiAPI;

document.addEventListener('DOMContentLoaded', async () => {
    const apiKey = GeminiStorage.get();
    if (apiKey) {
        geminiAPI = new GeminiAPI(apiKey);
        showTool();
    }

    document.getElementById('saveKeyBtn').addEventListener('click', saveApiKey);
    document.getElementById('removeKeyBtn').addEventListener('click', removeApiKey);
    document.getElementById('generateBtn').addEventListener('click', generateImage);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('resetBtn').addEventListener('click', resetTool);
});

async function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) return alert('❌ Please enter an API key');

    const btn = document.getElementById('saveKeyBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Validating...';

    try {
        geminiAPI = new GeminiAPI(apiKey);
        const valid = await geminiAPI.validateKey();
        if (valid) {
            GeminiStorage.save(apiKey);
            showTool();
            alert('✅ API Key saved successfully');
        } else {
            alert('❌ Invalid API Key');
        }
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '💾 Save';
    }
}

function removeApiKey() {
    if (confirm('Remove API key?')) {
        GeminiStorage.remove();
        location.reload();
    }
}

function showTool() {
    document.getElementById('apiKeySetup').classList.add('d-none');
    document.getElementById('apiKeyManage').classList.remove('d-none');
    document.getElementById('toolSection').classList.remove('d-none');
}

async function generateImage() {
    const prompt = document.getElementById('promptText').value.trim();
    const btn = document.getElementById('generateBtn');

    if (!prompt) return alert('❌ Please enter a description');

    btn.disabled = true;
    btn.textContent = '⏳ Generating... (may take 10-30 seconds)';

    try {
        const result = await geminiAPI.editImage(prompt, null, null);
        
        if (result.image) {
            const imgElement = document.getElementById('generatedImg');
            imgElement.src = `data:image/png;base64,${result.image}`;
            document.getElementById('resultSection').classList.remove('d-none');
        }
        
        if (result.text) {
            document.getElementById('textResponse').innerHTML = result.text;
            document.getElementById('textResponse').classList.remove('d-none');
        }
        
        if (!result.image && !result.text) {
            alert('❌ No image generated. Please try again with a different prompt.');
        }
    } catch (error) {
        if (error.message.includes('quota')) {
            alert('❌ Quota exceeded. Nano Banana requires a paid API key. Please check your billing at https://aistudio.google.com/');
        } else {
            alert(`❌ Error: ${error.message}`);
        }
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Generate Image';
    }
}

function downloadImage() {
    const img = document.getElementById('generatedImg');
    const a = document.createElement('a');
    a.href = img.src;
    a.download = `generated-image-${new Date().toISOString().slice(0,10)}.png`;
    a.click();
}

function resetTool() {
    document.getElementById('promptText').value = '';
    document.getElementById('resultSection').classList.add('d-none');
    document.getElementById('textResponse').classList.add('d-none');
}
