document.addEventListener("DOMContentLoaded", function () {
    const associate = document.getElementById("associate-1");

    associate.addEventListener("dragstart", dragStart);
    associate.addEventListener("dragend", dragEnd);

    const buckets = document.querySelectorAll(".bucket");

    buckets.forEach(bucket => {
        bucket.addEventListener("dragover", dragOver);
        bucket.addEventListener("dragenter", dragEnter);
        bucket.addEventListener("dragleave", dragLeave);
        bucket.addEventListener("drop", dragDrop);
    });

    function dragStart() {
        this.classList.add("dragging");
    }

    function dragEnd() {
        this.classList.remove("dragging");
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add("hovered");
    }

    function dragLeave() {
        this.classList.remove("hovered");
    }

    function dragDrop() {
        this.classList.remove("hovered");
        this.append(document.querySelector(".dragging"));
    }
});
