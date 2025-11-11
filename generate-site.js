const fs = require('fs').promises;
const path = require('path');

// ====================
// MARKDOWN PARSER
// ====================

// Parse minimal markdown: **bold**, [link](url)
function parseMinimalMarkdown(text) {
    if (!text) return '';
    
    return text
        // Links: [text](url)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // Bold: **text**
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // Italic: *text* (optional, only if not already bold)
        .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
}

// Render SEO content section from tool translations
function renderSeoContent(seo) {
    if (!seo) return '';
    
    let html = '\n        <!-- SEO Content Section -->\n';
    html += '        <div class="seo-content mt-5 pt-4 border-top">\n';
    
    // What is section
    if (seo.whatIsTitle && seo.whatIsContent) {
        html += `            <h2 class="h4 mb-3">${seo.whatIsTitle}</h2>\n`;
        html += `            <p class="mb-4">${parseMinimalMarkdown(seo.whatIsContent)}</p>\n`;
    }
    
    // How to use section
    if (seo.howToTitle && seo.howToSteps && seo.howToSteps.length > 0) {
        html += `            <h3 class="h5 mb-3">${seo.howToTitle}</h3>\n`;
        html += '            <ol class="mb-4">\n';
        seo.howToSteps.forEach(step => {
            html += `                <li>${parseMinimalMarkdown(step)}</li>\n`;
        });
        html += '            </ol>\n';
    }
    
    // Use cases section
    if (seo.useCasesTitle && seo.useCases && seo.useCases.length > 0) {
        html += `            <h3 class="h5 mb-3">${seo.useCasesTitle}</h3>\n`;
        html += '            <ul class="mb-4">\n';
        seo.useCases.forEach(useCase => {
            html += `                <li>${parseMinimalMarkdown(useCase)}</li>\n`;
        });
        html += '            </ul>\n';
    }
    
    // FAQ section
    if (seo.faqTitle && seo.faq && seo.faq.length > 0) {
        html += `            <h3 class="h5 mb-3">${seo.faqTitle}</h3>\n`;
        html += '            <div class="accordion" id="faqAccordion">\n';
        seo.faq.forEach((item, index) => {
            const collapseId = `faqCollapse${index}`;
            const headingId = `faqHeading${index}`;
            html += `                <div class="accordion-item">\n`;
            html += `                    <h4 class="accordion-header" id="${headingId}">\n`;
            html += `                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">\n`;
            html += `                            ${item.question}\n`;
            html += `                        </button>\n`;
            html += `                    </h4>\n`;
            html += `                    <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#faqAccordion">\n`;
            html += `                        <div class="accordion-body">\n`;
            html += `                            ${parseMinimalMarkdown(item.answer)}\n`;
            html += `                        </div>\n`;
            html += `                    </div>\n`;
            html += `                </div>\n`;
        });
        html += '            </div>\n';
    }
    
    html += '        </div>\n';
    
    return html;
}

// Load site configuration
const siteConfig = require('./site-config.json');
const projectRoot = path.join(__dirname, 'web');
const templatesDir = path.join(projectRoot, 'templates');
const toolsContentDir = path.join(templatesDir, 'tools-content');
const dataDir = path.join(projectRoot, 'data');
const i18nDir = path.join(projectRoot, 'i18n');
const baseTemplatePath = path.join(templatesDir, 'base.html');
const indexTemplatePath = path.join(templatesDir, 'index-base.html');
const toolsIndexPath = path.join(dataDir, 'tools-index-es.json'); // Using Spanish as base for iteration

// Load translations
async function loadTranslations(lang) {
    const translationPath = path.join(i18nDir, `${lang}.json`);
    return JSON.parse(await fs.readFile(translationPath, 'utf8'));
}

// Generate hreflang tags
function generateHreflangTags(slug, isIndex = false) {
    const baseUrl = `https://${siteConfig.domain}`;
    let tags = '';
    
    siteConfig.languages.forEach(lang => {
        const url = lang === siteConfig.defaultLanguage 
            ? `${baseUrl}/${isIndex ? '' : slug}`
            : `${baseUrl}/${lang}/${isIndex ? '' : slug}`;
        tags += `    <link rel="alternate" hreflang="${lang}" href="${url}">\n`;
    });
    
    // x-default points to default language
    const defaultUrl = `${baseUrl}/${isIndex ? '' : slug}`;
    tags += `    <link rel="alternate" hreflang="x-default" href="${defaultUrl}">\n`;
    
    return tags;
}

// Generate index.html for a specific language
async function generateIndex(toolsIndex, lang) {
    console.log(`Generando index.html para idioma: ${lang}...`);
    
    const translations = await loadTranslations(lang);
    
    // Load translated tools index
    const toolsIndexPath = path.join(dataDir, `tools-index-${lang}.json`);
    const translatedTools = JSON.parse(await fs.readFile(toolsIndexPath, 'utf8'));
    const indexTemplate = await fs.readFile(indexTemplatePath, 'utf8');
    
    // Generate category links
    const categories = [
        { id: 'developers', slug: { es: 'desarrolladores', en: 'developers' }, icon: '💻', name: { es: 'Desarrolladores', en: 'Developers' } },
        { id: 'designers', slug: { es: 'disenadores', en: 'designers' }, icon: '🎨', name: { es: 'Diseñadores', en: 'Designers' } },
        { id: 'writers', slug: { es: 'escritores', en: 'writers' }, icon: '✍️', name: { es: 'Escritores', en: 'Writers' } },
        { id: 'data-analysts', slug: { es: 'analistas-datos', en: 'data-analysts' }, icon: '📊', name: { es: 'Analistas de Datos', en: 'Data Analysts' } },
        { id: 'marketers', slug: { es: 'marketing', en: 'marketers' }, icon: '📱', name: { es: 'Marketing', en: 'Marketers' } },
        { id: 'productivity', slug: { es: 'productividad', en: 'productivity' }, icon: '⚡', name: { es: 'Productividad', en: 'Productivity' } },
        { id: 'ai-tools', slug: { es: 'ia', en: 'ai' }, icon: '🤖', name: { es: 'IA', en: 'AI' } }
    ];
    
    let categoryLinks = '';
    categories.forEach(cat => {
        categoryLinks += `<a href="${cat.slug[lang]}.html" class="btn btn-outline-primary btn-sm">${cat.icon} ${cat.name[lang]}</a>\n                `;
    });
    
    // Group tools by category (use translated tools)
    const byCat = translatedTools.reduce((acc, t) => {
        (acc[t.category] = acc[t.category] || []).push(t);
        return acc;
    }, {});
    
    let toolsGridHtml = '';
    for (const [cat, items] of Object.entries(byCat)) {
        const sectionId = cat === 'IA' || cat === 'AI' ? ' id="IA"' : '';
        // Map category names
        const catMap = {
            'Imagen': 'Image', 'Image': 'Image',
            'Datos': 'Data', 'Data': 'Data',
            'Archivos': 'Files', 'Files': 'Files',
            'Texto': 'Text', 'Text': 'Text',
            'Utilidades': 'Utilities', 'Utilities': 'Utilities',
            'Conversores': 'Converters', 'Converters': 'Converters',
            'Generadores': 'Generators', 'Generators': 'Generators',
            'IA': 'AI', 'AI': 'AI'
        };
        const catKey = catMap[cat] || cat;
        const catName = cat; // Already translated in tools-index-{lang}.json
        const catEmoji = (cat === 'IA' || cat === 'AI') ? '🤖 ' : '';
        
        toolsGridHtml += `<section class="mb-4"${sectionId}>\n`;
        toolsGridHtml += `  <h3 class="h5 mb-3">${catEmoji}${catName}</h3>\n`;
        
        if (cat === 'IA') {
            toolsGridHtml += `  <div class="alert alert-info">\n`;
            toolsGridHtml += `    <strong>🔑 ${translations.ai?.apiKeyRequired || 'Requiere API Key'}:</strong> ${translations.ai?.apiKeyDescription || 'Estas herramientas usan Google Gemini.'} <a href="tools/ai/chat-ai.html" class="alert-link">${translations.ai?.configureNow || 'Configurar ahora'}</a>\n`;
            toolsGridHtml += `  </div>\n`;
        }
        
        toolsGridHtml += `  <div class="row g-4">\n`;
        
        items.forEach(item => {
            const cardClass = cat === 'IA' ? 'card h-100 border-primary' : 'card h-100';
            // For non-default languages, use relative path from /es/ directory
            const toolUrl = lang === siteConfig.defaultLanguage ? item.slug : item.slug;
            toolsGridHtml += `
    <div class="col-md-6 col-lg-4">
        <div class="${cardClass}">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description}</p>
                <a href="${toolUrl}" class="btn btn-primary">${translations.common?.openTool || 'Abrir herramienta'}</a>
            </div>
        </div>
    </div>`;
        });
        
        toolsGridHtml += `\n  </div>\n</section>\n`;
    }
    
    let finalIndexHtml = indexTemplate;
    finalIndexHtml = finalIndexHtml.replace('{{category_links}}', categoryLinks);
    finalIndexHtml = finalIndexHtml.replace('{{tools_grid}}', toolsGridHtml);
    finalIndexHtml = finalIndexHtml.replace(/lang="en"/g, `lang="${lang}"`);
    finalIndexHtml = finalIndexHtml.replace('{{hreflang_tags}}', generateHreflangTags('', true));
    
    // Replace meta tags and content with translations
    const pageTitle = lang === 'en' 
        ? 'FastTools — Fast & Secure Online Tools'
        : 'FastTools — Herramientas Online Rápidas y Seguras';
    const pageDesc = translations.hero?.subtitle || 'Fast, secure online tools. Everything processed in your browser.';
    
    finalIndexHtml = finalIndexHtml.replace(
        /<title>.*?<\/title>/,
        `<title>${pageTitle}</title>`
    );
    finalIndexHtml = finalIndexHtml.replace(
        /<meta name="description" content=".*?"/,
        `<meta name="description" content="${pageDesc}"`
    );
    
    // Replace hero content
    finalIndexHtml = finalIndexHtml.replace(
        /<h1 class="display-6" id="heroTitle">.*?<\/h1>/,
        `<h1 class="display-6" id="heroTitle">${translations.common?.title || 'FastTools'}</h1>`
    );
    finalIndexHtml = finalIndexHtml.replace(
        /<p class="lead" id="heroSubtitle">.*?<\/p>/,
        `<p class="lead" id="heroSubtitle">${translations.hero?.subtitle || 'Fast, secure online tools. Everything processed in your browser.'}</p>`
    );
    finalIndexHtml = finalIndexHtml.replace(
        /<strong id="newBadge">.*?<\/strong>/,
        `<strong id="newBadge">🎉 ${translations.hero?.newBadge || 'NEW!'}</strong>`
    );
    finalIndexHtml = finalIndexHtml.replace(
        /<span id="aiAnnouncement">.*?<\/span>/,
        `<span id="aiAnnouncement">${translations.hero?.aiToolsAnnouncement || 'AI-powered tools: Chat, summarize, edit images and more.'}</span>`
    );
    finalIndexHtml = finalIndexHtml.replace(
        /<a href="#IA" class="alert-link" id="aiLink">.*?<\/a>/,
        `<a href="#IA" class="alert-link" id="aiLink">${translations.hero?.viewAiTools || 'View AI tools →'}</a>`
    );
    
    // Replace categories title
    finalIndexHtml = finalIndexHtml.replace(
        /<h2 class="h5 mb-3" id="categoriesTitle">.*?<\/h2>/,
        `<h2 class="h5 mb-3" id="categoriesTitle">${translations.categories?.title || 'Browse by Profile'}</h2>`
    );
    
    // Replace nav
    finalIndexHtml = finalIndexHtml.replace(
        /<a class="nav-link" href="#" id="navHome">.*?<\/a>/,
        `<a class="nav-link" href="#" id="navHome">${translations.nav?.home || 'Home'}</a>`
    );
    finalIndexHtml = finalIndexHtml.replace(
        /<a class="nav-link" href="#tools" id="navTools">.*?<\/a>/,
        `<a class="nav-link" href="#tools" id="navTools">${translations.nav?.tools || 'Tools'}</a>`
    );
    
    // Replace footer
    finalIndexHtml = finalIndexHtml.replace(
        /<span id="footerTagline">.*?<\/span>/,
        `<span id="footerTagline">${translations.footer?.tagline || 'Tools in your browser'}</span>`
    );
    finalIndexHtml = finalIndexHtml.replace(
        /<a href="privacy.html" id="footerPrivacy">.*?<\/a>/,
        `<a href="privacy.html" id="footerPrivacy">${translations.footer?.links?.privacy || 'Privacy'}</a>`
    );
    finalIndexHtml = finalIndexHtml.replace(
        /<a href="#" id="footerContact">.*?<\/a>/,
        `<a href="#" id="footerContact">${translations.footer?.links?.contact || 'Contact'}</a>`
    );
    
    const outputDir = lang === siteConfig.defaultLanguage ? projectRoot : path.join(projectRoot, lang);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'index.html'), finalIndexHtml, 'utf8');
    console.log(` -> Generado: ${lang}/index.html`);
}

// Load tool-specific translations
async function loadToolTranslations(toolFileName, lang) {
    try {
        const toolTransPath = path.join(i18nDir, 'tools', `${toolFileName}.json`);
        const toolTrans = JSON.parse(await fs.readFile(toolTransPath, 'utf8'));
        return toolTrans[lang] || {};
    } catch (error) {
        return {}; // No translations available for this tool
    }
}

// Replace translation placeholders in content
function replaceTranslations(content, translations) {
    return content.replace(/\{\{t\.([\w.]+)\}\}/g, (match, key) => {
        return translations[key] || match;
    });
}

// Generate tool pages for a specific language
async function generateTools(toolsIndex, lang) {
    console.log(`\nGenerando herramientas para idioma: ${lang}...`);
    const baseTemplate = await fs.readFile(baseTemplatePath, 'utf8');
    const translations = await loadTranslations(lang);
    
    // Load audience mapping
    const audienceMappingPath = path.join(dataDir, 'audience-mapping.json');
    const audienceMapping = JSON.parse(await fs.readFile(audienceMappingPath, 'utf8'));
    
    // Category info
    const categories = [
        { id: 'developers', slug: { es: 'desarrolladores', en: 'developers' }, icon: '💻', name: { es: 'Desarrolladores', en: 'Developers' } },
        { id: 'designers', slug: { es: 'disenadores', en: 'designers' }, icon: '🎨', name: { es: 'Diseñadores', en: 'Designers' } },
        { id: 'writers', slug: { es: 'escritores', en: 'writers' }, icon: '✍️', name: { es: 'Escritores', en: 'Writers' } },
        { id: 'data-analysts', slug: { es: 'analistas-datos', en: 'data-analysts' }, icon: '📊', name: { es: 'Analistas de Datos', en: 'Data Analysts' } },
        { id: 'marketers', slug: { es: 'marketing', en: 'marketers' }, icon: '📱', name: { es: 'Marketing', en: 'Marketers' } },
        { id: 'productivity', slug: { es: 'productividad', en: 'productivity' }, icon: '⚡', name: { es: 'Productividad', en: 'Productivity' } },
        { id: 'ai-tools', slug: { es: 'ia', en: 'ai' }, icon: '🤖', name: { es: 'IA', en: 'AI' } }
    ];
    
    for (const tool of toolsIndex) {
        const toolSlug = tool.slug;
        const toolFileName = path.basename(toolSlug, '.html');
        
        const headPath = path.join(toolsContentDir, `${toolFileName}-head.html`);
        const contentPath = path.join(toolsContentDir, `${toolFileName}-content.html`);
        const scriptsPath = path.join(toolsContentDir, `${toolFileName}-scripts.html`);
        
        // Load tool translations
        const toolTranslations = await loadToolTranslations(toolFileName, lang);
        
        let headExtra = await fs.readFile(headPath, 'utf8').catch(() => '');
        let toolContent = await fs.readFile(contentPath, 'utf8').catch(() => '');
        let toolScript = await fs.readFile(scriptsPath, 'utf8').catch(() => '');
        
        // Replace translation placeholders
        headExtra = replaceTranslations(headExtra, toolTranslations);
        toolContent = replaceTranslations(toolContent, toolTranslations);
        toolScript = replaceTranslations(toolScript, toolTranslations);
        
        // Generate SEO content if available
        const seoContent = renderSeoContent(toolTranslations.seo);
        toolContent += seoContent;
        
        // Get translated tool info from tools-index
        const translatedToolsIndexPath = path.join(dataDir, `tools-index-${lang}.json`);
        const translatedToolsIndex = JSON.parse(await fs.readFile(translatedToolsIndexPath, 'utf8'));
        const translatedTool = translatedToolsIndex.find(t => t.slug === tool.slug) || tool;
        
        let generatedHtml = baseTemplate;
        generatedHtml = generatedHtml.replace(/{{title}}/g, translatedTool.title || '');
        generatedHtml = generatedHtml.replace(/{{description}}/g, translatedTool.description || '');
        generatedHtml = generatedHtml.replace(/{{keywords}}/g, tool.tags ? `<meta name="keywords" content="${tool.tags.join(', ')}">` : '');
        generatedHtml = generatedHtml.replace(/{{og_title}}/g, tool.title || '');
        generatedHtml = generatedHtml.replace(/{{og_description}}/g, tool.description || '');
        generatedHtml = generatedHtml.replace(/{{og_url}}/g, `https://${siteConfig.domain}/${lang === siteConfig.defaultLanguage ? '' : lang + '/'}${toolSlug}`);
        generatedHtml = generatedHtml.replace(/{{head_extra}}/g, headExtra);
        generatedHtml = generatedHtml.replace(/{{tool_title}}/g, translatedTool.title || '');
        generatedHtml = generatedHtml.replace(/{{tool_description}}/g, translatedTool.description || '');
        // Generate category badges
        let categoryBadges = '';
        const toolCategories = [];
        for (const [catId, toolIds] of Object.entries(audienceMapping)) {
            if (toolIds.includes(tool.id)) {
                toolCategories.push(catId);
            }
        }
        
        if (toolCategories.length > 0) {
            const usefulForText = lang === 'es' ? '🎯 Útil para:' : '🎯 Useful for:';
            categoryBadges = `<div class="alert alert-info mt-3"><small>${usefulForText} `;
            toolCategories.forEach((catId, index) => {
                const cat = categories.find(c => c.id === catId);
                if (cat) {
                    const catUrl = lang === siteConfig.defaultLanguage ? `/${cat.slug[lang]}.html` : `/${lang}/${cat.slug[lang]}.html`;
                    categoryBadges += `<a href="${catUrl}" class="badge bg-primary text-decoration-none">${cat.icon} ${cat.name[lang]}</a>`;
                    if (index < toolCategories.length - 1) categoryBadges += ' ';
                }
            });
            categoryBadges += '</small></div>';
        }
        
        generatedHtml = generatedHtml.replace(/{{category_badges}}/g, categoryBadges);
        generatedHtml = generatedHtml.replace(/{{tool_content}}/g, toolContent);
        // Inject translations as global variable for JS
        const translationsScript = `
    <script>
        window.toolTranslations = ${JSON.stringify(toolTranslations)};
    </script>`;
        
        generatedHtml = generatedHtml.replace(/{{tool_script}}/g, translationsScript + '\n' + toolScript);
        generatedHtml = generatedHtml.replace(/{{schema_org_json}}/g, '');
        generatedHtml = generatedHtml.replace(/{{body_extra}}/g, '');
        generatedHtml = generatedHtml.replace(/lang="en"/g, `lang="${lang}"`);
        generatedHtml = generatedHtml.replace('{{hreflang_tags}}', generateHreflangTags(toolSlug));
        
        const outputDir = lang === siteConfig.defaultLanguage ? projectRoot : path.join(projectRoot, lang);
        const outputFilePath = path.join(outputDir, toolSlug);
        await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
        await fs.writeFile(outputFilePath, generatedHtml, 'utf8');
        console.log(` -> Generado: ${lang}/${path.basename(outputFilePath)}`);
    }
}

// Generate sitemap.xml
async function generateSitemap(toolsIndex) {
    console.log('\nGenerando sitemap.xml...');
    
    const baseUrl = `https://${siteConfig.domain}`;
    const now = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    // Homepage for each language
    siteConfig.languages.forEach(lang => {
        const url = lang === siteConfig.defaultLanguage ? baseUrl : `${baseUrl}/${lang}`;
        xml += `  <url>\n`;
        xml += `    <loc>${url}/</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>1.0</priority>\n`;
        
        // Add xhtml:link for alternate languages
        siteConfig.languages.forEach(altLang => {
            const altUrl = altLang === siteConfig.defaultLanguage ? baseUrl : `${baseUrl}/${altLang}`;
            xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}/"/>\n`;
        });
        
        xml += `  </url>\n`;
    });
    
    // Category pages
    const categories = [
        { slug: { es: 'desarrolladores', en: 'developers' } },
        { slug: { es: 'disenadores', en: 'designers' } },
        { slug: { es: 'escritores', en: 'writers' } },
        { slug: { es: 'analistas-datos', en: 'data-analysts' } },
        { slug: { es: 'marketing', en: 'marketers' } },
        { slug: { es: 'productividad', en: 'productivity' } },
        { slug: { es: 'ia', en: 'ai' } }
    ];
    
    categories.forEach(cat => {
        siteConfig.languages.forEach(lang => {
            const url = lang === siteConfig.defaultLanguage 
                ? `${baseUrl}/${cat.slug[lang]}.html`
                : `${baseUrl}/${lang}/${cat.slug[lang]}.html`;
            
            xml += `  <url>\n`;
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${now}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.9</priority>\n`;
            
            // Add xhtml:link for alternate languages
            siteConfig.languages.forEach(altLang => {
                const altUrl = altLang === siteConfig.defaultLanguage 
                    ? `${baseUrl}/${cat.slug[altLang]}.html`
                    : `${baseUrl}/${altLang}/${cat.slug[altLang]}.html`;
                xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>\n`;
            });
            
            xml += `  </url>\n`;
        });
    });
    
    // Tool pages for each language
    toolsIndex.forEach(tool => {
        siteConfig.languages.forEach(lang => {
            const url = lang === siteConfig.defaultLanguage 
                ? `${baseUrl}/${tool.slug}`
                : `${baseUrl}/${lang}/${tool.slug}`;
            
            xml += `  <url>\n`;
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${now}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            
            // Add xhtml:link for alternate languages
            siteConfig.languages.forEach(altLang => {
                const altUrl = altLang === siteConfig.defaultLanguage 
                    ? `${baseUrl}/${tool.slug}`
                    : `${baseUrl}/${altLang}/${tool.slug}`;
                xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>\n`;
            });
            
            xml += `  </url>\n`;
        });
    });
    
    xml += '</urlset>';
    
    await fs.writeFile(path.join(projectRoot, 'sitemap.xml'), xml, 'utf8');
    console.log(' -> Generado: sitemap.xml');
}

// Main execution
async function main() {
    try {
        console.log('=== FastTools Site Generator ===\n');
        console.log(`Dominio: ${siteConfig.domain}`);
        console.log(`Idiomas: ${siteConfig.languages.join(', ')}`);
        console.log(`Idioma por defecto: ${siteConfig.defaultLanguage}\n`);
        
        const toolsIndex = JSON.parse(await fs.readFile(toolsIndexPath, 'utf8'));
        console.log(`Total de herramientas: ${toolsIndex.length}\n`);
        
        // Generate for each language
        for (const lang of siteConfig.languages) {
            await generateIndex(toolsIndex, lang);
            await generateTools(toolsIndex, lang);
        }
        
        // Generate sitemap
        await generateSitemap(toolsIndex);
        
        console.log('\n✅ Proceso de generación completado.');
        console.log(`\nPáginas generadas: ${toolsIndex.length * siteConfig.languages.length + siteConfig.languages.length}`);
    } catch (error) {
        console.error('❌ Error durante el proceso de generación:', error);
        process.exit(1);
    }
}

main();
