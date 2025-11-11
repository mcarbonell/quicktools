// ====================
// SCHEMA VALIDATOR
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
    btn.textContent = '⏳ Analizando...';
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getSchema' });
        
        const container = document.getElementById('results');
        container.innerHTML = '';
        
        if (response.schemas.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No se encontró structured data en esta página</p></div>';
        } else {
            response.schemas.forEach(schema => {
                const item = document.createElement('div');
                item.className = 'schema-item';
                item.innerHTML = `
                    <div class="schema-type">${schema.type}: ${schema.itemType || schema.data['@type'] || 'Unknown'}</div>
                    <div class="schema-data">${JSON.stringify(schema.data || schema.itemType, null, 2)}</div>
                `;
                container.appendChild(item);
            });
        }
    } catch (error) {
        document.getElementById('results').innerHTML = `<div class="empty-state"><p>Error: ${error.message}</p></div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = '▶️ Analizar Schema';
    }
});
