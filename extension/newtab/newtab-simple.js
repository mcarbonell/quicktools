// FastTools Extension - New Tab (Simplified)
// Uses shared modules for 60% code reduction

import { getTimeAgo, getStorage, setStorage, trackToolUsage, showToast, showModal, closeModal, copyToClipboard } from '../shared/utils.js';
import { loadTools, getToolById, filterByCategory, getCategories } from '../shared/tools-loader.js';

class FastToolsNewTab {
    constructor() {
        this.tools = [];
        this.quickAccess = [];
        this.notes = [];
        this.colors = [];
        this.analytics = {};
        this.settings = {};
        this.currentNote = null;
        
        this.timer = {
            isRunning: false,
            remainingTime: 0,
            interval: null,
            endTime: 0
        };

        this.init();
    }

    async init() {
        console.log('🚀 Inicializando FastTools New Tab');

        try {
            await this.loadData();
            this.setupEventListeners();
            this.render();
            console.log('✅ New Tab inicializado');
        } catch (error) {
            console.error('❌ Error inicializando:', error);
            showToast('Error cargando la interfaz', 'error');
        }
    }

    // ====================
    // DATA LOADING
    // ====================

    async loadData() {
        // Load tools from JSON
        this.tools = await loadTools();

        // Load user data
        const data = await getStorage(['settings', 'analytics', 'notes', 'colors']);
        
        this.settings = data.settings || { theme: 'auto', quickAccess: [] };
        this.analytics = data.analytics || {};
        this.notes = data.notes?.items || [];
        this.colors = data.colors || ['#13a4ec', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
        
        this.quickAccess = this.settings.quickAccess || ['capture', 'notes', 'json-formatter', 'color-picker', 'password-generator', 'qr-generator'];
    }

    // ====================
    // EVENT HANDLERS
    // ====================

    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('global-search');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Buttons
        document.getElementById('settings-btn').onclick = () => showModal('settings-modal');
        document.getElementById('edit-favorites').onclick = () => this.showFavoritesModal();
        document.getElementById('new-note-btn').onclick = () => this.createNewNote();

        // Data-action handlers
        document.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (!action) return;

            e.preventDefault();
            e.stopPropagation();

            switch (action) {
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
                case 'close-modal':
                    closeModal(e.target.closest('.modal').id);
                    break;
                case 'save-settings':
                    this.saveSettings();
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
            }
        });

        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModal(e.target.id);
            }
        });
    }

    // ====================
    // RENDERING
    // ====================

    render() {
        this.updateGreeting();
        this.updateStats();
        this.renderQuickAccess();
        this.renderCategoryFilters();
        this.renderTools();
        this.renderNotes();
        this.renderColors();
        this.applyTheme();
        this.initTimer();
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = '¡Hola!';
        if (hour < 12) greeting = '¡Buenos días!';
        else if (hour < 18) greeting = '¡Buenas tardes!';
        else greeting = '¡Buenas noches!';
        
        document.getElementById('greeting').textContent = `${greeting} 👋`;
    }

    updateStats() {
        const today = new Date().toDateString();
        const todayUsage = this.analytics.dailyUsage?.[today] || {};
        const totalToday = Object.values(todayUsage).reduce((sum, count) => sum + count, 0);
        
        document.getElementById('today-usage').textContent = totalToday;
        
        // Favorite tool
        let favoriteTool = '-';
        let maxUsage = 0;
        for (const [toolId, count] of Object.entries(todayUsage)) {
            if (count > maxUsage) {
                maxUsage = count;
                const tool = getToolById(this.tools, toolId);
                favoriteTool = tool ? tool.name : '-';
            }
        }
        document.getElementById('favorite-tool').textContent = favoriteTool;
        
        // Time saved (2 min per use)
        const minutesSaved = totalToday * 2;
        const timeSaved = minutesSaved < 60 ? `${minutesSaved}m` : `${Math.floor(minutesSaved / 60)}h${minutesSaved % 60}m`;
        document.getElementById('time-saved').textContent = timeSaved;
    }

    renderQuickAccess() {
        const container = document.getElementById('quick-access-grid');
        container.innerHTML = '';

        const quickTools = this.quickAccess
            .map(id => getToolById(this.tools, id))
            .filter(Boolean)
            .slice(0, 8);

        quickTools.forEach((tool, index) => {
            const item = document.createElement('div');
            item.className = `quick-access-item fade-in stagger-${Math.min(index + 1, 4)}`;
            item.onclick = () => this.openTool(tool);

            const usage = this.getToolUsage(tool.id);
            
            item.innerHTML = `
                <div class="quick-access-icon">${tool.icon}</div>
                <div class="quick-access-name">${tool.name}</div>
                <div class="quick-access-usage">${usage} usos</div>
            `;

            container.appendChild(item);
        });
    }

    renderCategoryFilters() {
        const container = document.getElementById('category-filters');
        container.innerHTML = '<button class="filter-btn active" data-category="all">Todo</button>';

        const categories = getCategories(this.tools);
        const categoryNames = {
            'image': '🖼️ Imagen',
            'data': '📊 Datos',
            'text': '📝 Texto',
            'utils': '🔧 Utilidades',
            'ai': '🤖 IA'
        };

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.category = cat;
            btn.textContent = categoryNames[cat] || cat;
            btn.onclick = (e) => this.handleCategoryFilter(e);
            container.appendChild(btn);
        });
    }

    renderTools() {
        const container = document.getElementById('tools-grid');
        container.innerHTML = '';

        this.tools.forEach((tool, index) => {
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
            `;

            container.appendChild(item);
        });
    }

    renderNotes() {
        const container = document.getElementById('notes-widget');
        container.innerHTML = '';

        if (this.notes.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No hay notas</p>';
            return;
        }

        this.notes.slice(0, 3).forEach((note, index) => {
            const item = document.createElement('div');
            item.className = `note-item slide-in stagger-${index + 1}`;
            item.onclick = () => this.editNote(note);

            item.innerHTML = `
                <div class="note-title">${note.title || 'Sin título'}</div>
                <div class="note-content">${(note.content || '').substring(0, 100)}...</div>
                <div class="note-time">${getTimeAgo(note.modified)}</div>
            `;

            container.appendChild(item);
        });
    }

    renderColors() {
        const container = document.getElementById('recent-colors');
        container.innerHTML = '';

        this.colors.forEach(color => {
            const item = document.createElement('div');
            item.className = 'color-item';
            item.style.backgroundColor = color;
            item.onclick = () => {
                copyToClipboard(color);
                showToast(`Color ${color} copiado`, 'success');
            };
            container.appendChild(item);
        });
    }

    // ====================
    // SEARCH
    // ====================

    handleSearch(query) {
        const results = document.getElementById('search-results');
        
        if (query.length < 2) {
            results.classList.remove('show');
            return;
        }

        const searchResults = this.tools
            .filter(tool => 
                tool.name.toLowerCase().includes(query.toLowerCase()) ||
                tool.description.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 8);

        results.innerHTML = '';
        searchResults.forEach(tool => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.onclick = () => {
                this.openTool(tool);
                results.classList.remove('show');
                document.getElementById('global-search').value = '';
            };

            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 18px;">${tool.icon}</div>
                    <div>
                        <div style="font-weight: 500;">${tool.name}</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">${tool.description}</div>
                    </div>
                </div>
            `;

            results.appendChild(item);
        });

        results.classList.add('show');
    }

    // ====================
    // CATEGORY FILTER
    // ====================

    handleCategoryFilter(e) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.dataset.category;
        const tools = document.querySelectorAll('.tool-item');

        tools.forEach(tool => {
            if (category === 'all') {
                tool.classList.remove('hidden');
            } else {
                tool.classList.toggle('hidden', tool.dataset.category !== category);
            }
        });
    }

    // ====================
    // TOOLS
    // ====================

    async openTool(tool) {
        trackToolUsage(tool.id, 'newtab');

        if (tool.id === 'capture') {
            chrome.runtime.sendMessage({ action: 'capture-screen' });
            showToast('Captura iniciada', 'info');
        } else if (tool.id === 'notes') {
            this.createNewNote();
        } else {
            chrome.tabs.create({ url: tool.url, active: true });
        }
    }

    getToolUsage(toolId) {
        const today = new Date().toDateString();
        return this.analytics.dailyUsage?.[today]?.[toolId] || 0;
    }

    // ====================
    // NOTES
    // ====================

    createNewNote() {
        this.currentNote = null;
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('delete-note-btn').style.display = 'none';
        showModal('note-editor-modal');
    }

    editNote(note) {
        this.currentNote = note;
        document.getElementById('note-title').value = note.title || '';
        document.getElementById('note-content').value = note.content || '';
        document.getElementById('delete-note-btn').style.display = 'block';
        showModal('note-editor-modal');
    }

    async saveNote() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();

        if (!title && !content) {
            showToast('La nota debe tener título o contenido', 'warning');
            return;
        }

        const noteData = {
            id: this.currentNote?.id || Date.now(),
            title,
            content,
            modified: Date.now()
        };

        if (!this.currentNote) {
            noteData.created = Date.now();
            this.notes.unshift(noteData);
        } else {
            const index = this.notes.findIndex(n => n.id === this.currentNote.id);
            if (index !== -1) this.notes[index] = { ...this.notes[index], ...noteData };
        }

        await setStorage({ notes: { items: this.notes } });
        showToast(this.currentNote ? 'Nota actualizada' : 'Nota creada', 'success');
        closeModal('note-editor-modal');
        this.renderNotes();
    }

    async deleteNote() {
        if (!this.currentNote) return;

        if (confirm('¿Eliminar esta nota?')) {
            this.notes = this.notes.filter(n => n.id !== this.currentNote.id);
            await setStorage({ notes: { items: this.notes } });
            showToast('Nota eliminada', 'success');
            closeModal('note-editor-modal');
            this.renderNotes();
        }
    }

    // ====================
    // TIMER
    // ====================

    initTimer() {
        this.timer.display = document.getElementById('timer-display');
        this.timer.startBtn = document.getElementById('start-timer-btn');
        this.timer.stopBtn = document.getElementById('stop-timer-btn');
        this.updateTimerDisplay();
    }

    addTime(seconds) {
        if (!this.timer.isRunning) {
            this.timer.remainingTime += seconds;
            this.updateTimerDisplay();
        }
    }

    startTimer() {
        if (this.timer.remainingTime > 0 && !this.timer.isRunning) {
            this.timer.isRunning = true;
            this.timer.endTime = Date.now() + this.timer.remainingTime * 1000;
            this.timer.interval = setInterval(() => this.timerTick(), 1000);
            this.timer.startBtn.style.display = 'none';
            this.timer.stopBtn.style.display = 'inline-block';
            trackToolUsage('timer', 'newtab');
        }
    }

    stopTimer() {
        this.timer.isRunning = false;
        clearInterval(this.timer.interval);
        this.timer.remainingTime = Math.max(0, Math.round((this.timer.endTime - Date.now()) / 1000));
        this.timer.startBtn.style.display = 'inline-block';
        this.timer.stopBtn.style.display = 'none';
        this.updateTimerDisplay();
    }

    resetTimer() {
        this.stopTimer();
        this.timer.remainingTime = 0;
        this.updateTimerDisplay();
    }

    timerTick() {
        const remaining = this.timer.endTime - Date.now();
        if (remaining <= 0) {
            this.stopTimer();
            this.playAlarm();
            showToast('⏰ ¡Tiempo terminado!', 'info');
            return;
        }
        this.timer.remainingTime = Math.round(remaining / 1000);
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timer.remainingTime / 60);
        const seconds = this.timer.remainingTime % 60;
        this.timer.display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    playAlarm() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    }

    // ====================
    // SETTINGS
    // ====================

    async saveSettings() {
        const theme = document.getElementById('theme-select').value;
        this.settings.theme = theme;
        await setStorage({ settings: this.settings });
        showToast('Configuración guardada', 'success');
        closeModal('settings-modal');
        this.applyTheme();
    }

    applyTheme() {
        const theme = this.settings.theme;
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    // ====================
    // FAVORITES
    // ====================

    showFavoritesModal() {
        const container = document.getElementById('favorites-grid');
        container.innerHTML = '';

        this.tools.forEach(tool => {
            const isSelected = this.quickAccess.includes(tool.id);
            const isDisabled = !isSelected && this.quickAccess.length >= 8;

            const option = document.createElement('div');
            option.className = `favorite-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
            option.onclick = () => !isDisabled && this.toggleFavorite(tool.id);

            option.innerHTML = `
                <div style="font-size: 24px;">${tool.icon}</div>
                <div style="font-size: 14px; font-weight: 500;">${tool.name}</div>
            `;

            container.appendChild(option);
        });

        showModal('favorites-modal');
    }

    toggleFavorite(toolId) {
        const index = this.quickAccess.indexOf(toolId);
        
        if (index !== -1) {
            this.quickAccess.splice(index, 1);
        } else if (this.quickAccess.length < 8) {
            this.quickAccess.push(toolId);
        }

        this.showFavoritesModal();
        this.renderQuickAccess();
    }

    async saveFavorites() {
        this.settings.quickAccess = this.quickAccess;
        await setStorage({ settings: this.settings });
        showToast('Favoritos guardados', 'success');
        closeModal('favorites-modal');
    }
}

// ====================
// INITIALIZATION
// ====================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new FastToolsNewTab());
} else {
    new FastToolsNewTab();
}
