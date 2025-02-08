document.addEventListener('DOMContentLoaded', function() {
    const permissionsButton = document.getElementById('permissionsButton');
    const permissionsModalElement = document.getElementById('permissionsModal');
    if (permissionsModalElement) {
        const permissionsModal = new bootstrap.Modal(permissionsModalElement);
        const permissionsListElement = document.getElementById('permissionsList');
        const newPermissionInput = document.getElementById('newPermissionInput');
        const addPermissionButton = document.getElementById('addPermissionButton');

        let permissions = JSON.parse(localStorage.getItem('permissions')) || [];

        function renderPermissions() {
            permissionsListElement.innerHTML = '';
            permissions.forEach((permission, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item bg-dark text-white';
                listItem.textContent = permission;
                permissionsListElement.appendChild(listItem);
            });
        }

        permissionsButton.addEventListener('click', function() {
            permissionsModal.show();
            renderPermissions();
        });

        addPermissionButton.addEventListener('click', function() {
            const newPermission = newPermissionInput.value.trim();
            if (newPermission) {
                permissions.push(newPermission);
                localStorage.setItem('permissions', JSON.stringify(permissions));
                newPermissionInput.value = '';
                renderPermissions();
            }
        });

        renderPermissions();
    }
});

export const permissionsList = JSON.parse(localStorage.getItem('permissions')) || [];
