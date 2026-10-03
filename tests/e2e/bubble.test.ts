import { test, expect } from '@playwright/test'

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
      const bubbleRight = bubbleBox.x + bubbleBox.width

      // bubble must end before the controls begin — no intersection allowed
      expect(bubbleRight).toBeLessThanOrEqual(controlsBox.x)

      // no horizontal scroll: neither element overflows the 375px viewport
      expect(bubbleRight).toBeLessThanOrEqual(375)
      expect(controlsBox.x + controlsBox.width).toBeLessThanOrEqual(375)
    }
  })
}
