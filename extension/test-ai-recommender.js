// ====================
// TEST AI RECOMMENDER
// ====================

const resultsDiv = document.getElementById('results');

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const className = type === 'error' ? 'error' : type === 'success' ? 'success' : '';
    resultsDiv.innerHTML += `<span class="${className}">[${timestamp}] ${message}</span>\n`;
    resultsDiv.scrollTop = resultsDiv.scrollHeight;
}

// Test 1: Analizar historial
document.getElementById('analyzeBtn').addEventListener('click', async () => {
    log('🔍 Analizando historial...');
    try {
        const response = await chrome.runtime.sendMessage({
            action: 'analyze-history',
            days: 30
        });

        if (response.success) {
            log('✅ Análisis completado', 'success');
            log(`Total visitas: ${response.analysis.totalVisits}`);
            log(`Sitios únicos: ${response.analysis.uniqueDomains}`);
            log(`Top 5 sitios: ${response.analysis.topDomains.slice(0, 5).map(d => d.domain).join(', ')}`);
            log(`\nPerfil inferido:`);
            log(`- Rol: ${response.profile.profile}`);
            log(`- Nivel: ${response.profile.level}`);
            log(`- Intereses: ${response.profile.interests.join(', ')}`);
            log(`- Stack: ${response.profile.stack.join(', ')}`);
        } else {
            log(`❌ Error: ${response.error}`, 'error');
        }
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'error');
    }
});

// Test 2: Obtener recomendaciones generales
document.getElementById('recommendBtn').addEventListener('click', async () => {
    log('🎯 Obteniendo recomendaciones...');
    try {
        const response = await chrome.runtime.sendMessage({
            action: 'get-recommendations'
        });

        if (response.success) {
            log('✅ Recomendaciones generadas', 'success');
            log(`\n${response.recommendations}`);
        } else {
            log(`❌ Error: ${response.error}`, 'error');
        }
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'error');
    }
});

// Test 3: Obtener recomendaciones para sitio actual
document.getElementById('recommendCurrentBtn').addEventListener('click', async () => {
    log('🌐 Obteniendo recomendaciones para sitio actual...');
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.runtime.sendMessage({
            action: 'get-recommendations',
            currentUrl: tab.url
        });

        if (response.success) {
            log('✅ Recomendaciones generadas', 'success');
            log(`\n${response.recommendations}`);
        } else {
            log(`❌ Error: ${response.error}`, 'error');
        }
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'error');
    }
});

// Test 4: Limpiar caché
document.getElementById('clearBtn').addEventListener('click', async () => {
    log('🗑️ Limpiando caché...');
    try {
        await chrome.runtime.sendMessage({
            action: 'clear-profile-cache'
        });
        log('✅ Caché limpiado', 'success');
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'error');
    }
});

// Test 5: Abrir popup
document.getElementById('openPopupBtn').addEventListener('click', async () => {
    log('🚀 Abriendo popup...');
    try {
        const width = 520;
        const height = 600;
        const left = Math.round((screen.width - width) / 2);
        const top = Math.round((screen.height - height) / 2);

        await chrome.windows.create({
            url: chrome.runtime.getURL('popup/ai-recommender.html'),
            type: 'popup',
            width: width,
            height: height,
            left: left,
            top: top
        });
        log('✅ Popup abierto', 'success');
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'error');
    }
});

log('✅ Test page cargada. Haz click en los botones para probar.', 'success');
