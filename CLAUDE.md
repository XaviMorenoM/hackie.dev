# hackie.dev

Portfolio for Xavi Moreno's AI-built projects. Astro 7 · static · Tailwind v4 · trilingual (en/es/ca).

## Adding a project

Run `/onboard-project` from inside the target project's repo.

## Updating a project after a release

Run `/release-{slug}` from inside that project's repo.

## Project content files

`src/content/projects/{slug}/index.ts` — one file per project.
Add its side-effect import in both `src/pages/[locale]/index.astro` and `src/pages/[locale]/[slug]/index.astro`.

## Routes

- `/{locale}/` — directory page (all projects)
- `/{locale}/{slug}/` — project landing (dynamic `[slug]` route, or static override)
- `/{locale}/alterio/` — static Alterio landing (overrides dynamic route)
- `/{locale}/{slug}/privacy/` + `/{locale}/{slug}/support/` — iOS legal pages

## Design tokens

Tokens in `src/styles/global.css`. Per-project accents injected by `ProjectLayout.astro` as `--project-accent`, `--project-accent-dark`, `--project-accent-ink`.
