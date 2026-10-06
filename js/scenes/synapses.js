/**
 * Act II: Stars into Synaptic Neurons
 * Bioluminescent neural network with electric action potentials
 */

export function initSynapsesScene() {
  const canvas = document.getElementById('synapse-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let neurons = [];

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function resize() {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    neurons = [];
    const count = 42;
    for (let i = 0; i < count; i++) {
      neurons.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 3 + 2,
        pulse: 0
      });
    }
  }
  resize();
  window.addEventListener('resize', resize);

  function render() {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    ctx.clearRect(0, 0, width, height);

    // Update & draw neurons
    for (let i = 0; i < neurons.length; i++) {
      const n = neurons[i];
      n.x += n.vx;
      n.y += n.vy;

      // Bounce at boundaries
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Distance from mouse
      const dx = mouseX - n.x;
      const dy = mouseY - n.y;
      const dist = Math.hypot(dx, dy);

      // Mouse fires action potentials
      if (dist < 130) {
        n.pulse = Math.min(n.pulse + 0.12, 1);
      } else {
        n.pulse = Math.max(n.pulse - 0.02, 0);
      }

      // Draw neuron soma (cell body)
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius + n.pulse * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = n.pulse > 0.2 ? '#fb7185' : '#38bdf8';
      ctx.shadowBlur = 14 + n.pulse * 10;
      ctx.shadowColor = n.pulse > 0.2 ? '#fb7185' : '#38bdf8';
      ctx.fill();

      // Connect with neighboring neurons (Axons & Dendrites)
      for (let j = i + 1; j < neurons.length; j++) {
        const n2 = neurons[j];
        const d2 = Math.hypot(n.x - n2.x, n.y - n2.y);
        if (d2 < 145) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          const alpha = (1 - d2 / 145) * 0.75;
          ctx.strokeStyle = n.pulse > 0.3 || n2.pulse > 0.3
            ? `rgba(251, 113, 133, ${alpha + 0.2})`
            : `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = n.pulse > 0.3 ? 1.5 : 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }
  render();
}

