// FastTools Extension - Tools Loader

const BASE_URL = 'https://fasttools-nine.vercel.app';

const LOCAL_TOOLS = {
    es: [
        {
            title: 'Captura de Pantalla',
            slug: 'local://capture',
            description: 'Captura y anota pantallas',
            category: 'Utils',
            icon: '📸',
            local: true
        },
        {
            title: 'Notas Rápidas',
            slug: 'local://notes',
            description: 'Toma notas rápidas',
            category: 'Utils',
            icon: '📝',
            local: true
        }
    ],
    en: [
        {
            title: 'Screen Capture',
            slug: 'local://capture',
            description: 'Capture and annotate screens',
            category: 'Utils',
            icon: '📸',
            local: true
        },
        {
            title: 'Quick Notes',
            slug: 'local://notes',
            description: 'Take quick notes',
            category: 'Utils',
            icon: '📝',
            local: true
        }
    ]
};

// Load tools from JSON
export async function loadTools(lang = 'es') {
    try {
        const filename = lang === 'en' ? 'tools-index-en.json' : 'tools-index.json';
        const response = await fetch(chrome.runtime.getURL(`data/${filename}`));
        const webTools = await response.json();
        
        // Add full URL to web tools (ES with /es/ prefix, EN without)
        const toolsWithUrls = webTools.map(tool => ({
            ...tool,
            url: lang === 'es' ? `${BASE_URL}/es/${tool.slug}` : `${BASE_URL}/${tool.slug}`,
            local: false
        }));
        
        // Combine local + web tools
        return [...(LOCAL_TOOLS[lang] || LOCAL_TOOLS.es), ...toolsWithUrls];
    } catch (error) {
        console.error('Error loading tools:', error);
        return LOCAL_TOOLS[lang] || LOCAL_TOOLS.es;
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
