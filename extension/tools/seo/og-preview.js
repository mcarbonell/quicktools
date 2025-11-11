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
        
        const previewCard = document.createElement('div');
        previewCard.className = 'preview-card';
        
        // Only add image if og.image exists
        if (og.image) {
            const img = document.createElement('img');
            img.className = 'preview-image';
            img.src = og.image;
            img.alt = 'Preview';
            img.onerror = function() { this.style.display = 'none'; };
            previewCard.appendChild(img);
        }
        
        const content = document.createElement('div');
        content.className = 'preview-content';
        content.innerHTML = `
            <div class="preview-title">${escapeHtml(og.title || response.metaTags.title || 'Sin título')}</div>
            <div class="preview-desc">${escapeHtml(og.description || response.metaTags.description || 'Sin descripción')}</div>
            <div class="preview-url">${escapeHtml(og.url || tab.url)}</div>
        `;
        
        previewCard.appendChild(content);
        container.innerHTML = '';
        container.appendChild(previewCard);
    } catch (error) {
        document.getElementById('results').innerHTML = `<div class="empty-state"><p>Error: ${error.message}</p></div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = '▶️ Generar Preview';
    }
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
