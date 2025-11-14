# Chrome AI APIs Usage in FastTools Extension

## Overview

FastTools extension can use **Chrome's built-in AI APIs** (Gemini Nano) for several tools, eliminating the need for external API keys.

## Available Chrome AI APIs

### 1. **Summarizer API** (Chrome 138+)
- **Use in**: `summarize-text-ai`
- **No API key needed**
- **Local processing** with Gemini Nano
- **Types**: `tldr`, `key-points`, `teaser`, `headline`
- **Lengths**: `short`, `medium`, `long`

```javascript
const summarizer = await Summarizer.create({
  type: 'key-points',
  format: 'markdown',
  length: 'medium'
});

const summary = await summarizer.summarize(text);
```

### 2. **Translator API** (Chrome 138+)
- **Use in**: `translate-ai`
- **No API key needed**
- **Local processing**
- **Supports multiple language pairs**

```javascript
const translator = await Translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'es'
});

const translated = await translator.translate(text);
```

### 3. **Rewriter API** (Chrome 137+, Origin Trial)
- **Use in**: `improve-text-ai`
- **No API key needed**
- **Local processing**
- **Tones**: `more-formal`, `as-is`, `more-casual`
- **Lengths**: `shorter`, `as-is`, `longer`

```javascript
const rewriter = await Rewriter.create({
  tone: 'more-formal',
  length: 'as-is'
});

const improved = await rewriter.rewrite(text);
```

### 4. **Prompt API** (Chrome AI)
- **Use in**: `chat-ai`, `chat-pdf`, `vision-chat-ai`
- **Already implemented** ✅
- **Uses**: `window.ai.languageModel`

## Tools That Should Use Chrome AI

### Currently Using Gemini API (should switch to Chrome AI):

1. **✅ Summarize Text** → Use `Summarizer` API
2. **✅ Improve Text** → Use `Rewriter` API  
3. **✅ Translator** → Use `Translator` API
4. **✅ Chat PDF** → Already uses Chrome AI via HybridAI
5. **✅ Vision Chat** → Already uses Chrome AI via HybridAI

### Must Use Gemini API (no Chrome AI alternative):

1. **Image Generator** → Requires Nano Banana (Gemini 2.5 Flash Image)
2. **Image Editor** → Requires Nano Banana
3. **Alt Text Generator** → Requires Gemini Vision
4. **Image to Text OCR** → Requires Gemini Vision
5. **Meme Generator** → Requires Gemini Vision
6. **Audio Transcription** → Not supported yet (neither Chrome AI nor Gemini)

## Implementation Strategy

### Phase 1: Update Existing Tools ✅
- [x] Chat AI - Already uses Chrome AI
- [ ] Summarize Text - Switch to `Summarizer` API
- [ ] Improve Text - Switch to `Rewriter` API
- [ ] Translator - Switch to `Translator` API

### Phase 2: Hybrid Approach
Create a unified API wrapper that:
1. **Tries Chrome AI first** (free, local, fast)
2. **Falls back to Gemini API** if Chrome AI unavailable
3. **Shows appropriate UI** based on which API is used

## Benefits of Chrome AI

1. **🆓 Free** - No API key required
2. **🔒 Private** - All processing on-device
3. **⚡ Fast** - No network latency
4. **📴 Offline** - Works without internet
5. **♾️ Unlimited** - No rate limits or quotas

## Requirements

### Hardware
- **Storage**: 22 GB free space
- **GPU**: >4 GB VRAM
- **RAM**: 16 GB+
- **CPU**: 4+ cores

### Browser
- **Chrome 138+** for Summarizer & Translator
- **Chrome 137+** for Rewriter (Origin Trial)

### Detection
```javascript
// Check if API is available
if ('Summarizer' in self) {
  const availability = await Summarizer.availability();
  // 'available', 'downloadable', or 'unavailable'
}
```

## Next Steps

1. Update `summarize-text.js` to use `Summarizer` API
2. Update `improve-text.js` to use `Rewriter` API
3. Update `translate.js` to use `Translator` API
4. Remove "Get API key" prompts from these tools
5. Add fallback to Gemini API if Chrome AI unavailable

## Documentation

- [Summarizer API](https://developer.chrome.com/docs/ai/summarizer-api)
- [Translator API](https://developer.chrome.com/docs/ai/translator-api)
- [Rewriter API](https://developer.chrome.com/docs/ai/rewriter-api)
- [Prompt API](https://developer.chrome.com/docs/ai/prompt-api)
