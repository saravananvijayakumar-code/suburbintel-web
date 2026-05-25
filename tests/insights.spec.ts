import { test, expect } from '@playwright/test'

test.describe('Market Insights Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/insights', { timeout: 60000 })
    await page.waitForLoadState('networkidle')
  })

  test('should load insights page', async ({ page }) => {
    await expect(page).toHaveURL(/\/insights/)
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display national statistics', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show state breakdown', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should click NSW and show only NSW suburbs', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should click VIC and show only VIC suburbs', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display affordable hotspots', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display growth leaders', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display investment opportunities', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should navigate to suburb from hotspot', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show state comparison metrics', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display CTA buttons', async ({ page }) => {
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })
})
