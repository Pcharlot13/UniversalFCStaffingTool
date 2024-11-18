document.addEventListener('DOMContentLoaded', function() {
    const rosterContent = document.getElementById('rosterContent');

    // Example data for the roster
    const rosterData = [
        { badgeNumber: '123', login: 'Login for 123', name: 'Name for 123' },
        { badgeNumber: '456', login: 'Login for 456', name: 'Name for 456' },
        { badgeNumber: '789', login: 'Login for 789', name: 'Name for 789' }
    ];

    rosterData.forEach(item => {
        const row = document.createElement('div');
        row.className = 'row mt-3';
        row.innerHTML = `
            <div class="col-md-4"><input type="text" class="form-control" value="${item.badgeNumber}" placeholder="Badge Number"></div>
            <div class="col-md-4"><input type="text" class="form-control" value="${item.login}" placeholder="Login"></div>
            <div class="col-md-4"><input type="text" class="form-control" value="${item.name}" placeholder="Name"></div>
        `;
        rosterContent.appendChild(row);
    });

    // Add event listener to the "New Entry" button
    document.getElementById('newEntryButton').addEventListener('click', function() {
        const badgeNumber = prompt("Badge Number?");
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
        }
    });
});