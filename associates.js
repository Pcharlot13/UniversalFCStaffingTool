import { updateAreasData } from './utils.js';
import { renderAreas } from './render.js';

export function createAssociateCard(associate) {
    if (!associate) return null;

    const card = document.createElement('div');
    card.className = 'card text-white bg-dark mb-3 text-center draggable-associate';
    card.style.width = '12rem'; // Reduced width
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

    // Add drag and drop event listeners to the card body
    const cardBody = card.querySelector('.card-body');
    cardBody.addEventListener('dragstart', handleAssociateDragStart);
    cardBody.addEventListener('dragover', handleAssociateDragOver);
    cardBody.addEventListener('drop', handleAssociateDrop);
    cardBody.addEventListener('dragend', handleAssociateDragEnd);

    // Initialize tooltip
    const tooltipTrigger = card.querySelector('[data-bs-toggle="tooltip"]');
    new bootstrap.Tooltip(tooltipTrigger, {
        delay: { show: 1500, hide: 2000 },
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner text-start"></div></div>'
    });

    // Add event listener to copy icon
    tooltipTrigger.addEventListener('click', function() {
        const textToCopy = this.getAttribute('data-copy');
        navigator.clipboard.writeText(textToCopy);
    });

    return card;
}

export function addAssociate(badgeNumber, login, name, index, areaContent) {
    const associate = { badgeNumber, login, name };
    const associateCard = createAssociateCard(associate);
    areaContent.appendChild(associateCard);

    // Save to areasData and localStorage
    areasData[index].associates.push(associate);
    localStorage.setItem('areasData', JSON.stringify(areasData));
}

export function handleAssociateDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.getAttribute('data-badge-number'));
    this.classList.add('dragging');
}

export function handleAssociateDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

export function handleAssociateDrop(e, targetAreaIndex, areaContent) {
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
        // Remove the associate from the previous area
        areasData.forEach(area => {
            area.associates = area.associates.filter(associate => associate.badgeNumber !== draggedBadgeNumber);
        });

        // Add the associate to the new area
        targetArea.associates.push(draggedAssociate);
        updateAreasData();
        renderAreas();
    }

    if (this.classList) {
        this.classList.remove('drag-over');
    }
}

export function handleAssociateDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(element => {
        element.classList.remove('drag-over');
    });
}