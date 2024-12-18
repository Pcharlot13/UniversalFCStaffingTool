document.getElementById('clearDataButton').addEventListener('click', () => {
    // Add functionality to clear all data
    if (confirm("Are you sure you want to clear all data?")) {
        localStorage.removeItem('areasData');
        localStorage.removeItem('rosterData');
        areasData = [];
        rosterData = [];
        renderAreas();
    }
});
