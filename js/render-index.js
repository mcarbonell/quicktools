// render-index.js
// Carga data/tools-index.json y renderiza tarjetas agrupadas por categoría
(async function () {
    const container = document.getElementById('toolsGrid');
    if (!container) return;
    try {
        const resp = await fetch('data/tools-index.json', { cache: 'no-store' });
        if (!resp.ok) throw new Error('No se pudo cargar el índice de herramientas');
        const tools = await resp.json();
        // Agrupar por categoría
        const byCat = tools.reduce((acc, t) => {
            (acc[t.category] = acc[t.category] || []).push(t);
            return acc;
        }, {});

        container.innerHTML = '';
        for (const [cat, items] of Object.entries(byCat)) {
            const section = document.createElement('section');
            section.className = 'mb-4';
            const h = document.createElement('h3');
            h.textContent = cat;
            h.className = 'h5 mb-3';
            section.appendChild(h);

            const row = document.createElement('div');
            row.className = 'row g-4';

            items.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4';
                col.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                            <a href="${item.slug}" class="btn btn-primary">Abrir herramienta</a>
                        </div>
                    </div>
                `;
                row.appendChild(col);
            });

            section.appendChild(row);
            container.appendChild(section);
        }

    } catch (e) {
        container.innerHTML = '<div class="alert alert-danger">Error cargando herramientas.</div>';
        console.error(e);
    }
})();
