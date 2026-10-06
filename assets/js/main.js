document.addEventListener('DOMContentLoaded', function() {
    // GHOST GALLERY LOGIC
    const currentPath = window.location.pathname;
    const isSliderPage = currentPath.includes('/nursery-restoration/') || currentPath.includes('/resources/');

    if (isSliderPage) {
        const galleryCards = document.querySelectorAll('.kg-gallery-card, .kg-image-card');
    galleryCards.forEach((card, index) => {
        const images = card.classList.contains('kg-gallery-card') 
            ? card.querySelectorAll('.kg-gallery-image img') 
            : card.querySelectorAll('img');
        if (images.length === 0) return;
        
        const figcaption = card.querySelector('figcaption');
        const captionText = figcaption ? figcaption.innerHTML : '';
        
        const newContainer = document.createElement('div');
        newContainer.className = 'custom-gallery-module kg-width-wide';
        
        const subtitleHtml = images.length > 1 ? `<div class="gallery-subtitle"><span class="highlight-number">1</span> of ${images.length}</div>` : '';
        const titleHtml = captionText ? `<h2 class="gallery-title">${captionText}</h2>` : '';
        
        let header = null;
        if (titleHtml || subtitleHtml) {
            header = document.createElement('div');
            header.className = 'gallery-header';
            header.innerHTML = `${titleHtml}${subtitleHtml}`;
        }
        
        const swiperContainer = document.createElement('div');
        swiperContainer.className = `swiper gallery-swiper gallery-swiper-${index}`;
        
        const swiperWrapper = document.createElement('div');
        swiperWrapper.className = 'swiper-wrapper';
        
        images.forEach((img, imgIndex) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            
            const link = document.createElement('a');
            link.href = img.src;
            link.setAttribute('data-fslightbox', `gallery-${index}`);
            
            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt || `Gallery image ${imgIndex + 1}`;
            newImg.loading = 'lazy';
            
            link.appendChild(newImg);
            slide.appendChild(link);
            swiperWrapper.appendChild(slide);
        });
        
        swiperContainer.appendChild(swiperWrapper);
        
        if (header) {
            newContainer.appendChild(header);
        }
        newContainer.appendChild(swiperContainer);
        
        if (images.length > 1) {
            const navContainer = document.createElement('div');
            navContainer.className = 'gallery-nav-buttons';
            navContainer.innerHTML = `
                <button class="gallery-btn-prev gallery-btn-prev-${index}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button class="gallery-btn-next gallery-btn-next-${index}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
            `;
            newContainer.appendChild(navContainer);
        }
        
        card.parentNode.replaceChild(newContainer, card);
        
        if (typeof Swiper !== 'undefined') {
            new Swiper(`.gallery-swiper-${index}`, {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                initialSlide: 0,
                observer: true,
                observeParents: true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: true,
                },
                navigation: {
                    nextEl: `.gallery-btn-next-${index}`,
                    prevEl: `.gallery-btn-prev-${index}`,
                },
                loop: images.length > 1,
                on: {
                    slideChange: function () {
                        const subtitle = newContainer.querySelector('.highlight-number');
                        if (subtitle) {
                            subtitle.innerHTML = this.realIndex + 1;
                        }
                    }
                }
            });
        }
    });

        if (typeof refreshFsLightbox !== 'undefined') {
            refreshFsLightbox();
        }
    } else {
        // Fallback for standard Ghost galleries on all other pages
        const galleryImagesNode = document.querySelectorAll('.kg-gallery-image img');
        galleryImagesNode.forEach(function (image) {
            const container = image.closest('.kg-gallery-image');
            if (image.attributes.width && image.attributes.height) {
                const width = image.attributes.width.value;
                const height = image.attributes.height.value;
                const ratio = width / height;
                container.style.flex = ratio + ' 1 0%';
            }
        });
    }

    // Hero Slider Dynamic Injection from Ghost Gallery
    const heroRawGallery = document.getElementById('hero-raw-gallery');
    const heroSliderContainer = document.getElementById('hero-slider-container');
    
    if (heroRawGallery && heroSliderContainer) {
        // Find all images inside Ghost gallery cards or just all images in the content
        const galleryImages = heroRawGallery.querySelectorAll('.kg-gallery-image img, .kg-image-card img');
        
        if (galleryImages.length > 0) {
            galleryImages.forEach((img, index) => {
                const slide = document.createElement('div');
                slide.className = 'slide' + (index === 0 ? ' active' : '');
                const newImg = document.createElement('img');
                newImg.src = img.src;
                newImg.alt = img.alt;
                newImg.loading = index === 0 ? 'eager' : 'lazy';
                slide.appendChild(newImg);
                heroSliderContainer.appendChild(slide);
            });
        } else {
            // Fallback if no images found
            heroSliderContainer.innerHTML = '<div class="slide active" style="background-color: #111;"></div>';
        }
    }

    // Hero Slider Initialization
    const slides = document.querySelectorAll('#hero-slider-container .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const btnNext = document.getElementById('slider-next');
        const btnPrev = document.getElementById('slider-prev');

        function showSlide(index) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        if (btnNext) btnNext.addEventListener('click', () => showSlide(currentSlide + 1));
        if (btnPrev) btnPrev.addEventListener('click', () => showSlide(currentSlide - 1));

        // Auto slide every 5 seconds
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }
    // TEAM TABS LOGIC
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => {
                    p.classList.remove('active');
                    p.style.display = 'none';
                });

                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    targetPanel.style.display = 'block';
                }
            });
        });
    }

    // TEAM BIO EXPANSION
    const expandBtns = document.querySelectorAll('.expand-bio-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card-team');
            if (card.classList.contains('expanded')) {
                card.classList.remove('expanded');
                e.target.innerHTML = 'Read Bio &darr;';
            } else {
                card.classList.add('expanded');
                e.target.innerHTML = 'Close Bio &uarr;';
            }
        });
    });

    // LAYOUT: Sticky Header Scroll State
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        });
    }

    // LAYOUT: Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    if (mobileMenuToggle && mobileMenuOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuOverlay.classList.contains('is-open');
            if (isOpen) {
                mobileMenuOverlay.classList.remove('is-open');
                mobileMenuOverlay.setAttribute('aria-hidden', 'true');
                mobileMenuToggle.innerHTML = '☰';
                document.body.style.overflow = '';
            } else {
                mobileMenuOverlay.classList.add('is-open');
                mobileMenuOverlay.setAttribute('aria-hidden', 'false');
                mobileMenuToggle.innerHTML = '✕';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    }

    // LAYOUT: Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        // Respect reduced motion setting
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            revealElements.forEach(el => el.classList.add('is-revealed'));
        } else {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(el => revealObserver.observe(el));
        }
    }


});

// FSLightbox Download Button Injector
const fslightboxObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.classList && node.classList.contains('fslightbox-container')) {
                const toolbar = node.querySelector('.fslightbox-toolbar');
                if (toolbar && !toolbar.querySelector('.fslightbox-download-btn')) {
                    const downloadBtn = document.createElement('a');
                    downloadBtn.className = 'fslightbox-download-btn';
                    downloadBtn.title = 'Download Image';
                    downloadBtn.style.cssText = 'width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: none; border: none; color: white; padding: 10px; margin-right: 8px; text-decoration: none; opacity: 0.8; transition: opacity 0.2s;';
                    downloadBtn.innerHTML = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>';
                    
                    downloadBtn.addEventListener('mouseenter', () => {
                        downloadBtn.style.opacity = '1';
                        const visibleImages = node.querySelectorAll('.fslightbox-source');
                        for (let img of visibleImages) {
                            if (img.style.opacity !== '0' && img.style.display !== 'none' && !img.className.includes('fslightbox-slide-hidden')) {
                                downloadBtn.href = img.src;
                                downloadBtn.download = img.src.split('/').pop() || 'download';
                                break;
                            }
                        }
                    });
                    downloadBtn.addEventListener('mouseleave', () => {
                        downloadBtn.style.opacity = '0.8';
                    });
                    downloadBtn.addEventListener('click', () => {
                        const visibleImages = node.querySelectorAll('.fslightbox-source');
                        for (let img of visibleImages) {
                            if (img.style.opacity !== '0' && img.style.display !== 'none' && !img.className.includes('fslightbox-slide-hidden')) {
                                downloadBtn.href = img.src;
                                downloadBtn.download = img.src.split('/').pop() || 'download';
                                break;
                            }
                        }
                    });
                    
                    setTimeout(() => {
                        const toolbarButtons = node.querySelector('.fslightbox-toolbar-button, .fslightbox-toolbar-button:last-child')?.parentElement;
                        if (toolbarButtons) {
                            toolbarButtons.prepend(downloadBtn);
                        } else {
                            toolbar.prepend(downloadBtn);
                        }
                    }, 50);
                }
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    fslightboxObserver.observe(document.body, { childList: true, subtree: false });
});
