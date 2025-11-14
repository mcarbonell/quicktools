// ====================
// AI MEME GENERATOR
// ====================

let currentImage = null;
let currentMode = 'ai';
let memeText = { top: '', bottom: '' };

// ====================
// INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', () => {
    setupUploadArea();
    setupEventListeners();
});

function setupEventListeners() {
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
    
    // Action buttons
    document.getElementById('downloadBtn')?.addEventListener('click', downloadMeme);
    document.getElementById('regenerateBtn')?.addEventListener('click', regenerate);
    document.getElementById('resetBtn')?.addEventListener('click', reset);
}

// ====================
// MODE SWITCHING
// ====================

function setMode(mode) {
    currentMode = mode;
    
    // Update buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide custom text area
    const customArea = document.getElementById('customTextArea');
    customArea.classList.toggle('active', mode === 'custom');
};

// ====================
// UPLOAD HANDLING
// ====================

function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    uploadArea.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    };

    uploadArea.ondragleave = () => {
        uploadArea.classList.remove('dragover');
    };

    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    };
}

async function handleFile(file) {
    currentImage = file;
    
    if (currentMode === 'ai') {
        await generateMemeText(file);
    } else {
        const topText = document.getElementById('topText').value;
        const bottomText = document.getElementById('bottomText').value;
        
        if (!bottomText) {
            document.getElementById('error').textContent = '❌ Por favor ingresa al menos el texto inferior';
            document.getElementById('error').style.display = 'block';
            return;
        }
        
        memeText = { top: topText, bottom: bottomText };
        await renderMeme(file);
    }
}

// ====================
// AI TEXT GENERATION
// ====================

async function generateMemeText(file) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    loading.style.display = 'block';
    error.style.display = 'none';

    try {
        // Get API key
        const apiKey = await ChromeGeminiStorage.get();
        if (!apiKey) {
            throw new Error('No se encontró API key de Gemini. Por favor configúrala en las opciones de la extensión.');
        }
        
        const gemini = new GeminiAPI(apiKey);
        
        // Convert image to base64
        const base64 = await fileToBase64(file);
        const imageData = base64.split(',')[1];

        const prompt = `Analyze this image and create a funny meme caption in Spanish.
Generate TWO lines of text:
1. Top text (optional, can be empty if not needed)
2. Bottom text (the punchline)

The meme should be:
- Funny and relatable
- Use internet meme culture
- Be appropriate for all audiences
- In Spanish

Respond in this exact format:
TOP: [text or leave empty]
BOTTOM: [text]`;

        const result = await gemini.generateContentWithImage(prompt, imageData, file.type);
        
        if (result.success) {
            parseMemeText(result.text);
            await renderMeme(file);
        } else {
            throw new Error(result.error || 'Error generando texto del meme');
        }
    } catch (err) {
        console.error('Error:', err);
        error.textContent = `❌ Error: ${err.message}`;
        error.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

function parseMemeText(text) {
    const lines = text.split('\n');
    memeText = { top: '', bottom: '' };
    
    lines.forEach(line => {
        if (line.startsWith('TOP:')) {
            memeText.top = line.replace('TOP:', '').trim();
        } else if (line.startsWith('BOTTOM:')) {
            memeText.bottom = line.replace('BOTTOM:', '').trim();
        }
    });
    
    // Fallback if parsing fails
    if (!memeText.bottom) {
        memeText.bottom = text.trim();
    }
}

// ====================
// MEME RENDERING
// ====================

async function renderMeme(file) {
    const canvas = document.getElementById('memeCanvas');
    const ctx = canvas.getContext('2d');
    const preview = document.getElementById('memePreview');

    // Load image
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
        img.src = e.target.result;
    };
    
    img.onload = () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image
        ctx.drawImage(img, 0, 0);
        
        // Draw text
        drawMemeText(ctx, canvas.width, canvas.height);
        
        // Show preview
        preview.style.display = 'block';
    };
    
    reader.readAsDataURL(file);
}

function drawMemeText(ctx, width, height) {
    const fontSize = Math.floor(width / 12);
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineWidth = fontSize / 15;
    
    // Top text
    if (memeText.top) {
        const topY = fontSize / 2;
        drawText(ctx, memeText.top.toUpperCase(), width / 2, topY);
    }
    
    // Bottom text
    if (memeText.bottom) {
        const bottomY = height - fontSize * 1.5;
        drawText(ctx, memeText.bottom.toUpperCase(), width / 2, bottomY);
    }
}

function drawText(ctx, text, x, y) {
    // Stroke (outline)
    ctx.strokeStyle = 'black';
    ctx.strokeText(text, x, y);
    
    // Fill (white text)
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
}

// ====================
// ACTIONS
// ====================

async function regenerate() {
    if (currentImage && currentMode === 'ai') {
        await generateMemeText(currentImage);
    }
};

function downloadMeme() {
    const canvas = document.getElementById('memeCanvas');
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
};

function reset() {
    document.getElementById('memePreview').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('fileInput').value = '';
    document.getElementById('topText').value = '';
    document.getElementById('bottomText').value = '';
    currentImage = null;
    memeText = { top: '', bottom: '' };
};

// ====================
// UTILITIES
// ====================

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
