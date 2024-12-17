import { renderAreas } from './render.js';

export function updateAreasData(areasData) {
    localStorage.setItem('areasData', JSON.stringify(areasData));
}

export function deleteArea(index, areasData, container, rosterData, colors) {
    areasData.splice(index, 1);
    updateAreasData(areasData);
    renderAreas(container, areasData, rosterData, colors);
}