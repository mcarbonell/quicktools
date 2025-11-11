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
        try {
            const response = await fetch(chrome.runtime.getURL('data/tools-index.json'));
            const allTools = await response.json();
            // Mostrar solo las primeras 6 herramientas más populares
            const tools = allTools.slice(0, 6).map(tool => ({
                id: tool.slug.replace(/^tools\//, '').replace(/\.html$/, '').replace(/\//g, '-'),
                name: tool.title,
                description: tool.description,
                icon: this.getCategoryIcon(tool.category),
                url: `https://fasttools.tools/${tool.slug}`
            }));
            this.renderTools(tools);
        } catch (error) {
            console.error('❌ Error cargando herramientas:', error);
            // Fallback a herramientas por defecto
            this.renderTools([]);
        }
    }

    getCategoryIcon(category) {
        const icons = {
            'Imagen': '🖼️',
            'Datos': '📋',
            'Archivos': '📁',
            'Texto': '📝',
            'Utilidades': '🔧',
            'Conversores': '🔄',
            'IA': '🤖'
        };
        return icons[category] || '🛠️';
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
                'save-note': () => this.saveNote(),
                'copy-color': () => this.copyColor(),
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
        if(modal) {
            modal.classList.add('show');
            // Cargar contenido específico del modal
            if (modalId === 'notes-modal') {
                this.loadNotesModal();
            } else if (modalId === 'color-picker-modal') {
                this.loadColorPickerModal();
            }
        }
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

    // ====================
    // NOTES MODAL
    // ====================

    async loadNotesModal() {
        const notesList = document.getElementById('notes-list');
        if (!notesList) return;
        
        notesList.innerHTML = '';
        if (this.notes.length === 0) {
            notesList.innerHTML = '<p class="empty-state">No hay notas aún</p>';
            return;
        }
        
        this.notes.forEach(note => {
            const noteEl = document.createElement('div');
            noteEl.className = 'note-item';
            noteEl.innerHTML = `
                <div class="note-title">${note.title || 'Sin título'}</div>
                <div class="note-preview">${(note.content || '').substring(0, 50)}...</div>
            `;
            notesList.appendChild(noteEl);
        });
    }

    async saveNote() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        
        if (!content) {
            this.showToast('La nota no puede estar vacía', 'warning');
            return;
        }
        
        const note = {
            id: Date.now(),
            title: title || 'Sin título',
            content: content,
            created: Date.now(),
            modified: Date.now()
        };
        
        this.notes.unshift(note);
        await chrome.storage.local.set({ notes: { items: this.notes } });
        
        // Limpiar formulario
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        
        this.showToast('Nota guardada', 'success');
        this.loadNotesModal();
    }

    // ====================
    // COLOR PICKER MODAL
    // ====================

    loadColorPickerModal() {
        const colorInput = document.getElementById('color-input');
        const colorHex = document.getElementById('color-hex');
        const colorRgb = document.getElementById('color-rgb');
        
        if (!colorInput) return;
        
        // Update color values on change
        colorInput.addEventListener('input', (e) => {
            const hex = e.target.value;
            const rgb = this.hexToRgb(hex);
            colorHex.value = hex;
            colorRgb.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            this.currentColor = hex;
        });
        
        // Load recent colors
        this.loadRecentColors();
    }

    async loadRecentColors() {
        const data = await chrome.storage.local.get('recentColors');
        const colors = data.recentColors || ['#13a4ec', '#000000', '#ffffff'];
        
        const container = document.getElementById('recent-colors-popup');
        if (!container) return;
        
        container.innerHTML = '';
        colors.slice(0, 6).forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            colorBox.title = color;
            colorBox.onclick = () => {
                document.getElementById('color-input').value = color;
                document.getElementById('color-hex').value = color;
                const rgb = this.hexToRgb(color);
                document.getElementById('color-rgb').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                this.currentColor = color;
            };
            container.appendChild(colorBox);
        });
    }

    async copyColor() {
        const hex = document.getElementById('color-hex').value;
        try {
            await navigator.clipboard.writeText(hex);
            this.showToast('Color copiado: ' + hex, 'success');
            
            // Save to recent colors
            const data = await chrome.storage.local.get('recentColors');
            const colors = data.recentColors || [];
            if (!colors.includes(hex)) {
                colors.unshift(hex);
                await chrome.storage.local.set({ recentColors: colors.slice(0, 10) });
            }
        } catch (error) {
            this.showToast('Error copiando color', 'error');
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
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