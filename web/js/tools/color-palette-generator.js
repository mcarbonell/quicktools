const imageInput = document.getElementById('image-input');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
const colorCountInput = document.getElementById('color-count');
const extractBtn = document.getElementById('extract-btn');
const previewImg = document.getElementById('preview');
const paletteDisplay = document.getElementById('palette-display');
const dropZone = document.getElementById('dropZone');

const colorThief = new ColorThief();

// Inicializar zona de drop
dropZone?.addEventListener('click', () => imageInput.click());

function handleFile(file) {
    if (!file) return;

    // Create a new FileList object and assign it to the input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    imageInput.files = dataTransfer.files;

    const imgMsg = (t.imageLoaded || 'Imagen cargada: {filename}').replace('{filename}', file.name); dropZone.querySelector('.drop-message').textContent = imgMsg;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
        paletteDisplay.innerHTML = ''; // Clear previous palette
    };
    reader.readAsDataURL(file);
}

// Eventos de drag & drop
dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone?.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
});

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) handleFile(file);
});

extractBtn.addEventListener('click', () => {
    if (!previewImg.src || previewImg.style.display === 'none') {
        alert(t.uploadImageFirst || 'Por favor, sube una imagen primero.');
        return;
    }

    // Ensure image is loaded before trying to extract colors
    if (previewImg.complete) {
        extractColors();
    } else {
        previewImg.onload = extractColors;
    }
});

function extractColors() {
    paletteDisplay.innerHTML = ''; // Clear previous palette
    try {
        const colorCount = parseInt(colorCountInput.value, 10);
        const palette = colorThief.getPalette(previewImg, colorCount);

        palette.forEach(color => {
            const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            const hex = rgbToHex(color[0], color[1], color[2]);

            const colorSwatch = document.createElement('div');
            colorSwatch.classList.add('color-swatch', 'p-3', 'rounded', 'shadow-sm');
            colorSwatch.style.backgroundColor = rgb;
            colorSwatch.style.width = '100px';
            colorSwatch.style.height = '100px';
            colorSwatch.style.display = 'flex';
            colorSwatch.style.flexDirection = 'column';
            colorSwatch.style.justifyContent = 'flex-end';
            colorSwatch.style.alignItems = 'flex-start';
            colorSwatch.style.color = getContrastYIQ(hex);
            colorSwatch.style.fontWeight = 'bold';
            colorSwatch.style.fontSize = '0.8em';
            colorSwatch.innerHTML = `<span>${hex.toUpperCase()}</span>`;
            colorSwatch.title = rgb;

            paletteDisplay.appendChild(colorSwatch);
        });
    } catch (error) {
        console.error((t.errorExtractingPalette || 'Error al extraer la paleta de colores:'), error);
        paletteDisplay.innerHTML = `<p class="text-danger">${t.errorExtractingPaletteGeneric || 'No se pudo extraer la paleta de colores. Asegúrate de que la imagen es válida y no está corrupta.'}</p>`;
    }
}

// Helper function to convert RGB to Hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Helper function to get contrasting text color for readability
function getContrastYIQ(hexcolor) {
    var r = parseInt(hexcolor.substr(1, 2), 16);
    var g = parseInt(hexcolor.substr(3, 2), 16);
    var b = parseInt(hexcolor.substr(5, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}
