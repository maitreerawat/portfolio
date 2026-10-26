/**
 * Main Application Orchestrator
 * Coordinates the 3D MRI Brain, Editorial Prose Readout, Interactive Microscopic Neuron Study, and Bottom Emotion Tiles.
 */

import { initCursor } from './core/cursor.js';
import { EMOTIONS } from './data/emotions.js';
import { Brain3DEngine } from './scenes/brain3d.js';

let brainEngine = null;
let neuronStudy = null;
let brainCompass = null;

window.scrollToEarth = scrollToEarth;
window.scrollToBrain = scrollToBrain;
window.scrollToStars = scrollToBrain;

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  neuronStudy = new NeuronMorphologyStudy('neuron-morphology-canvas', 'readout-neuron-type', 'readout-neuron-desc');
  initBrainSandbox();
  initInquiryGenerator();
});

function initBrainSandbox() {
  const emotionBarEl = document.getElementById('emotion-bottom-bar');

  if (emotionBarEl) {
    emotionBarEl.innerHTML = '';
    EMOTIONS.forEach((emo) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.emotionId = emo.id;
      btn.className =
        'emotion-pill shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 flex items-center space-x-2 text-slate-900 border border-transparent';

      btn.innerHTML = `
        <span class="w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-300"
              style="background-color: ${emo.color}; box-shadow: 0 0 8px ${emo.color};"></span>
        <span>${emo.name}</span>
      `;

      btn.addEventListener('mouseenter', () => {
        if (brainEngine && window.matchMedia('(hover: hover)').matches) {
          brainEngine.setHoveredEmotionPreview(emo);
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (brainEngine && window.matchMedia('(hover: hover)').matches) {
          brainEngine.setHoveredEmotionPreview(null);
        }
      });

      btn.addEventListener('click', () => {
        if (brainEngine) {
          brainEngine.selectEmotion(emo.id, true);
        }
      });

      emotionBarEl.appendChild(btn);
    });
  }

  brainEngine = new Brain3DEngine('brain-canvas-container', {
    onEmotionChange: (emo) => {
      updateBottomTilesUI(emo);
    },
    onEmotionHover: (hoveredEmo) => {
      updateHoveredTileUI(hoveredEmo, brainEngine ? brainEngine.currentEmotion : EMOTIONS[0]);
    }
  });

  brainCompass = new BrainAxisCompass('brain-compass-canvas', 'brain-view-readout', brainEngine);

  updateBottomTilesUI(brainEngine.currentEmotion);
}

function updateHoveredTileUI(hoveredEmo, activeEmo) {
  const pills = document.querySelectorAll('.emotion-pill');
  pills.forEach((pill) => {
    const id = pill.dataset.emotionId;
    const isActive = activeEmo && id === activeEmo.id;
    const isHovered = hoveredEmo && id === hoveredEmo.id;

    if (isActive) {
      pill.style.color = '#0f172a';
      pill.style.borderColor = 'rgba(15, 23, 42, 0.25)';
      pill.style.backgroundColor = 'rgba(15, 23, 42, 0.08)';
    } else if (isHovered) {
      pill.style.color = '#0f172a';
      pill.style.borderColor = hoveredEmo.color;
      pill.style.backgroundColor = 'rgba(15, 23, 42, 0.04)';
    } else {
      pill.style.color = '#334155';
      pill.style.borderColor = 'transparent';
      pill.style.backgroundColor = 'transparent';
    }
  });
}

let lastEmotionId = null;

function updateBottomTilesUI(emo) {
  const emotionBarEl = document.getElementById('emotion-bottom-bar');
  const pills = document.querySelectorAll('.emotion-pill');
  pills.forEach((pill) => {
    const isActive = pill.dataset.emotionId === emo.id;
    if (isActive) {
      pill.style.color = '#0f172a';
      pill.style.borderColor = 'rgba(15, 23, 42, 0.22)';
      pill.style.backgroundColor = 'rgba(15, 23, 42, 0.08)';
      if (emotionBarEl && window.innerWidth < 1024) {
        const targetScrollLeft = pill.offsetLeft - emotionBarEl.clientWidth / 2 + pill.clientWidth / 2;
        emotionBarEl.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    } else {
      pill.style.color = '#334155';
      pill.style.borderColor = 'transparent';
      pill.style.backgroundColor = 'transparent';
    }
  });

  const readoutEl = document.getElementById('editorial-readout');
  const headingEl = document.getElementById('readout-heading');
  const regionEl = document.getElementById('readout-region-name');
  const neuronBlockEl = document.getElementById('neuron-study-block');
  const proseBodyEl = document.getElementById('readout-prose-body');
  const primaryEl = document.getElementById('readout-body-primary');
  const somaticEl = document.getElementById('readout-body-somatic');
  const secondaryEl = document.getElementById('readout-body-secondary');

  const applyCopy = () => {
    if (headingEl) headingEl.textContent = emo.heading;
    const c1 = neuronStudy ? neuronStudy.hexToRgb(emo.color) : { r: 2, g: 132, b: 199 };
    const c2 = neuronStudy ? neuronStudy.hexToRgb(emo.secondaryColor || emo.color) : c1;

    if (regionEl) {
      regionEl.textContent = emo.regionName;
      regionEl.style.color = `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.82)`;
    }
    if (primaryEl) primaryEl.textContent = emo.bodyPrimary;
    if (somaticEl) somaticEl.textContent = emo.bodySomatic;
    if (secondaryEl) secondaryEl.textContent = emo.bodySecondary;

    const ambientWashEl = document.getElementById('brain-ambient-wash');
    if (ambientWashEl) {
      ambientWashEl.style.background = `radial-gradient(circle at 72% 45%, rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.08) 0%, rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.04) 38%, transparent 70%), radial-gradient(circle at 22% 35%, rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.05) 0%, transparent 55%)`;
    }

    if (neuronBlockEl) {
      if (emo.id === 'resting') {
        neuronBlockEl.classList.add('hidden');
      } else {
        neuronBlockEl.classList.remove('hidden');
        neuronBlockEl.style.background = `linear-gradient(120deg, rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.065) 0%, rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.045) 100%)`;
        if (neuronStudy) {
          neuronStudy.resize();
          neuronStudy.setEmotion(emo);
        }
      }
    }
  };

  if (lastEmotionId && lastEmotionId !== emo.id && readoutEl) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'select_emotion', {
        emotion_id: emo.id,
        emotion_name: emo.name
      });
    }
    readoutEl.style.opacity = '0';
    setTimeout(() => {
      applyCopy();
      readoutEl.style.opacity = '1';
    }, 160);
  } else {
    applyCopy();
  }
  lastEmotionId = emo.id;
}

/**
 * Interactive Microscopic Neuron Morphology Study (Santiago Ramón y Cajal Inspired)
 * Renders the distinct real-world anatomical neuron shape of each brain region,
 * with live hover detection for Soma, Apical/Basal Dendrites, Dendritic Spines, and Axon.
 */
class NeuronMorphologyStudy {
  constructor(canvasId, labelId, descId) {
    this.canvas = document.getElementById(canvasId);
    this.labelEl = document.getElementById(labelId);
    this.descEl = document.getElementById(descId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = 360;
    this.height = 112;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.currentEmo = EMOTIONS[0];
    this.emotionId = 'resting';
    this.rgb = { r: 5, g: 213, b: 255 };
    this.targetRgb = { r: 5, g: 213, b: 255 };
    this.speedMult = 1.0;

    this.branches = [];
    this.somas = [];
    this.spines = [];
    this.pulses = Array.from({ length: 24 }, (_, i) => ({
      branchIdx: i,
      t: (i * 0.13) % 1.0,
      speed: 0.0085 + (i % 5) * 0.0028
    }));

    this.pointer = { x: -999, y: -999, active: false };
    this.hoveredPart = null;
    this.selectedPart = null;
    this.transitionAlpha = 1.0;

    this.resize();
    this.buildMorphology('resting');

    window.addEventListener('resize', () => {
      this.resize();
      this.buildMorphology(this.emotionId);
    });

    this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.canvas.addEventListener('pointerleave', (e) => this.onPointerLeave(e));

    this.startTime = performance.now();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 360;
    this.height = rect.height || 112;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
  }

  hexToRgb(hex) {
    const clean = (hex || '#05D5FF').replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  setEmotion(emo) {
    this.currentEmo = emo;
    this.emotionId = emo.id;
    this.targetRgb = this.hexToRgb(emo.color);
    this.speedMult = emo.firingSpeed || 1.0;
    this.hoveredPart = null;
    this.selectedPart = null;
    this.transitionAlpha = 0.15;
    this.buildMorphology(emo.id);
    this.updateLabel();
  }

  updateLabel() {
    if (!this.labelEl) return;
    const c = this.targetRgb || { r: 71, g: 85, b: 105 };
    const activePart = this.hoveredPart || this.selectedPart;
    if (activePart) {
      this.labelEl.textContent = activePart.name;
      this.labelEl.style.color = `rgba(${c.r}, ${c.g}, ${c.b}, 0.92)`;
      if (this.descEl) {
        this.descEl.textContent = activePart.desc;
        this.descEl.style.color = '#334155';
      }
    } else {
      this.labelEl.textContent = this.currentEmo.neuronType;
      this.labelEl.style.color = `rgba(${c.r}, ${c.g}, ${c.b}, 0.78)`;
      if (this.descEl && this.currentEmo.neuronSimpleDesc) {
        this.descEl.textContent = this.currentEmo.neuronSimpleDesc;
        this.descEl.style.color = '#64748b';
      }
    }
  }

  findPartAt(x, y) {
    let bestPart = null;
    let minDist = 30;

    // 1. Check Somas first (Cell Body & Nucleus)
    for (let i = 0; i < this.somas.length; i++) {
      const s = this.somas[i];
      const d = Math.hypot(x - s.x, y - s.y);
      if (d < Math.max(s.rx, s.ry) + 12) {
        bestPart = {
          type: 'soma',
          name: s.partName || 'Soma (Cell Body & Nucleus)',
          desc: s.partDesc || 'Integrates incoming electrical signals and houses the nucleus',
          x: s.x,
          y: s.y
        };
        minDist = 0;
        break;
      }
    }

    // 2. Check Spines / Synaptic Boutons
    if (!bestPart) {
      for (let i = 0; i < this.spines.length; i++) {
        const sp = this.spines[i];
        const d = Math.hypot(x - sp.x, y - sp.y);
        if (d < 14 && d < minDist) {
          minDist = d;
          bestPart = {
            type: 'spine',
            name: sp.partName || 'Dendritic Spines & Synaptic Boutons',
            desc: sp.partDesc || 'Microscopic receptor sites where neurotransmitters bind',
            x: sp.x,
            y: sp.y
          };
        }
      }
    }

    // 3. Check Dendrites & Axons
    if (!bestPart) {
      for (let i = 0; i < this.branches.length; i++) {
        const br = this.branches[i];
        const mx = 0.25 * br.x0 + 0.5 * br.cx + 0.25 * br.x1;
        const my = 0.25 * br.y0 + 0.5 * br.cy + 0.25 * br.y1;
        const d = Math.min(
          Math.hypot(x - mx, y - my),
          Math.hypot(x - br.x1, y - br.y1)
        );
        if (d < minDist) {
          minDist = d;
          bestPart = {
            type: br.partType,
            name: br.partName,
            desc: br.partDesc,
            x: mx,
            y: my
          };
        }
      }
    }

    return bestPart;
  }

  onPointerDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.active = true;

    const hitPart = this.findPartAt(x, y);
    this.selectedPart = hitPart;
    this.hoveredPart = hitPart;
    this.updateLabel();
  }

  onPointerMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.active = true;

    const bestPart = this.findPartAt(x, y);
    const prevName = this.hoveredPart ? this.hoveredPart.name : null;
    const nextName = bestPart ? bestPart.name : null;
    this.hoveredPart = bestPart;
    if (e.pointerType === 'touch' && bestPart) {
      this.selectedPart = bestPart;
    }
    if (prevName !== nextName) {
      this.updateLabel();
    }
  }

  onPointerLeave() {
    this.pointer.active = false;
    if (this.hoveredPart) {
      this.hoveredPart = null;
      this.updateLabel();
    }
  }

  addBranch(x0, y0, cx, cy, x1, y1, weight = 1.0, isDendrite = false, partType = 'axon', partName = 'Axon Tract', partDesc = 'Fires action potentials outward to downstream neurons') {
    this.branches.push({
      x0,
      y0,
      cx,
      cy,
      x1,
      y1,
      weight,
      isDendrite,
      partType,
      partName,
      partDesc,
      phase: this.branches.length * 0.43
    });
  }

  addFractalTree(x, y, angle, length, depth, spreadAngle, weight, isDendrite = true, partType = 'dendrite', partName = 'Dendritic Arbor', partDesc = 'Receives synaptic signals and channels them inward to the soma') {
    if (depth <= 0 || length < 4) return;
    const x1 = x + Math.cos(angle) * length;
    const y1 = y + Math.sin(angle) * length;
    const bend = (depth % 2 === 0 ? 1 : -1) * length * 0.15;
    const cx = (x + x1) * 0.5 - Math.sin(angle) * bend;
    const cy = (y + y1) * 0.5 + Math.cos(angle) * bend;

    this.addBranch(x, y, cx, cy, x1, y1, weight, isDendrite, partType, partName, partDesc);

    this.addFractalTree(x1, y1, angle - spreadAngle, length * 0.72, depth - 1, spreadAngle * 0.88, weight * 0.74, isDendrite, partType, partName, partDesc);
    this.addFractalTree(x1, y1, angle + spreadAngle, length * 0.72, depth - 1, spreadAngle * 0.88, weight * 0.74, isDendrite, partType, partName, partDesc);
  }

  buildMorphology(id) {
    this.branches = [];
    this.somas = [];
    this.spines = [];

    const w = this.width;
    const h = this.height;
    const cx = w * 0.45;
    const cy = h * 0.5;

    switch (id) {
      case 'empathy': {
        this.somas.push({
          x: cx,
          y: cy,
          rx: 17,
          ry: 4.8,
          shape: 'spindle',
          partName: 'Cell Body / Soma (The Decision Core)',
          partDesc: 'Shaped like a sleek spindle so it can pass “I feel what you feel” signals without delay.'
        });
        this.addBranch(cx - 14, cy, cx - 65, cy - 2, cx - 120, cy, 1.55, true, 'apical', 'Receiving Dendrite (The Listening Antenna)', 'Catches emotional signals from your mirror neurons when you see someone else hurting or smiling.');
        this.addFractalTree(cx - 120, cy, Math.PI, 24, 2, 0.42, 0.92, true, 'apical', 'Listening Branches (Dendritic Tips)', 'Fine antenna tips that pick up subtle shifts in another person’s voice and face.');
        this.addBranch(cx + 14, cy, cx + 65, cy + 2, cx + 122, cy, 1.55, false, 'axon', 'Outgoing Axon (The Express Sending Cable)', 'Shoots a fast electrical spark across your brain so you physically feel their emotion in your own chest.');
        this.addFractalTree(cx + 122, cy, 0, 24, 2, 0.42, 0.92, false, 'axon', 'Sending Terminals (Axon Ends)', 'Passes the empathy signal onward to soften your eyes, voice, and hands.');
        this.addBranch(cx - 35, cy - 1, cx - 58, cy - 18, cx - 82, cy - 24, 0.75, true, 'dendrite', 'Side Listening Branch (Collateral Dendrite)', 'Links nearby brain cells together so the feeling resonates clearly.');
        this.addBranch(cx + 35, cy + 1, cx + 58, cy + 18, cx + 82, cy + 24, 0.75, false, 'axon', 'Side Sending Wire (Axon Collateral)', 'Coordinates both sides of the brain at the same time.');
        break;
      }

      case 'wonder': {
        const sx = w * 0.22;
        this.somas.push({
          x: sx,
          y: cy,
          rx: 8.5,
          ry: 7.5,
          shape: 'pyramid',
          partName: 'Pyramid Cell Body (The Integration Core)',
          partDesc: 'A triangular core that combines what your eyes see with deep curiosity and awe.'
        });
        for (let i = -2; i <= 2; i++) {
          const ang = Math.PI + i * 0.36;
          this.addFractalTree(sx - 5, cy + i * 2, ang, 24, 2, 0.45, 0.85, true, 'basal', 'Root Branches (Basal Dendrites)', 'Gather your existing knowledge so you can recognize when something is brand new.');
        }
        const tx = w * 0.58;
        this.addBranch(sx + 6, cy, (sx + tx) * 0.5, cy - 3, tx, cy, 1.65, true, 'apical', 'Main Trunk (Apical Shaft)', 'A tall central highway carrying signals from the top crown down into the cell’s core.');
        this.addBranch(sx + 38, cy - 1, sx + 55, cy - 24, sx + 80, cy - 34, 0.88, true, 'dendrite', 'Side Branches (Oblique Dendrites)', 'Connect sight, sound, and goosebumps into one unified moment.');
        this.addBranch(sx + 42, cy + 1, sx + 60, cy + 24, sx + 84, cy + 34, 0.88, true, 'dendrite', 'Side Branches (Oblique Dendrites)', 'Connect sight, sound, and goosebumps into one unified moment.');
        this.addFractalTree(tx, cy, -0.36, 36, 3, 0.42, 1.18, true, 'tuft', 'The Crown (Apical Dendritic Tuft)', 'Spreads wide at the top of the brain like a tree canopy to drink in new ideas and mystery.');
        this.addFractalTree(tx, cy, 0.36, 36, 3, 0.42, 1.18, true, 'tuft', 'The Crown (Apical Dendritic Tuft)', 'Spreads wide at the top of the brain like a tree canopy to drink in new ideas and mystery.');
        break;
      }

      case 'joy': {
        this.somas.push({
          x: cx,
          y: cy,
          rx: 7,
          ry: 7,
          shape: 'circle',
          partName: 'Cell Body / Soma (The Joy Core)',
          partDesc: 'The central hub that lights up when enough dopamine buds are triggered, sparking laughter and energy.'
        });
        const arms = 8;
        for (let i = 0; i < arms; i++) {
          const ang = (i / arms) * Math.PI * 2;
          const len = Math.abs(Math.cos(ang)) * 28 + 20;
          const isAxon = i === 0;
          this.addFractalTree(
            cx,
            cy,
            ang,
            len,
            2,
            0.38,
            1.08,
            !isAxon,
            isAxon ? 'axon' : 'dendrite',
            isAxon ? 'Outgoing Axon (The Smile & Energy Wire)' : 'Starburst Branches (Receiving Dendrites)',
            isAxon ? 'Sends the burst of joy outward to crinkle your eyes, lift your cheeks, and energize your hands.' : 'Spread out in a 360° star so the cell can catch feel-good chemicals from every direction.'
          );
        }
        for (let b = 0; b < this.branches.length; b++) {
          const br = this.branches[b];
          this.spines.push({
            x: (br.x0 + br.x1) * 0.5 + (b % 2 === 0 ? 3.5 : -3.5),
            y: (br.y0 + br.y1) * 0.5 + (b % 3 === 0 ? -3.5 : 3.5),
            partName: 'Dopamine Spines (Feel-Good Docking Buds)',
            partDesc: 'Tiny glowing buds along the branches where dopamine and endorphin molecules lock in.'
          });
        }
        break;
      }

      case 'vulnerability': {
        const ax = w * 0.28;
        const px = w * 0.68;
        this.somas.push({
          x: ax,
          y: cy,
          rx: 6.5,
          ry: 6.5,
          shape: 'circle',
          partName: 'Alarm Cell Core (Amygdala Soma)',
          partDesc: 'Spots emotional risk or exposure in 20 milliseconds and makes your heart beat faster.'
        });
        this.somas.push({
          x: px,
          y: cy,
          rx: 6,
          ry: 6,
          shape: 'circle',
          partName: 'Calming Cell Core (Prefrontal Helper Neuron)',
          partDesc: 'Steps in when you choose to be brave, sending soothing signals to calm the alarm cell.'
        });
        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2 + 0.25;
          this.addFractalTree(ax, cy, ang, 22, 2, 0.45, 0.95, true, 'dendrite', 'Alarm Listening Branches (Amygdala Dendrites)', 'Scan for signs of judgment, danger, or being deeply seen.');
        }
        this.addBranch(px, cy, (ax + px) * 0.5, cy - 36, ax + 12, cy - 14, 1.3, false, 'axon', 'Calming Embrace Wire (Regulatory Axon)', 'Reaches across from the calming cell to gently hug the alarm cell so fear doesn’t take over.');
        this.addBranch(px, cy, (ax + px) * 0.5, cy + 36, ax + 12, cy + 14, 1.3, false, 'axon', 'Calming Embrace Wire (Regulatory Axon)', 'Reaches across from the calming cell to gently hug the alarm cell so fear doesn’t take over.');
        this.addBranch(px, cy, (ax + px) * 0.5, cy, ax + 8, cy, 1.15, false, 'axon', 'Courage Bridge (Inhibitory Synapse)', 'Lets you feel raw emotion while keeping your voice and hands steady.');
        this.addFractalTree(px, cy, 0, 22, 2, 0.5, 0.85, true, 'dendrite', 'Conscious Thought Branches (Prefrontal Dendrites)', 'Listen to your inner voice reminding you that it is safe to stay open.');
        break;
      }

      case 'memory': {
        const gx = w * 0.24;
        const gy = cy + 6;
        this.somas.push({
          x: gx,
          y: gy,
          rx: 6.5,
          ry: 6.5,
          shape: 'circle',
          partName: 'Memory Cell Core (Hippocampal Granule Soma)',
          partDesc: 'Takes a present sensory trigger — like a song or scent — and unlocks a stored life memory.'
        });
        this.addFractalTree(gx, gy, -2.4, 25, 3, 0.35, 0.95, true, 'dendrite', 'Sensory Listening Cone (Dendrites)', 'Catches familiar sights, songs, and smells coming in from your senses.');
        this.addFractalTree(gx, gy, 2.5, 23, 2, 0.35, 0.9, true, 'dendrite', 'Sensory Listening Cone (Dendrites)', 'Catches familiar sights, songs, and smells coming in from your senses.');
        const m1x = w * 0.48, m1y = cy - 30;
        const m2x = w * 0.74, m2y = cy - 4;
        const m3x = w * 0.62, m3y = cy + 28;
        this.addBranch(gx + 5, gy, w * 0.34, cy - 28, m1x, m1y, 1.5, false, 'axon', 'The Seahorse Loop (Mossy-Fiber Axon)', 'A long looping cable that winds through the hippocampus to wake up old memories.');
        this.addBranch(m1x, m1y, w * 0.66, cy - 30, m2x, m2y, 1.5, false, 'axon', 'The Seahorse Loop (Mossy-Fiber Axon)', 'A long looping cable that winds through the hippocampus to wake up old memories.');
        this.addBranch(m2x, m2y, w * 0.78, cy + 20, m3x, m3y, 1.4, false, 'axon', 'Memory Replay Loop (CA3 Collateral)', 'Blends the old memory with how you feel about that person or place today.');
        this.spines.push(
          { x: m1x, y: m1y, partName: 'Memory Pearls (Giant Mossy Boutons)', partDesc: 'Extra-large connection hubs along the cable that hold vivid long-term memories together.' },
          { x: (m1x + m2x) * 0.5, y: m1y + 4, partName: 'Memory Pearls (Giant Mossy Boutons)', partDesc: 'Extra-large connection hubs along the cable that hold vivid long-term memories together.' },
          { x: m2x, y: m2y, partName: 'Memory Pearls (Giant Mossy Boutons)', partDesc: 'Extra-large connection hubs along the cable that hold vivid long-term memories together.' },
          { x: m3x, y: m3y, partName: 'Memory Pearls (Giant Mossy Boutons)', partDesc: 'Extra-large connection hubs along the cable that hold vivid long-term memories together.' }
        );
        break;
      }

      case 'imagination': {
        const sx = w * 0.22;
        this.somas.push({
          x: sx,
          y: cy,
          rx: 7.5,
          ry: 6,
          shape: 'circle',
          partName: 'Intuition Core (Purkinje Cell Body)',
          partDesc: 'Gathers 150,000 tiny signals at once from its coral fan and turns them into a single clear hunch.'
        });
        this.addBranch(sx - 6, cy, sx - 28, cy + 4, sx - 54, cy, 1.0, false, 'axon', 'Outgoing Intuition Wire (Axon)', 'Sends the finished “aha!” realization forward to your conscious mind and hands.');
        this.addFractalTree(sx + 6, cy, -0.44, 36, 4, 0.36, 1.38, true, 'dendrite', 'The Coral Sea-Fan (150,000 Listening Branches)', 'A massive, flat fan of branches in the back of the mind that weaves scattered memories into new ideas.');
        this.addFractalTree(sx + 6, cy, 0.0, 38, 4, 0.34, 1.38, true, 'dendrite', 'The Coral Sea-Fan (150,000 Listening Branches)', 'A massive, flat fan of branches in the back of the mind that weaves scattered memories into new ideas.');
        this.addFractalTree(sx + 6, cy, 0.44, 36, 4, 0.36, 1.38, true, 'dendrite', 'The Coral Sea-Fan (150,000 Listening Branches)', 'A massive, flat fan of branches in the back of the mind that weaves scattered memories into new ideas.');
        break;
      }

      case 'grief': {
        const sx = w * 0.2;
        this.somas.push({
          x: sx,
          y: cy - 4,
          rx: 7,
          ry: 5.5,
          shape: 'circle',
          partName: 'Soothing Pacemaker Core (Vagal Cell Body)',
          partDesc: 'Sits at the base of the brain and senses when emotional heartache needs physical comfort.'
        });
        this.addFractalTree(sx - 6, cy - 4, Math.PI, 22, 2, 0.45, 0.88, true, 'dendrite', 'Heartache Listening Branches (Dendrites)', 'Receive signals of loss and longing from the emotional center of the brain.');
        for (let i = -2; i <= 2; i++) {
          const midX = w * 0.48;
          const midY = cy + i * 10 - 6;
          const endX = w * 0.78 - Math.abs(i) * 8;
          const endY = cy + i * 14 + 6;
          this.addBranch(sx + 6, cy - 4, midX, midY, endX, endY, 1.25 - Math.abs(i) * 0.15, false, 'axon', 'Willow Calming Fibers (Vagus Nerve Axons)', 'Long, gentle cables that travel down to your chest to slow your heart rate and guide a deep exhale.');
          this.addFractalTree(endX, endY, 0.15 * i, 19, 2, 0.32, 0.78, false, 'axon', 'Healing Nerve Ends (Vagal Terminals)', 'Release natural soothing chemicals that ease the tightness in your throat and chest.');
        }
        break;
      }

      default: {
        const n1 = { x: w * 0.22, y: cy + 8, rx: 6, ry: 6, shape: 'circle', partName: 'Front Brain Hub (Cell Body)', partDesc: 'Handles quiet self-reflection and thinking about tomorrow.' };
        const n2 = { x: w * 0.48, y: cy - 16, rx: 6, ry: 6, shape: 'circle', partName: 'CenterRelay Hub (Cell Body)', partDesc: 'Links the left and right sides of your mind together.' };
        const n3 = { x: w * 0.74, y: cy + 6, rx: 6, ry: 6, shape: 'circle', partName: 'Back Brain Hub (Cell Body)', partDesc: 'Holds your personal life story and daydreaming.' };
        this.somas.push(n1, n2, n3);
        this.addBranch(n1.x, n1.y, (n1.x + n2.x) * 0.5, cy - 18, n2.x, n2.y, 1.35, false, 'axon', 'Connecting Bridge Wire (Axon)', 'Passes electrical thoughts from one brain cell to the next.');
        this.addBranch(n2.x, n2.y, (n2.x + n3.x) * 0.5, cy - 18, n3.x, n3.y, 1.35, false, 'axon', 'Connecting Bridge Wire (Axon)', 'Passes electrical thoughts from one brain cell to the next.');
        this.addBranch(n1.x, n1.y, (n1.x + n3.x) * 0.5, cy + 26, n3.x, n3.y, 1.15, false, 'axon', 'Long-Distance Bridge (Association Axon)', 'Keeps the front and back of your brain in sync while you rest.');
        this.addFractalTree(n1.x, n1.y, Math.PI - 0.3, 20, 2, 0.45, 0.85, true, 'dendrite', 'Listening Branches (Dendrites)', 'Tree-like antennas that catch incoming messages from nearby brain cells.');
        this.addFractalTree(n2.x, n2.y, -Math.PI * 0.5, 18, 2, 0.5, 0.85, true, 'dendrite', 'Listening Branches (Dendrites)', 'Tree-like antennas that catch incoming messages from nearby brain cells.');
        this.addFractalTree(n3.x, n3.y, 0.2, 20, 2, 0.45, 0.85, true, 'dendrite', 'Listening Branches (Dendrites)', 'Tree-like antennas that catch incoming messages from nearby brain cells.');
        break;
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.ctx || this.branches.length === 0) return;

    const time = (performance.now() - this.startTime) * 0.001;
    const ctx = this.ctx;
    const dpr = this.dpr;

    this.rgb.r += (this.targetRgb.r - this.rgb.r) * 0.12;
    this.rgb.g += (this.targetRgb.g - this.rgb.g) * 0.12;
    this.rgb.b += (this.targetRgb.b - this.rgb.b) * 0.12;
    this.transitionAlpha += (1.0 - this.transitionAlpha) * 0.1;

    const r = Math.round(this.rgb.r);
    const g = Math.round(this.rgb.g);
    const b = Math.round(this.rgb.b);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = 'source-over';

    const activePart = this.hoveredPart || this.selectedPart;

    // 1. Draw living, breathing dendritic and axonal branches
    for (let i = 0; i < this.branches.length; i++) {
      const br = this.branches[i];
      const isPartHovered = activePart && activePart.name === br.partName;

      // Multi-harmonic biological breathing wave + interactive cursor ripple
      let swayX = Math.cos(time * 2.1 + br.phase) * 1.4;
      let swayY = Math.sin(time * 2.4 + br.phase) * 2.4;

      if (this.pointer.active) {
        const dx = br.cx - this.pointer.x;
        const dy = br.cy - this.pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 48 && dist > 0.1) {
          const push = (1 - dist / 48) * 5.5;
          swayX += (dx / dist) * push;
          swayY += (dy / dist) * push;
        }
      }

      const boost = isPartHovered ? 1.28 : 1.0;
      const alpha = Math.min(0.88, 0.42 * br.weight * boost * this.transitionAlpha);

      ctx.beginPath();
      ctx.moveTo(br.x0, br.y0);
      ctx.quadraticCurveTo(br.cx + swayX, br.cy + swayY, br.x1 + swayX * 0.6, br.y1 + swayY * 0.6);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = Math.max(0.75, 1.25 * br.weight * (isPartHovered ? 1.22 : 1.0));
      ctx.stroke();
    }

    // 2. Draw synaptic spines / boutons
    for (let i = 0; i < this.spines.length; i++) {
      const sp = this.spines[i];
      const isSpineHovered = activePart && activePart.type === 'spine';
      const pulse = 0.5 + 0.5 * Math.sin(time * 3.8 + i * 0.9);
      const rad = (isSpineHovered ? 2.2 : 1.75) * (0.85 + 0.3 * pulse);

      ctx.beginPath();
      ctx.arc(sp.x, sp.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(isSpineHovered ? 0.68 : 0.5) + 0.32 * pulse})`;
      ctx.fill();
    }

    // 3. Draw breathing neuron cell bodies (somas)
    const somaBeat = 1.0 + 0.12 * Math.sin(time * 3.2 * this.speedMult);
    for (let i = 0; i < this.somas.length; i++) {
      const s = this.somas[i];
      const isSomaHovered = activePart && activePart.name === s.partName;
      const scale = somaBeat * (isSomaHovered ? 1.12 : 1.0);

      // Outer bioluminescent soma halo
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.rx * 1.85 * scale, s.ry * 1.85 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${isSomaHovered ? 0.35 : 0.22})`;
      ctx.fill();

      // Inner soma body
      ctx.beginPath();
      if (s.shape === 'pyramid') {
        ctx.moveTo(s.x + s.rx * 1.25 * scale, s.y);
        ctx.lineTo(s.x - s.rx * scale, s.y - s.ry * 1.15 * scale);
        ctx.lineTo(s.x - s.rx * scale, s.y + s.ry * 1.15 * scale);
        ctx.closePath();
      } else {
        ctx.ellipse(s.x, s.y, s.rx * scale, s.ry * scale, 0, 0, Math.PI * 2);
      }
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${isSomaHovered ? 0.95 : 0.8})`;
      ctx.fill();

      // Nucleus core
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.min(s.rx, s.ry) * 0.48 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fill();
    }

    // 4. Draw action-potential impulses traveling along the neuron's branches
    const hoverSpeedBoost = this.hoveredPart ? 1.45 : 1.0;
    for (let i = 0; i < this.pulses.length; i++) {
      const p = this.pulses[i];
      p.t += p.speed * this.speedMult * hoverSpeedBoost;
      if (p.t >= 1.0) {
        p.t -= 1.0;
        p.branchIdx = (p.branchIdx + 3) % this.branches.length;
      }

      const br = this.branches[p.branchIdx % this.branches.length];
      // Ramón y Cajal's Law of Dynamic Polarization: dendrites flow inward (1 -> 0), axons flow outward (0 -> 1)
      const t = br.isDendrite ? 1.0 - p.t : p.t;
      const inv = 1 - t;
      const swayX = Math.cos(time * 2.1 + br.phase) * 1.4;
      const swayY = Math.sin(time * 2.4 + br.phase) * 2.4;

      const x = inv * inv * br.x0 + 2 * inv * t * (br.cx + swayX) + t * t * (br.x1 + swayX * 0.6);
      const y = inv * inv * br.y0 + 2 * inv * t * (br.cy + swayY) + t * t * (br.y1 + swayY * 0.6);
      const env = Math.sin(p.t * Math.PI);

      ctx.beginPath();
      ctx.arc(x, y, 3.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.45 * env})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 1.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(15, 23, 42, ${0.85 * env})`;
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * Passive 3D X / Y / Z Brain Orientation Compass
 * Rotates in real time with the 3D MRI brain so visitors always know which side
 * (Front, Back, Top, Base, Left, Right) they are viewing.
 */
class BrainAxisCompass {
  constructor(canvasId, readoutId, engine) {
    this.canvas = document.getElementById(canvasId);
    this.readoutEl = document.getElementById(readoutId);
    this.engine = engine;
    if (!this.canvas || !this.engine) return;

    this.ctx = this.canvas.getContext('2d');
    this.size = 108;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.size * this.dpr;
    this.canvas.height = this.size * this.dpr;

    this.axes = [
      { id: 'front', label: 'FRONT', axisTag: '+Z', lx: 0, ly: 0, lz: 1, color: '#0284c7', viewName: 'Front (Frontal Lobe)', primary: true },
      { id: 'back', label: 'BACK', axisTag: '-Z', lx: 0, ly: 0, lz: -1, color: '#7c3aed', viewName: 'Back of the Mind', primary: false },
      { id: 'top', label: 'TOP', axisTag: '+Y', lx: 0, ly: 1, lz: 0, color: '#059669', viewName: 'Top Crown', primary: true },
      { id: 'base', label: 'BASE', axisTag: '-Y', lx: 0, ly: -1, lz: 0, color: '#475569', viewName: 'Base & Brainstem', primary: false },
      { id: 'right', label: 'RIGHT', axisTag: '+X', lx: 1, ly: 0, lz: 0, color: '#d97706', viewName: 'Right Hemisphere', primary: true },
      { id: 'left', label: 'LEFT', axisTag: '-X', lx: -1, ly: 0, lz: 0, color: '#e11d48', viewName: 'Left Hemisphere', primary: false }
    ];

    this.projected = [];
    this.lastReadoutText = '';

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.ctx || !this.engine) return;

    const ctx = this.ctx;
    const dpr = this.dpr;
    const cx = this.size * 0.5;
    const cy = this.size * 0.5;
    const radius = 34;

    this.projected = this.axes.map((ax) => {
      const { vx, vy, vz } = this.engine.projectBrainDirection(ax.lx, ax.ly, ax.lz);
      return {
        ...ax,
        vx,
        vy,
        vz,
        sx: cx + vx * radius,
        sy: cy - vy * radius
      };
    });

    // Determine which side of the brain is facing the viewer most directly (highest vz)
    let frontMost = this.projected[0];
    let secondMost = this.projected[1];
    for (let i = 0; i < this.projected.length; i++) {
      const p = this.projected[i];
      if (p.vz > frontMost.vz) {
        secondMost = frontMost;
        frontMost = p;
      } else if (p !== frontMost && p.vz > secondMost.vz) {
        secondMost = p;
      }
    }

    if (this.readoutEl) {
      const text =
        frontMost.vz > 0.78
          ? `Viewing: ${frontMost.viewName}`
          : `Viewing: ${frontMost.label} · ${secondMost.label}`;
      if (text !== this.lastReadoutText) {
        this.readoutEl.textContent = text;
        this.lastReadoutText = text;
      }
    }

    // Sort back-to-front by vz for proper painter's algorithm 3D depth rendering
    const sorted = [...this.projected].sort((a, b) => a.vz - b.vz);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, this.size, this.size);

    // Subtle 3D orbital reference sphere ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw each axis arm and tip
    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      const depthAlpha = 0.28 + 0.72 * ((p.vz + 1) * 0.5);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.sx, p.sy);
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = depthAlpha * (p.primary ? 0.85 : 0.45);
      ctx.lineWidth = p.primary ? 1.6 : 1.0;
      ctx.stroke();

      // Axis endpoint node
      const nodeRadius = p.primary ? 3.6 : 2.6;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.35, depthAlpha);
      ctx.fill();

      // Axis label (FRONT, BACK, TOP, LEFT, RIGHT, BASE)
      const labelDist = radius + 11;
      const lx = cx + p.vx * labelDist;
      const ly = cy - p.vy * labelDist;

      ctx.font = '500 7.5px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = p.vz > -0.15 ? '#0f172a' : 'rgba(71, 85, 105, 0.6)';
      ctx.globalAlpha = Math.max(0.35, depthAlpha * 0.95);
      ctx.fillText(p.label, lx, ly);
    }

    // Center origin pivot dot
    ctx.beginPath();
    ctx.arc(cx, cy, 2.0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.globalAlpha = 1.0;
    ctx.fill();

    ctx.restore();
  }
}

export function scrollToEarth() {
  const earthEl = document.getElementById('earth-section');
  if (earthEl) {
    earthEl.scrollIntoView({ behavior: 'smooth' });
  }
}

export function scrollToBrain() {
  const brainEl = document.getElementById('brain-experience');
  if (brainEl) {
    brainEl.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function initInquiryGenerator() {
  const sparkBtn = document.getElementById('spark-inquiry-btn');
  const titleEl = document.getElementById('earth-idea-title');
  if (!sparkBtn || !titleEl) return;

  const inquiries = [
    'How can AI adapt to the way each individual brain learns so anyone — even someone who struggled in traditional classrooms — can experience hyper-growth learning?',
    'Can we read tiny human microexpressions — a shift in the eyes, voice, or breath — to build AI that truly understands what someone is feeling inside?',
    'How can stealth AI interfaces and disguised safety tools quietly protect people in abusive situations and connect them with help without putting them at risk?',
    'What happens when a person can talk with an empathetic AI simulation of their future self to build courage, clarity, and emotional resilience?',
    'How can wearable sensors and machine learning detect silent signs of depression, anxiety, and stress on the body before a person reaches a crisis?',
    'How do we visualize complex, invisible architectures — whether distributed cloud systems or 86 billion neurons — so humans can intuitively understand them?'
  ];

  let currentIdx = 0;

  sparkBtn.addEventListener('click', () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_research_question', {
        question_index: (currentIdx + 1) % inquiries.length
      });
    }
    if (window.gsap) {
      gsap.to(titleEl, {
        opacity: 0,
        y: -8,
        duration: 0.18,
        onComplete: () => {
          currentIdx = (currentIdx + 1) % inquiries.length;
          titleEl.innerText = inquiries[currentIdx];
          gsap.to(titleEl, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out'
          });
        }
      });
    } else {
      currentIdx = (currentIdx + 1) % inquiries.length;
      titleEl.innerText = inquiries[currentIdx];
    }
  });
}
