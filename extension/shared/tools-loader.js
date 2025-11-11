// FastTools Extension - Tools Loader

const BASE_URL = 'https://fasttools-nine.vercel.app';

// Local tools (no web URL)
const LOCAL_TOOLS = [
    {
        title: 'Captura de Pantalla',
        slug: 'local://capture',
        description: 'Captura y anota pantallas',
        category: 'Utilidades',
        icon: '📸',
        local: true
    },
    {
        title: 'Notas Rápidas',
        slug: 'local://notes',
        description: 'Toma notas rápidas',
        category: 'Utilidades',
        icon: '📝',
        local: true
    }
];

// Load tools from JSON
export async function loadTools() {
    try {
        const response = await fetch(chrome.runtime.getURL('data/tools-index.json'));
        const webTools = await response.json();
        
        // Add full URL to web tools
        const toolsWithUrls = webTools.map(tool => ({
            ...tool,
            url: `${BASE_URL}/${tool.slug}`,
            local: false
        }));
        
        // Combine local + web tools
        return [...LOCAL_TOOLS, ...toolsWithUrls];
    } catch (error) {
        console.error('Error loading tools:', error);
        return LOCAL_TOOLS;
    }
}

// Get tool by ID
export function getToolById(tools, id) {
    // Handle local tools
    if (id === 'capture') return tools.find(t => t.slug === 'local://capture');
    if (id === 'notes') return tools.find(t => t.slug === 'local://notes');
    
    // Handle web tools
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
