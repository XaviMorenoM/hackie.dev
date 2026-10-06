import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// #25 — red homepage background
//
// The implementation appends a <style is:global> block to
// src/pages/[locale]/index.astro that overrides --t-bg (→ --color-bg →
// html { background-color }) via :root:has([data-testid='home-hero']).
//
// Spec acceptance criteria
//   dark  /en|es|ca/  → html background  rgb(90, 12, 16)   (#5a0c10)
//   light /en|es|ca/  → html background  rgb(254, 202, 202) (#fecaca)
//   /en/alterio/      → unaffected by those rules
//   built HTML        → contains :has([data-testid='home-hero']) selectors
// ---------------------------------------------------------------------------

const HOME_LOCALES = ['en', 'es', 'ca'] as const

// Dark-mode home pages --------------------------------------------------

for (const locale of HOME_LOCALES) {
  test(`#25 dark: /${locale}/ html background is rgb(90,12,16)`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto(`/${locale}/`)
    await expect(page.getByTestId('home-hero')).toBeVisible()
    const bg: string = await page.evaluate(() =>
      getComputedStyle(document.documentElement).backgroundColor,
    )
    expect(bg).toBe('rgb(90, 12, 16)')
  })
}

// Light-mode home pages --------------------------------------------------

for (const locale of HOME_LOCALES) {
  test(`#25 light: /${locale}/ html background is rgb(254,202,202)`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(`/${locale}/`)
    await expect(page.getByTestId('home-hero')).toBeVisible()
    const bg: string = await page.evaluate(() =>
      getComputedStyle(document.documentElement).backgroundColor,
    )
    expect(bg).toBe('rgb(254, 202, 202)')
  })
}

// Other pages unaffected (/en/alterio/) ---------------------------------

test('#25 /en/alterio/ dark: html background is NOT the red value', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/en/alterio/')
  const bg: string = await page.evaluate(() =>
    getComputedStyle(document.documentElement).backgroundColor,
  )
  expect(bg).not.toBe('rgb(90, 12, 16)')
})

test('#25 /en/alterio/ light: html background is NOT the red value', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/en/alterio/')
  const bg: string = await page.evaluate(() =>
    getComputedStyle(document.documentElement).backgroundColor,
  )
  expect(bg).not.toBe('rgb(254, 202, 202)')
})

// Built HTML contains :has selector ------------------------------------

test('#25 built /en/ HTML contains :has([data-testid=\'home-hero\']) CSS rule', async ({ page }) => {
  await page.goto('/en/')
  const hasRule: boolean = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.cssText && rule.cssText.includes("home-hero")) {
            return true
          }
        }
      } catch {
        // cross-origin sheets throw; skip
      }
    }
    return false
  })
  expect(hasRule).toBe(true)
})
