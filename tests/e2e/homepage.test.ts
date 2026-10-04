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

// ---------------------------------------------------------------------------
// #13 — Project card covers + hover lift
// ---------------------------------------------------------------------------

test('#13: /en/ has 2 project cards, both with data-has-cover="true"', async ({ page }) => {
  await page.goto('/en/')
  const cards = page.locator('[data-testid^="project-card-"]')
  await expect(cards).toHaveCount(2)
  for (const card of await cards.all()) {
    await expect(card).toHaveAttribute('data-has-cover', 'true')
  }
})

test('#13: card-cover img is visible and has a natural width > 0', async ({ page }) => {
  await page.goto('/en/')
  const img = page.locator('[data-testid="card-cover"] img').first()
  await expect(img).toBeVisible()
  const src: string = (await img.getAttribute('src')) ?? ''
  expect(src).toContain('/_astro/')
  const naturalWidth: number = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
  expect(naturalWidth).toBeGreaterThan(0)
})

test('#13: card transform is none at rest', async ({ page }) => {
  await page.goto('/en/')
  const card = page.locator('[data-testid="project-card-alterio"]')
  const transform: string = await card.evaluate((el) => getComputedStyle(el).transform)
  expect(transform).toBe('none')
})

test('#13: focused card has translateY(-4px) transform', async ({ page }) => {
  await page.goto('/en/')
  // Tab until project-card-alterio is focused (up to 30 presses)
  let focused = false
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    focused = await page.evaluate(
      () =>
        (document.activeElement as HTMLElement | null)?.dataset.testid === 'project-card-alterio',
    )
    if (focused) break
  }
  expect(focused).toBe(true)
  const transform: string = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="project-card-alterio"]') as HTMLElement
    return getComputedStyle(el).transform
  })
  expect(transform).toBe('matrix(1, 0, 0, 1, 0, -4)')
})

test('#13: reduced motion — focused card has transform none', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/en/')
  let focused = false
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    focused = await page.evaluate(
      () =>
        (document.activeElement as HTMLElement | null)?.dataset.testid === 'project-card-alterio',
    )
    if (focused) break
  }
  expect(focused).toBe(true)
  const transform: string = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="project-card-alterio"]') as HTMLElement
    return getComputedStyle(el).transform
  })
  expect(transform).toBe('none')
})
