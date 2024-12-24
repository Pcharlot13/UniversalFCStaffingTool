import { renderAreas } from './ExportRenders.js';
import { areasData } from './sharedData.js';

export function updateAreasData() {
    localStorage.setItem('areasData', JSON.stringify(areasData));
}

export function deleteArea(index) {
    if (isNaN(index) || index < 0 || index >= areasData.length) {
        console.error(`Invalid area index: ${index}`);
        return;
    }
    areasData.splice(index, 1);
    localStorage.setItem('areasData', JSON.stringify(areasData));
    renderAreas();
}