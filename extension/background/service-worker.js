// Background Service Worker - QuickTools Extension
// Maneja eventos en segundo plano, analytics, sync

// ====================
// INICIALIZACIÓN
// ====================

// Cuando se instala la extensión
chrome.runtime.onInstalled.addListener((details) => {
    console.log('🚀 QuickTools Extension instalado:', details.reason);

    if (details.reason === 'install') {
        // Primera instalación
        initializeExtension();
        showWelcomeNotification();
    } else if (details.reason === 'update') {
        // Actualización
        handleUpdate(details.previousVersion);
    }

    // Crear context menus
    createContextMenus();
});

// ====================
// INICIALIZACIÓN
// ====================

async function initializeExtension() {
    // Configurar almacenamiento inicial
    await chrome.storage.local.set({
        user: {
            id: generateUserId(),
            tier: 'free',
            installDate: Date.now(),
            lastSync: Date.now()
        },
        settings: {
            theme: 'auto',
            autoCapture: false,
            saveToClipboard: true,
            showTooltips: true,
            enableAnalytics: true
        },
        tools: {
            usage: {},
            favorites: ['screen-capture', 'notes', 'color-picker'],
            history: []
        },
        notes: {
            items: [],
            tags: [],
            maxItems: 50
        },
        analytics: {
            dailyUsage: {},
            totalSessions: 0,
            lastActivity: Date.now()
        }
    });

    console.log('✅ QuickTools inicializado correctamente');
}

function generateUserId() {
    return 'qt_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function showWelcomeNotification() {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-128x128.png',
        title: '¡Bienvenido a QuickTools!',
        message: 'Tu suite de productividad está lista. Usa Ctrl+Shift+Q para abrir.'
    });
}

function handleUpdate(previousVersion) {
    console.log(`🔄 QuickTools actualizado de ${previousVersion} a 1.0.0`);

    // Migrar datos si es necesario
    chrome.storage.local.get(null, (data) => {
        if (!data.user) {
            data.user = { tier: 'free' };
            chrome.storage.local.set(data);
        }
    });
}

// ====================
// CONTEXT MENUS
// ====================

function createContextMenus() {
    // Limpiar menus existentes
    chrome.contextMenus.removeAll(() => {
        // Menu principal
        chrome.contextMenus.create({
            id: 'quicktools-main',
            title: '🛠️ QuickTools',
            contexts: ['page', 'selection', 'image', 'link']
        });

        // Submenu para texto
        chrome.contextMenus.create({
            id: 'quicktools-text',
            title: '📝 Herramientas de Texto',
            parentId: 'quicktools-main',
            contexts: ['selection']
        });

        chrome.contextMenus.create({
            id: 'text-encode-url',
            title: '🔗 Codificar URL',
            parentId: 'quicktools-text',
            contexts: ['selection']
        });

        chrome.contextMenus.create({
            id: 'text-base64',
            title: '🔐 Base64 Encode',
            parentId: 'quicktools-text',
            contexts: ['selection']
        });

        // Submenu para imagen
        chrome.contextMenus.create({
            id: 'quicktools-image',
            title: '🖼️ Herramientas de Imagen',
            parentId: 'quicktools-main',
            contexts: ['image']
        });

        chrome.contextMenus.create({
            id: 'image-color-picker',
            title: '🎨 Extraer Colores',
            parentId: 'quicktools-image',
            contexts: ['image']
        });

        // Acciones directas
        chrome.contextMenus.create({
            id: 'capture-screen',
            title: '📸 Capturar Pantalla',
            parentId: 'quicktools-main',
            contexts: ['page']
        });

        chrome.contextMenus.create({
            id: 'quick-notes',
            title: '📝 Nueva Nota Rápida',
            parentId: 'quicktools-main',
            contexts: ['page']
        });
    });
}

// ====================
// EVENT HANDLERS
// ====================

// Manejar clicks en context menus
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log('📋 Context menu click:', info.menuItemId);

    try {
        switch (info.menuItemId) {
            case 'text-encode-url':
                await handleTextEncodeURL(info, tab);
                break;
            case 'text-base64':
                await handleTextBase64(info, tab);
                break;
            case 'image-color-picker':
                await handleImageColorPicker(info, tab);
                break;
            case 'capture-screen':
                await handleCaptureScreen(tab);
                break;
            case 'quick-notes':
                await handleQuickNotes(tab);
                break;
        }

        // Track usage
        await trackToolUsage(info.menuItemId, 'context-menu');

    } catch (error) {
        console.error('❌ Error en context menu:', error);
        showErrorNotification(error.message);
    }
});

// Comandos de teclado
chrome.commands.onCommand.addListener(async (command) => {
    console.log('⌨️ Command triggered:', command);

    try {
        switch (command) {
            case 'quick-tools':
                await openQuickTools();
                break;
            case 'capture-screen':
                await captureScreen();
                break;
            case 'quick-notes':
                await openQuickNotes();
                break;
        }

        await trackToolUsage(command, 'shortcut');

    } catch (error) {
        console.error('❌ Error en command:', error);
    }
});

// ====================
// TOOL HANDLERS
// ====================

async function handleTextEncodeURL(info, tab) {
    const encoded = encodeURIComponent(info.selectionText);
    await copyToClipboard(encoded);
    showNotification('URL codificada copiada al portapapeles', 'success');
}

async function handleTextBase64(info, tab) {
    const encoded = btoa(info.selectionText);
    await copyToClipboard(encoded);
    showNotification('Base64 codificado copiado al portapapeles', 'success');
}

async function handleImageColorPicker(info, tab) {
    // Abrir popup con color picker
    await openColorPicker(info.srcUrl);
}

async function handleCaptureScreen(tab) {
    await captureScreen();
}

async function handleQuickNotes(tab) {
    await openQuickNotes();
}

// ====================
// TOOL FUNCTIONS
// ====================

async function openQuickTools() {
    // Abrir popup
    chrome.action.openPopup();
}

async function openQuickNotes() {
    // Enviar mensaje al content script para abrir notes modal
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'open-notes-modal'
        });
    }
}

async function openColorPicker(imageUrl) {
    // Abrir popup con color picker pre-loaded
    chrome.action.openPopup();
    // El popup manejará la imagen
}

async function captureScreen() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' },
            audio: false
        });

        // Crear video element para captura
        const video = document.createElement('video');
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                showNotification('Captura completada', 'success');

                // Guardar captura
                chrome.storage.local.get('captures', (data) => {
                    const captures = data.captures || [];
                    captures.unshift({
                        id: Date.now(),
                        url: url,
                        timestamp: Date.now(),
                        type: 'screen'
                    });

                    chrome.storage.local.set({
                        captures: captures.slice(0, 20) // Keep last 20
                    });
                });
            });
        };

        // Stop stream after capture
        setTimeout(() => {
            stream.getTracks().forEach(track => track.stop());
        }, 1000);

    } catch (error) {
        console.error('❌ Error capturando pantalla:', error);
        showNotification('Error capturando pantalla: ' + error.message, 'error');
    }
}

// ====================
// CLIPBOARD & STORAGE
// ====================

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('❌ Error copiando al portapapeles:', error);
        return false;
    }
}

// ====================
// ANALYTICS & TRACKING
// ====================

async function trackToolUsage(toolId, source) {
    if (!toolId) return;

    const data = await chrome.storage.local.get('analytics');
    const analytics = data.analytics || {};

    // Daily usage
    const today = new Date().toDateString();
    if (!analytics.dailyUsage[today]) {
        analytics.dailyUsage[today] = {};
    }

    if (!analytics.dailyUsage[today][toolId]) {
        analytics.dailyUsage[today][toolId] = 0;
    }
    analytics.dailyUsage[today][toolId]++;

    // Update analytics
    analytics.totalSessions = (analytics.totalSessions || 0) + 1;
    analytics.lastActivity = Date.now();

    await chrome.storage.local.set({ analytics });
}

// ====================
// NOTIFICATIONS
// ====================

function showNotification(message, type = 'info') {
    const icons = {
        success: 'icons/icon-128x128.png',
        error: 'icons/icon-128x128.png',
        info: 'icons/icon-128x128.png'
    };

    chrome.notifications.create({
        type: 'basic',
        iconUrl: icons[type],
        title: 'QuickTools',
        message: message
    });
}

function showErrorNotification(error) {
    showNotification('Error: ' + error, 'error');
}

// ====================
// MESSAGES FROM POPUP/CONTENT
// ====================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Message received:', request.action);

    switch (request.action) {
        case 'track-usage':
            trackToolUsage(request.toolId, request.source);
            break;
        case 'open-popup':
            chrome.action.openPopup();
            break;
        case 'get-analytics':
            getAnalytics().then(sendResponse);
            return true; // Async response
        case 'update-settings':
            updateSettings(request.settings);
            break;
    }
});

async function getAnalytics() {
    const data = await chrome.storage.local.get('analytics');
    return data.analytics || {};
}

async function updateSettings(newSettings) {
    const data = await chrome.storage.local.get('settings');
    const settings = { ...data.settings, ...newSettings };
    await chrome.storage.local.set({ settings });
}

// ====================
// SYNC & CLOUD
// ====================

// Sync data entre dispositivos (premium feature)
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.user) {
        console.log('🔄 Sync data changed:', changes);
        // Handle cloud sync
    }
});

// ====================
// ERROR HANDLING
// ====================

// Log errors para debugging
self.addEventListener('error', (event) => {
    console.error('💥 Service Worker error:', event.error);
});

// Log unhandled rejections
self.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Unhandled promise rejection:', event.reason);
});

console.log('🚀 QuickTools Service Worker cargado');
