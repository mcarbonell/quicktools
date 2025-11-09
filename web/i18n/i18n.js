/**
 * Simple i18n system for QuickTools
 * Usage: i18n.t('common.title') → "QuickTools"
 */
class I18n {
  constructor() {
    this.locale = this.detectLocale();
    this.translations = {};
    this.fallbackLocale = 'en';
  }

  detectLocale() {
    // 1. Check localStorage
    const stored = localStorage.getItem('qt_locale');
    if (stored && ['en', 'es'].includes(stored)) return stored;
    
    // 2. Check browser language
    const browser = navigator.language.split('-')[0];
    if (['en', 'es'].includes(browser)) return browser;
    
    // 3. Default to English
    return 'en';
  }

  async load(locale = null) {
    const targetLocale = locale || this.locale;
    
    try {
      const response = await fetch(`/i18n/${targetLocale}.json`);
      if (!response.ok) throw new Error(`Failed to load ${targetLocale}`);
      
      this.translations = await response.json();
      this.locale = targetLocale;
      localStorage.setItem('qt_locale', targetLocale);
      
      // Update HTML lang attribute
      document.documentElement.lang = targetLocale;
      
      // Dispatch event for components to update
      window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale: targetLocale } }));
      
      return true;
    } catch (error) {
      console.error('i18n load error:', error);
      
      // Try fallback
      if (targetLocale !== this.fallbackLocale) {
        return this.load(this.fallbackLocale);
      }
      
      return false;
    }
  }

  t(key, params = {}) {
    // Navigate through nested object using dot notation
    const value = key.split('.').reduce((obj, k) => obj?.[k], this.translations);
    
    if (!value) {
      console.warn(`Translation missing: ${key}`);
      return key;
    }
    
    // Replace parameters {{param}}
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => params[param] || match);
  }

  getCurrentLocale() {
    return this.locale;
  }

  getAvailableLocales() {
    return ['en', 'es'];
  }
}

// Global instance
const i18n = new I18n();

// Auto-load on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.load());
} else {
  i18n.load();
}
