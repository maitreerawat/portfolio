/**
 * Main Application Orchestrator
 * Coordinates all scenes, hardware-accelerated cameras, and interactions
 */

import { initCursor, launchStarFairyFlight } from './core/cursor.js';
import { initScroller, goToScene, scrollToEarth, scrollToStars, toggleAutoDrift } from './core/scroller.js';
import { initStardustScene, playStardustPoem, replayStardustPoem } from './scenes/stardust.js';
import { initSynapsesScene } from './scenes/synapses.js';
import { initTreeScene } from './scenes/tree.js';

// Expose navigation helpers globally for UI buttons
window.goToScene = goToScene;
window.scrollToEarth = scrollToEarth;
window.scrollToStars = scrollToStars;
window.autoGlideToggle = toggleAutoDrift;
window.launchStarFairyFlight = launchStarFairyFlight;
window.playStardustPoem = playStardustPoem;
window.replayStardustPoem = replayStardustPoem;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Core Engines
  initCursor();
  initScroller();

  // 2. Initialize Narrative Scenes
  initStardustScene();
  initSynapsesScene();
  initTreeScene();

  // 3. Initialize Earth Section Inquiry Generator
  initInquiryGenerator();
});

function initInquiryGenerator() {
  const sparkBtn = document.getElementById('spark-inquiry-btn');
  const titleEl = document.getElementById('earth-idea-title');
  if (!sparkBtn || !titleEl) return;

  const inquiries = [
    "How can AI decode subtle behavioral rhythms to prevent burnout and restore human connection?",
    "Can intelligent agents be crafted with emotional warmth to support mental well-being in underserved communities?",
    "What if AI tools helped us recognize our own cognitive biases and listen to others with greater compassion?",
    "How do we design algorithms that protect human vulnerability rather than exploiting psychological triggers?",
    "Can we use behavioral psychology and machine learning to build compassionate tools for collective healing?",
    "Can AI adapt dynamically to individual neurodiversity, reducing sensory anxiety in overwhelming environments?",
    "What happens to human empathy when machines learn to express unconditional positive regard?"
  ];

  let currentIdx = 0;

  sparkBtn.addEventListener('click', () => {
    if (window.gsap) {
      gsap.to(titleEl, {
        opacity: 0,
        y: -10,
        duration: 0.18,
        onComplete: () => {
          currentIdx = (currentIdx + 1) % inquiries.length;
          titleEl.innerText = inquiries[currentIdx];
          gsap.to(titleEl, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "back.out(1.7)"
          });
        }
      });
      gsap.fromTo(sparkBtn, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    } else {
      currentIdx = (currentIdx + 1) % inquiries.length;
      titleEl.innerText = inquiries[currentIdx];
    }
  });
}

