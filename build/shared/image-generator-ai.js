// AI Image Generator - Shared script for web and extension
let geminiAPI;
const isExtension = typeof chrome !== 'undefined' && chrome.storage;
const Storage = isExtension ? ChromeGeminiStorage : GeminiStorage;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveKeyBtn')?.addEventListener('click', saveApiKey);
    document.getElementById('removeKeyBtn')?.addEventListener('click', removeApiKey);
    document.getElementById('generateBtn')?.addEventListener('click', generateImage);
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

async function generateImage() {
    const prompt = document.getElementById('promptText').value.trim();
    if (!prompt) {
        alert('❌ Por favor ingresa una descripción');
        return;
    }

    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Generando... (puede tardar 10-30 segundos)';

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
            alert('❌ No se generó imagen. Intenta con otra descripción.');
        }
    } catch (error) {
        if (error.message.includes('quota')) {
            alert('❌ Cuota excedida. Nano Banana requiere API key de pago. Verifica tu facturación en https://aistudio.google.com/');
        } else {
            alert(`❌ Error: ${error.message}`);
        }
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Generar Imagen';
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
