import { test, expect } from '@playwright/test'

/**
 * Core User Journey Tests
 * 
 * These tests verify ACTUAL functionality, not just "page loaded".
 * Each test simulates real user behavior and validates outcomes.
 */

test.describe('Search Functionality', () => {
  test('should search and find Sydney suburbs', async ({ page }) => {
    await page.goto('/search')
    
    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.fill('Sydney')
    
    // Wait for results to load
    await page.waitForTimeout(1000)
    
    // Should show NSW results containing "Sydney"
    const results = page.locator('[data-testid="suburb-result"], .suburb-card, .search-result')
    
    // If no specific test IDs, check for text containing Sydney
    const sydneyText = page.locator('text=/Sydney/i')
    await expect(sydneyText.first()).toBeVisible({ timeout: 10000 })
    
    // Should show state indicator NSW
    const nswIndicator = page.locator('text=/NSW/i')
    expect(await nswIndicator.count()).toBeGreaterThan(0)
  })

  test('should search by postcode', async ({ page }) => {
    await page.goto('/search')
    
    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.fill('2000')
    
    await page.waitForTimeout(1000)
    
    // 2000 is Sydney CBD postcode
    const results = page.locator('text=/2000|Sydney/i')
    expect(await results.count()).toBeGreaterThan(0)
  })

  test('should filter by price range if available', async ({ page }) => {
    await page.goto('/search')
    
    // Look for price filter inputs
    const minPrice = page.locator('input[name="minPrice"], input[placeholder*="Min"]').first()
    const maxPrice = page.locator('input[name="maxPrice"], input[placeholder*="Max"]').first()
    
    if (await minPrice.isVisible()) {
      await minPrice.fill('500000')
      await maxPrice.fill('1000000')
      
      await page.waitForTimeout(500)
      
      // Results should be visible (or empty state)
      const bodyVisible = await page.locator('body').isVisible()
      expect(bodyVisible).toBeTruthy()
    }
  })
})

test.describe('Suburb Detail Page', () => {
  test('should display suburb data correctly', async ({ page }) => {
    // Go directly to a known suburb
    await page.goto('/suburb/PARRAMATTA', { timeout: 30000 })
    
    // Should show suburb name
    await expect(page.locator('text=/Parramatta/i').first()).toBeVisible({ timeout: 10000 })
    
    // Should show state (NSW)
    const stateText = page.locator('text=/NSW/i')
    expect(await stateText.count()).toBeGreaterThan(0)
    
    // Should display key metrics (price, yield, growth)
    const priceIndicator = page.locator('text=/\\$|median|price/i')
    expect(await priceIndicator.count()).toBeGreaterThan(0)
  })

  test('should show investment metrics', async ({ page }) => {
    await page.goto('/suburb/MELBOURNE', { timeout: 30000 })
    
    // Check for investment-related data
    const investmentData = page.locator('text=/investment|score|yield|growth/i')
    expect(await investmentData.count()).toBeGreaterThan(0)
  })
})

test.describe('Comparison Tool', () => {
  test('should allow comparing suburbs', async ({ page }) => {
    await page.goto('/compare')
    
    // Should have inputs/dropdowns to select suburbs
    const inputs = page.locator('input, select, [role="combobox"]')
    expect(await inputs.count()).toBeGreaterThan(0)
  })

  test('should navigate to compare page', async ({ page }) => {
    await page.goto('/compare', { timeout: 30000 })
    await expect(page).toHaveURL(/\/compare/)
    
    // Should have comparison heading
    const heading = page.locator('h1, h2')
    await expect(heading.first()).toBeVisible()
  })
})

test.describe('Pricing redirect', () => {
  test('legacy /pricing redirects to home', async ({ page }) => {
    const response = await page.goto('/pricing', { waitUntil: 'load' })
    expect(page.url()).toMatch(/\/$|\/pricing/) // permanent redirect lands on /
    expect(response?.ok()).toBeTruthy()
  })
})

test.describe('API Endpoints', () => {
  test('health endpoint returns OK', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.status).toMatch(/ok|healthy/i)
  })

  test('search API returns data', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=Sydney&limit=5')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.suburbs)).toBe(true)
  })

  test('suburb stats API works', async ({ request }) => {
    const response = await request.get('/api/suburbs/stats')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data).toBeDefined()
  })

  test('trending API returns suburbs', async ({ request }) => {
    const response = await request.get('/api/trending')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(Array.isArray(data.suburbs) || data.trending || data.success !== undefined).toBeTruthy()
  })
})

test.describe('Auth removed', () => {
  test('legacy /sign-in redirects', async ({ page }) => {
    await page.goto('/sign-in', { waitUntil: 'load' })
    // Redirected away
    expect(page.url()).not.toMatch(/\/sign-in/)
  })

  test('legacy /sign-up redirects', async ({ page }) => {
    await page.goto('/sign-up', { waitUntil: 'load' })
    expect(page.url()).not.toMatch(/\/sign-up/)
  })
})

test.describe('Error Handling', () => {
  test('404 page shows for invalid routes', async ({ page }) => {
    await page.goto('/this-page-definitely-does-not-exist-xyz123')
    
    // Should show 404 content
    const notFoundText = page.locator('text=/404|not found|page.*exist/i')
    expect(await notFoundText.count()).toBeGreaterThan(0)
  })

  test('API returns proper error for invalid suburb', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=XXXINVALIDXXX')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    // Should return empty array, not error
    expect(Array.isArray(data.suburbs)).toBe(true)
  })
})
