// ====================
// SEO UTILITIES
// ====================

// Shared utilities for SEO tools

// ====================
// PAGE ANALYSIS
// ====================

async function getCurrentPageData() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
        throw new Error('No se pudo obtener la pestaña actual');
    }
    
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageData' });
    return response;
}

// ====================
// META TAGS
// ====================

function extractMetaTags(doc = document) {
    const metaTags = {};
    
    // Basic meta tags
    metaTags.title = doc.title || '';
    metaTags.description = doc.querySelector('meta[name="description"]')?.content || '';
    metaTags.keywords = doc.querySelector('meta[name="keywords"]')?.content || '';
    metaTags.author = doc.querySelector('meta[name="author"]')?.content || '';
    metaTags.robots = doc.querySelector('meta[name="robots"]')?.content || '';
    metaTags.canonical = doc.querySelector('link[rel="canonical"]')?.href || '';
    
    // Open Graph
    metaTags.og = {};
    doc.querySelectorAll('meta[property^="og:"]').forEach(meta => {
        const property = meta.getAttribute('property').replace('og:', '');
        metaTags.og[property] = meta.content;
    });
    
    // Twitter Card
    metaTags.twitter = {};
    doc.querySelectorAll('meta[name^="twitter:"]').forEach(meta => {
        const name = meta.getAttribute('name').replace('twitter:', '');
        metaTags.twitter[name] = meta.content;
    });
    
    return metaTags;
}

// ====================
// HEADINGS
// ====================

function extractHeadings(doc = document) {
    const headings = [];
    const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    tags.forEach(tag => {
        doc.querySelectorAll(tag).forEach(heading => {
            headings.push({
                level: parseInt(tag.substring(1)),
                text: heading.textContent.trim(),
                tag: tag
            });
        });
    });
    
    return headings;
}

function validateHeadingStructure(headings) {
    const issues = [];
    
    // Check for H1
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
        issues.push({ type: 'error', message: 'No se encontró ningún H1' });
    } else if (h1Count > 1) {
        issues.push({ type: 'warning', message: `Se encontraron ${h1Count} H1 (recomendado: 1)` });
    }
    
    // Check hierarchy
    let prevLevel = 0;
    headings.forEach((heading, index) => {
        if (heading.level > prevLevel + 1 && prevLevel !== 0) {
            issues.push({
                type: 'warning',
                message: `Salto de jerarquía: ${headings[index-1].tag} → ${heading.tag}`
            });
        }
        prevLevel = heading.level;
    });
    
    return issues;
}

// ====================
// SCHEMA.ORG
// ====================

function extractSchemaOrg(doc = document) {
    const schemas = [];
    
    // JSON-LD
    doc.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
            const data = JSON.parse(script.textContent);
            schemas.push({
                type: 'JSON-LD',
                data: data
            });
        } catch (e) {
            schemas.push({
                type: 'JSON-LD',
                error: 'Invalid JSON'
            });
        }
    });
    
    // Microdata
    doc.querySelectorAll('[itemscope]').forEach(item => {
        const type = item.getAttribute('itemtype');
        schemas.push({
            type: 'Microdata',
            itemType: type
        });
    });
    
    return schemas;
}

// ====================
// IMAGES
// ====================

function analyzeImages(doc = document) {
    const images = [];
    
    doc.querySelectorAll('img').forEach(img => {
        images.push({
            src: img.src,
            alt: img.alt || '',
            hasAlt: !!img.alt,
            width: img.naturalWidth,
            height: img.naturalHeight
        });
    });
    
    return images;
}

// ====================
// LINKS
// ====================

function analyzeLinks(doc = document) {
    const links = {
        internal: [],
        external: [],
        nofollow: [],
        broken: []
    };
    
    const currentDomain = new URL(doc.location.href).hostname;
    
    doc.querySelectorAll('a[href]').forEach(link => {
        const href = link.href;
        const rel = link.rel;
        
        try {
            const url = new URL(href);
            
            if (url.hostname === currentDomain) {
                links.internal.push(href);
            } else {
                links.external.push(href);
            }
            
            if (rel.includes('nofollow')) {
                links.nofollow.push(href);
            }
        } catch (e) {
            // Invalid URL
        }
    });
    
    return links;
}

// ====================
// SEO SCORE
// ====================

function calculateSEOScore(data) {
    let score = 0;
    const maxScore = 100;
    const checks = [];
    
    // Title (10 points)
    if (data.title && data.title.length >= 30 && data.title.length <= 60) {
        score += 10;
        checks.push({ name: 'Title', status: 'ok', points: 10 });
    } else {
        checks.push({ name: 'Title', status: 'warning', points: 0 });
    }
    
    // Description (10 points)
    if (data.description && data.description.length >= 120 && data.description.length <= 160) {
        score += 10;
        checks.push({ name: 'Description', status: 'ok', points: 10 });
    } else {
        checks.push({ name: 'Description', status: 'warning', points: 0 });
    }
    
    // H1 (15 points)
    const h1Count = data.headings?.filter(h => h.level === 1).length || 0;
    if (h1Count === 1) {
        score += 15;
        checks.push({ name: 'H1', status: 'ok', points: 15 });
    } else {
        checks.push({ name: 'H1', status: 'error', points: 0 });
    }
    
    // Images with alt (10 points)
    const imagesWithAlt = data.images?.filter(img => img.hasAlt).length || 0;
    const totalImages = data.images?.length || 0;
    if (totalImages > 0 && imagesWithAlt / totalImages >= 0.9) {
        score += 10;
        checks.push({ name: 'Image Alt', status: 'ok', points: 10 });
    } else {
        checks.push({ name: 'Image Alt', status: 'warning', points: 0 });
    }
    
    // Canonical (10 points)
    if (data.canonical) {
        score += 10;
        checks.push({ name: 'Canonical', status: 'ok', points: 10 });
    } else {
        checks.push({ name: 'Canonical', status: 'warning', points: 0 });
    }
    
    // Open Graph (15 points)
    if (data.og && Object.keys(data.og).length >= 4) {
        score += 15;
        checks.push({ name: 'Open Graph', status: 'ok', points: 15 });
    } else {
        checks.push({ name: 'Open Graph', status: 'warning', points: 0 });
    }
    
    // Schema.org (15 points)
    if (data.schemas && data.schemas.length > 0) {
        score += 15;
        checks.push({ name: 'Schema.org', status: 'ok', points: 15 });
    } else {
        checks.push({ name: 'Schema.org', status: 'warning', points: 0 });
    }
    
    // Internal links (15 points)
    if (data.links && data.links.internal.length >= 5) {
        score += 15;
        checks.push({ name: 'Internal Links', status: 'ok', points: 15 });
    } else {
        checks.push({ name: 'Internal Links', status: 'warning', points: 0 });
    }
    
    return {
        score: score,
        maxScore: maxScore,
        percentage: Math.round((score / maxScore) * 100),
        checks: checks
    };
}

// ====================
// EXPORT
// ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentPageData,
        extractMetaTags,
        extractHeadings,
        validateHeadingStructure,
        extractSchemaOrg,
        analyzeImages,
        analyzeLinks,
        calculateSEOScore
    };
}
