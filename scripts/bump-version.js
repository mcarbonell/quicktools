// Auto-increment Service Worker version on build

const fs = require('fs').promises;
const path = require('path');

async function bumpVersion() {
    console.log('🔄 Bumping Service Worker version...');

    const swPath = path.join(__dirname, '../web/sw.js');
    let swContent = await fs.readFile(swPath, 'utf8');

    // Extract current version from CACHE_NAME
    const versionMatch = swContent.match(/const CACHE_NAME = ['"]fasttools-v(\d+\.\d+\.\d+)['"]/);
    
    if (!versionMatch) {
        console.error('❌ Could not find version in CACHE_NAME');
        return;
    }

    const currentVersion = versionMatch[1];
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    // Increment patch version
    const newVersion = `${major}.${minor}.${patch + 1}`;

    // Update cache names
    swContent = swContent.replace(
        /const CACHE_NAME = ['"]fasttools-v\d+\.\d+\.\d+['"]/,
        `const CACHE_NAME = 'fasttools-v${newVersion}'`
    );

    swContent = swContent.replace(
        /const STATIC_CACHE = ['"]fasttools-static-v\d+\.\d+\.\d+['"]/,
        `const STATIC_CACHE = 'fasttools-static-v${newVersion}'`
    );

    swContent = swContent.replace(
        /const DYNAMIC_CACHE = ['"]fasttools-dynamic-v\d+\.\d+\.\d+['"]/,
        `const DYNAMIC_CACHE = 'fasttools-dynamic-v${newVersion}'`
    );

    // Update version in console.log statements
    swContent = swContent.replace(
        /console\.log\('\[SW\] Installing Service Worker v\d+\.\d+\.\d+'/g,
        `console.log('[SW] Installing Service Worker v${newVersion}'`
    );

    swContent = swContent.replace(
        /console\.log\('\[SW\] Activating Service Worker v\d+\.\d+\.\d+'/g,
        `console.log('[SW] Activating Service Worker v${newVersion}'`
    );

    // Write updated sw.js
    await fs.writeFile(swPath, swContent, 'utf8');

    console.log(`✅ Version bumped: v${currentVersion} → v${newVersion}`);
    console.log('📝 Updated sw.js with new version');
    
    return newVersion;
}

// Run if called directly
if (require.main === module) {
    bumpVersion().catch(console.error);
}

module.exports = { bumpVersion };
