import { handleAssociateDragStart, handleAssociateDragOver, handleAssociateDrop, handleAssociateDragEnd } from './dragAndDrop.js';
import { areasData } from './sharedData.js';
import { permissionsList } from './permissionsBTN.js';

export function createAssociateCard(associate, isRosterPage = false) {
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
            ${isRosterPage ? `
            <div class="permissions d-flex flex-wrap">
                ${permissionsList.map((permission, index) => `
                    <div class="form-check me-2">
                        <input class="form-check-input" type="checkbox" id="permission-${index}-${associate.badgeNumber}" data-bs-toggle="tooltip" data-bs-placement="top" title="${permission}">
                        <label class="form-check-label" for="permission-${index}-${associate.badgeNumber}"></label>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    `;

    // Add drag and drop event listeners to the card body
    const cardBody = card.querySelector('.card-body');
    cardBody.addEventListener('dragstart', handleAssociateDragStart);
    cardBody.addEventListener('dragover', handleAssociateDragOver);
    cardBody.addEventListener('drop', handleAssociateDrop);
    cardBody.addEventListener('dragend', handleAssociateDragEnd);

    // Initialize tooltips
    const tooltipTriggers = card.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggers.forEach(trigger => {
        new bootstrap.Tooltip(trigger, {
            delay: { show: 1500, hide: 2000 },
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner text-start"></div></div>'
        });
    });

    // Add event listener to copy icon
    const copyIcon = card.querySelector('.copy-icon');
    copyIcon.addEventListener('click', function() {
        const textToCopy = this.getAttribute('data-copy');
        navigator.clipboard.writeText(textToCopy);
    });

    return card;
}

export function addAssociate(badgeNumber, login, name, index, areaContent, isRosterPage = false) {
    const associate = { badgeNumber, login, name };
    const associateCard = createAssociateCard(associate, isRosterPage);
    areaContent.appendChild(associateCard);

    // Save to areasData and localStorage
    areasData[index].associates.push(associate);
    localStorage.setItem('areasData', JSON.stringify(areasData));
}