// eventListeners.js
import './newButtonEventListener.js';

// newButtonEventListener.js
import { renderAreas } from './render.js';

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
                renderAreas();
                newAreaModal.hide();
            }
        } else {
            alert('Please enter a title for the new area.');
        }
    }, { once: true });
});
