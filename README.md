# hackie.dev

Standalone landing for Xavi Moreno's gym-tracker app (name in `src/config.ts`), hosted at hackie.dev. Astro 7 · static output · Tailwind v4 · light/dark theme · no client JS beyond a <1 KB theme switch · en / es / ca.

## Run

```bash
npm install
npm run dev        # http://localhost:4321 → redirects to /en/
npm run build      # → dist/
npm run preview    # serve dist/ locally
npm run check      # astro check (TypeScript across .astro files)
```

Node ≥ 22.12 (the repo is developed on Node 26). Fonts (Instrument Serif Italic, Inter) are fetched from Google Fonts **at build time** and self-hosted from `dist/_astro/fonts/` — the first build needs network access; afterwards they're cached under `node_modules/.astro/`.

## Routes

The site is the product's standalone landing — the `hackie.dev` brand appears only in the footer. Every page exists under each locale prefix. `/` is a meta-refresh redirect to `/en/`.

| Path                           | What                                                        |
| ------------------------------ | ----------------------------------------------------------- |
| `/{en,es,ca}/`                 | Product landing (hero, features, screens, video, data, CTA) |
| `/{en,es,ca}/alterio/`         | Legacy URL → instant redirect to `/{locale}/` (noindex)      |
| `/{en,es,ca}/alterio/privacy/` | Privacy policy (App Store Connect "Privacy Policy URL")      |
| `/{en,es,ca}/alterio/support/` | FAQ + mailto (App Store Connect "Support URL")               |
| `/404`                         | Not-found page (English)                                     |

Sitemap lists the 9 real pages; redirects are excluded.


## Renaming the app

The product's display name lives in **one** place: `APP_NAME` in [`src/config.ts`](src/config.ts). Every title, paragraph, meta tag, JSON-LD block and privacy/support string interpolates it through the `{app}` token in `src/i18n/*.ts`. Change the constant, rebuild, done.

```bash
grep -rn "Alterio" src --include='*.astro' --include='*.ts'   # should list only src/config.ts
```

The URL segment (`/alterio/`) is `APP_SLUG` + the `src/pages/[locale]/alterio/` folder name. It's deliberately independent of the display name; rename the folder and the constant together if you ever want to change it.

Other knobs in `src/config.ts`: `APP_STORE_URL` / `TESTFLIGHT_URL` (both `null` → CTA renders as a disabled "Coming soon"; set the App Store one when live), `CONTACT_EMAIL`, `DEVELOPER_NAME`, `PRIVACY_EFFECTIVE_DATE`, `MIN_IOS_VERSION`.

> Catalan elision (`d’Alterio` vs `de Zeta`) is handled by the `{dApp}` token in `src/i18n/index.ts`, chosen from the name's first letter — nothing to edit in `ca.ts`.

## Translations

`src/i18n/{en,es,ca}.ts` share the `Translations` type in `src/i18n/types.ts`, so a missing key is a type error. Tokens available in any string: `{app}`, `{dApp}` (Catalan `d’/de` + name), `{developer}`, `{email}`, `{ios}`, `{date}` (privacy effective date, formatted per locale). `useTranslations(locale)` returns the interpolated table; `getLocaleFromUrl`, `stripLocale`, `localePath` handle URL ↔ locale.

## Media

Raw drops from the media pipeline go in `media/` (gitignored, may be large):

```
media/screenshots/en/*.png
media/screenshots/es/*.png
media/video/*.mp4|webm
```

To wire them into the site:

1. **Screenshots** → copy into `src/assets/screenshots/{en,es}/` (any `png|jpg|webp`; sorted by filename, so prefix `01-`, `02-`, …). `ScreenshotGallery.astro` picks them up automatically via `import.meta.glob`, renders them through Astro `<Image>` (webp, 3 widths, lazy), and:
   - `ca` reuses `es`;
   - an empty locale folder falls back to `en`;
   - no screenshots anywhere → CSS phone-frame placeholders.
   Alt texts live in `product.screenshotAlts` (one per screenshot, in order).
   **Dark-mode screenshots** go in `src/assets/screenshots-dark/{en,es}/` with the *same filenames*. When a locale has both sets, both are rendered and CSS shows the one matching the resolved theme (`.shot-light` / `.shot-dark`, driven by the `--shot-*` tokens); the hidden set is `display:none` + `loading="lazy"`, so it isn't fetched. The dark set is read from the same folder the light set resolved to (so `ca` gets `es` dark, and an `en`-fallback locale gets `en` dark). If the dark folder is missing, the light set is used for every theme.
2. **Video** → copy into `public/video/` (`.webm` preferred, `.mp4` fallback; both are picked up) plus an optional `public/video/poster.{jpg,png,webp}`. `DemoVideo.astro` renders a muted, looping, `playsinline`, `preload="none"` `<video>` inside the phone frame; with no file present it shows a placeholder. Files ending in `-dark.<ext>` (e.g. `alterio-demo-dark.webm`, `poster-dark.jpg`) form an optional dark set, switched the same way as screenshots.

Both components are the only place media is referenced — nothing else needs to change. Search for `TODO(media)` to find them.

`public/og.png` (1200×630 social card) is generated by `npm run og` from an inline SVG in `scripts/og-image.mjs`.

## Deploy

- Work on a feature branch (`feat/…`), open a PR, get QA sign-off, then merge. Nothing goes live without QA.
- `site` in `astro.config.mjs` is `https://hackie.dev` — canonical URLs, hreflang alternates, the sitemap and OG URLs all derive from it.

## Design & theming

Dark-first with a light theme. Three states on `<html>`: nothing stamped (follow the OS), `data-theme="dark"`, `data-theme="light"`. The header switch (system / sun / moon, `aria-pressed` buttons) stamps the attribute and persists it in `localStorage.theme`; a ~170-byte inline script in `<head>` re-applies it before first paint (no flash). That switch is the only client JS on the site.

Tokens live in `src/styles/global.css`: the full dark palette on bare `:root`, the light palette repeated under `@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) }` and `:root[data-theme="light"]`, then mapped onto Tailwind via `@theme inline`. Every colour goes through a token — never hard-code a hex in a component.

| Token        | Dark      | Light     | Use                                             |
| ------------ | --------- | --------- | ----------------------------------------------- |
| `bg`         | `#0B0B0C` | `#F6F4EE` | page ground (warm off-white in light)           |
| `surface`    | `#141416` | `#FFFFFF` | cards, header                                   |
| `line`       | `#232326` | `#E3DFD5` | borders, rules                                  |
| `fg`         | `#F5F5F5` | `#141413` | text                                            |
| `muted`      | `#9A9A9A` | `#5C5A54` | secondary text (≥ 6:1 on ground in both)        |
| `lime`       | `#C6FF3D` | `#4A6600` | accent for text/icons/links (≈ 6:1 on light)    |
| `lime-fill`  | `#C6FF3D` | `#C6FF3D` | filled buttons/badges, always with `lime-ink`   |
| `lime-ink`   | `#101400` | `#101400` | text on `lime-fill`                             |

`--shot-light` / `--shot-dark` flip in the same blocks and power the per-theme screenshot/video sets (`.shot-light` / `.shot-dark` utilities). Display type is Instrument Serif Italic (`.display`), body is Inter. `prefers-reduced-motion` disables transitions globally.

## Preview on github.io (before DNS)

The site is bound to `hackie.dev` in Pages settings. To view a build at
`https://xavimorenom.github.io/hackie.dev/` instead, temporarily unset the custom
domain and dispatch a preview build:

```bash
gh api -X PUT repos/XaviMorenoM/hackie.dev/pages -f cname=''          # unset domain
gh workflow run deploy.yml -f preview=true                              # base=/hackie.dev/
# … later, once DNS points at GitHub:
gh api -X PUT repos/XaviMorenoM/hackie.dev/pages -f cname=hackie.dev   # restore domain
gh workflow run deploy.yml                                              # prod build (base=/)
```
