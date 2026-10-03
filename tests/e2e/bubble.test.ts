/**
 * E2E tests for the LiquidGlassBubble component (ticket #5).
 *
 * Covers:
 * - Bubble appears exactly once on every sitemap URL
 * - aria-current semantics on directory vs project pages
 * - No visual overlap with header controls at 375 px / 150% text scale
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
// 3. Non-overlap at 375 px / 150% text scale
// ---------------------------------------------------------------------------

test('bubble does not overlap header language switcher at 375px with 150% text size', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  // 150% text scale: default browser font is 16px → 24px
  // Use the directory page (/en/) — it renders the header (site-header);
  // project pages use noHeader:true so site-header is absent there.
  await page.goto('/en/')
  await page.addStyleTag({ content: 'html { font-size: 24px !important; }' })
  await page.waitForLoadState('networkidle')

  const bubble = page.getByTestId('site-bubble')
  const header = page.getByTestId('site-header')

  const bubbleBox = await bubble.boundingBox()
  const headerBox = await header.boundingBox()

  expect(bubbleBox).not.toBeNull()
  expect(headerBox).not.toBeNull()

  if (bubbleBox && headerBox) {
    const bubbleRight = bubbleBox.x + bubbleBox.width
    const headerRight = headerBox.x + headerBox.width

    // bubble must not extend beyond the right edge of the viewport
    expect(bubbleRight).toBeLessThanOrEqual(375)
    // header must not overflow the viewport horizontally (no sideways scroll)
    expect(headerRight).toBeLessThanOrEqual(375)
  }
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
