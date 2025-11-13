// ====================
// SIMILAR PAGES - POPUP
// ====================

class SimilarPagesPopup {
    constructor() {
        this.currentUrl = null;
        this.sites = [];
        this.cacheKey = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando Similar Pages Popup...');

        // Obtener URL actual
        await this.getCurrentUrl();

        if (!this.currentUrl) {
            this.showError('No se pudo obtener la URL actual');
            return;
        }

        // Mostrar URL actual
        const hostname = new URL(this.currentUrl).hostname.replace('www.', '');
        document.getElementById('currentSite').textContent = hostname;
        this.cacheKey = `similar-pages-${hostname}`;

        // Intentar cargar desde caché primero
        const cached = await this.loadFromCache();
        if (cached) {
            console.log('✅ Cargado desde caché');
            this.sites = cached;
            this.displaySites();
            this.showCacheInfo(true);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        } else {
            // Cargar recomendaciones nuevas
            await this.loadSimilarSites();
        }

        // Event listeners
        this.setupEventListeners();
    }

    async getCurrentUrl() {
        try {
            // Intentar obtener URL desde storage.session (pasada por service worker)
            const data = await chrome.storage.session.get('similar-pages-url');
            if (data['similar-pages-url']) {
                this.currentUrl = data['similar-pages-url'];
                // Limpiar storage
                await chrome.storage.session.remove('similar-pages-url');
                return;
            }
            
            // Fallback: intentar obtener de tabs (puede no funcionar en popup)
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
                this.currentUrl = tab.url;
            }
        } catch (error) {
            console.error('❌ Error obteniendo URL actual:', error);
        }
    }

    async loadSimilarSites() {
        console.log('🌐 Cargando sitios similares...');

        try {
            // Mostrar loading
            document.getElementById('loading').style.display = 'block';
            document.getElementById('content').style.display = 'none';
            document.getElementById('error').style.display = 'none';

            // Solicitar recomendaciones al background
            const response = await chrome.runtime.sendMessage({
                action: 'get-recommendations',
                currentUrl: this.currentUrl
            });

            if (!response.success) {
                throw new Error(response.error || 'Error desconocido');
            }

            // Parsear sitios de las recomendaciones
            this.sites = this.parseSites(response.recommendations);

            // Guardar en caché
            await this.saveToCache(this.sites);
            
            // Mostrar sitios
            this.displaySites();
            this.showCacheInfo(false);

            // Mostrar contenido
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').style.display = 'block';

            console.log('✅ Sitios similares cargados y cacheados:', this.sites.length);

        } catch (error) {
            console.error('❌ Error cargando sitios similares:', error);
            this.showError(error.message);
        }
    }

    parseSites(recommendations) {
        const sites = [];
        
        // Buscar todos los enlaces markdown [Nombre](URL)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        
        while ((match = linkRegex.exec(recommendations)) !== null) {
            const name = match[1];
            const url = match[2];
            
            // Buscar descripción después del enlace
            const afterLink = recommendations.substring(match.index + match[0].length);
            const nextLinkIndex = afterLink.search(/\[([^\]]+)\]\(([^)]+)\)/);
            
            let description = '';
            if (nextLinkIndex > 0) {
                description = afterLink.substring(0, nextLinkIndex);
            } else {
                description = afterLink.substring(0, 200); // Máximo 200 caracteres
            }
            
            // Limpiar descripción
            description = description
                .replace(/\*\*/g, '') // Eliminar negritas
                .replace(/\*/g, '') // Eliminar asteriscos
                .replace(/\n+/g, ' ') // Reemplazar saltos de línea
                .replace(/^[\s-*]+/, '') // Eliminar espacios y guiones al inicio
                .replace(/Por qué.*$/i, '') // Eliminar "Por qué es relevante"
                .replace(/Relevante porque/i, '') // Eliminar "Relevante porque"
                .replace(/Descripción:/i, '') // Eliminar "Descripción:"
                .replace(/https?:\/\/[^\s]+/g, '') // Eliminar URLs sueltas
                .trim();
            
            // Solo agregar si tiene nombre y URL válidos
            if (name && url && url.startsWith('http')) {
                sites.push({ name, url, description });
            }
            
            if (sites.length >= 5) break; // Máximo 5 sitios
        }
        
        return sites;
    }

    displaySites() {
        const container = document.getElementById('sites');
        
        if (this.sites.length === 0) {
            container.innerHTML = '<div class="empty">No se encontraron sitios similares</div>';
            return;
        }

        container.innerHTML = '';
        
        this.sites.forEach(site => {
            const item = document.createElement('div');
            item.className = 'site-item';
            
            // Extraer dominio de la URL para mostrar
            let displayUrl = site.url;
            try {
                const urlObj = new URL(site.url);
                displayUrl = urlObj.hostname.replace('www.', '');
            } catch (e) {}
            
            item.innerHTML = `
                <div class="site-name">${this.escapeHtml(site.name)}</div>
                <div class="site-url">${this.escapeHtml(displayUrl)}</div>
                ${site.description ? `<div class="site-description">${this.escapeHtml(site.description)}</div>` : ''}
            `;
            
            item.addEventListener('click', () => {
                chrome.tabs.create({ url: site.url });
            });
            
            container.appendChild(item);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
    }

    async loadFromCache() {
        try {
            const data = await chrome.storage.local.get(this.cacheKey);
            const cached = data[this.cacheKey];
            
            if (cached && cached.sites && cached.timestamp) {
                // Caché válido por 7 días
                const age = Date.now() - cached.timestamp;
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
                
                if (age < maxAge) {
                    return cached.sites;
                }
            }
        } catch (error) {
            console.error('❌ Error cargando caché:', error);
        }
        return null;
    }

    async saveToCache(sites) {
        try {
            await chrome.storage.local.set({
                [this.cacheKey]: {
                    sites: sites,
                    timestamp: Date.now()
                }
            });
            console.log('✅ Guardado en caché');
        } catch (error) {
            console.error('❌ Error guardando caché:', error);
        }
    }

    showCacheInfo(fromCache) {
        const info = document.getElementById('cacheInfo');
        if (info) {
            info.textContent = fromCache ? '⚡ Resultados instantáneos (cacheados)' : '✅ Nuevos resultados guardados';
        }
    }

    setupEventListeners() {
        // Refresh button - forzar recarga sin caché
        document.getElementById('refreshBtn').addEventListener('click', async () => {
            // Mostrar loading
            document.getElementById('loading').style.display = 'block';
            document.getElementById('content').style.display = 'none';
            
            // Limpiar caché para este sitio
            await chrome.storage.local.remove(this.cacheKey);
            
            // Recargar
            await this.loadSimilarSites();
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SimilarPagesPopup();
});
