document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Target all dropdown parent links AND buttons in the mobile menu
        const mobileDropdownLinks = document.querySelectorAll('.mobile-menu-overlay .has-dropdown > a, .mobile-menu-overlay .has-dropdown > button');
        
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
                    }
                });
                
                // Toggle the clicked one
                if (wasOpen) {
                    parent.classList.remove('is-open');
                } else {
                    parent.classList.add('is-open');
                }
            });
        });
    }, 100);
});
