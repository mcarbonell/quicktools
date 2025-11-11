const fs = require('fs').promises;
const path = require('path');

const siteConfig = require('../site-config.json');
const projectRoot = path.join(__dirname, '..', 'web');
const templatePath = path.join(projectRoot, 'templates', 'category-base.html');
const audienceMappingPath = path.join(projectRoot, 'data', 'audience-mapping.json');
const toolsIndexPath = path.join(projectRoot, 'data', 'tools-index-unified.json');

const categories = [
    { id: 'developers', slug: { es: 'desarrolladores', en: 'developers' }, icon: '💻' },
    { id: 'designers', slug: { es: 'disenadores', en: 'designers' }, icon: '🎨' },
    { id: 'writers', slug: { es: 'escritores', en: 'writers' }, icon: '✍️' },
    { id: 'data-analysts', slug: { es: 'analistas-datos', en: 'data-analysts' }, icon: '📊' },
    { id: 'marketers', slug: { es: 'marketing', en: 'marketers' }, icon: '📱' },
    { id: 'productivity', slug: { es: 'productividad', en: 'productivity' }, icon: '⚡' },
    { id: 'ai-tools', slug: { es: 'ia', en: 'ai' }, icon: '🤖' }
];

const categoryNames = {
    developers: { es: 'Desarrolladores', en: 'Developers' },
    designers: { es: 'Diseñadores', en: 'Designers' },
    writers: { es: 'Escritores', en: 'Writers' },
    'data-analysts': { es: 'Analistas de Datos', en: 'Data Analysts' },
    marketers: { es: 'Marketing', en: 'Marketers' },
    productivity: { es: 'Productividad', en: 'Productivity' },
    'ai-tools': { es: 'IA', en: 'AI' }
};

const categoryDescriptions = {
    developers: { 
        es: 'Herramientas esenciales para programadores y desarrolladores web', 
        en: 'Essential tools for programmers and web developers' 
    },
    designers: { 
        es: 'Herramientas para diseñadores gráficos y creativos', 
        en: 'Tools for graphic designers and creatives' 
    },
    writers: { 
        es: 'Herramientas para escritores, editores y creadores de contenido', 
        en: 'Tools for writers, editors and content creators' 
    },
    'data-analysts': { 
        es: 'Herramientas para análisis y conversión de datos', 
        en: 'Tools for data analysis and conversion' 
    },
    marketers: { 
        es: 'Herramientas para profesionales del marketing digital', 
        en: 'Tools for digital marketing professionals' 
    },
    productivity: { 
        es: 'Herramientas para mejorar tu productividad diaria', 
        en: 'Tools to improve your daily productivity' 
    },
    'ai-tools': { 
        es: 'Herramientas potenciadas con inteligencia artificial', 
        en: 'AI-powered tools' 
    }
};

async function generateCategoryPages() {
    console.log('🎯 Generando páginas de categorías...\n');

    const template = await fs.readFile(templatePath, 'utf8');
    const audienceMapping = JSON.parse(await fs.readFile(audienceMappingPath, 'utf8'));
    const toolsData = JSON.parse(await fs.readFile(toolsIndexPath, 'utf8'));

    for (const category of categories) {
        const toolIds = audienceMapping[category.id] || [];

        for (const lang of siteConfig.languages) {
            const toolsIndexLangPath = path.join(projectRoot, 'data', `tools-index-${lang}.json`);
            const toolsIndex = JSON.parse(await fs.readFile(toolsIndexLangPath, 'utf8'));

            const categoryTools = toolsIndex.filter(tool => toolIds.includes(tool.id));

            let toolsGrid = '';
            categoryTools.forEach(tool => {
                const toolUrl = lang === siteConfig.defaultLanguage ? tool.slug : tool.slug;
                toolsGrid += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${tool.icon} ${tool.title}</h5>
                        <p class="card-text">${tool.description}</p>
                        <a href="${lang === siteConfig.defaultLanguage ? '/' : '/' + lang + '/'}${toolUrl}" class="btn btn-primary">${lang === 'es' ? 'Abrir' : 'Open'}</a>
                    </div>
                </div>
            </div>`;
            });

            let html = template;
            html = html.replace(/{{lang}}/g, lang);
            html = html.replace(/{{category_name}}/g, categoryNames[category.id][lang]);
            html = html.replace(/{{category_description}}/g, categoryDescriptions[category.id][lang]);
            html = html.replace(/{{category_icon}}/g, category.icon);
            html = html.replace(/{{tools_grid}}/g, toolsGrid);
            html = html.replace(/{{view_all_tools}}/g, lang === 'es' ? 'Ver todas las herramientas' : 'View all tools');
            html = html.replace(/{{css_path}}/g, lang === siteConfig.defaultLanguage ? '' : '../');
            html = html.replace(/{{home_path}}/g, lang === siteConfig.defaultLanguage ? '/' : '/' + lang + '/');
            html = html.replace(/{{hreflang_tags}}/g, '');

            const outputDir = lang === siteConfig.defaultLanguage ? projectRoot : path.join(projectRoot, lang);
            const fileName = `${category.slug[lang]}.html`;
            const outputPath = path.join(outputDir, fileName);

            await fs.writeFile(outputPath, html, 'utf8');
            console.log(`✅ ${lang}/${fileName}`);
        }
    }

    console.log('\n✨ Páginas de categorías generadas!');
}

generateCategoryPages().catch(console.error);
