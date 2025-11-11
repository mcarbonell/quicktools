// ====================
// SEO DASHBOARD
// ====================

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('analyzeBtn').addEventListener('click', analyzeComplete);
});

async function analyzeComplete() {
    const btn = document.getElementById('analyzeBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Analizando...';
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Get all SEO data
        const metaTags = await chrome.tabs.sendMessage(tab.id, { action: 'getMetaTags' });
        const headings = await chrome.tabs.sendMessage(tab.id, { action: 'getHeadings' });
        const links = await chrome.tabs.sendMessage(tab.id, { action: 'extractLinks' });
        
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
                <div style="margin-bottom: 8px;">
                    ${check.status === 'ok' ? '✅' : '⚠️'} ${check.name}
                </div>
            `).join('')}
        </div>
    `;
}

function openTool(toolFile) {
    window.location.href = toolFile;
}
