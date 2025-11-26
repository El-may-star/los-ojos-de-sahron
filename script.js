document.addEventListener("mousemove", (event) => {
    const iris = document.querySelector(".iris");
    const eye = document.querySelector(".eye").getBoundingClientRect();

    let x = event.clientX - (eye.left + eye.width / 2);
    let y = event.clientY - (eye.top + eye.height / 2);

    const dist = Math.sqrt(x*x + y*y);
    const maxDist = 30; // límite para que no se salga del ojo

    if (dist > maxDist) {
        x = (x / dist) * maxDist;
        y = (y / dist) * maxDist;
    }

    iris.style.transform = `translate(${x}px, ${y}px)`;
});
