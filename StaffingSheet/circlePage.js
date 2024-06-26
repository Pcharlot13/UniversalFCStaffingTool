document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const modal = document.getElementById('modal');
    const cancelBtn = document.getElementById('cancelBtn');

    // Draw a circle in the middle of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = '#0095DD';
    ctx.fill();

    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if the click was inside the circle
        if (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < radius) {
            modal.style.display = 'flex';
        }
    });

    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
});