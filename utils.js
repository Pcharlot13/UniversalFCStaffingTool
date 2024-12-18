function updateAreasData() {
    localStorage.setItem('areasData', JSON.stringify(areasData));
}

function deleteArea(index) {
    areasData.splice(index, 1);
    updateAreasData();
    renderAreas();
}