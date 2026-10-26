/**
 * Star Cursor & Sparkling Stardust Particle Engine
 * Hardware-accelerated particle system with Retina DPR clamping
 * Features: Firefly twinkle, continuous white fairy dust ribbon, and Catmull-Rom spline flight
 */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let starX = mouseX;
let starY = mouseY;
const particles = [];
let isAutopilot = false;
let cursorStar = null;
let canvas = null;
let ctx = null;

// Spline flight state
let flightPoints = [];
let prevFlightX = 0;
let prevFlightY = 0;
const flightProgress = { p: 0 };

// Catmull-Rom spline interpolation helper (guarantees C1 tangent continuity)
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

function getSplinePoint(p) {
  if (!flightPoints || flightPoints.length < 4) return { x: starX, y: starY };
  const numSegments = flightPoints.length - 3;
  const val = Math.max(0, Math.min(0.9999, p)) * numSegments;
  const seg = Math.min(Math.floor(val), numSegments - 1);
  const t = val - seg;

  const p0 = flightPoints[seg];
  const p1 = flightPoints[seg + 1];
  const p2 = flightPoints[seg + 2];
  const p3 = flightPoints[seg + 3];

  return {
    x: catmullRom(p0.x, p1.x, p2.x, p3.x, t),
    y: catmullRom(p0.y, p1.y, p2.y, p3.y, t)
  };
}

// Emits continuous, unbroken ribbon of fairy dust along swept path between frames
function emitFairyDustAlongPath(fromX, fromY, toX, toY) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.5) return;

  // Spawn a particle every 3.5px along the flight curve
  const steps = Math.max(1, Math.min(24, Math.floor(dist / 3.5)));
  for (let s = 0; s < steps; s++) {
    const frac = s / steps;
    const px = fromX + dx * frac + (Math.random() - 0.5) * 3;
    const py = fromY + dy * frac + (Math.random() - 0.5) * 3;
    particles.push({
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25 + 0.04,
      size: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.35 + 0.65,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.12 + 0.04,
      r: 255,
      g: 255,
      b: 255,
      decay: Math.random() * 0.007 + 0.004 // Lingers ~2.5s creating an unbroken glowing ribbon
    });
  }
}

export function initCursor() {
  cursorStar = document.getElementById('cursor-star');
  canvas = document.getElementById('stardust-canvas');
  if (!canvas || !cursorStar) return;

  ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = window.innerWidth;
  let height = window.innerHeight;

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

    if (!isAutopilot) {
      // Emit close, shimmering white fairy dust particles
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 4,
          y: mouseY + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35 + 0.06,
          size: Math.random() * 1.6 + 0.6,
          alpha: Math.random() * 0.4 + 0.6,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.1 + 0.04,
          r: 255,
          g: 255,
          b: 255,
          decay: Math.random() * 0.022 + 0.016
        });
      }
    }
  });

  // On click: burst of celestial white starlight sparks
  window.addEventListener('click', (e) => {
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 / 18) * i;
      const speed = Math.random() * 3 + 2;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.2 + 1.2,
        alpha: 1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.15 + 0.05,
        r: 255,
        g: 255,
        b: 255,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  });

  // Render loop using native requestAnimationFrame (runs at 60Hz or 120Hz ProMotion)
  function render() {
    if (isAutopilot) {
      const curPos = getSplinePoint(flightProgress.p);
      starX = curPos.x;
      starY = curPos.y;

      // Continuously deposit fairy dust along path between frames
      emitFairyDustAlongPath(prevFlightX, prevFlightY, starX, starY);
      prevFlightX = starX;
      prevFlightY = starY;
    } else {
      starX += (mouseX - starX) * 0.35;
      starY += (mouseY - starY) * 0.35;
    }

    cursorStar.style.transform = `translate3d(${starX - 8}px, ${starY - 8}px, 0)`;

    // Render Stardust particles
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.twinkle !== undefined) p.twinkle += p.twinkleSpeed;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const displayAlpha = p.twinkle !== undefined 
        ? Math.max(0.1, p.alpha * (0.8 + 0.2 * Math.sin(p.twinkle))) 
        : p.alpha;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${displayAlpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(255, 255, 255, ${displayAlpha * 0.85})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  render();
}

/**
 * Cinematic Fairy Flight:
 * When verses dissolve, the star takes flight on its own,
 * tracing a silky, mathematically continuous Catmull-Rom rope loop into Chapter II!
 */
export function launchStarFairyFlight() {
  if (isAutopilot) return;
  isAutopilot = true;

  const W = window.innerWidth;
  const H = window.innerHeight;
  const startX = starX || (W * 0.35);
  const startY = starY || (H * 0.50);

  // 11-point Catmull-Rom spline (starts at cursor, gracefully climbs, dips, loops 360°, sweeps right, arrives in Scene 2)
  flightPoints = [
    { x: startX - 80, y: startY + 30 }, // P0: Tangent lead-in
    { x: startX,      y: startY },      // P1: Current cursor position
    { x: W * 0.42,    y: H * 0.36 },    // P2: Graceful rise up
    { x: W * 0.55,    y: H * 0.65 },    // P3: Swooping dip into loop
    { x: W * 0.67,    y: H * 0.38 },    // P4: Climbing front of loop
    { x: W * 0.60,    y: H * 0.18 },    // P5: Loop top crest — curling backward in X!
    { x: W * 0.52,    y: H * 0.42 },    // P6: Looping down back side, crossing path
    { x: W * 0.72,    y: H * 0.68 },    // P7: Swooping out through exit
    { x: W * 0.90,    y: H * 0.46 },    // P8: Sweeping across horizon towards right
    { x: W * 0.50,    y: H * 0.50 },    // P9: Arriving in center of Chapter II
    { x: W * 0.40,    y: H * 0.50 }     // P10: Tangent lead-out
  ];

  prevFlightX = startX;
  prevFlightY = startY;
  flightProgress.p = 0;
  let cameraTriggered = false;

  if (window.gsap) {
    gsap.to(flightProgress, {
      p: 1,
      duration: 7.2, // Slower, dreamy, unhurried fairy flight
      ease: "sine.inOut", // Silky sinusoidal acceleration & deceleration
      onUpdate: () => {
        // As the fairy completes the loop and sweeps toward the right edge, glide camera to next scene
        if (flightProgress.p > 0.48 && !cameraTriggered) {
          cameraTriggered = true;
          if (window.goToScene) {
            window.goToScene(1);
          }
        }
      },
      onComplete: () => {
        isAutopilot = false;
        mouseX = starX;
        mouseY = starY;

        // Soft arrival blossom of fairy dust sparkles in Chapter II
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2;
          const speed = Math.random() * 1.8 + 0.6;
          particles.push({
            x: starX,
            y: starY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 2.4 + 1.0,
            alpha: 1.0,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.15 + 0.05,
            r: 255,
            g: 255,
            b: 255,
            decay: Math.random() * 0.015 + 0.008
          });
        }
      }
    });
  }
}
