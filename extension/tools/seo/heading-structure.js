// ====================
// HEADING STRUCTURE CHECKER
// ====================

document.addEventListener('DOMContentLoaded', async () => {
    const context = await getSEOContext();
    if (!context.hasValidTab) {
        showURLInput();
    }
    document.getElementById('analyzeBtn').addEventListener('click', analyzePage);
});

async function analyzePage() {
    const btn = document.getElementById('analyzeBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Analizando...';
    
    try {
        const context = await getSEOContext();
        if (!context.hasValidTab) {
            throw new Error('Esta herramienta requiere una pestaña activa. Ábrela desde el popup mientras navegas un sitio.');
        }
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        let response;
        try {
            response = await chrome.tabs.sendMessage(tab.id, { action: 'getHeadings' });
        } catch (error) {
            if (error.message.includes('Receiving end does not exist')) {
                throw new Error('Por favor, recarga la página (F5) y vuelve a intentarlo. El content script no está disponible.');
            }
            throw error;
        }
        
        if (!response || !response.headings) {
            throw new Error('No se pudieron extraer los encabezados');
        }
        
        renderResults(response.headings, response.issues);
        
    } catch (error) {
        document.getElementById('results').innerHTML = `<div class="empty-state"><p>Error: ${error.message}</p></div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = '▶️ Analizar Estructura';
    }
}

function renderResults(headings, issues) {
    const container = document.getElementById('results');
    container.innerHTML = '';
    
    if (issues && issues.length > 0) {
        const issuesDiv = document.createElement('div');
        issuesDiv.className = 'issues';
        issuesDiv.innerHTML = '<strong>⚠️ Problemas detectados:</strong>';
        issues.forEach(issue => {
            const item = document.createElement('div');
            item.className = 'issue-item';
            item.textContent = `• ${issue.message}`;
            issuesDiv.appendChild(item);
        });
        container.appendChild(issuesDiv);
    }
    
    headings.forEach(heading => {
        const item = document.createElement('div');
        item.className = `heading-item h${heading.level}`;
        item.innerHTML = `<span class="heading-tag">${heading.tag.toUpperCase()}</span><span class="heading-text">${escapeHtml(heading.text)}</span>`;
        container.appendChild(item);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
