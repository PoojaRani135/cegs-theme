document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider
    const slides = document.querySelectorAll('.slide');
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

    // LAYOUT: Navigation Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parentLi = toggle.closest('.has-dropdown');
            
            // Close other open dropdowns first
            document.querySelectorAll('.has-dropdown.is-open').forEach(openDropdown => {
                if (openDropdown !== parentLi) {
                    openDropdown.classList.remove('is-open');
                    openDropdown.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
                }
            });

            const isOpen = parentLi.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-dropdown')) {
            document.querySelectorAll('.has-dropdown.is-open').forEach(openDropdown => {
                openDropdown.classList.remove('is-open');
                openDropdown.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
            });
        }
    });

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
