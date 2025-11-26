document.addEventListener("mousemove", (event) => {
    const irises = document.querySelectorAll(".iris");

    irises.forEach((iris) => {
        const eye = iris.parentElement;
        const rect = eye.getBoundingClientRect();

        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);

        const maxMove = 25;

        const x = Math.cos(angle) * maxMove;
        const y = Math.sin(angle) * maxMove;

        iris.style.transform = `translate(${x}px, ${y}px)`;
    });
});
