/**
 * Horizontal Inertial Scroller & Camera Navigation Engine
 * Smooth translation of trackpad/wheel gestures into horizontal space
 */

let currentX = 0;
let targetX = 0;
let isAnimating = false;
let autoDriftActive = false;
let autoDriftRaf = null;
let trackElement = null;

function getMaxScroll() {
  return -(window.innerWidth * 2.4); // 340vw total horizontal space
}

let currentLerp = 0.09;
let currentSceneIndex = 0;

// Smooth LERP camera loop
function updateCamera() {
  if (!trackElement) {
    trackElement = document.getElementById('horizontal-track');
  }
  if (!trackElement) return;

  const maxScroll = getMaxScroll();
  targetX = Math.max(Math.min(targetX, 0), maxScroll);
  
  // LERP smoothing with cinematic easing
  currentX += (targetX - currentX) * currentLerp;
  trackElement.style.transform = `translate3d(${currentX}px, 0, 0)`;

  // Trigger Scene 0 poem whenever first screen is reached by scrolling
  if (Math.abs(currentX) < window.innerWidth * 0.15) {
    if (currentSceneIndex !== 0) {
      currentSceneIndex = 0;
      if (window.playStardustPoem) {
        window.playStardustPoem();
      }
    }
  } else if (currentX <= -window.innerWidth * 0.35) {
    currentSceneIndex = 1;
  }

  if (Math.abs(targetX - currentX) > 0.2 || autoDriftActive) {
    requestAnimationFrame(updateCamera);
  } else {
    currentX = targetX;
    trackElement.style.transform = `translate3d(${currentX}px, 0, 0)`;
    currentLerp = 0.09; // Reset to standard inertia
    isAnimating = false;
  }
}

export function requestCameraUpdate() {
  if (!isAnimating) {
    isAnimating = true;
    requestAnimationFrame(updateCamera);
  }
}

export function initScroller() {
  trackElement = document.getElementById('horizontal-track');
  const container = document.getElementById('storybook-container');
  if (!trackElement || !container) return;

  // Mouse wheel & trackpad listener
  window.addEventListener('wheel', (e) => {
    // If user is at top storybook section
    if (window.scrollY < 80) {
      const maxScroll = getMaxScroll();
      
      // If at end of horizontal track and scrolling down, allow smooth descent to Earth
      if (targetX <= maxScroll + 30 && e.deltaY > 20) {
        return; // Natural vertical scroll down
      }

      // If at beginning of horizontal track and scrolling up, prevent rubber banding
      if (targetX >= -10 && e.deltaY < -10) {
        return;
      }

      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetX -= delta * 1.35;
      requestCameraUpdate();
    }
  }, { passive: false });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (window.scrollY < 80) {
      if (e.key === 'ArrowRight') {
        targetX -= 250;
        requestCameraUpdate();
      } else if (e.key === 'ArrowLeft') {
        targetX += 250;
        requestCameraUpdate();
      } else if (e.key === 'ArrowDown') {
        scrollToEarth();
      }
    }
  });

  // Touch & drag gestures for mobile / tablets
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (window.scrollY < 80) {
      const touchX = e.touches[0].clientX;
      const deltaX = touchStartX - touchX;
      touchStartX = touchX;
      targetX -= deltaX * 1.5;
      requestCameraUpdate();
    }
  }, { passive: true });
}

export function goToScene(index) {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const offsets = [0, -window.innerWidth * 1.0, -window.innerWidth * 2.1];
  targetX = offsets[index] !== undefined ? offsets[index] : 0;
  
  // Highlight active breadcrumb
  const steps = document.querySelectorAll('.nav-step');
  steps.forEach((step, idx) => {
    if (idx === index) {
      step.classList.add('text-amber-300');
    } else {
      step.classList.remove('text-amber-300');
    }
  });

  // Trigger smooth slow cinematic camera update
  currentLerp = 0.048;
  requestCameraUpdate();

  // If navigating back to Scene 0, play verse cascade
  if (index === 0) {
    currentSceneIndex = 0;
    if (window.playStardustPoem) {
      window.playStardustPoem();
    }
  } else {
    currentSceneIndex = index;
  }
}

export function scrollToEarth() {
  const earth = document.getElementById('earth-section');
  if (earth) {
    earth.scrollIntoView({ behavior: 'smooth' });
  }
}

export function scrollToStars() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  targetX = 0;
  goToScene(0);
}

export function toggleAutoDrift() {
  autoDriftActive = !autoDriftActive;
  const text = document.getElementById('guide-text');
  const icon = document.getElementById('guide-icon');

  if (autoDriftActive) {
    if (text) text.innerText = "Auto-Drift: On";
    if (icon) icon.innerText = "🚀";

    function stepDrift() {
      if (!autoDriftActive) return;
      const maxScroll = -(window.innerWidth * 2.4);
      if (targetX > maxScroll) {
        targetX -= 2.2;
        currentX += (targetX - currentX) * 0.15;
        const track = document.getElementById('horizontal-track');
        if (track) track.style.transform = `translate3d(${currentX}px, 0, 0)`;
        autoDriftRaf = requestAnimationFrame(stepDrift);
      } else {
        toggleAutoDrift();
        scrollToEarth();
      }
    }
    autoDriftRaf = requestAnimationFrame(stepDrift);
  } else {
    if (text) text.innerText = "Auto-Drift: Off";
    if (icon) icon.innerText = "✨";
    if (autoDriftRaf) cancelAnimationFrame(autoDriftRaf);
  }
}

