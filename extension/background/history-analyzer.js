// ====================
// HISTORY ANALYZER
// ====================

/**
 * Analiza el historial de navegación y genera estadísticas
 */
class HistoryAnalyzer {
    constructor() {
        this.cache = null;
        this.cacheTimestamp = null;
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    }

    /**
     * Obtiene y analiza el historial de los últimos N días
     */
    async analyzeHistory(days = 30) {
        console.log('🔍 Analizando historial de los últimos', days, 'días...');

        // Usar caché si está disponible y es reciente
        if (this.cache && this.cacheTimestamp && (Date.now() - this.cacheTimestamp < this.CACHE_DURATION)) {
            console.log('✅ Usando caché de historial');
            return this.cache;
        }

        const startTime = Date.now() - (days * 24 * 60 * 60 * 1000);
        
        try {
            const historyItems = await chrome.history.search({
                text: '',
                startTime: startTime,
                maxResults: 10000
            });

            console.log('📊 Historial obtenido:', historyItems.length, 'items');

            const analysis = this.processHistory(historyItems);
            
            // Guardar en caché
            this.cache = analysis;
            this.cacheTimestamp = Date.now();

            return analysis;
        } catch (error) {
            console.error('❌ Error analizando historial:', error);
            throw error;
        }
    }

    /**
     * Procesa el historial y genera estadísticas por dominio
     */
    processHistory(historyItems) {
        const domainStats = {};
        let totalVisits = 0;

        historyItems.forEach(item => {
            try {
                const url = new URL(item.url);
                const domain = url.hostname.replace('www.', '');

                // Ignorar dominios internos y comunes
                if (this.shouldIgnoreDomain(domain)) {
                    return;
                }

                if (!domainStats[domain]) {
                    domainStats[domain] = {
                        domain: domain,
                        visits: 0,
                        totalTime: 0,
                        lastVisit: 0,
                        urls: new Set()
                    };
                }

                domainStats[domain].visits += item.visitCount || 1;
                domainStats[domain].lastVisit = Math.max(domainStats[domain].lastVisit, item.lastVisitTime || 0);
                domainStats[domain].urls.add(item.url);
                totalVisits += item.visitCount || 1;
            } catch (error) {
                // Ignorar URLs inválidas
            }
        });

        // Convertir a array y ordenar por visitas
        const sortedDomains = Object.values(domainStats)
            .map(stat => ({
                ...stat,
                urls: stat.urls.size,
                avgTimePerVisit: stat.totalTime / stat.visits || 0
            }))
            .sort((a, b) => b.visits - a.visits);

        return {
            totalVisits: totalVisits,
            uniqueDomains: sortedDomains.length,
            topDomains: sortedDomains.slice(0, 50),
            timestamp: Date.now()
        };
    }

    /**
     * Dominios a ignorar (internos, extensiones, etc.)
     */
    shouldIgnoreDomain(domain) {
        const ignoredPatterns = [
            'chrome://',
            'chrome-extension://',
            'localhost',
            '127.0.0.1',
            'newtab',
            'extensions'
        ];

        return ignoredPatterns.some(pattern => domain.includes(pattern));
    }

    /**
     * Genera un resumen formateado para la IA
     */
    formatForAI(analysis, topN = 25) {
        const topDomains = analysis.topDomains.slice(0, topN);
        
        let formatted = `TOP ${topN} SITIOS MÁS VISITADOS:\n`;
        topDomains.forEach((domain, index) => {
            formatted += `${index + 1}. ${domain.domain} - ${domain.visits} visitas, ${domain.urls} páginas únicas\n`;
        });

        formatted += `\nMÉTRICAS GENERALES:\n`;
        formatted += `- Total sitios únicos: ${analysis.uniqueDomains}\n`;
        formatted += `- Total visitas: ${analysis.totalVisits}\n`;

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
const historyAnalyzer = new HistoryAnalyzer();
