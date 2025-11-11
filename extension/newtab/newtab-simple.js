// FastTools Extension - New Tab (Simplified)
// Uses shared modules for 60% code reduction

import { getTimeAgo, getStorage, setStorage, trackToolUsage, showToast, showModal, closeModal, copyToClipboard } from '../shared/utils.js';
import { loadTools, getToolById, filterByCategory, getCategories } from '../shared/tools-loader.js';
import { t, getCategoryName, initI18n, setLanguage } from '../shared/i18n.js';

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
            this.lang = await initI18n();
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
        document.getElementById('settings-btn').onclick = () => {
            this.loadSettingsModal();
            showModal('settings-modal');
        };
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
        this.translateUI();
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

    translateUI() {
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const translation = t(key, {}, this.lang);
            
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        });
        
        // Translate search placeholder
        const searchInput = document.getElementById('global-search');
        if (searchInput) searchInput.placeholder = t('search_placeholder', {}, this.lang);
        
        // Translate note inputs
        const noteTitle = document.getElementById('note-title');
        const noteContent = document.getElementById('note-content');
        if (noteTitle) noteTitle.placeholder = t('note_title_placeholder', {}, this.lang);
        if (noteContent) noteContent.placeholder = t('note_content_placeholder', {}, this.lang);
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greetingKey = 'greeting_default';
        if (hour < 12) greetingKey = 'greeting_morning';
        else if (hour < 18) greetingKey = 'greeting_afternoon';
        else greetingKey = 'greeting_evening';
        
        document.getElementById('greeting').textContent = `${t(greetingKey, {}, this.lang)} 👋`;
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
                favoriteTool = tool ? tool.title : '-';
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

            const toolId = tool.slug.replace(/^local:\/\//, '').replace(/^tools\//, '').replace(/\.html$/, '').replace(/\//g, '-');
            const usage = this.getToolUsage(toolId);
            
            item.innerHTML = `
                <div class="quick-access-icon">${tool.icon}</div>
                <div class="quick-access-name">${tool.title}</div>
                <div class="quick-access-usage">${t('usage_count', { count: usage }, this.lang)}</div>
            `;

            container.appendChild(item);
        });
    }

    renderCategoryFilters() {
        const container = document.getElementById('category-filters');
        container.innerHTML = '';

        // Add 'All' button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.dataset.category = 'all';
        allBtn.textContent = t('category_all', {}, this.lang);
        allBtn.onclick = (e) => this.handleCategoryFilter(e);
        container.appendChild(allBtn);

        // Get unique categories from tools
        const categories = [...new Set(this.tools.map(t => t.category).filter(Boolean))];

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.category = cat;
            btn.textContent = getCategoryName(cat, this.lang);
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
                    <div class="tool-name">${tool.title}</div>
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
            container.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">${t('note_no_notes', {}, this.lang)}</p>`;
            return;
        }

        this.notes.slice(0, 3).forEach((note, index) => {
            const item = document.createElement('div');
            item.className = `note-item slide-in stagger-${index + 1}`;
            item.onclick = () => this.editNote(note);

            item.innerHTML = `
                <div class="note-title">${note.title || t('note_untitled', {}, this.lang)}</div>
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
        const toolId = tool.slug.replace(/^local:\/\//, '').replace(/^tools\//, '').replace(/\.html$/, '').replace(/\//g, '-');
        trackToolUsage(toolId, 'newtab');

        if (tool.local) {
            if (tool.slug === 'local://capture') {
                chrome.runtime.sendMessage({ action: 'capture-screen' });
                showToast(t('msg_capture_started', {}, this.lang), 'info');
            } else if (tool.slug === 'local://notes') {
                this.createNewNote();
            }
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
            showToast(t('msg_note_empty', {}, this.lang), 'warning');
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
        showToast(t('msg_note_saved', {}, this.lang), 'success');
        closeModal('note-editor-modal');
        this.renderNotes();
    }

    async deleteNote() {
        if (!this.currentNote) return;

        if (confirm(t('msg_note_deleted', {}, this.lang) + '?')) {
            this.notes = this.notes.filter(n => n.id !== this.currentNote.id);
            await setStorage({ notes: { items: this.notes } });
            showToast(t('msg_note_deleted', {}, this.lang), 'success');
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
            showToast(t('msg_timer_finished', {}, this.lang), 'info');
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

    loadSettingsModal() {
        const themeSelect = document.getElementById('theme-select');
        const langSelect = document.getElementById('language-select');
        
        if (themeSelect) themeSelect.value = this.settings.theme || 'auto';
        if (langSelect) langSelect.value = this.settings.language || this.lang;
    }

    async saveSettings() {
        const theme = document.getElementById('theme-select').value;
        const language = document.getElementById('language-select')?.value || this.lang;
        
        const languageChanged = language !== this.lang;
        
        this.settings.theme = theme;
        this.settings.language = language;
        this.lang = language;
        
        await setStorage({ settings: this.settings });
        await setLanguage(language);
        
        showToast(t('msg_settings_saved', {}, this.lang), 'success');
        closeModal('settings-modal');
        
        this.applyTheme();
        
        if (languageChanged) {
            this.render();
        }
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
        showToast(t('msg_favorites_saved', {}, this.lang), 'success');
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
