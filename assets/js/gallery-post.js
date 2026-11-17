document.addEventListener('DOMContentLoaded', function () {
    const rawGalleries = document.querySelectorAll('.post-content .kg-gallery-card, .post-content .kg-image-card');
    const masonryContainer = document.getElementById('masonry-gallery-container');

    let galleryData = []; // To store data for next/prev

    if (masonryContainer && rawGalleries.length > 0) {
        let imgIndex = 0;
        rawGalleries.forEach(card => {
            let galleryCaptionStr = '';
            if (card.classList.contains('kg-gallery-card')) {
                const galleryFigcaption = card.querySelector('figcaption');
                if (galleryFigcaption) {
                    galleryCaptionStr = galleryFigcaption.innerHTML;
                }
            }

            const images = card.querySelectorAll('img');
            images.forEach(img => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'gallery-item mb-4 stagger-in';
                item.style.cssText = 'break-inside: avoid; position: relative; cursor: pointer; margin-bottom: var(--space-4); background: none; border: none; padding: 0; text-align: left; width: 100%; display: block;';
                item.setAttribute('data-index', imgIndex);

                const titleStr = img.alt || '';
                let descStr = galleryCaptionStr;

                const figure = img.closest('figure.kg-image-card');
                if (figure) {
                    const figcaption = figure.querySelector('figcaption');
                    if (figcaption) {
                        descStr = figcaption.innerHTML;
                    }
                }

                // Store in array
                let imgSrc = img.src;
                if (imgSrc.includes('/size/')) {
                    imgSrc = imgSrc.replace(/\/size\/[^/]+/, '');
                }
                galleryData.push({
                    src: imgSrc,
                    title: titleStr,
                    desc: descStr
                });

                const imgEl = document.createElement('img');
                imgEl.src = img.src;
                imgEl.alt = titleStr;
                imgEl.loading = 'lazy';
                imgEl.className = 'gallery-img';
                imgEl.style.width = '100%';
                imgEl.style.borderRadius = 'var(--radius-sm)';
                imgEl.style.display = 'block';
                item.appendChild(imgEl);

                if (titleStr || descStr) {
                    const overlay = document.createElement('div');
                    overlay.className = 'gallery-overlay';
                    overlay.style.position = 'absolute';
                    overlay.style.inset = '0';
                    overlay.style.background = 'rgba(31, 42, 36, 0.8)';
                    overlay.style.color = 'white';
                    overlay.style.display = 'flex';
                    overlay.style.flexDirection = 'column';
                    overlay.style.justifyContent = 'flex-end';
                    overlay.style.padding = 'var(--space-3)';
                    overlay.style.opacity = '0';
                    overlay.style.transition = 'opacity 0.2s ease';
                    overlay.style.borderRadius = 'var(--radius-sm)';

                    if (titleStr) {
                        const h3 = document.createElement('h3');
                        h3.textContent = titleStr;
                        h3.style.fontFamily = 'var(--font-heading)';
                        h3.style.fontSize = '1.4em';
                        h3.style.marginBottom = '4px';
                        h3.style.color = '#F7F4EC';
                        h3.style.lineHeight = '1.2';
                        overlay.appendChild(h3);
                    }

                    if (descStr) {
                        const descDiv = document.createElement('div');
                        descDiv.innerHTML = descStr;
                        descDiv.style.fontFamily = titleStr ? 'inherit' : 'var(--font-heading)';
                        descDiv.style.fontSize = titleStr ? '0.85em' : '1.4em';
                        descDiv.style.lineHeight = '1.2';
                        descDiv.style.color = 'rgba(255,255,255,0.9)';
                        descDiv.style.marginTop = '4px';
                        overlay.appendChild(descDiv);
                    }

                    item.appendChild(overlay);
                }

                masonryContainer.appendChild(item);
                imgIndex++;
            });

            card.style.display = 'none';
        });
    } else if (masonryContainer && rawGalleries.length === 0) {
        masonryContainer.innerHTML = '<p class="mono text-muted">Please add a Gallery card or Image card to this page to display images.</p>';
    }

    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const downloadBtn = document.getElementById('lightbox-download');
    const nextBtn = document.getElementById('lightbox-next');
    const prevBtn = document.getElementById('lightbox-prev');

    let currentIndex = -1;

    function openLightbox(index) {
        if (index < 0 || index >= galleryData.length) return;
        currentIndex = index;
        const data = galleryData[currentIndex];

        lightboxImg.src = data.src;
        lightboxCaption.innerText = data.title;

        downloadBtn.href = data.src;
        let fileName = data.title ? (data.title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.jpg') : 'gallery-image.jpg';
        downloadBtn.setAttribute('download', fileName);

        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Toggle arrows
        prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
        nextBtn.style.display = currentIndex < galleryData.length - 1 ? 'block' : 'none';
    }

    items.forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-index'));
            openLightbox(idx);
        });
    });

    function closeLightbox() {
        const lastIdx = currentIndex;
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        document.body.style.overflow = 'auto';
        currentIndex = -1;
        if (lastIdx >= 0 && items[lastIdx]) {
            items[lastIdx].focus();
        }
    }

    closeBtn.addEventListener('click', closeLightbox);

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex < galleryData.length - 1) {
            openLightbox(currentIndex + 1);
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            openLightbox(currentIndex - 1);
        }
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight' && currentIndex < galleryData.length - 1) openLightbox(currentIndex + 1);
            if (e.key === 'ArrowLeft' && currentIndex > 0) openLightbox(currentIndex - 1);
        }
    });
});

