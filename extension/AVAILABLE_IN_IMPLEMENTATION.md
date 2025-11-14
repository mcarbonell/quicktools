# availableIn Field Implementation

## Overview

The `availableIn` field in `fasttools-data.json` controls where each tool is available and how it's accessed in the extension.

## Logic

### Tool Visibility Rules

1. **Has `"extension"` in `availableIn`**
   - ✅ Show in extension
   - 🔗 Use local URL with `extensionSlug`
   - 📍 Example: `chrome-extension://[id]/tools/ai/chat-ai.html`

2. **Has `"web"` but NOT `"extension"`**
   - ✅ Show in extension
   - 🌐 Redirect to fasttools.ai
   - 📍 Example: `https://fasttools.ai/json-formatter.html` (EN)
   - 📍 Example: `https://fasttools.ai/es/json-formatter.html` (ES)

3. **NO `availableIn` or empty array**
   - ❌ Hide from extension
   - 💡 Use case: Tools in development, buggy tools, deprecated tools

## Implementation

### File: `build/data/fasttools-data.json`

All 47 tools now have `availableIn` field:

- **12 AI tools**: `["web", "extension"]` - Local implementation
- **35 other tools**: `["web"]` - Redirect to web
- **7 SEO tools**: `["web"]` - Redirect to web (will have local implementation later)

### File: `extension/shared/tools-loader.js`

```javascript
// Filter tools
.filter(tool => {
    if (!tool.availableIn || tool.availableIn.length === 0) return false;
    return tool.availableIn.includes('extension') || tool.availableIn.includes('web');
})

// Determine URL
.map(tool => {
    const hasExtension = tool.availableIn.includes('extension');
    const hasWeb = tool.availableIn.includes('web');
    
    let url;
    if (hasExtension && tool.extensionSlug) {
        // Local implementation
        url = chrome.runtime.getURL(tool.extensionSlug);
    } else if (hasWeb) {
        // Redirect to web
        url = `${BASE_URL}${langPrefix}/${tool.slug}`;
    }
    
    return { ...tool, url, local: hasExtension && tool.extensionSlug };
});
```

## Current Tool Distribution

### Local Implementation (12 tools)
- ✅ chat-ai
- ✅ summarize-text-ai
- ✅ improve-text-ai
- ✅ chat-pdf
- ✅ vision-chat-ai
- ✅ translate-ai
- ✅ image-generator-ai
- ✅ image-editor-ai
- ✅ alt-text-generator-ai (redirect for now)
- ✅ audio-transcription-ai (redirect for now)
- ✅ image-to-text-ocr (redirect for now)
- ✅ ai-meme-generator (redirect for now)

### Web Redirect (35 tools)
All non-AI tools redirect to fasttools.ai:
- Image tools (7)
- Data tools (5)
- File tools (4)
- Converters (2)
- Text tools (6)
- Utils (5)
- SEO tools (7)

## Adding New Tools

### Tool with local implementation
```json
{
  "id": "new-tool",
  "slug": "new-tool.html",
  "extensionSlug": "tools/category/new-tool.html",
  "availableIn": ["web", "extension"]
}
```

### Tool web-only
```json
{
  "id": "new-tool",
  "slug": "new-tool.html",
  "availableIn": ["web"]
}
```

### Tool in development (hidden)
```json
{
  "id": "new-tool",
  "slug": "new-tool.html",
  "availableIn": []
}
```

## Language Support

URLs respect user language preference:
- **English**: `https://fasttools.ai/tool.html`
- **Spanish**: `https://fasttools.ai/es/tool.html`

Language is read from `chrome.storage.sync.get(['language'])`.

## Benefits

1. ✅ **Single source of truth**: All tool configuration in one file
2. ✅ **Flexible deployment**: Control where each tool is available
3. ✅ **Easy testing**: Hide tools in development
4. ✅ **Progressive enhancement**: Start with web redirect, add local implementation later
5. ✅ **Clean architecture**: Clear separation between local and web tools

## Next Steps

1. Implement local versions of 4 AI tools (alt-text, audio-transcription, ocr, meme-generator)
2. Consider implementing SEO tools locally (bypass CORS)
3. Consider implementing popular tools locally (json-formatter, image-resizer, etc.)
