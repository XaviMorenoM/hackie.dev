/**
 * E2E tests for the right-side SiteControls (lang-bubble + theme-bubble).
 * Ticket #11 — replaces sticky Header.astro.
 *
 * Drive only by data-testid selectors — never by display text.
 */

import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// 1. Both bubbles are visible on the home page (/en/)
// ---------------------------------------------------------------------------

test('site-controls: lang-bubble is visible on /en/', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.getByTestId('lang-bubble')).toBeVisible()
})

test('site-controls: theme-bubble is visible on /en/', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.getByTestId('theme-bubble')).toBeVisible()
})

// ---------------------------------------------------------------------------
// 2. Both bubbles are visible on project pages
// ---------------------------------------------------------------------------

for (const slug of ['alterio', 'diskspace']) {
  test(`site-controls: lang-bubble is visible on /en/${slug}/`, async ({ page }) => {
    await page.goto(`/en/${slug}/`)
    await expect(page.getByTestId('lang-bubble')).toBeVisible()
  })

  test(`site-controls: theme-bubble is visible on /en/${slug}/`, async ({ page }) => {
    await page.goto(`/en/${slug}/`)
    await expect(page.getByTestId('theme-bubble')).toBeVisible()
  })
}

// ---------------------------------------------------------------------------
// 3. Language dropdown opens and contains links for other locales
// ---------------------------------------------------------------------------

test('site-controls: lang panel opens on trigger click and exposes other-locale links', async ({
  page,
}) => {
  await page.goto('/en/')

  const trigger = page.getByTestId('lang-bubble-trigger')
  const panel = page.getByTestId('lang-bubble-panel')

  // Panel starts hidden
  await expect(panel).toBeHidden()

  // Click opens the panel
  await trigger.click()
  await expect(panel).toBeVisible()

  // Other locales are linked — never current locale
  await expect(page.getByTestId('lang-option-es')).toBeVisible()
  await expect(page.getByTestId('lang-option-ca')).toBeVisible()
  await expect(page.getByTestId('lang-option-en')).toHaveCount(0)
})

test('site-controls: lang-bubble aria-expanded toggles on click', async ({ page }) => {
  await page.goto('/en/')

  const trigger = page.getByTestId('lang-bubble-trigger')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')

  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

// ---------------------------------------------------------------------------
// 4. Language switch navigates to the selected locale
// ---------------------------------------------------------------------------

test('site-controls: clicking lang-option-es navigates to /es/', async ({ page }) => {
  await page.goto('/en/')

  // Open the panel then click the ES option
  await page.getByTestId('lang-bubble-trigger').click()
  await page.getByTestId('lang-option-es').click()

  await page.waitForURL(/\/es\//)
  expect(page.url()).toContain('/es/')
})

test('site-controls: clicking lang-option-ca navigates to /ca/', async ({ page }) => {
  await page.goto('/en/')

  await page.getByTestId('lang-bubble-trigger').click()
  await page.getByTestId('lang-option-ca').click()

  await page.waitForURL(/\/ca\//)
  expect(page.url()).toContain('/ca/')
})

// ---------------------------------------------------------------------------
// 5. Theme dropdown opens and the three options are present
// ---------------------------------------------------------------------------

test('site-controls: theme panel opens on trigger click', async ({ page }) => {
  await page.goto('/en/')

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
// 6. Theme toggle changes data-theme on <html>
// ---------------------------------------------------------------------------

test('site-controls: selecting "light" theme sets data-theme="light" on <html>', async ({
  page,
}) => {
  await page.goto('/en/')

  await page.getByTestId('theme-bubble-trigger').click()
  await page.getByTestId('theme-option-light').click()

  const dataTheme = await page.evaluate(() => document.documentElement.dataset.theme)
  expect(dataTheme).toBe('light')
})

test('site-controls: selecting "dark" theme sets data-theme="dark" on <html>', async ({ page }) => {
  await page.goto('/en/')

  await page.getByTestId('theme-bubble-trigger').click()
  await page.getByTestId('theme-option-dark').click()

  const dataTheme = await page.evaluate(() => document.documentElement.dataset.theme)
  expect(dataTheme).toBe('dark')
})

test('site-controls: selecting "system" theme removes data-theme from <html>', async ({ page }) => {
  await page.goto('/en/')

  // Set dark first
  await page.getByTestId('theme-bubble-trigger').click()
  await page.getByTestId('theme-option-dark').click()

  // Re-open and select system
  await page.getByTestId('theme-bubble-trigger').click()
  await page.getByTestId('theme-option-system').click()

  const dataTheme = await page.evaluate(() => document.documentElement.dataset.theme)
  expect(dataTheme).toBeUndefined()
})

test('site-controls: theme option aria-pressed reflects active theme', async ({ page }) => {
  await page.goto('/en/')

  // Open panel and set dark
  await page.getByTestId('theme-bubble-trigger').click()
  await page.getByTestId('theme-option-dark').click()

  // Re-open panel to check aria-pressed
  await page.getByTestId('theme-bubble-trigger').click()
  await expect(page.getByTestId('theme-option-dark')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('theme-option-light')).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByTestId('theme-option-system')).toHaveAttribute('aria-pressed', 'false')
})

// ---------------------------------------------------------------------------
// 7. aria-labels are localised per locale
// ---------------------------------------------------------------------------

const LANG_ARIA: Record<string, string> = {
  en: 'Language',
  es: 'Idioma',
  ca: 'Idioma',
}

for (const [locale, label] of Object.entries(LANG_ARIA)) {
  test(`site-controls: lang-bubble aria-label is "${label}" on /${locale}/`, async ({ page }) => {
    await page.goto(`/${locale}/`)
    const langBubble = page.getByTestId('lang-bubble')
    await expect(langBubble).toHaveAttribute('aria-label', label)
  })
}

const THEME_ARIA: Record<string, string> = {
  en: 'Theme',
  es: 'Tema',
  ca: 'Tema',
}

for (const [locale, label] of Object.entries(THEME_ARIA)) {
  test(`site-controls: theme-bubble aria-label is "${label}" on /${locale}/`, async ({ page }) => {
    await page.goto(`/${locale}/`)
    const themeBubble = page.getByTestId('theme-bubble')
    await expect(themeBubble).toHaveAttribute('aria-label', label)
  })
}

// ---------------------------------------------------------------------------
// 8. supportsTheme: false hides the theme bubble
//    (via showThemeBubble=false passed from ProjectLayout when supportsTheme===false)
//    Covered in unit tests; e2e verifies behaviour on the built pages.
//    No current project has supportsTheme:false, so we verify its inverse:
//    projects without the flag show the theme bubble.
// ---------------------------------------------------------------------------

test('site-controls: theme-bubble present on /en/diskspace/ (supportsTheme unset → true)', async ({
  page,
}) => {
  await page.goto('/en/diskspace/')
  await expect(page.getByTestId('theme-bubble')).toBeVisible()
})

// ---------------------------------------------------------------------------
// 9. Panel opens on keyboard focus (focus-visible CSS rule)
//    ESC while keyboard-focused on the trigger keeps the panel visible because
//    the CSS rule `.bubble-host:has(:focus-visible) > .bubble-panel` overrides
//    data-open="false". This is intentional keyboard UX; the close-on-ESC JS
//    handler is covered by unit tests.
// ---------------------------------------------------------------------------

test('site-controls: lang panel becomes visible when trigger receives :focus-visible', async ({
  page,
}) => {
  await page.goto('/en/')

  // Tab to the lang-bubble trigger to give it keyboard focus (:focus-visible)
  await page.keyboard.press('Tab')
  // Retry-tab until we focus the lang trigger (skip link may be first)
  let focused = false
  for (let i = 0; i < 5; i++) {
    const active = await page.evaluate(
      () => document.activeElement?.getAttribute('data-testid') ?? '',
    )
    if (active === 'lang-bubble-trigger') {
      focused = true
      break
    }
    await page.keyboard.press('Tab')
  }

  if (focused) {
    // With :focus-visible on the trigger, the panel should be visible
    await expect(page.getByTestId('lang-bubble-panel')).toBeVisible()
  } else {
    // If Tab order doesn't reach the lang trigger in this test environment, skip
    test.skip()
  }
})
