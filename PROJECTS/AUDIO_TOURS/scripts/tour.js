document.addEventListener("DOMContentLoaded", function() {
    const tabLinks = document.querySelectorAll('.tourTabs li');
    const tabs = document.querySelectorAll('.tourTabContent');

    tabLinks.forEach((tabLink) => {
        tabLink.addEventListener('click', function(e) {
            e.preventDefault();  // Prevent default tab behavior (like page reload)

            // Remove active class from all tabs and tab contents
            tabLinks.forEach(link => link.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));

            // Add active class to the clicked tab and the corresponding content
            const target = this.querySelector('a').getAttribute('href');
            this.classList.add('active');
            document.querySelector(target).classList.add('active');
        }, { passive: false });  // Ensure the event listener is non-passive
    });
});

// SVG PanZoom and gutter code remains the same...

let gutterWidth = null;
let gutterHeight = null;

// Calculate gutter width and height based on the container and SVG sizes
function calculateGutters() {
    const sizes = window.panZoom.getSizes();

    const containerWidth = sizes.width;
    const containerHeight = sizes.height;

    const svgWidth = sizes.viewBox.width * sizes.realZoom;
    const svgHeight = sizes.viewBox.height * sizes.realZoom;

    gutterWidth = containerWidth - ((containerWidth - svgWidth) / 2);
    gutterHeight = containerHeight - ((containerHeight - svgHeight) / 2);
}

// Function to handle panning limits
function beforePan(oldPan, newPan) {
    const sizes = window.panZoom.getSizes();

    // Compute limits based on pre-calculated gutterWidth and gutterHeight
    const leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth;
    const rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom);
    const topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight;
    const bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom);

    // Constrain panning to within the limits
    const customPan = {
        x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
        y: Math.max(topLimit, Math.min(bottomLimit, newPan.y))
    };

    return customPan;
}

// Initialize the SVG panZoom instance
function initializePanZoom() {
    window.panZoom = svgPanZoom('#tourMap', {
        zoomEnabled: true,
        zoomScaleSensitivity: 0.5,
        minZoom: 1,
        maxZoom: 9,
        controlIconsEnabled: false,
        fit: 1,
        center: 1,
        beforePan: beforePan // Set beforePan as the custom pan handler
    });

    calculateGutters(); // Initial gutter calculation
}

// Event listener for window resize to recalculate gutters and reset pan/zoom
function onWindowResize() {
    gutterWidth = null;  // Reset the gutters so they are recalculated
    gutterHeight = null;
    
    window.panZoom.resize(); // Update the SVG size
    window.panZoom.fit();    // Fit the SVG within the container
    window.panZoom.center(); // Center the SVG
    
    calculateGutters();      // Recalculate the gutters after resizing
}

// Initialize the SVG panZoom functionality on window load
window.onload = initializePanZoom;

// Add event listener to handle resizing the window
window.addEventListener('resize', onWindowResize);