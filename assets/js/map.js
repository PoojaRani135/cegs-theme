/**
 * Feature 8: Interactive Map Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('cegs-interactive-map');
    const hotspotsLayer = document.getElementById('map-hotspots-layer');
    const popover = document.getElementById('map-popover');
    const popoverClose = document.querySelector('.map-popover-close');
    const popoverTitle = document.getElementById('map-popover-title');
    const popoverFact = document.getElementById('map-popover-fact');
    const popoverSvg = document.getElementById('map-popover-svg');
    
    if (!mapContainer || !window.cegsMapHotspots) return;

    let activeHotspot = null;
    let isMobile = window.innerWidth <= 768;

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
        if (!isMobile && activeHotspot) {
            positionPopover(activeHotspot);
        }
    });

    const closePopover = () => {
        popover.classList.remove('is-active');
        activeHotspot = null;
    };

    popoverClose.addEventListener('click', closePopover);
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popover.classList.contains('is-active')) {
            closePopover();
            if (activeHotspot) activeHotspot.focus();
        }
    });

    const positionPopover = (btn) => {
        if (isMobile) return; // Handled by fixed bottom CSS
        
        const mapRect = mapContainer.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        
        const relativeX = btnRect.left - mapRect.left + (btnRect.width / 2);
        const relativeY = btnRect.top - mapRect.top;
        
        popover.style.left = `${relativeX}px`;
        
        // Dynamic positioning to prevent cutting off at the top
        const requiredSpace = popover.offsetHeight + 15;
        
        if (relativeY > requiredSpace) {
            // Position above the button
            popover.style.top = `${relativeY - requiredSpace}px`;
            popover.classList.remove('popover-bottom');
        } else {
            // Position below the button if not enough space above
            popover.style.top = `${relativeY + btnRect.height + 15}px`;
            popover.classList.add('popover-bottom');
        }
    };

    const showPopover = (data, btn) => {
        popoverTitle.textContent = data.name;
        popoverFact.textContent = data.fact;
        popoverSvg.setAttribute('href', data.speciesSilhouette);
        
        activeHotspot = btn;
        
        // Append popover to map container if it's not already there
        if (popover.parentNode !== mapContainer) {
            mapContainer.appendChild(popover);
        }
        
        popover.classList.add('is-active');
        positionPopover(btn);
    };

    // Render Hotspots
    window.cegsMapHotspots.forEach(data => {
        const btn = document.createElement('button');
        btn.className = 'map-hotspot';
        btn.setAttribute('aria-label', `View details for ${data.name}`);
        btn.style.left = `${data.x}%`;
        btn.style.top = `${data.y}%`;
        
        // Use a generic dot for the marker, or the specific shape if needed. 
        // We'll just use an SVG circle/pin to keep the map clean.
        btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>`;
        
        // Events
        btn.addEventListener('mouseenter', () => {
            if (!isMobile) showPopover(data, btn);
        });
        
        btn.addEventListener('mouseleave', () => {
            if (!isMobile) closePopover();
        });
        
        btn.addEventListener('click', () => {
            if (isMobile) {
                showPopover(data, btn);
            }
        });
        
        btn.addEventListener('focus', () => {
            showPopover(data, btn);
        });
        
        btn.addEventListener('blur', () => {
            closePopover();
        });

        hotspotsLayer.appendChild(btn);
    });
});
