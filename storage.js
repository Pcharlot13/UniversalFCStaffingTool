/**
 * Retrieve areas data from localStorage.
 * @returns {Array} The areas data.
 */
function getAreasData() {
    try {
        return JSON.parse(localStorage.getItem('areasData')) || [];
    } catch (error) {
        console.error('Error parsing areasData from localStorage:', error);
        return [];
    }
}

/**
 * Save areas data to localStorage.
 * @param {Array} data - The areas data to save.
 */
function setAreasData(data) {
    try {
        localStorage.setItem('areasData', JSON.stringify(data));
    } catch (error) {
        console.error('Error setting areasData to localStorage:', error);
    }
}

/**
 * Retrieve roster data from localStorage.
 * @returns {Array} The roster data.
 */
function getRosterData() {
    try {
        return JSON.parse(localStorage.getItem('rosterData')) || [];
    } catch (error) {
        console.error('Error parsing rosterData from localStorage:', error);
        return [];
    }
}

/**
 * Save roster data to localStorage.
 * @param {Array} data - The roster data to save.
 */
function setRosterData(data) {
    try {
        localStorage.setItem('rosterData', JSON.stringify(data));
    } catch (error) {
        console.error('Error setting rosterData to localStorage:', error);
    }
}
