# Plan E — Onboard Diskspace

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Models:** Implement with Sonnet. Validate with Opus.
>
> **Prerequisite:** Plans A, B, and C must be merged to `main` before starting this plan.
>
> **Branch:** `feat/project-diskspace` — branch from `main`.
>
> **Run from:** `~/projects/disk/`

**Goal:** Run the onboarding skill on the Diskspace project, generate real screenshots via `ui-snapshots.sh` (macOS native app) and VHS (TUI terminal), validate the mixed CLI+macOS project page layout, and update the disk CLAUDE.md.

**Architecture:** Diskspace has platform `["cli", "macos"]`. The skill must: (1) build `Diskspace.app` and run `scripts/ui-snapshots.sh` for macOS screenshots, (2) create `scripts/landing-demo.tape` and run VHS for TUI screenshots, (3) render the mixed hero with both frames. The VHS tape must be committed back to the disk repo.

**Spec:** `docs/superpowers/specs/2026-10-02-portfolio-redesign-design.md`

## Global Constraints

- Diskspace accent: steel blue `#4E79A7` (from `internal/ui/theme.go` Palette slot 0)
- `ui-snapshots.sh` requires an Aqua desktop session — must verify before running
- VHS tape created here (`scripts/landing-demo.tape`) is committed to the disk repo so the release skill can reuse it
- `npm run check` must pass in hackie.dev before closing

---

### Task 1: Run `/onboard-project` on disk

- [ ] **Step 1: Open a session in `~/projects/disk/`**

- [ ] **Step 2: Run `/onboard-project`**

Follow all skill prompts:
- SLUG: `diskspace`
- PLATFORM: expect `["cli", "macos"]` (go.mod + ui/DiskspaceUI/Package.swift found)
- Accent: skill parses `internal/ui/theme.go`; confirm it reads `Palette[0] = "#4E79A7"` and sets that as accent
- Screenshots: skill finds `scripts/ui-snapshots.sh` → ask to run it; answer **yes**
- VHS tape: skill finds no existing tape → proposes creating `scripts/landing-demo.tape`; answer **yes**
- Changelog: git tags parsed from disk repo

- [ ] **Step 3: macOS screenshot generation**

When the skill runs `scripts/ui-snapshots.sh`:
1. Confirm you are on macOS with an Aqua session (not SSH)
2. `make ui` builds `Diskspace.app` in `bin/`
3. The script outputs PNGs to `$TMPDIR/diskspace-snapshots/full/`
4. Skill selects `browse-tiles-light-1200x780.png` and `browse-tiles-dark-1200x780.png`

If `make ui` fails (Xcode 26 not installed): tell the skill to skip macOS screenshots and use VHS-only.

- [ ] **Step 4: VHS tape creation and run**

When the skill creates `scripts/landing-demo.tape`, verify it was written, then confirm running VHS. Check output:

```bash
ls scripts/landing-demo.tape
ls landing-demo.gif browse.png browse-selection.png 2>/dev/null
```

Expected: at least `landing-demo.gif` and one `.png` still.

- [ ] **Step 5: Verify generated content file**

```bash
cat ../hackie.dev/src/content/projects/diskspace/index.ts
```

Expected:
- `slug: 'diskspace'`
- `platform: ['cli', 'macos']`
- `accent: '#4E79A7'`
- `installCommand`: present (e.g. `gh api ... | sh` from README)
- `githubUrl`: present
- `changelog` populated

---

### Task 2: Verify screenshots are wired up

- [ ] **Step 1: Check destinations**

```bash
ls ../hackie.dev/src/assets/projects/diskspace/screenshots/
ls ../hackie.dev/src/assets/projects/diskspace/screenshots-dark/
ls ../hackie.dev/public/projects/diskspace/video/
ls ../hackie.dev/src/assets/projects/diskspace/screenshots/tui/
```

Expected: macOS PNGs in light/dark, TUI GIF in video, TUI PNG stills in screenshots/tui/.

---

### Task 3: Validate the mixed project page

- [ ] **Step 1: Uncomment diskspace import in hackie.dev page routes**

In both `src/pages/[locale]/index.astro` and `src/pages/[locale]/[slug]/index.astro`, the line:
```ts
// import '../../../content/projects/diskspace/index'; // uncomment when onboarded
```
must be uncommented. Verify the skill did this; if not, do it manually.

- [ ] **Step 2: Start dev server**

```bash
cd ../hackie.dev && npm run dev
```

- [ ] **Step 3: Verify directory page shows both projects**

`http://localhost:4321/en/` must show two cards: Alterio and Diskspace (in that order).

- [ ] **Step 4: Verify Diskspace project page**

`http://localhost:4321/en/diskspace/` must:
- Render the mixed hero (terminal frame + macOS window frame side by side, or stacked on mobile)
- Show steel blue accent on CTA and platform badges
- Show both `CLI` and `macOS` platform badges
- Show install command copy-pill
- Show changelog if any tags exist

Check on mobile width (375px) in DevTools: frames must stack gracefully.

- [ ] **Step 5: Run type check and build**

```bash
npm run check && npm run build
```

Both must pass with zero errors.

---

### Task 4: Commit VHS tape to disk repo and update CLAUDE.md

- [ ] **Step 1: Verify VHS tape in disk repo**

```bash
ls ~/projects/disk/scripts/landing-demo.tape
```

- [ ] **Step 2: Verify disk CLAUDE.md was updated**

```bash
grep -A 8 "Landing page" ~/projects/disk/CLAUDE.md
```

If not present, add manually (template from onboarding skill Phase 5b).

- [ ] **Step 3: Commit in disk repo**

```bash
cd ~/projects/disk
git add scripts/landing-demo.tape CLAUDE.md
git commit -m "feat: VHS landing demo tape + CLAUDE.md landing page section"
```

- [ ] **Step 4: Commit in hackie.dev**

```bash
cd ../hackie.dev
git add src/content/projects/diskspace/ src/pages/ public/projects/diskspace/
git commit -m "feat(diskspace): onboard project page onto portfolio"
git push -u origin feat/project-diskspace
```
