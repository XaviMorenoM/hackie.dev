/**
 * E2E regression tests for the design-system page and atomic component hierarchy.
 *
 * Covers:
 * - Design-system page renders in all three locales (data-testid="design-system-page")
 * - Page is noindex (dev-only guard)
 * - All token sections are present (via stable aria-labelledby ids)
 * - New atom components (Badge, Divider) render within the page
 * - LiquidGlassBubble (site-bubble) still appears on the design-system page
 *   after the Divider atom was extracted from it
 * - SiteControls (lang-bubble + theme-bubble) still appear after LangSelector
 *   + ThemeSelector extraction
 * - No horizontal overflow at 375px (responsive regression)
 *
 * Drive only by data-testid selectors and stable IDs — never by display text.
 */

import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// 1. Root element present in all three locales
// ---------------------------------------------------------------------------

for (const locale of ['en', 'es', 'ca'] as const) {
  test(`design-system: data-testid="design-system-page" present on /${locale}/design-system/`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/design-system/`)
    await expect(page.getByTestId('design-system-page')).toBeVisible()
  })
}

// ---------------------------------------------------------------------------
// 2. Page is noindex (dev-only; must not appear in production crawler)
// ---------------------------------------------------------------------------

test('design-system: page has noindex meta tag', async ({ page }) => {
  await page.goto('/en/design-system/')
  const noindex = await page.evaluate(() => {
    const robots = document.querySelector('meta[name="robots"]')
    return robots?.getAttribute('content') ?? ''
  })
  expect(noindex).toContain('noindex')
})

// ---------------------------------------------------------------------------
// 3. Token sections present (stable aria-labelledby IDs, not display text)
// ---------------------------------------------------------------------------

const SECTION_IDS = [
  'ds-colors-h',
  'ds-type-h',
  'ds-shadows-h',
  'ds-glass-h',
  'ds-anim-h',
  'ds-divider-h',
  'ds-badge-h',
  'ds-icons-h',
] as const

for (const id of SECTION_IDS) {
  test(`design-system: section[aria-labelledby="${id}"] is present on /en/design-system/`, async ({
    page,
  }) => {
    await page.goto('/en/design-system/')
    const section = page.locator(`[aria-labelledby="${id}"]`)
    await expect(section).toBeVisible()
  })
}

// ---------------------------------------------------------------------------
// 4. Badge atom — at least one .badge element per variant is rendered
// ---------------------------------------------------------------------------

test('design-system: badge--outline, badge--filled, badge--accent elements rendered', async ({
  page,
}) => {
  await page.goto('/en/design-system/')
  const dsPage = page.getByTestId('design-system-page')

  await expect(dsPage.locator('.badge--outline').first()).toBeVisible()
  await expect(dsPage.locator('.badge--filled').first()).toBeVisible()
  await expect(dsPage.locator('.badge--accent').first()).toBeVisible()
})

// ---------------------------------------------------------------------------
// 5. Divider atom — both orientations render in the divider section
// ---------------------------------------------------------------------------

test('design-system: divider--v and divider--h elements rendered in divider section', async ({
  page,
}) => {
  await page.goto('/en/design-system/')
  const section = page.locator('[aria-labelledby="ds-divider-h"]')

  await expect(section.locator('.divider--v')).toBeVisible()
  await expect(section.locator('.divider--h')).toBeVisible()
})

// ---------------------------------------------------------------------------
// 6. LiquidGlassBubble regression — site-bubble present on design-system page
//    (after Divider atom was extracted from it)
// ---------------------------------------------------------------------------

test('design-system: site-bubble is present on /en/design-system/', async ({ page }) => {
  await page.goto('/en/design-system/')
  await expect(page.getByTestId('site-bubble')).toBeVisible()
})

test('design-system: site-bubble contains the bubble-projects link', async ({ page }) => {
  await page.goto('/en/design-system/')
  const bubble = page.getByTestId('site-bubble')
  await expect(bubble.getByTestId('bubble-projects')).toBeVisible()
})

test('design-system: site-bubble contains the bubble-profile link', async ({ page }) => {
  await page.goto('/en/design-system/')
  const bubble = page.getByTestId('site-bubble')
  await expect(bubble.getByTestId('bubble-profile')).toBeVisible()
})

// The Divider inside LiquidGlassBubble must still render
test('design-system: site-bubble contains a divider between nav and profile', async ({ page }) => {
  await page.goto('/en/design-system/')
  const bubble = page.getByTestId('site-bubble')
  await expect(bubble.locator('.divider--v')).toBeVisible()
})

// ---------------------------------------------------------------------------
// 7. SiteControls regression — LangSelector + ThemeSelector extraction
// ---------------------------------------------------------------------------

test('design-system: lang-bubble is visible on /en/design-system/', async ({ page }) => {
  await page.goto('/en/design-system/')
  await expect(page.getByTestId('lang-bubble')).toBeVisible()
})

test('design-system: theme-bubble is visible on /en/design-system/', async ({ page }) => {
  await page.goto('/en/design-system/')
  await expect(page.getByTestId('theme-bubble')).toBeVisible()
})

test('design-system: lang panel opens and exposes other-locale links on /en/design-system/', async ({
  page,
}) => {
  await page.goto('/en/design-system/')

  const trigger = page.getByTestId('lang-bubble-trigger')
  const panel = page.getByTestId('lang-bubble-panel')

  await expect(panel).toBeHidden()

  await trigger.click()
  await expect(panel).toBeVisible()

  await expect(page.getByTestId('lang-option-es')).toBeVisible()
  await expect(page.getByTestId('lang-option-ca')).toBeVisible()
  // Current locale is never shown
  await expect(page.getByTestId('lang-option-en')).toHaveCount(0)
})

test('design-system: theme panel opens and exposes all three theme options', async ({ page }) => {
  await page.goto('/en/design-system/')

  const trigger = page.getByTestId('theme-bubble-trigger')
  const panel = page.getByTestId('theme-bubble-panel')

  await expect(panel).toBeHidden()

  await trigger.click()
  await expect(panel).toBeVisible()

  await expect(page.getByTestId('theme-option-system')).toBeVisible()
  await expect(page.getByTestId('theme-option-light')).toBeVisible()
  await expect(page.getByTestId('theme-option-dark')).toBeVisible()
})

// ---------------------------------------------------------------------------
// 8. Responsive — no horizontal scrollbar at 375px
// ---------------------------------------------------------------------------

test('design-system: no horizontal overflow at 375px on /en/design-system/', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/en/design-system/')
  const scrollWidth: number = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(scrollWidth).toBeLessThanOrEqual(375)
})
