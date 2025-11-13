// QuickTools Extension - Options Page Script

class OptionsManager {
    constructor() {
        this.currentSection = 'general';
        this.isSyncing = false;
        this.isDarkMode = false;
        this.defaultSettings = {
            // General Settings
            openInNewTab: true,
            showNotifications: true,
            autoHidePanel: true,
            autoHideDelay: 5,

            // Theme Settings
            theme: 'system', // light, dark, system
            primaryColor: '#6366f1',
            enableAnimations: true,

            // Privacy Settings
            dataCollection: false,
            analyticsEnabled: false,
            crashReports: false,
            syncData: false,

            // Shortcuts
            shortcuts: {
                'toggle-panel': 'Ctrl+Shift+T',
                'open-tools': 'Ctrl+Shift+K',
                'quick-actions': 'Ctrl+Shift+Q'
            }
        };

        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadProfile();
        this.setupEventListeners();
        this.setupNavigation();
        this.updateUI();
        this.setupTheme();
        this.loadDataStats();

        console.log('Options page initialized');
    }
    
    async loadProfile() {
        const { userProfile } = await chrome.storage.local.get('userProfile');
        this.profile = userProfile || null;
        if (this.profile) {
            this.updateProfileUI();
        }
    }
    
    updateProfileUI() {
        if (!this.profile) return;
        
        document.getElementById('profile-role').value = this.profile.role || this.profile.profile || '';
        document.getElementById('profile-level').value = this.profile.level || 'mid';
        document.getElementById('profile-interests').value = (this.profile.interests || []).join(', ');
        document.getElementById('profile-stack').value = (this.profile.stack || []).join(', ');
        document.getElementById('profile-workstyle').value = this.profile.workStyle || '';
        document.getElementById('profile-hobbies').value = (this.profile.hobbies || []).join(', ');
        document.getElementById('profile-gender').value = this.profile.gender || 'unknown';
        document.getElementById('profile-age').value = this.profile.ageRange || '';
    }

    // Load settings from storage
    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['quicktoolsSettings']);
            this.settings = { ...this.defaultSettings, ...(result.quicktoolsSettings || {}) };
            this.isDarkMode = await this.getCurrentTheme();

            console.log('Settings loaded:', this.settings);
        } catch (error) {
            console.error('Error loading settings:', error);
            this.settings = { ...this.defaultSettings };
        }
    }

    // Save settings to storage
    async saveSettings() {
        try {
            await chrome.storage.sync.set({ quicktoolsSettings: this.settings });
            this.showMessage('Settings saved successfully!', 'success');
            console.log('Settings saved:', this.settings);
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showMessage('Error saving settings!', 'error');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // General Settings
        this.setupEventListener('auto-start', 'change', (checked) => {
            this.settings.autoStart = checked;
        });
        
        this.setupEventListener('auto-capture', 'change', (checked) => {
            this.settings.autoCapture = checked;
        });
        
        this.setupEventListener('save-to-clipboard', 'change', (checked) => {
            this.settings.saveToClipboard = checked;
        });

        this.setupEventListener('show-notifications', 'change', (checked) => {
            this.settings.showNotifications = checked;
        });
        
        this.setupEventListener('open-in-new-tab', 'change', (checked) => {
            this.settings.openInNewTab = checked;
        });
        
        this.setupEventListener('compact-view', 'change', (checked) => {
            this.settings.compactView = checked;
        });

        // Theme Settings
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.settings.theme = e.target.value;
                    this.updateTheme();
                }
            });
        });

        const accentColor = document.getElementById('accent-color');
        if (accentColor) {
            accentColor.addEventListener('input', (e) => {
                this.settings.primaryColor = e.target.value;
                document.documentElement.style.setProperty('--primary-color', e.target.value);
            });
        }

        // Privacy Settings
        this.setupEventListener('enable-analytics', 'change', (checked) => {
            this.settings.analyticsEnabled = checked;
        });

        this.setupEventListener('crash-reports', 'change', (checked) => {
            this.settings.crashReports = checked;
        });

        // Shortcuts
        this.setupShortcuts();

        // Data Management
        this.setupDataManagement();

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Profile actions
        document.getElementById('save-profile')?.addEventListener('click', () => this.saveProfile());
        document.getElementById('regenerate-profile')?.addEventListener('click', () => this.regenerateProfile());
        
        // Save settings button
        document.getElementById('save-settings')?.addEventListener('click', () => this.saveSettings());
    }
    
    async saveProfile() {
        const profile = {
            name: document.getElementById('profile-name').value.trim(),
            role: document.getElementById('profile-role').value.trim(),
            level: document.getElementById('profile-level').value,
            interests: document.getElementById('profile-interests').value.split(',').map(s => s.trim()).filter(Boolean),
            stack: document.getElementById('profile-stack').value.split(',').map(s => s.trim()).filter(Boolean),
            workStyle: document.getElementById('profile-workstyle').value.trim(),
            hobbies: document.getElementById('profile-hobbies').value.split(',').map(s => s.trim()).filter(Boolean),
            gender: document.getElementById('profile-gender').value,
            ageRange: document.getElementById('profile-age').value,
            language: this.profile?.language || 'es',
            lastUpdated: new Date().toISOString(),
            source: 'manual'
        };
        
        await chrome.storage.local.set({ userProfile: profile });
        this.profile = profile;
        this.showMessage('Perfil guardado correctamente', 'success');
    }
    
    async regenerateProfile() {
        if (!confirm('¿Regenerar perfil con IA? Esto sobrescribirá los cambios actuales.')) return;
        
        await chrome.storage.local.remove(['onboardingCompleted', 'userProfile']);
        chrome.tabs.create({ url: chrome.runtime.getURL('onboarding/setup.html?force=true') });
    }

    // Setup event listener helper
    setupEventListener(id, event, handler) {
        const element = document.getElementById(id);
        if (element) {
            if (event === 'change' && element.type === 'checkbox') {
                element.addEventListener('change', (e) => handler(e.target.checked));
            } else if (event === 'change' && element.type === 'radio') {
                element.addEventListener('change', (e) => handler(e.target.value));
            } else if (event === 'input' || event === 'change') {
                element.addEventListener(event, (e) => {
                    if (element.type === 'color') {
                        handler(e.target.value);
                    } else {
                        handler(e.target.value);
                    }
                });
            }
        }
    }

    // Setup navigation
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = btn.dataset.section;
                if (section) {
                    this.switchSection(section);
                }
            });
        });
    }

    // Switch between sections
    switchSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).closest('.nav-item').classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionId}-section`).classList.add('active');

        this.currentSection = sectionId;
    }

    // Update UI based on settings
    updateUI() {
        // General Settings
        this.setChecked('auto-start', this.settings.autoStart);
        this.setChecked('auto-capture', this.settings.autoCapture);
        this.setChecked('save-to-clipboard', this.settings.saveToClipboard);
        this.setChecked('show-notifications', this.settings.showNotifications);
        this.setChecked('open-in-new-tab', this.settings.openInNewTab);
        this.setChecked('compact-view', this.settings.compactView);

        // Theme Settings
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            if (radio.value === this.settings.theme) {
                radio.checked = true;
            }
        });
        
        const accentColor = document.getElementById('accent-color');
        if (accentColor) {
            accentColor.value = this.settings.primaryColor || '#6366f1';
        }

        // Privacy Settings
        this.setChecked('enable-analytics', this.settings.analyticsEnabled);
        this.setChecked('crash-reports', this.settings.crashReports);
    }

    // Set checkbox value
    setChecked(id, checked) {
        const element = document.getElementById(id);
        if (element) {
            element.checked = checked;
        }
    }

    // Capitalize first letter
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Setup theme
    async setupTheme() {
        this.updateTheme();
    }

    // Update theme
    updateTheme() {
        const theme = this.settings.theme;

        if (theme === 'dark' || (theme === 'system' && this.isDarkMode)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Update color variables
        document.documentElement.style.setProperty('--primary-color', this.settings.primaryColor);
    }

    // Get current theme (light/dark)
    async getCurrentTheme() {
        try {
            const result = await chrome.storage.local.get(['darkMode']);
            return result.darkMode || false;
        } catch (error) {
            console.error('Error getting theme:', error);
            return false;
        }
    }

    // Setup shortcuts management
    setupShortcuts() {
        // Load shortcuts
        this.updateShortcutsDisplay();

        // Reset shortcuts
        const resetBtn = document.getElementById('reset-shortcuts');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetShortcuts();
            });
        }
    }

    // Update shortcuts display
    updateShortcutsDisplay() {
        const shortcutsContainer = document.getElementById('shortcut-list');
        if (!shortcutsContainer) return;
        shortcutsContainer.innerHTML = '';

        Object.entries(this.settings.shortcuts).forEach(([action, keys]) => {
            const shortcutItem = this.createShortcutItem(action, keys);
            shortcutsContainer.appendChild(shortcutItem);
        });
    }

    // Create shortcut item element
    createShortcutItem(action, keys) {
        const item = document.createElement('div');
        item.className = 'shortcut-item';
        item.innerHTML = `
            <span class="shortcut-name">${this.getShortcutName(action)}</span>
            <div class="shortcut-keys">
                ${keys.split('+').map(key => `<span class="key">${key}</span>`).join('')}
            </div>
        `;
        return item;
    }

    // Get human-readable shortcut name
    getShortcutName(action) {
        const names = {
            'toggle-panel': 'Toggle Panel',
            'open-tools': 'Open Tools',
            'quick-actions': 'Quick Actions'
        };
        return names[action] || action;
    }

    // Reset shortcuts to default
    resetShortcuts() {
        if (confirm('Reset all shortcuts to default values?')) {
            this.settings.shortcuts = { ...this.defaultSettings.shortcuts };
            this.updateShortcutsDisplay();
            this.saveSettings();
        }
    }

    // Setup data management
    setupDataManagement() {
        // Export data
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Import data
        const importBtn = document.getElementById('import-data');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importData());
        }

        // Clear notes
        const clearNotesBtn = document.getElementById('clear-notes');
        if (clearNotesBtn) {
            clearNotesBtn.addEventListener('click', () => this.clearNotes());
        }
        
        // Clear captures
        const clearCapturesBtn = document.getElementById('clear-captures');
        if (clearCapturesBtn) {
            clearCapturesBtn.addEventListener('click', () => this.clearCaptures());
        }
        
        // Clear history
        const clearHistoryBtn = document.getElementById('clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
    }
    
    async clearNotes() {
        if (confirm('¿Eliminar todas las notas?')) {
            await chrome.storage.local.set({ notes: { items: [] } });
            this.showMessage('Notas eliminadas', 'success');
            this.loadDataStats();
        }
    }
    
    async clearCaptures() {
        if (confirm('¿Eliminar todas las capturas?')) {
            await chrome.storage.local.set({ captures: [] });
            this.showMessage('Capturas eliminadas', 'success');
            this.loadDataStats();
        }
    }
    
    async clearHistory() {
        if (confirm('¿Eliminar historial de herramientas?')) {
            await chrome.storage.local.set({ analytics: {} });
            this.showMessage('Historial eliminado', 'success');
            this.loadDataStats();
        }
    }

    // Load data statistics
    async loadDataStats() {
        try {
            const data = await this.getStoredData();
            const stats = this.calculateDataStats(data);

            this.updateDataStats(stats);
        } catch (error) {
            console.error('Error loading data stats:', error);
        }
    }

    // Get stored data
    async getStoredData() {
        try {
            const [sync, local] = await Promise.all([
                chrome.storage.sync.get(),
                chrome.storage.local.get()
            ]);
            return { sync, local };
        } catch (error) {
            console.error('Error getting stored data:', error);
            return { sync: {}, local: {} };
        }
    }

    // Calculate data statistics
    calculateDataStats(data) {
        const stats = {
            sync: {
                keys: Object.keys(data.sync).length,
                size: JSON.stringify(data.sync).length
            },
            local: {
                keys: Object.keys(data.local).length,
                size: JSON.stringify(data.local).length
            }
        };

        return stats;
    }

    // Update data statistics display
    updateDataStats(stats) {
        const notesCount = document.getElementById('notes-count');
        const capturesCount = document.getElementById('captures-count');
        const historyCount = document.getElementById('history-count');
        
        if (notesCount) notesCount.textContent = stats.local.keys;
        if (capturesCount) capturesCount.textContent = '0';
        if (historyCount) historyCount.textContent = '0';
    }

    // Format size in bytes
    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Export data
    async exportData() {
        try {
            const data = await this.getStoredData();
            const exportData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                settings: this.settings,
                data: data
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quicktools-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showMessage('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showMessage('Error exporting data!', 'error');
        }
    }

    // Import data
    async importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const importData = JSON.parse(text);

                if (importData.settings) {
                    this.settings = { ...this.defaultSettings, ...importData.settings };
                    await this.saveSettings();
                    this.updateUI();
                }

                if (importData.data) {
                    await chrome.storage.local.set(importData.data.local || {});
                    await chrome.storage.sync.set(importData.data.sync || {});
                }

                this.showMessage('Data imported successfully!', 'success');
                await this.loadDataStats();
            } catch (error) {
                console.error('Error importing data:', error);
                this.showMessage('Error importing data!', 'error');
            }
        });

        input.click();
    }

    // Clear all data
    async clearData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            try {
                await chrome.storage.local.clear();
                await chrome.storage.sync.clear();
                this.settings = { ...this.defaultSettings };
                await this.saveSettings();
                this.updateUI();
                this.updateShortcutsDisplay();
                await this.loadDataStats();

                this.showMessage('All data cleared successfully!', 'success');
            } catch (error) {
                console.error('Error clearing data:', error);
                this.showMessage('Error clearing data!', 'error');
            }
        }
    }

    // Sync data
    async syncData() {
        if (this.isSyncing) return;

        this.isSyncing = true;
        const syncBtn = document.getElementById('syncData');
        const syncStatus = document.getElementById('syncStatusText');

        syncBtn.disabled = true;
        syncStatus.textContent = 'Syncing...';

        try {
            // Simulate sync process
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Save current settings
            await this.saveSettings();

            // Update sync status
            document.getElementById('syncStatusIcon').textContent = '✅';
            document.getElementById('syncStatusText').textContent = 'Synced successfully';

            this.showMessage('Data synced successfully!', 'success');
        } catch (error) {
            console.error('Error syncing data:', error);
            document.getElementById('syncStatusIcon').textContent = '❌';
            document.getElementById('syncStatusText').textContent = 'Sync failed';
            this.showMessage('Error syncing data!', 'error');
        } finally {
            this.isSyncing = false;
            syncBtn.disabled = false;

            // Reset sync status after 3 seconds
            setTimeout(() => {
                document.getElementById('syncStatusIcon').textContent = '🔄';
                document.getElementById('syncStatusText').textContent = 'Ready to sync';
            }, 3000);
        }
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+1-5 for quick navigation
            if (e.ctrlKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchSection('general');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchSection('appearance');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchSection('privacy');
                        break;
                    case '4':
                        e.preventDefault();
                        this.switchSection('shortcuts');
                        break;
                    case '5':
                        e.preventDefault();
                        this.switchSection('data');
                        break;
                }
            }
        });
    }

    // Show message
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existing = document.querySelector('.message');
        if (existing) {
            existing.remove();
        }

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `${type}-message message`;
        messageEl.textContent = message;

        // Insert at the top of content area
        const contentArea = document.querySelector('.content-area');
        contentArea.insertBefore(messageEl, contentArea.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.optionsManager = new OptionsManager();
});

// Handle service worker messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'optionsUpdated') {
        // Reload settings if changed from popup
        window.location.reload();
    }
    if (message.action === 'open-profile-section') {
        // Switch to profile section
        const optionsManager = window.optionsManager;
        if (optionsManager) {
            optionsManager.switchSection('profile');
        }
    }
});
