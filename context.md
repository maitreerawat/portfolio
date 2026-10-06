# Workspace Context & Ongoing Projects

**Last Updated:** October 2026  
**User:** Maitree Rawat ([@maitreerawat](https://github.com/maitreerawat))  
**Interests & Focus:** Psychology + AI, Human-AI Co-evolution, Creative Cognition, Speculative Technology, and Physical 3D CAD / Hardware.

---

## 1. Project Overview & Locations

### A. CAD & Hardware Research Workspace
* **Location:** `/Users/maitree/GeminiCad/Research`
* **Python Environment:** Python 3.11.9 virtual environment at `.venv/` (`.venv/bin/python`).
* **Installed CAD Libraries:** `build123d`, `cadgen`, `cadquery-ocp`, `ocp-vscode`, `vtk`.
* **Repositories & Subprojects:**
  * [`build123d/`](file:///Users/maitree/GeminiCad/Research/build123d): Parametric Python CAD engine with 68 examples in `build123d/examples/`.
  * [`text-to-cad/`](file:///Users/maitree/GeminiCad/Research/text-to-cad): Agent skills library for CAD generation, inspection, slicing, and 3D review.
  * [`three-cad-viewer/`](file:///Users/maitree/GeminiCad/Research/three-cad-viewer): Three.js based CAD viewer components.
  * [`vscode-ocp-cad-viewer/`](file:///Users/maitree/GeminiCad/Research/vscode-ocp-cad-viewer): VS Code extension for live OpenCASCADE CAD inspection.
* **Completed CAD Project:**
  * **Parametric 3D Rose Lamp** in [`text-to-cad/models/rose_lamp/`](file:///Users/maitree/GeminiCad/Research/text-to-cad/models/rose_lamp):
    * Modular 3-piece assembly: `rose_base`, `rose_stem` (with wire conduit & leaves), and `rose_shade` (curved diffusing petals).
    * Validated with zero geometric defects (`scripts/inspect validate`).
    * Full STEP files and 3D printable STL files generated.

---

### B. Personal Portfolio & "Idea Lab" Workspace
* **Location:** `/Users/maitree/portfolio` (`~/portfolio`)
* **GitHub Repository:** `https://github.com/maitreerawat/portfolio`
* **Live Target URL:** `https://maitreerawat.github.io/portfolio/`
* **Inspiration & Philosophy:**
  * Inspired by Maitree's professor, **Pat Pataranutaporn** ([`patpat.world`](https://patpat.world), MIT Media Lab / Cyborg Psychology).
  * Focuses on the synergy between **Human Psychology, Creative Thought, and AI**.
  * Intended to be a fun, playful, vibrant "digital playground" and living archive of all ideas, experiments, and prototypes (not a dark/generic sci-fi AI trope).
* **Tech Stack:**
  * Modern HTML5 + Tailwind CSS + GSAP (GreenSock) for fluid spring physics and animations.
  * Zero build steps required (no breaking `node_modules` / runs standalone).
  * Automatically hostable via **GitHub Pages** for free.
* **Current Status:**
  * Starter "Hello World" page built (`index.html`) featuring:
    * Hero statement: *"Where human mind meets creative machines"*.
    * Interactive GSAP mouse-following ambient aura.
    * Interactive "Idea Seed Generator" toy with spring physics button cycling through research thought experiments.
    * Category pills: *Psychology + AI*, *Creative Cognition*, *Physical CAD & Hardware*, *Speculative Futures*.
* **Next Steps & Roadmap for Portfolio:**
  1. Push code from `~/portfolio` to GitHub (`git push -u origin main`).
  2. Enable GitHub Pages in repository settings (`Settings -> Pages -> Deploy from main / root`).
  3. Expand the "Idea Constellation" into an interactive card grid / drawer modal showcasing past and future ideas.
  4. Add research publications, writing notes, and playful micro-interactions.
