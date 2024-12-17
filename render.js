import { createAssociateCard, handleAssociateDrop, handleAssociateDragOver } from './associates.js';
import { showAssignAssociateModal, showRemoveAssociateModal, showDeleteConfirmationModal, showWarningModal, showAddStationModal } from './modals.js';
import { updateAreasData, deleteArea } from './utils.js';

export function renderAreas(container, areasData, rosterData, colors) {
    container.innerHTML = '';
    areasData.forEach((area, index) => {
        const newArea = document.createElement('div');
        const associateCount = area.associates.length;
        const areaSizeClass = associateCount > 0 ? `col-md-${Math.min(associateCount * 2, 12)}` : 'col-md-6';
        newArea.className = `mt-3 p-3 text-white draggable-area ${areaSizeClass} ${colors[index % colors.length]}`;
        newArea.setAttribute('data-index', index);
        newArea.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex flex-row">
                    <button class="btn btn-light newAAButton" data-index="${index}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add a new associate">+</button>
                    <button class="btn btn-light actionButton1" data-index="${index}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Open Stations"><i class="bi bi-gear"></i></button>
                    <button class="btn btn-light actionButton2" data-index="${index}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Delete this area"><i class="bi bi-trash"></i></button>
                    <button class="btn btn-light removeAssociatesButton" data-index="${index}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove associates"><i class="bi bi-x-circle"></i></button>
                </div>
            </div>
            <h3 class="mt-2">${area.title}</h3>
            <div class="areaContent mt-3"></div>
        `;

        const areaContent = newArea.querySelector('.areaContent');
        area.associates.forEach(associate => {
            if (associate) {
                const associateCard = createAssociateCard(associate);
                areaContent.appendChild(associateCard);
            }
        });

        container.appendChild(newArea);

        // Initialize tooltips for dynamically created buttons
        var tooltipTriggerList = [].slice.call(newArea.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Add event listener to the plus sign button
        const newAAButton = newArea.querySelector('.newAAButton');
        newAAButton.addEventListener('click', function() {
            // ...existing code...
        });

        // Add drag and drop event listeners to the plus sign button
        newAAButton.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        });

        newAAButton.addEventListener('drop', function(e) {
            handleAssociateDrop(e, index, areaContent);
        });

        // Add event listeners to the new action buttons
        const actionButton1 = newArea.querySelector('.actionButton1');
        const actionButton2 = newArea.querySelector('.actionButton2');
        actionButton1.addEventListener('click', function() {
            // ...existing code...
        });
        actionButton2.addEventListener('click', function() {
            showDeleteConfirmationModal('Are you sure you want to delete this area?', () => {
                deleteArea(index, areasData, container, rosterData, colors);
            });
        });

        // Add event listener to the remove associates button
        const removeAssociatesButton = newArea.querySelector('.removeAssociatesButton');
        removeAssociatesButton.addEventListener('click', function() {
            // ...existing code...
        });

        // Add drag and drop event listeners to the area content
        areaContent.addEventListener('dragover', handleAssociateDragOver);
        areaContent.addEventListener('drop', function(e) {
            handleAssociateDrop(e, index, areaContent);
        });
    });
}
