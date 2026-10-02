# Plan A — Routing & Directory

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Models:** Implement with Sonnet. Validate with Opus.
>
> **Branch:** `feat/directory-routing` — branch from `main`. Plan B branches from the commit that finishes Task 1.

**Goal:** Move the Alterio landing from `/{locale}/` to `/{locale}/alterio/`, turn the locale root into a project directory page, and add browser-language detection to the root `/` redirect.

**Architecture:** Astro static site. The current `[locale]/index.astro` (Alterio landing) moves to `[locale]/alterio/index.astro` (which is currently just a meta-refresh redirect and gets replaced). The root `src/pages/index.astro` gets a `<script>`-based language detector; Astro's built-in `redirectToDefaultLocale` must be disabled for this to take effect. A new `[locale]/index.astro` renders the directory using a `ProjectCard` component and a typed project registry.

**Tech Stack:** Astro 7 · TypeScript · Tailwind v4 · no added dependencies

**Spec:** `docs/superpowers/specs/2026-10-02-portfolio-redesign-design.md`

## Global Constraints

- No client JS except the root language-detection script (~100 bytes) and the existing theme script — never add runtime JS to component files
- All copy goes through `src/i18n/{locale}.ts` — no hardcoded strings in `.astro` files
- Tokens only via CSS custom properties — never hardcode hex in component files
- `npm run check` must pass (zero TS errors) after every task
- `npm run build` must succeed before the final commit

## Review Focus

1. **Language detection picks wrong locale** — `navigator.language` is `es-419` (Latin American Spanish): the script must match on the prefix `es`, not the full tag
2. **Root redirect ignores `localStorage.lang`** — a user who previously picked Catalan should land on `/ca/` even if their browser is set to English
3. **`/alterio/` relative imports are one level too deep** — the Alterio landing moved from `[locale]/index.astro` (2 levels up) to `[locale]/alterio/index.astro` (3 levels up); every `../../` import path becomes `../../../`
4. **Sitemap includes the old redirect** — `/{locale}/alterio/` is now a real page and must appear in the sitemap; the old filter excluded it
5. **`getStaticPaths` on directory page** — the project registry is imported at build time; a missing or mistyped slug won't throw until build — verify `npm run build` as part of the task

---

### Task 1: Content model + i18n extension
> **Plan B branches from the commit that closes this task.**

**Files:**
- Create: `src/content/projects/index.ts`
- Create: `src/content/projects/alterio/index.ts`
- Modify: `src/i18n/types.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/i18n/es.ts`
- Modify: `src/i18n/ca.ts`

**Interfaces:**
- Produces: `Project` type, `projectRegistry` array, `getProject(slug)` helper — used by Plan A Tasks 4–5 and all of Plan B

- [ ] **Step 1: Create `src/content/projects/index.ts`**

```ts
export interface Project {
  slug: string;
  name: string;
  platform: ('ios' | 'macos' | 'cli')[];
  accent: string;
  accentDark: string;
  accentInk: string;
  githubUrl?: string;
  appStoreUrl?: string;
  testflightUrl?: string;
  installCommand?: string;
  changelog: { version: string; date: string; notes: string[] }[];
}

/** Ordered list — controls directory page card order. */
export const projectSlugs = ['alterio', 'diskspace'] as const;
export type ProjectSlug = (typeof projectSlugs)[number];

const registry = new Map<string, Project>();

export function registerProject(p: Project) {
  registry.set(p.slug, p);
}

export function getProject(slug: string): Project | undefined {
  return registry.get(slug);
}

export function getAllProjects(): Project[] {
  return projectSlugs.map((s) => registry.get(s)).filter((p): p is Project => p !== undefined);
}
```

- [ ] **Step 2: Create `src/content/projects/alterio/index.ts`**

```ts
import { registerProject } from '../index';

registerProject({
  slug: 'alterio',
  name: 'Alterio',
  platform: ['ios'],
  accent: '#C6FF3D',
  accentDark: '#C6FF3D',
  accentInk: '#101400',
  appStoreUrl: null ?? undefined,
  testflightUrl: null ?? undefined,
  changelog: [],
});
```

- [ ] **Step 3: Add `directory` and `projects` keys to `src/i18n/types.ts`**

After the existing `notFound` block, add:

```ts
  directory: {
    intro: string;
    platformBadge: Record<'ios' | 'macos' | 'cli', string>;
  };
  projects: {
    alterio: { tagline: string; description: string };
    diskspace: { tagline: string; description: string };
  };
```

- [ ] **Step 4: Add translations to `src/i18n/en.ts`** (append to the exported object):

```ts
  directory: {
    intro: 'Apps and tools, built with AI.',
    platformBadge: { ios: 'iOS', macos: 'macOS', cli: 'CLI' },
  },
  projects: {
    alterio: {
      tagline: 'The gym tracker that stays out of your way.',
      description:
        '{app} is a fast, local-first gym tracker for iPhone. Log sets in seconds, follow routines, and see your progress — all on your device.',
    },
    diskspace: {
      tagline: 'See what's eating your disk. Delete it fast.',
      description:
        'A terminal disk-usage explorer and cleaner for macOS and Linux. Browse your filesystem by size, mark files for deletion, and clean up in seconds — from the terminal or the native macOS app.',
    },
  },
```

- [ ] **Step 5: Mirror to `src/i18n/es.ts`** (Spanish):

```ts
  directory: {
    intro: 'Apps y herramientas, construidas con IA.',
    platformBadge: { ios: 'iOS', macos: 'macOS', cli: 'CLI' },
  },
  projects: {
    alterio: {
      tagline: 'El registro de gimnasio que no te molesta.',
      description:
        '{app} es un registro de entrenamiento rápido y local para iPhone. Anota series en segundos, sigue rutinas y mira tu progreso — todo en tu dispositivo.',
    },
    diskspace: {
      tagline: 'Ve qué ocupa tu disco. Elimínalo rápido.',
      description:
        'Un explorador de uso de disco para macOS y Linux. Navega por tu sistema de archivos por tamaño, marca archivos para borrar y limpia en segundos — desde la terminal o la app nativa de macOS.',
    },
  },
```

- [ ] **Step 6: Mirror to `src/i18n/ca.ts`** (Catalan):

```ts
  directory: {
    intro: 'Apps i eines, construïdes amb IA.',
    platformBadge: { ios: 'iOS', macos: 'macOS', cli: 'CLI' },
  },
  projects: {
    alterio: {
      tagline: "El registre de gimnàs que no t'interromp.",
      description:
        "{app} és un registre d'entrenament ràpid i local per a iPhone. Apunta sèries en segons, segueix rutines i mira el teu progrés — tot al teu dispositiu.",
    },
    diskspace: {
      tagline: 'Veu què ocupa el disc. Elimina-ho ràpid.',
      description:
        'Un explorador d\'ús de disc per a macOS i Linux. Navega pel sistema de fitxers per mida, marca arxius per esborrar i neteja en segons — des del terminal o l\'app nativa de macOS.',
    },
  },
```

- [ ] **Step 7: Verify type check passes**

```bash
npm run check
```

Expected: zero errors. If TypeScript complains about the new keys, check that all three locale files have the same structure.

- [ ] **Step 8: Commit**

```bash
git add src/content/ src/i18n/
git commit -m "feat: content model + i18n keys for projects and directory"
```

---

### Task 2: Disable Astro's default locale redirect + root language detector

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: nothing new
- Produces: `/` page that reads `localStorage.lang`, then `navigator.language`, redirects to `/{en|es|ca}/`

- [ ] **Step 1: Disable `redirectToDefaultLocale` in `astro.config.mjs`**

Find:
```js
routing: {
  prefixDefaultLocale: true,
  redirectToDefaultLocale: true,
},
```
Change to:
```js
routing: {
  prefixDefaultLocale: true,
  redirectToDefaultLocale: false,
},
```

- [ ] **Step 2: Replace `src/pages/index.astro` with language-detection page**

```astro
---
// Root: detect browser language and redirect. No server-side logic — pure client script.
// Falls back to /en/ in no-JS environments (noscript meta-refresh).
---
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <script is:inline>
      (function () {
        var saved = '';
        try { saved = localStorage.lang || ''; } catch (_) {}
        var lang = saved || (navigator.language || 'en');
        var map = { es: 'es', ca: 'ca' };
        var k = Object.keys(map).find(function (k) { return lang.startsWith(k); }) || 'en';
        location.replace('/' + k + '/');
      })();
    </script>
    <noscript><meta http-equiv="refresh" content="0;url=/en/" /></noscript>
  </head>
  <body></body>
</html>
```

- [ ] **Step 3: Start dev server and verify root redirect**

```bash
npm run dev
```
Open `http://localhost:4321/` in a browser with language set to English → must redirect to `/en/`. Open in a browser with `navigator.language` spoofed to `es` (DevTools → Sensors → Locale) → must redirect to `/es/`.

- [ ] **Step 4: Verify `npm run check` still passes**

```bash
npm run check
```

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/pages/index.astro
git commit -m "feat: browser-language detection on root redirect"
```

---

### Task 3: Move Alterio landing to `/{locale}/alterio/`

**Files:**
- Modify: `src/pages/[locale]/alterio/index.astro` — replace redirect with Alterio landing
- Modify: `src/pages/[locale]/index.astro` — strip to placeholder (full directory page comes in Task 4)

**Interfaces:**
- Consumes: all existing Alterio components unchanged

- [ ] **Step 1: Copy Alterio landing into `[locale]/alterio/index.astro`**

Replace the entire file with the current content of `src/pages/[locale]/index.astro`, then fix **all** relative import paths: every `../../` becomes `../../../` (one extra level deep).

Example: `../../layouts/Base.astro` → `../../../layouts/Base.astro`

Run this to confirm no stale paths remain:
```bash
grep -n "\.\./\.\." "src/pages/[locale]/alterio/index.astro"
```
Every path shown must be `../../../` or deeper, never `../../`.

- [ ] **Step 2: Strip `src/pages/[locale]/index.astro` to a placeholder**

Replace the entire file:
```astro
---
import Base from '../../layouts/Base.astro';
import { localeStaticPaths } from '../../i18n';
import type { Locale } from '../../config';

export const getStaticPaths = localeStaticPaths;
const locale = Astro.params.locale as Locale;
---
<Base locale={locale} title="hackie.dev" description="Apps and tools, built with AI.">
  <main><p>Directory coming soon.</p></main>
</Base>
```

- [ ] **Step 3: Check that `/en/alterio/` loads the Alterio landing**

```bash
npm run dev
```
Navigate to `http://localhost:4321/en/alterio/` — must show the full Alterio landing (hero, features, gallery). Navigate to `http://localhost:4321/en/` — must show "Directory coming soon."

- [ ] **Step 4: Check privacy and support pages still work**

`http://localhost:4321/en/alterio/privacy/` and `/en/alterio/support/` must load unchanged (these files were not touched).

- [ ] **Step 5: Verify type check**

```bash
npm run check
```

- [ ] **Step 6: Commit**

```bash
git add "src/pages/[locale]/"
git commit -m "feat: move Alterio landing to /alterio/, placeholder directory at root"
```

---

### Task 4: Directory page + `ProjectCard` component

**Files:**
- Create: `src/components/ProjectCard.astro`
- Modify: `src/pages/[locale]/index.astro`

**Interfaces:**
- Consumes: `Project` from `src/content/projects/index.ts`; `getAllProjects()`, `registerProject()` side-effect (must import all project modules before calling `getAllProjects()`)

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
import type { Project } from '../content/projects/index';
import { localePath, useTranslations } from '../i18n';
import type { Locale } from '../config';

interface Props {
  project: Project;
  locale: Locale;
}
const { project, locale } = Astro.props;
const t = useTranslations(locale);
const href = localePath(locale, `/${project.slug}/`);
---

<a
  href={href}
  class="group relative flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 focus-visible:outline-2 focus-visible:outline-lime"
>
  <div class="flex items-start gap-3">
    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg text-2xl">
      <!-- icon slot: project can supply an emoji or we fallback -->
      {project.platform.includes('ios') ? '📱' : project.platform.includes('cli') ? '⌨️' : '🖥️'}
    </div>
    <div class="min-w-0">
      <h2 class="truncate text-base font-semibold text-fg">{project.name}</h2>
      <p class="mt-0.5 truncate text-sm text-muted">
        {(t.projects as Record<string, { tagline: string }>)[project.slug]?.tagline ?? ''}
      </p>
    </div>
  </div>
  <div class="flex flex-wrap gap-1.5">
    {
      project.platform.map((p) => (
        <span class="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
          {t.directory.platformBadge[p]}
        </span>
      ))
    }
  </div>
</a>
```

- [ ] **Step 2: Write full directory page in `src/pages/[locale]/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import { getAllProjects } from '../../content/projects/index';
import { localeStaticPaths, useTranslations } from '../../i18n';
import type { Locale } from '../../config';

// Side-effect imports register all projects into the registry
import '../../content/projects/alterio/index';
// import '../../content/projects/diskspace/index'; // uncomment when onboarded

export const getStaticPaths = localeStaticPaths;

const locale = Astro.params.locale as Locale;
const t = useTranslations(locale);
const projects = getAllProjects();
---

<Base locale={locale} title="hackie.dev" description={t.directory.intro}>
  <main id="content" class="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
    <p class="mb-10 text-center text-lg text-muted">{t.directory.intro}</p>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => <ProjectCard project={p} locale={locale} />)}
    </div>
  </main>
</Base>
```

- [ ] **Step 3: Verify directory page renders**

```bash
npm run dev
```
`http://localhost:4321/en/` must show the intro line and one card for Alterio. Card must link to `/en/alterio/`. Hover must show lift effect. `/es/` and `/ca/` must show translated intro and tagline.

- [ ] **Step 4: Verify `npm run check`**

```bash
npm run check
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.astro "src/pages/[locale]/index.astro"
git commit -m "feat: directory page + ProjectCard component"
```

---

### Task 5: Persist language choice in `LangSwitcher`

**Files:**
- Modify: `src/components/LangSwitcher.astro`

**Interfaces:**
- Produces: `localStorage.lang` set to the chosen locale string when user clicks a language link

- [ ] **Step 1: Add persistence script to `LangSwitcher.astro`**

After the closing `</nav>` tag, append:

```astro
<script is:inline>
  document.querySelectorAll('[data-lang-link]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.lang = a.getAttribute('data-lang-link'); } catch (_) {}
    });
  });
</script>
```

Add `data-lang-link={l}` to each language `<a>` tag in the component:

```astro
<a
  href={localePath(l, path)}
  hreflang={LOCALE_TAGS[l]}
  lang={LOCALE_TAGS[l]}
  title={LOCALE_LABELS[l]}
  data-lang-link={l}
  class="px-1 text-muted transition-colors hover:text-fg"
>
```

- [ ] **Step 2: Verify persistence**

In DevTools console on any page, click a language → `localStorage.lang` must update. Navigate to root `/` → must redirect to the persisted locale.

- [ ] **Step 3: Commit**

```bash
git add src/components/LangSwitcher.astro
git commit -m "feat: persist language choice in localStorage"
```

---

### Task 6: Update sitemap config

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Update the sitemap filter**

The current filter excludes `/` and any `/{locale}/alterio/` (the old redirect).
After the change: `/` is still excluded (it's a client-side redirect), but `/{locale}/alterio/` is now a real page and must be included.

Replace:
```js
filter: (page) => page !== new URL(SITE_BASE, SITE_URL).href && !/\/alterio\/$/.test(page),
```
With:
```js
filter: (page) => page !== new URL(SITE_BASE, SITE_URL).href,
```

- [ ] **Step 2: Build and inspect sitemap**

```bash
npm run build
cat dist/sitemap-0.xml | grep alterio
```

Expected: entries for `/en/alterio/`, `/es/alterio/`, `/ca/alterio/` must appear. `/en/` (directory) must also appear.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "fix: include /alterio/ pages in sitemap after route restructure"
```

---

### Task 7: Create `CLAUDE.md`

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Write `CLAUDE.md` at repo root**

```markdown
# hackie.dev

Standalone portfolio for Xavi Moreno's AI-built projects. Astro 7 · static · Tailwind v4 · light/dark theme · trilingual (en/es/ca).

## Adding a project

Run `/onboard-project` from inside the target project's repo. The skill detects the platform, extracts design tokens, generates screenshots, populates the content file, and creates a per-project release skill.

## Updating a project after a release

Run `/release-{slug}` from inside that project's repo.

## Project content files

Each project is defined in `src/content/projects/{slug}/index.ts`. Import it in the directory page (`src/pages/[locale]/index.astro`) to register it. Order in `src/content/projects/index.ts`'s `projectSlugs` array controls card order.

## Routes

- `/{locale}/` — directory page
- `/{locale}/{slug}/` — project landing (dynamic route `src/pages/[locale]/[slug]/index.astro`)
- `/{locale}/{slug}/privacy/` and `/{locale}/{slug}/support/` — legal pages (iOS projects)

## Design system

Tokens in `src/styles/global.css`. Per-project accent colors injected as `--project-accent` / `--project-accent-dark` / `--project-accent-ink` by `src/layouts/ProjectLayout.astro`.

## Development

```bash
npm run dev      # http://localhost:4321
npm run check    # TypeScript (must pass before every commit)
npm run build    # production build (must pass before merge)
```
```

- [ ] **Step 2: Commit and push**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md with project onboarding + update instructions"
git push -u origin feat/directory-routing
```
