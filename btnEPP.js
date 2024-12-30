document.getElementById('EPPfiles').addEventListener('click', function() {
    const basicAlertModal = createBasicAlertModal();

    // Add "Upload" button and file input
    const uploadButton = document.createElement('button');
    const fileInput = document.createElement('input');

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

    // Ensure modal content is selected correctly
    const modalContent = document.querySelector('#basicAlertModal > div');
    modalContent.appendChild(uploadButton);
    modalContent.appendChild(fileInput);

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

    basicAlertModal.show('This is a custom modal window');
});
