const fs = require('fs').promises;
const path = require('path');

const siteConfig = require('../site-config.json');
const projectRoot = path.join(__dirname, '..', 'web');
const buildDir = path.join(__dirname, '..', 'build');
const templatePath = path.join(buildDir, 'templates', 'category-base.html');
const fasttoolsDataPath = path.join(buildDir, 'data', 'fasttools-data.json');

async function generateCategoryPages() {
    console.log('🎯 Generando páginas de categorías...\n');

    const template = await fs.readFile(templatePath, 'utf8');
    const fasttoolsData = JSON.parse(await fs.readFile(fasttoolsDataPath, 'utf8'));
    const categories = fasttoolsData.audiences.map(aud => ({
        id: aud.id,
        slug: aud.slug,
        icon: aud.icon,
        name: aud.name,
        description: aud.description,
        tools: aud.tools
    }));

    for (const category of categories) {
        const toolIds = category.tools || [];

        for (const lang of siteConfig.languages) {
            // Get tools from unified index and translate
            const categoryTools = fasttoolsData.tools
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
                "name": `${category.name[lang]} - FastTools`,
                "description": category.description[lang],
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
            html = html.replace(/{{category_name}}/g, category.name[lang]);
            html = html.replace(/{{category_description}}/g, category.description[lang]);
            html = html.replace(/{{meta_description}}/g, category.description[lang]);
            html = html.replace(/{{category_icon}}/g, category.icon);
            html = html.replace(/{{tools_grid}}/g, toolsGrid);
            html = html.replace(/{{view_all_tools}}/g, lang === 'es' ? 'Ver todas las herramientas' : 'View all tools');
            html = html.replace(/{{css_path}}/g, lang === siteConfig.defaultLanguage ? '' : '../');
            html = html.replace(/{{home_path}}/g, lang === siteConfig.defaultLanguage ? '/' : '/' + lang + '/');
            html = html.replace(/{{hreflang_tags}}/g, '');
            html = html.replace(/{{schema_org}}/g, JSON.stringify(schemaOrg, null, 2));

            const outputDir = lang === siteConfig.defaultLanguage ? projectRoot : path.join(projectRoot, lang);
            const categorySlug = typeof category.slug === 'string' ? category.slug : category.slug[lang];
            const fileName = `${categorySlug}.html`;
            const outputPath = path.join(outputDir, fileName);

            await fs.writeFile(outputPath, html, 'utf8');
            console.log(`✅ ${lang}/${fileName}`);
        }
    }

    console.log('\n✨ Páginas de categorías generadas!');
}

generateCategoryPages().catch(console.error);
