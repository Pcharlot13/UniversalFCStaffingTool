/**
 * Render the areas on the page.
 */
function renderAreas() {
    try {
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

            var tooltipTriggerList = [].slice.call(newArea.querySelectorAll('[data-bs-toggle="tooltip"]'));
            var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });

            const newAAButton = newArea.querySelector('.newAAButton');
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
                                rosterData.push({ badgeNumber: trimmedBadgeNumber, login, name });
                                localStorage.setItem('rosterData', JSON.stringify(rosterData));
                                associateModal.hide();
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

            newAAButton.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                this.classList.add('drag-over');
            });

            newAAButton.addEventListener('drop', function(e) {
                handleAssociateDrop(e, index, areaContent);
            });

            const actionButton1 = newArea.querySelector('.actionButton1');
            const actionButton2 = newArea.querySelector('.actionButton2');
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

                        stationItem.querySelector('.assignAssociateButton').addEventListener('click', function() {
                            const stationIndex = this.getAttribute('data-station-index');
                            const areaIndex = this.getAttribute('data-area-index');
                            showAssignAssociateModal(stationIndex, areaIndex);
                        });

                        stationItem.querySelector('.removeAssociateButton').addEventListener('click', function() {
                            const stationIndex = this.getAttribute('data-station-index');
                            const areaIndex = this.getAttribute('data-area-index');
                            showRemoveAssociateModal(stationIndex, areaIndex);
                        });

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

                        stationItem.querySelector('.assignAssociateButton').addEventListener('click', function() {
                            const stationIndex = this.getAttribute('data-station-index');
                            const areaIndex = this.getAttribute('data-area-index');
                            showAssignAssociateModal(stationIndex, areaIndex);
                        });

                        stationItem.querySelector('.removeAssociateButton').addEventListener('click', function() {
                            const stationIndex = this.getAttribute('data-station-index');
                            const areaIndex = this.getAttribute('data-area-index');
                            showRemoveAssociateModal(stationIndex, areaIndex);
                        });

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

            const removeAssociatesButton = newArea.querySelector('.removeAssociatesButton');
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
                            this.parentElement.remove();
                        });
                    });
                });

                removeAssociatesModal.show();
            });

            areaContent.addEventListener('dragover', handleAssociateDragOver);
            areaContent.addEventListener('drop', function(e) {
                handleAssociateDrop(e, index, areaContent);
            });
        });
    } catch (error) {
        console.error('Error rendering areas:', error);
    }
}

/**
 * Update the areas data in local storage.
 */
function updateAreasData() {
    try {
        localStorage.setItem('areasData', JSON.stringify(areasData));
    } catch (error) {
        console.error('Error updating areas data:', error);
    }
}

/**
 * Delete an area by index.
 * @param {number} index - The index of the area to delete.
 */
function deleteArea(index) {
    try {
        areasData.splice(index, 1);
        updateAreasData();
        renderAreas();
    } catch (error) {
        console.error('Error deleting area:', error);
    }
}
