// ====================
// TRANSLATE TEXT UI - Shared Library
// ====================

class TranslateUI {
    constructor(config) {
        this.storage = config.storage;
        this.geminiAPI = null;
        this.translations = config.translations || {};
        this.userLanguage = config.userLanguage || 'en';
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

    async detectLanguage(text) {
        const prompt = `Detect the language of this text and respond ONLY with the ISO 639-1 language code (2 letters, lowercase). Examples: en, es, fr, de, it, pt, ja, zh, ru, ar.\n\nText: ${text.substring(0, 200)}`;
        const response = await this.geminiAPI.chat(prompt, { maxTokens: 10 });
        return response.trim().toLowerCase();
    }

    async translate(text, targetLang) {
        if (!text.trim()) {
            throw new Error('Please enter text to translate');
        }

        const langNames = {
            en: 'English', es: 'Spanish', fr: 'French', de: 'German',
            it: 'Italian', pt: 'Portuguese', ja: 'Japanese', zh: 'Chinese',
            ru: 'Russian', ar: 'Arabic', ko: 'Korean', hi: 'Hindi',
            nl: 'Dutch', sv: 'Swedish', pl: 'Polish', tr: 'Turkish'
        };

        const targetName = langNames[targetLang] || targetLang;
        const prompt = `Translate the following text to ${targetName}. Provide ONLY the translation, no explanations:\n\n${text}`;
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
