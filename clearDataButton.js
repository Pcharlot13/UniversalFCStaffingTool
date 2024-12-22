import { renderAreas } from './ExportRenders.js';
import { areasData, rosterData } from './sharedData.js';

document.getElementById('clearDataButton').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all data?")) {
        localStorage.removeItem('areasData');
        localStorage.removeItem('rosterData');
        areasData.length = 0;
        rosterData.length = 0;
        renderAreas();
    }
});
