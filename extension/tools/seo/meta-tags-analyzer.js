// ====================
// META TAGS ANALYZER
// ====================

let metaData = null;

// ====================
// INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🏷️ Meta Tags Analyzer initialized');
    
    const context = await getSEOContext();
    if (!context.hasValidTab) {
        showURLInput();
    }
    
    setupEventListeners();
});

// ====================
// EVENT HANDLERS
// ====================

function setupEventListeners() {
    document.getElementById('analyzeBtn').addEventListener('click', analyzePage);
}

async function analyzePage() {
    console.log('🚀 Starting meta tags analysis...');
    
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '⏳ Analizando...';
    
    try {
        const context = await getSEOContext();
        if (!context.hasValidTab) {
            throw new Error('Esta herramienta requiere una pestaña activa. Ábrela desde el popup mientras navegas un sitio.');
        }
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab) {
            throw new Error('No se pudo obtener la pestaña actual');
        }
        
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getMetaTags' });
        
        if (!response || !response.metaTags) {
            throw new Error('No se pudieron extraer las meta tags');
        }
        
        metaData = response.metaTags;
        console.log('✅ Meta tags extracted:', metaData);
        
        renderResults();
        
    } catch (error) {
        console.error('❌ Error analyzing meta tags:', error);
        showEmptyState(`Error: ${error.message}`);
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = '▶️ Analizar Meta Tags';
    }
}

// ====================
// RENDERING
// ====================

function renderResults() {
    const container = document.getElementById('results');
    container.innerHTML = '';
    
    // Basic Meta Tags
    container.appendChild(renderBasicMeta());
    
    // Open Graph
    if (metaData.og && Object.keys(metaData.og).length > 0) {
        container.appendChild(renderOpenGraph());
    }
    
    // Twitter Card
    if (metaData.twitter && Object.keys(metaData.twitter).length > 0) {
        container.appendChild(renderTwitterCard());
    }
}

function renderBasicMeta() {
    const section = document.createElement('div');
    section.className = 'section';
    
    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = '📄 Meta Tags Básicas';
    section.appendChild(title);
    
    // Title
    section.appendChild(createMetaItem(
        'Title',
        metaData.title,
        validateTitle(metaData.title)
    ));
    
    // Description
    section.appendChild(createMetaItem(
        'Description',
        metaData.description,
        validateDescription(metaData.description)
    ));
    
    // Keywords
    if (metaData.keywords) {
        section.appendChild(createMetaItem('Keywords', metaData.keywords));
    }
    
    // Author
    if (metaData.author) {
        section.appendChild(createMetaItem('Author', metaData.author));
    }
    
    // Robots
    section.appendChild(createMetaItem(
        'Robots',
        metaData.robots || 'No especificado',
        metaData.robots ? 'ok' : 'warning'
    ));
    
    // Canonical
    section.appendChild(createMetaItem(
        'Canonical URL',
        metaData.canonical || 'No especificado',
        metaData.canonical ? 'ok' : 'warning'
    ));
    
    return section;
}

function renderOpenGraph() {
    const section = document.createElement('div');
    section.className = 'section';
    
    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = '📱 Open Graph (Facebook, LinkedIn)';
    section.appendChild(title);
    
    const grid = document.createElement('div');
    grid.className = 'og-grid';
    
    Object.entries(metaData.og).forEach(([key, value]) => {
        grid.appendChild(createMetaItem(`og:${key}`, value));
    });
    
    section.appendChild(grid);
    return section;
}

function renderTwitterCard() {
    const section = document.createElement('div');
    section.className = 'section';
    
    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = '🐦 Twitter Card';
    section.appendChild(title);
    
    const grid = document.createElement('div');
    grid.className = 'og-grid';
    
    Object.entries(metaData.twitter).forEach(([key, value]) => {
        grid.appendChild(createMetaItem(`twitter:${key}`, value));
    });
    
    section.appendChild(grid);
    return section;
}

function createMetaItem(label, value, status = null) {
    const item = document.createElement('div');
    item.className = 'meta-item';
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'meta-label';
    labelDiv.textContent = label;
    
    if (status) {
        const badge = document.createElement('span');
        badge.className = `status-badge badge-${status}`;
        badge.textContent = status === 'ok' ? 'OK' : status === 'warning' ? 'Mejorable' : 'Error';
        labelDiv.appendChild(badge);
    }
    
    const valueDiv = document.createElement('div');
    valueDiv.className = 'meta-value';
    valueDiv.textContent = value || 'No especificado';
    
    item.appendChild(labelDiv);
    item.appendChild(valueDiv);
    
    if (value && (label === 'Title' || label === 'Description')) {
        const lengthDiv = document.createElement('div');
        lengthDiv.className = 'meta-length';
        lengthDiv.textContent = `Longitud: ${value.length} caracteres`;
        item.appendChild(lengthDiv);
    }
    
    return item;
}

// ====================
// VALIDATION
// ====================

function validateTitle(title) {
    if (!title) return 'error';
    if (title.length < 30 || title.length > 60) return 'warning';
    return 'ok';
}

function validateDescription(description) {
    if (!description) return 'error';
    if (description.length < 120 || description.length > 160) return 'warning';
    return 'ok';
}

// ====================
// UTILITIES
// ====================

function showEmptyState(message) {
    const container = document.getElementById('results');
    container.innerHTML = `
        <div class="empty-state">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
