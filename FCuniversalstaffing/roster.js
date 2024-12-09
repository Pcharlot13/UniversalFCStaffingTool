document.addEventListener('DOMContentLoaded', function() {
    const rosterContent = document.getElementById('rosterContent');
    const rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];

    // Function to render roster data
    function renderRosterData() {
        console.log('Rendering roster data:', rosterData); // Debugging log
        rosterContent.innerHTML = '';
        rosterData.forEach(item => {
            const newRow = document.createElement('div');
            newRow.className = 'row mt-3';
            newRow.innerHTML = `
                <div class="col-md-4"><input type="text" class="form-control" value="${item.badgeNumber}" placeholder="Badge Number"></div>
                <div class="col-md-4"><input type="text" class="form-control" value="${item.login}" placeholder="Login"></div>
                <div class="col-md-4"><input type="text" class="form-control" value="${item.name}" placeholder="Name"></div>
            `;
            rosterContent.appendChild(newRow);
        });
    }

    // Render the saved roster data on page load
    renderRosterData();

    // Add event listener to the "New Entry" button
    document.getElementById('newEntryButton').addEventListener('click', function() {
        const badgeNumber = prompt("Badge Number?").trim();
        const login = prompt("Login?");
        const name = prompt("Name?");

        if (badgeNumber !== null && login !== null && name !== null) {
            console.log('Adding new entry:', { badgeNumber, login, name }); // Debugging log
            const newRow = document.createElement('div');
            newRow.className = 'row mt-3';
            newRow.innerHTML = `
                <div class="col-md-4"><input type="text" class="form-control" value="${badgeNumber}" placeholder="Badge Number"></div>
                <div class="col-md-4"><input type="text" class="form-control" value="${login}" placeholder="Login"></div>
                <div class="col-md-4"><input type="text" class="form-control" value="${name}" placeholder="Name"></div>
            `;
            rosterContent.appendChild(newRow);

            // Save to rosterData and localStorage
            rosterData.push({ badgeNumber, login, name });
            localStorage.setItem('rosterData', JSON.stringify(rosterData));
        }
    });

    // Add event listener to the "Upload Roster" button
    document.getElementById('uploadRosterButton').addEventListener('click', function() {
        alert("Upload Roster functionality has been removed.");
    });
});