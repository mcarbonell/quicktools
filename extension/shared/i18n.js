// ====================
// FASTTOOLS EXTENSION - I18N SYSTEM
// ====================

// Translation cache
let translations = {};
let currentLang = 'es';

// ====================
// LANGUAGE DETECTION
// ====================

/**
 * Get browser language
 */
export function getBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('es') ? 'es' : 'en';
}

/**
 * Get current language from storage or browser
 */
export async function getCurrentLanguage() {
    try {
        const data = await chrome.storage.local.get('settings');
        return data.settings?.language || getBrowserLanguage();
    } catch {
        return getBrowserLanguage();
    }
}

/**
 * Set language
 */
export async function setLanguage(lang) {
    try {
        const data = await chrome.storage.local.get('settings');
        const settings = data.settings || {};
        settings.language = lang;
        await chrome.storage.local.set({ settings });
        currentLang = lang;
        return true;
    } catch {
        return false;
    }
}

// ====================
// TRANSLATION LOADING
// ====================

/**
 * Load translations from JSON file
 */
async function loadTranslations(lang) {
    try {
        const response = await fetch(chrome.runtime.getURL(`i18n/${lang}.json`));
        const data = await response.json();
        translations[lang] = data;
        return data;
    } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
        return null;
    }
}

/**
 * Initialize i18n system
 */
export async function initI18n() {
    currentLang = await getCurrentLanguage();
    
    // Load current language
    await loadTranslations(currentLang);
    
    // Preload other language
    const otherLang = currentLang === 'es' ? 'en' : 'es';
    loadTranslations(otherLang);
    
    return currentLang;
}

// ====================
// TRANSLATION FUNCTIONS
// ====================

/**
 * Get translation by key
 * @param {string} key - Translation key (e.g., 'common.save' or 'popup.greeting_morning')
 * @param {object} params - Parameters to replace in translation
 * @param {string} lang - Language override
 */
export function t(key, params = {}, lang = null) {
    const useLang = lang || currentLang;
    
    // Ensure translations are loaded
    if (!translations[useLang]) {
        console.warn(`Translations not loaded for ${useLang}`);
        return key;
    }
    
    // Navigate nested keys (e.g., 'common.save' -> translations.common.save)
    const keys = key.split('.');
    let text = translations[useLang];
    
    for (const k of keys) {
        if (text && typeof text === 'object') {
            text = text[k];
        } else {
            break;
        }
    }
    
    // If not found with dots, try searching all sections for the key
    if (typeof text !== 'string' && !key.includes('.')) {
        for (const section of Object.values(translations[useLang])) {
            if (section && typeof section === 'object' && section[key]) {
                text = section[key];
                break;
            }
        }
    }
    
    // Fallback to key if not found
    if (typeof text !== 'string') {
        console.warn(`Translation not found: ${key}`);
        return key;
    }
    
    // Replace parameters
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

/**
 * Get category name
 */
export function getCategoryName(category, lang = null) {
    const useLang = lang || currentLang;
    const normalized = category.toLowerCase().replace(/-/g, '_');
    return t(`categories.${normalized}`, {}, useLang);
}

/**
 * Translate all elements with data-i18n attribute
 */
export function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = t(key);
        
        // Check if it's a placeholder
        if (element.hasAttribute('placeholder')) {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
    
    // Translate data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Translate data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });
}

// ====================
// EXPORT
// ====================

export default {
    t,
    getCategoryName,
    initI18n,
    getCurrentLanguage,
    getBrowserLanguage,
    setLanguage,
    translatePage
};
