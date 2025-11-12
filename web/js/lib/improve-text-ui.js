// ====================
// IMPROVE TEXT UI - Shared Library
// ====================

class ImproveTextUI {
    constructor(config) {
        this.storage = config.storage;
        this.geminiAPI = null;
        this.translations = config.translations || {};
    }

    async init() {
        if (await this.storage.exists()) {
            const apiKey = await this.storage.get();
            this.geminiAPI = new GeminiAPI(apiKey);
            this.showTool();
        }
    }

    async saveApiKey(apiKey) {
        this.geminiAPI = new GeminiAPI(apiKey);
        const valid = await this.geminiAPI.validateKey();
        if (valid) {
            await this.storage.save(apiKey);
            this.showTool();
            return true;
        }
        return false;
    }

    async removeApiKey() {
        await this.storage.remove();
        location.reload();
    }

    showTool() {
        document.getElementById('apiKeySetup').classList.add('d-none');
        document.getElementById('apiKeyManage').classList.remove('d-none');
        document.getElementById('toolSection').classList.remove('d-none');
    }

    async improve(text, mode = 'grammar') {
        if (!text.trim()) {
            throw new Error('Please enter text to improve');
        }

        const prompts = {
            grammar: 'Fix grammar, spelling, and punctuation errors in the following text. Keep the same tone and style. IMPORTANT: Write the improved text in the SAME LANGUAGE as the input:',
            clarity: 'Improve the clarity and readability of the following text. Make it easier to understand while keeping the original meaning. IMPORTANT: Write in the SAME LANGUAGE as the input:',
            professional: 'Rewrite the following text in a more professional and formal tone. IMPORTANT: Write in the SAME LANGUAGE as the input:',
            casual: 'Rewrite the following text in a more casual and friendly tone. IMPORTANT: Write in the SAME LANGUAGE as the input:',
            concise: 'Make the following text more concise and direct, removing unnecessary words. IMPORTANT: Write in the SAME LANGUAGE as the input:'
        };

        const prompt = `${prompts[mode]}\n\n${text}`;
        return await this.geminiAPI.chat(prompt);
    }

    formatText(text) {
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        text = text.replace(/\n/g, '<br>');
        return text;
    }
}
