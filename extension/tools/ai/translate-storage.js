// Chrome Storage Adapter for AI Translator
const ChromeGeminiStorage = {
    KEY: 'gemini_api_key',
    
    async save(apiKey) {
        await chrome.storage.local.set({ [this.KEY]: apiKey });
    },
    
    async get() {
        const result = await chrome.storage.local.get(this.KEY);
        return result[this.KEY] || '';
    },
    
    async remove() {
        await chrome.storage.local.remove(this.KEY);
    },
    
    async exists() {
        const value = await this.get();
        return !!value;
    }
};
