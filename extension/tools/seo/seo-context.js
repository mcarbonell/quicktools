// ====================
// SEO CONTEXT HELPER
// ====================
// Detecta si hay tab activa válida o necesita input de URL

async function getSEOContext() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Check if tab is valid (not chrome://, about:, extension pages, etc.)
        if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://') && !tab.url.startsWith('about:')) {
            return {
                hasValidTab: true,
                tabId: tab.id,
                url: tab.url,
                title: tab.title
            };
        }
        
        return {
            hasValidTab: false,
            tabId: null,
            url: null,
            title: null
        };
    } catch (error) {
        console.error('Error getting SEO context:', error);
        return {
            hasValidTab: false,
            tabId: null,
            url: null,
            title: null
        };
    }
}

function showURLInput(containerId = 'url-input-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('URL input container not found');
        return;
    }
    
    container.style.display = 'block';
    container.innerHTML = `
        <div style="margin-bottom: 24px; padding: 16px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #856404;">
                ⚠️ No hay pestaña activa válida
            </div>
            <div style="font-size: 14px; color: #856404; margin-bottom: 12px;">
                Ingresa la URL del sitio que deseas analizar:
            </div>
            <div style="display: flex; gap: 8px;">
                <input 
                    type="url" 
                    id="manual-url-input" 
                    placeholder="https://ejemplo.com" 
                    style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;"
                />
                <button 
                    id="analyze-url-btn" 
                    style="padding: 10px 20px; background: #13a4ec; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;"
                >
                    Analizar
                </button>
            </div>
        </div>
    `;
}

function hideURLInput(containerId = 'url-input-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.style.display = 'none';
    }
}

async function getTargetURL() {
    const context = await getSEOContext();
    
    if (context.hasValidTab) {
        return context.url;
    }
    
    // Show URL input and wait for user input
    showURLInput();
    
    return new Promise((resolve, reject) => {
        const analyzeBtn = document.getElementById('analyze-url-btn');
        const urlInput = document.getElementById('manual-url-input');
        
        if (!analyzeBtn || !urlInput) {
            reject(new Error('URL input elements not found'));
            return;
        }
        
        analyzeBtn.onclick = () => {
            const url = urlInput.value.trim();
            
            if (!url) {
                alert('Por favor ingresa una URL válida');
                return;
            }
            
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                alert('La URL debe comenzar con http:// o https://');
                return;
            }
            
            hideURLInput();
            resolve(url);
        };
        
        // Allow Enter key
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                analyzeBtn.click();
            }
        });
    });
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getSEOContext, showURLInput, hideURLInput, getTargetURL };
}
