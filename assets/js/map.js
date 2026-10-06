/**
 * Dynamic Maps Logic
 * Parses Ghost content from a single page into dynamic interactive map sections.
 */
document.addEventListener('DOMContentLoaded', () => {
    const rawContentDiv = document.getElementById('maps-raw-content');
    const container = document.getElementById('dynamic-maps-container');
    const pageTitleDiv = document.getElementById('maps-page-title');

    if (!rawContentDiv || !container) return;

    const pageTitle = pageTitleDiv ? pageTitleDiv.textContent.trim() : '';
    if (pageTitleDiv) pageTitleDiv.remove();

    // Parse the raw HTML
    const htmlContent = rawContentDiv.innerHTML;
    const entriesHtml = htmlContent.split(/<hr\s*\/?>/i);

    let mapEntries = [];

    entriesHtml.forEach(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html.trim();
        if (!tempDiv.innerHTML) return;

        const imgEl = tempDiv.querySelector('img');
        if (!imgEl) return;

        // Try getting caption from figcaption, or from heading
        const figcaptionEl = tempDiv.querySelector('figcaption');
        const headingEl = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
        
        let title = '';
        if (figcaptionEl) {
            title = figcaptionEl.innerHTML;
            figcaptionEl.remove();
        } else if (headingEl) {
            title = headingEl.innerHTML;
            headingEl.remove();
        }

        const rawTitle = title ? title.replace(/<[^>]*>?/gm, '') : '';

        const figureEl = tempDiv.querySelector('figure');
        if (figureEl) figureEl.remove();
        else imgEl.remove();

        mapEntries.push({
            imgSrc: imgEl.src,
            imgAlt: imgEl.alt || rawTitle || 'Map',
            title: title,
            rawTitle: rawTitle,
            description: tempDiv.innerHTML
        });
    });

    if (mapEntries.length === 0) return;

    container.style.position = 'relative';

    // Global Title matching other sections - append to root container above slider
    if (pageTitle) {
        const globalHeader = document.createElement('div');
        globalHeader.className = 'section-header editorial-header';
        globalHeader.innerHTML = `<h2>${pageTitle}</h2>`;
        container.appendChild(globalHeader);
    }

    // Slider container that holds everything
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'maps-slider-container';
    
    // Info panel for titles/descriptions on the right
    const infoPanel = document.createElement('div');
    infoPanel.className = 'maps-info-panel';
    sliderContainer.appendChild(infoPanel);

    // Single Info Content Box (Normal document flow)
    const infoContentBox = document.createElement('div');
    infoContentBox.className = 'map-info is-active';
    infoContentBox.innerHTML = `
        <div class="map-info-desc text-card glass-panel">
            <h3 class="map-info-caption"></h3>
            <div class="map-info-content"></div>
        </div>
    `;
    infoPanel.appendChild(infoContentBox);

    const captionEl = infoContentBox.querySelector('.map-info-caption');
    const contentEl = infoContentBox.querySelector('.map-info-content');

    // Navigation Controls
    const navControls = document.createElement('div');
    navControls.className = 'maps-nav-controls';
    navControls.innerHTML = `
        <button class="map-nav-btn prev-btn" aria-label="Previous Map">❮</button>
        <button class="map-nav-btn next-btn" aria-label="Next Map">❯</button>
    `;
    sliderContainer.appendChild(navControls);

    // Lightbox Container
    const lightbox = document.createElement('div');
    lightbox.className = 'map-lightbox';
    lightbox.innerHTML = `
        <div class="map-lightbox-overlay"></div>
        <img class="map-lightbox-img" src="" alt="Map Preview" />
        <button class="map-lightbox-close">✖</button>
    `;
    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('is-open');
    });

    mapEntries.forEach((entry, index) => {
        // Create the Visual Map element (Left / Dock)
        const visualDiv = document.createElement('div');
        visualDiv.className = 'map-visual';
        visualDiv.id = `map-visual-${index}`;
        
        visualDiv.innerHTML = `
            <img src="${entry.imgSrc}" alt="${entry.imgAlt}" class="map-image" />
            ${entry.rawTitle ? `<div class="map-thumbnail-title">${entry.rawTitle}</div>` : ''}
        `;
        
        // Click to make this map active or preview
        visualDiv.addEventListener('click', () => {
            if (!visualDiv.classList.contains('is-expanded')) {
                updateLayout(index);
            } else {
                const img = visualDiv.querySelector('img');
                lightbox.querySelector('.map-lightbox-img').src = img.src;
                lightbox.classList.add('is-open');
            }
        });

        entry.visualEl = visualDiv; // Cache DOM reference
        sliderContainer.appendChild(visualDiv);
    });

    container.appendChild(sliderContainer);
    rawContentDiv.remove();

    let activeIndex = -1;
    let isTransitioning = false;

    const updateLayout = (newActiveIndex) => {
        if (activeIndex === newActiveIndex || isTransitioning) return;
        
        isTransitioning = true;
        
        // Fade out text
        infoContentBox.style.opacity = 0;
        
        setTimeout(() => {
            activeIndex = newActiveIndex;

            // Update Text
            const currentEntry = mapEntries[activeIndex];
            if (currentEntry.title) {
                captionEl.style.display = 'block';
                captionEl.innerHTML = currentEntry.title;
            } else {
                captionEl.style.display = 'none';
                captionEl.innerHTML = '';
            }
            contentEl.innerHTML = currentEntry.description;
            
            // Fade in text
            infoContentBox.style.opacity = 1;

            // Update Visuals
            let dockIndex = 0;
            mapEntries.forEach((entry, i) => {
                const visualEl = entry.visualEl;
                if (i === activeIndex) {
                    visualEl.classList.add('is-expanded');
                    visualEl.style.removeProperty('--dock-index'); 
                } else {
                    visualEl.classList.remove('is-expanded');
                    visualEl.style.setProperty('--dock-index', dockIndex++);
                }
            });
            
            setTimeout(() => { isTransitioning = false; }, 300);
        }, 300); // Wait for fade out
    };

    const prevMap = () => {
        let newIndex = activeIndex - 1;
        if (newIndex < 0) newIndex = mapEntries.length - 1; 
        updateLayout(newIndex);
        startAutoplay();
    };

    const nextMap = () => {
        let newIndex = activeIndex + 1;
        if (newIndex >= mapEntries.length) newIndex = 0; 
        updateLayout(newIndex);
        startAutoplay();
    };

    // Event listeners for navigation buttons
    navControls.querySelector('.prev-btn').addEventListener('click', prevMap);
    navControls.querySelector('.next-btn').addEventListener('click', nextMap);
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (['input', 'textarea'].includes(document.activeElement?.tagName.toLowerCase())) return;
        if (lightbox.classList.contains('is-open')) return; // Don't flip maps when lightbox is open
        
        if (e.key === 'ArrowLeft') prevMap();
        else if (e.key === 'ArrowRight') nextMap();
    });

    // Touch Swipe Gestures
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    sliderContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) nextMap();
        if (touchEndX > touchStartX + 50) prevMap();
    }, {passive: true});

    // Auto-play Slideshow
    let autoplayInterval;
    const AUTOPLAY_DELAY = 6000;

    const startAutoplay = () => {
        stopAutoplay();
        autoplayInterval = setInterval(nextMap, AUTOPLAY_DELAY);
    };
    
    const stopAutoplay = () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
    };

    // Pause autoplay on hover/interaction
    sliderContainer.addEventListener('mouseenter', stopAutoplay);
    sliderContainer.addEventListener('mouseleave', startAutoplay);
    sliderContainer.addEventListener('touchstart', stopAutoplay, {passive: true});

    // Initialize the layout
    updateLayout(0);
    startAutoplay();
});
