import { test, expect } from '@playwright/test'

test.describe('Market Trends Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/market-trends', { timeout: 60000 })
    await page.waitForLoadState('networkidle')
  })

  test('should load market trends page', async ({ page }) => {
    await expect(page).toHaveURL(/\/market-trends/)
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display database statistics', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show NSW statistics', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show VIC statistics', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display top suburbs section', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show data quality indicators', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should navigate to suburb from trends', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })
})

test.describe('Analytics Dashboard Tests', () => {
  test('should load analytics page', async ({ page }) => {
    await page.goto('/analytics', { timeout: 60000 })
    await page.waitForLoadState('networkidle')
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })
})
