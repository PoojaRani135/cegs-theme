/**
 * Feature: Case for the Eastern Ghats - Preview Card Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const rawContentDiv = document.getElementById('case-raw-content');
    const previewTextContainer = document.getElementById('case-preview-text');
    const chipsContainer = document.getElementById('case-preview-chips');
    const previewSection = document.querySelector('.case-preview-section');
    
    if (!rawContentDiv || !previewTextContainer || !chipsContainer || !previewSection) return;

    // 1. Extract first paragraph
    const paragraphs = rawContentDiv.querySelectorAll('p');
    if (paragraphs.length === 0) {
        previewTextContainer.innerHTML = '<p class="text-muted">Content coming soon.</p>';
        return;
    }

    const firstP = paragraphs[0];
    previewTextContainer.innerHTML = '';
    previewTextContainer.appendChild(firstP.cloneNode(true));

    // 2. Extract stats from home-case-stats
    const statsRawDiv = document.getElementById('stats-raw-content');
    if (!statsRawDiv) return;

    // Get paragraphs or list items from the stats page
    let statElements = Array.from(statsRawDiv.querySelectorAll('p, li'));
    
    // If no p/li tags, maybe they just used bold tags or plain text
    if (statElements.length === 0) {
        const strongTags = Array.from(statsRawDiv.querySelectorAll('strong, b'));
        if (strongTags.length > 0) {
            statElements = strongTags;
        } else if (statsRawDiv.textContent.trim().length > 0) {
            // fallback to raw text if no elements
            const temp = document.createElement('p');
            temp.textContent = statsRawDiv.textContent.trim();
            statElements = [temp];
        }
    }
    
    if (statElements.length === 0) {
        chipsContainer.innerHTML = '<p class="mono text-muted text-sm">No highlighted stats found.</p>';
    } else {
        chipsContainer.innerHTML = ''; // Clear loading state
        
        statElements.forEach((el, index) => {
            const text = el.textContent.trim();
            if (!text) return;

            const chip = document.createElement('div');
            
            // Apply a uniform class instead of character-length heuristics
            chip.className = 'stat-chip stat-chip-note stat-chip-hidden';
            
            // Maintain innerHTML to preserve bold tags (strong/b) for rolling animation
            chip.innerHTML = el.innerHTML;
            // Store transition delay based on index for staggered reveal
            chip.style.transitionDelay = `${index * 150}ms`;
            
            chipsContainer.appendChild(chip);
        });
    }

    // 3. Reveal Animation via Intersection Observer
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        previewTextContainer.classList.add('is-revealed');
        const chips = chipsContainer.querySelectorAll('.stat-chip');
        chips.forEach(chip => chip.classList.add('is-revealed'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reveal text first
                    previewTextContainer.classList.add('is-revealed');
                    
                    // Reveal chips with stagger (handled by CSS transition-delay)
                    const chips = chipsContainer.querySelectorAll('.stat-chip');
                    chips.forEach(chip => {
                        chip.classList.remove('stat-chip-hidden');
                        chip.classList.add('is-revealed');
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(previewSection);
    }
});
