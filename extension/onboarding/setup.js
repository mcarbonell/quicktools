// ====================
// ONBOARDING SETUP
// ====================

class OnboardingSetup {
    constructor() {
        this.currentScreen = 'welcome';
        this.profileData = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando onboarding...');
        
        // Verificar si ya completó el onboarding (solo si no es forzado)
        const urlParams = new URLSearchParams(window.location.search);
        const force = urlParams.get('force') === 'true';
        
        if (!force) {
            const completed = await this.checkOnboardingStatus();
            if (completed) {
                console.log('✅ Onboarding ya completado, redirigiendo...');
                chrome.tabs.create({ url: chrome.runtime.getURL('newtab/newtab.html') });
                window.close();
                return;
            }
        }

        this.setupEventListeners();
    }

    async checkOnboardingStatus() {
        const { onboardingCompleted } = await chrome.storage.local.get('onboardingCompleted');
        return onboardingCompleted === true;
    }

    setupEventListeners() {
        // Welcome screen
        document.getElementById('btn-start').addEventListener('click', () => this.startProfileCreation());
        document.getElementById('btn-skip').addEventListener('click', () => this.skipOnboarding());

        // Reveal screen
        document.getElementById('btn-confirm').addEventListener('click', () => this.confirmProfile());
        document.getElementById('btn-edit').addEventListener('click', () => this.editProfile());
        document.getElementById('btn-retry').addEventListener('click', () => this.retryAnalysis());

        // Error screen
        document.getElementById('btn-retry-error').addEventListener('click', () => this.retryAnalysis());
        document.getElementById('btn-skip-error').addEventListener('click', () => this.skipOnboarding());
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(`screen-${screenId}`).classList.add('active');
        this.currentScreen = screenId;
    }

    async startProfileCreation() {
        this.showScreen('analyzing');
        
        try {
            // Paso 1: Analizar historial
            this.updateProgress(0, 'Analizando historial de navegación...');
            this.updateStep('history', 'active');
            
            const historyResult = await chrome.runtime.sendMessage({
                action: 'analyze-history',
                days: 30
            });

            this.updateStep('history', 'completed');
            this.updateProgress(33, 'Historial analizado');

            // Paso 2: Analizar bookmarks
            this.updateProgress(33, 'Analizando marcadores...');
            this.updateStep('bookmarks', 'active');
            
            const bookmarksResult = await chrome.runtime.sendMessage({
                action: 'analyze-bookmarks'
            });

            this.updateStep('bookmarks', 'completed');
            this.updateProgress(66, 'Marcadores analizados');

            // Paso 3: Inferir perfil con IA (UNA SOLA LLAMADA)
            this.updateProgress(66, 'Infiriendo perfil con IA local...');
            this.updateStep('inference', 'active');
            
            const profileResult = await chrome.runtime.sendMessage({
                action: 'infer-profile',
                historyAnalysis: historyResult.analysis,
                bookmarksAnalysis: bookmarksResult.analysis
            });

            this.updateStep('inference', 'completed');
            this.updateProgress(100, '¡Perfil creado!');

            // Esperar un momento antes de mostrar el reveal
            setTimeout(() => {
                this.profileData = profileResult.profile;
                this.showReveal(profileResult.profile);
            }, 1000);

        } catch (error) {
            console.error('❌ Error creando perfil:', error);
            this.showError(error.message);
        }
    }

    updateProgress(percent, text) {
        document.getElementById('progress-fill').style.width = `${percent}%`;
        document.getElementById('progress-text').textContent = text;
    }

    updateStep(stepId, status) {
        const step = document.getElementById(`step-${stepId}`);
        step.classList.remove('active', 'completed');
        
        if (status === 'active') {
            step.classList.add('active');
        } else if (status === 'completed') {
            step.classList.add('completed');
            step.querySelector('.step-icon').textContent = '✅';
        }
    }

    showReveal(profile) {
        this.showScreen('reveal');

        // Nombre (opcional)
        if (profile.name) {
            document.getElementById('profile-name-display').textContent = profile.name;
            document.getElementById('profile-name-field').style.display = 'flex';
        }
        
        // Rellenar datos del perfil
        document.getElementById('profile-role').textContent = profile.role || profile.profile || 'Usuario general';
        document.getElementById('profile-level').textContent = profile.level || 'mid';
        document.getElementById('profile-interests').textContent = 
            (profile.interests && profile.interests.length > 0) 
                ? profile.interests.join(', ') 
                : 'No detectado';
        document.getElementById('profile-stack').textContent = 
            (profile.stack && profile.stack.length > 0) 
                ? profile.stack.join(', ') 
                : 'No detectado';
        
        // Hobbies (opcional)
        if (profile.hobbies && profile.hobbies.length > 0) {
            document.getElementById('profile-hobbies').textContent = profile.hobbies.join(', ');
            document.getElementById('profile-hobbies-field').style.display = 'flex';
        }
    }

    async confirmProfile() {
        console.log('✅ Perfil confirmado');
        
        // Guardar perfil
        await chrome.runtime.sendMessage({
            action: 'save-profile',
            profile: {
                ...this.profileData,
                source: 'auto'
            }
        });

        // Marcar onboarding como completado
        await chrome.storage.local.set({ onboardingCompleted: true });

        // Redirigir a new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('newtab/newtab.html') });
        window.close();
    }

    editProfile() {
        console.log('✏️ Editar perfil');
        // Abrir página de opciones para editar
        chrome.runtime.openOptionsPage();
        window.close();
    }

    async retryAnalysis() {
        console.log('🔄 Reintentando análisis...');
        this.showScreen('welcome');
        
        // Limpiar cachés
        await chrome.runtime.sendMessage({ action: 'clear-profile-cache' });
    }

    async skipOnboarding() {
        console.log('⏭️ Onboarding omitido');
        
        // Marcar como completado pero sin perfil
        await chrome.storage.local.set({ onboardingCompleted: true });

        // Redirigir a new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('newtab/newtab.html') });
        window.close();
    }

    showError(message) {
        this.showScreen('error');
        document.getElementById('error-message').textContent = message || 'Error desconocido';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new OnboardingSetup();
});
