// ====================
// IMAGE TO TEXT OCR
// ====================

let extractedData = {
    plain: '',
    markdown: '',
    json: ''
};
let currentFormat = 'plain';

// ====================
// INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', () => {
    setupUploadArea();
    setupEventListeners();
});

function setupEventListeners() {
    // Format buttons
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', () => changeFormat(btn.dataset.format));
    });
    
    // Action buttons
    document.getElementById('copyBtn')?.addEventListener('click', copyText);
    document.getElementById('downloadBtn')?.addEventListener('click', downloadText);
    document.getElementById('resetBtn')?.addEventListener('click', reset);
}

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
    // Show preview
    const preview = document.getElementById('preview');
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Extract text
    await extractText(file);
}

// ====================
// OCR EXTRACTION
// ====================

async function extractText(file) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const contentGrid = document.getElementById('contentGrid');

    loading.style.display = 'block';
    error.style.display = 'none';
    contentGrid.style.display = 'none';

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

        const prompt = `Extract ALL text from this image. 
Preserve the original structure, formatting, and layout as much as possible.
Include all visible text, even if it's small or partially visible.
Respond ONLY with the extracted text, no explanations.`;

        const result = await gemini.generateContentWithImage(prompt, imageData, file.type);
        
        if (result.success) {
            extractedData.plain = result.text.trim();
            await generateFormats(result.text.trim());
            displayResult();
        } else {
            throw new Error(result.error || 'Error extrayendo texto');
        }
    } catch (err) {
        console.error('Error:', err);
        error.textContent = `❌ Error: ${err.message}`;
        error.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

async function generateFormats(plainText) {
    // Markdown format
    extractedData.markdown = `# Texto Extraído\n\n${plainText}`;
    
    // JSON format
    extractedData.json = JSON.stringify({
        text: plainText,
        lines: plainText.split('\n').filter(l => l.trim()),
        wordCount: plainText.split(/\s+/).filter(w => w).length,
        charCount: plainText.length,
        extractedAt: new Date().toISOString()
    }, null, 2);
}

function displayResult() {
    const contentGrid = document.getElementById('contentGrid');
    const textarea = document.getElementById('extractedText');
    
    contentGrid.style.display = 'grid';
    textarea.value = extractedData[currentFormat];
    
    updateStats();
}

function updateStats() {
    const stats = document.getElementById('stats');
    const text = extractedData.plain;
    const words = text.split(/\s+/).filter(w => w).length;
    const chars = text.length;
    const lines = text.split('\n').length;
    
    stats.textContent = `${chars} caracteres • ${words} palabras • ${lines} líneas`;
}

// ====================
// FORMAT SWITCHING
// ====================

function changeFormat(format) {
    currentFormat = format;
    
    // Update buttons
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.format === format);
    });
    
    // Update textarea
    document.getElementById('extractedText').value = extractedData[format];
};

// ====================
// ACTIONS
// ====================

async function copyText() {
    const text = document.getElementById('extractedText').value;
    try {
        await navigator.clipboard.writeText(text);
        alert('✅ Texto copiado al portapapeles');
    } catch (err) {
        console.error('Error copying:', err);
    }
};

function downloadText() {
    const text = document.getElementById('extractedText').value;
    const extensions = { plain: 'txt', markdown: 'md', json: 'json' };
    const ext = extensions[currentFormat];
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
};

function reset() {
    document.getElementById('preview').style.display = 'none';
    document.getElementById('contentGrid').style.display = 'none';
    document.getElementById('fileInput').value = '';
    extractedData = { plain: '', markdown: '', json: '' };
    currentFormat = 'plain';
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
