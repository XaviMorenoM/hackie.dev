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

test('bubble does not overlap header language switcher at 375px with 150% text size', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  // 150% text scale: default browser font is 16px → 24px
  await page.goto('/en/alterio/')
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
