import { test, expect } from '@playwright/test'

test('English landing page loads', async ({ page }) => {
  await page.goto('/en/')
  await expect(page).toHaveTitle(/.+/)
})

test('Spanish landing page loads', async ({ page }) => {
  await page.goto('/es/')
  await expect(page).toHaveTitle(/.+/)
})

test('Catalan landing page loads', async ({ page }) => {
  await page.goto('/ca/')
  await expect(page).toHaveTitle(/.+/)
})

test('Privacy page loads', async ({ page }) => {
  await page.goto('/en/alterio/privacy/')
  await expect(page).toHaveTitle(/.+/)
})
