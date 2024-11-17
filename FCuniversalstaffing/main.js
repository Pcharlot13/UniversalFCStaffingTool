document.getElementById('newButton').addEventListener('click', function() {
    const badgeNumber = prompt("Please enter the Badge Number:");

        <div class="col-md-4"><input type="text" class="form-control" placeholder="Cell 1"></div>
    if (badgeNumber !== null) {
        const generatedContent = document.getElementById('generatedContent');

        // Create the header row
        const headerRow = document.createElement('div');
        headerRow.className = 'row mt-3';
        headerRow.innerHTML = `
            <div class="col-md-4"><input type="text" class="form-control" value="${badgeNumber}" readonly></div>
            <div class="col-md-4"><input type="text" class="form-control" value="Login for ${badgeNumber}" readonly></div>
            <div class="col-md-4"><input type="text" class="form-control" value="Name for ${badgeNumber}" readonly></div>
        `;

        generatedContent.appendChild(headerRow);
    }
});