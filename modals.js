/**
 * Show a confirmation modal for deleting an item.
 * @param {string} message - The confirmation message to display.
 * @param {function} onDelete - The callback function to execute on confirmation.
 */
function showDeleteConfirmationModal(message, onDelete) {
    try {
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        document.getElementById('deleteConfirmationMessage').textContent = message;
        document.getElementById('confirmDeleteButton').onclick = function() {
            onDelete();
            deleteModal.hide();
        };
        deleteModal.show();
    } catch (error) {
        console.error('Error showing delete confirmation modal:', error);
    }
}

/**
 * Show a modal for adding a new station.
 * @param {function} onAdd - The callback function to execute on adding a new station.
 */
function showAddStationModal(onAdd) {
    try {
        const addStationModal = new bootstrap.Modal(document.getElementById('addStationModal'));
        const stationNameInput = document.getElementById('stationNameInput');
        stationNameInput.value = '';
        document.getElementById('confirmAddStationButton').onclick = function() {
            const stationName = stationNameInput.value.trim();
            if (stationName) {
                onAdd(stationName);
                addStationModal.hide();
            } else {
                alert('Please enter a station name.');
            }
        };
        addStationModal.show();
    } catch (error) {
        console.error('Error showing add station modal:', error);
    }
}

/**
 * Show a modal for assigning an associate to a station.
 * @param {number} stationIndex - The index of the station.
 * @param {number} areaIndex - The index of the area.
 */
function showAssignAssociateModal(stationIndex, areaIndex) {
    try {
        const assignAssociateModal = new bootstrap.Modal(document.getElementById('assignAssociateModal'));
        const associateSelect = document.getElementById('associateSelect');
        associateSelect.innerHTML = '';

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
                updateAreasData();
                renderAreas();
                assignAssociateModal.hide();
            } else {
                alert('Please select an associate.');
            }
        };

        assignAssociateModal.show();
    } catch (error) {
        console.error('Error showing assign associate modal:', error);
    }
}

/**
 * Show a modal for removing an associate from a station.
 * @param {number} stationIndex - The index of the station.
 * @param {number} areaIndex - The index of the area.
 */
function showRemoveAssociateModal(stationIndex, areaIndex) {
    try {
        const removeAssociateModal = new bootstrap.Modal(document.getElementById('removeAssociateModal'));
        const associateSelect = document.getElementById('removeAssociateSelect');
        associateSelect.innerHTML = '';

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
                updateAreasData();
                renderAreas();
                removeAssociateModal.hide();
            } else {
                alert('Please select an associate.');
            }
        };

        removeAssociateModal.show();
    } catch (error) {
        console.error('Error showing remove associate modal:', error);
    }
}

/**
 * Show a warning modal with a confirmation and cancellation option.
 * @param {string} message - The warning message to display.
 * @param {function} onConfirm - The callback function to execute on confirmation.
 * @param {function} onCancel - The callback function to execute on cancellation.
 */
function showWarningModal(message, onConfirm, onCancel) {
    try {
        const warningModal = new bootstrap.Modal(document.getElementById('warningModal'));
        document.getElementById('warningMessage').textContent = message;
        document.getElementById('confirmWarningButton').onclick = function() {
            onConfirm();
            warningModal.hide();
        };
        document.getElementById('cancelWarningButton').onclick = function() {
            onCancel();
            warningModal.hide();
        };
        warningModal.show();
    } catch (error) {
        console.error('Error showing warning modal:', error);
    }
}
