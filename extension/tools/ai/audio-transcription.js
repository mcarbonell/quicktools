// ====================
// AUDIO TRANSCRIPTION AI
// ====================

import { GeminiAPI } from '../../shared/gemini-api.js';

let currentAudio = null;

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
        if (file && file.type.startsWith('audio/')) {
            handleFile(file);
        }
    };
}

async function handleFile(file) {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        document.getElementById('error').textContent = '❌ El archivo es demasiado grande. Máximo 10MB.';
        document.getElementById('error').style.display = 'block';
        return;
    }

    currentAudio = file;
    
    // Show audio player
    const audioPlayer = document.getElementById('audioPlayer');
    const audioElement = document.getElementById('audioElement');
    const reader = new FileReader();
    
    reader.onload = (e) => {
        audioElement.src = e.target.result;
        audioPlayer.style.display = 'block';
        
        // Get duration
        audioElement.onloadedmetadata = () => {
            const duration = formatDuration(audioElement.duration);
            document.getElementById('duration').textContent = `Duración: ${duration}`;
        };
    };
    reader.readAsDataURL(file);

    // Transcribe audio
    await transcribeAudio(file);
}

// ====================
// TRANSCRIPTION
// ====================

async function transcribeAudio(file) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const resultArea = document.getElementById('resultArea');

    loading.style.display = 'block';
    error.style.display = 'none';
    resultArea.style.display = 'none';

    try {
        const gemini = new GeminiAPI();
        
        // Convert audio to base64
        const base64 = await fileToBase64(file);
        const audioData = base64.split(',')[1];

        // Note: Gemini API doesn't support audio directly yet
        // This is a placeholder for when it becomes available
        // For now, we'll show an informative message
        
        throw new Error('La transcripción de audio con Gemini API aún no está disponible. Próximamente se añadirá soporte cuando Google lo habilite.');
        
        // Future implementation:
        // const result = await gemini.transcribeAudio(audioData, file.type);
        // if (result.success) {
        //     displayResult(result.text);
        // }
        
    } catch (err) {
        console.error('Error:', err);
        error.innerHTML = `❌ ${err.message}<br><br>
            <strong>Alternativas:</strong><br>
            • Usa servicios como <a href="https://speech.google.com" target="_blank">Google Speech-to-Text</a><br>
            • Prueba <a href="https://www.happyscribe.com" target="_blank">Happy Scribe</a><br>
            • O <a href="https://otter.ai" target="_blank">Otter.ai</a>`;
        error.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

function displayResult(text) {
    const resultArea = document.getElementById('resultArea');
    const transcription = document.getElementById('transcription');
    
    transcription.value = text.trim();
    resultArea.style.display = 'block';
    
    updateStats(text);
}

function updateStats(text) {
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    
    const words = text.split(/\s+/).filter(w => w).length;
    wordCount.textContent = `${words} palabras`;
    charCount.textContent = `${text.length} caracteres`;
}

// ====================
// ACTIONS
// ====================

window.copyTranscription = async function() {
    const text = document.getElementById('transcription').value;
    try {
        await navigator.clipboard.writeText(text);
        alert('✅ Transcripción copiada al portapapeles');
    } catch (err) {
        console.error('Error copying:', err);
    }
};

window.downloadTranscription = function() {
    const text = document.getElementById('transcription').value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    a.click();
    URL.revokeObjectURL(url);
};

window.reset = function() {
    document.getElementById('audioPlayer').style.display = 'none';
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('fileInput').value = '';
    document.getElementById('audioElement').src = '';
    currentAudio = null;
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

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
