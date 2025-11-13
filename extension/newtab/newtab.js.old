// QuickTools Extension - New Tab JavaScript
// Dashboard completo de productividad con widgets y analytics

class QuickToolsNewTab {
    constructor() {
        this.userData = null;
        this.settings = null;
        this.analytics = null;
        this.tools = [];
        this.quickAccess = [];
        this.notes = [];
        this.recentItems = [];
        this.colors = [];

        this.quickTimer = {
            isRunning: false,
            remainingTime: 0, // in seconds
            interval: null,
            endTime: 0
        };

        this.init();
    }

    async init() {
        console.log('🚀 Inicializando QuickTools New Tab');

        try {
            // Load all data
            await this.loadUserData();
            await this.loadTools();
            await this.loadNotes();
            await this.loadRecentItems();
            await this.loadColors();

            // Setup event listeners
            this.setupEventListeners();

            // Render interface
            this.updateGreeting();
            this.updateStats();
            this.renderQuickAccess();
            this.renderTools();
            this.renderRecentItems();
            this.renderNotes();
            this.renderWidgets();
            this.updateTier();
            this.applyTheme();
            this.initTimer();

            console.log('✅ QuickTools New Tab inicializado');

        } catch (error) {
            console.error('❌ Error inicializando new tab:', error);
            this.showToast('Error cargando la interfaz', 'error');
        }
    }

    // ====================
    // DATA LOADING
    // ====================

    async loadUserData() {
        const data = await chrome.storage.local.get([
            'user', 'settings', 'analytics'
        ]);

        this.userData = data.user;
        this.settings = data.settings || this.getDefaultSettings();
        this.analytics = data.analytics || {};
    }

    getDefaultSettings() {
        return {
            theme: 'auto',
            accentColor: '#6366f1',
            autoCapture: false,
            saveToClipboard: true,
            enableAnalytics: true,
            showWeather: true,
            showShortcuts: true,
            showProductivity: true
        };
    }

    async loadTools() {
        this.tools = [
            {
                id: 'screen-capture',
                name: 'Captura de Pantalla',
                description: 'Captura y anota pantallas',
                icon: '📸',
                category: 'productivity',
                url: null,
                local: true
            },
            {
                id: 'json-formatter',
                name: 'JSON Formatter',
                description: 'Formatear y validar JSON',
                icon: '📋',
                category: 'developer',
                url: 'https://fasttools-nine.vercel.app/tools/data/json-formatter.html'
            },
            {
                id: 'base64-encoder',
                name: 'Base64 Encoder',
                description: 'Codificar/Decodificar Base64',
                icon: '🔐',
                category: 'text',
                url: 'https://fasttools-nine.vercel.app/tools/text/base64.html'
            },
            {
                id: 'url-encoder',
                name: 'URL Encoder',
                description: 'Codificar URLs',
                icon: '🔗',
                category: 'text',
                url: 'https://fasttools-nine.vercel.app/tools/text/url-encoder.html'
            },
            {
                id: 'html-encoder',
                name: 'HTML Encoder',
                description: 'Escapar caracteres HTML',
                icon: '🌐',
                category: 'text',
                url: 'https://fasttools-nine.vercel.app/tools/text/html-encoder.html'
            },
            {
                id: 'hash-calculator',
                name: 'Hash Calculator',
                description: 'MD5, SHA1, SHA256, SHA512',
                icon: '🔢',
                category: 'text',
                url: 'https://fasttools-nine.vercel.app/tools/utils/hash-calculator.html'
            },
            {
                id: 'csv-json',
                name: 'CSV ↔ JSON',
                description: 'Convertir CSV a JSON',
                icon: '📊',
                category: 'data',
                url: 'https://fasttools-nine.vercel.app/tools/data/csv-json.html'
            },
            {
                id: 'yaml-json',
                name: 'YAML ↔ JSON',
                description: 'Convertir YAML a JSON',
                icon: '📄',
                category: 'data',
                url: 'https://fasttools-nine.vercel.app/tools/data/yaml-json.html'
            },
            {
                id: 'xml-json',
                name: 'XML ↔ JSON',
                description: 'Convertir XML a JSON',
                icon: '📋',
                category: 'data',
                url: 'https://fasttools-nine.vercel.app/tools/data/xml-json.html'
            },
            {
                id: 'color-palette',
                name: 'Color Palette',
                description: 'Generar paletas de colores',
                icon: '🎨',
                category: 'image',
                url: 'https://fasttools-nine.vercel.app/tools/image/color-palette-generator.html'
            },
            {
                id: 'color-picker',
                name: 'Color Picker',
                description: 'Selector de colores global',
                icon: '🎯',
                category: 'image',
                url: 'https://fasttools-nine.vercel.app/tools/utils/color-picker-converter.html'
            },
            {
                id: 'image-resizer',
                name: 'Image Resizer',
                description: 'Redimensionar imágenes',
                icon: '🖼️',
                category: 'image',
                url: 'https://fasttools-nine.vercel.app/tools/image/image-resizer.html'
            },
            {
                id: 'image-compressor',
                name: 'Image Compressor',
                description: 'Comprimir imágenes',
                icon: '📦',
                category: 'image',
                url: 'https://fasttools-nine.vercel.app/tools/image/image-compressor.html'
            },
            {
                id: 'lorem-ipsum',
                name: 'Lorem Ipsum',
                description: 'Generador de texto placeholder',
                icon: '📝',
                category: 'text',
                url: 'https://fasttools-nine.vercel.app/tools/text/lorem-ipsum-generator.html'
            },
            {
                id: 'password-generator',
                name: 'Password Generator',
                description: 'Generar contraseñas seguras',
                icon: '🔒',
                category: 'productivity',
                url: 'https://fasttools-nine.vercel.app/tools/utils/password-generator.html'
            },
            {
                id: 'qr-generator',
                name: 'QR Generator',
                description: 'Generar códigos QR',
                icon: '🔳',
                category: 'productivity',
                url: 'https://fasttools-nine.vercel.app/tools/utils/qr-generator.html'
            },
            {
                id: 'stopwatch-timer',
                name: 'Stopwatch & Timer',
                description: 'Cronómetro y temporizador',
                icon: '⏰',
                category: 'productivity',
                url: 'https://fasttools-nine.vercel.app/tools/utils/stopwatch-timer.html'
            },
            {
                id: 'text-cleaner',
                name: 'Text Cleaner',
                description: 'Limpiar y formatear texto',
                icon: '🧹',
                category: 'text',
                url: 'https://fasttools-nine.vercel.app/tools/text/text-cleaner.html'
            },
            {
                id: 'diff',
                name: 'Text Diff',
                description: 'Comparar textos',
                icon: '⚡',
                category: 'developer',
                url: 'https://fasttools-nine.vercel.app/tools/text/diff.html'
            }
        ];

        // Load quick access settings
        this.quickAccess = this.settings.quickAccess || [
            'screen-capture', 'notes', 'json-formatter', 'color-picker',
            'password-generator', 'qr-generator', 'stopwatch-timer'
        ];
    }

    async loadNotes() {
        const data = await chrome.storage.local.get('notes');
        this.notes = data.notes?.items || [];
    }

    async loadRecentItems() {
        // Load recent captures, tool usage, etc.
        this.recentItems = [];

        // Add recent captures
        const data = await chrome.storage.local.get('captures');
        if (data.captures) {
            data.captures.slice(0, 3).forEach(capture => {
                this.recentItems.push({
                    type: 'capture',
                    title: 'Captura de pantalla',
                    description: `${this.getTimeAgo(capture.timestamp)}`,
                    icon: '📸',
                    timestamp: capture.timestamp,
                    url: capture.url
                });
            });
        }

        // Add recent tool usage
        const today = new Date().toDateString();
        const todayUsage = this.analytics.dailyUsage?.[today] || {};
        Object.entries(todayUsage).slice(0, 2).forEach(([toolId, count]) => {
            const tool = this.tools.find(t => t.id === toolId);
            if (tool) {
                this.recentItems.push({
                    type: 'tool',
                    title: tool.name,
                    description: `${count} usos hoy`,
                    icon: tool.icon,
                    timestamp: Date.now() - (count * 60000), // Mock timestamp
                    toolId: tool.id
                });
            }
        });
    }

    async loadColors() {
        const data = await chrome.storage.local.get('colors');
        this.colors = data.colors || [
            '#6366f1', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ];
    }

    // ====================
    // EVENT HANDLERS
    // ====================

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('global-search');
        searchInput.addEventListener('input', this.handleSearch.bind(this));
        searchInput.addEventListener('focus', this.showSearchResults.bind(this));

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryFilter(e));
        });

        // Settings
        document.getElementById('settings-btn').onclick = () => this.showModal('settings-modal');
        document.getElementById('analytics-btn').onclick = () => this.showModal('analytics-modal');

        // Quick actions
        document.getElementById('edit-favorites').onclick = () => this.showModal('favorites-modal');
        document.getElementById('new-note-btn').onclick = () => this.createNewNote();
        document.getElementById('clear-recent-btn').onclick = () => this.clearRecentActivity();

        // Timer controls
        // this.setupQuickTimerControls();

        // Weather (mock for now)
        this.updateWeather();

        // Close modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Data-action event handlers for CSP compliance
        document.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (!action) return;

            e.preventDefault();
            e.stopPropagation();

            switch (action) {
                // Timer controls
                case 'add-time':
                    this.addTime(parseInt(e.target.dataset.time, 10));
                    break;
                case 'start-timer':
                    this.startTimer();
                    break;
                case 'stop-timer':
                    this.stopTimer();
                    break;
                case 'reset-timer':
                    this.resetTimer();
                    break;

                // Modal controls
                case 'close-modal':
                    const modalId = e.target.dataset.modal;
                    if (modalId) {
                        this.closeModal(modalId);
                    }
                    break;
                case 'save-favorites':
                    this.saveFavorites();
                    break;
                case 'save-note':
                    this.saveNote();
                    break;
                case 'delete-note':
                    this.deleteNote();
                    break;
                case 'export-analytics':
                    this.exportAnalytics();
                    break;
                case 'save-settings':
                    this.saveNewTabSettings();
                    break;
            }
        });

        // Handle timer preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seconds = parseInt(e.target.dataset.preset);
                if (seconds) {
                    this.setQuickTimer(seconds);
                }
            });
        });
    }

    initTimer() {
        this.quickTimer.display = document.getElementById('timer-display');
        this.quickTimer.startBtn = document.getElementById('start-timer-btn');
        this.quickTimer.stopBtn = document.getElementById('stop-timer-btn');
        this.updateTimerDisplay();
    }


    // ====================
    // SEARCH FUNCTIONALITY
    // ====================

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const results = document.getElementById('search-results');

        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        const searchResults = this.performSearch(query);
        this.renderSearchResults(searchResults);
        this.showSearchResults();
    }

    performSearch(query) {
        const results = [];

        // Search tools
        this.tools.forEach(tool => {
            if (tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'tool',
                    item: tool,
                    title: tool.name,
                    description: tool.description,
                    icon: tool.icon
                });
            }
        });

        // Search notes
        this.notes.forEach(note => {
            if ((note.title || '').toLowerCase().includes(query) ||
                (note.content || '').toLowerCase().includes(query)) {
                results.push({
                    type: 'note',
                    item: note,
                    title: note.title || 'Sin título',
                    description: (note.content || '').substring(0, 50) + '...',
                    icon: '📝'
                });
            }
        });

        return results.slice(0, 10); // Limit to 10 results
    }

    renderSearchResults(results) {
        const container = document.getElementById('search-results');
        container.innerHTML = '';

        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.onclick = () => this.handleSearchResult(result);

            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 18px;">${result.icon}</div>
                    <div>
                        <div style="font-weight: 500;">${result.title}</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">${result.description}</div>
                    </div>
                </div>
            `;

            container.appendChild(item);
        });
    }

    showSearchResults() {
        document.getElementById('search-results').classList.add('show');
    }

    hideSearchResults() {
        document.getElementById('search-results').classList.remove('show');
    }

    handleSearchResult(result) {
        if (result.type === 'tool') {
            this.openTool(result.item);
        } else if (result.type === 'note') {
            this.editNote(result.item);
        }

        this.hideSearchResults();
        document.getElementById('global-search').value = '';
    }

    // ====================
    // CATEGORY FILTERING
    // ====================

    handleCategoryFilter(e) {
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Filter tools
        const category = e.target.dataset.category;
        this.filterTools(category);
    }

    filterTools(category) {
        const tools = document.querySelectorAll('.tool-item');

        tools.forEach(tool => {
            if (category === 'all') {
                tool.classList.remove('hidden');
            } else {
                const toolCategory = tool.dataset.category;
                tool.classList.toggle('hidden', toolCategory !== category);
            }
        });
    }

    // ====================
    // RENDERING
    // ====================

    updateGreeting() {
        const greeting = document.getElementById('greeting');
        const hour = new Date().getHours();
        const userName = this.userData?.name || 'User';

        let timeGreeting = '¡Hola!';
        if (hour < 12) timeGreeting = '¡Buenos días!';
        else if (hour < 18) timeGreeting = '¡Buenas tardes!';
        else timeGreeting = '¡Buenas noches!';

        greeting.textContent = `${timeGreeting} 👋`;
    }

    updateStats() {
        // Today's usage
        const today = new Date().toDateString();
        const todayUsage = this.analytics.dailyUsage?.[today] || {};
        const totalToday = Object.values(todayUsage).reduce((sum, count) => sum + count, 0);
        document.getElementById('today-usage').textContent = totalToday;

        // Favorite tool
        let favoriteTool = 'Captura';
        let maxUsage = 0;

        for (const [tool, count] of Object.entries(todayUsage)) {
            if (count > maxUsage) {
                maxUsage = count;
                const toolObj = this.tools.find(t => t.id === tool);
                favoriteTool = toolObj ? toolObj.name : 'Captura';
            }
        }

        document.getElementById('favorite-tool').textContent = favoriteTool;

        // Productivity score (mock calculation)
        const productivityScore = this.calculateProductivityScore();
        document.getElementById('productivity-score').textContent = `${productivityScore}%`;

        // Time saved (mock calculation)
        const timeSaved = this.calculateTimeSaved();
        document.getElementById('time-saved').textContent = timeSaved;
    }

    calculateProductivityScore() {
        // Simple productivity calculation based on tool usage diversity
        const today = new Date().toDateString();
        const todayUsage = this.analytics.dailyUsage?.[today] || {};
        const toolCount = Object.keys(todayUsage).length;
        const totalUsage = Object.values(todayUsage).reduce((sum, count) => sum + count, 0);

        // Score based on tool diversity and total usage
        const diversityScore = Math.min(toolCount * 10, 50);
        const usageScore = Math.min(totalUsage * 2, 50);

        return Math.min(diversityScore + usageScore, 100);
    }

    calculateTimeSaved() {
        // Mock calculation: 2 minutes saved per tool usage
        const today = new Date().toDateString();
        const todayUsage = this.analytics.dailyUsage?.[today] || {};
        const totalUsage = Object.values(todayUsage).reduce((sum, count) => sum + count, 0);

        const minutesSaved = totalUsage * 2;
        if (minutesSaved < 60) {
            return `${minutesSaved}m`;
        } else {
            const hours = Math.floor(minutesSaved / 60);
            const minutes = minutesSaved % 60;
            return `${hours}h${minutes > 0 ? minutes + 'm' : ''}`;
        }
    }

    renderQuickAccess() {
        const container = document.getElementById('quick-access-grid');
        container.innerHTML = '';

        const quickAccessTools = this.quickAccess
            .map(id => this.tools.find(t => t.id === id))
            .filter(Boolean);

        quickAccessTools.forEach((tool, index) => {
            const item = this.createQuickAccessItem(tool, index);
            container.appendChild(item);
        });
    }

    createQuickAccessItem(tool, index) {
        const item = document.createElement('div');
        item.className = `quick-access-item fade-in stagger-${Math.min(index + 1, 4)}`;
        item.onclick = () => this.openTool(tool);

        if (['screen-capture', 'notes'].includes(tool.id)) {
            item.classList.add('primary');
        }

        const usage = this.getToolUsage(tool.id);

        item.innerHTML = `
            <div class="quick-access-icon">${tool.icon}</div>
            <div class="quick-access-name">${tool.name}</div>
            <div class="quick-access-usage">${usage} usos</div>
        `;

        return item;
    }

    renderTools() {
        const container = document.getElementById('tools-grid');
        container.innerHTML = '';

        this.tools.forEach((tool, index) => {
            const item = this.createToolItem(tool, index);
            container.appendChild(item);
        });
    }

    createToolItem(tool, index) {
        const item = document.createElement('div');
        item.className = `tool-item slide-in stagger-${Math.min(Math.floor(index / 5) + 1, 4)}`;
        item.dataset.category = tool.category;
        item.onclick = () => this.openTool(tool);

        item.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-info">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description}</div>
            </div>
            <div class="tool-category">${this.getCategoryName(tool.category)}</div>
        `;

        return item;
    }

    renderRecentItems() {
        const container = document.getElementById('recent-items');
        container.innerHTML = '';

        if (this.recentItems.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No hay actividad reciente</p>';
            return;
        }

        this.recentItems.forEach((item, index) => {
            const recentItem = this.createRecentItem(item, index);
            container.appendChild(recentItem);
        });
    }

    createRecentItem(item, index) {
        const div = document.createElement('div');
        div.className = `recent-item slide-in stagger-${Math.min(index + 1, 4)}`;
        div.onclick = () => this.handleRecentItemClick(item);

        div.innerHTML = `
            <div class="recent-icon">${item.icon}</div>
            <div class="recent-content">
                <div class="recent-title">${item.title}</div>
                <div class="recent-description">${item.description}</div>
                <div class="recent-time">${this.getTimeAgo(item.timestamp)}</div>
            </div>
        `;

        return div;
    }

    renderNotes() {
        const container = document.getElementById('notes-widget');
        container.innerHTML = '';

        if (this.notes.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <p>No hay notas aún</p>
                </div>
            `;
            const button = document.createElement('button');
            button.className = 'btn';
            button.textContent = '+ Crear primera nota';
            button.addEventListener('click', () => this.createNewNote());
            container.firstElementChild.appendChild(button);
            return;
        }

        // Show most recent 3 notes
        const recentNotes = this.notes.slice(0, 3);
        recentNotes.forEach((note, index) => {
            const noteItem = this.createNoteItem(note, index);
            container.appendChild(noteItem);
        });
    }

    createNoteItem(note, index) {
        const div = document.createElement('div');
        div.className = `note-item slide-in stagger-${Math.min(index + 1, 4)}`;
        div.onclick = () => this.editNote(note);

        div.innerHTML = `
            <div class="note-title">${note.title || 'Sin título'}</div>
            <div class="note-content">${(note.content || '').substring(0, 100)}...</div>
            <div class="note-time">${this.getTimeAgo(note.modified)}</div>
        `;

        return div;
    }

    renderWidgets() {
        // Update widgets based on settings
        this.updateColorPalette();

        if (this.settings.showShortcuts) {
            document.querySelector('.widget:nth-child(3)').style.display = 'block';
        } else {
            document.querySelector('.widget:nth-child(3)').style.display = 'none';
        }
    }

    updateColorPalette() {
        const container = document.getElementById('recent-colors');
        container.innerHTML = '';

        this.colors.forEach(color => {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';
            colorItem.style.backgroundColor = color;
            colorItem.onclick = () => this.copyColor(color);
            container.appendChild(colorItem);
        });
    }

    updateTier() {
        const tierBadge = document.getElementById('user-tier');
        const tier = this.userData?.tier || 'free';

        tierBadge.className = `user-tier ${tier}`;
        tierBadge.textContent = `${this.getTierIcon(tier)} ${this.getTierName(tier)}`;
    }

    // ====================
    // TOOL FUNCTIONS
    // ====================

    async openTool(tool) {
        try {
            // Track usage
            this.trackToolUsage(tool.id);

            if (tool.local) {
                // Handle local tools
                switch (tool.id) {
                    case 'screen-capture':
                        await this.openScreenCapture();
                        break;
                    case 'notes':
                        this.showModal('note-editor-modal');
                        this.setupNewNoteForm();
                        break;
                    case 'color-picker':
                        this.activateGlobalColorPicker();
                        break;
                }
            } else {
                // Open in new tab
                await chrome.tabs.create({
                    url: tool.url,
                    active: true
                });
            }

        } catch (error) {
            console.error('❌ Error abriendo herramienta:', error);
            this.showToast('Error abriendo la herramienta', 'error');
        }
    }

    async openScreenCapture() {
        try {
            // Send message to background script to capture screen
            const response = await chrome.runtime.sendMessage({
                action: 'capture-screen'
            });

            this.showToast('Captura iniciada', 'info');

        } catch (error) {
            console.error('❌ Error capturando pantalla:', error);
            this.showToast('Error capturando pantalla', 'error');
        }
    }

    activateGlobalColorPicker() {
        this.showToast('Activa el selector global de color', 'info');
        // This would activate a global color picker
    }

    handleRecentItemClick(item) {
        if (item.type === 'capture') {
            if (item.url) {
                chrome.tabs.create({ url: item.url });
            }
        } else if (item.type === 'tool') {
            const tool = this.tools.find(t => t.id === item.toolId);
            if (tool) {
                this.openTool(tool);
            }
        }
    }

    // ====================
    // NOTES MANAGEMENT
    // ====================

    createNewNote() {
        this.showModal('note-editor-modal');
        this.setupNewNoteForm();
    }

    setupNewNoteForm() {
        // Clear form
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-tags').value = '';
        document.getElementById('delete-note-btn').style.display = 'none';

        // Store current note (null for new)
        this.currentNote = null;
    }

    editNote(note) {
        this.showModal('note-editor-modal');

        // Populate form
        document.getElementById('note-title').value = note.title || '';
        document.getElementById('note-content').value = note.content || '';
        document.getElementById('note-tags').value = (note.tags || []).join(', ');
        document.getElementById('delete-note-btn').style.display = 'block';

        // Store current note
        this.currentNote = note;
    }

    async saveNote() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        const tagsInput = document.getElementById('note-tags').value.trim();
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];

        if (!title && !content) {
            this.showToast('La nota debe tener título o contenido', 'warning');
            return;
        }

        const noteData = {
            id: this.currentNote?.id || Date.now(),
            title,
            content,
            tags,
            modified: Date.now()
        };

        if (!this.currentNote) {
            noteData.created = Date.now();

            // Add to beginning of notes array
            this.notes.unshift(noteData);
        } else {
            // Update existing note
            const index = this.notes.findIndex(n => n.id === this.currentNote.id);
            if (index !== -1) {
                this.notes[index] = { ...this.notes[index], ...noteData };
            }
        }

        // Save to storage
        await chrome.storage.local.set({
            notes: {
                items: this.notes,
                tags: this.getAllTags()
            }
        });

        this.showToast(this.currentNote ? 'Nota actualizada' : 'Nota creada', 'success');
        this.closeModal('note-editor-modal');

        // Refresh notes display
        this.renderNotes();
    }

    async deleteNote() {
        if (!this.currentNote) return;

        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            this.notes = this.notes.filter(n => n.id !== this.currentNote.id);

            await chrome.storage.local.set({
                notes: {
                    items: this.notes,
                    tags: this.getAllTags()
                }
            });

            this.showToast('Nota eliminada', 'success');
            this.closeModal('note-editor-modal');
            this.renderNotes();
        }
    }

    getAllTags() {
        const allTags = new Set();
        this.notes.forEach(note => {
            (note.tags || []).forEach(tag => allTags.add(tag));
        });
        return Array.from(allTags);
    }

    // ====================
    // QUICK TIMER
    // ====================

    addTime(seconds) {
        if (!this.quickTimer.isRunning) {
            this.quickTimer.remainingTime += seconds;
            this.updateTimerDisplay();
        }
    }

    startTimer() {
        if (this.quickTimer.remainingTime > 0 && !this.quickTimer.isRunning) {
            this.quickTimer.isRunning = true;
            this.quickTimer.endTime = Date.now() + this.quickTimer.remainingTime * 1000;
            this.quickTimer.interval = setInterval(() => this.timerTick(), 1000);
            this.quickTimer.startBtn.style.display = 'none';
            this.quickTimer.stopBtn.style.display = 'inline-block';
            this.trackToolUsage('timer', 'newtab');
        }
    }

    stopTimer() {
        this.quickTimer.isRunning = false;
        clearInterval(this.quickTimer.interval);
        this.quickTimer.remainingTime = Math.round((this.quickTimer.endTime - Date.now()) / 1000);
        if (this.quickTimer.remainingTime < 0) this.quickTimer.remainingTime = 0;
        this.quickTimer.startBtn.style.display = 'inline-block';
        this.quickTimer.stopBtn.style.display = 'none';
        this.updateTimerDisplay();
    }

    resetTimer() {
        this.stopTimer();
        this.quickTimer.remainingTime = 0;
        this.updateTimerDisplay();
    }

    timerTick() {
        const remaining = this.quickTimer.endTime - Date.now();
        if (remaining <= 0) {
            this.stopTimer();
            this.quickTimer.remainingTime = 0;
            this.updateTimerDisplay();
            this.playAlarm();
            return;
        }
        this.quickTimer.remainingTime = Math.round(remaining / 1000);
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.quickTimer.remainingTime / 60);
        const seconds = this.quickTimer.remainingTime % 60;
        this.quickTimer.display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    playAlarm() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 pitch
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    }

    // ====================
    // MODALS
    // ====================

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');

        // Load specific modal content
        switch (modalId) {
            case 'settings-modal':
                this.loadSettingsModal();
                break;
            case 'favorites-modal':
                this.loadFavoritesModal();
                break;
            case 'analytics-modal':
                this.loadAnalyticsModal();
                break;
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }

    loadSettingsModal() {
        // Populate settings
        document.getElementById('theme-select').value = this.settings.theme;
        document.getElementById('accent-color').value = this.settings.accentColor;
        document.getElementById('auto-capture').checked = this.settings.autoCapture;
        document.getElementById('save-to-clipboard').checked = this.settings.saveToClipboard;
        document.getElementById('enable-analytics').checked = this.settings.enableAnalytics;
        document.getElementById('show-weather').checked = this.settings.showWeather;
        document.getElementById('show-shortcuts').checked = this.settings.showShortcuts;
        document.getElementById('show-productivity').checked = this.settings.showProductivity;
    }

    loadFavoritesModal() {
        const container = document.getElementById('favorites-grid');
        container.innerHTML = '';

        this.tools.forEach(tool => {
            const option = document.createElement('div');
            const isSelected = this.quickAccess.includes(tool.id);
            const isDisabled = !isSelected && this.quickAccess.length >= 8;

            option.className = `favorite-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
            option.onclick = () => this.toggleFavorite(tool.id);

            option.innerHTML = `
                <div style="font-size: 24px;">${tool.icon}</div>
                <div style="font-size: 14px; font-weight: 500;">${tool.name}</div>
            `;

            container.appendChild(option);
        });
    }

    toggleFavorite(toolId) {
        const index = this.quickAccess.indexOf(toolId);

        if (index !== -1) {
            // Remove from favorites
            this.quickAccess.splice(index, 1);
        } else if (this.quickAccess.length < 8) {
            // Add to favorites
            this.quickAccess.push(toolId);
        }

        // Update UI
        this.loadFavoritesModal();
        this.renderQuickAccess();
    }

    async saveFavorites() {
        this.settings.quickAccess = this.quickAccess;
        await chrome.storage.local.set({ settings: this.settings });
        this.showToast('Favoritos guardados', 'success');
        this.closeModal('favorites-modal');
    }

    async saveNewTabSettings() {
        const newSettings = {
            theme: document.getElementById('theme-select').value,
            accentColor: document.getElementById('accent-color').value,
            autoCapture: document.getElementById('auto-capture').checked,
            saveToClipboard: document.getElementById('save-to-clipboard').checked,
            enableAnalytics: document.getElementById('enable-analytics').checked,
            showWeather: document.getElementById('show-weather').checked,
            showShortcuts: document.getElementById('show-shortcuts').checked,
            showProductivity: document.getElementById('show-productivity').checked,
        };

        this.settings = { ...this.settings, ...newSettings };

        await chrome.storage.local.set({ settings: this.settings });

        this.showToast('Configuración guardada', 'success');
        this.closeModal('settings-modal');
        
        this.applyTheme();
        this.renderWidgets();
    }

    applyTheme() {
        const theme = this.settings.theme;
        if (theme === 'auto') {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        document.documentElement.style.setProperty('--primary-color', this.settings.accentColor);
    }

    loadAnalyticsModal() {
        const container = document.getElementById('analytics-content');

        // Calculate analytics
        const totalUsage = this.analytics.totalSessions || 0;
        const totalTools = Object.keys(this.analytics.dailyUsage || {}).length;
        const averageUsage = totalUsage > 0 ? Math.round(totalUsage / totalTools) : 0;

        container.innerHTML = `
            <div class="analytics-stats">
                <div class="analytics-card">
                    <div style="font-size: 32px; margin-bottom: 8px;">📈</div>
                    <div style="font-size: 24px; font-weight: 700;">${totalUsage}</div>
                    <div>Usos Totales</div>
                </div>
                <div class="analytics-card">
                    <div style="font-size: 32px; margin-bottom: 8px;">🔧</div>
                    <div style="font-size: 24px; font-weight: 700;">${totalTools}</div>
                    <div>Herramientas Usadas</div>
                </div>
                <div class="analytics-card">
                    <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
                    <div style="font-size: 24px; font-weight: 700;">${averageUsage}</div>
                    <div>Uso Promedio</div>
                </div>
                <div class="analytics-card">
                    <div style="font-size: 32px; margin-bottom: 8px;">⭐</div>
                    <div style="font-size: 24px; font-weight: 700;">${this.quickAccess.length}</div>
                    <div>Favoritos</div>
                </div>
            </div>
        `;
    }

    // ====================
    // WEATHER (MOCK)
    // ====================

    async updateWeather() {
        // Mock weather data - in real implementation, this would call a weather API
        const weatherData = {
            temp: Math.floor(Math.random() * 15) + 15, // 15-30°C
            city: 'Madrid',
            icon: '☀️'
        };

        document.getElementById('weather-temp').textContent = `${weatherData.temp}°C`;
        document.getElementById('weather-city').textContent = weatherData.city;
        // Weather icon is already in HTML
    }

    // ====================
    // UTILITY FUNCTIONS
    // ====================

    trackToolUsage(toolId, source = 'newtab') {
        chrome.runtime.sendMessage({
            action: 'track-usage',
            toolId: toolId,
            source: source
        });
    }

    getToolUsage(toolId) {
        const today = new Date().toDateString();
        const usage = this.analytics.dailyUsage?.[today]?.[toolId] || 0;
        return usage;
    }

    getCategoryName(category) {
        const names = {
            'text': 'Texto',
            'image': 'Imagen',
            'data': 'Datos',
            'developer': 'Desarrollo',
            'productivity': 'Productividad'
        };
        return names[category] || category;
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

    copyColor(color) {
        navigator.clipboard.writeText(color);
        this.showToast(`Color ${color} copiado`, 'success');
    }

    async clearRecentActivity() {
        if (confirm('¿Estás seguro de que quieres borrar la actividad reciente? Esto eliminará el historial de capturas y el uso de herramientas de hoy.')) {
            try {
                // Clear captures from storage
                await chrome.storage.local.set({ captures: [] });

                // Clear today's tool usage from analytics
                const today = new Date().toDateString();
                if (this.analytics.dailyUsage && this.analytics.dailyUsage[today]) {
                    this.analytics.dailyUsage[today] = {};
                    await chrome.storage.local.set({ analytics: this.analytics });
                }

                // Reload and re-render the recent items list
                await this.loadRecentItems();
                this.renderRecentItems();

                this.showToast('Actividad reciente borrada', 'success');
            } catch (error) {
                console.error('Error borrando la actividad reciente:', error);
                this.showToast('No se pudo borrar la actividad', 'error');
            }
        }
    }

    exportAnalytics() {
        const data = {
            totalSessions: this.analytics.totalSessions || 0,
            dailyUsage: this.analytics.dailyUsage || {},
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `quicktools-analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
        this.showToast('Analíticas exportadas', 'success');
    }

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
// INITIALIZATION
// ====================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    new QuickToolsNewTab();
}
