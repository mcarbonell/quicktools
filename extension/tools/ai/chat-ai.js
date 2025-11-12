// Chat AI - Extension Script
let chatUI;

async function init() {
    console.log('🚀 Inicializando Chat IA en extensión');
    
    chatUI = new ChatUI({
        storage: ChromeGeminiStorage,
        translations: {
            userLabel: 'Tú',
            assistantLabel: 'Asistente IA',
            welcomeMessage: '¡Hola! Soy tu asistente con IA. ¿En qué puedo ayudarte hoy?'
        }
    });

    const hasKey = await chatUI.init();
    console.log('🔑 ¿Tiene API key?', hasKey);
    
    if (hasKey) {
        const key = await ChromeGeminiStorage.get();
        console.log('🔑 API key encontrada:', key ? key.substring(0, 10) + '...' : 'vacía');
        showChat();
    }

    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('saveKeyBtn').addEventListener('click', saveApiKey);
    document.getElementById('removeKeyBtn').addEventListener('click', removeApiKey);
    document.getElementById('clearBtn').addEventListener('click', clearChat);
    document.getElementById('exportBtn').addEventListener('click', () => chatUI.exportChat());
    
    chatUI.setupEventListeners();
}

async function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        alert('❌ Por favor ingresa una API key');
        return;
    }

    const btn = document.getElementById('saveKeyBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Validando...';

    try {
        await chatUI.saveApiKey(apiKey);
        showChat();
        alert('✅ API Key guardada correctamente');
    } catch (error) {
        alert(`❌ Error: ${error.message}\n\nVerifica:\n1. Que la API key sea correcta\n2. Que tengas habilitada la API de Gemini\n3. Tu conexión a internet`);
    } finally {
        btn.disabled = false;
        btn.textContent = '💾 Guardar';
    }
}

async function removeApiKey() {
    if (confirm('¿Seguro que quieres eliminar la API key?')) {
        console.log('🗑️ Eliminando API key...');
        await chatUI.removeApiKey();
        
        // Verificar que se eliminó
        const stillExists = await ChromeGeminiStorage.exists();
        console.log('🔑 ¿Aún existe?', stillExists);
        
        if (!stillExists) {
            location.reload();
        } else {
            alert('❌ Error: No se pudo eliminar la API key');
        }
    }
}

function showChat() {
    document.getElementById('apiKeySetup').classList.add('d-none');
    document.getElementById('apiKeyManage').classList.remove('d-none');
    document.getElementById('chatSection').classList.remove('d-none');
}

function clearChat() {
    if (confirm('¿Limpiar todo el chat?')) {
        chatUI.clearChat();
    }
}

init();
