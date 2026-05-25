import { test, expect } from '@playwright/test'

test.describe('API Endpoints Tests', () => {
  test('GET /api/health - should return health status', async ({ request }) => {
    const response = await request.get('/api/health')
    
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    
    // Check that status is either 'ok' or 'healthy'
    expect(data.status).toMatch(/ok|healthy/i)
  })

  // Note: Database-dependent tests require Cloud SQL proxy or production database
  // Skipping database tests in local environment
  test.skip('GET /api/suburbs/search - requires database connection', async ({ request }) => {
    const response = await request.get('/api/suburbs/search?q=Sydney&limit=10')
    
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    
    expect(data.success).toBe(true)
    expect(data.suburbs).toBeDefined()
    expect(Array.isArray(data.suburbs)).toBe(true)
  })

  test.skip('API tests - requires database setup', async () => {
    // These tests need Cloud SQL proxy or production database connection
    // Run with: DATABASE_URL pointing to accessible database
  })
})
