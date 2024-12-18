import { renderAreas } from './render.js';

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
        renderAreas();
        const presetsModal = bootstrap.Modal.getInstance(document.getElementById('presetsModal'));
        presetsModal.hide();
        location.reload(); // Refresh the page
    });
});
