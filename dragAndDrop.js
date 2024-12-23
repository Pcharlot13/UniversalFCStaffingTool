import { areasData } from './sharedData.js';
import { updateAreasData } from './utils.js';
import { renderAreas } from './ExportRenders.js';

export function handleAssociateDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.getAttribute('data-badge-number'));
    this.classList.add('dragging');
}

export function handleAssociateDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

export function handleAssociateDrop(e, targetAreaIndex, areaContent) {
    e.stopPropagation();
    e.preventDefault();
    const draggedBadgeNumber = e.dataTransfer.getData('text/plain');

    if (targetAreaIndex < 0 || targetAreaIndex >= areasData.length) {
        showDeleteConfirmationModal(`Area '${areasData[targetAreaIndex].title}' deleted`, () => {});
        return;
    }

    const targetArea = areasData[targetAreaIndex];

    if (!targetArea) {
        showDeleteConfirmationModal(`Area '${areasData[targetAreaIndex].title}' deleted`, () => {});
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

    const dropTarget = e.currentTarget;
    if (dropTarget && dropTarget.classList) {
        dropTarget.classList.remove('drag-over');
    }
}

export function handleAssociateDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(element => {
        element.classList.remove('drag-over');
    });
}

function showDeleteConfirmationModal(message, onDelete) {
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    document.getElementById('deleteConfirmationMessage').textContent = message;
    document.getElementById('confirmDeleteButton').onclick = function() {
        onDelete();
        deleteModal.hide(); // Close the modal after deletion
    };
    deleteModal.show();
}