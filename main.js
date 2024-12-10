document.addEventListener('DOMContentLoaded', function() {
    const leftColumn = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');
    const areasData = JSON.parse(localStorage.getItem('areasData')) || [];

    // Function to render areas
    function renderAreas() {
        leftColumn.innerHTML = '';
        rightColumn.innerHTML = '';
        areasData.forEach((area, index) => {
            const newArea = document.createElement('div');
            newArea.className = 'mt-3';
            newArea.innerHTML = `
                <div class="d-flex align-items-center">
                    <h3 class="me-2">${area.title}</h3>
                    <button class="btn btn-secondary newAAButton">+</button>
                </div>
                <div class="areaContent mt-3"></div>
            `;

            const areaContent = newArea.querySelector('.areaContent');
            area.associates.forEach(associate => {
                const associateRow = document.createElement('div');
                associateRow.className = 'row mt-3';
                associateRow.innerHTML = `
                    <div class="col-md-4"><input type="text" class="form-control badge-number" value="${associate.badgeNumber}" placeholder="Badge Number"></div>
                    <div class="col-md-4"><input type="text" class="form-control" value="${associate.login}" placeholder="Login" readonly></div>
                    <div class="col-md-4"><input type="text" class="form-control" value="${associate.name}" placeholder="Name" readonly></div>
                `;
                areaContent.appendChild(associateRow);
            });

            // Alternate between left and right columns
            if (leftColumn.children.length <= rightColumn.children.length) {
                leftColumn.appendChild(newArea);
            } else {
                rightColumn.appendChild(newArea);
            }

            // Add event listener to the plus sign button
            newArea.querySelector('.newAAButton').addEventListener('click', function() {
                const badgeNumber = prompt("Badge Number?").trim();
                const rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];
                const matchedEntry = rosterData.find(entry => String(entry.badgeNumber).trim() === badgeNumber);

                let login, name;
                if (matchedEntry) {
                    login = matchedEntry.login;
                    name = matchedEntry.name;
                    addAssociateToArea(index, badgeNumber, login, name);
                } else {
                    const badgeNumberInput = document.getElementById('badgeNumberInput');
                    badgeNumberInput.value = badgeNumber;
                    const associateModal = new bootstrap.Modal(document.getElementById('associateModal'));
                    associateModal.show();

                    document.getElementById('saveAssociateButton').addEventListener('click', function() {
                        login = document.getElementById('loginInput').value.trim();
                        name = document.getElementById('nameInput').value.trim();

                        if (login && name) {
                            addAssociateToArea(index, badgeNumber, login, name);
                            addNewEntryToRoster(badgeNumber, login, name);
                            associateModal.hide();
                        } else {
                            alert('Please fill in both Login and Name fields.');
                        }
                    }, { once: true });
                }
            });
        });
    }

    function addAssociateToArea(areaIndex, badgeNumber, login, name) {
        const areaContent = document.querySelectorAll('.areaContent')[areaIndex];
        const associateRow = document.createElement('div');
        associateRow.className = 'row mt-3';
        associateRow.innerHTML = `
            <div class="col-md-4"><input type="text" class="form-control badge-number" value="${badgeNumber}" placeholder="Badge Number"></div>
            <div class="col-md-4"><input type="text" class="form-control" value="${login}" placeholder="Login" readonly></div>
            <div class="col-md-4"><input type="text" class="form-control" value="${name}" placeholder="Name" readonly></div>
        `;
        areaContent.appendChild(associateRow);

        // Save to areasData and localStorage
        areasData[areaIndex].associates.push({ badgeNumber, login, name });
        localStorage.setItem('areasData', JSON.stringify(areasData));
    }

    function addNewEntryToRoster(badgeNumber, login, name) {
        const rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];
        rosterData.push({ badgeNumber, login, name });
        localStorage.setItem('rosterData', JSON.stringify(rosterData));
    }

    // Render the saved areas on page load
    renderAreas();

    document.getElementById('newButton').addEventListener('click', function() {
        const titleOfArea = prompt("Title of Area:");

        if (titleOfArea !== null) {
            const newArea = {
                title: titleOfArea,
                associates: []
            };
            areasData.push(newArea);
            localStorage.setItem('areasData', JSON.stringify(areasData));
            renderAreas();
        }
    });

    document.getElementById('clearDataButton').addEventListener('click', function() {
        if (confirm("Are you sure you want to clear all data?")) {
            localStorage.removeItem('areasData');
            localStorage.removeItem('rosterData');
            location.reload();
        }
    });
});