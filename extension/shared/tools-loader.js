// FastTools Extension - Tools Loader

const BASE_URL = 'https://fasttools-nine.vercel.app';

const LOCAL_TOOLS = [
    {
        id: 'capture',
        slug: 'local://capture',
        title: { es: 'Captura de Pantalla', en: 'Screen Capture' },
        description: { es: 'Captura y anota pantallas', en: 'Capture and annotate screens' },
        categories: ['utils'],
        icon: '📸',
        local: true
    },
    {
        id: 'notes',
        slug: 'local://notes',
        title: { es: 'Notas Rápidas', en: 'Quick Notes' },
        description: { es: 'Toma notas rápidas', en: 'Take quick notes' },
        categories: ['utils'],
        icon: '📝',
        local: true
    }
];

// Load tools from fasttools-data.json
export async function loadTools(lang = 'es') {
    try {
        const response = await fetch(chrome.runtime.getURL('data/fasttools-data.json'));
        const data = await response.json();
        
        // Process web tools
        const webTools = data.tools.map(tool => ({
            ...tool,
            title: tool.title[lang] || tool.title.es,
            description: tool.description[lang] || tool.description.es,
            category: tool.categories[0], // Primary category
            url: tool.slug.startsWith('tools/') 
                ? chrome.runtime.getURL(tool.slug)
                : (lang === 'es' ? `${BASE_URL}/es/${tool.slug}` : `${BASE_URL}/${tool.slug}`),
            local: tool.slug.startsWith('tools/')
        }));
        
        // Process local tools
        const localTools = LOCAL_TOOLS.map(tool => ({
            ...tool,
            title: tool.title[lang] || tool.title.es,
            description: tool.description[lang] || tool.description.es,
            category: tool.categories[0]
        }));
        
        return [...localTools, ...webTools];
    } catch (error) {
        console.error('Error loading tools:', error);
        return LOCAL_TOOLS.map(tool => ({
            ...tool,
            title: tool.title[lang] || tool.title.es,
            description: tool.description[lang] || tool.description.es,
            category: tool.categories[0]
        }));
    }
}

// Load categories
export async function loadCategories(lang = 'es') {
    try {
        const response = await fetch(chrome.runtime.getURL('data/fasttools-data.json'));
        const data = await response.json();
        
        return data.toolCategories.map(cat => ({
            ...cat,
            name: cat.name[lang] || cat.name.es,
            description: cat.description[lang] || cat.description.es
        }));
    } catch (error) {
        console.error('Error loading categories:', error);
        return [];
    }
}

// Get tool by ID
export function getToolById(tools, id) {
    if (id === 'capture') return tools.find(t => t.slug === 'local://capture');
    if (id === 'notes') return tools.find(t => t.slug === 'local://notes');
    
    return tools.find(t => {
        const toolId = t.slug.replace(/^tools\//, '').replace(/\.html$/, '').replace(/\//g, '-');
        return toolId === id || t.slug === id;
    });
}

// Filter tools by category
export function filterByCategory(tools, category) {
    if (category === 'all') return tools;
    return tools.filter(t => t.category === category);
}

// Get categories
export function getCategories(tools) {
    const categories = new Set(tools.map(t => t.category));
    return ['all', ...Array.from(categories)];
}
