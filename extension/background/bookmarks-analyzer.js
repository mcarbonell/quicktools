// ====================
// BOOKMARKS ANALYZER
// ====================

/**
 * Analiza los marcadores del usuario
 */
class BookmarksAnalyzer {
    constructor() {
        this.cache = null;
        this.cacheTimestamp = null;
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    }

    /**
     * Analiza todos los bookmarks del usuario
     */
    async analyzeBookmarks() {
        console.log('🔖 Analizando marcadores...');

        // Usar caché si está disponible
        if (this.cache && this.cacheTimestamp && (Date.now() - this.cacheTimestamp < this.CACHE_DURATION)) {
            console.log('✅ Usando caché de bookmarks');
            return this.cache;
        }

        try {
            const tree = await chrome.bookmarks.getTree();
            const bookmarks = this.extractBookmarks(tree);
            
            const analysis = this.processBookmarks(bookmarks);
            
            // Guardar en caché
            this.cache = analysis;
            this.cacheTimestamp = Date.now();

            console.log('📊 Bookmarks analizados:', analysis.totalBookmarks);
            return analysis;
        } catch (error) {
            console.error('❌ Error analizando bookmarks:', error);
            return { totalBookmarks: 0, domains: [], urls: [] };
        }
    }

    /**
     * Extrae recursivamente todos los bookmarks del árbol
     */
    extractBookmarks(nodes, bookmarks = []) {
        for (const node of nodes) {
            if (node.url) {
                bookmarks.push({
                    url: node.url,
                    title: node.title,
                    dateAdded: node.dateAdded
                });
            }
            if (node.children) {
                this.extractBookmarks(node.children, bookmarks);
            }
        }
        return bookmarks;
    }

    /**
     * Procesa bookmarks y genera estadísticas
     */
    processBookmarks(bookmarks) {
        const domainStats = {};
        const urls = [];

        bookmarks.forEach(bookmark => {
            try {
                const url = new URL(bookmark.url);
                const domain = url.hostname.replace('www.', '');

                if (this.shouldIgnoreDomain(domain)) {
                    return;
                }

                urls.push(bookmark.url);

                if (!domainStats[domain]) {
                    domainStats[domain] = {
                        domain: domain,
                        count: 0,
                        titles: []
                    };
                }

                domainStats[domain].count++;
                domainStats[domain].titles.push(bookmark.title);
            } catch (error) {
                // Ignorar URLs inválidas
            }
        });

        const sortedDomains = Object.values(domainStats)
            .sort((a, b) => b.count - a.count);

        return {
            totalBookmarks: bookmarks.length,
            uniqueDomains: sortedDomains.length,
            domains: sortedDomains.slice(0, 30),
            urls: urls,
            timestamp: Date.now()
        };
    }

    /**
     * Dominios a ignorar
     */
    shouldIgnoreDomain(domain) {
        const ignoredPatterns = [
            'chrome://',
            'chrome-extension://',
            'localhost',
            '127.0.0.1'
        ];
        return ignoredPatterns.some(pattern => domain.includes(pattern));
    }

    /**
     * Formatea para la IA
     */
    formatForAI(analysis, topN = 15) {
        if (analysis.totalBookmarks === 0) {
            return 'No hay bookmarks guardados.';
        }

        const topDomains = analysis.domains.slice(0, topN);
        
        let formatted = `TOP ${topN} SITIOS EN BOOKMARKS:\n`;
        topDomains.forEach((domain, index) => {
            formatted += `${index + 1}. ${domain.domain} - ${domain.count} bookmarks\n`;
        });

        formatted += `\nMÉTRICAS:\n`;
        formatted += `- Total bookmarks: ${analysis.totalBookmarks}\n`;
        formatted += `- Dominios únicos: ${analysis.uniqueDomains}\n`;

        return formatted;
    }

    /**
     * Limpia la caché
     */
    clearCache() {
        this.cache = null;
        this.cacheTimestamp = null;
    }
}

// Exportar instancia singleton
const bookmarksAnalyzer = new BookmarksAnalyzer();
