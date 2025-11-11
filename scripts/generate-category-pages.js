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
    { id: 'ai-tools', slug: { es: 'ia', en: 'ai' }, icon: '🤖' },
    { id: 'seo-specialists', slug: { es: 'seo', en: 'seo' }, icon: '🔍' }
];

const categoryNames = {
    developers: { es: 'Desarrolladores', en: 'Developers' },
    designers: { es: 'Diseñadores', en: 'Designers' },
    writers: { es: 'Escritores', en: 'Writers' },
    'data-analysts': { es: 'Analistas de Datos', en: 'Data Analysts' },
    marketers: { es: 'Marketing', en: 'Marketers' },
    productivity: { es: 'Productividad', en: 'Productivity' },
    'ai-tools': { es: 'IA', en: 'AI' },
    'seo-specialists': { es: 'Especialistas SEO', en: 'SEO Specialists' }
};

const categoryDescriptions = {
    developers: { 
        es: 'Herramientas esenciales para programadores y desarrolladores web: formatear JSON, convertir datos, codificar URLs y más. 100% gratis y privado.', 
        en: 'Essential tools for programmers and web developers: format JSON, convert data, encode URLs and more. 100% free and private.' 
    },
    designers: { 
        es: 'Herramientas para diseñadores gráficos: redimensionar imágenes, convertir formatos, extraer paletas de colores. Todo en tu navegador.', 
        en: 'Tools for graphic designers: resize images, convert formats, extract color palettes. Everything in your browser.' 
    },
    writers: { 
        es: 'Herramientas para escritores y editores: limpiar texto, comparar versiones, generar Lorem Ipsum, mejorar con IA. Sin registro.', 
        en: 'Tools for writers and editors: clean text, compare versions, generate Lorem Ipsum, improve with AI. No registration.' 
    },
    'data-analysts': { 
        es: 'Herramientas para analistas de datos: convertir CSV, JSON, YAML, XML, TOML. Procesamiento 100% local y seguro.', 
        en: 'Tools for data analysts: convert CSV, JSON, YAML, XML, TOML. 100% local and secure processing.' 
    },
    marketers: { 
        es: 'Herramientas para marketing digital: generar QR, optimizar imágenes, crear contenido con IA. Rápido y sin costos.', 
        en: 'Tools for digital marketing: generate QR codes, optimize images, create content with AI. Fast and free.' 
    },
    productivity: { 
        es: 'Herramientas de productividad: cronómetro, generador de contraseñas, gestión de PDFs. Aumenta tu eficiencia diaria.', 
        en: 'Productivity tools: timer, password generator, PDF management. Boost your daily efficiency.' 
    },
    'ai-tools': { 
        es: 'Herramientas con IA: chat, resumir textos, mejorar redacción, editar imágenes. Potenciadas por Google Gemini.', 
        en: 'AI-powered tools: chat, summarize texts, improve writing, edit images. Powered by Google Gemini.' 
    },
    'seo-specialists': { 
        es: 'Herramientas SEO profesionales: analizar meta tags, validar robots.txt, detectar enlaces rotos, optimizar para buscadores. Todo gratis.', 
        en: 'Professional SEO tools: analyze meta tags, validate robots.txt, detect broken links, optimize for search engines. All free.' 
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
            // Get tools from unified index and translate
            const categoryTools = toolsData.tools
                .filter(tool => toolIds.includes(tool.id))
                .map(tool => ({
                    id: tool.id,
                    title: tool.title[lang] || tool.title.en,
                    description: tool.description[lang] || tool.description.en,
                    icon: tool.icon,
                    slug: tool.slug
                }));

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

            // Generate Schema.org structured data
            const schemaOrg = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": `${categoryNames[category.id][lang]} - FastTools`,
                "description": categoryDescriptions[category.id][lang],
                "url": `https://fasttools.tools/${lang === siteConfig.defaultLanguage ? '' : lang + '/'}${category.slug[lang]}.html`,
                "inLanguage": lang,
                "isPartOf": {
                    "@type": "WebSite",
                    "name": "FastTools",
                    "url": "https://fasttools.tools"
                },
                "about": {
                    "@type": "SoftwareApplication",
                    "name": "FastTools",
                    "applicationCategory": "WebApplication",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    }
                }
            };

            let html = template;
            html = html.replace(/{{lang}}/g, lang);
            html = html.replace(/{{category_name}}/g, categoryNames[category.id][lang]);
            html = html.replace(/{{category_description}}/g, categoryDescriptions[category.id][lang]);
            html = html.replace(/{{meta_description}}/g, categoryDescriptions[category.id][lang]);
            html = html.replace(/{{category_icon}}/g, category.icon);
            html = html.replace(/{{tools_grid}}/g, toolsGrid);
            html = html.replace(/{{view_all_tools}}/g, lang === 'es' ? 'Ver todas las herramientas' : 'View all tools');
            html = html.replace(/{{css_path}}/g, lang === siteConfig.defaultLanguage ? '' : '../');
            html = html.replace(/{{home_path}}/g, lang === siteConfig.defaultLanguage ? '/' : '/' + lang + '/');
            html = html.replace(/{{hreflang_tags}}/g, '');
            html = html.replace(/{{schema_org}}/g, JSON.stringify(schemaOrg, null, 2));

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
