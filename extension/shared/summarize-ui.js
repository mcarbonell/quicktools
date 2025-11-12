// ====================
// SUMMARIZE TEXT UI - Shared Library
// ====================

class SummarizeUI {
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

    async summarize(text, length = 'medium') {
        if (!text.trim()) {
            throw new Error('Please enter text to summarize');
        }

        const prompts = {
            short: 'Summarize the following text in 2-3 sentences, capturing only the most essential points. IMPORTANT: Write the summary in the SAME LANGUAGE as the input text:',
            medium: 'Summarize the following text in a concise paragraph (4-6 sentences), covering the main ideas. IMPORTANT: Write the summary in the SAME LANGUAGE as the input text:',
            long: 'Provide a detailed summary of the following text, including key points and important details. IMPORTANT: Write the summary in the SAME LANGUAGE as the input text:'
        };

        const prompt = `${prompts[length]}\n\n${text}`;
        return await this.geminiAPI.chat(prompt);
    }

    formatText(text) {
        // Format markdown-style text
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        text = text.replace(/\n/g, '<br>');
        return text;
    }
}
