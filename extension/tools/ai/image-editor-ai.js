let geminiAPI;
let currentImage = null;

document.addEventListener('DOMContentLoaded', async () => {
    const apiKey = GeminiStorage.get();
    if (apiKey) {
        geminiAPI = new GeminiAPI(apiKey);
        showTool();
    }

    document.getElementById('saveKeyBtn').addEventListener('click', saveApiKey);
    document.getElementById('removeKeyBtn').addEventListener('click', removeApiKey);
    document.getElementById('imageInput').addEventListener('change', handleImageUpload);
    document.getElementById('editBtn').addEventListener('click', editImage);
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

async function handleImageUpload() {
    const file = document.getElementById('imageInput').files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        return alert('❌ Please select an image file');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        const base64 = dataUrl.split(',')[1];
        currentImage = {
            base64: base64,
            mimeType: file.type,
            dataUrl: dataUrl
        };
        
        document.getElementById('previewImg').src = dataUrl;
        document.getElementById('imagePreview').classList.remove('d-none');
        document.getElementById('editBtn').disabled = false;
    };
    reader.readAsDataURL(file);
}

async function editImage() {
    const instruction = document.getElementById('instructionText').value.trim();
    const btn = document.getElementById('editBtn');

    if (!currentImage) return alert('❌ Please upload an image first');
    if (!instruction) return alert('❌ Please enter editing instructions');

    btn.disabled = true;
    btn.textContent = '⏳ Editing... (may take 10-30 seconds)';

    try {
        const result = await geminiAPI.editImage(instruction, currentImage.base64, currentImage.mimeType);
        
        if (result.image) {
            const imgElement = document.getElementById('editedImg');
            imgElement.src = `data:image/png;base64,${result.image}`;
            document.getElementById('resultSection').classList.remove('d-none');
        }
        
        if (result.text) {
            document.getElementById('textResponse').innerHTML = result.text;
            document.getElementById('textResponse').classList.remove('d-none');
        }
        
        if (!result.image && !result.text) {
            alert('❌ No edited image generated. Please try again with different instructions.');
        }
    } catch (error) {
        if (error.message.includes('quota')) {
            alert('❌ Quota exceeded. Nano Banana requires a paid API key. Please check your billing at https://aistudio.google.com/');
        } else {
            alert(`❌ Error: ${error.message}`);
        }
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Edit Image with AI';
    }
}

function downloadImage() {
    const img = document.getElementById('editedImg');
    const a = document.createElement('a');
    a.href = img.src;
    a.download = `edited-image-${new Date().toISOString().slice(0,10)}.png`;
    a.click();
}

function resetTool() {
    document.getElementById('imageInput').value = '';
    document.getElementById('instructionText').value = '';
    document.getElementById('imagePreview').classList.add('d-none');
    document.getElementById('resultSection').classList.add('d-none');
    document.getElementById('textResponse').classList.add('d-none');
    document.getElementById('editBtn').disabled = true;
    currentImage = null;
}
