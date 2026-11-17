(function () {
    function initPubSearch() {
        const searchInput = document.getElementById('pub-search');
        const pubItems = document.querySelectorAll('.publication-item');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                const term = searchInput.value.toLowerCase();
                pubItems.forEach(item => {
                    const searchData = (item.getAttribute('data-search') || '').toLowerCase();
                    item.style.display = searchData.includes(term) ? '' : 'none';
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPubSearch);
    } else {
        initPubSearch();
    }
})();

