// ====================
// DEAD LINKS CHECKER
// ====================

let allLinks = [];
let results = [];
let isChecking = false;

// ====================
// INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔗 Dead Links Checker initialized');
    
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
    document.getElementById('checkBtn').addEventListener('click', startCheck);
    document.getElementById('exportBtn').addEventListener('click', exportResults);
    document.getElementById('clearBtn').addEventListener('click', clearResults);
}

async function startCheck() {
    if (isChecking) return;
    
    console.log('🚀 Starting link check...');
    isChecking = true;
    
    const checkBtn = document.getElementById('checkBtn');
    checkBtn.disabled = true;
    checkBtn.textContent = '⏳ Analizando...';
    
    document.getElementById('exportBtn').disabled = true;
    document.getElementById('clearBtn').disabled = true;
    
    try {
        const context = await getSEOContext();
        
        if (!context.hasValidTab) {
            throw new Error('Esta herramienta requiere una pestaña activa. Ábrela desde el popup mientras navegas un sitio.');
        }
        
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab) {
            throw new Error('No se pudo obtener la pestaña actual');
        }
        
        // Extract links from page
        let response;
        try {
            response = await chrome.tabs.sendMessage(tab.id, { action: 'extractLinks' });
        } catch (error) {
            if (error.message.includes('Receiving end does not exist')) {
                throw new Error('Por favor, recarga la página (F5) y vuelve a intentarlo. El content script no está disponible.');
            }
            throw error;
        }
        
        if (!response || !response.links) {
            throw new Error('No se pudieron extraer los enlaces');
        }
        
        allLinks = response.links;
        console.log(`📋 Found ${allLinks.length} links`);
        
        if (allLinks.length === 0) {
            showEmptyState('No se encontraron enlaces en esta página');
            return;
        }
        
        // Show progress bar
        document.getElementById('progressBar').style.display = 'block';
        document.getElementById('stats').style.display = 'grid';
        
        // Check each link
        results = [];
        for (let i = 0; i < allLinks.length; i++) {
            const link = allLinks[i];
            const result = await checkLink(link);
            results.push(result);
            
            updateProgress(i + 1, allLinks.length);
            updateStats();
            renderResults();
        }
        
        console.log('✅ Link check completed');
        
    } catch (error) {
        console.error('❌ Error checking links:', error);
        showEmptyState(`Error: ${error.message}`);
    } finally {
        isChecking = false;
        checkBtn.disabled = false;
        checkBtn.textContent = '▶️ Analizar Enlaces';
        document.getElementById('exportBtn').disabled = false;
        document.getElementById('clearBtn').disabled = false;
        document.getElementById('progressBar').style.display = 'none';
    }
}

// ====================
// LINK CHECKING
// ====================

async function checkLink(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
        });
        
        // no-cors mode returns opaque response, so we can't get status
        // We'll use a background script to check properly
        const result = await chrome.runtime.sendMessage({
            action: 'checkLink',
            url: url
        });
        
        return result;
        
    } catch (error) {
        return {
            url: url,
            status: 0,
            statusText: 'Network Error',
            error: error.message,
            category: 'error'
        };
    }
}

// ====================
// UI UPDATES
// ====================

function updateProgress(current, total) {
    const percent = (current / total) * 100;
    document.getElementById('progressFill').style.width = `${percent}%`;
}

function updateStats() {
    const total = results.length;
    const ok = results.filter(r => r.category === 'ok').length;
    const warning = results.filter(r => r.category === 'warning').length;
    const error = results.filter(r => r.category === 'error').length;
    
    document.getElementById('totalLinks').textContent = total;
    document.getElementById('okLinks').textContent = ok;
    document.getElementById('warningLinks').textContent = warning;
    document.getElementById('errorLinks').textContent = error;
}

function renderResults() {
    const container = document.getElementById('results');
    container.innerHTML = '';
    
    if (results.length === 0) {
        showEmptyState('No hay resultados');
        return;
    }
    
    // Sort: errors first, then warnings, then ok
    const sorted = [...results].sort((a, b) => {
        const order = { error: 0, warning: 1, ok: 2 };
        return order[a.category] - order[b.category];
    });
    
    sorted.forEach(result => {
        const item = createResultItem(result);
        container.appendChild(item);
    });
}

function createResultItem(result) {
    const div = document.createElement('div');
    div.className = `result-item result-${result.category}`;
    
    const badgeClass = `badge-${result.category}`;
    const statusText = result.status === 0 ? 'ERROR' : result.status;
    
    div.innerHTML = `
        <div class="result-url">${escapeHtml(result.url)}</div>
        <div class="result-status">
            <span class="status-badge ${badgeClass}">${statusText}</span>
            ${escapeHtml(result.statusText || '')}
        </div>
    `;
    
    return div;
}

function showEmptyState(message) {
    const container = document.getElementById('results');
    container.innerHTML = `
        <div class="empty-state">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

// ====================
// EXPORT
// ====================

function exportResults() {
    if (results.length === 0) return;
    
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dead-links-report-${Date.now()}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('📥 Report exported');
}

function generateCSV() {
    const headers = ['URL', 'Status', 'Status Text', 'Category'];
    const rows = results.map(r => [
        r.url,
        r.status,
        r.statusText || '',
        r.category
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

// ====================
// CLEAR
// ====================

function clearResults() {
    results = [];
    allLinks = [];
    
    document.getElementById('stats').style.display = 'none';
    document.getElementById('exportBtn').disabled = true;
    document.getElementById('clearBtn').disabled = true;
    
    showEmptyState('👆 Haz clic en "Analizar Enlaces" para empezar');
    
    console.log('🗑️ Results cleared');
}

// ====================
// UTILITIES
// ====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
