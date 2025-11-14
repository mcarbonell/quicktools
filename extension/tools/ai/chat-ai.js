// AI Chat - Shared script for web and extension
let ai = null;
const isExtension = typeof chrome !== 'undefined' && chrome.storage;

window.addEventListener('DOMContentLoaded', async () => {
    ai = new HybridAI();
    
    // Obtener system prompt del perfil si existe
    let systemPrompt = '';
    let hasProfile = false;
    if (isExtension) {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'get-system-prompt' });
            console.log('📨 Respuesta get-system-prompt:', response);
            if (response && response.systemPrompt) {
                systemPrompt = response.systemPrompt;
                hasProfile = true;
                console.log('✅ Perfil de usuario cargado para personalización');
                console.log('📝 System prompt:', systemPrompt);
            } else {
                console.log('ℹ️ Sin perfil de usuario, usando chat genérico');
            }
        } catch (error) {
            console.log('❌ Error obteniendo perfil:', error);
        }
    }
    
    console.log('🤖 Inicializando AI con systemPrompt:', systemPrompt ? 'SÍ' : 'NO');
    await ai.init({ systemPrompt });
    
    // Setup event listeners
    document.getElementById('saveKeyBtn')?.addEventListener('click', saveApiKey);
    document.getElementById('removeKeyBtn')?.addEventListener('click', removeApiKey);
    document.getElementById('sendBtn')?.addEventListener('click', sendMessage);
    document.getElementById('userInput')?.addEventListener('keypress', handleKeyPress);
    document.getElementById('clearBtn')?.addEventListener('click', clearChat);
    document.getElementById('exportBtn')?.addEventListener('click', exportChat);
    
    // Check if we have AI available
    if (ai.hasChromeAI || ai.hasGeminiAPI) {
        document.getElementById('apiKeySetup').classList.add('d-none');
        document.getElementById('chatSection').classList.remove('d-none');
        
        // Show service status
        const statusDiv = document.getElementById('serviceStatus');
        const statusText = document.getElementById('statusText');
        const removeBtn = document.getElementById('removeKeyBtn');
        
        statusDiv.classList.remove('d-none');
        
        if (ai.hasChromeAI) {
            const profileText = hasProfile ? ', Personalizado' : '';
            statusText.textContent = `🏠 Usando IA Local de Chrome (Gratis, Privado${profileText})`;
            statusDiv.className = 'alert alert-success';
            removeBtn.classList.add('d-none');
        } else if (ai.hasGeminiAPI) {
            const profileText = hasProfile ? ', Personalizado' : '';
            statusText.textContent = `☁️ Usando Gemini Cloud API${profileText}`;
            statusDiv.className = 'alert alert-info';
            removeBtn.classList.remove('d-none');
        }
    } else {
        document.getElementById('apiKeySetup').classList.remove('d-none');
    }
});

async function removeApiKey() {
    if (!confirm('¿Eliminar API key?')) return;
    
    if (isExtension) {
        await chrome.storage.local.remove('gemini_api_key');
    } else {
        localStorage.removeItem('gemini_api_key');
    }
    
    location.reload();
}

async function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) return alert('❌ Ingresa una API key');

    const btn = document.getElementById('saveKeyBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Validando...';

    try {
        if (isExtension) {
            await chrome.storage.local.set({ gemini_api_key: apiKey });
        } else {
            localStorage.setItem('gemini_api_key', apiKey);
        }
        
        location.reload();
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
        btn.disabled = false;
        btn.textContent = '💾 Guardar';
    }
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    const typingIndicator = document.getElementById('typingIndicator');
    const sendBtn = document.getElementById('sendBtn');
    
    typingIndicator.style.display = 'block';
    sendBtn.disabled = true;

    const assistantMsg = addMessage('', 'assistant');
    const contentDiv = assistantMsg.querySelector('.message-content');

    let fullText = '';
    try {
        await ai.chat(message, {}, (chunk) => {
            fullText += chunk;
            contentDiv.innerHTML = formatMessage(fullText);
            document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
        });
    } catch (error) {
        contentDiv.innerHTML = `<span class="text-danger">❌ Error: ${error.message}</span>`;
    } finally {
        typingIndicator.style.display = 'none';
        sendBtn.disabled = false;
        input.focus();
    }
}

function addMessage(text, role) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const label = role === 'user' ? 'You' : 'AI Assistant';
    const formattedText = formatMessage(text);
    
    messageDiv.innerHTML = `
        <strong>${label}</strong>
        <div class="mt-2 message-content">${formattedText}</div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    return messageDiv;
}

function formatMessage(text) {
    // Code blocks
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    // Lists
    text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Line breaks
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
    if (confirm('Clear all chat?')) {
        document.getElementById('chatMessages').innerHTML = `
            <div class="message assistant">
                <strong>AI Assistant</strong>
                <p class="mb-0 mt-2">Hello! I'm your AI assistant. How can I help you today?</p>
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
    a.download = `ai-chat-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
