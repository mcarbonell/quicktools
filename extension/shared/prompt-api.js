// prompt-api.js - Chrome Built-in Prompt API (Gemini Nano)
// Wrapper para usar la API de forma consistente en web y extensión

class PromptAPI {
    constructor() {
        this.session = null;
        this.isAvailable = false;
        this.isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
    }

    async checkAvailability() {
        if (!('LanguageModel' in self)) {
            return {
                available: false,
                reason: 'not_supported',
                message: 'Your browser doesn\'t support the Prompt API. Join the Early Preview Program to enable it.'
            };
        }

        try {
            const params = await LanguageModel.params();
            this.isAvailable = true;
            return {
                available: true,
                params: params
            };
        } catch (error) {
            return {
                available: false,
                reason: 'not_enabled',
                message: 'Prompt API is not enabled. Check chrome://flags/#prompt-api-for-gemini-nano'
            };
        }
    }

    async createSession(options = {}) {
        if (!this.isAvailable) {
            const check = await this.checkAvailability();
            if (!check.available) {
                throw new Error(check.message);
            }
        }

        const defaults = await LanguageModel.params();
        
        this.session = await LanguageModel.create({
            temperature: options.temperature ?? defaults.defaultTemperature,
            topK: options.topK ?? defaults.defaultTopK,
            initialPrompts: options.systemPrompt ? [{
                role: 'system',
                content: options.systemPrompt
            }] : []
        });

        return this.session;
    }

    async prompt(text) {
        if (!this.session) {
            await this.createSession();
        }

        return await this.session.prompt(text);
    }

    async *promptStreaming(text) {
        if (!this.session) {
            await this.createSession();
        }

        const stream = await this.session.promptStreaming(text);
        let previousChunk = '';
        
        for await (const chunk of stream) {
            const newChunk = chunk.startsWith(previousChunk)
                ? chunk.slice(previousChunk.length)
                : chunk;
            yield newChunk;
            previousChunk = chunk;
        }
    }

    async countTokens(text) {
        if (!this.session) {
            await this.createSession();
        }

        // Handle both API versions
        if (this.session.countPromptTokens) {
            return await this.session.countPromptTokens(text);
        } else if (this.session.measureInputUsage) {
            return await this.session.measureInputUsage(text);
        }
        return 0;
    }

    getStats() {
        if (!this.session) return null;

        return {
            temperature: this.session.temperature,
            topK: this.session.topK,
            maxTokens: this.session.inputQuota || this.session.maxTokens,
            tokensUsed: this.session.inputUsage || this.session.tokensSoFar,
            tokensLeft: this.session.tokensSoFar || (this.session.inputQuota - this.session.inputUsage)
        };
    }

    destroy() {
        if (this.session) {
            this.session.destroy();
            this.session = null;
        }
    }
}

// Export for both module and global usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptAPI;
}

if (typeof window !== 'undefined') {
    window.PromptAPI = PromptAPI;
}
