// ====================
// PROFILE INFERENCE WITH AI
// ====================

/**
 * Infiere el perfil del usuario basado en su historial de navegación
 */
class ProfileInference {
    constructor() {
        this.cachedProfile = null;
    }

    /**
     * Genera un perfil del usuario usando IA (via offscreen document)
     */
    async inferProfile(historyAnalysis) {
        console.log('🤖 Infiriendo perfil del usuario con IA...');

        try {
            const response = await chrome.runtime.sendMessage({
                target: 'ai-offscreen',
                action: 'infer-profile',
                historyAnalysis: historyAnalysis
            });

            if (!response.success) {
                throw new Error(response.error);
            }

            console.log('✅ Perfil inferido');
            this.cachedProfile = response.profile;
            return response.profile;
        } catch (error) {
            console.error('❌ Error infiriendo perfil:', error);
            return this.getDefaultProfile();
        }
    }

    /**
     * Genera recomendaciones de sitios usando IA (via offscreen document)
     */
    async generateRecommendations(profile, historyAnalysis, currentUrl = null) {
        console.log('🎯 Generando recomendaciones...');

        try {
            const response = await chrome.runtime.sendMessage({
                target: 'ai-offscreen',
                action: 'generate-recommendations',
                profile: profile,
                historyAnalysis: historyAnalysis,
                currentUrl: currentUrl
            });

            if (!response.success) {
                throw new Error(response.error);
            }

            console.log('✅ Recomendaciones generadas');
            return response.recommendations;
        } catch (error) {
            console.error('❌ Error generando recomendaciones:', error);
            return 'No se pudieron generar recomendaciones en este momento.';
        }
    }

    /**
     * Perfil por defecto si falla la inferencia
     */
    getDefaultProfile() {
        return {
            profile: 'Usuario general',
            level: 'mid',
            interests: ['tecnología', 'web'],
            stack: [],
            language: 'en',
            workStyle: 'Explorador activo de internet'
        };
    }

    /**
     * Obtiene el perfil cacheado
     */
    getCachedProfile() {
        return this.cachedProfile;
    }

    /**
     * Limpia el perfil cacheado
     */
    clearCache() {
        this.cachedProfile = null;
    }
}

// Exportar instancia singleton
const profileInference = new ProfileInference();
