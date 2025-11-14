// ====================
// ALT TEXT GENERATOR AI
// ====================

import { GeminiAPI } from '../../shared/gemini-api.js';

let currentImage = null;

// ====================
// INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', () => {
    setupUploadArea();
});

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
    
    // Show preview
    const preview = document.getElementById('preview');
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Generate alt text
    await generateAltText(file);
}

// ====================
// AI GENERATION
// ====================

async function generateAltText(file) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const resultArea = document.getElementById('resultArea');

    loading.style.display = 'block';
    error.style.display = 'none';
    resultArea.style.display = 'none';

    try {
        const gemini = new GeminiAPI();
        
        // Convert image to base64
        const base64 = await fileToBase64(file);
        const imageData = base64.split(',')[1];

        const prompt = `Analyze this image and generate a concise, SEO-optimized alt text description in Spanish. 
The alt text should:
- Be descriptive but concise (max 125 characters)
- Focus on the main subject and context
- Be useful for accessibility
- Include relevant keywords naturally
- Be in Spanish

Respond ONLY with the alt text, no explanations or additional text.`;

        const result = await gemini.generateContentWithImage(prompt, imageData, file.type);
        
        if (result.success) {
            displayResult(result.text);
        } else {
            throw new Error(result.error || 'Error generando alt text');
        }
    } catch (err) {
        console.error('Error:', err);
        error.textContent = `❌ Error: ${err.message}`;
        error.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

function displayResult(text) {
    const resultArea = document.getElementById('resultArea');
    const altText = document.getElementById('altText');
    
    altText.value = text.trim();
    resultArea.style.display = 'block';
    
    updateStats(text);
}

function updateStats(text) {
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    
    charCount.textContent = `${text.length} caracteres`;
    wordCount.textContent = `${text.split(/\s+/).filter(w => w).length} palabras`;
}

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

window.copyAltText = async function() {
    const altText = document.getElementById('altText').value;
    try {
        await navigator.clipboard.writeText(altText);
        alert('✅ Alt text copiado al portapapeles');
    } catch (err) {
        console.error('Error copying:', err);
    }
};

window.reset = function() {
    document.getElementById('preview').style.display = 'none';
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('fileInput').value = '';
    currentImage = null;
};
