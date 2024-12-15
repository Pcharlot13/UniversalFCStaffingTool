/**
 * Create an associate card element.
 * @param {Object} associate - The associate data.
 * @returns {HTMLElement} The associate card element.
 */
function createAssociateCard(associate) {
    if (!associate) return null;

    try {
        const card = document.createElement('div');
        card.className = 'card text-white bg-dark mb-3 text-center draggable-associate';
        card.style.width = '12rem';
        card.innerHTML = `
            <div class="card-body" draggable="true" data-badge-number="${associate.badgeNumber}">
                <h4 class="card-title moveable" style="font-size: 1.5rem; white-space: normal; overflow: visible;">
                    <i class="bi bi-clipboard copy-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="
                        ${associate.name}
                        ${associate.badgeNumber}
                        ${associate.login}
                    " data-copy="${associate.name}, ${associate.badgeNumber}, ${associate.login}"></i>
                    ${associate.name}
                </h4>
            </div>
        `;

        const cardBody = card.querySelector('.card-body');
        cardBody.addEventListener('dragstart', handleAssociateDragStart);
        cardBody.addEventListener('dragover', handleAssociateDragOver);
        cardBody.addEventListener('drop', handleAssociateDrop);
        cardBody.addEventListener('dragend', handleAssociateDragEnd);

        const tooltipTrigger = card.querySelector('[data-bs-toggle="tooltip"]');
        new bootstrap.Tooltip(tooltipTrigger, {
            delay: { show: 1500, hide: 2000 },
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner text-start"></div></div>'
        });

        tooltipTrigger.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy);
        });

        return card;
    } catch (error) {
        console.error('Error creating associate card:', error);
        return null;
    }
}

/**
 * Add an associate to an area.
 * @param {string} badgeNumber - The badge number of the associate.
 * @param {string} login - The login of the associate.
 * @param {string} name - The name of the associate.
 * @param {number} index - The index of the area.
 * @param {HTMLElement} areaContent - The area content element.
 */
function addAssociate(badgeNumber, login, name, index, areaContent) {
    try {
        const associate = { badgeNumber, login, name };
        const associateCard = createAssociateCard(associate);
        areaContent.appendChild(associateCard);

        areasData[index].associates.push(associate);
        localStorage.setItem('areasData', JSON.stringify(areasData));
    } catch (error) {
        console.error('Error adding associate:', error);
    }
}

/**
 * Handle the drag start event for an associate.
 * @param {DragEvent} e - The drag event.
 */
function handleAssociateDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.getAttribute('data-badge-number'));
    this.classList.add('dragging');
}

/**
 * Handle the drag over event for an associate.
 * @param {DragEvent} e - The drag event.
 */
function handleAssociateDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

/**
 * Handle the drop event for an associate.
 * @param {DragEvent} e - The drop event.
 * @param {number} targetAreaIndex - The index of the target area.
 * @param {HTMLElement} areaContent - The area content element.
 */
function handleAssociateDrop(e, targetAreaIndex, areaContent) {
    e.stopPropagation();
    e.preventDefault();
    const draggedBadgeNumber = e.dataTransfer.getData('text/plain');

    if (targetAreaIndex < 0 || targetAreaIndex >= areasData.length) {
        console.error('Invalid target area index:', targetAreaIndex);
        return;
    }

    const targetArea = areasData[targetAreaIndex];

    if (!targetArea) {
        console.error('Target area is undefined');
        return;
    }

    const draggedAssociate = areasData.flatMap(area => area.associates).find(associate => associate.badgeNumber === draggedBadgeNumber);
    if (draggedAssociate) {
        areasData.forEach(area => {
            area.associates = area.associates.filter(associate => associate.badgeNumber !== draggedBadgeNumber);
        });

        targetArea.associates.push(draggedAssociate);
        updateAreasData();
        renderAreas();
    }

    if (this.classList) {
        this.classList.remove('drag-over');
    }
}

/**
 * Handle the drag end event for an associate.
 */
function handleAssociateDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(element => {
        element.classList.remove('drag-over');
    });
}
