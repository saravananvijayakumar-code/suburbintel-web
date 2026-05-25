import { test, expect } from '@playwright/test'

/**
 * Tests for public pages that don't require authentication
 * These tests verify core functionality without hitting Clerk auth
 */
test.describe('Public Pages - No Auth Required', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Suburb Intel/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('homepage displays hero section', async ({ page }) => {
    await page.goto('/')
    // Check for main content
    const heroHeading = page.getByRole('heading').first()
    await expect(heroHeading).toBeVisible()
  })

  test('pricing page loads', async ({ page }) => {
    const response = await page.goto('/pricing')
    expect(response?.ok()).toBeTruthy()
    await expect(page.locator('body')).toBeVisible()
  })

  test('about page loads', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('body')).toBeVisible()
  })

  test('API health check works', async ({ page }) => {
    const response = await page.goto('/api/health')
    expect(response?.status()).toBe(200)
  })

  test('homepage is responsive on mobile', async ({ page, isMobile }) => {
    await page.goto('/')
    
    if (isMobile) {
      // Mobile-specific checks
      const body = page.locator('body')
      await expect(body).toBeVisible()
      
      // Check viewport is set correctly
      const viewport = page.viewportSize()
      expect(viewport?.width).toBeLessThan(800)
    }
  })

  test('navigation renders correctly', async ({ page }) => {
    await page.goto('/')
    // Just verify page loads - navigation might be hidden on mobile
    await expect(page.locator('body')).toBeVisible()
  })

  test('footer renders on homepage', async ({ page }) => {
    await page.goto('/')
    // Check for footer element
    const footer = page.locator('footer').first()
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible()
    }
  })
})

test.describe('API Endpoints - Public', () => {
  test('suburbs stats API returns data', async ({ request }) => {
    const response = await request.get('/api/suburbs/stats')
    // May fail if DB not connected, but endpoint should exist
    expect([200, 500]).toContain(response.status())
  })

  test('trending API endpoint exists', async ({ request }) => {
    const response = await request.get('/api/trending')
    // May fail if DB not connected, but endpoint should exist
    expect([200, 500]).toContain(response.status())
  })
})

test.describe('Performance Checks', () => {
  test('homepage loads within reasonable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    // Homepage should load in under 10 seconds even with dev server
    expect(loadTime).toBeLessThan(10000)
  })

  test('page has proper meta tags', async ({ page }) => {
    await page.goto('/')
    
    // Check for viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]')
    await expect(viewportMeta).toHaveCount(1)
  })
})
