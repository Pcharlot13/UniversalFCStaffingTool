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
                        <button class="btn btn-light actionButton1" data-index="${index}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Open settings"><i class="bi bi-gear"></i></button>
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

            // Add event listener to the plus sign button
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
                            <i class="bi bi-trash remove-station-icon" data-area-index="${areaIndex}" data-station-index="${stationIndex}"></i>
                        `;
                        stationsList.appendChild(stationItem);
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
                        area.stations.push(stationName);
                        updateAreasData();
                        const stationItem = document.createElement('li');
                        stationItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                        stationItem.innerHTML = `
                            <div class="me-2 p-2 ${colors[area.stations.length - 1 % colors.length]}"></div>
                            <span class="fw-bold">${stationName}</span>
                            <i class="bi bi-trash remove-station-icon" data-area-index="${areaIndex}" data-station-index="${area.stations.length - 1}"></i>
                        `;
                        stationsList.appendChild(stationItem);

                        // Add event listener to the new remove station icon
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
                            // Remove the list item from the modal
                            this.parentElement.remove();
                        });
                    });
                });

                removeAssociatesModal.show();
            });

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
            <div class="card-body">
                <h4 class="card-title" style="font-size: 1.2rem;">${associate.name} <i class="bi bi-grip-horizontal dragButton"></i></h4>
                <p class="card-text" style="font-size: 1rem;">${associate.badgeNumber}</p>
                <small class="card-text" style="font-size: 0.9rem;">${associate.login}</small>
            </div>
        `;

        card.setAttribute('draggable', 'true'); // Make the card draggable
        card.setAttribute('data-badge-number', associate.badgeNumber); // Set the badge number as a data attribute
        card.addEventListener('dragstart', handleAssociateDragStart);
        card.addEventListener('dragover', handleAssociateDragOver);
        card.addEventListener('drop', handleAssociateDrop);
        card.addEventListener('dragend', handleAssociateDragEnd);

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

    document.getElementById('newButton').addEventListener('click', () => {
        const newAreaInput = document.getElementById('newAreaInput');
        newAreaInput.value = ''; // Clear the input field
        const newAreaModal = new bootstrap.Modal(document.getElementById('newAreaModal'));
        newAreaModal.show();

        document.getElementById('enterNewAreaButton').addEventListener('click', function() {
            const titleOfArea = newAreaInput.value.trim();
            if (titleOfArea) {
                const existingArea = areasData.find(area => area.title === titleOfArea);
                if (existingArea) {
                    alert('An area with this title already exists.');
                } else {
                    const newArea = {
                        title: titleOfArea,
                        associates: []
                    };
                    areasData.push(newArea);
                    localStorage.setItem('areasData', JSON.stringify(areasData));
                    renderAreas();
                    newAreaModal.hide();
                }
            } else {
                alert('Please enter a title for the new area.');
            }
        }, { once: true });
    });

    document.getElementById('clearDataButton').addEventListener('click', () => {
        // Add functionality to clear all data
        if (confirm("Are you sure you want to clear all data?")) {
            localStorage.removeItem('areasData');
            localStorage.removeItem('rosterData');
            areasData = [];
            rosterData = [];
            renderAreas();
        }
    });

    document.getElementById('headcountButton').addEventListener('click', () => {
        const headcountContent = document.getElementById('headcountContent');
        headcountContent.innerHTML = '';
        const totalAssociates = areasData.reduce((sum, area) => sum + area.associates.length, 0);
        areasData.forEach((area, index) => {
            const areaHeadcount = document.createElement('div');
            areaHeadcount.className = 'd-flex align-items-center mb-2';
            areaHeadcount.innerHTML = `
                <div class="me-2 p-2 ${colors[index % colors.length]}"></div>
                <span>${area.title}: ${area.associates.length}</span>
            `;
            headcountContent.appendChild(areaHeadcount);
        });

        // Create the pie chart
        const circleGraph = document.getElementById('circleGraph');
        circleGraph.innerHTML = '';
        let cumulativePercentage = 0;

        areasData.forEach((area, index) => {
            const percentage = (area.associates.length / totalAssociates) * 100;
            const circleSegment = document.createElement('div');
            circleSegment.className = `circle-segment`;
            circleSegment.style.setProperty('--percentage', percentage);
            circleSegment.style.transform = `rotate(${cumulativePercentage * 3.6}deg)`;
            circleSegment.style.backgroundColor = colors[index % colors.length];
            circleGraph.appendChild(circleSegment);
            cumulativePercentage += percentage;
        });

        const headcountModal = new bootstrap.Modal(document.getElementById('headcountModal'));
        headcountModal.show();
    });

    document.getElementById('presetsButton').addEventListener('click', () => {
        const presetsModal = new bootstrap.Modal(document.getElementById('presetsModal'));
        presetsModal.show();
    });

    document.querySelectorAll('.preset-btn').forEach(button => {
        button.addEventListener('click', function() {
            const preset = this.getAttribute('data-preset');
            const areas = {
                Inbound: [
                    { title: 'PG & LEADERSHIP', associates: [], stations: ['PA', 'PG'] },
                    { title: 'PARCEL', associates: [], stations: Array.from({ length: 17 }, (_, i) => (206 + i).toString()) },
                    { title: 'WATERSPIDER', associates: [], stations: ['North', 'South'] },
                    { title: 'TDR', associates: [], stations: ['North', 'South'] },
                    { title: 'DRIVERS', associates: [], stations: ['North', 'South'] },
                    { title: 'JAM CLEAR', associates: [], stations: ['North', 'South'] },
                    { title: 'DOCKSORT', associates: [], stations: ['North', 'South'] },
                    { title: 'North PIDS', associates: [], stations: ['PID4', 'PID5', 'PID6'] },
                    { title: 'South PIDS', associates: [], stations: ['PID1', 'PID2', 'PID3'] }
                ],
                Outbound: [{ title: 'Outbound Area', associates: [] }],
                Mansort: [{ title: 'Mansort Area', associates: [] }],
                NPC: [{ title: 'NPC Area', associates: [] }],
                '20lb': [{ title: '20lb Area', associates: [] }],
                '5lb': [{ title: '5lb Area', associates: [] }],
                Flow: [{ title: 'Flow Area', associates: [] }],
                RPND: [{ title: 'RPND Area', associates: [] }]
            };

            localStorage.setItem('areasData', JSON.stringify(areas[preset]));
            areasData = areas[preset]; // Update the areasData variable
            renderAreas();
            const presetsModal = bootstrap.Modal.getInstance(document.getElementById('presetsModal'));
            presetsModal.hide();
            location.reload(); // Refresh the page
        });
    });

    document.getElementById('startSessionButton').addEventListener('click', () => {
        fetch('/start-session', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const sessionLinkInput = document.getElementById('sessionLinkInput');
                    sessionLinkInput.value = data.lanUrl;

                    const sessionLinkModal = new bootstrap.Modal(document.getElementById('sessionLinkModal'));
                    sessionLinkModal.show();

                    document.getElementById('copySessionLinkButton').addEventListener('click', function() {
                        sessionLinkInput.select();
                        document.execCommand('copy');
                        alert('Link copied to clipboard');
                    });
                } else {
                    alert('Failed to start session. Check the server.');
                }
            })
            .catch(err => {
                console.error('Error starting session:', err);
                alert('Error starting session. Check the server.');
            });
    });
});