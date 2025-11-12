// AI Image Editor - Shared script for web and extension
let geminiAPI;
let currentImage = null;
const isExtension = typeof chrome !== 'undefined' && chrome.storage;
const Storage = isExtension ? ChromeGeminiStorage : GeminiStorage;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveKeyBtn')?.addEventListener('click', saveApiKey);
    document.getElementById('removeKeyBtn')?.addEventListener('click', removeApiKey);
    document.getElementById('imageInput')?.addEventListener('change', handleImageUpload);
    document.getElementById('editBtn')?.addEventListener('click', editImage);
    document.getElementById('downloadBtn')?.addEventListener('click', downloadImage);
    document.getElementById('resetBtn')?.addEventListener('click', resetTool);
    init();
});

async function init() {
    const hasKey = isExtension ? await Storage.exists() : Storage.exists();
    if (hasKey) {
        const key = isExtension ? await Storage.get() : Storage.get();
        geminiAPI = new GeminiAPI(key);
        showTool();
    }
}

async function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        alert('❌ Por favor ingresa una API key');
        return;
    }

    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ Validando...';

    try {
        geminiAPI = new GeminiAPI(apiKey);
        const valid = await geminiAPI.validateKey();
        if (!valid) throw new Error('API key inválida');
        
        if (isExtension) {
            await Storage.save(apiKey);
        } else {
            Storage.save(apiKey);
        }
        
        showTool();
        alert('✅ API Key guardada correctamente');
    } catch (error) {
        alert(`❌ Error: ${error.message}\n\nVerifica:\n1. Que la API key sea correcta\n2. Que tengas facturación de pago habilitada\n3. Tu conexión a internet`);
    } finally {
        btn.disabled = false;
        btn.textContent = '💾 Guardar';
    }
}

async function removeApiKey() {
    if (confirm('¿Seguro que quieres eliminar la API key?')) {
        if (isExtension) {
            await Storage.remove();
        } else {
            Storage.remove();
        }
        location.reload();
    }
}

function showTool() {
    document.getElementById('apiKeySetup').classList.add('d-none');
    document.getElementById('apiKeyManage').classList.remove('d-none');
    document.getElementById('toolSection').classList.remove('d-none');
}

function handleImageUpload() {
    const file = document.getElementById('imageInput').files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('❌ Por favor selecciona un archivo de imagen');
        return;
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
    if (!currentImage) {
        alert('❌ Por favor sube una imagen primero');
        return;
    }
    if (!instruction) {
        alert('❌ Por favor ingresa instrucciones de edición');
        return;
    }

    const btn = document.getElementById('editBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Editando... (puede tardar 10-30 segundos)';

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
            alert('❌ No se generó imagen editada. Intenta con otras instrucciones.');
        }
    } catch (error) {
        if (error.message.includes('quota')) {
            alert('❌ Cuota excedida. Nano Banana requiere API key de pago. Verifica tu facturación en https://aistudio.google.com/');
        } else {
            alert(`❌ Error: ${error.message}`);
        }
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Editar Imagen con IA';
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
