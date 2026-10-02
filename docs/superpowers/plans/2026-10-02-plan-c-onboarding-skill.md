# Plan C — Onboarding Skill

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Models:** Implement with Sonnet. Validate with Opus.
>
> **No worktree needed.** This plan writes user-level skill files to `~/.claude/skills/` only. It does not touch the hackie.dev repo.

**Goal:** Create a user-level Claude skill (`onboard-project`) that detects a project's platform, extracts its real design tokens and screenshots, populates a hackie.dev content file, and creates a per-project release sub-skill.

**Architecture:** One markdown skill file with detailed phase-by-phase instructions. Uses the `/skill-creator` skill to scaffold the file structure, then fills each phase. The skill is invoked by running it from inside a target project repo. It writes output to the sibling `hackie.dev/` repo (assumed to be at `../hackie.dev` relative to the project).

**Tech Stack:** Claude skill markdown · bash commands for git/VHS · Swift/Go source parsing via grep/sed

**Spec:** `docs/superpowers/specs/2026-10-02-portfolio-redesign-design.md` (in hackie.dev repo)

## Global Constraints

- Skill must work when invoked from any project repo, not just gym-tracker or disk
- Skill must not make destructive changes to the target project without user confirmation
- If a required tool (vhs, make, xcodebuild) is missing, the skill must install it or ask — never silently skip
- All paths written to hackie.dev must use the `hackie.dev/` path relative to the CWD of the invoking session, or ask the user for the path if not found at `../hackie.dev`
- The skill must end by running `npm run check` in the hackie.dev repo to verify no TS errors

## Review Focus

1. **hackie.dev path not found** — `../hackie.dev` is an assumption; the skill must verify the path exists and ask the user if it doesn't
2. **No git tags** — some projects have no tags; the skill must produce a stub `v0.1.0` entry rather than failing
3. **Screenshot generation fails mid-task** — `ui-snapshots.sh` requires an Aqua session; the skill must detect the failure (exit code ≠ 0) and offer to skip with a placeholder rather than crashing
4. **Duplicate project slug** — if `src/content/projects/{slug}/index.ts` already exists, the skill must ask before overwriting
5. **TypeScript type errors after generation** — the skill must run `npm run check` in hackie.dev and report any errors before declaring success

---

### Task 1: Scaffold skill file with `/skill-creator`

- [ ] **Step 1: Invoke `/skill-creator`**

Run `/skill-creator` in this session. When prompted, provide:
- **Skill name:** `onboard-project`
- **Skill level:** user-level (`~/.claude/skills/`)
- **One-line description:** Onboard a project repo onto hackie.dev — detects platform, extracts design tokens and screenshots, generates content file and release skill

Follow the skill-creator's output to create `~/.claude/skills/onboard-project.md`.

- [ ] **Step 2: Verify the file was created**

```bash
ls ~/.claude/skills/onboard-project.md
```

Expected: file exists.

---

### Task 2: Write the skill — Phase 0 (setup + hackie.dev path)

Replace the scaffold content with the full skill. Start with the preamble and Phase 0.

- [ ] **Step 1: Open and overwrite `~/.claude/skills/onboard-project.md`** with the following content (Tasks 2–9 build up the complete file — write it all at once at the end of Task 9):

Begin accumulating the skill content. Phase 0 reads:

```markdown
# onboard-project

Onboard a project repo onto hackie.dev. Run this skill from inside the project repo you want to add.

---

## Phase 0: Setup

1. Confirm working directory is the project root (contains a README.md or CLAUDE.md).
2. Locate hackie.dev:
   - Try `../hackie.dev` — check that `src/content/projects/` exists there.
   - If not found, ask the user: "Where is your hackie.dev repo? (default: ../hackie.dev)"
   - Store the resolved path as `HACKIE_ROOT`.
3. Check for an existing content file at `{HACKIE_ROOT}/src/content/projects/{slug}/index.ts`.
   - If it exists: ask "A content file for {slug} already exists. Overwrite it?"
   - If no: stop. If yes: continue.
4. Set `PROJECT_ROOT` = current working directory.
5. Set `SLUG` = the project's directory name (basename of PROJECT_ROOT), unless the user specifies otherwise.
```

---

### Task 3: Write Phase 1 — Platform detection

```markdown
## Phase 1: Platform detection

Run from PROJECT_ROOT:

```bash
ls *.xcodeproj project.yml 2>/dev/null | head -1    # → iOS/macOS indicator
ls go.mod 2>/dev/null                                # → CLI indicator
ls ui/*/Package.swift 2>/dev/null                    # → native macOS indicator
```

Decision table:
| Found | Platform(s) |
|-------|------------|
| `*.xcodeproj` or `project.yml` only | `["ios"]` (unless deployment target is macOS only) |
| `go.mod` only | `["cli"]` |
| `go.mod` + `ui/*/Package.swift` | `["cli", "macos"]` |
| `*.xcodeproj` + no iOS target in Info.plist | `["macos"]` |

To check iOS vs macOS for an Xcode project, read `project.yml` or `App/Info.plist`:
```bash
grep -r "IPHONEOS_DEPLOYMENT_TARGET\|MinimumOSVersion" App/ project.yml 2>/dev/null | head -3
```
If iOS deployment target found → `["ios"]`. If only macOS → `["macos"]`.

Store result as `PLATFORM` (a JSON-style array string, e.g. `["cli","macos"]`).
```

---

### Task 4: Write Phase 2 — Color + font extraction

```markdown
## Phase 2: Color + font extraction

### For iOS/macOS projects (Swift):

1. Find the colors token file:
```bash
find . -path "*/Tokens/Colors.swift" | head -1
```

2. Parse all `static var ds*` entries using this pattern:
```
static var dsFoo: Color { dynamic(rgb(R,G,B[,A]), rgb(R,G,B[,A])) }
```
Extract the rgb values. Convert to hex:
```
R_hex = hex(round(R)), etc.
```

3. Build a map: `{ dsFoo: { light: "#RRGGBB", dark: "#RRGGBB" } }`

4. Pick the accent color. Priority order:
   a. A named tint/brand entry that is NOT neutral (not dsAccent if it's ink-based, not dsBackground/dsCanvas/dsRaised)
   b. `dsSuccess` (usually green)
   c. The lightest non-neutral from the map

5. Compute `accentInk`:
   - If accent is light (luminance > 0.5): ink = `#101400` or very dark
   - If accent is dark (luminance ≤ 0.5): ink = `#F5F5F5`
   Formula (approximate): luminance = 0.299*R + 0.587*G + 0.114*B (0–255 scale)

6. Set `accent = accentLight`, `accentDark = accentDark` from the map entry.

7. Find the typography token file:
```bash
find . -path "*/Tokens/Typography.swift" | head -1
```
Grep for font name strings (look for `.custom(` or font name literals ending in recognized font patterns).

### For Go CLI projects (lipgloss):

1. Find theme file:
```bash
find . -name "theme.go" | head -1
```

2. Extract the Palette array:
```bash
grep -A 20 'var Palette' {theme.go path} | grep 'TrueColor:' | sed 's/.*TrueColor: "\(#[0-9a-fA-F]*\)".*/\1/'
```
Capture all 8 hex values as `PALETTE[0..7]`.

3. `accent = PALETTE[0]` (primary accent, used for focused borders in the TUI)
4. `accentDark = PALETTE[0]` (same — CLI is dark-first)
5. `accentInk`: compute from luminance (same formula as above)

6. Background color:
```bash
grep -i '"#[0-9a-fA-F]\{6\}"' {theme.go path} | grep -i 'bg\|background\|base' | head -1
```
Default: `#0D1117` if not found.

### For mixed (Go + Swift):

Run both extraction routines. CLI palette → `accent`/`accentDark`/`accentInk`. Note Swift palette separately as a comment in the generated file (for future macOS section theming).
```

---

### Task 5: Write Phase 3 — Asset collection + screenshot generation

```markdown
## Phase 3: Asset collection + screenshot generation

### Step 1: Look for existing assets

Search (exclude node_modules, .build, vendor, DerivedData):
```bash
find . \( -path "*/node_modules" -o -path "*/.build" -o -path "*/vendor" -o -path "*/DerivedData" \) -prune \
  -o \( -name "*.png" -o -name "*.jpg" -o -name "*.webp" -o -name "*.gif" -o -name "*.mp4" -o -name "*.webm" \) -print \
  | grep -iE "screenshot|screen|media|docs"
```
Classify: paths containing `-dark` or `screenshots-dark` → dark set. Others → light set.

### Step 2: Detect screenshot generation mechanism

Check for:
```bash
ls scripts/ui-snapshots.sh 2>/dev/null    # macOS fixture runner
ls scripts/landing-demo.tape 2>/dev/null  # VHS tape
find . -name "*.tape" 2>/dev/null         # any VHS tape
ls fastlane/Snapfile 2>/dev/null          # iOS Fastlane
```

If a mechanism is found: use it (see below).

**If NO mechanism is found:**
- Tell the user: "No screenshot generation mechanism found for {PLATFORM} in this project."
- Propose a platform-specific plan:
  - **cli**: "I can create a VHS tape at scripts/landing-demo.tape that runs your binary against mock data. Want me to?"
  - **macos**: "I can create a fixture-based screenshot script similar to scripts/ui-snapshots.sh. Want me to?"
  - **ios**: "This requires a Fastlane Snapshot setup with a UI test target. This is non-trivial. Want me to plan it?"
- Ask for approval. If approved, implement then run. If declined, use a styled placeholder.
- **Never silently fall back to a placeholder without asking.**

### Step 3: Run the mechanism

**For `scripts/ui-snapshots.sh`:**
1. Check we are in an Aqua session: `launchctl managername 2>/dev/null`
   - If not Aqua: warn "Screenshot generation requires a desktop session. Skipping." — use placeholder.
2. Build: `make ui`
3. Run: `bash scripts/ui-snapshots.sh`
4. Output directory: `$TMPDIR/{project}-snapshots/full/` (or as printed by the script)
5. Select representative PNGs: prefer `browse-tiles-light-1200x780.png` and `browse-tiles-dark-1200x780.png`, or the closest named equivalents.

**For VHS tape (`scripts/landing-demo.tape` or equivalent):**
1. Check VHS: `which vhs`
   - If missing: `brew install vhs` (ask first)
2. Check binary exists: `which {SLUG}` or `ls bin/{SLUG}` or `ls ./bin/`
   - If missing: `make build` or `go build ./cmd/...`
3. Run: `vhs scripts/landing-demo.tape`
4. Output: `landing-demo.gif` and any `.png` stills defined in the tape.

**If no tape exists but mechanism is approved:** Generate `scripts/landing-demo.tape`:
```tape
Output landing-demo.gif
Set FontSize 14
Set Width 120
Set Height 40
Set Theme "Dracula"
Set Shell "bash"

Type "mkdir -p /tmp/{SLUG}-demo && {SLUG} /tmp/{SLUG}-demo" Enter
Sleep 2s
Screenshot browse.png
Type "j" Sleep 200ms Type "j" Sleep 200ms
Screenshot browse-selection.png
```
Adapt the binary name and any flags inferred from the README usage section. Commit the tape.

**For Fastlane Snapfile:**
1. `bundle exec fastlane snapshot`
2. Output: `fastlane/screenshots/`

### Step 4: Copy to hackie.dev
```bash
mkdir -p {HACKIE_ROOT}/src/assets/projects/{SLUG}/screenshots
mkdir -p {HACKIE_ROOT}/src/assets/projects/{SLUG}/screenshots-dark
mkdir -p {HACKIE_ROOT}/public/projects/{SLUG}/video

# light screenshots
cp {light_pngs} {HACKIE_ROOT}/src/assets/projects/{SLUG}/screenshots/

# dark screenshots
cp {dark_pngs} {HACKIE_ROOT}/src/assets/projects/{SLUG}/screenshots-dark/

# video/GIF
cp {video_files} {HACKIE_ROOT}/public/projects/{SLUG}/video/
```
```

---

### Task 6: Write Phase 4 — Changelog

```markdown
## Phase 4: Changelog population

1. Read all tags sorted newest-first:
```bash
git tag -l --sort=-v:refname --format='%(refname:short)|%(creatordate:short)|%(subject)' | head -20
```

2. For each tag, try to read the annotation body:
```bash
git tag -v {TAG} 2>&1 | awk '/^$/{ found=1; next } found && /^-----BEGIN/{exit} found{print}'
```
If the annotation body is non-empty, use it as bullet notes (one bullet per line, skip empty lines).
If empty, use the tag subject line as the single note.

3. If no tags exist:
```bash
FALLBACK_ENTRY='{ version: "v0.1.0", date: "{TODAY_ISO}", notes: ["Initial release."] }'
```
Use today's date in ISO format.

4. Build the `ChangelogEntry[]` array (cap at 20 entries).
```

---

### Task 7: Write Phase 5 — Content file generation

```markdown
## Phase 5: Content file generation

1. Create directory:
```bash
mkdir -p {HACKIE_ROOT}/src/content/projects/{SLUG}
```

2. Write `{HACKIE_ROOT}/src/content/projects/{SLUG}/index.ts`:
```ts
import { registerProject } from '../index';

registerProject({
  slug: '{SLUG}',
  name: '{NAME}',           // from README title or first heading
  platform: {PLATFORM},     // extracted in Phase 1
  accent: '{ACCENT}',       // extracted in Phase 2
  accentDark: '{ACCENT_DARK}',
  accentInk: '{ACCENT_INK}',
  githubUrl: '{GITHUB_URL}',         // from README or git remote
  // appStoreUrl, testflightUrl, installCommand: fill if applicable
  changelog: [
    // {CHANGELOG_ENTRIES}
  ],
});
```

3. Add to `{HACKIE_ROOT}/src/content/projects/index.ts` — append the slug to `projectSlugs`:
```ts
export const projectSlugs = ['alterio', '{SLUG}', 'diskspace'] as const;
// (insert in the appropriate position)
```

4. Extend `{HACKIE_ROOT}/src/i18n/en.ts` with:
```ts
projects: {
  {SLUG}: {
    tagline: '{TAGLINE}',     // first sentence of README description
    description: '{DESC}',    // 2-3 sentence description from README
  },
}
```
Add a `// TODO: translate` placeholder with the EN value copied into `es.ts` and `ca.ts`.

5. Add a side-effect import in `{HACKIE_ROOT}/src/pages/[locale]/index.astro`:
```ts
import '../../../content/projects/{SLUG}/index';
```
And in `{HACKIE_ROOT}/src/pages/[locale]/[slug]/index.astro`:
```ts
import '../../../content/projects/{SLUG}/index';
```

6. Run type check:
```bash
cd {HACKIE_ROOT} && npm run check
```
Fix any errors before continuing. Common issue: `projectSlugs` type must match keys used in `t.projects`.
```

---

### Task 8: Write Phase 5b — CLAUDE.md updates

```markdown
## Phase 5b: CLAUDE.md updates

### In the project's CLAUDE.md:

Find the `## Agent skills` section (or create it). Append:
```markdown
### Landing page

`hackie.dev` has a project page for this project at `/{locale}/{SLUG}/`.

- To update the landing after a release: run `/release-{SLUG}` from inside this repo. The skill updates the changelog, re-extracts design tokens if the design changed, and regenerates screenshots.
- To do a full re-onboard: run `/onboard-project` from this repo.
- Screenshots are generated via `scripts/landing-demo.tape` (CLI) or `scripts/ui-snapshots.sh` (macOS). Run these manually to preview before a release.
```

### In `{HACKIE_ROOT}/CLAUDE.md`:

If the file does not exist, it was created in Plan A. If it does exist, find the project content section and add a line for the new project. No other changes needed.
```

---

### Task 9: Write Phase 6 — Release sub-skill generation

Write the final section and save the complete skill file.

- [ ] **Step 1: Write the final phase into the skill**

```markdown
## Phase 6: Release sub-skill generation

Write `~/.claude/skills/release-{SLUG}.md`:

```markdown
# release-{NAME}

Run this skill from inside the {NAME} project repo after tagging a new release.

## Steps

1. Read the latest tag:
```bash
git describe --tags --abbrev=0
```
Store as VERSION.

2. Read its annotation body for release notes (see Phase 4 in onboard-project for the git command). Fall back to the tag subject.

3. Build the new ChangelogEntry:
```ts
{ version: '{VERSION}', date: '{TODAY_ISO}', notes: [/* bullet notes */] }
```

4. Open `{HACKIE_ROOT}/src/content/projects/{SLUG}/index.ts`. Prepend the new entry to the `changelog` array.

5. Ask: "Has the app's visual design changed in this release?"
   - **If yes** (or if VERSION is a major bump, e.g. v2.x.x → v3.x.x):
     a. Re-run Phase 2 (color extraction) from onboard-project.
     b. Compare extracted values to the current `accent`/`accentDark`/`accentInk` in the content file.
     c. If any differ: update the content file and report what changed.
     d. Re-run Phase 3 (screenshot generation) using the project's existing mechanism.
   - **If no**:
     a. Ask: "Any new screenshots to add?"
     b. If yes: re-run Phase 3 (screenshot generation only).

6. Run: `cd {HACKIE_ROOT} && npm run check`

7. Commit:
```bash
cd {HACKIE_ROOT}
git add src/content/projects/{SLUG}/
git commit -m "chore({SLUG}): release {VERSION}"
```
```
```

- [ ] **Step 2: Assemble and write the complete `~/.claude/skills/onboard-project.md`**

Combine the preamble and all six phases (from Tasks 2–9) into a single cohesive skill file. The file should read as a numbered runbook, not as disconnected fragments.

- [ ] **Step 3: Verify the skill is valid**

```bash
cat ~/.claude/skills/onboard-project.md | wc -l
```

Expected: > 100 lines (a meaningful skill, not a stub).

Check that `/onboard-project` is now listed in available skills:
Open a new Claude Code session and type `/onboard-project` — the skill should be recognized.

- [ ] **Step 4: Verify `release-{slug}` template is embedded**

```bash
grep "release-" ~/.claude/skills/onboard-project.md | head -5
```

Expected: lines referencing the release sub-skill template.
