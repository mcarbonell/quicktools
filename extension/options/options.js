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
        this.setupEventListeners();
        this.setupNavigation();
        this.updateUI();
        this.setupTheme();
        this.loadDataStats();

        console.log('Options page initialized');
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
        this.setupEventListener('openInNewTab', 'change', (checked) => {
            this.settings.openInNewTab = checked;
            this.saveSettings();
        });

        this.setupEventListener('showNotifications', 'change', (checked) => {
            this.settings.showNotifications = checked;
            this.saveSettings();
        });

        this.setupEventListener('autoHidePanel', 'change', (checked) => {
            this.settings.autoHidePanel = checked;
            this.saveSettings();
        });

        // Theme Settings
        this.setupEventListener('themeSystem', 'change', (checked) => {
            if (checked) {
                this.settings.theme = 'system';
                this.saveSettings();
                this.updateTheme();
            }
        });

        this.setupEventListener('themeLight', 'change', (checked) => {
            if (checked) {
                this.settings.theme = 'light';
                this.saveSettings();
                this.updateTheme();
            }
        });

        this.setupEventListener('themeDark', 'change', (checked) => {
            if (checked) {
                this.settings.theme = 'dark';
                this.saveSettings();
                this.updateTheme();
            }
        });

        this.setupEventListener('primaryColor', 'input', (value) => {
            this.settings.primaryColor = value;
            document.documentElement.style.setProperty('--primary-color', value);
            document.getElementById('colorValue').textContent = value;
        });

        this.setupEventListener('primaryColor', 'change', (value) => {
            this.saveSettings();
        });

        this.setupEventListener('enableAnimations', 'change', (checked) => {
            this.settings.enableAnimations = checked;
            this.saveSettings();
        });

        // Privacy Settings
        this.setupEventListener('dataCollection', 'change', (checked) => {
            this.settings.dataCollection = checked;
            this.saveSettings();
        });

        this.setupEventListener('analyticsEnabled', 'change', (checked) => {
            this.settings.analyticsEnabled = checked;
            this.saveSettings();
        });

        this.setupEventListener('crashReports', 'change', (checked) => {
            this.settings.crashReports = checked;
            this.saveSettings();
        });

        this.setupEventListener('syncData', 'change', (checked) => {
            this.settings.syncData = checked;
            this.saveSettings();
        });

        // Auto-hide delay
        this.setupEventListener('autoHideDelay', 'change', (value) => {
            this.settings.autoHideDelay = parseInt(value) || 5;
            this.saveSettings();
        });

        // Shortcuts
        this.setupShortcuts();

        // Data Management
        this.setupDataManagement();

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
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
        this.setChecked('openInNewTab', this.settings.openInNewTab);
        this.setChecked('showNotifications', this.settings.showNotifications);
        this.setChecked('autoHidePanel', this.settings.autoHidePanel);
        document.getElementById('autoHideDelay').value = this.settings.autoHideDelay;

        // Theme Settings
        document.getElementById(`theme${this.capitalize(this.settings.theme)}`).checked = true;
        document.getElementById('primaryColor').value = this.settings.primaryColor;
        document.getElementById('colorValue').textContent = this.settings.primaryColor;
        this.setChecked('enableAnimations', this.settings.enableAnimations);

        // Privacy Settings
        this.setChecked('dataCollection', this.settings.dataCollection);
        this.setChecked('analyticsEnabled', this.settings.analyticsEnabled);
        this.setChecked('crashReports', this.settings.crashReports);
        this.setChecked('syncData', this.settings.syncData);
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
        document.getElementById('resetShortcuts').addEventListener('click', () => {
            this.resetShortcuts();
        });
    }

    // Update shortcuts display
    updateShortcutsDisplay() {
        const shortcutsContainer = document.getElementById('shortcutsList');
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
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        // Import data
        document.getElementById('importData').addEventListener('click', () => {
            this.importData();
        });

        // Clear data
        document.getElementById('clearData').addEventListener('click', () => {
            this.clearData();
        });

        // Sync data
        document.getElementById('syncData').addEventListener('click', () => {
            this.syncData();
        });
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
        document.getElementById('syncKeysCount').textContent = stats.sync.keys;
        document.getElementById('syncDataSize').textContent = this.formatSize(stats.sync.size);
        document.getElementById('localKeysCount').textContent = stats.local.keys;
        document.getElementById('localDataSize').textContent = this.formatSize(stats.local.size);
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
    new OptionsManager();
});

// Handle service worker messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'optionsUpdated') {
        // Reload settings if changed from popup
        window.location.reload();
    }
});
