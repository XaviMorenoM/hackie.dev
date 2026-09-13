# hackie.dev — team brief

Owner: Xavi Moreno (GitHub `XaviMorenoM`, email xavier.moreno.martinez@gmail.com).
Lead: Claude (this session). Style: extremely concise, fragments OK.

## Goal
`hackie.dev` = landing hub for Xavi's indie products. First product: the iOS gym
tracker (repo `/Users/xavi/projects/gym-tracker`), public name **Alterio** for now —
MUST live in one constant (`src/config.ts` → `APP_NAME`) so it's trivial to rename.
Site must ship everything App Store Connect needs: marketing URL, privacy policy URL,
support URL. Languages: **en (default), es, ca**.

## Architecture
- Repo: `XaviMorenoM/hackie.dev` (public). Local: `/Users/xavi/projects/hackie.dev`.
- Astro 5, static output, Tailwind (v4 via `@tailwindcss/vite`), no UI framework.
- i18n: `astro.config.mjs` `i18n: { defaultLocale: 'en', locales: ['en','es','ca'], routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true } }`.
  Every page exists under `/en/`, `/es/`, `/ca/`. `/` redirects to `/en/`.
  Strings in `src/i18n/{en,es,ca}.ts` (typed, same keys). Hreflang alternates in `<head>`.
- Routes (per locale):
  - `/`            hub: hackie.dev intro + product cards (Alterio only for now).
  - `/alterio`     product landing: hero, features, screenshots carousel/grid, demo video, CTA.
  - `/alterio/privacy`  privacy policy.
  - `/alterio/support`  support: FAQ + contact mailto.
- `src/config.ts`: `APP_NAME`, `APP_SLUG` ('alterio'), `SITE_URL` ('https://hackie.dev'),
  `CONTACT_EMAIL`, `DEVELOPER_NAME`, `APP_STORE_URL` (null until live → CTA says "Coming soon"),
  `TESTFLIGHT_URL` (null). Product slug in routes may stay `alterio` — only display name is dynamic.
- Deploy: GitHub Actions `withastro/action@v3` → `actions/deploy-pages`. `public/CNAME` = `hackie.dev`.
  `site: 'https://hackie.dev'` in astro config. Sitemap via `@astrojs/sitemap`.
- Media raw drops (from media agent): `media/screenshots/{en,es}/*.png`, `media/video/*.mp4|webm`.
  Web builder copies/optimizes into `src/assets/` (Astro `<Image>`) and `public/video/`.
  ca locale reuses es screenshots.

## Design direction
Dark-first, gym-friendly, minimal. The app's DS: lime accent, serif-italic display
(Instrument Serif Italic) + sans body. Mirror it: lime accent (`#C6FF3D`-ish), near-black
bg, white text, serif-italic headings. Phone mockup frames around screenshots.
Fast: no heavy JS, Lighthouse ≥ 95 perf/a11y/SEO.

## Alterio — product facts (from code/docs; don't invent)
- iOS 18+, SwiftUI, local-first (SwiftData), iCloud sync (CloudKit private DB).
- Workout logging: routines or empty workout, sets w/ weight+reps, bodyweight + added
  load, rest timer, keyboard add-ons, resume/discard in-progress workout, smart exercise
  search, session detail, editable completed workouts.
- Routines: Push/Pull/Legs style, muscle heatmap weighted by volume load.
- Progress: charts with scrub, body-weight detail, PRs.
- Exercise library (curated catalog).
- Apple Health: reads workouts + heart rate, writes completed workouts. Sign in with Apple.
- Free tier now; paywall deferred (don't advertise pricing).
- Units kg/lb, en+es in-app.

## Privacy policy facts (author accurately, plain language, all 3 langs)
- Data stored on device; optionally synced to the user's own iCloud (Apple CloudKit, private DB). Developer has no server, no access to user data.
- Sign in with Apple: name/email only as provided by Apple; used only to identify account.
- Apple Health (HealthKit): reads workouts/heart rate, writes workouts. Health data never leaves the device except via the user's iCloud; never shared with third parties; never used for advertising or sold. (Apple requires this wording.)
- Diagnostics: Apple MetricKit crash/perf reports (aggregated, Apple-provided). No third-party analytics, no ads, no trackers.
- Deletion: delete the app + remove iCloud data via iOS Settings → Apple ID → iCloud → Manage Storage. Contact email for requests.
- Children: not directed at under-13s.
- Effective date: 2026-09-13. Contact: CONTACT_EMAIL.

## Gate
NOTHING goes live without QA approval. "Live" = push to `main` (auto-deploys) and DNS cutover.
Work on branch `feat/landing`. QA reviews build output + checklist, then Lead merges.
