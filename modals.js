export function showDeleteConfirmationModal(message, onDelete) {
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    document.getElementById('deleteConfirmationMessage').textContent = message;
    document.getElementById('confirmDeleteButton').onclick = function() {
        onDelete();
        deleteModal.hide(); // Close the modal after deletion
    };
    deleteModal.show();
}

export function showAddStationModal(onAdd) {
    const addStationModal = new bootstrap.Modal(document.getElementById('addStationModal'));
    const stationNameInput = document.getElementById('stationNameInput');
    stationNameInput.value = ''; // Clear the input field
    document.getElementById('confirmAddStationButton').onclick = function() {
        const stationName = stationNameInput.value.trim();
        if (stationName) {
            onAdd(stationName);
            addStationModal.hide(); // Close the modal after adding
        } else {
            alert('Please enter a station name.');
        }
    };
    document.getElementById('addStationModal').addEventListener('hidden.bs.modal', function () {
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop').remove();
    });
    addStationModal.show();
}

export function showAssignAssociateModal(stationIndex, areaIndex) {
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
            updateAreasData();
            renderAreas();
            assignAssociateModal.hide();
        } else {
            alert('Please select an associate.');
        }
    };

    assignAssociateModal.show();
}

export function showRemoveAssociateModal(stationIndex, areaIndex) {
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
            updateAreasData();
            renderAreas();
            removeAssociateModal.hide();
        } else {
            alert('Please select an associate.');
        }
    };

    removeAssociateModal.show();
}

export function showWarningModal(message, onConfirm, onCancel) {
    const warningModal = new bootstrap.Modal(document.getElementById('warningModal'));
    document.getElementById('warningMessage').textContent = message;
    document.getElementById('confirmWarningButton').onclick = function() {
        onConfirm();
        warningModal.hide(); // Close the modal after confirmation
    };
    document.getElementById('cancelWarningButton').onclick = function() {
        onCancel();
        warningModal.hide(); // Close the modal after cancellation
    };
    warningModal.show();
}