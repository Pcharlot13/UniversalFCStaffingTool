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

    // Function to update an existing entry in the roster
    function updateEntry(badgeNumber, login, name) {
        const index = rosterData.findIndex(entry => entry.badgeNumber === badgeNumber);
        if (index !== -1) {
            rosterData[index] = { badgeNumber, login, name };
            localStorage.setItem('rosterData', JSON.stringify(rosterData));
            renderRosterData();
        }
    }

    // Function to add a new entry to the roster
    function addNewEntry(badgeNumber, login, name) {
        const existingEntry = rosterData.find(entry => entry.badgeNumber === badgeNumber);
        if (existingEntry) {
            updateEntry(badgeNumber, login, name);
        } else {
            const newRow = document.createElement('div');
            newRow.className = 'row mt-3';
            newRow.innerHTML = `
                <div class="col-md-4"><input type="text" class="form-control badge-number" value="${badgeNumber}" placeholder="Badge Number"></div>
                <div class="col-md-4"><input type="text" class="form-control" value="${login}" placeholder="Login" readonly></div>
                <div class="col-md-4"><input type="text" class="form-control" value="${name}" placeholder="Name" readonly></div>
            `;
            rosterContent.appendChild(newRow);

            // Save to rosterData and localStorage
            rosterData.push({ badgeNumber, login, name });
            localStorage.setItem('rosterData', JSON.stringify(rosterData));
        }
    }

    // Render the saved roster data on page load
    renderRosterData();

    // Add event listener to the "New Entry" button
    document.getElementById('newEntryButton').addEventListener('click', function() {
        const badgeNumberInput = document.getElementById('badgeNumberInput');
        badgeNumberInput.value = '';
        const loginInput = document.getElementById('loginInput');
        loginInput.value = '';
        const nameInput = document.getElementById('nameInput');
        nameInput.value = '';

        const associateModal = new bootstrap.Modal(document.getElementById('associateModal'));
        associateModal.show();

        document.getElementById('saveAssociateButton').addEventListener('click', function() {
            const badgeNumber = badgeNumberInput.value.trim();
            const login = loginInput.value.trim();
            const name = nameInput.value.trim();

            if (badgeNumber && login && name) {
                addNewEntry(badgeNumber, login, name);
                associateModal.hide();
            } else {
                alert('Please fill in all fields.');
            }
        }, { once: true });
    });

    // Add event listener to the "Upload Roster" button
    document.getElementById('uploadRosterButton').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls';
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                    if (rows.length > 0 && rows[0].length === 3) {
                        rows.forEach((row, index) => {
                            if (index > 0) { // Skip header row
                                const [badgeNumber, login, name] = row;
                                addNewEntry(badgeNumber, login, name);
                            }
                        });
                    } else {
                        alert('Invalid file format. Please ensure the file has three columns: Badge Number, Login, and Name.');
                    }
                };
                reader.readAsArrayBuffer(file);
            }
        });
        input.click();
    });

    // Update the home link
    document.querySelector('a[href="main.html"]').setAttribute('href', 'index.html');
});
