// ====================
// AUDIO TRANSCRIPTION AI
// ====================

const chromeAI = new ChromeAI();
let currentAudioBlob = null;
let mediaRecorder = null;
let audioChunks = [];

// ====================
// INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', async () => {
    await checkServiceAvailability();
    setupUploadArea();
    setupEventListeners();
});

async function checkServiceAvailability() {
    const serviceStatus = document.getElementById('serviceStatus');
    const hasPromptAPI = 'LanguageModel' in self;
    
    if (hasPromptAPI) {
        serviceStatus.style.background = '#d4edda';
        serviceStatus.style.borderColor = '#c3e6cb';
        serviceStatus.innerHTML = '<strong>✅ Usando Chrome AI Local (Gemini Nano)</strong>';
    } else {
        serviceStatus.style.background = '#fff3cd';
        serviceStatus.style.borderColor = '#ffc107';
        serviceStatus.innerHTML = '<strong>⚠️ Requiere Prompt API. Habilita chrome://flags/#prompt-api-for-gemini-nano</strong>';
    }
}

function setupEventListeners() {
    document.getElementById('copyBtn')?.addEventListener('click', copyTranscription);
    document.getElementById('downloadBtn')?.addEventListener('click', downloadTranscription);
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
        if (file && file.type.startsWith('audio/')) {
            handleFile(file);
        }
    };
}

async function handleFile(file) {
    currentAudioBlob = file;
    
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
}

// ====================
// TRANSCRIPTION
// ====================

// Transcribe button handler
const transcribeBtn = document.querySelector('button');
if (transcribeBtn && transcribeBtn.textContent.includes('Transcribir')) {
    transcribeBtn.addEventListener('click', async () => {
        if (!currentAudioBlob) return;

        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const resultArea = document.getElementById('resultArea');
        const transcription = document.getElementById('transcription');

        loading.style.display = 'block';
        error.style.display = 'none';
        resultArea.style.display = 'none';
        transcription.value = '';

        try {
            const arrayBuffer = await currentAudioBlob.arrayBuffer();
            const prompt = 'Transcribe este audio en español';

            const stream = chromeAI.promptStreaming(prompt, arrayBuffer, 'audio');
            
            resultArea.style.display = 'block';
            for await (const chunk of stream) {
                transcription.value += chunk;
            }

            updateStats(transcription.value);

        } catch (err) {
            console.error('Error:', err);
            error.textContent = `❌ Error: ${err.message}`;
            error.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    });
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

async function copyTranscription() {
    const text = document.getElementById('transcription').value;
    try {
        await navigator.clipboard.writeText(text);
        alert('✅ Transcripción copiada al portapapeles');
    } catch (err) {
        console.error('Error copying:', err);
    }
};

function downloadTranscription() {
    const text = document.getElementById('transcription').value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    a.click();
    URL.revokeObjectURL(url);
};

function reset() {
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
