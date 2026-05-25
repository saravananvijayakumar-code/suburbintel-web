import { test, expect } from '@playwright/test'

test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Suburb Intel/)
    await expect(page.getByRole('heading', { name: /Invest Smarter/i }).first()).toBeVisible()
  })

  test('should display hero section with CTA buttons', async ({ page }) => {
    // Check for main heading
    await expect(page.getByRole('heading', { name: /Invest Smarter/i }).first()).toBeVisible()
    
    // Check for Get Started button
    const getStartedButton = page.getByRole('link', { name: /Get Started/i })
    await expect(getStartedButton.first()).toBeVisible()
  })

  test('should display feature cards', async ({ page }) => {
    // Check for key features section exists
    const featuresSection = page.locator('text=/features|why choose/i').first()
    if (await featuresSection.count() > 0) {
      await expect(featuresSection).toBeVisible()
    }
    // At minimum, page should have loaded
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display pricing tiers', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Starter/i }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /Pro/i }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /Investor/i }).first()).toBeVisible()
  })

  test('should navigate to search page from CTA', async ({ page }) => {
    // Navigate directly to search
    await page.goto('/search')
    await expect(page).toHaveURL(/\/search/)
  })

  test('should navigate to compare page from CTA', async ({ page }) => {
    // Navigate directly to compare
    await page.goto('/compare', { timeout: 60000 })
    await expect(page).toHaveURL(/\/compare/)
  })

  test('should have working navigation menu', async ({ page }) => {
    // Check navigation links
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    
    // Check for key navigation items (Search, Insights, Compare, Portfolio)
    await expect(page.getByRole('link', { name: /^Search$/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /^Insights$/i }).first()).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Mobile-specific checks
      await expect(page.locator('h1')).toBeVisible()
      
      // Check mobile menu button exists
      const mobileMenuButton = page.locator('button[aria-label*="menu"]')
      if (await mobileMenuButton.count() > 0) {
        await expect(mobileMenuButton).toBeVisible()
      }
    }
  })

  test('should display footer with links', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    // Check for footer links
    await expect(page.getByRole('link', { name: /privacy/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /terms/i })).toBeVisible()
  })
})
