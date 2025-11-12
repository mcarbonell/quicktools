// chrome-ai-apis.js - Unified wrapper for all Chrome Built-in AI APIs
// Supports: Prompt, Summarizer, Translator, Language Detector, Writer, Rewriter, Proofreader

class ChromeAI {
    constructor() {
        this.apis = {
            prompt: null,
            summarizer: null,
            translator: null,
            detector: null,
            writer: null,
            rewriter: null,
            proofreader: null
        };
    }

    // ====================
    // AVAILABILITY CHECKS
    // ====================

    async checkAll() {
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
    // PROMPT API
    // ====================

    async createPromptSession(options = {}) {
        if (!('LanguageModel' in self)) {
            throw new Error('Prompt API not available');
        }

        const defaults = await LanguageModel.params();
        this.apis.prompt = await LanguageModel.create({
            temperature: options.temperature ?? defaults.defaultTemperature,
            topK: options.topK ?? defaults.defaultTopK,
            initialPrompts: options.systemPrompt ? [{
                role: 'system',
                content: options.systemPrompt
            }] : []
        });

        return this.apis.prompt;
    }

    async prompt(text) {
        if (!this.apis.prompt) await this.createPromptSession();
        return await this.apis.prompt.prompt(text);
    }

    async *promptStreaming(text) {
        if (!this.apis.prompt) await this.createPromptSession();
        const stream = await this.apis.prompt.promptStreaming(text);
        let previousChunk = '';
        
        for await (const chunk of stream) {
            const newChunk = chunk.startsWith(previousChunk)
                ? chunk.slice(previousChunk.length)
                : chunk;
            yield newChunk;
            previousChunk = chunk;
        }
    }

    // ====================
    // SUMMARIZER API
    // ====================

    async createSummarizer(options = {}) {
        if (!('Summarizer' in self)) {
            throw new Error('Summarizer API not available');
        }

        const lang = document.documentElement.lang || 'en';
        const defaults = {
            type: 'tldr',
            format: 'plain-text',
            length: 'medium',
            outputLanguage: lang
        };

        this.apis.summarizer = await Summarizer.create({ ...defaults, ...options });
        return this.apis.summarizer;
    }

    async summarize(text, options = {}) {
        if (!this.apis.summarizer) await this.createSummarizer(options);
        return await this.apis.summarizer.summarize(text);
    }

    async *summarizeStreaming(text, options = {}) {
        if (!this.apis.summarizer) await this.createSummarizer(options);
        const stream = await this.apis.summarizer.summarizeStreaming(text);
        
        for await (const chunk of stream) {
            yield chunk;
        }
    }

    // ====================
    // TRANSLATOR API
    // ====================

    async createTranslator(sourceLanguage, targetLanguage) {
        if (!('Translator' in self)) {
            throw new Error('Translator API not available');
        }

        this.apis.translator = await Translator.create({
            sourceLanguage,
            targetLanguage
        });
        return this.apis.translator;
    }

    async translate(text, sourceLanguage = 'en', targetLanguage = 'es') {
        // Create new translator if languages changed
        if (!this.apis.translator || 
            this.apis.translator.sourceLanguage !== sourceLanguage ||
            this.apis.translator.targetLanguage !== targetLanguage) {
            await this.createTranslator(sourceLanguage, targetLanguage);
        }
        
        return await this.apis.translator.translate(text);
    }

    // ====================
    // LANGUAGE DETECTOR API
    // ====================

    async createDetector() {
        if (!('LanguageDetector' in self)) {
            throw new Error('Language Detector API not available');
        }

        this.apis.detector = await LanguageDetector.create();
        return this.apis.detector;
    }

    async detectLanguage(text) {
        if (!this.apis.detector) await this.createDetector();
        const results = await this.apis.detector.detect(text);
        
        // Return most likely language
        if (results && results.length > 0) {
            return {
                language: results[0].detectedLanguage,
                confidence: results[0].confidence,
                all: results
            };
        }
        return null;
    }

    // ====================
    // WRITER API
    // ====================

    async createWriter(options = {}) {
        if (!('Writer' in self)) {
            throw new Error('Writer API not available');
        }

        this.apis.writer = await Writer.create(options);
        return this.apis.writer;
    }

    async write(prompt, options = {}) {
        if (!this.apis.writer) await this.createWriter(options);
        return await this.apis.writer.write(prompt);
    }

    async *writeStreaming(prompt, options = {}) {
        if (!this.apis.writer) await this.createWriter(options);
        const stream = await this.apis.writer.writeStreaming(prompt);
        
        for await (const chunk of stream) {
            yield chunk;
        }
    }

    // ====================
    // REWRITER API
    // ====================

    async createRewriter(options = {}) {
        if (!('Rewriter' in self)) {
            throw new Error('Rewriter API not available');
        }

        this.apis.rewriter = await Rewriter.create(options);
        return this.apis.rewriter;
    }

    async rewrite(text, options = {}) {
        if (!this.apis.rewriter) await this.createRewriter();
        return await this.apis.rewriter.rewrite(text, options);
    }

    async *rewriteStreaming(text, options = {}) {
        if (!this.apis.rewriter) await this.createRewriter();
        const stream = await this.apis.rewriter.rewriteStreaming(text, options);
        
        for await (const chunk of stream) {
            yield chunk;
        }
    }

    // ====================
    // PROOFREADER API
    // ====================

    async createProofreader(options = {}) {
        if (!('Proofreader' in self)) {
            throw new Error('Proofreader API not available');
        }

        this.apis.proofreader = await Proofreader.create(options);
        return this.apis.proofreader;
    }

    async proofread(text) {
        if (!this.apis.proofreader) await this.createProofreader();
        return await this.apis.proofreader.proofread(text);
    }

    // ====================
    // CLEANUP
    // ====================

    destroy(apiName = null) {
        if (apiName) {
            if (this.apis[apiName] && this.apis[apiName].destroy) {
                this.apis[apiName].destroy();
                this.apis[apiName] = null;
            }
        } else {
            // Destroy all
            Object.keys(this.apis).forEach(key => {
                if (this.apis[key] && this.apis[key].destroy) {
                    this.apis[key].destroy();
                }
            });
            this.apis = {
                prompt: null,
                summarizer: null,
                translator: null,
                detector: null,
                writer: null,
                rewriter: null,
                proofreader: null
            };
        }
    }
}

// Export for both module and global usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChromeAI;
}

if (typeof window !== 'undefined') {
    window.ChromeAI = ChromeAI;
}
