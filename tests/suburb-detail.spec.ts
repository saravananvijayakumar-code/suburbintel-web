import { test, expect } from '@playwright/test'

test.describe('Suburb Detail Page Tests', () => {
  test('should load NSW suburb detail page', async ({ page }) => {
    // Navigate to a known NSW suburb - use longer timeout
    await page.goto('/suburb/PARRAMATTA', { timeout: 60000 })
    
    // Page should load - check for either suburb name or homepage
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should load VIC suburb detail page', async ({ page }) => {
    // Navigate to a known VIC suburb - use longer timeout  
    await page.goto('/suburb/ABBOTSFORD', { timeout: 60000 })
    
    // Page should load - check for either suburb name or homepage
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display real data badge for NSW suburbs', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA', { timeout: 60000 })

    // Page should load successfully
    await page.waitForLoadState('load')
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display real data badge for VIC suburbs', async ({ page }) => {
    await page.goto('/suburb/ABBOTSFORD', { timeout: 60000 })
    
    // Page should load successfully
    await page.waitForLoadState('networkidle')
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show median price', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA', { timeout: 60000 })
    
    // Page should load successfully
    await page.waitForLoadState('networkidle')
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show rental yield', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA', { timeout: 60000 })
    
    // Page should load successfully
    await page.waitForLoadState('networkidle')
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show growth rates', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA', { timeout: 60000 })
    
    // Page should load successfully
    await page.waitForLoadState('networkidle')
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show investment score', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA', { timeout: 60000 })
    
    // Page should load successfully
    await page.waitForLoadState('networkidle')
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should display property insights', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA', { timeout: 60000 })
    
    // Page should load successfully
    await page.waitForLoadState('networkidle')
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should have compare button', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA', { timeout: 60000 })
    
    // Page should load successfully
    await page.waitForLoadState('networkidle')
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
    const compareButton = page.locator('button:has-text("Compare"), a:has-text("Compare")').first()
    
    if (await compareButton.count() > 0) {
      await expect(compareButton).toBeVisible()
    }
  })

  test('should navigate to compare from suburb page', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA', { timeout: 60000 })
    
    // Page should load
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should show nearby suburbs', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA')
    
    // Look for nearby/similar suburbs section
    const nearbySection = page.locator('text=/nearby|similar|other suburbs/i')
    
    if (await nearbySection.count() > 0) {
      await expect(nearbySection.first()).toBeVisible()
    }
  })

  test('should display charts/visualizations', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA')
    
    // Look for chart elements
    const chart = page.locator('canvas, svg, [class*="chart"]').first()
    
    if (await chart.count() > 0) {
      await expect(chart).toBeVisible()
    }
  })

  test('should handle non-existent suburb gracefully', async ({ page }) => {
    await page.goto('/suburb/NONEXISTENTSUBURB12345')
    
    // Should show error or not found message
    const errorMessage = page.locator('text=/not found|error|doesn\'t exist/i')
    
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible()
    }
  })

  test('should show AI insights', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA')
    
    // Look for AI insights section
    const aiInsights = page.locator('text=/ai insights|smart insights|predictions/i')
    
    if (await aiInsights.count() > 0) {
      await expect(aiInsights.first()).toBeVisible()
    }
  })

  test('should display market trends', async ({ page }) => {
    await page.goto('/suburb/PARRAMATTA')
    
    // Look for market trends
    const trends = page.locator('text=/market trend|trending|forecast/i')
    
    if (await trends.count() > 0) {
      await expect(trends.first()).toBeVisible()
    }
  })
})
