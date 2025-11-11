// ====================
// ROBOTS.TXT VALIDATOR
// ====================

document.addEventListener('DOMContentLoaded', async () => {
    const context = await getSEOContext();
    if (!context.hasValidTab) {
        showURLInput();
    }
});

document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const context = await getSEOContext();
    let targetUrl;
    
    if (context.hasValidTab) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        targetUrl = tab.url;
    } else {
        const urlInput = document.getElementById('manual-url-input');
        if (!urlInput || !urlInput.value.trim()) {
            document.getElementById('results').innerHTML = '<div class="empty-state"><p>Por favor ingresa una URL válida</p></div>';
            return;
        }
        targetUrl = urlInput.value.trim();
    }
    
    const btn = document.getElementById('analyzeBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Obteniendo...';
    
    try {
        const url = new URL(targetUrl);
        const robotsUrl = `${url.origin}/robots.txt`;
        
        const response = await fetch(robotsUrl);
        const text = await response.text();
        
        const container = document.getElementById('results');
        if (response.ok) {
            container.innerHTML = `
                <div style="margin-bottom: 16px; color: #28a745; font-weight: 600;">✅ Robots.txt encontrado</div>
                <div class="robots-content">${text}</div>
            `;
        } else {
            container.innerHTML = '<div class="empty-state"><p>⚠️ No se encontró robots.txt en este sitio</p></div>';
        }
    } catch (error) {
        document.getElementById('results').innerHTML = `<div class="empty-state"><p>❌ Error: ${error.message}</p></div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = '▶️ Obtener Robots.txt';
    }
});
