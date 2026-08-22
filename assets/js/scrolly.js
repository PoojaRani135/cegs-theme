document.addEventListener("DOMContentLoaded", () => {
    // 1. Content Parsing
    const rawContentDiv = document.getElementById("case-raw-content");
    if (rawContentDiv) {
        const htmlStr = rawContentDiv.innerHTML;
        // Split by the HTML comment convention
        const acts = {
            geology: /<!--\s*section:\s*geology\s*-->([\s\S]*?)(?=<!--\s*section:|$)/i,
            scale: /<!--\s*section:\s*scale\s*-->([\s\S]*?)(?=<!--\s*section:|$)/i,
            biodiversity: /<!--\s*section:\s*biodiversity\s*-->([\s\S]*?)(?=<!--\s*section:|$)/i,
            threats: /<!--\s*section:\s*threats\s*-->([\s\S]*?)(?=<!--\s*section:|$)/i,
        };

        const injectContent = (key, selector) => {
            const match = htmlStr.match(acts[key]);
            const stepEl = document.querySelector(`${selector} .card-content`);
            if (match && stepEl) {
                stepEl.innerHTML = match[1].trim();
            }
        };

        injectContent('geology', '#step-geology');
        injectContent('scale', '#step-scale');
        injectContent('biodiversity', '#step-biodiversity');
        injectContent('threats', '#step-threats');
    }

    // Parse Stats Content
    const statsRawDiv = document.getElementById("stats-raw-content");
    if (statsRawDiv) {
        // Find all strong/b tags which contain the numbers
        const statElements = Array.from(statsRawDiv.querySelectorAll("strong, b")).map(el => el.textContent.trim());
        
        // Ensure we have fallback text if the page isn't set up
        const statsText = [
            statElements[0] || "1,750 km",
            statElements[1] || "75,000 km²",
            statElements[2] || "5 states",
            statElements[3] || "105 species",
            statElements[4] || "3,200+ plants"
        ];

        // Inject into markers
        const m1 = document.querySelector("#marker-1 span"); if (m1) m1.textContent = statsText[0];
        const m2 = document.querySelector("#marker-2 span"); if (m2) m2.textContent = statsText[1];
        const m3 = document.querySelector("#marker-3 span"); if (m3) m3.textContent = statsText[2];
        const m4 = document.querySelector("#marker-bio-1 span"); if (m4) m4.textContent = statsText[3];
        const m5 = document.querySelector("#marker-bio-2 span"); if (m5) m5.textContent = statsText[4];
    }

    // 2. GSAP ScrollTrigger Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            // Ensure initial states
            gsap.set("#layer-rock", { yPercent: 15, opacity: 0, scale: 0.95 });
            gsap.set("#hill-path-line", { strokeDasharray: 2000, strokeDashoffset: 2000 });
            gsap.set("#layer-hill", { opacity: 0 });
            gsap.set("#layer-foliage-back", { scale: 0.7, opacity: 0, yPercent: 20 });
            gsap.set("#layer-foliage-front", { scale: 1.1, opacity: 0, yPercent: 30 });
            gsap.set(".stat-marker", { opacity: 0, scale: 0, y: 20 });

            // Setup common step trigger for active class (text card styling)
            gsap.utils.toArray('.scrolly-step').forEach((step, i) => {
                ScrollTrigger.create({
                    trigger: step,
                    start: "top center",
                    end: "bottom center",
                    onToggle: self => {
                        if (self.isActive) {
                            step.classList.add('is-active');
                        } else {
                            step.classList.remove('is-active');
                        }
                    }
                });
            });

            // ACT 1: GEOLOGY
            gsap.to("#layer-rock", {
                scrollTrigger: {
                    trigger: "#step-geology",
                    start: "top 75%",
                    end: "bottom center",
                    scrub: 1.5 // Smoother scrubbing
                },
                yPercent: 0,
                opacity: 1,
                scale: 1,
                ease: "power2.out"
            });

            // ACT 2: SCALE
            const tlScale = gsap.timeline({
                scrollTrigger: {
                    trigger: "#step-scale",
                    start: "top 60%",
                    end: "bottom center",
                    scrub: 1.5
                }
            });
            tlScale.to("#layer-hill", { opacity: 1, duration: 0.2 })
                   .to("#hill-path-line", { strokeDashoffset: 0, duration: 2, ease: "power1.inOut" })
                   .to("#marker-1", { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, "-=1.5")
                   .to("#marker-2", { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, "-=1.0")
                   .to("#marker-3", { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, "-=0.5");

            // ACT 3: BIODIVERSITY (Foliage Parallax)
            const tlBio = gsap.timeline({
                scrollTrigger: {
                    trigger: "#step-biodiversity",
                    start: "top 60%",
                    end: "bottom center",
                    scrub: 1.5
                }
            });
            tlBio.to("#layer-foliage-back", { scale: 1, opacity: 1, yPercent: 0, duration: 2, ease: "power2.out" }, 0)
                 .to("#layer-foliage-front", { scale: 1, opacity: 1, yPercent: 0, duration: 2, ease: "power2.out" }, 0.5)
                 .to("#marker-bio-1", { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, 1)
                 .to("#marker-bio-2", { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, 1.5);

            // ACT 4: THREATS (The Gap)
            gsap.to("#scrolly-overlay", {
                scrollTrigger: {
                    trigger: "#step-threats",
                    start: "top center",
                    end: "bottom center",
                    scrub: 1.5
                },
                opacity: 1,
                ease: "power2.inOut"
            });
        }
    }
});
