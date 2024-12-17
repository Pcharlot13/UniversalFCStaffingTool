import { showDeleteConfirmationModal, showAddStationModal, showAssignAssociateModal, showRemoveAssociateModal, showWarningModal } from './modals.js';
import { renderAreas } from './render.js';
import { addAssociate, handleAssociateDrop } from './associates.js';
import { updateAreasData } from './utils.js';

export function initializeEventListeners(container, areasData, rosterData, colors) {
    document.getElementById('newButton').addEventListener('click', () => {
        const newAreaInput = document.getElementById('newAreaInput');
        newAreaInput.value = ''; // Clear the input field
        const newAreaModal = new bootstrap.Modal(document.getElementById('newAreaModal'));
        newAreaModal.show();

        document.getElementById('enterNewAreaButton').addEventListener('click', function() {
            const titleOfArea = newAreaInput.value.trim();
            if (titleOfArea) {
                const existingArea = areasData.find(area => area.title === titleOfArea);
                if (existingArea) {
                    alert('An area with this title already exists.');
                } else {
                    const newArea = {
                        title: titleOfArea,
                        associates: []
                    };
                    areasData.push(newArea);
                    localStorage.setItem('areasData', JSON.stringify(areasData));
                    renderAreas(container, areasData, rosterData, colors);
                    newAreaModal.hide();
                }
            } else {
                alert('Please enter a title for the new area.');
            }
        }, { once: true });
    });

    document.getElementById('clearDataButton').addEventListener('click', () => {
        // Add functionality to clear all data
        if (confirm("Are you sure you want to clear all data?")) {
            localStorage.removeItem('areasData');
            localStorage.removeItem('rosterData');
            areasData = [];
            rosterData = [];
            renderAreas(container, areasData, rosterData, colors);
        }
    });

    document.getElementById('headcountButton').addEventListener('click', () => {
        const headcountContent = document.getElementById('headcountContent');
        headcountContent.innerHTML = '';
        const totalAssociates = areasData.reduce((sum, area) => sum + area.associates.length, 0);
        areasData.forEach((area, index) => {
            const areaHeadcount = document.createElement('div');
            areaHeadcount.className = 'd-flex align-items-center mb-2';
            areaHeadcount.innerHTML = `
                <div class="me-2 p-2 ${colors[index % colors.length]}"></div>
                <span>${area.title}: ${area.associates.length}</span>
            `;
            headcountContent.appendChild(areaHeadcount);
        });

        // Create the pie chart
        const circleGraph = document.getElementById('circleGraph');
        circleGraph.innerHTML = '';
        let cumulativePercentage = 0;

        areasData.forEach((area, index) => {
            const percentage = (area.associates.length / totalAssociates) * 100;
            const circleSegment = document.createElement('div');
            circleSegment.className = `circle-segment`;
            circleSegment.style.setProperty('--percentage', percentage);
            circleSegment.style.transform = `rotate(${cumulativePercentage * 3.6}deg)`;
            circleSegment.style.backgroundColor = colors[index % colors.length];
            circleGraph.appendChild(circleSegment);
            cumulativePercentage += percentage;
        });

        const headcountModal = new bootstrap.Modal(document.getElementById('headcountModal'));
        headcountModal.show();
    });

    document.getElementById('presetsButton').addEventListener('click', () => {
        const presetsModal = new bootstrap.Modal(document.getElementById('presetsModal'));
        presetsModal.show();
    });

    document.querySelectorAll('.preset-btn').forEach(button => {
        button.addEventListener('click', function() {
            const preset = this.getAttribute('data-preset');
            const areas = {
                Inbound: [
                    { title: 'PG & LEADERSHIP', associates: [], stations: ['PA', 'PG'] },
                    { title: 'PARCEL', associates: [], stations: Array.from({ length: 17 }, (_, i) => (206 + i).toString()) },
                    { title: 'WATERSPIDER', associates: [], stations: ['North', 'South'] },
                    { title: 'TDR', associates: [], stations: ['North', 'South'] },
                    { title: 'DRIVERS', associates: [], stations: ['North', 'South'] },
                    { title: 'JAM CLEAR', associates: [], stations: ['North', 'South'] },
                    { title: 'DOCKSORT', associates: [], stations: ['North', 'South'] },
                    { title: 'North PIDS', associates: [], stations: ['PID4', 'PID5', 'PID6'] },
                    { title: 'South PIDS', associates: [], stations: ['PID1', 'PID2', 'PID3'] }
                ],
                Outbound: [{ title: 'Outbound Area', associates: [] }],
                Mansort: [{ title: 'Mansort Area', associates: [] }],
                NPC: [{ title: 'NPC Area', associates: [] }],
                '20lb': [{ title: '20lb Area', associates: [] }],
                '5lb': [{ title: '5lb Area', associates: [] }],
                Flow: [{ title: 'Flow Area', associates: [] }],
                RPND: [{ title: 'RPND Area', associates: [] }]
            };

            localStorage.setItem('areasData', JSON.stringify(areas[preset]));
            areasData = areas[preset]; // Update the areasData variable
            renderAreas(container, areasData, rosterData, colors);
            const presetsModal = bootstrap.Modal.getInstance(document.getElementById('presetsModal'));
            presetsModal.hide();
            location.reload(); // Refresh the page
        });
    });

    document.getElementById('startSessionButton').addEventListener('click', () => {
        fetch('/start-session', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const sessionLinkInput = document.getElementById('sessionLinkInput');
                    sessionLinkInput.value = data.lanUrl;

                    const sessionLinkModal = new bootstrap.Modal(document.getElementById('sessionLinkModal'));
                    sessionLinkModal.show();

                    document.getElementById('copySessionLinkButton').addEventListener('click', function() {
                        sessionLinkInput.select();
                        document.execCommand('copy');
                        alert('Link copied to clipboard');
                    });
                } else {
                    alert('Failed to start session. Check the server.');
                }
            })
            .catch(err => {
                console.error('Error starting session:', err);
                alert('Error starting session. Check the server.');
            });
    });
}
