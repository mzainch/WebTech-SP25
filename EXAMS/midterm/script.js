document.addEventListener('DOMContentLoaded', function() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const iframe = document.getElementById('iframe-viewer'); 

    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); 

            const src = item.getAttribute('data-src');
            iframe.src = src;
        });
    });
});
