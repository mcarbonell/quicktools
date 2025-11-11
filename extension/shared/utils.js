// FastTools Extension - Shared Utilities

// ====================
// TIME UTILITIES
// ====================

export function getTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
}

// ====================
// STORAGE
// ====================

export async function getStorage(keys) {
    return await chrome.storage.local.get(keys);
}

export async function setStorage(data) {
    return await chrome.storage.local.set(data);
}

// ====================
// TRACKING
// ====================

export function trackToolUsage(toolId, source = 'extension') {
    chrome.runtime.sendMessage({
        action: 'track-usage',
        toolId,
        source
    });
}

// ====================
// TOAST NOTIFICATIONS
// ====================

export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// ====================
// MODAL HELPERS
// ====================

export function showModal(modalId) {
    document.getElementById(modalId)?.classList.add('show');
}

export function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('show');
}

// ====================
// CLIPBOARD
// ====================

export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copiado al portapapeles', 'success');
        return true;
    } catch (error) {
        showToast('Error al copiar', 'error');
        return false;
    }
}
