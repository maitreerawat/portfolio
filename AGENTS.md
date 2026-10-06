# Antigravity Workspace Guidelines & Operating Rules

## 1. Operating Balance: Creative/Thematic Alignment vs. Autonomous Coding

* **Creative Concepts, Themes & Features (Always Ask First):**
  * Always check in, propose, or ask Maitree about **creative directions, high-level themes, new sections, narrative voice, and what to create**.
  * Never invent major creative concepts or pivot themes without Maitree's sign-off.

* **Technical & Coding Implementation (Autonomous "YOLO Mode"):**
  * Once a creative direction or feature is chosen, execute all **coding implementation details autonomously**.
  * Do **NOT** ask questions about code structure, Tailwind styling choices, GSAP mechanics, refactoring minutiae, or technical plumbing. Pick the cleanest, most modern, performant implementation and build it end-to-end.
  * Always build complete, production-ready, beautiful code rather than placeholders or stubs.

---

## 2. Git Operations & Workflow

### Automatic Commit After Every Change:
* **Commit after every change:** After completing every change or feature requested by Maitree, always create a clean Git commit and push to `origin main` so the remote repository stays continuously synchronized.

### Standardized Git Process:
For every completed change, execute this exact sequence:

1. **Check Status & Diffs:**
   * Run `git status -s` to inspect modified, untracked, and deleted files.
   * Review `git diff` to verify only intended changes are included and no secrets or scratch artifacts are staged.

2. **Targeted Staging:**
   * Stage specific, intentional files (e.g., `git add index.html context.md`).
   * Avoid blanket `git add .` if unintended scratch or system files exist.

3. **Conventional Commit Messages:**
   * Use clean, semantic commit messages:
     * `feat: ...` for new features, sections, or UI experiences.
     * `fix: ...` for bug fixes and layout corrections.
     * `style: ...` for CSS, animations, typography, or theme tweaks.
     * `docs: ...` for context or documentation updates.
     * `chore: ...` for maintenance or configuration changes.

4. **Remote Push & Verification:**
   * Push to the active tracking branch: `git push origin <branch>` (e.g., `git push origin main`).
   * Verify completion with `git status` to ensure a clean working tree.

