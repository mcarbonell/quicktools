/**
 * Animation utilities for FastTools
 * Scroll reveal and micro-interactions
 */

// Scroll reveal observer
const observeScrollReveal = () => {
    const elements = document.querySelectorAll('.scroll-reveal');
    
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
};

// Stagger animation for children
const staggerChildren = (parent, className = 'fade-in-up') => {
    const children = parent.querySelectorAll(':scope > *');
    children.forEach((child, index) => {
        child.classList.add(className, `stagger-${Math.min(index + 1, 6)}`);
    });
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        observeScrollReveal();
        
        // Auto-stagger tool grids
        const toolGrids = document.querySelectorAll('.row.g-4');
        toolGrids.forEach(grid => {
            const cards = grid.querySelectorAll('.card');
            cards.forEach((card, index) => {
                card.classList.add('fade-in-up', `stagger-${Math.min(index + 1, 6)}`);
            });
        });
    });
} else {
    observeScrollReveal();
}
