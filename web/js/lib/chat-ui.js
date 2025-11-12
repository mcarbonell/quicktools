/**
 * Chat UI - Lógica reutilizable para chat con IA
 * Compatible con web y extensión
 */
class ChatUI {
    constructor(options = {}) {
        this.gemini = null;
        this.storage = options.storage || GeminiStorage; // Inyección de dependencia
        this.containerId = options.containerId || 'chatMessages';
        this.inputId = options.inputId || 'userInput';
        this.sendBtnId = options.sendBtnId || 'sendBtn';
        this.typingIndicatorId = options.typingIndicatorId || 'typingIndicator';
        this.translations = options.translations || {};
    }

    async init() {
        const exists = await this.storage.exists();
        if (exists) {
            const apiKey = await this.storage.get();
            this.gemini = new GeminiAPI(apiKey);
            return true;
        }
        return false;
    }

    async saveApiKey(apiKey) {
        if (!apiKey) {
            throw new Error('API key is required');
        }

        this.gemini = new GeminiAPI(apiKey);
        
        const valid = await this.gemini.validateKey();
        if (valid) {
            await this.storage.save(apiKey);
            return true;
        } else {
            throw new Error('Invalid API key');
        }
    }

    async removeApiKey() {
        await this.storage.remove();
    }

    async sendMessage(message) {
        if (!message || !this.gemini) return;

        this.addMessage(message, 'user');
        this.showTyping(true);
        this.setButtonState(false);

        try {
            const response = await this.gemini.chat(message);
            this.addMessage(response, 'assistant');
            return response;
        } catch (error) {
            const errorMsg = `❌ Error: ${error.message}`;
            this.addMessage(errorMsg, 'assistant');
            throw error;
        } finally {
            this.showTyping(false);
            this.setButtonState(true);
        }
    }

    addMessage(text, role) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const label = role === 'user' 
            ? (this.translations.userLabel || 'You')
            : (this.translations.assistantLabel || 'AI Assistant');
        
        const formattedText = this.formatMessage(text);
        
        messageDiv.innerHTML = `
            <strong>${label}</strong>
            <div class="mt-2">${formattedText}</div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    formatMessage(text) {
        // Code blocks (antes que inline code)
        text = text.replace(/```([\w]*)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
        
        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Bold
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        
        // Italic
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
        
        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // Listas (simple)
        text = text.replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Listas numeradas
        text = text.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>');
        
        // Line breaks
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    showTyping(show) {
        const indicator = document.getElementById(this.typingIndicatorId);
        if (indicator) {
            indicator.style.display = show ? 'block' : 'none';
        }
    }

    setButtonState(enabled) {
        const btn = document.getElementById(this.sendBtnId);
        if (btn) {
            btn.disabled = !enabled;
        }
    }

    clearChat() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const welcomeMsg = this.translations.welcomeMessage || 
            'Hi! I\'m your AI assistant. How can I help you today?';
        const assistantLabel = this.translations.assistantLabel || 'AI Assistant';

        container.innerHTML = `
            <div class="message assistant">
                <strong>${assistantLabel}</strong>
                <p class="mb-0 mt-2">${welcomeMsg}</p>
            </div>
        `;
    }

    exportChat() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const messages = container.innerText;
        const blob = new Blob([messages], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-ai-${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    setupEventListeners() {
        const input = document.getElementById(this.inputId);
        const sendBtn = document.getElementById(this.sendBtnId);

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const message = input.value.trim();
                    if (message) {
                        this.sendMessage(message);
                        input.value = '';
                    }
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                const message = input.value.trim();
                if (message) {
                    this.sendMessage(message);
                    input.value = '';
                }
            });
        }
    }
}
