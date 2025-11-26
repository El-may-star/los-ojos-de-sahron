document.addEventListener("mousemove", (event) => {
    const irises = document.querySelectorAll(".iris");

    irises.forEach((iris) => {
        const rect = iris.parentElement.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);

        const maxMove = 25; // rango natural

        const x = Math.cos(angle) * maxMove;
        const y = Math.sin(angle) * maxMove;

        iris.style.transform = `translate(${x}px, ${y}px)`;
    });
});
