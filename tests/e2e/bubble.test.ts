/**
 * E2E tests for the LiquidGlassBubble component (ticket #5).
 *
 * Covers:
 * - Bubble appears exactly once on every sitemap URL
 * - aria-current semantics on directory vs project pages
 * - No visual overlap with header controls at 375 px / 150% text scale (all locales)
 * - No licdn.com image references
 * - Skip link layers above the bubble
 *
 * Drive only by data-testid selectors — never by display text.
 */

import { test, expect } from '@playwright/test'

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
// 2. aria-current semantics (implementer's authoritative assertions)
// ---------------------------------------------------------------------------

test('bubble-projects has aria-current="page" on the directory page', async ({ page }) => {
  await page.goto('/en/')
  const link = page.getByTestId('bubble-projects')
  await expect(link).toHaveAttribute('aria-current', 'page')
})

test('bubble-projects has aria-current="true" on a project page', async ({ page }) => {
  await page.goto('/en/alterio/')
  const link = page.getByTestId('bubble-projects')
  await expect(link).toHaveAttribute('aria-current', 'true')
})

// ---------------------------------------------------------------------------
// 3. Non-overlap at 375 px / 150% text scale — all three locales
// ---------------------------------------------------------------------------

for (const locale of ['en', 'es', 'ca'] as const) {
  test(`bubble does not overlap header controls at 375px/150% text — /${locale}/`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    // 150% text scale: default browser font is 16px → 24px
    await page.goto(`/${locale}/`)
    await page.addStyleTag({ content: 'html { font-size: 24px !important; }' })
    await page.waitForLoadState('networkidle')

    const bubble = page.getByTestId('site-bubble')
    const controls = page.getByTestId('lang-switcher')

    const bubbleBox = await bubble.boundingBox()
    const controlsBox = await controls.boundingBox()

    expect(bubbleBox).not.toBeNull()
    expect(controlsBox).not.toBeNull()

    if (bubbleBox && controlsBox) {
      const xOverlap =
        bubbleBox.x + bubbleBox.width > controlsBox.x &&
        controlsBox.x + controlsBox.width > bubbleBox.x
      const yOverlap =
        bubbleBox.y + bubbleBox.height > controlsBox.y &&
        controlsBox.y + controlsBox.height > bubbleBox.y
      expect(
        xOverlap && yOverlap,
        `bubble must not visually overlap lang-switcher on /${locale}/`,
      ).toBe(false)

      // no horizontal scroll: neither element overflows the 375px viewport
      expect(bubbleBox.x + bubbleBox.width).toBeLessThanOrEqual(375)
      expect(controlsBox.x + controlsBox.width).toBeLessThanOrEqual(375)
    }
  })
}

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
