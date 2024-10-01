document.addEventListener("DOMContentLoaded", function() {
    const tabLinks = document.querySelectorAll('.tourTabs li');
    const tabs = document.querySelectorAll('.tourTabContent');

    tabLinks.forEach((tabLink) => {
        tabLink.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all tabs and tab contents
            tabLinks.forEach(link => link.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));

            // Add active class to the clicked tab and the corresponding content
            const target = this.querySelector('a').getAttribute('href');
            this.classList.add('active');
            document.querySelector(target).classList.add('active');
        });
    });
});


// Initialize Panzoom on the image
const elem = document.getElementById('map-image');
const panzoom = Panzoom(elem, {
    maxScale: 5, // Maximum zoom level
    contain: 'outside' // Restrict panning beyond the image
});

// Enable mousewheel zoom
elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);


