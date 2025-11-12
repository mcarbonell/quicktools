// Chat PDF - Extension Script (Simplified - Text extraction only)
let gemini = null;
let pdfText = '';

async function init() {
    console.log('🚀 Inicializando Chat con PDF');
    
    const hasKey = await ChromeGeminiStorage.exists();
    console.log('🔑 ¿Tiene API key?', hasKey);
    
    if (hasKey) {
        const apiKey = await ChromeGeminiStorage.get();
        console.log('🔑 API key encontrada:', apiKey ? apiKey.substring(0, 10) + '...' : 'vacía');
        gemini = new GeminiAPI(apiKey);
        document.getElementById('apiKeySetup').classList.add('d-none');
        document.getElementById('toolSection').classList.remove('d-none');
    } else {
        console.log('❌ No se encontró API key');
    }
    
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('loadBtn').addEventListener('click', loadDocument);
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
}

function loadDocument() {
    const text = document.getElementById('pdfText').value.trim();
    
    if (!text) {
        alert('❌ Por favor pega el texto del documento');
        return;
    }
    
    pdfText = text;
    console.log('✅ Documento cargado:', pdfText.length, 'caracteres');
    
    document.getElementById('chatSection').classList.remove('d-none');
    document.getElementById('loadBtn').textContent = '✅ Documento cargado (' + pdfText.length + ' caracteres)';
    document.getElementById('loadBtn').disabled = true;
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    if (!pdfText) {
        alert('❌ Primero carga un documento');
        return;
    }

    addMessage(message, 'user');
    input.value = '';
    document.getElementById('sendBtn').disabled = true;

    try {
        const prompt = `Basándote en el siguiente documento:\n\n${pdfText}\n\nResponde a esta pregunta: ${message}`;
        const response = await gemini.chat(prompt);
        addMessage(response, 'assistant');
    } catch (error) {
        addMessage(`❌ Error: ${error.message}`, 'assistant');
    } finally {
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
        <div style="margin-top: 0.5rem;">${formattedText}</div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function formatMessage(text) {
    // Mismo formateo que chat-ai
    text = text.replace(/```([\w]*)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

init();
