// ====================
// AI OFFSCREEN DOCUMENT
// ====================

console.log('🤖 AI Offscreen document loaded');
console.log('Checking AI availability:', {
    hasLanguageModel: typeof LanguageModel !== 'undefined'
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.target !== 'ai-offscreen') return;

    console.log('📨 AI Offscreen received:', request.action);

    switch (request.action) {
        case 'infer-profile':
            inferProfile(request.historyAnalysis).then(sendResponse);
            return true;
        case 'generate-recommendations':
            generateRecommendations(request.profile, request.historyAnalysis, request.currentUrl).then(sendResponse);
            return true;
    }
});

async function inferProfile(historyAnalysis) {
    try {
        if (typeof LanguageModel === 'undefined') {
            throw new Error('Chrome AI no disponible. Asegúrate de tener Chrome 127+ con Gemini Nano habilitado.');
        }
        
        const availability = await LanguageModel.availability();
        console.log('🤖 Chrome AI availability:', availability);
        
        if (availability === 'unavailable') {
            throw new Error('IA no disponible');
        }

        const browserLang = navigator.language.split('-')[0];
        const outputLang = ['en', 'es', 'ja'].includes(browserLang) ? browserLang : 'en';
        
        const session = await LanguageModel.create({
            systemPrompt: 'Eres un experto en análisis de comportamiento web y perfiles de usuario. Analiza historiales de navegación y genera perfiles precisos.',
            expectedOutputs: [{ type: 'text', languages: [outputLang] }]
        });

        const prompt = buildProfilePrompt(historyAnalysis);
        
        const schema = {
            type: 'object',
            properties: {
                role: { type: 'string' },
                level: { type: 'string', enum: ['junior', 'mid', 'senior', 'expert'] },
                interests: { type: 'array', items: { type: 'string' } },
                stack: { type: 'array', items: { type: 'string' } },
                language: { type: 'string', enum: ['es', 'en', 'pt', 'fr', 'de', 'ja'] },
                workStyle: { type: 'string' },
                hobbies: { type: 'array', items: { type: 'string' } },
                gender: { type: 'string', enum: ['male', 'female', 'unknown'] },
                ageRange: { type: 'string', enum: ['18-25', '26-35', '36-45', '46+'] }
            },
            required: ['role', 'level', 'interests', 'stack', 'language', 'workStyle']
        };
        
        const response = await session.prompt(prompt, { responseConstraint: schema });
        
        console.log('💬 RESPUESTA DE IA (JSON estructurado):');
        console.log(response);
        
        // Decodificar HTML entities
        const decoded = response
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');

        const profile = JSON.parse(decoded);
        console.log('✅ PERFIL PARSEADO:');
        console.log(profile);
        
        session.destroy();

        return { success: true, profile };
    } catch (error) {
        console.error('❌ Error infiriendo perfil:', error);
        return { success: false, error: error.message };
    }
}

async function generateRecommendations(profile, historyAnalysis, currentUrl) {
    try {
        if (typeof LanguageModel === 'undefined') {
            throw new Error('Chrome AI no disponible');
        }
        
        const availability = await LanguageModel.availability();
        if (availability === 'unavailable') {
            throw new Error('IA no disponible');
        }

        const session = await LanguageModel.create();
        const prompt = buildRecommendationsPrompt(profile, historyAnalysis, currentUrl);
        const response = await session.prompt(prompt);

        session.destroy();

        return { success: true, recommendations: response };
    } catch (error) {
        console.error('❌ Error generando recomendaciones:', error);
        return { success: false, error: error.message };
    }
}

function buildProfilePrompt(combinedData) {
    const historyAnalysis = combinedData.history || combinedData;
    const bookmarksAnalysis = combinedData.bookmarks;
    
    let formatted = '';
    
    // Historial
    if (historyAnalysis && historyAnalysis.topDomains) {
        const topDomains = historyAnalysis.topDomains.slice(0, 25);
        formatted += `TOP 25 SITIOS MÁS VISITADOS:\n`;
        topDomains.forEach((domain, index) => {
            formatted += `${index + 1}. ${domain.domain} - ${domain.visits} visitas\n`;
        });
        formatted += `\nMÉTRICAS HISTORIAL:\n`;
        formatted += `- Total sitios únicos: ${historyAnalysis.uniqueDomains}\n`;
        formatted += `- Total visitas: ${historyAnalysis.totalVisits}\n`;
    }
    
    // Bookmarks
    if (bookmarksAnalysis && bookmarksAnalysis.totalBookmarks > 0) {
        const topBookmarks = bookmarksAnalysis.domains.slice(0, 15);
        formatted += `\nTOP 15 SITIOS EN BOOKMARKS:\n`;
        topBookmarks.forEach((domain, index) => {
            formatted += `${index + 1}. ${domain.domain} - ${domain.count} bookmarks\n`;
        });
        formatted += `\nMÉTRICAS BOOKMARKS:\n`;
        formatted += `- Total bookmarks: ${bookmarksAnalysis.totalBookmarks}\n`;
        formatted += `- Dominios únicos: ${bookmarksAnalysis.uniqueDomains}\n`;
    }

    const prompt = `Analiza este historial de navegación y bookmarks para generar un perfil completo del usuario.

${formatted}

Genera un perfil profesional detallado con:
- role: Descripción del rol/profesión
- level: junior/mid/senior/expert
- interests: Array de intereses profesionales
- stack: Array de tecnologías/herramientas
- language: Idioma principal (es/en/pt/fr/de)
- workStyle: Estilo de trabajo
- hobbies: Array de hobbies detectados (opcional)
- gender: male/female/unknown (opcional)
- ageRange: 18-25/26-35/36-45/46+ (opcional)`;
    
    console.log('📝 PROMPT ENVIADO A IA:');
    console.log(prompt);
    
    return prompt;
}

function buildRecommendationsPrompt(profile, historyAnalysis, currentUrl) {
    const visitedDomains = historyAnalysis.topDomains.map(d => d.domain);
    
    let prompt = `Perfil del usuario:
- Rol: ${profile.profile}
- Nivel: ${profile.level}
- Intereses: ${profile.interests.join(', ')}
- Stack: ${profile.stack.join(', ')}

Sitios que ya visita frecuentemente:
${visitedDomains.slice(0, 20).join(', ')}
`;

    if (currentUrl) {
        prompt += `\nSitio actual: ${currentUrl}\n`;
        prompt += `\nRecomienda 5 sitios similares o complementarios que el usuario probablemente NO conozca.`;
    } else {
        prompt += `\nRecomienda 10 sitios web que el usuario probablemente NO conozca pero le serían muy útiles.`;
    }

    prompt += `\n\nFormato requerido (usa EXACTAMENTE este formato):

[Nombre del Sitio](https://url-completa.com) - Descripción breve en una línea.

Ejemplo:
[GitHub](https://github.com) - Plataforma de desarrollo colaborativo para alojar y revisar código.

NO incluyas la URL como texto separado, solo en el enlace markdown.`;

    return prompt;
}


