# Plan D — Onboard Alterio

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Models:** Implement with Sonnet. Validate with Opus.
>
> **Prerequisite:** Plans A, B, and C must be merged to `main` before starting this plan.
>
> **Branch:** `feat/project-alterio` — branch from `main`.
>
> **Run from:** `~/projects/gym-tracker/`

**Goal:** Run the onboarding skill on the Alterio (gym-tracker) project, verify screenshots copy correctly, validate the project page renders at `/{locale}/alterio/`, and update the gym-tracker CLAUDE.md.

**Architecture:** Alterio already has screenshots in `media/screenshots/{locale}/` and a demo video in `media/video/`. The onboarding skill will find these in Phase 3 (no screenshot generation needed). The page renders using the iOS archetype of `ProjectHero`.

**Spec:** `docs/superpowers/specs/2026-10-02-portfolio-redesign-design.md`

## Global Constraints

- Alterio accent stays `#C6FF3D` (lime) — the app's own DS is monochrome, lime is the landing's brand accent
- Screenshots are already in hackie.dev `src/assets/screenshots/` — the skill must detect these and not duplicate them
- `npm run check` must pass in hackie.dev before closing

---

### Task 1: Run `/onboard-project` on gym-tracker

- [ ] **Step 1: Open a session in `~/projects/gym-tracker/`**

- [ ] **Step 2: Run `/onboard-project`**

Follow all skill prompts:
- SLUG: `alterio`
- PLATFORM: expect `["ios"]`
- Accent: the skill will parse `Colors.swift`; confirm it picks a reasonable accent or override with `#C6FF3D`
- Screenshots: the skill should find `media/screenshots/` and `media/screenshots-dark/`; confirm it detects them without running a generator
- Changelog: confirm git tags are parsed correctly

- [ ] **Step 3: Verify generated content file**

```bash
cat ../hackie.dev/src/content/projects/alterio/index.ts
```

Expected:
- `slug: 'alterio'`
- `platform: ['ios']`
- `accent: '#C6FF3D'`
- `changelog` array populated from git tags

---

### Task 2: Verify screenshots are wired up

- [ ] **Step 1: Check asset destinations**

```bash
ls ../hackie.dev/src/assets/projects/alterio/screenshots/
ls ../hackie.dev/src/assets/projects/alterio/screenshots-dark/
ls ../hackie.dev/public/projects/alterio/video/
```

Expected: PNG files in light + dark dirs; video files in video dir.

Note: the existing `src/assets/screenshots/` and `src/assets/screenshots-dark/` are used by the *current* Alterio landing page (now at `/{locale}/alterio/`). The project page at `/{locale}/alterio/` (the static route from Plan A) continues to use those. The new onboarded content uses `src/assets/projects/alterio/` for the `ProjectHero`'s `<slot name="screenshot">`.

- [ ] **Step 2: Update `[slug]/index.astro` to pass the screenshot slot**

In `src/pages/[locale]/[slug]/index.astro`, wire up the screenshot for iOS projects:

```astro
{project.platform.includes('ios') && screenshots.length > 0 && (
  <Image slot="screenshot" src={screenshots[0]} alt={project.name} width={375} height={812} />
)}
```

(Add the glob import at the top of the frontmatter; the exact implementation depends on what assets exist — adapt accordingly.)

---

### Task 3: Validate the project page

- [ ] **Step 1: Start dev server from hackie.dev**

```bash
cd ../hackie.dev && npm run dev
```

- [ ] **Step 2: Navigate to the project page**

`http://localhost:4321/en/alterio/` — must show the **static Alterio landing** (Plan A's file, not the dynamic slug route).

Wait — confirm this is intended: the Alterio landing at `/{locale}/alterio/` is served by `src/pages/[locale]/alterio/index.astro` (the moved static page from Plan A). The dynamic `[slug]` route only handles slugs that don't have a static file. This is correct.

If the intention is for Alterio to ALSO get the new project page system (ProjectLayout, LiquidGlassBubble, etc.), then `src/pages/[locale]/alterio/index.astro` must be updated to use `ProjectLayout` instead of `Base`. Confirm with Xavi which is preferred: static Alterio page as-is, or migrated to ProjectLayout.

**Default (if not redirected): keep the existing Alterio page, add LiquidGlassBubble to it manually.**

- [ ] **Step 3: Add LiquidGlassBubble to Alterio landing**

In `src/pages/[locale]/alterio/index.astro`, import and add the bubble:

```astro
import LiquidGlassBubble from '../../../components/project/LiquidGlassBubble.astro';
// ... inside Base:
<LiquidGlassBubble locale={locale} />
```

- [ ] **Step 4: Run type check and build**

```bash
npm run check && npm run build
```

---

### Task 4: Update gym-tracker CLAUDE.md

- [ ] **Step 1: Verify the skill added a Landing page section**

```bash
grep -A 10 "Landing page" ~/projects/gym-tracker/CLAUDE.md
```

If not present, add manually following the template in Phase 5b of the onboarding skill.

- [ ] **Step 2: Commit in hackie.dev**

```bash
cd ../hackie.dev
git add src/content/projects/alterio/ src/pages/
git commit -m "feat(alterio): onboard project page onto portfolio"
git push -u origin feat/project-alterio
```

- [ ] **Step 3: Commit in gym-tracker**

```bash
cd ~/projects/gym-tracker
git add CLAUDE.md
git commit -m "docs: add landing page section to CLAUDE.md"
```
