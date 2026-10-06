/**
 * Act I: Deep Space Starfield & Falling Cursive Verses
 * Multi-layer twinkling stars with Retina DPR clamping
 */

export function initStardustScene() {
  const canvas = document.getElementById('deep-stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    stars = [];
    const numStars = Math.floor((window.innerWidth * window.innerHeight) / 3200);
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.6 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.012 + 0.004,
        direction: Math.random() > 0.5 ? 1 : -1,
        layer: Math.random() // Depth parallax coefficient
      });
    }
  }
  resize();
  window.addEventListener('resize', resize);

  // Render loop
  function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let s of stars) {
      s.alpha += s.speed * s.direction;
      if (s.alpha >= 1 || s.alpha <= 0.15) {
        s.direction *= -1;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * 0.85})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  render();

  // Cascade in the falling cursive prose with staggered elegance
  const lines = document.querySelectorAll('.falling-line');
  lines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add('in-view');
    }, 450 + index * 600);
  });
}

