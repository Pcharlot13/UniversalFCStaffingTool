document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    let areasData = JSON.parse(localStorage.getItem('areasData')) || [];
    let rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];
    const colors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-light', 'bg-dark'];

    // Function to render areas
    function renderAreas() {
        container.innerHTML = '';
        areasData.forEach((area, index) => {
            const newArea = document.createElement('div');
            const associateCount = area.associates.length;
            const areaSizeClass = associateCount > 0 ? `col-md-${Math.min(associateCount * 2, 12)}` : 'col-md-6';
            newArea.className = `mt-3 p-3 text-white draggable-area ${areaSizeClass} ${colors[index % colors.length]}`;
            newArea.setAttribute('data-index', index);
            newArea.innerHTML = `
                <div class="d-flex align-items-center">
                    <h3 class="me-2">${area.title}</h3>
                    <button class="btn btn-light newAAButton" data-index="${index}">+</button>
                </div>
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

            // Add event listener to the plus sign button
            const newAAButton = newArea.querySelector('.newAAButton');
            newAAButton.addEventListener('click', function() {
                const badgeNumber = prompt("Badge Number?").trim();
                const matchedEntry = rosterData.find(entry => String(entry.badgeNumber).trim() === badgeNumber);

                let login, name;
                if (matchedEntry) {
                    login = matchedEntry.login;
                    name = matchedEntry.name;
                    addAssociate(badgeNumber, login, name, index, areaContent);
                } else {
                    document.getElementById('badgeNumberInput').value = badgeNumber;
                    const associateModal = new bootstrap.Modal(document.getElementById('associateModal'));
                    associateModal.show();

                    document.getElementById('saveAssociateButton').addEventListener('click', function() {
                        login = document.getElementById('loginInput').value.trim();
                        name = document.getElementById('nameInput').value.trim();

                        if (login && name) {
                            addAssociate(badgeNumber, login, name, index, areaContent);
                            // Update roster data
                            rosterData.push({ badgeNumber, login, name });
                            localStorage.setItem('rosterData', JSON.stringify(rosterData));
                            associateModal.hide();
                        } else {
                            alert('Please fill in both Login and Name fields.');
                        }
                    }, { once: true });
                }
            });

            // Add drag and drop event listeners to the plus sign button
            newAAButton.addEventListener('dragover', handleAssociateDragOver);
            newAAButton.addEventListener('drop', function(e) {
                handleAssociateDrop.call(this, e, index, areaContent);
            });
        });
    }

    function createAssociateCard(associate) {
        if (!associate) return null;

        const card = document.createElement('div');
        card.className = 'card text-white bg-dark mb-3 text-center draggable-associate';
        card.setAttribute('draggable', 'true');
        card.setAttribute('data-badge-number', associate.badgeNumber);
        card.innerHTML = `
            <div class="card-body">
                <h4 class="card-title">${associate.name} <i class="bi bi-grip-horizontal dragButton"></i></h4>
                <p class="card-text">${associate.badgeNumber}</p>
                <small class="card-text">${associate.login}</small>
            </div>
        `;

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
        e.dataTransfer.setData('text/plain', this.dataset.badgeNumber);
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
        const targetArea = areasData[targetAreaIndex];

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

        // Create the circle graph
        const circleGraph = document.getElementById('circleGraph');
        circleGraph.innerHTML = '';
        areasData.forEach((area, index) => {
            const percentage = (area.associates.length / totalAssociates) * 100;
            const circleSegment = document.createElement('div');
            circleSegment.className = `circle-segment ${colors[index % colors.length]}`;
            circleSegment.style.setProperty('--percentage', percentage);
            circleGraph.appendChild(circleSegment);
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
                Inbound: [{ title: 'Inbound Area', associates: [] }],
                Outbound: [{ title: 'Outbound Area', associates: [] }],
                Mansort: [{ title: 'Mansort Area', associates: [] }],
                NPC: [{ title: 'NPC Area', associates: [] }],
                '20lb': [{ title: '20lb Area', associates: [] }],
                '5lb': [{ title: '5lb Area', associates: [] }],
                Flow: [{ title: 'Flow Area', associates: [] }],
                RPND: [{ title: 'RPND Area', associates: [] }]
            };

            localStorage.setItem('areasData', JSON.stringify(areas[preset]));
            renderAreas();
            const presetsModal = bootstrap.Modal.getInstance(document.getElementById('presetsModal'));
            presetsModal.hide();
        });
    });
});