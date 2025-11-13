// AI Chat - Shared script for web and extension
let ai = null;
const isExtension = typeof chrome !== 'undefined' && chrome.storage;

window.addEventListener('DOMContentLoaded', async () => {
    ai = new HybridAI();
    await ai.init();
    updateServiceStatus();
    
    if (ai.hasChromeAI || ai.hasGeminiAPI) {
        showChat();
    }
});

function updateServiceStatus() {
    const statusEl = document.getElementById('statusText');
    const configureBtn = document.getElementById('configureBtn');
    
    if (!statusEl) return;
    
    if (ai.hasChromeAI) {
        statusEl.textContent = '🏠 Using Chrome Local AI (Free, Private)';
        statusEl.parentElement.parentElement.className = 'alert alert-success';
    } else if (ai.hasGeminiAPI) {
        statusEl.textContent = '☁️ Using Gemini Cloud API';
        statusEl.parentElement.parentElement.className = 'alert alert-info';
    } else {
        statusEl.textContent = '⚠️ No AI service available';
        statusEl.parentElement.parentElement.className = 'alert alert-warning';
        if (configureBtn) configureBtn.classList.remove('d-none');
    }
}

function showApiKeySetup() {
    document.getElementById('apiKeySetup').classList.remove('d-none');
}

async function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) return alert('❌ Please enter an API key');

    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ Validating...';

    try {
        if (isExtension) {
            await chrome.storage.local.set({ gemini_api_key: apiKey });
        } else {
            localStorage.setItem('gemini_api_key', apiKey);
        }
        await ai.init();
        updateServiceStatus();
        showChat();
        document.getElementById('apiKeySetup').classList.add('d-none');
        alert('✅ API Key saved successfully');
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '💾 Save';
    }
}

function showChat() {
    document.getElementById('apiKeySetup').classList.add('d-none');
    document.getElementById('chatSection').classList.remove('d-none');
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

    try {
        await ai.chat(message, {}, (chunk) => {
            contentDiv.textContent += chunk;
            document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
        });
    } catch (error) {
        contentDiv.textContent = `❌ Error: ${error.message}`;
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
