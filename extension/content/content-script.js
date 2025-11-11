// QuickTools Extension - Content Script
// Injectado en todas las páginas para funcionalidad avanzada

class QuickToolsContentScript {
    constructor() {
        this.isEnabled = true;
        this.selectedText = '';
        this.selectedImage = null;
        this.quickNotesModal = null;

        this.init();
    }

    init() {
        console.log('🚀 QuickTools Content Script cargado');

        this.setupMessageListener();
        this.setupTextSelection();
        this.setupImageSelection();
        this.setupKeyboardShortcuts();

        // Notify background script
        chrome.runtime.sendMessage({
            action: 'content-script-ready',
            url: window.location.href,
            title: document.title
        });
    }

    // ====================
    // MESSAGE LISTENER
    // ====================

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('📨 Content script message:', request.action);

            switch (request.action) {
                case 'open-notes-modal':
                    this.openNotesModal();
                    break;
                case 'get-selected-text':
                    this.getSelectedText();
                    sendResponse({ text: this.selectedText });
                    break;
                case 'get-selected-image':
                    this.getSelectedImage();
                    sendResponse({ image: this.selectedImage });
                    break;
                case 'open-tool':
                    this.openToolInNewTab(request.tool);
                    break;
                case 'show-notification':
                    this.showNotification(request.message, request.type);
                    break;
                case 'extractLinks':
                    const links = this.extractAllLinks();
                    sendResponse({ links: links });
                    break;
            }
            return true;
        });
    }

    // ====================
    // TEXT SELECTION
    // ====================

    setupTextSelection() {
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            this.selectedText = selection.toString().trim();
        });

        document.addEventListener('mouseup', () => {
            if (this.selectedText.length > 0) {
                this.showTextSelectionTooltip();
            }
        });
    }

    showTextSelectionTooltip() {
        this.removeExistingTooltip();

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const tooltip = document.createElement('div');
        tooltip.id = 'quicktools-text-tooltip';
        tooltip.className = 'quicktools-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <button class="tooltip-btn" onclick="window.quickToolsContent.processText('base64')">🔐 Base64</button>
                <button class="tooltip-btn" onclick="window.quickToolsContent.processText('url')">🔗 URL</button>
                <button class="tooltip-btn" onclick="window.quickToolsContent.processText('hash')">🔢 Hash</button>
                <button class="tooltip-btn" onclick="window.quickToolsContent.copyText()">📋 Copiar</button>
            </div>
        `;

        // Position tooltip
        tooltip.style.position = 'fixed';
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 50) + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '10000';

        document.body.appendChild(tooltip);

        // Remove tooltip after 3 seconds
        setTimeout(() => this.removeExistingTooltip(), 3000);
    }

    removeExistingTooltip() {
        const existing = document.getElementById('quicktools-text-tooltip');
        if (existing) {
            existing.remove();
        }
    }

    processText(type) {
        if (!this.selectedText) return;

        switch (type) {
            case 'base64':
                const encoded = btoa(this.selectedText);
                this.copyToClipboard(encoded);
                this.showNotification('Texto codificado en Base64', 'success');
                break;
            case 'url':
                const urlEncoded = encodeURIComponent(this.selectedText);
                this.copyToClipboard(urlEncoded);
                this.showNotification('Texto codificado en URL', 'success');
                break;
            case 'hash':
                // Simple hash implementation (in real app, use crypto)
                const hash = this.simpleHash(this.selectedText);
                this.copyToClipboard(hash);
                this.showNotification('Hash generado', 'success');
                break;
        }

        this.removeExistingTooltip();
    }

    copyText() {
        this.copyToClipboard(this.selectedText);
        this.showNotification('Texto copiado', 'success');
        this.removeExistingTooltip();
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    // ====================
    // IMAGE SELECTION
    // ====================

    setupImageSelection() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                this.selectedImage = e.target;
                this.showImageTooltip(e);
            }
        });
    }

    showImageTooltip(event) {
        this.removeExistingImageTooltip();

        const img = event.target;
        const rect = img.getBoundingClientRect();

        const tooltip = document.createElement('div');
        tooltip.id = 'quicktools-image-tooltip';
        tooltip.className = 'quicktools-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <button class="tooltip-btn" onclick="window.quickToolsContent.downloadImage()">💾 Descargar</button>
                <button class="tooltip-btn" onclick="window.quickToolsContent.copyImageURL()">🔗 Copiar URL</button>
                <button class="tooltip-btn" onclick="window.quickToolsContent.openColorPicker()">🎨 Colores</button>
                <button class="tooltip-btn" onclick="window.quickToolsContent.analyzeImage()">🔍 Analizar</button>
            </div>
        `;

        tooltip.style.position = 'fixed';
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 40) + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '10000';

        document.body.appendChild(tooltip);

        setTimeout(() => this.removeExistingImageTooltip(), 3000);
    }

    removeExistingImageTooltip() {
        const existing = document.getElementById('quicktools-image-tooltip');
        if (existing) {
            existing.remove();
        }
    }

    downloadImage() {
        if (this.selectedImage) {
            fetch(this.selectedImage.src)
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'image';
                    a.click();
                    URL.revokeObjectURL(url);
                    this.showNotification('Imagen descargada', 'success');
                });
        }
        this.removeExistingImageTooltip();
    }

    copyImageURL() {
        if (this.selectedImage) {
            this.copyToClipboard(this.selectedImage.src);
            this.showNotification('URL de imagen copiada', 'success');
        }
        this.removeExistingImageTooltip();
    }

    openColorPicker() {
        this.showNotification('Abriendo selector de color...', 'info');
        // This would open the extension's color picker
        chrome.runtime.sendMessage({
            action: 'open-color-picker',
            imageUrl: this.selectedImage.src
        });
        this.removeExistingImageTooltip();
    }

    analyzeImage() {
        this.showNotification('Analizando imagen...', 'info');
        // Mock analysis - in real app, use image analysis APIs
        setTimeout(() => {
            this.showNotification('Análisis: 3 colores dominantes detectados', 'success');
        }, 1000);
        this.removeExistingImageTooltip();
    }

    // ====================
    // KEYBOARD SHORTCUTS
    // ====================

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only trigger if no input is focused
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Ctrl+Shift+Q - Open QuickTools
            if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
                e.preventDefault();
                chrome.runtime.sendMessage({ action: 'open-popup' });
            }

            // Ctrl+Shift+N - New note
            if (e.ctrlKey && e.shiftKey && e.key === 'N') {
                e.preventDefault();
                this.openNotesModal();
            }

            // Ctrl+Shift+C - Capture screen
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                chrome.runtime.sendMessage({ action: 'capture-screen' });
            }
        });
    }

    // ====================
    // NOTES MODAL
    // ====================

    openNotesModal() {
        this.removeNotesModal();

        const modal = document.createElement('div');
        modal.id = 'quicktools-notes-modal';
        modal.className = 'quicktools-modal-overlay';
        modal.innerHTML = `
            <div class="quicktools-modal">
                <div class="modal-header">
                    <h3>📝 Nota Rápida</h3>
                    <button class="modal-close" onclick="window.quickToolsContent.closeNotesModal()">×</button>
                </div>
                <div class="modal-body">
                    <textarea class="note-input" placeholder="Escribe tu nota aquí..." id="quicktools-note-content"></textarea>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="window.quickToolsContent.saveNote()">💾 Guardar</button>
                        <button class="btn" onclick="window.quickToolsContent.closeNotesModal()">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Focus on textarea
        setTimeout(() => {
            document.getElementById('quicktools-note-content').focus();
        }, 100);
    }

    removeNotesModal() {
        const existing = document.getElementById('quicktools-notes-modal');
        if (existing) {
            existing.remove();
        }
    }

    closeNotesModal() {
        this.removeNotesModal();
    }

    async saveNote() {
        const content = document.getElementById('quicktools-note-content').value.trim();
        if (!content) {
            this.showNotification('La nota no puede estar vacía', 'warning');
            return;
        }

        // Add selected text if any
        const noteContent = this.selectedText ? `${content}\n\nSeleccionado:\n${this.selectedText}` : content;

        // Send to background script
        chrome.runtime.sendMessage({
            action: 'create-note',
            note: {
                content: noteContent,
                url: window.location.href,
                title: document.title
            }
        });

        this.showNotification('Nota guardada', 'success');
        this.closeNotesModal();
    }

    // ====================
    // UTILITY FUNCTIONS
    // ====================

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error('Error copiando al portapapeles:', error);
        }
    }

    getSelectedText() {
        return this.selectedText;
    }

    getSelectedImage() {
        return this.selectedImage ? {
            src: this.selectedImage.src,
            alt: this.selectedImage.alt
        } : null;
    }

    openToolInNewTab(tool) {
        const url = `https://fasttools.tools/tools/${tool}`;
        window.open(url, '_blank');
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `quicktools-toast quicktools-toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ====================
    // SEO TOOLS - LINK EXTRACTION
    // ====================

    extractAllLinks() {
        const links = [];
        const seen = new Set();
        
        // Get all <a> tags
        const anchors = document.querySelectorAll('a[href]');
        
        anchors.forEach(anchor => {
            const href = anchor.href;
            
            // Skip javascript:, mailto:, tel:, etc.
            if (!href.startsWith('http://') && !href.startsWith('https://')) {
                return;
            }
            
            // Skip duplicates
            if (seen.has(href)) {
                return;
            }
            
            seen.add(href);
            links.push(href);
        });
        
        console.log(`🔗 Extracted ${links.length} unique links`);
        return links;
    }
}

// Initialize content script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.quickToolsContent = new QuickToolsContentScript();
    });
} else {
    window.quickToolsContent = new QuickToolsContentScript();
}
