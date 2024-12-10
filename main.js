document.addEventListener('DOMContentLoaded', function() {
    const leftColumn = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');
    const areasData = JSON.parse(localStorage.getItem('areasData')) || [];
    const colors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-light', 'bg-dark'];

    // Function to render areas
    function renderAreas() {
        leftColumn.innerHTML = '';
        rightColumn.innerHTML = '';
        areasData.forEach((area, index) => {
            const newArea = document.createElement('div');
            newArea.className = `mt-3 p-3 text-white ${colors[index % colors.length]}`;
            newArea.innerHTML = `
                <div class="d-flex align-items-center">
                    <h3 class="me-2">${area.title}</h3>
                    <button class="btn btn-light newAAButton">+</button>
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
                } else {
                    document.getElementById('badgeNumberInput').value = badgeNumber;
                    const associateModal = new bootstrap.Modal(document.getElementById('associateModal'));
                    associateModal.show();

                    document.getElementById('saveAssociateButton').addEventListener('click', function() {
                        login = document.getElementById('loginInput').value.trim();
                        name = document.getElementById('nameInput').value.trim();

                        if (login && name) {
                            addAssociate(badgeNumber, login, name, index, areaContent);
                            associateModal.hide();
                        } else {
                            alert('Please fill in both Login and Name fields.');
                        }
                    }, { once: true });
                }
            });
        });
    }

    function addAssociate(badgeNumber, login, name, index, areaContent) {
        const associateRow = document.createElement('div');
        associateRow.className = 'row mt-3';
        associateRow.innerHTML = `
            <div class="col-md-4"><input type="text" class="form-control badge-number" value="${badgeNumber}" placeholder="Badge Number"></div>
            <div class="col-md-4"><input type="text" class="form-control" value="${login}" placeholder="Login" readonly></div>
            <div class="col-md-4"><input type="text" class="form-control" value="${name}" placeholder="Name" readonly></div>
        `;
        areaContent.appendChild(associateRow);

        // Save to areasData and localStorage
        areasData[index].associates.push({ badgeNumber, login, name });
        localStorage.setItem('areasData', JSON.stringify(areasData));

        // Add to rosterData and localStorage
        const rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];
        rosterData.push({ badgeNumber, login, name });
        localStorage.setItem('rosterData', JSON.stringify(rosterData));
    }

    // Render the saved areas on page load
    renderAreas();

    document.getElementById('newButton').addEventListener('click', () => {
        // Add functionality for the new button
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

    document.getElementById('clearDataButton').addEventListener('click', () => {
        // Add functionality to clear all data
        if (confirm("Are you sure you want to clear all data?")) {
            localStorage.removeItem('areasData');
            localStorage.removeItem('rosterData');
            location.reload();
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
});