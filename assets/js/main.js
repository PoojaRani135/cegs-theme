(function() {
    var navs = document.querySelectorAll('.js-nav-list:not(.js-nav-parsed)');
    
    navs.forEach(function(nav) {
        nav.classList.add('js-nav-parsed');
        var items = Array.prototype.slice.call(nav.children);
        var currentParent = null;
        var currentDropdown = null;
        
        items.forEach(function(li) {
            var label = li.getAttribute('data-label');
            if (label && label.trim().indexOf('- ') === 0) {
                if (!currentDropdown) {
                    currentDropdown = document.createElement('ul');
                    currentDropdown.className = 'nav-dropdown-menu';
                    
                    if (currentParent) {
                        currentParent.classList.add('has-dropdown');
                        var toggleBtn = document.createElement('button');
                        toggleBtn.className = 'nav-dropdown-toggle';
                        toggleBtn.setAttribute('aria-expanded', 'false');
                        toggleBtn.setAttribute('aria-label', 'Toggle dropdown menu');
                        toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                        
                        toggleBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var parent = this.closest('.has-dropdown');
                            if (parent) {
                                var isOpen = parent.classList.toggle('is-open');
                                this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                            }
                        });

                        currentParent.appendChild(toggleBtn);
                        currentParent.appendChild(currentDropdown);
                    }
                }
                var a = li.querySelector('a');
                if (a) {
                    a.textContent = label.trim().substring(2);
                }
                if (currentDropdown) {
                    currentDropdown.appendChild(li);
                }
            } else {
                currentParent = li;
                currentDropdown = null;
            }
            li.removeAttribute('data-label');
        });

        // Group excess items into "View More" dropdown
        var topLevelItems = Array.prototype.slice.call(nav.children);
        var maxVisible = 5;
        
        if (topLevelItems.length > maxVisible) {
            var moreLi = document.createElement('li');
            moreLi.className = 'nav-item has-dropdown nav-more';
            moreLi.innerHTML = '<a href="#">View More</a>' +
                '<button class="nav-dropdown-toggle" aria-expanded="false">' +
                '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                '</button>';
                
            var moreUl = document.createElement('ul');
            moreUl.className = 'nav-dropdown-menu';
            moreLi.appendChild(moreUl);
            
            for (var i = maxVisible; i < topLevelItems.length; i++) {
                moreUl.appendChild(topLevelItems[i]);
            }
            
            var moreBtn = moreLi.querySelector('.nav-dropdown-toggle');
            if (moreBtn) {
                moreBtn.setAttribute('aria-label', 'Toggle view more menu');
                moreBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var isOpen = moreLi.classList.toggle('is-open');
                    this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                });
            }

            nav.appendChild(moreLi);
        }
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    // GHOST GALLERY LOGIC
    const isSliderPage = !!document.querySelector('[data-slider-gallery]');

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
        const root = heroRawGallery.content || heroRawGallery;
        const galleryImages = root.querySelectorAll('.kg-gallery-image img, .kg-image-card img');
        const wasEmpty = heroSliderContainer.querySelectorAll('.slide').length === 0;
        
        if (galleryImages.length > 0) {
            galleryImages.forEach((img, index) => {
                const slide = document.createElement('div');
                slide.className = 'slide' + (wasEmpty && index === 0 ? ' active' : '');
                const newImg = document.createElement('img');
                newImg.src = img.src;
                if (img.srcset) newImg.srcset = img.srcset;
                if (img.sizes) newImg.sizes = img.sizes;
                newImg.alt = img.alt || '';
                newImg.loading = (wasEmpty && index === 0) ? 'eager' : 'lazy';
                if (img.width) newImg.width = img.width;
                if (img.height) newImg.height = img.height;
                slide.appendChild(newImg);
                heroSliderContainer.appendChild(slide);
            });
        } else {
            // Fallback if no images found
            if (heroSliderContainer.querySelectorAll('.slide').length === 0) {
                heroSliderContainer.innerHTML = '<div class="slide active" style="background-color: #111;"></div>';
            }
        }
    }

    // Hero Slider Initialization
    const slides = document.querySelectorAll('#hero-slider-container .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const btnNext = document.getElementById('slider-next');
        const btnPrev = document.getElementById('slider-prev');
        const btnPause = document.getElementById('slider-pause');
        const hero = document.querySelector('.hero-slider');

        function showSlide(index) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        if (btnNext) btnNext.addEventListener('click', () => showSlide(currentSlide + 1));
        if (btnPrev) btnPrev.addEventListener('click', () => showSlide(currentSlide - 1));

        // Three separate reasons to stop; the slideshow runs only when none apply.
        let pausedByUser = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let pausedByHover = false;
        let pausedByFocus = false;
        let timer = null;

        function sync() {
            const shouldRun = !pausedByUser && !pausedByHover && !pausedByFocus;
            if (shouldRun && !timer) {
                timer = setInterval(() => showSlide(currentSlide + 1), 5000);
            } else if (!shouldRun && timer) {
                clearInterval(timer);
                timer = null;
            }
            // The button reflects only the user's choice, never hover/focus.
            if (btnPause) {
                const label = pausedByUser ? 'Play slideshow' : 'Pause slideshow';
                btnPause.textContent = pausedByUser ? '▶️' : '⏸️';
                btnPause.setAttribute('aria-label', label);
                btnPause.setAttribute('title', label);
            }
        }

        if (hero) {
            hero.addEventListener('mouseenter', () => { pausedByHover = true; sync(); });
            hero.addEventListener('mouseleave', () => { pausedByHover = false; sync(); });
            // Only keyboard focus pauses; a mouse click on a button doesn't.
            hero.addEventListener('focusin', (e) => {
                if (e.target.matches(':focus-visible')) { pausedByFocus = true; sync(); }
            });
            hero.addEventListener('focusout', (e) => {
                if (!hero.contains(e.relatedTarget)) { pausedByFocus = false; sync(); }
            });
        }

        if (btnPause) {
            btnPause.addEventListener('click', () => {
                pausedByUser = !pausedByUser;
                // Pressing Play is explicit: start right away, even while hovered.
                if (!pausedByUser) { pausedByHover = false; pausedByFocus = false; }
                sync();
            });
        }

        sync();
    }


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
        function openMobileMenu() {
            mobileMenuOverlay.classList.add('is-open');
            mobileMenuOverlay.setAttribute('aria-hidden', 'false');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            mobileMenuToggle.innerHTML = '✕';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        function closeMobileMenu() {
            mobileMenuOverlay.classList.remove('is-open');
            mobileMenuOverlay.setAttribute('aria-hidden', 'true');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.innerHTML = '☰';
            document.body.style.overflow = '';
            mobileMenuOverlay.querySelectorAll('.has-dropdown.is-open').forEach(openDropdown => {
                openDropdown.classList.remove('is-open');
                const btn = openDropdown.querySelector('.nav-dropdown-toggle');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
            mobileMenuToggle.focus();
        }

        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuOverlay.classList.contains('is-open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('is-open')) {
                closeMobileMenu();
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

    // Species Directory live filter (one per directory, so duplicates work)
    document.querySelectorAll('.species-directory').forEach(dir => {
        const input = dir.querySelector('.species-search');
        const cards = dir.querySelectorAll('.species-card');
        if (!input) return;
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            cards.forEach(card => {
                const searchData = (card.getAttribute('data-search') || '').toLowerCase();
                card.style.display = searchData.includes(term) ? '' : 'none';
            });
        });
    });

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
