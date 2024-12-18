// Declare variables in the global scope
let areasData = JSON.parse(localStorage.getItem('areasData')) || [];
let rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];
const colors = ['bg-dark-blue', 'bg-dark-cyan', 'bg-dark-teal', 'bg-dark-navy', 'bg-dark-slate', 'bg-dark-steel', 'bg-dark-azure', 'bg-dark-indigo'];

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');

    // Render the saved areas on page load
    renderAreas();

    // Initialize event listeners
    // ...existing code to initialize event listeners...
});Ca