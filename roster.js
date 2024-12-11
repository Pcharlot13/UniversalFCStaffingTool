document.addEventListener('DOMContentLoaded', function() {
    const rosterContent = document.getElementById('rosterContent');
    const rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];

    // Function to render roster data
    function renderRosterData() {
        console.log('Rendering roster data:', rosterData); // Debugging log
        rosterContent.innerHTML = '';
        let row;
        rosterData.forEach((item, index) => {
            if (index % 3 === 0) {
                row = document.createElement('div');
                row.className = 'd-flex justify-content-around mt-3 mb-3'; // Added mb-3 for space between rows
                rosterContent.appendChild(row);
            }
            const card = document.createElement('div');
            card.className = 'card text-white bg-dark mb-3 text-center';
            card.style.width = '12rem'; // Reduced width
            card.style.margin = '0 5px'; // Adjusted margin
            card.innerHTML = `
                <div class="card-body">
                    <h4 class="card-title" style="font-size: 1.2rem;">${item.name} <i class="bi bi-clipboard copy-icon" data-copy="${item.name}"></i></h4>
                    <p class="card-text" style="font-size: 1rem;">${item.badgeNumber} <i class="bi bi-clipboard copy-icon" data-copy="${item.badgeNumber}"></i></p>
                    <small class="card-text" style="font-size: 0.9rem;">${item.login} <i class="bi bi-clipboard copy-icon" data-copy="${item.login}"></i></small>
                </div>
            `;
            row.appendChild(card);
        });

        // Add event listeners to copy icons
        document.querySelectorAll('.copy-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const textToCopy = this.getAttribute('data-copy');
                navigator.clipboard.writeText(textToCopy);
            });
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
            rosterData.push({ badgeNumber, login, name });
            localStorage.setItem('rosterData', JSON.stringify(rosterData));
            renderRosterData();
        }
    }

    // Function to export roster data to an Excel file
    function exportRosterData() {
        const worksheet = XLSX.utils.json_to_sheet(rosterData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Roster');
        XLSX.writeFile(workbook, 'roster.xlsx');
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
                // Clear input fields after saving
                badgeNumberInput.value = '';
                loginInput.value = '';
                nameInput.value = '';
            } else {
                alert('Please fill in all fields.');
            }
        }, { once: true });
    });

    // Add event listener to the "Upload Roster" button
    document.getElementById('uploadRosterButton').addEventListener('click', function() {
        const uploadModal = new bootstrap.Modal(document.getElementById('uploadModal'));
        uploadModal.show();

        document.getElementById('continueUploadButton').addEventListener('click', function() {
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
            uploadModal.hide();
        }, { once: true });
    });

    // Add event listener to the "Export Roster" button
    document.getElementById('exportRosterButton').addEventListener('click', exportRosterData);

    // Update the home link if it exists
    const homeLink = document.querySelector('a[href="main.html"]');
    if (homeLink) {
        homeLink.setAttribute('href', 'index.html');
    }

    document.getElementById('startSessionButton').addEventListener('click', function() {
        const sessionLink = `${window.location.origin}${window.location.pathname}?session=${Date.now()}`;
        const sessionLinkInput = document.getElementById('sessionLinkInput');
        sessionLinkInput.value = sessionLink;

        const sessionLinkModal = new bootstrap.Modal(document.getElementById('sessionLinkModal'));
        sessionLinkModal.show();

        document.getElementById('copySessionLinkButton').addEventListener('click', function() {
            sessionLinkInput.select();
            document.execCommand('copy');
            alert('Link copied to clipboard');
        });
    });
});
