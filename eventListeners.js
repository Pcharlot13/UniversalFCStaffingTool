import { initializeAreaButtons } from './areaButtons.js';

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    let areasData = JSON.parse(localStorage.getItem('areasData')) || [];
    let rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];
    const colors = ['bg-dark-blue', 'bg-dark-cyan', 'bg-dark-teal', 'bg-dark-navy', 'bg-dark-slate', 'bg-dark-steel', 'bg-dark-azure', 'bg-dark-indigo'];

    function showDeleteConfirmationModal(message, onDelete) {
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        document.getElementById('deleteConfirmationMessage').textContent = message;
        document.getElementById('confirmDeleteButton').onclick = function() {
            onDelete();
            deleteModal.hide(); // Close the modal after deletion
        };
        deleteModal.show();
    }

    function showAddStationModal(onAdd) {
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

    function showAssignAssociateModal(stationIndex, areaIndex) {
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

    function showRemoveAssociateModal(stationIndex, areaIndex) {
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

    function showWarningModal(message, onConfirm, onCancel) {
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

    // Function to render areas
    function renderAreas() {
        container.innerHTML = '';
        areasData.forEach((area, index) => {
            if (!area.stations) {
                area.stations = [];
            }
            const newArea = document.createElement('div');
            const associateCount = area.associates.length;
            const areaSizeClass = associateCount > 0 ? `col-md-${Math.min(associateCount * 2, 12)}` : 'col-md-6';
            newArea.className = `mt-3 p-3 text-white draggable-area ${areaSizeClass} ${colors[index % colors.length]}`;
            newArea.setAttribute('data-index', index);
            newArea.innerHTML = `
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex flex-row">
                        <button class="btn btn-light newAAButton" data-index="${index}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add a new associate">+</button>
                        <button class="btn btn-light actionButton1" data-index="${index}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Open Stations"><i class="bi bi-gear"></i></button>
                        <button class="btn btn-light actionButton2" data-index="${index}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Delete this area"><i class="bi bi-trash"></i></button>
                        <button class="btn btn-light removeAssociatesButton" data-index="${index}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove associates"><i class="bi bi-x-circle"></i></button>
                    </div>
                </div>
                <h3 class="mt-2">${area.title}</h3>
                <div class="areaContent mt-3"></div>
            `;

            const areaContent = newArea.querySelector('.areaContent');
            area.associates.forEach(associate => {
                if (associate) {
                    const associateCard = createAssociateCard(associate);
                    areaContent.appendChild(associateCard);
                }
            });

            container.appendChild(newArea);

            // Initialize tooltips for dynamically created buttons
            var tooltipTriggerList = [].slice.call(newArea.querySelectorAll('[data-bs-toggle="tooltip"]'));
            var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });

            // Initialize area buttons
            initializeAreaButtons(newArea, index, areaContent);

            // Add drag and drop event listeners to the area content
            areaContent.addEventListener('dragover', handleAssociateDragOver);
            areaContent.addEventListener('drop', function(e) {
                handleAssociateDrop(e, index, areaContent);
            });
        });
    }

    function createAssociateCard(associate) {
        if (!associate) return null;

        const card = document.createElement('div');
        card.className = 'card text-white bg-dark mb-3 text-center draggable-associate';
        card.style.width = '12rem'; // Reduced width
        card.innerHTML = `
            <div class="card-body" draggable="true" data-badge-number="${associate.badgeNumber}">
                <h4 class="card-title moveable" style="font-size: 1.5rem; white-space: normal; overflow: visible;">
                    <i class="bi bi-clipboard copy-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="
                        ${associate.name}
                        ${associate.badgeNumber}
                        ${associate.login}
                    " data-copy="${associate.name}, ${associate.badgeNumber}, ${associate.login}"></i>
                    ${associate.name}
                </h4>
            </div>
        `;

        // Add drag and drop event listeners to the card body
        const cardBody = card.querySelector('.card-body');
        cardBody.addEventListener('dragstart', handleAssociateDragStart);
        cardBody.addEventListener('dragover', handleAssociateDragOver);
        cardBody.addEventListener('drop', handleAssociateDrop);
        cardBody.addEventListener('dragend', handleAssociateDragEnd);

        // Initialize tooltip
        const tooltipTrigger = card.querySelector('[data-bs-toggle="tooltip"]');
        new bootstrap.Tooltip(tooltipTrigger, {
            delay: { show: 1500, hide: 2000 },
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner text-start"></div></div>'
        });

        // Add event listener to copy icon
        tooltipTrigger.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy);
        });

        return card;
    }

    function addAssociate(badgeNumber, login, name, index, areaContent) {
        const associate = { badgeNumber, login, name };
        const associateCard = createAssociateCard(associate);
        areaContent.appendChild(associateCard);

        // Save to areasData and localStorage
        areasData[index].associates.push(associate);
        localStorage.setItem('areasData', JSON.stringify(areasData));
    }

    function handleAssociateDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.getAttribute('data-badge-number'));
        this.classList.add('dragging');
    }

    function handleAssociateDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
    }

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

    function handleAssociateDragEnd() {
        this.classList.remove('dragging');
        document.querySelectorAll('.drag-over').forEach(element => {
            element.classList.remove('drag-over');
        });
    }

    function updateAreasData() {
        localStorage.setItem('areasData', JSON.stringify(areasData));
    }

    function deleteArea(index) {
        areasData.splice(index, 1);
        updateAreasData();
        renderAreas();
    }

    // Render the saved areas on page load
    renderAreas();

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});