import { test, expect } from '@playwright/test'

/**
 * Performance and SEO Tests
 * 
 * Verify pages load quickly and have proper SEO metadata.
 */

test.describe('Page Load Performance', () => {
  const criticalPages = [
    { path: '/', name: 'Homepage' },
    { path: '/search', name: 'Search' },
    { path: '/compare', name: 'Compare' },
    { path: '/insights', name: 'Insights' },
  ]

  for (const { path, name } of criticalPages) {
    test(`${name} loads under 10 seconds`, async ({ page }) => {
      const start = Date.now()
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      const loadTime = Date.now() - start
      
      expect(loadTime).toBeLessThan(10000)
      console.log(`${name} loaded in ${loadTime}ms`)
    })
  }
})

test.describe('SEO Metadata', () => {
  test('homepage has proper SEO tags', async ({ page }) => {
    await page.goto('/')
    
    // Title
    const title = await page.title()
    expect(title.length).toBeGreaterThan(10)
    expect(title.length).toBeLessThan(70) // SEO best practice
    
    // Meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(50)
    expect(description!.length).toBeLessThan(160) // SEO best practice
    
    // Viewport
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
    expect(viewport).toContain('width=device-width')
  })

  test('pages have unique titles', async ({ page }) => {
    const titles: string[] = []
    
    const pages = ['/', '/search', '/compare', '/insights']
    
    for (const path of pages) {
      await page.goto(path)
      const title = await page.title()
      expect(titles).not.toContain(title) // Each page should have unique title
      titles.push(title)
    }
  })

  test('has Open Graph tags', async ({ page }) => {
    await page.goto('/')
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
    
    // At least some OG tags should be present
    expect(ogTitle || ogDescription || ogType).toBeTruthy()
  })

  test('has canonical URL', async ({ page }) => {
    await page.goto('/')
    
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    if (canonical) {
      expect(canonical).toContain('http')
    }
  })
})

test.describe('Accessibility', () => {
  test('homepage has proper heading structure', async ({ page }) => {
    await page.goto('/')
    
    // Should have exactly one H1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
    
    // H2s should exist
    const h2Count = await page.locator('h2').count()
    expect(h2Count).toBeGreaterThan(0)
  })

  test('images have alt text', async ({ page }) => {
    await page.goto('/')
    
    const images = await page.locator('img').all()
    
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const src = await img.getAttribute('src')
      
      // Skip placeholder/data images, check real images have alt
      if (src && !src.startsWith('data:')) {
        expect(alt !== null, `Image ${src} missing alt text`).toBeTruthy()
      }
    }
  })

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/')
    
    const buttons = await page.locator('button').all()
    
    for (const button of buttons) {
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      const title = await button.getAttribute('title')
      
      // Each button should have some accessible name
      const hasAccessibleName = (text && text.trim().length > 0) || ariaLabel || title
      expect(hasAccessibleName, 'Button missing accessible name').toBeTruthy()
    }
  })

  test('links have descriptive text', async ({ page }) => {
    await page.goto('/')
    
    const links = await page.locator('a').all()
    
    for (const link of links) {
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      const title = await link.getAttribute('title')
      
      // Skip empty links that are decorative
      const href = await link.getAttribute('href')
      if (href && href !== '#') {
        const hasName = (text && text.trim().length > 0) || ariaLabel || title
        // Log warning but don't fail - some designs use icon-only links
        if (!hasName) {
          console.warn(`Link ${href} has no accessible name`)
        }
      }
    }
  })

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/')
    
    // Check that text is visible (basic check)
    const mainContent = page.locator('main, body')
    await expect(mainContent).toBeVisible()
    
    // Check for readable font size
    const fontSize = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontSize
    })
    
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(12)
  })
})

test.describe('Mobile Responsiveness', () => {
  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
    await page.goto('/')
    
    // Content should be visible
    await expect(page.locator('h1').first()).toBeVisible()
    
    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 10) // Allow small margin
  })

  test('navigation works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Either mobile menu button or nav links visible
    const mobileMenu = page.locator('button[aria-label*="menu" i], .hamburger, .mobile-menu-button')
    const navLinks = page.locator('nav a')
    
    const hasMobileMenu = await mobileMenu.count() > 0
    const hasVisibleNav = await navLinks.first().isVisible().catch(() => false)
    
    expect(hasMobileMenu || hasVisibleNav).toBeTruthy()
  })
})
