// QuickTools Extension - Popup JavaScript
// Maneja la interfaz de usuario del popup

class QuickToolsPopup {
    constructor() {
        this.currentUser = null;
        this.currentSettings = null;
        this.analytics = null;
        this.notes = [];
        this.currentColor = '#000000';

        this.init();
    }

    async init() {
        console.log('🚀 Inicializando QuickTools Popup');
        try {
            await this.loadUserData();
            this.setupEventListeners();
            await this.loadTools();
            await this.loadAnalytics();
            await this.loadRecentItems();
            this.updateUI();
            console.log('✅ QuickTools Popup inicializado');
        } catch (error) {
            console.error('❌ Error inicializando popup:', error);
            this.showToast('Error inicializando la extensión', 'error');
        }
    }

    // ====================
    // DATA LOADING
    // ====================

    async loadUserData() {
        const data = await chrome.storage.local.get(['user', 'settings', 'analytics', 'notes']);
        this.currentUser = data.user;
        this.currentSettings = data.settings || this.getDefaultSettings();
        this.analytics = data.analytics || {};
        this.notes = data.notes?.items || [];
    }

    getDefaultSettings() {
        return { theme: 'auto', autoCapture: false, saveToClipboard: true, showTooltips: true, enableAnalytics: true };
    }

    async loadTools() {
        const tools = [
            { id: 'json-formatter', name: 'JSON Formatter', description: 'Formatear y validar JSON', icon: '📋', url: 'https://fasttools.tools/tools/json-formatter' },
            { id: 'base64-encoder', name: 'Base64 Encoder', description: 'Codificar/Decodificar Base64', icon: '🔐', url: 'https://fasttools.tools/tools/base64-encoder' },
            { id: 'url-encoder', name: 'URL Encoder', description: 'Codificar URLs', icon: '🔗', url: 'https://fasttools.tools/tools/url-encoder' },
            { id: 'hash-calculator', name: 'Hash Calculator', description: 'MD5, SHA1, SHA256', icon: '🔢', url: 'https://fasttools.tools/tools/hash-calculator' },
            { id: 'color-palette', name: 'Color Palette', description: 'Generar paletas de colores', icon: '🎨', url: 'https://fasttools.tools/tools/color-palette' },
            { id: 'image-resizer', name: 'Image Resizer', description: 'Redimensionar imágenes', icon: '🖼️', url: 'https://fasttools.tools/tools/image-resizer' }
        ];
        this.renderTools(tools);
    }

    async loadAnalytics() {
        if (!this.currentSettings.enableAnalytics) return;
        const today = new Date().toDateString();
        const todayUsage = this.analytics.dailyUsage?.[today] || {};
        const totalToday = Object.values(todayUsage).reduce((sum, count) => sum + count, 0);
        document.getElementById('usage-today').textContent = `${totalToday} usos hoy`;

        let favoriteTool = 'Captura';
        let maxUsage = 0;
        for (const [tool, count] of Object.entries(todayUsage)) {
            if (count > maxUsage) {
                maxUsage = count;
                favoriteTool = this.getToolName(tool);
            }
        }
        document.getElementById('favorite-tool').textContent = favoriteTool;
    }

    async loadRecentItems() {
        const data = await chrome.storage.local.get(['captures', 'notes']);
        const recentItems = [];
        if (data.captures && Array.isArray(data.captures)) {
            recentItems.push(...data.captures.slice(0, 2).map(c => ({ type: 'capture', ...c })));
        }
        if (data.notes && Array.isArray(data.notes.items)) {
            recentItems.push(...data.notes.items.slice(0, 2).map(n => ({ type: 'note', ...n })));
        }
        recentItems.sort((a, b) => (b.timestamp || b.modified) - (a.timestamp || a.modified));

        if (recentItems.length > 0) {
            document.getElementById('recent-section').style.display = 'block';
            this.renderRecentItems(recentItems.slice(0, 3));
        }
    }

    // ====================
    // RENDERING
    // ====================

    renderTools(tools) {
        const container = document.getElementById('tools-grid');
        container.innerHTML = '';
        tools.forEach(tool => container.appendChild(this.createToolCard(tool)));
    }

    createToolCard(tool) {
        const card = document.createElement('a');
        card.className = 'tool-card fade-in';
        card.href = tool.url;
        card.target = '_blank';
        card.dataset.action = 'open-tool';
        card.dataset.toolId = tool.id;
        const usage = this.getToolUsage(tool.id);
        card.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-info">
                <div class="tool-name">${tool.name}</div>
                <div class.tool-description">${tool.description}</div>
            </div>
            <div class="tool-usage">${usage}</div>`;
        return card;
    }

    renderRecentItems(items) {
        const container = document.getElementById('recent-items');
        container.innerHTML = '';
        items.forEach(item => container.appendChild(this.createRecentItem(item)));
    }

    createRecentItem(item) {
        const div = document.createElement('div');
        div.className = 'recent-item slide-in';
        div.innerHTML = `
            <div class="recent-icon">${item.type === 'capture' ? '📸' : '📝'}</div>
            <div class="recent-content">
                <div class="recent-title">${item.title || (item.type === 'capture' ? 'Captura de pantalla' : 'Nota sin título')}</div>
                <div class="recent-time">${this.getTimeAgo(item.timestamp || item.modified)}</div>
            </div>`;
        return div;
    }

    updateUI() {
        const tierBadge = document.getElementById('tier-badge');
        const tier = this.currentUser?.tier || 'free';
        tierBadge.className = `tier-badge ${tier}`;
        tierBadge.innerHTML = `<span class="tier-text">${this.getTierIcon(tier)} ${this.getTierName(tier)}</span>`;
    }

    // ====================
    // EVENT HANDLERS
    // ====================

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            e.preventDefault();
            const action = target.dataset.action;
            
            const actions = {
                'capture-screen': () => this.captureScreen(),
                'open-tool': () => this.openTool(target.href, target.dataset.toolId),
                'show-modal': () => this.showModal(target.dataset.modal),
                'close-modal': () => this.closeModal(target.dataset.modal),
                'save-settings': () => this.saveSettings(),
            };

            if (actions[action]) {
                actions[action]();
            }
        });
    }
    
    // ====================
    // ACTIONS
    // ====================

    captureScreen() {
        chrome.runtime.sendMessage({ action: 'capture-screen' });
        this.showToast('Iniciando captura...', 'info');
        window.close();
    }

    async openTool(url, toolId) {
        this.trackToolUsage(toolId);
        await chrome.tabs.create({ url: url, active: true });
        window.close();
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.add('show');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('show');
    }

    saveSettings() {
        const settings = {
            theme: document.getElementById('theme-select').value,
            autoCapture: document.getElementById('auto-capture').checked,
            saveToClipboard: document.getElementById('save-to-clipboard').checked,
            showTooltips: document.getElementById('show-tooltips').checked,
            enableAnalytics: document.getElementById('enable-analytics').checked
        };
        chrome.runtime.sendMessage({ action: 'update-settings', settings: settings });
        this.showToast('Configuración guardada', 'success');
        this.closeModal('settings-modal');
    }

    // ====================
    // UTILITY FUNCTIONS
    // ====================

    trackToolUsage(toolId, source = 'popup') {
        chrome.runtime.sendMessage({ action: 'track-usage', toolId: toolId, source: source });
    }

    getToolUsage(toolId) {
        const today = new Date().toDateString();
        const usage = this.analytics.dailyUsage?.[today]?.[toolId] || 0;
        return usage > 0 ? usage : 'Nuevo';
    }

    getToolName(toolId) {
        const toolNames = { 'json-formatter': 'JSON', 'base64-encoder': 'Base64', 'url-encoder': 'URL', 'hash-calculator': 'Hash', 'capture-screen': 'Captura', 'notes': 'Notas', 'timer': 'Timer' };
        return toolNames[toolId] || toolId;
    }

    getTierIcon(tier) {
        return { 'free': '🆓', 'premium': '💎', 'business': '💼' }[tier] || '🆓';
    }

    getTierName(tier) {
        return { 'free': 'Free', 'premium': 'Premium', 'business': 'Business' }[tier] || 'Free';
    }

    getTimeAgo(timestamp) {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(diff / 3600000);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(diff / 86400000);
        return `${days}d`;
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}


// ====================
// INITIALIZATION
// ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new QuickToolsPopup());
} else {
    new QuickToolsPopup();
}