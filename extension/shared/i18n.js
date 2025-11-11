// FastTools Extension - i18n System

const translations = {
    es: {
        // Header
        greeting_morning: '¡Buenos días!',
        greeting_afternoon: '¡Buenas tardes!',
        greeting_evening: '¡Buenas noches!',
        greeting_default: '¡Hola!',
        search_placeholder: '🔍 Buscar herramientas...',
        
        // Stats
        stats_today: 'Usos Hoy',
        stats_favorite: 'Favorita',
        stats_time_saved: 'Tiempo Ahorrado',
        
        // Sections
        section_quick_access: '⚡ Acceso Rápido',
        section_all_tools: '🛠️ Todas las Herramientas',
        section_notes: '📝 Notas Rápidas',
        
        // Buttons
        btn_edit: '✏️ Editar',
        btn_new: '+ Nueva',
        btn_save: 'Guardar',
        btn_cancel: 'Cancelar',
        btn_delete: '🗑️ Eliminar',
        btn_close: 'Cerrar',
        
        // Categories (using English keys from web)
        category_all: 'Todo',
        category_image: '🖼️ Imagen',
        category_data: '📊 Datos',
        category_text: '📝 Texto',
        category_utils: '🔧 Utilidades',
        category_ai: '🤖 IA',
        category_files: '📁 Archivos',
        category_converters: '🔄 Conversores',
        category_generators: '✨ Generadores',
        
        // Timer
        timer_title: '⏰ Temporizador',
        timer_start: 'Iniciar',
        timer_stop: 'Parar',
        timer_reset: 'Reset',
        
        // Colors
        colors_title: '🎨 Colores Recientes',
        
        // Modals
        modal_settings: '⚙️ Configuración',
        modal_favorites: '⭐ Editar Acceso Rápido',
        modal_notes: '📝 Editor de Notas',
        
        // Settings
        settings_appearance: '🎨 Apariencia',
        settings_language: '🌐 Idioma',
        settings_theme: 'Tema:',
        settings_lang: 'Idioma:',
        theme_auto: 'Automático',
        theme_light: 'Claro',
        theme_dark: 'Oscuro',
        lang_es: 'Español',
        lang_en: 'English',
        
        // Notes
        note_title_placeholder: 'Título',
        note_content_placeholder: 'Escribe tu nota...',
        note_no_notes: 'No hay notas',
        note_untitled: 'Sin título',
        
        // Favorites
        favorites_description: 'Selecciona hasta 8 herramientas para acceso rápido:',
        
        // Messages
        msg_capture_started: 'Captura iniciada',
        msg_note_saved: 'Nota guardada',
        msg_note_deleted: 'Nota eliminada',
        msg_note_empty: 'La nota debe tener título o contenido',
        msg_favorites_saved: 'Favoritos guardados',
        msg_settings_saved: 'Configuración guardada',
        msg_color_copied: 'Color {color} copiado',
        msg_timer_finished: '⏰ ¡Tiempo terminado!',
        
        // Usage
        usage_count: '{count} usos',
        usage_today: '{count} usos hoy'
    },
    en: {
        // Header
        greeting_morning: 'Good morning!',
        greeting_afternoon: 'Good afternoon!',
        greeting_evening: 'Good evening!',
        greeting_default: 'Hello!',
        search_placeholder: '🔍 Search tools...',
        
        // Stats
        stats_today: 'Uses Today',
        stats_favorite: 'Favorite',
        stats_time_saved: 'Time Saved',
        
        // Sections
        section_quick_access: '⚡ Quick Access',
        section_all_tools: '🛠️ All Tools',
        section_notes: '📝 Quick Notes',
        
        // Buttons
        btn_edit: '✏️ Edit',
        btn_new: '+ New',
        btn_save: 'Save',
        btn_cancel: 'Cancel',
        btn_delete: '🗑️ Delete',
        btn_close: 'Close',
        
        // Categories (using English keys from web)
        category_all: 'All',
        category_image: '🖼️ Image',
        category_data: '📊 Data',
        category_text: '📝 Text',
        category_utils: '🔧 Utils',
        category_ai: '🤖 AI',
        category_files: '📁 Files',
        category_converters: '🔄 Converters',
        category_generators: '✨ Generators',
        
        // Timer
        timer_title: '⏰ Timer',
        timer_start: 'Start',
        timer_stop: 'Stop',
        timer_reset: 'Reset',
        
        // Colors
        colors_title: '🎨 Recent Colors',
        
        // Modals
        modal_settings: '⚙️ Settings',
        modal_favorites: '⭐ Edit Quick Access',
        modal_notes: '📝 Note Editor',
        
        // Settings
        settings_appearance: '🎨 Appearance',
        settings_language: '🌐 Language',
        settings_theme: 'Theme:',
        settings_lang: 'Language:',
        theme_auto: 'Auto',
        theme_light: 'Light',
        theme_dark: 'Dark',
        lang_es: 'Español',
        lang_en: 'English',
        
        // Notes
        note_title_placeholder: 'Title',
        note_content_placeholder: 'Write your note...',
        note_no_notes: 'No notes',
        note_untitled: 'Untitled',
        
        // Favorites
        favorites_description: 'Select up to 8 tools for quick access:',
        
        // Messages
        msg_capture_started: 'Capture started',
        msg_note_saved: 'Note saved',
        msg_note_deleted: 'Note deleted',
        msg_note_empty: 'Note must have title or content',
        msg_favorites_saved: 'Favorites saved',
        msg_settings_saved: 'Settings saved',
        msg_color_copied: 'Color {color} copied',
        msg_timer_finished: '⏰ Time\'s up!',
        
        // Usage
        usage_count: '{count} uses',
        usage_today: '{count} uses today'
    }
};

// Get browser language
export function getBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('es') ? 'es' : 'en';
}

// Get current language from storage or browser
export async function getCurrentLanguage() {
    try {
        const data = await chrome.storage.local.get('settings');
        return data.settings?.language || getBrowserLanguage();
    } catch {
        return getBrowserLanguage();
    }
}

// Set language
export async function setLanguage(lang) {
    try {
        const data = await chrome.storage.local.get('settings');
        const settings = data.settings || {};
        settings.language = lang;
        await chrome.storage.local.set({ settings });
        return true;
    } catch {
        return false;
    }
}

// Get translation
export function t(key, params = {}, lang = null) {
    const currentLang = lang || 'es'; // Default to Spanish
    let text = translations[currentLang]?.[key] || translations['es']?.[key] || key;
    
    // Replace params
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

// Get category name
export function getCategoryName(category, lang = 'es') {
    const key = `category_${category.toLowerCase()}`;
    return t(key, {}, lang);
}

// Initialize i18n
export async function initI18n() {
    const lang = await getCurrentLanguage();
    return lang;
}

export default { t, getCategoryName, initI18n, getCurrentLanguage, getBrowserLanguage };
