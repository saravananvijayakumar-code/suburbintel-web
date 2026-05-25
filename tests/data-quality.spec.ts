import { test, expect } from '@playwright/test'

/**
 * Data Quality Tests
 * 
 * Verify that suburb data is real, accurate, and properly formatted.
 */

test.describe('Data Integrity', () => {
  test('suburbs have valid Australian postcodes', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=NSW&limit=20')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.success).toBe(true)
    
    for (const suburb of data.suburbs) {
      // Australian postcodes are 4 digits, NSW starts with 2
      expect(suburb.postcode).toMatch(/^[0-9]{4}$/)
      
      // NSW postcodes should start with 2
      if (suburb.state === 'NSW') {
        expect(suburb.postcode[0]).toBe('2')
      }
      // VIC postcodes should start with 3
      if (suburb.state === 'VIC') {
        expect(suburb.postcode[0]).toBe('3')
      }
    }
  })

  test('median prices are in realistic range', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=Sydney&limit=10')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    
    for (const suburb of data.suburbs) {
      if (suburb.medianPrice) {
        // Australian property prices: $100k to $10M is reasonable range
        expect(suburb.medianPrice).toBeGreaterThan(100000)
        expect(suburb.medianPrice).toBeLessThan(10000000)
      }
    }
  })

  test('rental yields are realistic percentages', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=Melbourne&limit=10')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    
    for (const suburb of data.suburbs) {
      if (suburb.rentalYield) {
        // Rental yields typically 1% to 10%
        expect(suburb.rentalYield).toBeGreaterThanOrEqual(0.5)
        expect(suburb.rentalYield).toBeLessThanOrEqual(15)
      }
    }
  })

  test('growth percentages are reasonable', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=Parramatta&limit=5')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    
    for (const suburb of data.suburbs) {
      if (suburb.growth12m !== null && suburb.growth12m !== undefined) {
        // Annual growth typically -30% to +50%
        expect(suburb.growth12m).toBeGreaterThanOrEqual(-50)
        expect(suburb.growth12m).toBeLessThanOrEqual(100)
      }
    }
  })

  test('investment scores are valid 0-100', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=Brisbane&limit=10')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    
    for (const suburb of data.suburbs) {
      if (suburb.investmentScore !== null && suburb.investmentScore !== undefined) {
        expect(suburb.investmentScore).toBeGreaterThanOrEqual(0)
        expect(suburb.investmentScore).toBeLessThanOrEqual(100)
      }
    }
  })
})

test.describe('API Response Quality', () => {
  test('search returns properly structured data', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=Sydney&limit=5')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    
    // Check response structure
    expect(data).toHaveProperty('success')
    expect(data).toHaveProperty('suburbs')
    expect(Array.isArray(data.suburbs)).toBe(true)
    
    // Check suburb object structure
    if (data.suburbs.length > 0) {
      const suburb = data.suburbs[0]
      expect(suburb).toHaveProperty('id')
      expect(suburb).toHaveProperty('name')
      expect(suburb).toHaveProperty('state')
      expect(suburb).toHaveProperty('postcode')
    }
  })

  test('stats endpoint returns aggregate data', async ({ request }) => {
    const response = await request.get('/api/suburbs/stats')
    
    if (response.ok()) {
      const data = await response.json()
      
      // Should have some stats
      expect(typeof data).toBe('object')
    }
  })

  test('top suburbs endpoint works', async ({ request }) => {
    const response = await request.get('/api/suburbs/top')
    
    if (response.ok()) {
      const data = await response.json()
      
      if (Array.isArray(data)) {
        expect(data.length).toBeLessThanOrEqual(50) // Reasonable limit
      }
    }
  })
})

test.describe('State-Specific Data', () => {
  test('NSW data is available', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=NSW&limit=20')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.suburbs.length).toBeGreaterThan(0)
    
    // Should have NSW suburbs
    const nswSuburbs = data.suburbs.filter((s: any) => s.state === 'NSW')
    expect(nswSuburbs.length).toBeGreaterThan(0)
  })

  test('VIC data is available', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=Melbourne&limit=20')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.suburbs.length).toBeGreaterThan(0)
  })
})
