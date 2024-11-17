document.getElementById('newButton').addEventListener('click', function() {
    const generatedContent = document.getElementById('generatedContent');

    // Create the header row
    const headerRow = document.createElement('div');
    headerRow.className = 'row mt-3';
    headerRow.innerHTML = `
        <div class="col-md-4"><input type="text" class="form-control" placeholder="Cell 1"></div>
    <div class="col-md-4"><input type="text" class="form-control" placeholder="Cell 2"></div>
    <div class="col-md-4"><input type="text" class="form-control" placeholder="Cell 3"></div>
    `;

    generatedContent.appendChild(headerRow);
});