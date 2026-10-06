/**
 * Star Cursor & Sparkling Stardust Particle Engine
 * Hardware-accelerated particle system with Retina DPR clamping
 */

export function initCursor() {
  const cursorStar = document.getElementById('cursor-star');
  const canvas = document.getElementById('stardust-canvas');
  if (!canvas || !cursorStar) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouseX = width / 2;
  let mouseY = height / 2;
  let starX = mouseX;
  let starY = mouseY;
  const particles = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse move handler
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Emit trailing stardust particles
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: mouseX + (Math.random() - 0.5) * 8,
        y: mouseY + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6 + 0.35,
        size: Math.random() * 2.8 + 1.2,
        alpha: 1,
        hue: Math.random() > 0.4 ? 45 : 340, // Warm amber & soft rose
        decay: Math.random() * 0.02 + 0.015
      });
    }
  });

  // On click: burst of celestial sparks
  window.addEventListener('click', (e) => {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 / 16) * i;
      const speed = Math.random() * 3 + 2;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        hue: 50, // Golden radiance
        decay: Math.random() * 0.03 + 0.02
      });
    }
  });

  // Render loop using requestAnimationFrame
  function render() {
    // Smooth Lerp for Star Cursor element
    starX += (mouseX - starX) * 0.35;
    starY += (mouseY - starY) * 0.35;
    cursorStar.style.transform = `translate3d(${starX - 16}px, ${starY - 16}px, 0)`;

    // Render Stardust particles
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${p.hue}, 95%, 75%, ${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  render();
}

