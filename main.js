import { showDeleteConfirmationModal, showAddStationModal, showAssignAssociateModal, showRemoveAssociateModal, showWarningModal } from './modals.js';
import { renderAreas } from './render.js';
import { addAssociate, handleAssociateDrop, handleAssociateDragOver, handleAssociateDragStart, handleAssociateDragEnd } from './associates.js';
import { updateAreasData, deleteArea } from './utils.js';
import { initializeEventListeners } from './eventListeners.js';

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    let areasData = JSON.parse(localStorage.getItem('areasData')) || [];
    let rosterData = JSON.parse(localStorage.getItem('rosterData')) || [];
    const colors = ['bg-dark-blue', 'bg-dark-cyan', 'bg-dark-teal', 'bg-dark-navy', 'bg-dark-slate', 'bg-dark-steel', 'bg-dark-azure', 'bg-dark-indigo'];

    // Render the saved areas on page load
    renderAreas(container, areasData, rosterData, colors);

    // Initialize event listeners
    initializeEventListeners(container, areasData, rosterData, colors);

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});