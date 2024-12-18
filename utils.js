import { renderAreas } from './modals.js';

export function updateAreasData() {
    localStorage.setItem('areasData', JSON.stringify(areasData));
}

export function deleteArea(index) {
    areasData.splice(index, 1);
    updateAreasData();
    renderAreas();
}