// Background Service Worker - QuickTools Extension
// Maneja eventos en segundo plano, analytics, sync

// ====================
// INICIALIZACIÓN
// ====================

let creating; // A promise to prevent race conditions

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
        iconUrl: chrome.runtime.getURL('icons/icon-128x128.png'),
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
                await captureScreen();
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

// New captureScreen function using offscreen document
async function captureScreen() {
    await setupOffscreenDocument('background/offscreen.html');
    // Send a message to the offscreen document to start the capture
    // We need to use chrome.runtime.sendMessage, not chrome.tabs.sendMessage
    chrome.runtime.sendMessage({
        action: 'start-capture',
        target: 'offscreen'
    });
}

async function setupOffscreenDocument(path) {
  // Check all existing contexts for a matching document
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [chrome.runtime.getURL(path)]
  });

  if (existingContexts.length > 0) {
    return;
  }

  // create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: [chrome.offscreen.Reason.USER_MEDIA],
      justification: 'Screen capture requires getDisplayMedia API, which is only available in a document context.',
    });
    await creating;
    creating = null;
  }
}


// ====================
// CLIPBOARD & STORAGE
// ====================

async function copyToClipboard(text) {
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (tab) {
            await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: (textToCopy) => {
                    navigator.clipboard.writeText(textToCopy);
                },
                args: [text]
            });
            return true;
        }
        return false;
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

function showNotification(message, type = 'info', buttons = [], notificationId = undefined, requireInteraction = false) {
    const icons = {
        success: 'icons/icon-128x128.png',
        error: 'icons/icon-128x128.png',
        info: 'icons/icon-128x128.png'
    };

    chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: chrome.runtime.getURL(icons[type]),
        title: 'QuickTools',
        message: message,
        buttons: buttons,
        requireInteraction: requireInteraction
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

    // Ignore messages not from our extension parts (content script, offscreen, etc.)
    if (sender.id !== chrome.runtime.id) {
        return;
    }

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
        case 'capture-screen':
            captureScreen();
            break;
        case 'capture-success':
            const notificationId = `capture-${Date.now()}`;
            showNotification(
                'Captura de pantalla completada.',
                'success',
                [{ title: 'Descargar' }],
                notificationId,
                true // requireInteraction
            );

            // Store the data URL to be used by the button listener
            chrome.storage.session.set({ [notificationId]: request.dataUrl });

            // Save to permanent storage as before
            chrome.storage.local.get('captures', (data) => {
                const captures = data.captures || [];
                captures.unshift({
                    id: Date.now(),
                    url: request.dataUrl,
                    timestamp: Date.now(),
                    type: 'screen'
                });
                chrome.storage.local.set({ captures: captures.slice(0, 20) });
            });
            break;
        case 'capture-failure':
            showErrorNotification(request.error);
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

chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
    if (!notificationId.startsWith('capture-')) return;

    const data = await chrome.storage.session.get(notificationId);
    const dataUrl = data[notificationId];

    if (dataUrl && buttonIndex === 0) { // "Descargar"
        chrome.downloads.download({
            url: dataUrl,
            filename: `QuickTools-Capture-${Date.now()}.png`,
            saveAs: true
        });
    }

    // Clean up
    chrome.notifications.clear(notificationId);
    chrome.storage.session.remove(notificationId);
});

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