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
                const matchedEntry = rosterData.find(entry => entry.badgeNumber.trim() === badgeNumber);

                let login, name;
                if (matchedEntry) {
                    alert("Associate found in roster");
                    login = matchedEntry.login;
                    name = matchedEntry.name;
                } else {
                    alert("Associate not found in roster");
                    login = prompt("Login?");
                    name = prompt("Name?");
                }

                if (badgeNumber !== null && login !== null && name !== null) {
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
                }
            });
        });
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