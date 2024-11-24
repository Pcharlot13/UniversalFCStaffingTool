document.addEventListener('DOMContentLoaded', function() {
    const rosterContent = document.getElementById('rosterContent');
    const rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];

    // Function to render roster data
    function renderRosterData() {
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
        document.getElementById('uploadExcel').click();
    });

    // Add event listener to the file input
    document.getElementById('uploadExcel').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                console.log('Parsed Rows:', rows); // Debugging log

                rows.forEach((row, index) => {
                    if (index > 0 && row.length >= 3) { // Skip header row and ensure there are at least 3 columns
                        const [badgeNumber, login, name] = row.map(cell => cell.trim());
                        console.log('Row Data:', { badgeNumber, login, name }); // Debugging log

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
                    }
                });
                localStorage.setItem('rosterData', JSON.stringify(rosterData));
            };
            reader.readAsArrayBuffer(file);
        }
    });
});