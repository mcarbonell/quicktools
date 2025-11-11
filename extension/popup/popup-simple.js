// FastTools Extension - Simplified Popup

import { loadTools } from '../shared/tools-loader.js';
import { getStorage, trackToolUsage, showToast, showModal, closeModal } from '../shared/utils.js';
import { t, initI18n } from '../shared/i18n.js';

class FastToolsPopup {
    constructor() {
        this.tools = [];
        this.notes = [];
        this.analytics = {};
        this.init();
    }

    async init() {
        console.log('🚀 Initializing FastTools Popup');
        
        this.lang = await initI18n();
        await this.loadData();
        this.setupEventListeners();
        this.render();
    }

    async loadData() {
        // Load user data first to get language
        const data = await getStorage(['notes', 'analytics', 'recentColors', 'settings']);
        this.notes = data.notes?.items || [];
        this.analytics = data.analytics || {};
        this.recentColors = data.recentColors || ['#13a4ec', '#000000', '#ffffff'];
        
        // Load tools with current language
        this.tools = await loadTools(this.lang);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (!action) return;
            
            e.preventDefault();
            
            const actions = {
                'capture-screen': () => this.captureScreen(),
                'show-modal': () => showModal(e.target.dataset.modal),
                'close-modal': () => closeModal(e.target.dataset.modal),
                'save-note': () => this.saveNote(),
                'copy-color': () => this.copyColor()
            };
            
            actions[action]?.();
        });
        
        // Color picker input
        const colorInput = document.getElementById('color-input');
        if (colorInput) {
            colorInput.addEventListener('input', (e) => this.updateColorValues(e.target.value));
        }
    }

    render() {
        this.renderTools();
        this.renderStats();
    }

    renderTools() {
        const container = document.getElementById('tools-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Show first 6 tools
        this.tools.slice(0, 6).forEach(tool => {
            const card = this.createToolCard(tool);
            container.appendChild(card);
        });
    }

    createToolCard(tool) {
        const card = document.createElement('a');
        card.className = 'tool-card';
        card.href = tool.url || '#';
        card.target = tool.local ? '_self' : '_blank';
        
        if (tool.local) {
            card.onclick = (e) => {
                e.preventDefault();
                this.handleLocalTool(tool);
            };
        } else {
            card.onclick = () => trackToolUsage(tool.slug);
        }
        
        card.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-info">
                <div class="tool-name">${tool.title}</div>
                <div class="tool-description">${tool.description}</div>
            </div>
        `;
        
        return card;
    }

    renderStats() {
        const today = new Date().toDateString();
        const todayUsage = this.analytics.dailyUsage?.[today] || {};
        const total = Object.values(todayUsage).reduce((sum, count) => sum + count, 0);
        
        const usageEl = document.getElementById('usage-today');
        if (usageEl) usageEl.textContent = t('usage_today', { count: total }, this.lang);
    }

    // ====================
    // ACTIONS
    // ====================

    captureScreen() {
        chrome.runtime.sendMessage({ action: 'capture-screen' });
        showToast(t('msg_capture_started', {}, this.lang), 'info');
        window.close();
    }

    handleLocalTool(tool) {
        if (tool.slug === 'local://capture') {
            this.captureScreen();
        } else if (tool.slug === 'local://notes') {
            showModal('notes-modal');
            this.loadNotes();
        }
    }

    // ====================
    // NOTES
    // ====================

    loadNotes() {
        const list = document.getElementById('notes-list');
        if (!list) return;
        
        list.innerHTML = '';
        
        if (this.notes.length === 0) {
            list.innerHTML = `<p style="text-align:center;color:var(--text-secondary);padding:1rem;">${t('note_no_notes', {}, this.lang)}</p>`;
            return;
        }
        
        this.notes.slice(0, 5).forEach(note => {
            const item = document.createElement('div');
            item.className = 'note-item';
            item.innerHTML = `
                <div class="note-title">${note.title || t('note_untitled', {}, this.lang)}</div>
                <div class="note-preview">${(note.content || '').substring(0, 50)}...</div>
            `;
            list.appendChild(item);
        });
    }

    async saveNote() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        
        if (!content) {
            showToast(t('msg_note_empty', {}, this.lang), 'warning');
            return;
        }
        
        const note = {
            id: Date.now(),
            title: title || 'Sin título',
            content,
            created: Date.now(),
            modified: Date.now()
        };
        
        this.notes.unshift(note);
        await chrome.storage.local.set({ notes: { items: this.notes } });
        
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        
        showToast(t('msg_note_saved', {}, this.lang), 'success');
        this.loadNotes();
    }

    // ====================
    // COLOR PICKER
    // ====================

    updateColorValues(hex) {
        const rgb = this.hexToRgb(hex);
        document.getElementById('color-hex').value = hex;
        document.getElementById('color-rgb').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    async copyColor() {
        const hex = document.getElementById('color-hex').value;
        await navigator.clipboard.writeText(hex);
        showToast(t('msg_color_copied', { color: hex }, this.lang), 'success');
        
        // Save to recent
        if (!this.recentColors.includes(hex)) {
            this.recentColors.unshift(hex);
            this.recentColors = this.recentColors.slice(0, 6);
            await chrome.storage.local.set({ recentColors: this.recentColors });
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

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new FastToolsPopup());
} else {
    new FastToolsPopup();
}
