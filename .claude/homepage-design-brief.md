# hackie.dev Homepage Design Brief

## The Problem

The current homepage borrows the product-page aesthetic (big Instrument Serif italic tagline) and applies it to a portfolio index, where it doesn't belong. Big serif italic is a _product_ voice — aggressive, single-minded. A portfolio needs a _personal_ voice — confident, human, editorial. The tiny "Xavi Moreno · Barcelona" byline above a giant headline inverts the hierarchy: the _person_ is the product here.

## Hierarchy

1. **Who** — Xavi Moreno (the person, the brand)
2. **What** — Makes apps and tools with AI
3. **Where** — Barcelona
4. **Work** — The projects

## Hero Section

Left-aligned, not centred. Centred feels like a marketing landing page. Left-aligned feels editorial — like a byline on a magazine feature.

```html
<section max-w-5xl px-5 pt-32 pb-20 sm:pt-40>
  <!-- Name: the hero -->
  <h1 text-5xl font-bold tracking-tight text-fg sm:text-6xl lg:text-7xl>
    Xavi Moreno<span text-lime>.</span>
  </h1>

  <!-- What: one sentence, no serif, readable -->
  <p mt-5 max-w-xl text-xl text-muted sm:text-2xl>
    {t.directory.intro}
  </p>

  <!-- Meta: lime rule + two facts -->
  <div mt-8 flex items-center gap-3>
    <span h-px w-6 bg-lime>            ← the lime accent moment — one horizontal rule
    <span text-sm text-muted>Barcelona</span>
    <span text-lime>·</span>
    <span text-sm text-muted>{t.directory.bio}</span>
  </div>
</section>
```

**Typography:**

- Name: `font-sans font-bold tracking-tight` — Inter heavy. NOT Instrument Serif. The person's name should feel grounded and strong.
- Period: `text-lime` — inherits the hackie.dev. brand mark from the header.
- Tagline: `text-xl text-muted font-sans` — descriptive, comfortable, muted. No italic.
- Meta line: `text-sm text-muted` — lightest weight. The lime rule draws the eye.

**Lime usage:** One moment only — the period on the name, the bullet between meta items, the rule. Not on headings. Not as fills. Restraint makes it land.

## Projects Section

```html
<section max-w-5xl px-5 pb-28>
  <p class="eyebrow mb-8">{t.directory.work}</p>
  ← lime eyebrow utility
  <div class="{gridClass}">{cards}</div>
</section>
```

`gridClass`: `'grid gap-5 max-w-xs'` when 1 project, `'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'` otherwise. A lone card at full width looks accidental; capped at max-w-xs it looks intentional (a "featured" treatment).

## Card Design

No emoji icon box. The project name and tagline are the card. Clean.

```
┌─────────────────────────────────┐
│                                  │
│  Alterio                         │  ← text-base font-semibold
│  Log the set. Get back to        │  ← text-sm text-muted leading-relaxed
│  lifting.                        │
│                                  │
│  ──────────────────────────────  │  ← border-t border-line
│  [iOS]                      →   │  ← badges left, arrow right (hover only)
└─────────────────────────────────┘
```

On hover:

- Card border turns to project accent colour
- Card lifts 1px
- Arrow fades in on the right
- Subtle shadow

**No emoji, no icon box, no top-edge glow.** The accent appears only on the border on hover — one clean moment.

## New i18n Keys

- `directory.work` — section heading ("Work" / "Proyectos" / "Projectes")
- `directory.bio` — short bio label ("indie developer" / "desarrollador indie" / "desenvolupador indie")

Keep personal names (Xavi Moreno) and location (Barcelona) hardcoded — they don't need translation.

## What NOT To Do

- ❌ Don't use `display` (Instrument Serif italic) for the name — that's a product tagline font
- ❌ Don't centre the hero — centred hero + left-aligned card grid looks schizophrenic
- ❌ Don't put lime on every accent element — one use per section maximum
- ❌ Don't use emoji icons in cards — they read as placeholder content
- ❌ Don't try to fake a multi-column grid with 1 card — acknowledge it with a constrained max-width
- ❌ Don't add animated gradients or glow effects on the hero — it competes with the LiquidGlassBubble
