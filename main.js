import { renderAreas } from './ExportRenders.js';
import { areasData, rosterData, colors } from './sharedData.js';
import './eventListeners.js';
import './presetsButton.js';
import './startSessionButton.js';
import './clearDataButton.js';

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');

    // Render the saved areas on page load
    renderAreas();

    // Initialize event listeners
});