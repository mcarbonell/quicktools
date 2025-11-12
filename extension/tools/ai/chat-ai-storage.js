/**
 * Storage Adapter para extensión - Compatible con ChatUI
 * Usa chrome.storage.local en lugar de localStorage
 */
const ChromeGeminiStorage = {
    KEY: 'gemini_api_key',
    
    async save(apiKey) {
        console.log('💾 ChromeStorage.save:', apiKey ? apiKey.substring(0, 10) + '...' : 'vacía');
        await chrome.storage.local.set({ [this.KEY]: apiKey });
        console.log('✅ Guardado en chrome.storage.local');
    },
    
    async get() {
        const result = await chrome.storage.local.get(this.KEY);
        const key = result[this.KEY] || '';
        console.log('🔍 ChromeStorage.get:', key ? key.substring(0, 10) + '...' : 'vacía');
        return key;
    },
    
    async remove() {
        console.log('🗑️ ChromeStorage.remove');
        await chrome.storage.local.remove(this.KEY);
        console.log('✅ Eliminado de chrome.storage.local');
    },
    
    async exists() {
        const key = await this.get();
        const exists = !!key;
        console.log('❓ ChromeStorage.exists:', exists);
        return exists;
    }
};
