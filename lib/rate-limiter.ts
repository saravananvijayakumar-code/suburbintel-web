/**
 * Database-backed Rate Limiter
 * 
 * Unlike in-memory rate limiting (which fails with multiple instances),
 * this stores rate limit data in PostgreSQL for horizontal scaling.
 */

import { prisma } from './prisma'
import { randomUUID } from 'crypto'

interface RateLimitConfig {
  maxRequests: number  // Max requests in window
  windowMs: number     // Window size in milliseconds
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  retryAfter?: number  // Seconds until reset
}

// Default rate limits by endpoint type
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Public API endpoints
  'api:search': { maxRequests: 30, windowMs: 60_000 },      // 30/min
  'api:suburbs': { maxRequests: 60, windowMs: 60_000 },     // 60/min
  'api:compare': { maxRequests: 20, windowMs: 60_000 },     // 20/min
  
  // AI-powered endpoints (expensive)
  'api:ai-report': { maxRequests: 5, windowMs: 60_000 },    // 5/min
  'api:ai-insights': { maxRequests: 10, windowMs: 60_000 }, // 10/min
  
  // Auth endpoints (prevent brute force)
  'auth:login': { maxRequests: 5, windowMs: 300_000 },      // 5 per 5 min
  'auth:signup': { maxRequests: 3, windowMs: 300_000 },     // 3 per 5 min
  'auth:reset': { maxRequests: 3, windowMs: 3600_000 },     // 3 per hour
  
  // Default for unspecified endpoints
  'default': { maxRequests: 100, windowMs: 60_000 },        // 100/min
}

/**
 * Check and update rate limit for an identifier/endpoint combination.
 * Returns whether the request is allowed.
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  const limits = config || RATE_LIMITS[endpoint] || RATE_LIMITS['default']
  const windowStart = new Date(Date.now() - limits.windowMs)
  
  try {
    // Use upsert to atomically check and increment
    const rateLimit = await prisma.rate_limits.upsert({
      where: {
        identifier_endpoint: { identifier, endpoint }
      },
      create: {
        id: randomUUID(),
        identifier,
        endpoint,
        requestCount: 1,
        windowStart: new Date(),
        updatedAt: new Date(),
      },
      update: {
        // Reset if window expired, otherwise increment
        requestCount: {
          increment: 1,
        },
        updatedAt: new Date(),
      },
    })

    // Check if window has expired and needs reset
    if (rateLimit.windowStart < windowStart) {
      // Reset the window
      await prisma.rate_limits.update({
        where: { id: rateLimit.id },
        data: {
          requestCount: 1,
          windowStart: new Date(),
          updatedAt: new Date(),
        },
      })
      
      return {
        allowed: true,
        remaining: limits.maxRequests - 1,
        resetAt: new Date(Date.now() + limits.windowMs),
      }
    }

    const allowed = rateLimit.requestCount <= limits.maxRequests
    const remaining = Math.max(0, limits.maxRequests - rateLimit.requestCount)
    const resetAt = new Date(rateLimit.windowStart.getTime() + limits.windowMs)
    
    return {
      allowed,
      remaining,
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt.getTime() - Date.now()) / 1000),
    }
  } catch (error) {
    // On database error, allow the request (fail open)
    console.error('Rate limit check failed:', error)
    return {
      allowed: true,
      remaining: limits.maxRequests,
      resetAt: new Date(Date.now() + limits.windowMs),
    }
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': result.resetAt.toISOString(),
  }
  
  if (result.retryAfter) {
    headers['Retry-After'] = String(result.retryAfter)
  }
  
  return headers
}

/**
 * Clean up expired rate limit records (run periodically)
 */
export async function cleanupExpiredRateLimits(): Promise<number> {
  const maxWindowMs = Math.max(...Object.values(RATE_LIMITS).map(c => c.windowMs))
  const cutoff = new Date(Date.now() - maxWindowMs * 2) // Keep 2x longest window
  
  const result = await prisma.rate_limits.deleteMany({
    where: {
      windowStart: { lt: cutoff }
    }
  })
  
  return result.count
}

/**
 * Get identifier from request (IP or user ID)
 */
export function getIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }
  
  // Get IP from various headers (Cloudflare, nginx, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  const cf = request.headers.get('cf-connecting-ip')
  
  const ip = cf || real || forwarded?.split(',')[0]?.trim() || 'unknown'
  return `ip:${ip}`
}
