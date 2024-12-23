import { renderAreas } from './ExportRenders.js';
import { areasData } from './sharedData.js';
import { getInboundPresets } from './InboundPresets.js';

document.addEventListener('DOMContentLoaded', () => {
    const presetsButton = document.getElementById('presetsButton');
    presetsButton.addEventListener('click', () => {
        const presetsModal = new bootstrap.Modal(document.getElementById('presetsModal'));
        presetsModal.show();
    });
});

document.querySelectorAll('.preset-btn').forEach(button => {
    button.addEventListener('click', function() {
        const preset = this.getAttribute('data-preset');
        console.log('Selected preset:', preset);

        if (typeof areasData === 'undefined') {
            console.error('areasData is not defined');
            return;
        }

        switch (preset) {
            case 'Inbound':
                areasData.length = 0; // Clear existing areasData
                areasData.push(...getInboundPresets());
                break;
            case 'Outbound':
                areasData.length = 0; // Clear existing areasData
                areasData.push(
                    { title: 'Outbound Area', associates: [] }
                );
                break;
            case 'Mansort':
                areasData.length = 0; // Clear existing areasData
                areasData.push(
                    { title: 'Mansort Area', associates: [] }
                );
                break;
            case 'NPC':
                areasData.length = 0; // Clear existing areasData
                areasData.push(
                    { title: 'NPC Area', associates: [] }
                );
                break;
            case '20lb':
                areasData.length = 0; // Clear existing areasData
                areasData.push(
                    { title: '20lb Area', associates: [] }
                );
                break;
            case '5lb':
                areasData.length = 0; // Clear existing areasData
                areasData.push(
                    { title: '5lb Area', associates: [] }
                );
                break;
            case 'Flow':
                areasData.length = 0; // Clear existing areasData
                areasData.push(
                    { title: 'Flow Area', associates: [] }
                );
                break;
            case 'RPND':
                areasData.length = 0; // Clear existing areasData
                areasData.push(
                    { title: 'RPND Area', associates: [] }
                );
                break;
            default:
                console.error('Unknown preset:', preset);
                return;
        }

        localStorage.setItem('areasData', JSON.stringify(areasData));
        renderAreas();
        const presetsModal = bootstrap.Modal.getInstance(document.getElementById('presetsModal'));
        presetsModal.hide();
        location.reload(); // Refresh the page
    });
});
