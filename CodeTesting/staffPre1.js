document.getElementById('addEntryBtn').addEventListener('click', function() {
    const badgeNumber = prompt('Badge Number?');
    const name = prompt('Name?');
    const login = prompt('Login?');

    const table = document.getElementById('staffTable');
    const row = table.insertRow(-1); // Insert at the end of the table
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.textContent = badgeNumber;
    cell2.textContent = name;
    cell3.textContent = login;

    // Sort the table rows based on the badge number
    sortTableByBadgeNumber();
});

document.getElementById('removeEntryBtn').addEventListener('click', function() {
    const table = document.getElementById('staffTable');
    if (table.rows.length > 1) { // Ensure header row remains
        table.deleteRow(-1); // Remove the last row
    }
});

function sortTableByBadgeNumber() {
    const table = document.getElementById('staffTable');
    let rows, switching, i, x, y, shouldSwitch;
    switching = true;
    // Loop until no switching is done
    while (switching) {
        switching = false;
        rows = table.rows;
        // Loop through all table rows (except the first, which contains table headers)
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            // Get the two elements to compare, one from current row and one from the next
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            // Check if the two rows should switch place, based on the badge number
            if (Number(x.textContent) > Number(y.textContent)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            // If a switch has been marked, make the switch and mark that a switch has been done
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}