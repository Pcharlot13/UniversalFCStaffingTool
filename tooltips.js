/**
 * Initialize Bootstrap tooltips for elements with the data-bs-toggle="tooltip" attribute.
 */
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize tooltips on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeTooltips);
