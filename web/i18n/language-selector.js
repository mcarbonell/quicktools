/**
 * Language Selector Component
 * Creates a dropdown to switch between languages
 */
class LanguageSelector {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }
    
    this.render();
    this.attachListeners();
  }

  detectCurrentLocale() {
    // Detect from URL path
    const path = window.location.pathname;
    if (path.startsWith('/es/')) return 'es';
    // Add more languages here as needed
    return 'en'; // default
  }

  async render() {
    const locales = await this.getLocales();
    const currentLocale = this.detectCurrentLocale();
    const current = locales.find(l => l.code === currentLocale) || locales[0];

    this.container.innerHTML = `
      <div class="language-selector dropdown">
        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                type="button" 
                id="languageDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false">
          <span class="flag">${current.flag}</span>
          <span class="name">${current.nativeName}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
          ${locales.map(locale => `
            <li>
              <a class="dropdown-item ${locale.code === currentLocale ? 'active' : ''}" 
                 href="#" 
                 data-locale="${locale.code}">
                <span class="flag">${locale.flag}</span>
                <span class="name">${locale.nativeName}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  async getLocales() {
    try {
      const response = await fetch('/i18n/locales.json');
      const data = await response.json();
      return data.locales;
    } catch (error) {
      console.error('Failed to load locales:', error);
      return [
        { code: 'en', nativeName: 'English', flag: '🇬🇧' },
        { code: 'es', nativeName: 'Español', flag: '🇪🇸' }
      ];
    }
  }

  attachListeners() {
    this.container.addEventListener('click', (e) => {
      const link = e.target.closest('[data-locale]');
      if (!link) return;
      
      e.preventDefault();
      const targetLocale = link.dataset.locale;
      const currentLocale = this.detectCurrentLocale();
      
      if (targetLocale !== currentLocale) {
        const newUrl = this.getUrlForLocale(targetLocale);
        window.location.href = newUrl;
      }
    });
  }

  getUrlForLocale(locale) {
    const currentPath = window.location.pathname;
    const currentLocale = this.detectCurrentLocale();
    
    // If switching to default language (en), remove language prefix
    if (locale === 'en') {
      if (currentLocale === 'en') return currentPath;
      // Remove /es/ prefix
      return currentPath.replace(/^\/es\//, '/');
    }
    
    // If switching to non-default language
    if (currentLocale === 'en') {
      // Add language prefix
      return `/${locale}${currentPath}`;
    } else {
      // Replace language prefix
      return currentPath.replace(/^\/[a-z]{2}\//, `/${locale}/`);
    }
  }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('languageSelector');
  if (container) {
    new LanguageSelector('languageSelector');
  }
});
