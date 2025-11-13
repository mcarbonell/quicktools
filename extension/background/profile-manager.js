// ====================
// PROFILE MANAGER
// ====================

/**
 * Gestiona el perfil del usuario
 */
class ProfileManager {
    constructor() {
        this.profile = null;
    }

    /**
     * Obtiene el perfil del usuario
     */
    async getProfile() {
        if (this.profile) {
            return this.profile;
        }

        const { userProfile } = await chrome.storage.local.get('userProfile');
        this.profile = userProfile || null;
        return this.profile;
    }

    /**
     * Guarda el perfil del usuario
     */
    async saveProfile(profile) {
        const profileData = {
            ...profile,
            lastUpdated: new Date().toISOString(),
            createdAt: profile.createdAt || new Date().toISOString()
        };

        await chrome.storage.local.set({ userProfile: profileData });
        this.profile = profileData;
        
        console.log('✅ Perfil guardado:', profileData);
        return profileData;
    }

    /**
     * Actualiza campos específicos del perfil
     */
    async updateProfile(updates) {
        const currentProfile = await this.getProfile();
        if (!currentProfile) {
            throw new Error('No hay perfil para actualizar');
        }

        const updatedProfile = {
            ...currentProfile,
            ...updates,
            lastUpdated: new Date().toISOString()
        };

        return await this.saveProfile(updatedProfile);
    }

    /**
     * Elimina el perfil
     */
    async deleteProfile() {
        await chrome.storage.local.remove('userProfile');
        this.profile = null;
        console.log('🗑️ Perfil eliminado');
    }

    /**
     * Verifica si existe un perfil
     */
    async hasProfile() {
        const profile = await this.getProfile();
        return profile !== null;
    }

    /**
     * Genera system prompt para IA basado en el perfil
     */
    async getSystemPrompt() {
        const profile = await this.getProfile();
        if (!profile) {
            return '';
        }

        const role = profile.role || profile.profile || 'usuario';
        const name = profile.name ? ` llamado ${profile.name}` : '';
        const parts = [
            `Eres un asistente IA hablando con un ${role}${name} de nivel ${profile.level}.`
        ];
        
        if (profile.name) {
            parts.push(`Llámalo por su nombre (${profile.name}) de forma natural en las conversaciones.`);
        }

        if (profile.interests && profile.interests.length > 0) {
            parts.push(`Sus intereses incluyen: ${profile.interests.join(', ')}.`);
        }

        if (profile.stack && profile.stack.length > 0) {
            parts.push(`Stack tecnológico: ${profile.stack.join(', ')}.`);
        }

        if (profile.workStyle) {
            parts.push(`Estilo de trabajo: ${profile.workStyle}.`);
        }
        
        if (profile.hobbies && profile.hobbies.length > 0) {
            parts.push(`Hobbies: ${profile.hobbies.join(', ')}.`);
        }

        parts.push('Adapta tus respuestas a su perfil profesional y proporciona información relevante y práctica.');

        return parts.join(' ');
    }

    /**
     * Obtiene estadísticas del perfil
     */
    async getProfileStats() {
        const profile = await this.getProfile();
        if (!profile) {
            return null;
        }

        return {
            hasProfile: true,
            createdAt: profile.createdAt,
            lastUpdated: profile.lastUpdated,
            source: profile.source || 'auto',
            interestsCount: profile.interests?.length || 0,
            stackCount: profile.stack?.length || 0
        };
    }
}

// Exportar instancia singleton
const profileManager = new ProfileManager();
