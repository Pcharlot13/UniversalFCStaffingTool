import { renderAreas } from './render.js';
import { rosterData } from './sharedData.js';

export function trackAA() {
    console.log("Tracking AA functionality is now available.");
}

document.getElementById('trackAAButton').addEventListener('click', () => {
    if (window.areasData.length === 0) {
        alert('Please create an area first.');
        return;
    }

    const trackAAModal = new bootstrap.Modal(document.getElementById('trackAAModal'));
    trackAAModal.show();

    document.getElementById('confirmTrackAAButton').addEventListener('click', function() {
        const badgeNumber = document.getElementById('badgeNumberInputTrackAA').value.trim();
        if (badgeNumber) {
            trackAAModal.hide();
            showSelectAreaModal(badgeNumber);
        } else {
            alert('Please enter a badge number.');
        }
    }, { once: true });
});

function showSelectAreaModal(badgeNumber) {
    const selectAreaModal = new bootstrap.Modal(document.getElementById('selectAreaModal'));
    const areaList = document.getElementById('areaList');
    areaList.innerHTML = '';

    window.areasData.forEach(area => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item list-group-item-action';
        listItem.textContent = area.title;
        listItem.addEventListener('click', () => {
            selectAreaModal.hide();
            handleAssociateToArea(badgeNumber, area.title);
        });
        areaList.appendChild(listItem);
    });

    selectAreaModal.show();
}

function handleAssociateToArea(badgeNumber, areaTitle) {
    const associate = window.associatesData.find(assoc => assoc.badgeNumber === badgeNumber);
    if (associate) {
        addAssociateToArea(associate, areaTitle);
    } else {
        showAddAssociateModal(badgeNumber, areaTitle);
    }
}

function showAddAssociateModal(badgeNumber, areaTitle) {
    const associateModal = new bootstrap.Modal(document.getElementById('associateModal'));
    document.getElementById('badgeNumberInput').value = badgeNumber;
    associateModal.show();

    document.getElementById('saveAssociateButton').addEventListener('click', function() {
        const login = document.getElementById('loginInput').value.trim();
        const name = document.getElementById('nameInput').value.trim();
        if (login && name) {
            const newAssociate = { badgeNumber, login, name };
            window.associatesData.push(newAssociate);
            localStorage.setItem('associatesData', JSON.stringify(window.associatesData));
            addAssociateToArea(newAssociate, areaTitle);
            // Update roster data
            if (!window.rosterData) {
                window.rosterData = [];
            }
            window.rosterData.push({ badgeNumber, login, name });
            localStorage.setItem('rosterData', JSON.stringify(window.rosterData));
            associateModal.hide();
            location.reload(); // Refresh the page
        } else {
            alert('Please fill in all fields.');
        }
    }, { once: true });
}

function addAssociateToArea(associate, areaTitle) {
    const area = window.areasData.find(area => area.title === areaTitle);
    if (area) {
        area.associates.push(associate);
        localStorage.setItem('areasData', JSON.stringify(window.areasData));

        // Update rosterData
        if (!window.rosterData) {
            window.rosterData = [];
        }
        const existingEntry = window.rosterData.find(entry => entry.badgeNumber === associate.badgeNumber);
        if (!existingEntry) {
            window.rosterData.push(associate);
            localStorage.setItem('rosterData', JSON.stringify(window.rosterData));
        }

        renderAreas();
        location.reload(); // Refresh the page
    }
}
