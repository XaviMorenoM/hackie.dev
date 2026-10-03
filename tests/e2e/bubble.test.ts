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

const SWEEP_WIDTHS = [375, 520, 600, 640, 700, 768, 1280]
const SWEEP_FONT_SIZES = [16, 24, 32]
const SWEEP_LOCALES = ['en', 'ca'] as const

for (const locale of SWEEP_LOCALES) {
  for (const width of SWEEP_WIDTHS) {
    for (const fontSize of SWEEP_FONT_SIZES) {
      test(`bubble/controls: no overlap, no overflow — ${width}px/${fontSize}px root — /${locale}/`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${locale}/`)
        await page.addStyleTag({ content: `html { font-size: ${fontSize}px !important; }` })
        await page.waitForLoadState('networkidle')

        const bubbleBox = await page.getByTestId('site-bubble').boundingBox()
        const langBox = await page.getByTestId('lang-switcher').boundingBox()
        const themeBox = await page.getByTestId('theme-switch').boundingBox()

        expect(bubbleBox).not.toBeNull()

        if (bubbleBox) {
          // bubble itself must not overflow the viewport
          expect(
            bubbleBox.x,
            `bubble left off-screen at ${width}px/${fontSize}px`,
          ).toBeGreaterThanOrEqual(0)
          expect(
            bubbleBox.x + bubbleBox.width,
            `bubble right overflows at ${width}px/${fontSize}px`,
          ).toBeLessThanOrEqual(width)
        }

        for (const [name, controlBox] of [
          ['lang-switcher', langBox],
          ['theme-switch', themeBox],
        ] as const) {
          if (!controlBox) continue

          // control must not overflow viewport and must have minimum 16px left gutter
          expect(
            controlBox.x,
            `${name} left off-screen at ${width}px/${fontSize}px`,
          ).toBeGreaterThanOrEqual(16)
          expect(
            controlBox.x + controlBox.width,
            `${name} right overflows at ${width}px/${fontSize}px`,
          ).toBeLessThanOrEqual(width)

          if (bubbleBox) {
            const xOverlap =
              bubbleBox.x + bubbleBox.width > controlBox.x &&
              controlBox.x + controlBox.width > bubbleBox.x
            const yOverlap =
              bubbleBox.y + bubbleBox.height > controlBox.y &&
              controlBox.y + controlBox.height > bubbleBox.y
            expect(
              xOverlap && yOverlap,
              `bubble must not visually overlap ${name} at ${width}px/${fontSize}px on /${locale}/`,
            ).toBe(false)
          }
        }
      })
    }
  }
}

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
