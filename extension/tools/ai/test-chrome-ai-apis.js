// Display Chrome version
const match = navigator.userAgent.match(/Chrome\/(\d+)/);
document.getElementById('chrome-version').textContent = match ? match[1] : 'Unknown';

async function testAllAPIs() {
    const results = document.getElementById('results');
    results.innerHTML = '<p>Testing APIs...</p>';

    const apis = [
        { name: 'Prompt API', check: () => 'LanguageModel' in self },
        { name: 'Summarizer API', check: () => 'Summarizer' in self },
        { name: 'Writer API', check: () => 'Writer' in self },
        { name: 'Rewriter API', check: () => 'Rewriter' in self },
        { name: 'Translator API', check: () => 'Translator' in self },
        { name: 'Language Detector API', check: () => 'LanguageDetector' in self },
        { name: 'Proofreader API', check: () => 'Proofreader' in self }
    ];

    let availableCount = 0;
    let html = '';

    for (const api of apis) {
        const available = api.check();
        if (available) availableCount++;

        html += `
            <div class="api-test ${available ? 'available' : 'unavailable'}">
                <div class="api-name">${available ? '✅' : '❌'} ${api.name}</div>
                <div class="api-status">${available ? 'Available' : 'Not Available'}</div>
            </div>
        `;
    }

    results.innerHTML = html;
    document.getElementById('available-count').textContent = `${availableCount} of ${apis.length}`;
}

// Auto-test on load
document.addEventListener('DOMContentLoaded', testAllAPIs);
