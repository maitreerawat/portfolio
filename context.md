# Portfolio Context & Roadmap

**Owner:** Maitree Rawat ([@maitreerawat](https://github.com/maitreerawat))  
**Project:** Personal Portfolio & Creative Ideas Lab  
**Location:** `/Users/maitree/portfolio` (`~/portfolio`)  
**Repository:** [https://github.com/maitreerawat/portfolio](https://github.com/maitreerawat/portfolio)  
**Live Site Target:** `https://maitreerawat.github.io/portfolio/`  
**Last Updated:** October 2026  

---

## 1. Vision & Core Mission
* **The Calling:** To deeply understand human beings — our patterns, behaviors, emotions, and cognitive nuances — and harness artificial intelligence with empathy to create solutions that heal, empower, and progress humanity.
* **Core Pillars:**
  * **Empathy & Humanity First:** Technology is meaningless without compassion. Every system must protect human dignity, emotional well-being, and genuine human connection.
  * **Behavioral Psychology & Patterns:** Decoding how humans think, feel, relate, and make decisions in an increasingly complex world.
  * **Empathetic & Purposeful AI:** Building human-centered AI systems not for novelty or replacement, but to augment human capability and solve real societal challenges.
  * **A Living Ideas Laboratory:** A vibrant, curious, and playful archive of prototypes, research essays, and speculative experiments.
* **Inspiration:** Inspired by Maitree's professor, **Pat Pataranutaporn** ([patpat.world](https://patpat.world), MIT Media Lab / Cyborg Psychology) and the broader quest for human-AI symbiosis rooted in empathy.

---

## 2. Technical Architecture & Stack
* **Architecture:** Modern, zero-build static web application designed for 100/100 Lighthouse performance and zero maintenance headaches.
* **Frontend Stack:**
  * **HTML5:** Semantic, clean structure.
  * **Tailwind CSS:** Modern utility styling with custom color themes.
  * **GSAP (GreenSock):** Silky-smooth spring physics, scroll-triggered animations, and playful cursor micro-interactions.
* **Hosting & Deployment:**
  * Hosted 100% free on **GitHub Pages**.
  * Deploys directly from the `main` branch root (`/`).
  * Instant auto-deployment on `git push`.

---

## 3. Current Implementation Status
* **Act I — Interactive 3D Human Mind & Somatic Emotion Atlas (`#brain-experience`):**
  * **3D MRI Connectome (`js/scenes/brain3d.js`, `js/data/brainCurves.js`):** Real-time Three.js WebGL & GLSL 3D Simplex Noise cortical scan with 3,600 neural pathways, UnrealBloom bioluminescence, 360° user-controlled orbit (`enableZoom: false` for seamless page scrolling), interactive 3D stereotactic region hover/click detection, and a passive 3D `X·Y·Z` orientation compass (`#brain-compass-canvas`).
  * **Microscopic Neuron Morphology Study (`NeuronMorphologyStudy` in `js/app.js`):** Interactive Santiago Ramón y Cajal-inspired microscopic neuron study rendering the real anatomical cell shape of each emotion's brain region (*Spindle neuron*, *Pyramidal neuron*, *Starburst Medium Spiny neuron*, *Amygdala-Prefrontal dyad*, *Hippocampal mossy-fiber neuron*, *Cerebellar Purkinje coral-fan neuron*, *Vagal willow pacemaker neuron*) with live hover part explanations (`Soma`, `Dendrites`, `Axon`, `Spines/Boutons`).
  * **Embodied Somatic Emotion Readouts (`js/data/emotions.js`):** Plain-English explanations of what happens in your brain and how signals travel to your eyes, pupils, lips, voice, breath, and hands when you feel *Empathy*, *Wonder*, *Joy*, *Vulnerability*, *Memory & Longing*, *Imagination & Intuition*, and *Grief & Healing*.
* **Act II — About Me, Selected Work & Experience (`#earth-section`):**
  * **Luminous Frosted-Glass Story Cards:** 3 equal-length story cards with animated SVG micro-sketches covering *Microexpressions & Neuroscience*, *AI-Driven Hyper-Growth Learning*, and *Empathy in Action & 11+ Countries*.
  * **Selected Work Bento Grid:** Features the *3D Human Mind & Somatic Emotion Atlas*, *Stealth AI Crisis & Abuse Protection App (Google Vibe Coding Hackathon Winner)*, *Google: BigQuery Execution Graph & partners.cloud.google.com*, *WE-BAND (Women Techmakers Fellowship)*, *Smart Traffic Management System (IEEE Best Research Intern Award)*, and *AI Hyper-Growth Learning & Neural Cognitive Mirrors*.
* **Deprecated Archive (`deprecated/`):**
  * Preserves the earlier Cosmic Storybook (`stardust.js`, `synapses.js`, `tree.js`, `scroller.js`, and v1 `index.html`).

---

## 4. Planned Features & Roadmap
1. **The Idea Constellation:**
   * Dynamic, filterable archive of all ideas and projects.
   * Playful status tags (`🌱 Half-Baked Idea`, `🧪 Working Prototype`, `💭 Shower Thought`, `📚 Published`).
   * Interactive modal/drawer for deep-dive case studies and essays.
2. **Playful Micro-Interactions:**
   * Draggable sticky notes / stickers on a creative canvas.
   * Sound effects (satisfying tactile clicks/pops).
   * Playful mood/theme switcher.
3. **Research & Writing:**
   * Academic papers, preprints, and speculative thought essays on human-AI synergy.

---

## 5. Agent Operating Rules & Git Workflow
* **Creative Concepts & Themes (Always Ask First):** All creations, high-level themes, narrative directions, sections, and conceptual decisions must be proposed and agreed upon with Maitree first.
* **Coding Implementation Details (Autonomous "YOLO Mode"):** Once a creative direction or section is decided, the agent handles all coding, syntax, architecture, styling, and animations autonomously without asking about implementation details.
* **Git Automation:** The agent automatically creates a clean commit and pushes to `origin main` after completing every change requested by Maitree.
* **Standard Git Workflow:**
  1. `git status -s` & `git diff` review.
  2. Targeted staging (`git add <files>`).
  3. Conventional commit message (`feat: ...`, `fix: ...`, `chore: ...`).
  4. Push to remote (`git push origin main`) via authenticated GitHub CLI credentials.

