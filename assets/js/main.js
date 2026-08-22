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
            const card = e.target.closest('.field-journal-card');
            if (card.classList.contains('expanded')) {
                card.classList.remove('expanded');
                e.target.innerHTML = 'Read Bio &rarr;';
            } else {
                card.classList.add('expanded');
                e.target.innerHTML = 'Close Bio &uarr;';
            }
        });
    });
});
