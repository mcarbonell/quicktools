// ====================
// AI SMART RECOMMENDER - POPUP
// ====================

class AIRecommenderPopup {
    constructor() {
        this.currentUrl = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando AI Recommender Popup...');

        // Obtener URL actual
        await this.getCurrentUrl();

        // Mostrar URL actual si existe
        if (this.currentUrl) {
            document.getElementById('currentSite').style.display = 'block';
            document.getElementById('currentUrl').textContent = new URL(this.currentUrl).hostname;
        }

        // Cargar recomendaciones
        await this.loadRecommendations();

        // Event listeners
        this.setupEventListeners();
    }

    async getCurrentUrl() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.url && !tab.url.startsWith('chrome://')) {
                this.currentUrl = tab.url;
            }
        } catch (error) {
            console.error('❌ Error obteniendo URL actual:', error);
        }
    }

    async loadRecommendations() {
        console.log('📊 Cargando recomendaciones...');

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

            // Mostrar perfil
            this.displayProfile(response.profile);

            // Mostrar recomendaciones
            this.displayRecommendations(response.recommendations);

            // Mostrar contenido
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').style.display = 'block';

            console.log('✅ Recomendaciones cargadas');

        } catch (error) {
            console.error('❌ Error cargando recomendaciones:', error);
            this.showError(error.message);
        }
    }

    displayProfile(profile) {
        document.getElementById('profileRole').textContent = profile.profile || '-';
        document.getElementById('profileLevel').textContent = profile.level || '-';
        document.getElementById('profileInterests').textContent = profile.interests?.join(', ') || '-';
        document.getElementById('profileStack').textContent = profile.stack?.join(', ') || '-';
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations');
        
        // Convertir markdown a HTML básico
        const html = this.markdownToHtml(recommendations);
        container.innerHTML = html;
    }

    markdownToHtml(markdown) {
        let html = markdown;

        // Headers
        html = html.replace(/### (.*?)$/gm, '<h3>$1</h3>');
        html = html.replace(/## (.*?)$/gm, '<h3>$1</h3>');

        // Bold (antes de links para evitar conflictos)
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Lists
        html = html.replace(/^[*-] (.*?)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*?<\/li>\n?)+/gs, '<ul>$&</ul>');

        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    }

    showError(message) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', async () => {
            await this.loadRecommendations();
        });

        // Clear cache button
        document.getElementById('clearCacheBtn').addEventListener('click', async () => {
            await chrome.runtime.sendMessage({ action: 'clear-profile-cache' });
            await this.loadRecommendations();
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AIRecommenderPopup();
});
