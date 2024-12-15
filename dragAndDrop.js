/**
 * Handle the drag start event for an associate.
 * @param {Event} e - The drag event.
 */
function handleAssociateDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.getAttribute('data-badge-number'));
    this.classList.add('dragging');
}

/**
 * Handle the drag over event for an associate.
 * @param {Event} e - The drag event.
 */
function handleAssociateDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

/**
 * Handle the drop event for an associate.
 * @param {Event} e - The drop event.
 * @param {number} targetAreaIndex - The index of the target area.
 * @param {HTMLElement} areaContent - The content element of the target area.
 */
function handleAssociateDrop(e, targetAreaIndex, areaContent) {
    e.stopPropagation();
    e.preventDefault();
    const draggedBadgeNumber = e.dataTransfer.getData('text/plain');

    if (targetAreaIndex < 0 || targetAreaIndex >= areasData.length) {
        console.error('Invalid target area index:', targetAreaIndex);
        return;
    }

    const targetArea = areasData[targetAreaIndex];

    if (!targetArea) {
        console.error('Target area is undefined');
        return;
    }

    const draggedAssociate = areasData.flatMap(area => area.associates).find(associate => associate.badgeNumber === draggedBadgeNumber);
    if (draggedAssociate) {
        // Remove the associate from the previous area
        areasData.forEach(area => {
            area.associates = area.associates.filter(associate => associate.badgeNumber !== draggedBadgeNumber);
        });

        // Add the associate to the new area
        targetArea.associates.push(draggedAssociate);
        updateAreasData();
        renderAreas();
    }

    if (this.classList) {
        this.classList.remove('drag-over');
    }
}

/**
 * Handle the drag end event for an associate.
 */
function handleAssociateDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(element => {
        element.classList.remove('drag-over');
    });
}
