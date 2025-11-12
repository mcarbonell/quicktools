// hybrid-ai.js - Intelligent AI system with Chrome APIs + Gemini Cloud fallback
// Priority: Chrome Built-in APIs (free, private) → Gemini Cloud (API key required)

class HybridAI {
    constructor() {
        this.chromeAI = null;
        this.geminiAPI = null;
        this.availability = null;
    }

    async init() {
        // Check Chrome APIs availability
        this.availability = await this.checkChromeAPIs();
        
        // Load Gemini API if available
        if (typeof GeminiAPI !== 'undefined') {
            const storage = typeof chrome !== 'undefined' && chrome.storage 
                ? await chrome.storage.local.get('gemini_api_key')
                : { gemini_api_key: localStorage.getItem('gemini_api_key') };
            
            if (storage.gemini_api_key) {
                this.geminiAPI = new GeminiAPI(storage.gemini_api_key);
            }
        }
        
        return this.availability;
    }

    async checkChromeAPIs() {
        return {
            prompt: 'LanguageModel' in self,
            summarizer: 'Summarizer' in self,
            translator: 'Translator' in self,
            detector: 'LanguageDetector' in self,
            writer: 'Writer' in self,
            rewriter: 'Rewriter' in self,
            proofreader: 'Proofreader' in self
        };
    }

    // ====================
    // SUMMARIZE
    // ====================

    async summarize(text, options = {}, onChunk = null) {
        // Try Chrome Summarizer API first
        if (this.availability?.summarizer) {
            try {
                if (!this.chromeAI) this.chromeAI = new ChromeAI();
                if (onChunk) {
                    for await (const chunk of this.chromeAI.summarizeStreaming(text, options)) {
                        onChunk(chunk);
                    }
                    return;
                } else {
                    return await this.chromeAI.summarize(text, options);
                }
            } catch (error) {
                console.warn('Chrome Summarizer failed, falling back to Gemini:', error);
            }
        }

        // Fallback to Gemini Cloud
        if (this.geminiAPI) {
            const prompt = `Summarize the following text concisely:\n\n${text}`;
            if (onChunk) {
                for await (const chunk of this.geminiAPI.generateTextStream(prompt)) {
                    onChunk(chunk);
                }
                return;
            } else {
                return await this.geminiAPI.generateText(prompt);
            }
        }

        throw new Error('No AI service available. Enable Chrome AI or add Gemini API key.');
    }

    async *summarizeStreaming(text, options = {}) {
        // Try Chrome Summarizer API first
        if (this.availability?.summarizer) {
            try {
                if (!this.chromeAI) this.chromeAI = new ChromeAI();
                for await (const chunk of this.chromeAI.summarizeStreaming(text, options)) {
                    yield chunk;
                }
                return;
            } catch (error) {
                console.warn('Chrome Summarizer failed, falling back to Gemini:', error);
            }
        }

        // Fallback to Gemini Cloud
        if (this.geminiAPI) {
            const prompt = `Summarize the following text concisely:\n\n${text}`;
            for await (const chunk of this.geminiAPI.generateTextStream(prompt)) {
                yield chunk;
            }
            return;
        }

        throw new Error('No AI service available');
    }

    // ====================
    // IMPROVE TEXT
    // ====================

    async improveText(text, options = {}) {
        // Try Chrome Rewriter API first
        if (this.availability?.rewriter) {
            try {
                if (!this.chromeAI) this.chromeAI = new ChromeAI();
                return await this.chromeAI.rewrite(text, { tone: 'formal', ...options });
            } catch (error) {
                console.warn('Chrome Rewriter failed, falling back to Gemini:', error);
            }
        }

        // Fallback to Gemini Cloud
        if (this.geminiAPI) {
            const prompt = `Improve the following text (grammar, clarity, style):\n\n${text}`;
            return await this.geminiAPI.generateText(prompt);
        }

        throw new Error('No AI service available');
    }

    async *improveTextStreaming(text, options = {}) {
        // Try Chrome Rewriter API first
        if (this.availability?.rewriter) {
            try {
                if (!this.chromeAI) this.chromeAI = new ChromeAI();
                for await (const chunk of this.chromeAI.rewriteStreaming(text, { tone: 'formal', ...options })) {
                    yield chunk;
                }
                return;
            } catch (error) {
                console.warn('Chrome Rewriter failed, falling back to Gemini:', error);
            }
        }

        // Fallback to Gemini Cloud
        if (this.geminiAPI) {
            const prompt = `Improve the following text (grammar, clarity, style):\n\n${text}`;
            for await (const chunk of this.geminiAPI.generateTextStream(prompt)) {
                yield chunk;
            }
            return;
        }

        throw new Error('No AI service available');
    }

    // ====================
    // TRANSLATE
    // ====================

    async translate(text, sourceLang, targetLang) {
        // Try Chrome Translator API first
        if (this.availability?.translator) {
            try {
                if (!this.chromeAI) this.chromeAI = new ChromeAI();
                return await this.chromeAI.translate(text, sourceLang, targetLang);
            } catch (error) {
                console.warn('Chrome Translator failed, falling back to Gemini:', error);
            }
        }

        // Fallback to Gemini Cloud
        if (this.geminiAPI) {
            const prompt = `Translate from ${sourceLang} to ${targetLang}:\n\n${text}`;
            return await this.geminiAPI.generateText(prompt);
        }

        throw new Error('No AI service available');
    }

    // ====================
    // DETECT LANGUAGE
    // ====================

    async detectLanguage(text) {
        // Try Chrome Language Detector API first
        if (this.availability?.detector) {
            try {
                if (!this.chromeAI) this.chromeAI = new ChromeAI();
                return await this.chromeAI.detectLanguage(text);
            } catch (error) {
                console.warn('Chrome Detector failed, falling back to Gemini:', error);
            }
        }

        // Fallback to Gemini Cloud
        if (this.geminiAPI) {
            const prompt = `Detect the language of this text and respond with only the ISO 639-1 code (e.g., 'en', 'es', 'fr'):\n\n${text}`;
            const result = await this.geminiAPI.generateText(prompt);
            return { language: result.trim().toLowerCase(), confidence: 0.8 };
        }

        throw new Error('No AI service available');
    }

    // ====================
    // CHAT
    // ====================

    async chat(message, options = {}) {
        // Try Chrome Prompt API first
        if (this.availability?.prompt) {
            try {
                if (!this.chromeAI) this.chromeAI = new ChromeAI();
                return await this.chromeAI.prompt(message);
            } catch (error) {
                console.warn('Chrome Prompt failed, falling back to Gemini:', error);
            }
        }

        // Fallback to Gemini Cloud
        if (this.geminiAPI) {
            return await this.geminiAPI.generateText(message);
        }

        throw new Error('No AI service available');
    }

    async *chatStreaming(message, options = {}) {
        // Try Chrome Prompt API first
        if (this.availability?.prompt) {
            try {
                if (!this.chromeAI) this.chromeAI = new ChromeAI();
                for await (const chunk of this.chromeAI.promptStreaming(message)) {
                    yield chunk;
                }
                return;
            } catch (error) {
                console.warn('Chrome Prompt failed, falling back to Gemini:', error);
            }
        }

        // Fallback to Gemini Cloud
        if (this.geminiAPI) {
            for await (const chunk of this.geminiAPI.generateTextStream(message)) {
                yield chunk;
            }
            return;
        }

        throw new Error('No AI service available');
    }

    // ====================
    // PROOFREAD
    // ====================

    async proofread(text) {
        // Try Chrome Proofreader API first
        if (this.availability?.proofreader) {
            try {
                if (!this.chromeAI) this.chromeAI = new ChromeAI();
                return await this.chromeAI.proofread(text);
            } catch (error) {
                console.warn('Chrome Proofreader failed, falling back to Gemini:', error);
            }
        }

        // Fallback to Gemini Cloud
        if (this.geminiAPI) {
            const prompt = `Check this text for grammar and spelling errors. Return corrections in JSON format:\n\n${text}`;
            const result = await this.geminiAPI.generateText(prompt);
            return { correctedInput: result, corrections: [] };
        }

        throw new Error('No AI service available');
    }

    // ====================
    // UTILITY
    // ====================

    get hasChromeAI() {
        return this.availability && Object.values(this.availability).some(v => v);
    }

    get hasGeminiAPI() {
        return !!this.geminiAPI;
    }

    getAvailableServices() {
        const services = [];
        
        if (this.availability?.prompt) services.push('Chrome Prompt API (Local)');
        if (this.availability?.summarizer) services.push('Chrome Summarizer API (Local)');
        if (this.availability?.translator) services.push('Chrome Translator API (Local)');
        if (this.availability?.detector) services.push('Chrome Language Detector API (Local)');
        if (this.availability?.writer) services.push('Chrome Writer API (Local)');
        if (this.availability?.rewriter) services.push('Chrome Rewriter API (Local)');
        if (this.availability?.proofreader) services.push('Chrome Proofreader API (Local)');
        
        if (this.geminiAPI) services.push('Gemini Cloud API (API Key)');
        
        return services;
    }

    getPreferredService(feature) {
        const map = {
            summarize: this.availability?.summarizer ? 'Chrome Summarizer' : 'Gemini Cloud',
            improve: this.availability?.rewriter ? 'Chrome Rewriter' : 'Gemini Cloud',
            translate: this.availability?.translator ? 'Chrome Translator' : 'Gemini Cloud',
            detect: this.availability?.detector ? 'Chrome Detector' : 'Gemini Cloud',
            chat: this.availability?.prompt ? 'Chrome Prompt' : 'Gemini Cloud',
            proofread: this.availability?.proofreader ? 'Chrome Proofreader' : 'Gemini Cloud'
        };
        
        return map[feature] || 'Unknown';
    }

    destroy() {
        if (this.chromeAI) {
            this.chromeAI.destroy();
            this.chromeAI = null;
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HybridAI;
}

if (typeof window !== 'undefined') {
    window.HybridAI = HybridAI;
}
