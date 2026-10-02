# Plan B — Project Page System

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Models:** Implement with Sonnet. Validate with Opus.
>
> **Branch:** `feat/project-page-system` — branch from the commit that closes **Plan A Task 1** (content model + i18n), NOT from `main`. That commit adds `src/content/projects/index.ts` and the `projects.*` i18n keys that this plan depends on.

**Goal:** Build the project page template system: `ProjectLayout`, platform-switched `ProjectHero`, `ChangelogSection`, `TerminalFrame`, `LiquidGlassBubble`, and the dynamic `/{locale}/{slug}/` route.

**Architecture:** All project pages share `ProjectLayout.astro`, which injects per-project CSS tokens and renders the liquid glass bubble. The hero component switches on `platform[]` to render a phone frame (iOS) or terminal frame (CLI/macOS). The dynamic Astro route imports all project modules at build time via explicit side-effect imports and calls `getStaticPaths`.

**Tech Stack:** Astro 7 · TypeScript · Tailwind v4 · CSS `backdrop-filter` (no polyfill — modern Safari/Chrome only, same as the existing header blur)

**Spec:** `docs/superpowers/specs/2026-10-02-portfolio-redesign-design.md`

## Global Constraints

- No runtime JS except the existing theme script — all interactivity is CSS (`:hover`, `:focus`, CSS-only changelog expand)
- Tokens only (`--project-accent`, `--project-accent-dark`, `--project-accent-ink`) — never hardcode project colors in components
- `npm run check` must pass after every task
- `npm run build` must succeed before final commit
- `PhoneFrame.astro` stays at `src/components/PhoneFrame.astro` — do not move it

## Review Focus

1. **`getStaticPaths` misses a slug** — if a project module is imported in the directory page but not in `[slug]/index.astro`, the project page 404s at build time; both files must have identical side-effect import lists
2. **CSS token injection scope** — `--project-accent` is set on `:root` in a `<style>` block inside the layout; test that it doesn't leak to other pages when navigating back to the directory
3. **Liquid glass bubble `z-index` conflict** — the bubble is `fixed` at `z-50`; the existing `Header` is `sticky z-40`; verify the bubble doesn't overlap the header on short viewports
4. **Changelog CSS-only expand** — the "Show all" toggle uses `:target`; verify it works with `trailingSlash: 'always'` (URLs end with `/`, not `#`; the anchor is on the section, not the URL)
5. **Mixed platform hero split on mobile** — the side-by-side CLI+macOS layout must stack gracefully at < 640px; verify in DevTools mobile emulation

---

### Task 1: `ProjectLayout.astro` + per-project CSS tokens

**Files:**
- Create: `src/layouts/ProjectLayout.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `Project` from `src/content/projects/index.ts`; `Base.astro`
- Produces: `ProjectLayout` component — used by all tasks in this plan and Plan D/E

- [ ] **Step 1: Add project CSS token variables to `src/styles/global.css`**

Append to the `:root` block (dark theme defaults — will be overridden per-page by ProjectLayout):

```css
/* Per-project accent tokens — overridden by ProjectLayout per page */
--project-accent: var(--lime);
--project-accent-dark: var(--lime);
--project-accent-ink: #101400;
```

- [ ] **Step 2: Create `src/layouts/ProjectLayout.astro`**

```astro
---
import Base from './Base.astro';
import LiquidGlassBubble from '../components/project/LiquidGlassBubble.astro';
import type { Project } from '../content/projects/index';
import type { Locale } from '../config';
import { useTranslations } from '../i18n';

interface Props {
  project: Project;
  locale: Locale;
  title: string;
  description: string;
}
const { project, locale, title, description } = Astro.props;
---

<Base locale={locale} title={title} description={description}>
  <style define:vars={{
    'project-accent': project.accent,
    'project-accent-dark': project.accentDark,
    'project-accent-ink': project.accentInk,
  }}>
    :root {
      --project-accent: var(--project-accent);
      --project-accent-dark: var(--project-accent-dark);
      --project-accent-ink: var(--project-accent-ink);
    }
  </style>
  <LiquidGlassBubble locale={locale} />
  <slot />
</Base>
```

- [ ] **Step 3: Run `npm run check`**

```bash
npm run check
```

Expected: no errors (file exists but no page uses it yet — that's fine).

- [ ] **Step 4: Commit**

```bash
git add src/layouts/ProjectLayout.astro src/styles/global.css
git commit -m "feat: ProjectLayout with per-project CSS token injection"
```

---

### Task 2: `LiquidGlassBubble` component

**Files:**
- Create: `src/components/project/LiquidGlassBubble.astro`

**Interfaces:**
- Consumes: `locale`, `localePath` from i18n
- Produces: fixed pill with "Projects" link and LinkedIn link, visible on project pages

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/components/project
```

- [ ] **Step 2: Create `src/components/project/LiquidGlassBubble.astro`**

```astro
---
import { localePath, useTranslations } from '../../i18n';
import type { Locale } from '../../config';

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const homeHref = localePath(locale, '/');
---

<div class="glass-bubble" aria-label="Site navigation">
  <a href={homeHref} class="glass-bubble__link">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
    </svg>
    <span class="glass-bubble__label">Projects</span>
  </a>
  <div class="glass-bubble__sep" aria-hidden="true"></div>
  <a
    href="https://www.linkedin.com/in/xavimorenom"
    target="_blank"
    rel="noopener noreferrer"
    class="glass-bubble__link"
    aria-label="LinkedIn profile"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 1h-11A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 13.5 1ZM5.5 13H3.5V6.5h2V13Zm-1-7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM13 13h-2V9.75C11 8.79 10.21 8 9.25 8S7.5 8.79 7.5 9.75V13h-2V6.5h2v.97A2.74 2.74 0 0 1 9.25 6.5c1.52 0 3.75.88 3.75 3.25V13Z" fill="currentColor"/>
    </svg>
  </a>
</div>

<style>
  .glass-bubble {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 45;
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0.4rem 0.75rem;
    background: rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.10);
    border-radius: 9999px;
    color: rgba(255, 255, 255, 0.75);
  }

  :root[data-theme="light"] .glass-bubble,
  @media (prefers-color-scheme: light) {
    :root:not([data-theme="dark"]) .glass-bubble {
      background: rgba(255, 255, 255, 0.55);
      border-color: rgba(255, 255, 255, 0.70);
      color: rgba(0, 0, 0, 0.65);
    }
  }

  .glass-bubble__link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.15s;
    padding: 0.1rem 0.25rem;
  }
  .glass-bubble__link:hover { opacity: 1; color: var(--fg); }

  .glass-bubble__sep {
    width: 1px;
    height: 1.1em;
    background: rgba(255, 255, 255, 0.20);
    margin: 0 0.5rem;
    flex-shrink: 0;
  }

  :root[data-theme="light"] .glass-bubble__sep {
    background: rgba(0, 0, 0, 0.12);
  }

  .glass-bubble__label {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  @media (max-width: 639px) {
    .glass-bubble__label { display: none; }
  }
</style>
```

- [ ] **Step 3: Add to ProjectLayout — verify it renders**

The `ProjectLayout.astro` created in Task 1 already imports and renders `<LiquidGlassBubble>`. Run:

```bash
npm run check
```

- [ ] **Step 4: Commit**

```bash
git add src/components/project/LiquidGlassBubble.astro
git commit -m "feat: LiquidGlassBubble fixed navigation pill"
```

---

### Task 3: `TerminalFrame` component

**Files:**
- Create: `src/components/project/TerminalFrame.astro`

**Interfaces:**
- Produces: `TerminalFrame` — wraps arbitrary content (a `<pre>` block, an `<img>`, a `<video>`) in a macOS-style terminal window chrome

- [ ] **Step 1: Create `src/components/project/TerminalFrame.astro`**

```astro
---
interface Props {
  title?: string;
  class?: string;
}
const { title = 'bash', class: cls = '' } = Astro.props;
---

<div class:list={['terminal-frame', cls]}>
  <div class="terminal-frame__bar">
    <span class="terminal-frame__dot terminal-frame__dot--red"></span>
    <span class="terminal-frame__dot terminal-frame__dot--yellow"></span>
    <span class="terminal-frame__dot terminal-frame__dot--green"></span>
    <span class="terminal-frame__title">{title}</span>
  </div>
  <div class="terminal-frame__body">
    <slot />
  </div>
</div>

<style>
  .terminal-frame {
    border-radius: 0.75rem;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: #0D1117;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .terminal-frame__bar {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.625rem 0.875rem;
    background: #161b22;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .terminal-frame__dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .terminal-frame__dot--red    { background: #ff5f57; }
  .terminal-frame__dot--yellow { background: #ffbd2e; }
  .terminal-frame__dot--green  { background: #28c840; }

  .terminal-frame__title {
    flex: 1;
    text-align: center;
    font-family: ui-monospace, monospace;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
    margin-right: 2.25rem; /* offset for the three dots */
  }

  .terminal-frame__body {
    padding: 1rem;
    font-family: ui-monospace, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    color: #c9d1d9;
    overflow: auto;
  }
</style>
```

- [ ] **Step 2: Verify type check**

```bash
npm run check
```

- [ ] **Step 3: Commit**

```bash
git add src/components/project/TerminalFrame.astro
git commit -m "feat: TerminalFrame window chrome component"
```

---

### Task 4: `ProjectHero` — platform-switched hero

**Files:**
- Create: `src/components/project/ProjectHero.astro`

**Interfaces:**
- Consumes: `Project`; `PhoneFrame` at `../../components/PhoneFrame.astro`; `TerminalFrame` at `./TerminalFrame.astro`
- Produces: `ProjectHero` used by the dynamic `[slug]` page

The hero adapts to `project.platform[]`:
- `['ios']` → phone frame hero with gradient bg
- `['cli']` → terminal frame hero with dark bg + install command
- `['cli','macos']` or `['macos','cli']` → split composition
- `['macos']` → macOS window frame (reuse terminal chrome, different title bar color)

- [ ] **Step 1: Create `src/components/project/ProjectHero.astro`**

```astro
---
import PhoneFrame from '../PhoneFrame.astro';
import TerminalFrame from './TerminalFrame.astro';
import type { Project } from '../../content/projects/index';
import type { Locale } from '../../config';
import { useTranslations } from '../../i18n';

interface Props {
  project: Project;
  locale: Locale;
}
const { project, locale } = Astro.props;
const t = useTranslations(locale);

const isCli = project.platform.includes('cli');
const isIos = project.platform.includes('ios');
const isMacos = project.platform.includes('macos');
const isMixed = isCli && isMacos;

const projectT = (t.projects as Record<string, { tagline: string; description: string }>)[project.slug];
---

<section
  class:list={[
    'relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28',
    isIos && !isCli ? 'hero--ios' : '',
    isCli && !isMacos ? 'hero--cli' : '',
    isMixed ? 'hero--mixed' : '',
  ]}
  style={`--project-accent: ${project.accent}; --project-accent-dark: ${project.accentDark}; --project-accent-ink: ${project.accentInk};`}
>
  <div class="mx-auto max-w-6xl">
    <div class:list={['flex gap-12', isMixed ? 'flex-col lg:flex-row' : 'flex-col md:flex-row items-center']}>

      {/* Text column */}
      <div class="flex-1 flex flex-col justify-center">
        <div class="flex flex-wrap gap-1.5 mb-5">
          {project.platform.map((p) => (
            <span class="platform-badge">{t.directory.platformBadge[p]}</span>
          ))}
        </div>
        <h1 class="display text-5xl text-fg sm:text-6xl md:text-7xl">
          {project.name}<span style="color: var(--project-accent)">.</span>
        </h1>
        <p class="display mt-4 max-w-xl text-2xl text-muted sm:text-3xl">{projectT?.tagline}</p>
        <p class="mt-6 max-w-lg text-base leading-relaxed text-muted">{projectT?.description}</p>

        {/* CTAs */}
        <div class="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          {project.appStoreUrl && (
            <a href={project.appStoreUrl} target="_blank" rel="noopener" class="cta-primary">
              Download on the App Store
            </a>
          )}
          {project.testflightUrl && !project.appStoreUrl && (
            <a href={project.testflightUrl} target="_blank" rel="noopener" class="cta-primary">
              Join the TestFlight beta
            </a>
          )}
          {project.installCommand && (
            <div class="install-command">
              <code>{project.installCommand}</code>
              <button type="button" aria-label="Copy install command" data-copy={project.installCommand} class="copy-btn">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M4 11H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
            </div>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener" class="cta-secondary">GitHub ↗</a>
          )}
        </div>
      </div>

      {/* Visual column */}
      <div class:list={['visual-col', isMixed ? 'lg:w-1/2' : 'md:w-2/5']}>
        {isIos && !isCli && (
          <PhoneFrame>
            <slot name="screenshot" />
          </PhoneFrame>
        )}
        {isCli && !isMacos && (
          <TerminalFrame title={project.name.toLowerCase()}>
            <slot name="tui" />
          </TerminalFrame>
        )}
        {isMixed && (
          <div class="mixed-frames">
            <div class="mixed-frames__cli">
              <p class="mixed-label">Terminal</p>
              <TerminalFrame title={project.name.toLowerCase()}>
                <slot name="tui" />
              </TerminalFrame>
            </div>
            <div class="mixed-frames__app">
              <p class="mixed-label">App</p>
              <TerminalFrame title={project.name} class="macos-frame">
                <slot name="app-screenshot" />
              </TerminalFrame>
            </div>
          </div>
        )}
      </div>

    </div>
  </div>
</section>

<script is:inline>
  document.querySelectorAll('[data-copy]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      navigator.clipboard?.writeText(btn.getAttribute('data-copy') || '');
    });
  });
</script>

<style>
  .hero--cli { background: #0D1117; }
  .hero--ios {
    background: linear-gradient(160deg, var(--bg) 40%, color-mix(in srgb, var(--project-accent-dark) 15%, var(--bg)) 100%);
  }
  .hero--mixed { background: #0D1117; }

  .platform-badge {
    border-radius: 9999px;
    border: 1px solid var(--line);
    padding: 0.1rem 0.6rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .cta-primary {
    display: inline-flex;
    align-items: center;
    padding: 0.6rem 1.25rem;
    border-radius: 9999px;
    background: var(--project-accent);
    color: var(--project-accent-ink);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .cta-primary:hover { opacity: 0.88; }

  .cta-secondary {
    color: var(--muted);
    font-size: 0.9rem;
    text-decoration: none;
  }
  .cta-secondary:hover { color: var(--fg); }

  .install-command {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    border-radius: 0.5rem;
    background: var(--surface);
    border: 1px solid var(--line);
    font-family: ui-monospace, monospace;
    font-size: 0.8rem;
    color: var(--fg);
  }
  .copy-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--muted);
    display: flex;
    align-items: center;
  }
  .copy-btn:hover { color: var(--fg); }

  .mixed-frames {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  @media (min-width: 640px) {
    .mixed-frames { flex-direction: row; gap: 1rem; }
    .mixed-frames > * { flex: 1; }
  }

  .mixed-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 0.5rem;
  }
</style>
```

- [ ] **Step 2: Run `npm run check`**

```bash
npm run check
```

- [ ] **Step 3: Commit**

```bash
git add src/components/project/ProjectHero.astro
git commit -m "feat: platform-switched ProjectHero component"
```

---

### Task 5: `ChangelogSection` component

**Files:**
- Create: `src/components/project/ChangelogSection.astro`

**Interfaces:**
- Consumes: `Project['changelog']` array

- [ ] **Step 1: Create `src/components/project/ChangelogSection.astro`**

```astro
---
interface Entry { version: string; date: string; notes: string[] }
interface Props {
  changelog: Entry[];
  defaultShown?: number;
}
const { changelog, defaultShown = 5 } = Astro.props;
const visible = changelog.slice(0, defaultShown);
const hidden = changelog.slice(defaultShown);
---

<section class="mx-auto max-w-6xl px-5 py-16 sm:px-8">
  <h2 class="mb-8 text-2xl font-semibold text-fg">Changelog</h2>

  {changelog.length === 0 && (
    <p class="text-muted">No releases yet.</p>
  )}

  <ol class="changelog-list">
    {visible.map((entry) => (
      <li class="changelog-entry">
        <div class="changelog-meta">
          <span class="changelog-version">{entry.version}</span>
          <span class="changelog-dot" aria-hidden="true">·</span>
          <time class="changelog-date">{entry.date}</time>
        </div>
        <ul class="changelog-notes">
          {entry.notes.map((note) => <li>{note}</li>)}
        </ul>
      </li>
    ))}
  </ol>

  {hidden.length > 0 && (
    <>
      <div id="changelog-more" class="changelog-hidden">
        <ol class="changelog-list">
          {hidden.map((entry) => (
            <li class="changelog-entry">
              <div class="changelog-meta">
                <span class="changelog-version">{entry.version}</span>
                <span class="changelog-dot" aria-hidden="true">·</span>
                <time class="changelog-date">{entry.date}</time>
              </div>
              <ul class="changelog-notes">
                {entry.notes.map((note) => <li>{note}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
      <a href="#changelog-more" class="show-all-link">Show all {changelog.length} releases ↓</a>
    </>
  )}
</section>

<style>
  .changelog-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1.5rem; }

  .changelog-entry { border-left: 2px solid var(--line); padding-left: 1.25rem; }

  .changelog-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }

  .changelog-version { font-weight: 600; font-size: 0.875rem; color: var(--fg); }

  .changelog-dot, .changelog-date { font-size: 0.8rem; color: var(--muted); }

  .changelog-notes { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.2rem; }

  .changelog-notes li { font-size: 0.875rem; color: var(--muted); }
  .changelog-notes li::before { content: '• '; color: var(--project-accent); }

  .changelog-hidden { display: none; }
  .changelog-hidden:target { display: block; }

  .show-all-link {
    display: inline-block;
    margin-top: 1rem;
    font-size: 0.8rem;
    color: var(--muted);
    text-decoration: none;
  }
  .show-all-link:hover { color: var(--fg); }
  /* Hide the link once expanded */
  #changelog-more:target ~ .show-all-link { display: none; }
</style>
```

- [ ] **Step 2: Run `npm run check`**

```bash
npm run check
```

- [ ] **Step 3: Commit**

```bash
git add src/components/project/ChangelogSection.astro
git commit -m "feat: ChangelogSection with CSS-only expand"
```

---

### Task 6: Dynamic `/{locale}/{slug}/` project page

**Files:**
- Create: `src/pages/[locale]/[slug]/index.astro`

**Interfaces:**
- Consumes: `getAllProjects()`, `getProject(slug)`, all project modules (side-effect imports); `ProjectLayout`; `ProjectHero`; `ChangelogSection`

- [ ] **Step 1: Create directory**

```bash
mkdir -p "src/pages/[locale]/[slug]"
```

- [ ] **Step 2: Create `src/pages/[locale]/[slug]/index.astro`**

```astro
---
import ProjectLayout from '../../../layouts/ProjectLayout.astro';
import ProjectHero from '../../../components/project/ProjectHero.astro';
import ChangelogSection from '../../../components/project/ChangelogSection.astro';
import { getAllProjects, getProject } from '../../../content/projects/index';
import type { Locale } from '../../../config';
import { LOCALE_TAGS, SITE_URL } from '../../../config';
import { localePath, useTranslations } from '../../../i18n';

// Side-effect imports register all projects
import '../../../content/projects/alterio/index';
// import '../../../content/projects/diskspace/index'; // uncomment when onboarded

export async function getStaticPaths() {
  const { LOCALES } = await import('../../../config');
  const projects = getAllProjects();
  return LOCALES.flatMap((locale) =>
    projects.map((project) => ({
      params: { locale, slug: project.slug },
      props: { project, locale },
    }))
  );
}

const { project, locale } = Astro.props as { project: import('../../../content/projects/index').Project; locale: Locale };
const t = useTranslations(locale);
const projectT = (t.projects as Record<string, { tagline: string; description: string }>)[project.slug];

const pageTitle = `${project.name} — ${projectT?.tagline ?? ''}`;
const pageDesc = projectT?.description ?? '';
---

<ProjectLayout project={project} locale={locale} title={pageTitle} description={pageDesc}>
  <main id="content">
    <ProjectHero project={project} locale={locale} />
    {project.changelog.length > 0 && <ChangelogSection changelog={project.changelog} />}
  </main>
</ProjectLayout>
```

- [ ] **Step 3: Verify Astro can resolve the route**

```bash
npm run dev
```

Navigate to `http://localhost:4321/en/alterio/` — must still show the Alterio landing from Plan A (static route wins). Navigate to `http://localhost:4321/en/testslug/` — will 404 (no such project), but the dev server should not error on startup.

- [ ] **Step 4: Build to verify `getStaticPaths` generates correct routes**

```bash
npm run build 2>&1 | grep -E "alterio|error|Error"
```

Expected: `/en/alterio/` is generated by the **static** route (Plan A's `[locale]/alterio/index.astro`), not by `[slug]`. No build errors. When a second project is registered (Plan D/E), `[slug]` will generate its routes.

- [ ] **Step 5: Run `npm run check`**

```bash
npm run check
```

- [ ] **Step 6: Commit and push**

```bash
git add "src/pages/[locale]/[slug]/" src/layouts/ProjectLayout.astro
git commit -m "feat: dynamic project page route with ProjectHero + ChangelogSection"
git push -u origin feat/project-page-system
```
