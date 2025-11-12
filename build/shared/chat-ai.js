// AI Chat - Shared script for web and extension
let gemini = null;
const isExtension = typeof chrome !== 'undefined' && chrome.storage;
const Storage = isExtension ? ChromeGeminiStorage : GeminiStorage;

window.addEventListener('DOMContentLoaded', async () => {
    const hasKey = isExtension ? await Storage.exists() : Storage.exists();
    if (hasKey) {
        const apiKey = isExtension ? await Storage.get() : Storage.get();
        gemini = new GeminiAPI(apiKey);
        showChat();
    }
});

async function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        alert('❌ Por favor ingresa una API key');
        return;
    }

    gemini = new GeminiAPI(apiKey);
    
    const btn = document.getElementById('sendBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Validando...';
    
    try {
        const valid = await gemini.validateKey();
        if (valid) {
            if (isExtension) {
                await Storage.save(apiKey);
            } else {
                Storage.save(apiKey);
            }
            showChat();
            alert('✅ API Key guardada correctamente');
        } else {
            alert('❌ API Key inválida. Verifica que sea correcta.');
        }
    } catch (error) {
        console.error('Validation error:', error);
        alert(`❌ Error al validar: ${error.message}\n\nVerifica:\n1. Que la API key sea correcta\n2. Que tengas habilitada la API de Gemini\n3. Tu conexión a internet`);
    } finally {
        btn.disabled = false;
        btn.textContent = '📤 Enviar';
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

function showChat() {
    document.getElementById('apiKeySetup').classList.add('d-none');
    document.getElementById('apiKeyManage').classList.remove('d-none');
    document.getElementById('chatSection').classList.remove('d-none');
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    document.getElementById('typingIndicator').style.display = 'block';
    document.getElementById('sendBtn').disabled = true;

    try {
        const response = await gemini.chat(message);
        addMessage(response, 'assistant');
    } catch (error) {
        addMessage(`❌ Error: ${error.message}`, 'assistant');
    } finally {
        document.getElementById('typingIndicator').style.display = 'none';
        document.getElementById('sendBtn').disabled = false;
        input.focus();
    }
}

function addMessage(text, role) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const label = role === 'user' ? 'Tú' : 'Asistente IA';
    const formattedText = formatMessage(text);
    
    messageDiv.innerHTML = `
        <strong>${label}</strong>
        <div class="mt-2">${formattedText}</div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function formatMessage(text) {
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function clearChat() {
    if (confirm('¿Limpiar todo el chat?')) {
        document.getElementById('chatMessages').innerHTML = `
            <div class="message assistant">
                <strong>Asistente IA</strong>
                <p class="mb-0 mt-2">¡Hola! Soy tu asistente con IA. ¿En qué puedo ayudarte hoy?</p>
            </div>
        `;
    }
}

function exportChat() {
    const messages = document.getElementById('chatMessages').innerText;
    const blob = new Blob([messages], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-ia-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
