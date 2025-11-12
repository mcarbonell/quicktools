// ====================
// VISION CHAT UI - Shared Library
// ====================

class VisionChatUI {
    constructor(config) {
        this.storage = config.storage;
        this.geminiAPI = null;
        this.translations = config.translations || {};
        this.currentImage = null;
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

    loadImage(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Please select an image file'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                const base64 = dataUrl.split(',')[1];
                this.currentImage = {
                    base64: base64,
                    mimeType: file.type,
                    dataUrl: dataUrl
                };
                resolve(dataUrl);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async analyzeImage(instruction) {
        if (!this.currentImage) {
            throw new Error('Please load an image first');
        }
        if (!instruction.trim()) {
            throw new Error('Please enter editing instructions');
        }

        const prompt = `Analyze this image and provide detailed suggestions for: ${instruction}`;
        const text = await this.geminiAPI.chatWithImage(prompt, this.currentImage.base64, this.currentImage.mimeType);
        return { text, image: null };
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
