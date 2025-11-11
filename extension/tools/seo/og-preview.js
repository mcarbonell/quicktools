// ====================
// OPEN GRAPH PREVIEW
// ====================

document.addEventListener('DOMContentLoaded', async () => {
    const context = await getSEOContext();
    if (!context.hasValidTab) {
        showURLInput();
    }
});

document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const context = await getSEOContext();
    if (!context.hasValidTab) {
        document.getElementById('results').innerHTML = '<div class="empty-state"><p>Esta herramienta requiere una pestaña activa. Ábrela desde el popup mientras navegas un sitio.</p></div>';
        return;
    }
    
    const btn = document.getElementById('analyzeBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Generando...';
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getMetaTags' });
        const og = response.metaTags.og;
        
        const container = document.getElementById('results');
        container.innerHTML = `
            <div class="preview-card">
                <img class="preview-image" src="${og.image || ''}" alt="Preview" onerror="this.style.display='none'">
                <div class="preview-content">
                    <div class="preview-title">${og.title || response.metaTags.title || 'Sin título'}</div>
                    <div class="preview-desc">${og.description || response.metaTags.description || 'Sin descripción'}</div>
                    <div class="preview-url">${og.url || tab.url}</div>
                </div>
            </div>
        `;
    } catch (error) {
        document.getElementById('results').innerHTML = `<div class="empty-state"><p>Error: ${error.message}</p></div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = '▶️ Generar Preview';
    }
});
