// Canvas starfield + ojos interactivos
(() => {
  /* STARFIELD */
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d', { alpha: true });

  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const numStars = Math.floor((w * h) / 8000); // densidad relativa
  const stars = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: rand(0.2, 1),
        size: Math.random() < 0.02 ? rand(1.2, 2.6) : rand(0.2, 1.0),
        twinkle: Math.random() * Math.PI * 2,
        speed: rand(0.0005, 0.002)
      });
    }
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, w, h);
    // subtle gradient glow
    const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/1.2);
    g.addColorStop(0, 'rgba(6,6,12,0.15)');
    g.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for (let s of stars) {
      // twinkle
      const tw = 0.6 + Math.sin(s.twinkle + time * s.speed * 5) * 0.4;
      const alpha = Math.max(0.2, Math.min(1, tw));
      ctx.beginPath();
      ctx.fillStyle = rgba(255,255,255,${alpha});
      ctx.arc(s.x, s.y, s.size * s.z, 0, Math.PI*2);
      ctx.fill();

      // small motion (drifting)
      s.x += (s.z - 0.5) * 0.02;
      s.y += s.speed * 30;
      s.twinkle += 0.02;

      if (s.x > w + 20) s.x = -20;
      if (s.y > h + 20) s.y = -20;
      if (s.x < -20) s.x = w + 20;
      if (s.y < -20) s.y = h + 20;
    }
  }

  let t0 = performance.now();
  function loop(now) {
    const dt = now - t0;
    drawStars(now * 0.002);
    t0 = now;
    requestAnimationFrame(loop);
  }

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    initStars();
  }

  addEventListener('resize', resize);
  initStars();
  requestAnimationFrame(loop);

  /* OJOS INTERACTIVOS */
  const eyes = document.querySelectorAll('.eye');
  const updatePupils = (clientX, clientY) => {
    eyes.forEach(eye => {
      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // vector desde el centro del ojo al cursor
      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // normalizar a un rango para la pupila (no saldrá del ojo)
      const maxDist = rect.width * 0.28;
      const dist = Math.min(Math.hypot(dx, dy), maxDist);
      const angle = Math.atan2(dy, dx);

      const px = Math.cos(angle) * (dist / rect.width) * 110; // %
      const py = Math.sin(angle) * (dist / rect.width) * 110; // %

      const pupil = eye.querySelector('.pupil');
      // posicionar usando porcentajes para mantener responsividad
      pupil.style.left = 50 + px / 2 + '%';
      pupil.style.top = 50 + py / 2 + '%';

      // pequeño ajuste de escala para simular enfoque cuando cursor está cerca
      const sizeFactor = 1 - Math.min(dist / maxDist, 0.6) * 0.3;
      pupil.style.width = (28 * sizeFactor) + '%';
      pupil.style.height = (28 * sizeFactor) + '%';
    });
  };

  // seguimiento del mouse
  window.addEventListener('mousemove', (e) => {
    updatePupils(e.clientX, e.clientY);
  });

  // Seguimiento por toque en móviles (usar touchmove)
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (t) updatePupils(t.clientX, t.clientY);
  }, { passive: true });

  // efecto sutil de parpadeo aleatorio
  function randomBlink() {
    const eye = eyes[Math.floor(Math.random() * eyes.length)];
    eye.classList.add('blink');
    setTimeout(() => eye.classList.remove('blink'), 260);
    // siguiente parpadeo entre 2.5s y 6.5s
    setTimeout(randomBlink, 2500 + Math.random() * 4000);
  }
  setTimeout(randomBlink, 1200);

  // Interacción: al pasar por encima, el ojo se "acerca"
  eyes.forEach(eye => {
    eye.addEventListener('mouseenter', () => {
      eye.style.transform = 'scale(1.04)';
    });
    eye.addEventListener('mouseleave', () => {
      eye.style.transform = 'scale(1)';
    });
  });

  // Para accesibilidad: si no hay mouse, centra las pupilas
  updatePupils(innerWidth / 2, innerHeight / 2);
})();
