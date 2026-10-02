# Portfolio Redesign — Design Spec

**Date:** 2026-10-02  
**Author:** Xavi Moreno  
**Status:** Awaiting review

---

## 1. Goals

Transform `hackie.dev` from a single-product landing into a multi-project portfolio:

- A **directory page** at the locale root lists all AI-built projects as cards
- Each project gets a **dedicated landing page** with its own look/feel, screenshots/demo, and changelog
- A **user-level Claude skill** handles onboarding any future project by detecting its platform, extracting its real design artifacts (colors, fonts, assets), and wiring up the page
- A **per-project release sub-skill** keeps the changelog current after every release
- Two projects launch simultaneously: **Alterio** (iOS) and **Diskspace** (Go CLI + macOS native)

---

## 2. Routing changes

| URL | Before | After |
|-----|--------|-------|
| `/` | meta-refresh → `/en/` | inline `navigator.language` script → `/{detected-locale}/` |
| `/{locale}/` | Alterio landing | **Directory page** (project grid) |
| `/{locale}/alterio/` | (did not exist) | Alterio landing (content moved from root) |
| `/{locale}/alterio/privacy/` | Privacy policy | unchanged |
| `/{locale}/alterio/support/` | Support/FAQ | unchanged |
| `/{locale}/diskspace/` | (did not exist) | Diskspace landing (new) |

**Language detection on root `/`:**  
Replace the current `<meta http-equiv="refresh">` with a `~100-byte inline script` in `<head>`. The script checks `localStorage.lang` first (set when the user manually picks a language), then falls back to `navigator.language`:

```js
(function(){
  var s=localStorage.lang,l=s||navigator.language||'en';
  var m={'es':'es','ca':'ca'};
  var k=Object.keys(m).find(function(k){return l.startsWith(k)})||'en';
  location.replace('/'+k+'/');
})();
```

Falls back to `en` for any unrecognised language.

---

## 3. Content model

Each project is defined in `src/content/projects/{slug}/index.ts`:

```ts
export interface Project {
  slug: string                   // URL segment: "alterio", "diskspace"
  name: string                   // Display name
  tagline: string                // One-line description (translated via i18n)
  description: string            // 2–3 sentence expanded description (translated)
  platform: Platform[]           // ["ios"] | ["cli"] | ["macos"] | ["cli","macos"]
  accent: string                 // Hex — site landing accent (CTA buttons, highlights)
  accentDark: string             // Hex — accent for dark-mode backgrounds
  accentInk: string              // Hex — contrast text on accent fill
  githubUrl?: string
  appStoreUrl?: string
  testflightUrl?: string
  installCommand?: string        // For CLI projects
  changelog: ChangelogEntry[]
}

export interface ChangelogEntry {
  version: string
  date: string                   // ISO 8601
  notes: string[]                // Bullet list of changes
}
```

A top-level `src/content/projects/index.ts` exports an ordered array of project slugs — this controls card order on the directory page.

**i18n:** Project `tagline` and `description` use `projects.{slug}.tagline` / `projects.{slug}.description` keys in `src/i18n/{en,es,ca}.ts`. The `Translations` type in `src/i18n/types.ts` is extended to include these keys, so a missing translation is a type error.

---

## 4. Navigation chrome

All pages share updated top-right chrome. The liquid glass bubble is project-page only.

### 4.1 Language + theme bar (top-right, all pages)

```
[ EN · ES · CA ]  |  [ ◐ · ☀ · ☾ ]
```

- Language pill: 3 tabs, active tab underlined; clicking changes URL prefix and persists choice in `localStorage.lang`
- Theme pill: unchanged from current implementation (system / light / dark)
- Both pills share the same surface style as the current header switch

### 4.2 Liquid glass bubble (top-left, project pages only)

A fixed floating pill visible on all project landing pages. Not shown on the directory or legal pages.

```
[ ⊞ Projects  |  in/xavimorenom ↗ ]
```

**CSS (dark-first):**
```css
.glass-bubble {
  position: fixed;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 9999px;
  z-index: 50;
}

:root[data-theme="light"] .glass-bubble,
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) .glass-bubble {
    background: rgba(255, 255, 255, 0.55);
    border-color: rgba(255, 255, 255, 0.70);
  }
}

.glass-bubble__separator {
  width: 1px;
  height: 1.2em;
  background: rgba(255, 255, 255, 0.20);
  margin: 0 0.75rem;
}
```

On mobile (< 640px): collapses to icon-only `[ ⊞ | ↗ ]`; full labels on tap (toggle class).

---

## 5. Directory page

URL: `/{locale}/`

### Layout

```
[ header: site name + language/theme bar ]

  Apps and tools, built with AI.         ← one-line intro, centered

  [ Card ]  [ Card ]  [ Card ] …        ← 1-col mobile → 2-col → 3-col grid
```

### Project card (`ProjectCard.astro`)

Links to `/{locale}/{slug}/`. Contains:

- App icon (48 × 48 px, rounded-xl)
- Project name (semibold)
- Tagline (muted, single line)
- Platform badges: small rounded pills `[iOS]` `[macOS]` `[CLI]`

Hover: subtle `translateY(-2px)` + shadow lift. Accent-colored border on keyboard focus.

Card order is controlled by the array in `src/content/projects/index.ts`.

---

## 6. Project page template system

URL: `/{locale}/{slug}/`

All project pages use `ProjectLayout.astro`, which reads the project config and passes `platform[]` to every section component. The layout injects per-project CSS tokens into `:root` on the page.

### 6.1 Shared sections (all projects)

1. **Hero** — name, tagline, CTA(s), primary visual
2. **Features** — 3–6 tiles: icon + headline + description
3. **Demo** — screenshots, terminal recording, or video
4. **Changelog** — last 5 releases by default, "Show all" toggle
5. **Footer** — standard site footer

### 6.2 Platform archetypes

#### `ios`

- Hero visual: **phone frame** (existing CSS frame) with screenshot or video
- CTA: App Store badge + TestFlight badge
- Hero bg: deep gradient using `accentDark`
- Demo: `ScreenshotGallery.astro` with light/dark variant switching (existing)
- Typography: Instrument Serif Italic for hero headline (existing)

#### `cli`

- Hero visual: **terminal window frame** — dark rounded box, traffic-light dots (decorative), monospace font, a static TUI snapshot rendered as `<pre>`
- CTA: click-to-copy install command pill + GitHub link
- Hero bg: near-black (`#0D1117`)
- Typography: `font-mono` for hero headline
- Demo: embedded `.gif` terminal recording, or a `<pre>` ASCII art snapshot extracted from DESIGN.md

#### `macos`

- Hero visual: **macOS window chrome frame** — title bar with traffic-light dots + drop shadow
- CTA: download button (`.dmg` or install script)
- Demo: app screenshot inside window frame

#### `mixed: ["cli", "macos"]` (Diskspace)

- Hero shows a **split composition**: terminal frame (left/top) + macOS window frame (right/bottom)
- A toggle tab `[ Terminal | App ]` switches focus on mobile where both don't fit
- Features section: each feature has an optional `platform` badge (`CLI` or `App`) where relevant
- CLI palette drives hero background; macOS frame section uses a slightly lighter surface
- Both CTAs present side by side

### 6.3 Per-project CSS token injection

`ProjectLayout.astro` emits a `<style>` block scoped to the page:

```html
<style>
  :root {
    --project-accent: {accent};
    --project-accent-dark: {accentDark};
    --project-accent-ink: {accentInk};
  }
</style>
```

All section components use `--project-accent` instead of the site-wide `--lime`. The site's global light/dark toggle still works; within each theme the project palette applies.

### 6.4 Changelog section (`ChangelogSection.astro`)

Renders the project's `changelog` array, newest first:

```
v1.2.0  ·  12 Oct 2026
• Added dark mode support
• Fixed crash on large directories

v1.1.0  ·  3 Sep 2026
• …
[Show all ↓]
```

Default: show 5 entries. "Show all" is a pure CSS `:target` toggle (no JS).

---

## 7. Media pipeline per project

### Alterio

Source in `../gym-tracker/`:

| Asset | Source path |
|-------|------------|
| App icon | `App/Assets.xcassets/AppIcon.appiconset/*.png` (largest size) |
| Screenshots light | `media/screenshots/{locale}/*.png` (already in `src/assets/screenshots/`) |
| Screenshots dark | `media/screenshots-dark/{locale}/*.png` |
| Demo video | `media/video/*.{mp4,webm}` (already in `public/video/`) |

Destination in `hackie.dev/`: `src/assets/projects/alterio/` and `public/projects/alterio/video/`

### Diskspace

Diskspace has two visual surfaces. Both are generated, not hand-captured.

#### macOS native app — fixture-driven snapshots

Diskspace already has `scripts/ui-snapshots.sh`: it runs `Diskspace.app` against JSON state files in `internal/ipc/testdata/states/` via `DISKSPACE_UI_FIXTURE` / `DISKSPACE_UI_SNAPSHOT` env vars, and outputs PNGs at 1200×780 in both light and dark appearance.

The onboarding skill:
1. Builds the app: `make ui`
2. Runs `scripts/ui-snapshots.sh`
3. Selects representative screenshots for the landing page from `$TMPDIR/diskspace-snapshots/full/`:
   - `browse-tiles-light-1200x780.png` → light screenshot
   - `browse-tiles-dark-1200x780.png` → dark screenshot
   - Optionally: `browse-list-light-1200x780.png` as a second slide
4. Copies selected PNGs to `hackie.dev/src/assets/projects/diskspace/screenshots/` (light) and `.../screenshots-dark/`

#### TUI terminal — VHS recording

The CLI surface is captured using **VHS** (Charmbracelet's tape-based terminal recorder), which runs the actual `diskspace` binary against a mock directory and outputs a GIF or PNG.

VHS setup:
```bash
brew install vhs   # or: go install github.com/charmbracelet/vhs@latest
```

The onboarding skill generates a `scripts/landing-demo.tape` in the Diskspace repo:

```tape
Output landing-demo.gif
Set FontSize 14
Set Width 120
Set Height 40
Set Theme "Dracula"
Set Shell "bash"

# Build the binary first (if not present)
# Type "make build" + Enter handled outside the tape

# Create a realistic mock directory
Type "mkdir -p /tmp/diskspace-demo/{Downloads,Documents,Applications,Library/Caches}"
Enter
Type "dd if=/dev/urandom of=/tmp/diskspace-demo/Downloads/bigfile.dmg bs=1m count=512 2>/dev/null"
Enter
Sleep 500ms
Type "diskspace /tmp/diskspace-demo"
Enter
Sleep 2s
Screenshot browse.png
Type "j j j"
Sleep 500ms
Screenshot browse-selection.png
```

The tape file is committed to `disk/scripts/landing-demo.tape` so it can be re-run for future releases. The GIF and PNGs are copied to `hackie.dev/public/projects/diskspace/video/` (GIF) and `src/assets/projects/diskspace/screenshots/tui/`.

| Asset | Source | Destination in hackie.dev |
|-------|--------|--------------------------|
| App icon | `ui/DiskspaceUI/Sources/*/Assets.xcassets/AppIcon.appiconset/*.png` | `src/assets/projects/diskspace/` |
| macOS screenshots (light) | `ui-snapshots.sh` output: `browse-tiles-light-1200x780.png` | `src/assets/projects/diskspace/screenshots/` |
| macOS screenshots (dark) | `ui-snapshots.sh` output: `browse-tiles-dark-1200x780.png` | `src/assets/projects/diskspace/screenshots-dark/` |
| TUI GIF | VHS output: `landing-demo.gif` | `public/projects/diskspace/video/` |
| TUI PNG stills | VHS output: `browse.png`, `browse-selection.png` | `src/assets/projects/diskspace/screenshots/tui/` |

---

## 8. Onboarding skill — design detective

Skill location: `~/.claude/skills/onboard-project.md` (user-level).

The skill runs inside a project repo and writes the result into `hackie.dev/`.

### Phase 1: Platform detection

Detect platform by file signatures in project root:

| File signature found | Platform(s) |
|---------------------|------------|
| `*.xcodeproj` or `project.yml` | `ios` (check `Info.plist` to confirm it targets iOS) |
| `*.xcodeproj` + no iOS deployment target | `macos` |
| `go.mod` only | `cli` |
| `go.mod` + `ui/*/Package.swift` | `["cli", "macos"]` |

### Phase 2: Color + font extraction

**For iOS / macOS (Swift):**

1. Locate `**/Tokens/Colors.swift` — parse all `static var ds*` entries. Each follows the pattern:
   ```swift
   static var dsFoo: Color { dynamic(rgb(R,G,B), rgb(R,G,B)) }
   ```
   Extract light and dark hex values. Build a map: `{ dsFoo: { light: "#RRGGBB", dark: "#RRGGBB" } }`
2. Identify the most distinctive non-neutral color as `accent`. Priority:
   - A named brand/tint entry (not `dsAccent` if it's ink-based)
   - `dsSuccess` (green) if no brand color exists
   - Fall back to `dsAccent` light value
3. Locate `**/Tokens/Typography.swift` — extract font family names (look for `FontName` enum or string literals ending in `.ttf`/`.otf`)
4. Locate `**/Assets.xcassets/AppIcon.appiconset/*.png` — copy the largest PNG

**For Go CLI (lipgloss/termenv):**

1. Locate `**/ui/theme.go` (or any file matching `theme.go` in the project) — parse the `Palette` variable:
   ```go
   var Palette = [8]lipgloss.CompleteColor{
     {TrueColor: "#4E79A7", ...},
   ```
   Extract TrueColor hex for all 8 slots.
2. Slot 0 = primary accent. Slot 2 (if green-toned) = secondary accent.
3. Background: search for a `bg` or `background` string literal in the same file; default to `#0D1117` if not found.
4. Also check for a `BaseStyle` or `windowStyle` with a background color.
5. Font: always `monospace` — no extraction needed.

**For mixed (Go + Swift):**

Run both extraction routines. CLI palette → `accent` / `accentDark`. Swift palette → used for the macOS section token overrides (stored separately in the project config as `macosAccent`).

### Phase 3: Asset collection + screenshot generation

**Step 1 — look for existing assets first**

Recursively search for:
- `**/{screenshots,screens,media,docs}/**/*.{png,jpg,webp}`
- `**/{screenshots-dark,media-dark}/**/*.{png,jpg,webp}`
- `**/*.{mp4,webm,gif}` (exclude `node_modules`, `.build`, `vendor`, `DerivedData`)

Classify: files with `-dark` in name or path → dark set. Others → light set.

**Step 2 — generate if missing (per platform)**

If no screenshots found, generate them:

**`macos` platform (including the macOS side of `mixed`):**

Check for `scripts/ui-snapshots.sh` in the project root. If present:
1. Run `make ui` (or `make build` if `ui` target missing) to build the binary
2. Run `scripts/ui-snapshots.sh` — outputs to `$TMPDIR/{project}-snapshots/full/`
3. Select the most representative states: prefer `browse-tiles-{appearance}-1200x780.png` or equivalent "main view" state
4. Copy selected light/dark pairs to `hackie.dev/src/assets/projects/{slug}/screenshots{,-dark}/`

If no `ui-snapshots.sh` script: take a manual screenshot of the running app using `screencapture -l <windowID>` after launching with mock data.

**`cli` platform:**

1. Check for `which vhs`. If missing: `brew install vhs`
2. Build the binary (`make build` or `go build ./cmd/...`)
3. Generate `scripts/landing-demo.tape` if it does not already exist (see §7 Diskspace for the template — adapt paths and commands to the specific tool)
4. Run `vhs scripts/landing-demo.tape` — outputs GIF + PNG stills
5. Copy GIF → `hackie.dev/public/projects/{slug}/video/landing-demo.gif`
6. Copy PNG stills → `hackie.dev/src/assets/projects/{slug}/screenshots/tui/`
7. Commit `scripts/landing-demo.tape` to the project repo so it can be re-run at release time

**Step 3 — copy everything to hackie.dev**

- Light screenshots → `hackie.dev/src/assets/projects/{slug}/screenshots/`
- Dark screenshots → `hackie.dev/src/assets/projects/{slug}/screenshots-dark/`
- Video/GIF → `hackie.dev/public/projects/{slug}/video/`

### Phase 4: Changelog population

```bash
git tag -l --sort=-v:refname --format='%(refname:short)|%(creatordate:short)|%(subject)'
```

For each tag, also read the tag annotation body:
```bash
git tag -v {tag} 2>&1 | sed -n '/^$/,/^$/p'
```

Parse into `ChangelogEntry[]`. Cap at 20 entries. If git history has no tags, produce a single entry `v0.1.0` dated today with `notes: ["Initial release"]`.

### Phase 5: Content file generation

Write `hackie.dev/src/content/projects/{slug}/index.ts` with all extracted values.

Extend `src/i18n/{en,es,ca}.ts` with `projects.{slug}.tagline` and `projects.{slug}.description`. Populate EN from the README first paragraph. Mark ES/CA with a `// TODO: translate` comment and copy the EN value as a placeholder so the type system doesn't error.

### Phase 6: Release sub-skill generation

Write `~/.claude/skills/release-{slug}.md`. Template:

```
# release-{name}

Run this skill inside the {name} project repo after tagging a new release.

Steps:
1. Read the latest git tag: `git describe --tags --abbrev=0`
2. Read its annotation or subject line for the release title
3. Read the tag body or CHANGELOG.md for bullet notes
4. Open `hackie.dev/src/content/projects/{slug}/index.ts`
5. Prepend a new ChangelogEntry to the `changelog` array
6. Ask: "Any new screenshots or videos to add for this release?"
   - If yes: re-run asset collection (Phase 3) for new files only
7. Commit the changelog update in hackie.dev with message:
   "chore({slug}): changelog {version}"
```

---

## 9. Implementation phases

### Phase 1 — fully parallel

| Team | Scope | Branch |
|------|-------|--------|
| **A** | Routing + directory page: move Alterio content to `/{locale}/alterio/`; new directory index + `ProjectCard.astro`; language-detect root script; sitemap update | `feat/directory-routing` |
| **B** | Project page system: `ProjectLayout.astro`; `ProjectHero.astro` (platform-switched); `ChangelogSection.astro`; `TerminalFrame.astro`; extract `PhoneFrame` from existing; per-project CSS token injection; `LiquidGlassBubble.astro`; updated language selector | `feat/project-page-system` |
| **C** | Skill authoring: `~/.claude/skills/onboard-project.md` via `/skill-creator`; release sub-skill template | (no worktree — user-level files) |

Teams A and B write to different file trees (pages vs components/layouts) so conflicts are minimal.

### Phase 2 — parallel, after Phase 1 merges to main

| Team | Scope | Branch |
|------|-------|--------|
| **D** | Onboard Alterio: run skill on `../gym-tracker`; verify asset copy; validate page | `feat/project-alterio` |
| **E** | Onboard Diskspace: run skill on `../disk`; generate TUI placeholder; validate mixed layout | `feat/project-diskspace` |

### Phase 3 — integration

Merge D + E → main. Smoke-test all routes. Deploy.

---

## 10. Open decisions

| # | Decision | Default |
|---|----------|---------|
| D1 | Bubble placement: top-left vs top-right (top-right conflicts with language/theme bar) | **top-left** |
| D2 | Directory intro copy | "Apps and tools, built with AI." |
| D3 | Diskspace has no pre-existing screenshots | Skill generates them: macOS via `ui-snapshots.sh` fixture runner; TUI via VHS tape |
| D4 | Alterio i18n of project description | EN from README; ES/CA placeholder with `// TODO: translate` comment |
| D5 | Changelog entries shown by default | 5, with CSS-only "Show all" toggle |
| D6 | Alterio accent on site | Keep existing lime `#C6FF3D` (app itself is monochrome; lime is the landing's brand accent) |
| D7 | Diskspace accent on site | Steel blue `#4E79A7` (TUI slot 0 = focused border color) |
