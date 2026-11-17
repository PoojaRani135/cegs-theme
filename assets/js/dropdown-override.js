document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Target only the arrow button and the "View More" item in the mobile menu
        const mobileDropdownLinks = document.querySelectorAll(
            '.mobile-menu-overlay .has-dropdown > button, .mobile-menu-overlay .nav-more > a'
        );
        
        mobileDropdownLinks.forEach(link => {
            // Clone to remove the original click event listener injected by Ghost
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent document-level click handlers from immediately closing it
                
                const parent = this.closest('.has-dropdown');
                const wasOpen = parent.classList.contains('is-open');
                
                // Close all other open dropdowns in the mobile menu
                document.querySelectorAll('.mobile-menu-overlay .has-dropdown.is-open').forEach(openDropdown => {
                    if (openDropdown !== parent) {
                        openDropdown.classList.remove('is-open');
                        const toggleBtn = openDropdown.querySelector('.nav-dropdown-toggle');
                        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle the clicked one
                const toggleBtn = parent.querySelector('.nav-dropdown-toggle');
                if (wasOpen) {
                    parent.classList.remove('is-open');
                    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
                } else {
                    parent.classList.add('is-open');
                    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }, 100);
});
