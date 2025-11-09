// Búsqueda de herramientas
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const toolCards = document.querySelectorAll('.tool-card');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();

            toolCards.forEach(card => {
                const title = card.querySelector('.tool-title').textContent.toLowerCase();
                const description = card.querySelector('.tool-description').textContent.toLowerCase();
                const keywords = card.dataset.keywords || '';
                
                const matches = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               keywords.includes(searchTerm);

                card.classList.toggle('hidden', !matches && searchTerm !== '');
            });
        });
    }
});
