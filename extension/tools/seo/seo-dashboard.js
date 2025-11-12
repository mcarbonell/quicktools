// ====================
// SEO DASHBOARD
// ====================

document.addEventListener('DOMContentLoaded', async () => {
    // Check context on load
    const context = await getSEOContext();
    if (!context.hasValidTab) {
        showURLInput();
    }
    
    document.getElementById('analyzeBtn').addEventListener('click', analyzeComplete);
});

async function analyzeComplete() {
    const btn = document.getElementById('analyzeBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Analizando...';
    
    try {
        const context = await getSEOContext();
        let targetUrl;
        
        if (context.hasValidTab) {
            targetUrl = context.url;
        } else {
            // Get URL from input
            const urlInput = document.getElementById('manual-url-input');
            if (!urlInput || !urlInput.value.trim()) {
                throw new Error('Por favor ingresa una URL válida');
            }
            targetUrl = urlInput.value.trim();
        }
        
        // For now, we need tab context for chrome.tabs.sendMessage
        // This is a limitation - we'll show a message
        if (!context.hasValidTab) {
            throw new Error('Esta herramienta requiere una pestaña activa. Ábrela desde el popup de la extensión mientras navegas un sitio.');
        }
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Get all SEO data
        let metaTags, headings, links;
        try {
            metaTags = await chrome.tabs.sendMessage(tab.id, { action: 'getMetaTags' });
            headings = await chrome.tabs.sendMessage(tab.id, { action: 'getHeadings' });
            links = await chrome.tabs.sendMessage(tab.id, { action: 'extractLinks' });
        } catch (error) {
            if (error.message.includes('Receiving end does not exist')) {
                throw new Error('Por favor, recarga la página (F5) y vuelve a intentarlo. El content script no está disponible.');
            }
            throw error;
        }
        
        const score = calculateSEOScore({
            title: metaTags.metaTags.title,
            description: metaTags.metaTags.description,
            canonical: metaTags.metaTags.canonical,
            og: metaTags.metaTags.og,
            headings: headings.headings,
            linksCount: links.links.length
        });
        
        renderScore(score);
        
    } catch (error) {
        document.getElementById('results').innerHTML = `<div class="empty-state"><p>Error: ${error.message}</p></div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = '▶️ Analizar Página Completa';
    }
}

function calculateSEOScore(data) {
    let score = 0;
    const checks = [];
    
    // Title (15 points)
    if (data.title && data.title.length >= 30 && data.title.length <= 60) {
        score += 15;
        checks.push({ name: 'Title', status: 'ok' });
    } else {
        checks.push({ name: 'Title', status: 'warning' });
    }
    
    // Description (15 points)
    if (data.description && data.description.length >= 120 && data.description.length <= 160) {
        score += 15;
        checks.push({ name: 'Description', status: 'ok' });
    } else {
        checks.push({ name: 'Description', status: 'warning' });
    }
    
    // H1 (20 points)
    const h1Count = data.headings?.filter(h => h.level === 1).length || 0;
    if (h1Count === 1) {
        score += 20;
        checks.push({ name: 'H1', status: 'ok' });
    } else {
        checks.push({ name: 'H1', status: 'error' });
    }
    
    // Canonical (10 points)
    if (data.canonical) {
        score += 10;
        checks.push({ name: 'Canonical', status: 'ok' });
    }
    
    // Open Graph (20 points)
    if (data.og && Object.keys(data.og).length >= 4) {
        score += 20;
        checks.push({ name: 'Open Graph', status: 'ok' });
    }
    
    // Links (20 points)
    if (data.linksCount >= 5) {
        score += 20;
        checks.push({ name: 'Internal Links', status: 'ok' });
    }
    
    return { score, checks };
}

function renderScore(result) {
    const container = document.getElementById('results');
    
    const scoreColor = result.score >= 80 ? '#28a745' : result.score >= 60 ? '#ffc107' : '#dc3545';
    
    container.innerHTML = `
        <div class="score-circle">
            <svg width="200" height="200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" stroke-width="20"/>
                <circle cx="100" cy="100" r="90" fill="none" stroke="${scoreColor}" stroke-width="20" 
                    stroke-dasharray="${(result.score / 100) * 565} 565" 
                    stroke-dashoffset="0" 
                    transform="rotate(-90 100 100)"/>
            </svg>
            <div class="score-value" style="color: ${scoreColor}">${result.score}</div>
        </div>
        <div class="score-label">Puntuación SEO de 100</div>
        <div style="padding: 20px; background: #f8f9fa; border-radius: 8px;">
            ${result.checks.map(check => `
                <div style="margin-bottom: 8px; color: #333;">
                    ${check.status === 'ok' ? '✅' : '⚠️'} ${check.name}
                </div>
            `).join('')}
        </div>
    `;
}

function openTool(toolFile) {
    window.location.href = toolFile;
}
