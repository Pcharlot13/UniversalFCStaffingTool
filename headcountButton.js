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
