import { showAssignAssociateModal, showRemoveAssociateModal, showWarningModal, showDeleteConfirmationModal } from './modals.js';
import { updateAreasData, deleteArea } from './utils.js';
import { renderAreas } from './render.js';

export function initializeAreaButtons(newArea, index, areaContent) {
    const actionButton1 = newArea.querySelector('.actionButton1');
    const actionButton2 = newArea.querySelector('.actionButton2');
    const removeAssociatesButton = newArea.querySelector('.removeAssociatesButton');
    const newAAButton = newArea.querySelector('.newAAButton');

    // Add event listener to the plus sign button
    newAAButton.addEventListener('click', function() {
        const badgeNumber = prompt("Badge Number?");
        if (badgeNumber !== null) {
            const trimmedBadgeNumber = badgeNumber.trim();
            const matchedEntry = rosterData.find(entry => String(entry.badgeNumber).trim() === trimmedBadgeNumber);

            let login, name;
            if (matchedEntry) {
                login = matchedEntry.login;
                name = matchedEntry.name;
                addAssociate(trimmedBadgeNumber, login, name, index, areaContent);
            } else {
                document.getElementById('badgeNumberInput').value = trimmedBadgeNumber;
                const associateModal = new bootstrap.Modal(document.getElementById('associateModal'));
                associateModal.show();

                document.getElementById('saveAssociateButton').addEventListener('click', function() {
                    login = document.getElementById('loginInput').value.trim();
                    name = document.getElementById('nameInput').value.trim();

                    if (login && name) {
                        addAssociate(trimmedBadgeNumber, login, name, index, areaContent);
                        // Update roster data
                        rosterData.push({ badgeNumber: trimmedBadgeNumber, login, name });
                        localStorage.setItem('rosterData', JSON.stringify(rosterData));
                        associateModal.hide();
                        // Clear input fields after saving
                        document.getElementById('badgeNumberInput').value = '';
                        document.getElementById('loginInput').value = '';
                        document.getElementById('nameInput').value = '';
                    } else {
                        alert('Please fill in both Login and Name fields.');
                    }
                }, { once: true });
            }
        }
    });

    // Add drag and drop event listeners to the plus sign button
    newAAButton.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
    });

    newAAButton.addEventListener('drop', function(e) {
        handleAssociateDrop(e, index, areaContent);
    });

    // Add event listeners to the new action buttons
    actionButton1.addEventListener('click', function() {
        const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
        const areaIndex = this.getAttribute('data-index');
        const area = areasData[areaIndex];
        const stationsToggle = document.getElementById('stationsToggle');
        const stationsList = document.getElementById('stationsList');
        const addStationButton = document.getElementById('addStationButton');

        stationsToggle.checked = area.stations && area.stations.length > 0;
        stationsList.innerHTML = '';
        if (stationsToggle.checked) {
            area.stations.forEach((station, stationIndex) => {
                const stationItem = document.createElement('li');
                stationItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                stationItem.innerHTML = `
                    <div class="me-2 p-2 ${colors[stationIndex % colors.length]}"></div>
                    <span class="fw-bold">${station}</span>
                    <div>
                        <button class="btn btn-light assignAssociateButton" data-area-index="${areaIndex}" data-station-index="${stationIndex}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Assign associate"><i class="bi bi-plus"></i></button>
                        <button class="btn btn-light removeAssociateButton" data-area-index="${areaIndex}" data-station-index="${stationIndex}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove associate"><i class="bi bi-dash"></i></button>
                        <i class="bi bi-trash remove-station-icon" data-area-index="${areaIndex}" data-station-index="${stationIndex}"></i>
                    </div>
                `;
                stationsList.appendChild(stationItem);

                // Add event listener to the assign associate button
                stationItem.querySelector('.assignAssociateButton').addEventListener('click', function() {
                    const stationIndex = this.getAttribute('data-station-index');
                    const areaIndex = this.getAttribute('data-area-index');
                    showAssignAssociateModal(stationIndex, areaIndex);
                });

                // Add event listener to the remove associate button
                stationItem.querySelector('.removeAssociateButton').addEventListener('click', function() {
                    const stationIndex = this.getAttribute('data-station-index');
                    const areaIndex = this.getAttribute('data-area-index');
                    showRemoveAssociateModal(stationIndex, areaIndex);
                });

                // Add event listener to the remove station icon
                stationItem.querySelector('.remove-station-icon').addEventListener('click', function() {
                    const stationIndex = this.getAttribute('data-station-index');
                    area.stations.splice(stationIndex, 1);
                    updateAreasData();
                    renderAreas();
                    this.parentElement.remove();
                });
            });
        }

        stationsToggle.addEventListener('change', function() {
            if (!this.checked) {
                showWarningModal('Turning off stations will delete all stations. Are you sure?', () => {
                    stationsToggle.checked = false;
                    addStationButton.style.display = 'none';
                    area.stations = [];
                    updateAreasData();
                    stationsList.innerHTML = '';
                }, () => {
                    stationsToggle.checked = true;
                });
            } else {
                addStationButton.style.display = 'inline-block';
            }
        });

        addStationButton.addEventListener('click', function() {
            showAddStationModal(function(stationName) {
                area.stations.push({ name: stationName, associates: [] });
                updateAreasData();
                const stationItem = document.createElement('li');
                stationItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                stationItem.innerHTML = `
                    <div class="me-2 p-2 ${colors[area.stations.length - 1 % colors.length]}"></div>
                    <span class="fw-bold">${stationName}</span>
                    <div>
                        <button class="btn btn-light assignAssociateButton" data-area-index="${areaIndex}" data-station-index="${area.stations.length - 1}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Assign associate"><i class="bi bi-plus"></i></button>
                        <button class="btn btn-light removeAssociateButton" data-area-index="${areaIndex}" data-station-index="${area.stations.length - 1}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove associate"><i class="bi bi-dash"></i></button>
                        <i class="bi bi-trash remove-station-icon" data-area-index="${areaIndex}" data-station-index="${area.stations.length - 1}"></i>
                    </div>
                `;
                stationsList.appendChild(stationItem);

                // Add event listener to the assign associate button
                stationItem.querySelector('.assignAssociateButton').addEventListener('click', function() {
                    const stationIndex = this.getAttribute('data-station-index');
                    const areaIndex = this.getAttribute('data-area-index');
                    showAssignAssociateModal(stationIndex, areaIndex);
                });

                // Add event listener to the remove associate button
                stationItem.querySelector('.removeAssociateButton').addEventListener('click', function() {
                    const stationIndex = this.getAttribute('data-station-index');
                    const areaIndex = this.getAttribute('data-area-index');
                    showRemoveAssociateModal(stationIndex, areaIndex);
                });

                // Add event listener to the remove station icon
                stationItem.querySelector('.remove-station-icon').addEventListener('click', function() {
                    const stationIndex = this.getAttribute('data-station-index');
                    area.stations.splice(stationIndex, 1);
                    updateAreasData();
                    renderAreas();
                    this.parentElement.remove();
                });
            });
        });

        document.querySelectorAll('.remove-station-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const areaIndex = this.getAttribute('data-area-index');
                const stationIndex = this.getAttribute('data-station-index');
                areasData[areaIndex].stations.splice(stationIndex, 1);
                updateAreasData();
                renderAreas();
                this.parentElement.remove();
            });
        });

        document.getElementById('saveSettingsButton').addEventListener('click', function() {
            updateAreasData();
            settingsModal.hide();
        });

        settingsModal.show();
    });

    actionButton2.addEventListener('click', function() {
        showDeleteConfirmationModal('Are you sure you want to delete this area?', () => {
            deleteArea(index);
        });
    });

    // Add event listener to the remove associates button
    removeAssociatesButton.addEventListener('click', function() {
        const areaIndex = this.getAttribute('data-index');
        const removeAssociatesModal = new bootstrap.Modal(document.getElementById('removeAssociatesModal'));
        const associatesList = document.getElementById('associatesList');
        associatesList.innerHTML = '';

        areasData[areaIndex].associates.forEach((associate, associateIndex) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                ${associate.name}
                <i class="bi bi-trash remove-associate-icon" data-area-index="${areaIndex}" data-associate-index="${associateIndex}"></i>
            `;
            associatesList.appendChild(listItem);
        });

        document.querySelectorAll('.remove-associate-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const areaIndex = this.getAttribute('data-area-index');
                const associateIndex = this.getAttribute('data-associate-index');
                showDeleteConfirmationModal('Are you sure you want to delete this associate?', () => {
                    areasData[areaIndex].associates.splice(associateIndex, 1);
                    localStorage.setItem('areasData', JSON.stringify(areasData));
                    renderAreas();
                    // Remove the list item from the modal
                    this.parentElement.remove();
                });
            });
        });

        removeAssociatesModal.show();
    });
}
