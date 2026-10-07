/**
 * Act I: Deep Space Starfield & Falling Cursive Verses
 * Multi-layer twinkling stars with Retina DPR clamping
 */

import { launchStarFairyFlight } from '../core/cursor.js';

let poemTimeline = null;

export function playStardustPoem() {
  const lines = document.querySelectorAll('.falling-line');
  if (!lines || lines.length === 0 || !window.gsap) return;

  if (poemTimeline) {
    poemTimeline.kill();
  }

  // The first line is ALWAYS visible initially on the first screen!
  gsap.set(lines[0], { y: 0, opacity: 0.55, filter: 'blur(0px)' });

  // Subsequent lines (2, 3, 4) start placed above, blurry and hidden
  for (let i = 1; i < lines.length; i++) {
    gsap.set(lines[i], { y: -35, opacity: 0, filter: 'blur(8px)' });
  }

  poemTimeline = gsap.timeline();

  // 1. First line gently awakens/breathes with starlight clarity
  poemTimeline.to(lines[0], {
    opacity: 0.75,
    duration: 1.8,
    ease: 'power1.inOut'
  }, 0.5);

  // 2. Sequential descent of lines 2, 3, 4 with poetic overlap
  const targetOpacities = [0.75, 0.65, 0.85, 1.0];
  for (let i = 1; i < lines.length; i++) {
    poemTimeline.to(lines[i], {
      y: 0,
      opacity: targetOpacities[i] || 0.85,
      filter: 'blur(0px)',
      duration: 3.2,
      ease: 'power2.out'
    }, i === 1 ? '-=0.4' : '-=1.0');
  }

  // 3. Once the last line "wonder" finishes showing, wait exactly 2 seconds
  poemTimeline.to({}, { duration: 2.0 });

  // 4. Trigger fairy dust flight animation to next scene!
  poemTimeline.call(() => {
    if (typeof launchStarFairyFlight === 'function') {
      launchStarFairyFlight();
    } else if (window.launchStarFairyFlight) {
      window.launchStarFairyFlight();
    }
  });

  // 5. As the fairy takes flight, verses dissolve away top-to-down
  lines.forEach((line, i) => {
    poemTimeline.to(line, {
      y: 45,
      opacity: 0,
      filter: 'blur(8px)',
      duration: 2.6,
      ease: 'power2.in'
    }, i === 0 ? '+=0.1' : '-=1.3');
  });

  // 6. On dissolution complete, restore Line 1 so it's always waiting on the first screen
  poemTimeline.call(() => {
    gsap.set(lines[0], { y: 0, opacity: 0.55, filter: 'blur(0px)' });
    for (let i = 1; i < lines.length; i++) {
      gsap.set(lines[i], { y: -35, opacity: 0, filter: 'blur(8px)' });
    }
  });
}

export function replayStardustPoem() {
  playStardustPoem();
}

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
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * 0.9})`;
      if (s.radius > 1.2) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(255, 255, 255, ${s.alpha * 0.8})`;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  render();

  // Initialize and start verse sequence on load
  playStardustPoem();
}


