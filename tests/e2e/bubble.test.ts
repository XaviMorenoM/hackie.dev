/**
 * E2E tests for the LiquidGlassBubble component (ticket #5).
 *
 * Spec: the bubble must appear exactly once on every page in the sitemap,
 * must not visually overlap header controls at 375 px, must carry the correct
 * aria-current state, must not reference the licdn.com CDN, and the skip link
 * must layer above it.
 *
 * Drive only by data-testid selectors — never by display text.
 */

import { test, expect, type Page } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All paths served by the static site (extracted from the sitemap). */
const SITEMAP_PATHS = [
  '/ca/',
  '/ca/alterio/',
  '/ca/alterio/privacy/',
  '/ca/alterio/support/',
  '/ca/diskspace/',
  '/en/',
  '/en/alterio/',
  '/en/alterio/privacy/',
  '/en/alterio/support/',
  '/en/diskspace/',
  '/es/',
  '/es/alterio/',
  '/es/alterio/privacy/',
  '/es/alterio/support/',
  '/es/diskspace/',
]

async function getBoundingRect(page: Page, testId: string) {
  return page.getByTestId(testId).boundingBox()
}

function rectsOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

// ---------------------------------------------------------------------------
// 1. Bubble present exactly once on every sitemap URL
// ---------------------------------------------------------------------------

for (const path of SITEMAP_PATHS) {
  test(`bubble: exactly one [data-testid="site-bubble"] on ${path}`, async ({ page }) => {
    await page.goto(path)
    const bubbles = page.getByTestId('site-bubble')
    await expect(bubbles).toHaveCount(1)
  })
}

// ---------------------------------------------------------------------------
// 2. No visual overlap with lang-switcher or theme-switch at 375×812
// ---------------------------------------------------------------------------

test('bubble: does not overlap lang-switcher or theme-switch at 375×812', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/en/')

  const bubbleBox = await getBoundingRect(page, 'site-bubble')
  expect(bubbleBox, 'site-bubble must be visible').not.toBeNull()

  // lang-switcher and theme-switch are inside the header, which is present on
  // home pages (noHeader is false for index pages).
  const langBox = await getBoundingRect(page, 'lang-switcher')
  const themeBox = await getBoundingRect(page, 'theme-switch')

  if (langBox) {
    expect(
      rectsOverlap(bubbleBox!, langBox),
      'bubble must not visually overlap lang-switcher',
    ).toBe(false)
  }

  if (themeBox) {
    expect(
      rectsOverlap(bubbleBox!, themeBox),
      'bubble must not visually overlap theme-switch',
    ).toBe(false)
  }
})

// ---------------------------------------------------------------------------
// 3. aria-current on bubble-projects link
// ---------------------------------------------------------------------------

test('bubble: bubble-projects does NOT have aria-current on /en/', async ({ page }) => {
  await page.goto('/en/')
  const projectsLink = page.getByTestId('bubble-projects')
  // On the home page, stripLocale('/en/') === '/' so aria-current="page" SHOULD be set.
  // But per spec we assert it does NOT have aria-current on /en/.
  // Looking at the implementation: stripLocale(pathname) === '/' triggers aria-current.
  // The spec says: on /en/ the projects link does NOT have aria-current="page".
  // That implies the home page (/) is NOT considered a "project page" for this link.
  // Re-reading the component: aria-current is set when stripLocale(pathname) === '/'
  // which means the home/index page. The spec says it should NOT have aria-current there.
  // This is a contradiction — but we validate against the spec, not the implementation.
  // We assert per the spec's exact words.
  await expect(projectsLink).not.toHaveAttribute('aria-current', 'page')
})

test('bubble: bubble-projects DOES have aria-current="page" on /en/alterio/', async ({ page }) => {
  await page.goto('/en/alterio/')
  const projectsLink = page.getByTestId('bubble-projects')
  await expect(projectsLink).toHaveAttribute('aria-current', 'page')
})

// ---------------------------------------------------------------------------
// 4. No licdn.com image sources on any page
// ---------------------------------------------------------------------------

test('bubble: no img src containing "licdn.com" on any sitemap page', async ({ page }) => {
  for (const path of SITEMAP_PATHS) {
    await page.goto(path)
    const licdnImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .map((img) => img.src)
        .filter((src) => src.includes('licdn.com'))
    })
    expect(licdnImages, `${path} must not have any img src containing licdn.com`).toHaveLength(0)
  }
})

// ---------------------------------------------------------------------------
// 5. Skip link appears above the bubble (z-index check)
// ---------------------------------------------------------------------------

test('bubble: skip link z-index is above bubble z-index', async ({ page }) => {
  await page.goto('/en/')

  // Tab from body to trigger the skip link
  await page.keyboard.press('Tab')

  // The skip link becomes visible on focus; get its computed z-index.
  const skipLinkZ = await page.evaluate(() => {
    const el = document.querySelector('a[href="#main"]')
    if (!el) return null
    return parseInt(window.getComputedStyle(el).zIndex, 10) || null
  })

  const bubbleZ = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="site-bubble"]')
    if (!el) return null
    return parseInt(window.getComputedStyle(el).zIndex, 10) || null
  })

  expect(skipLinkZ, 'skip link must have a numeric z-index').not.toBeNull()
  expect(bubbleZ, 'bubble must have a numeric z-index').not.toBeNull()
  expect(skipLinkZ!).toBeGreaterThan(bubbleZ!)
})
