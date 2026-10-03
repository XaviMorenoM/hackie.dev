import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Section presence — /en/
// ---------------------------------------------------------------------------

test('home-hero section is present on /en/', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.getByTestId('home-hero')).toBeVisible()
})

test('home-work section is present on /en/ with 2 project cards', async ({ page }) => {
  await page.goto('/en/')
  const section = page.getByTestId('home-work')
  await expect(section).toBeVisible()
  const cards = section.locator('[data-hover-border]')
  await expect(cards).toHaveCount(2)
})

test('home-how section is present on /en/', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.getByTestId('home-how')).toBeVisible()
})

test('home-contact section is present on /en/', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.getByTestId('home-contact')).toBeVisible()
})

// ---------------------------------------------------------------------------
// howSteps list — exactly 3 items
// ---------------------------------------------------------------------------

test('home-how section has exactly 3 step items on /en/', async ({ page }) => {
  await page.goto('/en/')
  const section = page.getByTestId('home-how')
  const steps = section.locator('ol > li')
  await expect(steps).toHaveCount(3)
})

// ---------------------------------------------------------------------------
// Locale — hero heading contains "Xavi Moreno" in all locales
// ---------------------------------------------------------------------------

for (const locale of ['en', 'es', 'ca'] as const) {
  test(`h1 contains "Xavi Moreno" on /${locale}/`, async ({ page }) => {
    await page.goto(`/${locale}/`)
    const hero = page.getByTestId('home-hero')
    await expect(hero.locator('h1')).toContainText('Xavi Moreno')
  })
}

// ---------------------------------------------------------------------------
// Locale — /ca/ howHeading is "Com treballo"
// ---------------------------------------------------------------------------

test('home-how heading is "Com treballo" on /ca/', async ({ page }) => {
  await page.goto('/ca/')
  const section = page.getByTestId('home-how')
  await expect(section.locator('h2')).toHaveText('Com treballo')
})

// ---------------------------------------------------------------------------
// Contact links
// ---------------------------------------------------------------------------

test('contact section has a mailto: email link on /en/', async ({ page }) => {
  await page.goto('/en/')
  const section = page.getByTestId('home-contact')
  const emailLink = section.locator('a[href^="mailto:"]')
  await expect(emailLink).toBeVisible()
})

test('contact section has a LinkedIn link on /en/', async ({ page }) => {
  await page.goto('/en/')
  const section = page.getByTestId('home-contact')
  const linkedInLink = section.locator('a[href*="linkedin.com"]')
  await expect(linkedInLink).toBeVisible()
})

// ---------------------------------------------------------------------------
// Bubble (#5 dependency) — site-bubble is present on /en/
// ---------------------------------------------------------------------------

test('site-bubble is present on /en/', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.getByTestId('site-bubble')).toBeVisible()
})

// ---------------------------------------------------------------------------
// Portfolio footer variant — /en/ directory page
// ---------------------------------------------------------------------------

test('footer on /en/ shows portfolio tagline, not project nav links', async ({ page }) => {
  await page.goto('/en/')
  const footer = page.locator('footer')
  // Portfolio variant suppresses the Privacy/Support <nav>
  await expect(footer.locator('nav')).toHaveCount(0)
  // Portfolio variant shows the portfolioTagline byline
  await expect(footer.locator('p').first()).toContainText('Xavi Moreno')
})

// ---------------------------------------------------------------------------
// Responsive — no horizontal scrollbar at 375×812 on /en/
// ---------------------------------------------------------------------------

test('no horizontal scrollbar at 375×812 on /en/', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/en/')
  const scrollWidth: number = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(scrollWidth).toBeLessThanOrEqual(375)
})
