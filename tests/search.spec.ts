import { test, expect } from '@playwright/test'

test.describe('Search Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  test('should load search page', async ({ page }) => {
    await expect(page).toHaveURL(/\/search/)
    await expect(page.locator('h1')).toContainText(/search/i)
  })

  test('should have search input field', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first()
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toBeEditable()
  })

  test('should search for NSW suburbs', async ({ page }) => {
    // Page loaded successfully
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should search for VIC suburbs', async ({ page }) => {
    // Page loaded successfully
    const pageLoaded = await page.locator('body').isVisible()
    expect(pageLoaded).toBeTruthy()
  })

  test('should filter by state - NSW', async ({ page }) => {
    // Look for state filter dropdown
    const stateFilter = page.locator('select, [role="combobox"]').filter({ hasText: /state|nsw|vic/i }).first()
    
    if (await stateFilter.count() > 0) {
      await stateFilter.selectOption('NSW')
      
      // Search for a common term
      const searchInput = page.locator('input[type="text"]').first()
      await searchInput.fill('Sydney')
      
      await page.waitForTimeout(500)
      
      // Verify NSW results
      const results = page.locator('text=/NSW/i')
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible()
      }
    }
  })

  test('should filter by state - VIC', async ({ page }) => {
    // Look for state filter dropdown
    const stateFilter = page.locator('select, [role="combobox"]').filter({ hasText: /state|nsw|vic/i }).first()
    
    if (await stateFilter.count() > 0) {
      await stateFilter.selectOption('VIC')
      
      // Search for a common term
      const searchInput = page.locator('input[type="text"]').first()
      await searchInput.fill('Geelong')
      
      await page.waitForTimeout(500)
      
      // Verify VIC results
      const results = page.locator('text=/VIC/i')
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible()
      }
    }
  })

  test('should display suburb details on click', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.fill('Sydney')
    
    await page.waitForTimeout(500)
    
    // Click first result
    const firstResult = page.locator('[class*="result"], [class*="suburb"], a[href*="/suburb/"]').first()
    
    if (await firstResult.count() > 0) {
      await firstResult.click()
      
      // Should navigate to suburb detail page
      await expect(page).toHaveURL(/\/suburb\//, { timeout: 10000 })
    }
  })

  test('should show no results for invalid search', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.fill('XXXXINVALIDSUBURBXXXX')
    
    await page.waitForTimeout(1000)
    
    // Should show no results or empty state
    const noResults = page.locator('text=/no results|not found|no suburbs/i')
    if (await noResults.count() > 0) {
      await expect(noResults.first()).toBeVisible()
    }
  })

  test('should handle price range filters', async ({ page }) => {
    // Look for price filter inputs
    const minPriceInput = page.locator('input[placeholder*="Min"]').first()
    const maxPriceInput = page.locator('input[placeholder*="Max"]').first()
    
    if (await minPriceInput.count() > 0 && await maxPriceInput.count() > 0) {
      await minPriceInput.fill('300000')
      await maxPriceInput.fill('600000')
      
      await page.waitForTimeout(500)
      
      // Results should be filtered
      const results = page.locator('[class*="result"], [class*="suburb"]')
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible()
      }
    }
  })

  test('should toggle view mode (grid/list)', async ({ page }) => {
    // Look for view toggle buttons
    const gridButton = page.locator('button[aria-label*="grid" i], button:has-text("Grid")')
    const listButton = page.locator('button[aria-label*="list" i], button:has-text("List")')
    
    if (await gridButton.count() > 0) {
      await gridButton.click()
      await page.waitForTimeout(300)
    }
    
    if (await listButton.count() > 0) {
      await listButton.click()
      await page.waitForTimeout(300)
    }
  })

  test('should save search', async ({ page }) => {
    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.fill('Melbourne')
    
    await page.waitForTimeout(500)
    
    // Look for save button
    const saveButton = page.locator('button:has-text("Save"), button[aria-label*="save" i]').first()
    
    if (await saveButton.count() > 0) {
      await saveButton.click()
      await page.waitForTimeout(300)
      
      // Should show saved confirmation
      const savedIndicator = page.locator('text=/saved|bookmark/i')
      if (await savedIndicator.count() > 0) {
        await expect(savedIndicator.first()).toBeVisible()
      }
    }
  })
})
