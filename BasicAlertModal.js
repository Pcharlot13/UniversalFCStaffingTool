function createBasicAlertModal() {
    // Create modal elements
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    const modalText = document.createElement('p');
    const closeButton = document.createElement('span');
    const doneButton = document.createElement('button');
    const uploadButton = document.createElement('button');
    const fileInput = document.createElement('input');

    // Set attributes and styles
    modal.setAttribute('id', 'basicAlertModal');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.width = '300px';
    modalContent.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';

    closeButton.innerHTML = '&times;';
    closeButton.style.color = '#aaa';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '28px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';

    doneButton.textContent = 'Done';
    doneButton.style.marginTop = '10px';
    doneButton.style.padding = '10px 20px';
    doneButton.style.backgroundColor = '#4CAF50';
    doneButton.style.color = 'white';
    doneButton.style.border = 'none';
    doneButton.style.cursor = 'pointer';
    doneButton.style.alignSelf = 'center';

    uploadButton.textContent = 'Upload';
    uploadButton.style.marginTop = '10px';
    uploadButton.style.padding = '10px 20px';
    uploadButton.style.backgroundColor = '#008CBA';
    uploadButton.style.color = 'white';
    uploadButton.style.border = 'none';
    uploadButton.style.cursor = 'pointer';
    uploadButton.style.alignSelf = 'center';

    fileInput.type = 'file';
    fileInput.style.display = 'none';

    // Append elements
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalText);
    modalContent.appendChild(doneButton);
    modalContent.appendChild(uploadButton);
    modalContent.appendChild(fileInput);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal on click
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    doneButton.onclick = function() {
        modal.style.display = 'none';
    };

    uploadButton.onclick = function() {
        fileInput.click();
    };

    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            // Handle the file as needed
        }
    };

    // Close modal on outside click
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    return {
        show: function(text) {
            modalText.textContent = text;
            modal.style.display = 'flex';
        },
        hide: function() {
            modal.style.display = 'none';
        }
    };
}
