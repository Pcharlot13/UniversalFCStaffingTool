import { updateAreasData } from './utils.js';
import { renderAreas } from './render.js';

export function showDeleteConfirmationModal(message, onDelete) {
    // ...existing code...
}

export function showAddStationModal(onAdd) {
    // ...existing code...
}

export function showAssignAssociateModal(stationIndex, areaIndex, areasData, container, rosterData, colors) {
    const assignAssociateModal = new bootstrap.Modal(document.getElementById('assignAssociateModal'));
    const associateSelect = document.getElementById('associateSelect');
    associateSelect.innerHTML = ''; // Clear the select options

    areasData[areaIndex].associates.forEach((associate, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = associate.name;
        associateSelect.appendChild(option);
    });

    document.getElementById('confirmAssignAssociateButton').onclick = function() {
        const selectedAssociateIndex = associateSelect.value;
        if (selectedAssociateIndex !== '') {
            const associate = areasData[areaIndex].associates[selectedAssociateIndex];
            areasData[areaIndex].stations[stationIndex].associates.push(associate);
            updateAreasData(areasData);
            renderAreas(container, areasData, rosterData, colors);
            assignAssociateModal.hide();
        } else {
            alert('Please select an associate.');
        }
    };

    assignAssociateModal.show();
}

export function showRemoveAssociateModal(stationIndex, areaIndex, areasData, container, rosterData, colors) {
    const removeAssociateModal = new bootstrap.Modal(document.getElementById('removeAssociateModal'));
    const associateSelect = document.getElementById('removeAssociateSelect');
    associateSelect.innerHTML = ''; // Clear the select options

    areasData[areaIndex].stations[stationIndex].associates.forEach((associate, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = associate.name;
        associateSelect.appendChild(option);
    });

    document.getElementById('confirmRemoveAssociateButton').onclick = function() {
        const selectedAssociateIndex = associateSelect.value;
        if (selectedAssociateIndex !== '') {
            areasData[areaIndex].stations[stationIndex].associates.splice(selectedAssociateIndex, 1);
            updateAreasData(areasData);
            renderAreas(container, areasData, rosterData, colors);
            removeAssociateModal.hide();
        } else {
            alert('Please select an associate.');
        }
    };

    removeAssociateModal.show();
}

export function showWarningModal(message, onConfirm, onCancel) {
    // ...existing code...
}
