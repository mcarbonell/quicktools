// QuickTools Extension - Popup JavaScript
// Maneja la interfaz de usuario del popup

class QuickToolsPopup {
    constructor() {
        this.currentUser = null;
        this.currentSettings = null;
        this.analytics = null;
        this.notes = [];
        this.timer = {
            mode: 'stopwatch',
            isRunning: false,
            startTime: 0,
            elapsed: 0,
            interval: null
        };

        this.init();
    }

    async init() {
        console.log('🚀 Inicializando QuickTools Popup');

        try {
            // Load user data
            await this.loadUserData();

            // Setup event listeners
            this.setupEventListeners();

            // Load tools
            await this.loadTools();

            // Load analytics
            await this.loadAnalytics();

            // Load recent items
            await this.loadRecentItems();

            // Update UI
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
        const data = await chrome.storage.local.get([
            'user', 'settings', 'analytics', 'notes'
        ]);

        this.currentUser = data.user;
        this.currentSettings = data.settings || this.getDefaultSettings();
        this.analytics = data.analytics || {};
        this.notes = data.notes?.items || [];
    }

    getDefaultSettings() {
        return {
            theme: 'auto',
            autoCapture: false,
            saveToClipboard: true,
            showTooltips: true,
            enableAnalytics: true
        };
    }

    async loadTools() {
        const tools = [
            {
                id: 'json-formatter',
                name: 'JSON Formatter',
                description: 'Formatear y validar JSON',
                icon: '📋',
                category: 'data',
                url: 'https://quicktools.dev/tools/json-formatter'
            },
            {
                id: 'base64-encoder',
                name: 'Base64 Encoder',
                description: 'Codificar/Decodificar Base64',
                icon: '🔐',
                category: 'text',
                url: 'https://quicktools.dev/tools/base64-encoder'
            },
            {
                id: 'url-encoder',
                name: 'URL Encoder',
                description: 'Codificar URLs',
                icon: '🔗',
                category: 'text',
                url: 'https://quicktools.dev/tools/url-encoder'
            },
            {
                id: 'hash-calculator',
                name: 'Hash Calculator',
                description: 'MD5, SHA1, SHA256',
                icon: '🔢',
                category: 'text',
                url: 'https://quicktools.dev/tools/hash-calculator'
            },
            {
                id: 'color-palette',
                name: 'Color Palette',
                description: 'Generar paletas de colores',
                icon: '🎨',
                category: 'image',
                url: 'https://quicktools.dev/tools/color-palette'
            },
            {
                id: 'image-resizer',
                name: 'Image Resizer',
                description: 'Redimensionar imágenes',
                icon: '🖼️',
                category: 'image',
                url: 'https://quicktools.dev/tools/image-resizer'
            }
        ];

        this.renderTools(tools);
    }

    async loadAnalytics() {
        if (!this.currentSettings.enableAnalytics) {
            return;
        }

        // Calculate today's usage
        const today = new Date().toDateString();
        const todayUsage = this.analytics.dailyUsage?.[today] || {};
        const totalToday = Object.values(todayUsage).reduce((sum, count) => sum + count, 0);

        // Update stats
        document.getElementById('usage-today').textContent = `${totalToday} usos hoy`;

        // Find favorite tool
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
        // Load recent captures, notes, etc.
        const data = await chrome.storage.local.get(['recent', 'captures', 'notes']);
        const recent = data.recent || [];

        if (recent.length > 0) {
            document.getElementById('recent-section').style.display = 'block';
            this.renderRecentItems(recent);
        }
    }

    // ====================
    // RENDERING
    // ====================

    renderTools(tools) {
        const container = document.getElementById('tools-grid');
        container.innerHTML = '';

        tools.forEach(tool => {
            const toolCard = this.createToolCard(tool);
            container.appendChild(toolCard);
        });
    }

    createToolCard(tool) {
        const card = document.createElement('div');
        card.className = 'tool-card fade-in';
        card.onclick = () => this.openTool(tool);

        const usage = this.getToolUsage(tool.id);

        card.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-info">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description}</div>
            </div>
            <div class="tool-usage">${usage}</div>
        `;

        return card;
    }

    renderRecentItems(items) {
        const container = document.getElementById('recent-items');
        container.innerHTML = '';

        items.slice(0, 5).forEach(item => {
            const recentItem = this.createRecentItem(item);
            container.appendChild(recentItem);
        });
    }

    createRecentItem(item) {
        const div = document.createElement('div');
        div.className = 'recent-item slide-in';

        const timeAgo = this.getTimeAgo(item.timestamp);

        div.innerHTML = `
            <div class="recent-icon">${item.icon || '📄'}</div>
            <div class="recent-content">
                <div class="recent-title">${item.title}</div>
                <div class="recent-time">${timeAgo}</div>
            </div>
        `;

        return div;
    }

    updateUI() {
        // Update tier badge
        const tierBadge = document.getElementById('tier-badge');
        const tier = this.currentUser?.tier || 'free';

        tierBadge.className = `tier-badge ${tier}`;
        tierBadge.innerHTML = `<span class="tier-text">${this.getTierIcon(tier)} ${this.getTierName(tier)}</span>`;
    }

    // ====================
    // EVENT HANDLERS
    // ====================

    setupEventListeners() {
        // Quick action buttons
        document.getElementById('capture-btn').onclick = () => this.showModal('capture-modal');
        document.getElementById('notes-btn').onclick = () => this.showModal('notes-modal');
        document.getElementById('color-picker-btn').onclick = () => this.showModal('color-picker-modal');
        document.getElementById('timer-btn').onclick = () => this.showModal('timer-modal');

        // Settings
        document.getElementById('settings-btn').onclick = () => this.showModal('settings-modal');
        document.getElementById('analytics-btn').onclick = () => this.showModal('analytics-modal');

        // Settings form
        this.setupSettingsForm();

        // Timer controls
        this.setupTimerControls();

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    setupSettingsForm() {
        // Populate settings
        document.getElementById('theme-select').value = this.currentSettings.theme;
        document.getElementById('auto-capture').checked = this.currentSettings.autoCapture;
        document.getElementById('save-to-clipboard').checked = this.currentSettings.saveToClipboard;
        document.getElementById('show-tooltips').checked = this.currentSettings.showTooltips;
        document.getElementById('enable-analytics').checked = this.currentSettings.enableAnalytics;
    }

    setupTimerControls() {
        this.updateTimerDisplay();
    }

    // ====================
    // TOOL FUNCTIONS
    // ====================

    async openTool(tool) {
        try {
            // Track usage
            this.trackToolUsage(tool.id);

            // Open in new tab
            await chrome.tabs.create({
                url: tool.url,
                active: true
            });

            // Close popup
            window.close();

        } catch (error) {
            console.error('❌ Error abriendo herramienta:', error);
            this.showToast('Error abriendo la herramienta', 'error');
        }
    }

    async showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');

        // Load specific modal content
        switch (modalId) {
            case 'notes-modal':
                this.loadNotesModal();
                break;
            case 'analytics-modal':
                this.loadAnalyticsModal();
                break;
            case 'color-picker-modal':
                this.loadColorPickerModal();
                break;
            case 'timer-modal':
                this.loadTimerModal();
                break;
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }

    // ====================
    // SPECIFIC MODALS
    // ====================

    loadNotesModal() {
        const container = document.getElementById('notes-list');
        container.innerHTML = '';

        if (this.notes.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No hay notas aún</p>';
            return;
        }

        this.notes.forEach(note => {
            const noteItem = this.createNoteItem(note);
            container.appendChild(noteItem);
        });
    }

    createNoteItem(note) {
        const div = document.createElement('div');
        div.className = 'note-item';

        div.innerHTML = `
            <div class="note-title">${note.title || 'Sin título'}</div>
            <div class="note-content">${note.content || ''}</div>
            <div class="note-time">${this.getTimeAgo(note.modified)}</div>
        `;

        div.onclick = () => this.editNote(note);

        return div;
    }

    loadAnalyticsModal() {
        // Populate analytics data
        const totalUses = this.analytics.totalSessions || 0;
        const today = new Date().toDateString();
        const todayUsage = this.analytics.dailyUsage?.[today] || {};
        const todayTotal = Object.values(todayUsage).reduce((sum, count) => sum + count, 0);

        document.getElementById('total-uses').textContent = totalUses;
        document.getElementById('today-uses').textContent = todayTotal;
        document.getElementById('favorite-tool-count').textContent = todayTotal;

        // Calculate average session (mock data for now)
        document.getElementById('avg-session').textContent = '5m';
    }

    loadColorPickerModal() {
        // Initialize color picker
        this.currentColor = '#000000';
        this.updateColorDisplay();
    }

    loadTimerModal() {
        this.updateTimerDisplay();
    }

    // ====================
    // TIMER FUNCTIONS
    // ====================

    startTimer() {
        if (this.timer.isRunning) return;

        this.timer.isRunning = true;
        this.timer.startTime = Date.now() - this.timer.elapsed;

        this.timer.interval = setInterval(() => {
            this.timer.elapsed = Date.now() - this.timer.startTime;
            this.updateTimerDisplay();
        }, 1000);

        // Update button states
        document.getElementById('timer-start').disabled = true;
        document.getElementById('timer-pause').disabled = false;
    }

    pauseTimer() {
        if (!this.timer.isRunning) return;

        this.timer.isRunning = false;
        clearInterval(this.timer.interval);

        // Update button states
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-pause').disabled = true;
    }

    resetTimer() {
        this.timer.isRunning = false;
        this.timer.elapsed = 0;
        clearInterval(this.timer.interval);

        this.updateTimerDisplay();

        // Update button states
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-pause').disabled = true;
    }

    setTimerMode(mode) {
        this.timer.mode = mode;

        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        this.updateTimerDisplay();
    }

    setCountdown(seconds) {
        if (this.timer.mode === 'countdown') {
            this.timer.elapsed = seconds * 1000;
            this.updateTimerDisplay();
        }
    }

    updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        const elapsed = this.timer.elapsed;

        if (this.timer.mode === 'stopwatch') {
            const totalSeconds = Math.floor(elapsed / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            // Countdown mode
            const remaining = Math.max(0, 3600000 - elapsed); // 1 hour max
            const totalSeconds = Math.floor(remaining / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // ====================
    // UTILITY FUNCTIONS
    // ====================

    trackToolUsage(toolId, source = 'popup') {
        chrome.runtime.sendMessage({
            action: 'track-usage',
            toolId: toolId,
            source: source
        });
    }

    getToolUsage(toolId) {
        const today = new Date().toDateString();
        const usage = this.analytics.dailyUsage?.[today]?.[toolId] || 0;
        return usage > 0 ? usage : 'Nuevo';
    }

    getToolName(toolId) {
        const toolNames = {
            'json-formatter': 'JSON',
            'base64-encoder': 'Base64',
            'url-encoder': 'URL',
            'hash-calculator': 'Hash',
            'capture-screen': 'Captura',
            'notes': 'Notas'
        };
        return toolNames[toolId] || toolId;
    }

    getTierIcon(tier) {
        const icons = {
            'free': '🆓',
            'premium': '💎',
            'business': '💼'
        };
        return icons[tier] || '🆓';
    }

    getTierName(tier) {
        const names = {
            'free': 'Free',
            'premium': 'Premium',
            'business': 'Business'
        };
        return names[tier] || 'Free';
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    }

    updateColorDisplay() {
        const sample = document.getElementById('color-sample');
        const hex = document.getElementById('color-hex');
        const rgb = document.getElementById('color-rgb');
        const hsl = document.getElementById('color-hsl');

        if (sample && this.currentColor) {
            sample.style.backgroundColor = this.currentColor;
            hex.textContent = this.currentColor;

            // Convert to RGB and HSL
            const rgbMatch = this.currentColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1], 16);
                const g = parseInt(rgbMatch[2], 16);
                const b = parseInt(rgbMatch[3], 16);
                rgb.textContent = `rgb(${r}, ${g}, ${b})`;
                hsl.textContent = this.rgbToHsl(r, g, b);
            }
        }
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }

    // ====================
    // PUBLIC API
    // ====================

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// ====================
// GLOBAL FUNCTIONS
// ====================

function closeModal(modalId) {
    if (window.quickToolsPopup) {
        window.quickToolsPopup.closeModal(modalId);
    }
}

function saveSettings() {
    if (window.quickToolsPopup) {
        const settings = {
            theme: document.getElementById('theme-select').value,
            autoCapture: document.getElementById('auto-capture').checked,
            saveToClipboard: document.getElementById('save-to-clipboard').checked,
            showTooltips: document.getElementById('show-tooltips').checked,
            enableAnalytics: document.getElementById('enable-analytics').checked
        };

        chrome.runtime.sendMessage({
            action: 'update-settings',
            settings: settings
        });

        window.quickToolsPopup.showToast('Configuración guardada', 'success');
        closeModal('settings-modal');
    }
}

function createNewNote() {
    // Create new note modal or inline editor
    const content = prompt('Nueva nota:');
    if (content && window.quickToolsPopup) {
        // Save note logic would go here
        window.quickToolsPopup.showToast('Nota creada', 'success');
        window.quickToolsPopup.loadNotesModal();
    }
}

function copyCurrentColor() {
    if (window.quickToolsPopup && window.quickToolsPopup.currentColor) {
        navigator.clipboard.writeText(window.quickToolsPopup.currentColor);
        window.quickToolsPopup.showToast('Color copiado', 'success');
    }
}

function activateGlobalPicker() {
    // This would activate a global color picker
    window.quickToolsPopup.showToast('Picker global activado', 'info');
}

function captureScreen() {
    // Screen capture logic
    if (window.quickToolsPopup) {
        window.quickToolsPopup.showToast('Captura iniciada...', 'info');
    }
}

function captureWindow() {
    // Window capture logic
    if (window.quickToolsPopup) {
        window.quickToolsPopup.showToast('Captura de ventana iniciada...', 'info');
    }
}

function startRegionCapture() {
    // Region capture logic
    if (window.quickToolsPopup) {
        window.quickToolsPopup.showToast('Selecciona una región...', 'info');
    }
}

function startTimer() {
    if (window.quickToolsPopup) {
        window.quickToolsPopup.startTimer();
    }
}

function pauseTimer() {
    if (window.quickToolsPopup) {
        window.quickToolsPopup.pauseTimer();
    }
}

function resetTimer() {
    if (window.quickToolsPopup) {
        window.quickToolsPopup.resetTimer();
    }
}

function setTimerMode(mode) {
    if (window.quickToolsPopup) {
        window.quickToolsPopup.setTimerMode(mode);
    }
}

function setCountdown(seconds) {
    if (window.quickToolsPopup) {
        window.quickToolsPopup.setCountdown(seconds);
    }
}

// ====================
// INITIALIZATION
// ====================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('🚀 Inicializando QuickTools Popup...');
    window.quickToolsPopup = new QuickToolsPopup();
}
