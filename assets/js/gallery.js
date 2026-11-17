document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.gallery-category-section');
    sections.forEach(section => {
        const rawContentDiv = section.querySelector('.raw-gallery-content');
        const gridDiv = section.querySelector('.mini-gallery-grid');

        if (rawContentDiv && gridDiv) {
            // Find all images inside the raw content that are part of gallery or image cards
            const images = rawContentDiv.querySelectorAll('.kg-gallery-card img, .kg-image-card img');

            // Take up to 4 images
            const displayImages = Array.from(images).slice(0, 4);

            if (displayImages.length > 0) {
                // Clear noscript fallback
                gridDiv.innerHTML = '';

                // Add a class to apply specific desktop grid styles
                gridDiv.classList.add(`items-${displayImages.length}`);

                // Reset inline styles that were hardcoded in HTML, so CSS classes take over
                gridDiv.style.gridTemplateColumns = '';

                displayImages.forEach(img => {
                    const item = document.createElement('a');
                    item.href = section.querySelector('h2 a').href; // link to post
                    item.style.cssText = 'position: relative; width: 100%; padding-top: 75%; border-radius: var(--radius-sm); overflow: hidden; display: block; box-shadow: 0 2px 10px rgba(0,0,0,0.05);';

                    const imgEl = document.createElement('img');
                    imgEl.src = img.src;
                    imgEl.alt = img.alt || 'Gallery photo';
                    imgEl.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;';

                    // Hover effect
                    item.addEventListener('mouseenter', () => imgEl.style.transform = 'scale(1.05)');
                    item.addEventListener('mouseleave', () => imgEl.style.transform = 'scale(1)');

                    item.appendChild(imgEl);
                    gridDiv.appendChild(item);
                });
            } else {
                gridDiv.innerHTML = '<p class="text-muted text-center" style="grid-column: 1 / -1;">No images available in this gallery yet.</p>';
            }
        }
    });
});

