# Chrome Built-in AI APIs - Quick Reference

## 🚀 Setup

```javascript
const ai = new ChromeAI();

// Check what's available
const available = await ai.checkAll();
console.log(available);
// { prompt: true, summarizer: true, translator: true, ... }
```

## 1️⃣ Prompt API - General Chat & Text Generation

```javascript
// Simple prompt
const response = await ai.prompt('Explain quantum computing in simple terms');

// Streaming (better UX)
for await (const chunk of ai.promptStreaming('Write a poem about coding')) {
    console.log(chunk);
}

// With custom settings
await ai.createPromptSession({
    systemPrompt: 'You are a helpful coding assistant',
    temperature: 0.8,
    topK: 40
});
```

**Best for:** General Q&A, chat, explanations, creative writing

## 2️⃣ Summarizer API - Text Summarization

```javascript
const longText = 'Your long article here...';

// Simple summarize
const summary = await ai.summarize(longText);

// Streaming
for await (const chunk of ai.summarizeStreaming(longText)) {
    console.log(chunk);
}

// With options
await ai.createSummarizer({
    type: 'key-points',  // or 'tl;dr', 'teaser', 'headline'
    format: 'markdown',  // or 'plain-text'
    length: 'short'      // or 'medium', 'long'
});
```

**Best for:** Summarizing articles, documents, emails, long texts

## 3️⃣ Translator API - Language Translation

```javascript
// Translate text
const translated = await ai.translate(
    'Hello, how are you?',
    'en',  // source language
    'es'   // target language
);
// Result: "Hola, ¿cómo estás?"

// Supported languages
const languages = await Translator.supportedLanguages();
console.log(languages);
// ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', ...]
```

**Best for:** Translating user content, multilingual support

## 4️⃣ Language Detector API - Detect Language

```javascript
// Detect language
const result = await ai.detectLanguage('Bonjour, comment allez-vous?');
console.log(result);
// {
//   language: 'fr',
//   confidence: 0.98,
//   all: [
//     { detectedLanguage: 'fr', confidence: 0.98 },
//     { detectedLanguage: 'en', confidence: 0.02 }
//   ]
// }
```

**Best for:** Auto-detecting language before translation, language-specific features

## 5️⃣ Writer API - Creative Writing

```javascript
// Generate content
const content = await ai.write('Write a product description for a smart watch');

// Streaming
for await (const chunk of ai.writeStreaming('Write a blog post intro about AI')) {
    console.log(chunk);
}

// With options
await ai.createWriter({
    tone: 'casual',      // or 'formal', 'neutral'
    format: 'markdown',  // or 'plain-text'
    length: 'medium'     // or 'short', 'long'
});
```

**Best for:** Content generation, creative writing, marketing copy

## 6️⃣ Rewriter API - Text Rewriting

```javascript
// Rewrite text
const rewritten = await ai.rewrite('This is a test', {
    tone: 'formal'  // or 'casual', 'neutral'
});

// Streaming
for await (const chunk of ai.rewriteStreaming('Make this sound professional', {
    tone: 'formal'
})) {
    console.log(chunk);
}

// Options
const options = {
    tone: 'formal',      // Change tone
    format: 'markdown',  // Output format
    length: 'shorter'    // or 'longer', 'same'
};
```

**Best for:** Improving writing, changing tone, simplifying/expanding text

## 7️⃣ Proofreader API - Grammar & Spelling

```javascript
// Check text
const corrections = await ai.proofread('This is a tets with erors');
console.log(corrections);
// [
//   { type: 'spelling', original: 'tets', suggestion: 'test', position: 10 },
//   { type: 'spelling', original: 'erors', suggestion: 'errors', position: 20 }
// ]
```

**Best for:** Grammar checking, spell checking, writing assistance

## 🎯 Real-World Examples

### Example 1: Smart Text Cleaner
```javascript
const ai = new ChromeAI();

// Detect language
const detected = await ai.detectLanguage(userText);

// Proofread
const corrections = await ai.proofread(userText);

// Improve
const improved = await ai.rewrite(userText, { tone: 'formal' });
```

### Example 2: Multilingual Summarizer
```javascript
const ai = new ChromeAI();

// Detect language
const { language } = await ai.detectLanguage(article);

// Translate to English if needed
let englishText = article;
if (language !== 'en') {
    englishText = await ai.translate(article, language, 'en');
}

// Summarize
const summary = await ai.summarize(englishText);

// Translate summary back
if (language !== 'en') {
    return await ai.translate(summary, 'en', language);
}
return summary;
```

### Example 3: Context Menu Integration
```javascript
// In extension background script
chrome.contextMenus.create({
    id: 'summarize-selection',
    title: 'Summarize with AI',
    contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'summarize-selection') {
        const ai = new ChromeAI();
        const summary = await ai.summarize(info.selectionText);
        
        // Show in notification or popup
        chrome.notifications.create({
            type: 'basic',
            title: 'Summary',
            message: summary
        });
    }
});
```

## 🔧 Error Handling

```javascript
try {
    const ai = new ChromeAI();
    const result = await ai.summarize(text);
} catch (error) {
    if (error.message.includes('not available')) {
        console.log('API not available in this browser');
        // Fallback to cloud API or show message
    } else {
        console.error('Error:', error);
    }
}
```

## 🧹 Cleanup

```javascript
const ai = new ChromeAI();

// Use APIs...

// Destroy specific API
ai.destroy('summarizer');

// Destroy all
ai.destroy();
```

## 📊 API Comparison

| API | Speed | Quality | Use Case |
|-----|-------|---------|----------|
| Prompt | Fast | Good | General chat, Q&A |
| Summarizer | Fast | Excellent | Summarization (specialized) |
| Translator | Very Fast | Good | Translation |
| Detector | Instant | Excellent | Language detection |
| Writer | Fast | Good | Content generation |
| Rewriter | Fast | Good | Text improvement |
| Proofreader | Fast | Good | Grammar/spelling |

## 🎓 Best Practices

1. **Use specialized APIs when possible** - Summarizer is better than Prompt for summaries
2. **Stream for better UX** - Use streaming APIs for long responses
3. **Detect language first** - Use Language Detector before Translator
4. **Cleanup sessions** - Call destroy() when done to free memory
5. **Handle errors gracefully** - Not all APIs available in all Chrome versions
6. **Combine APIs** - Chain APIs for powerful workflows (detect → translate → summarize)

## 🔗 Resources

- **Test Suite:** `/ai-apis-test.html`
- **Wrapper Library:** `/js/lib/chrome-ai-apis.js`
- **Documentation:** https://developer.chrome.com/docs/ai/built-in
- **Chrome Version:** Requires Chrome 138+ (some APIs in origin trial)
