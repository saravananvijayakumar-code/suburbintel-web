/**
 * Security Middleware Library
 * 
 * Centralized security checks for all API routes:
 * - Rate limiting
 * - Input sanitization
 * - Request validation
 * - Security headers
 */

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getIdentifier, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limiter'
import { ValidationError } from './validation'

// ============================================
// SECURITY RESPONSE HELPERS
// ============================================

export function securityError(message: string, status: number = 400): NextResponse {
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      // Don't leak internal details in production
      ...(process.env.NODE_ENV === 'development' && { debug: message })
    },
    { status }
  )
}

export function rateLimitExceeded(retryAfter: number): NextResponse {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter 
    },
    { 
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': '0',
      }
    }
  )
}

// ============================================
// RATE LIMITING WRAPPER
// ============================================

type RateLimitTier = keyof typeof RATE_LIMITS

export async function withRateLimitAsync(
  request: NextRequest,
  endpoint: RateLimitTier,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const { userId } = await auth()
    const identifier = getIdentifier(request, userId || undefined)
    
    const result = await checkRateLimit(identifier, endpoint)
    
    if (!result.allowed) {
      return rateLimitExceeded(result.retryAfter || 60)
    }
    
    // Execute handler
    const response = await handler()
    
    // Add rate limit headers to the response
    const headers = getRateLimitHeaders(result)
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value)
    }
    
    return response
  } catch (error) {
    console.error('Rate limit middleware error:', error)
    // Return the handler response if rate limiting fails
    return handler()
  }
}

/**
 * Simple rate limit wrapper for route handlers
 * Usage: export const GET = withRateLimit(handler, { maxRequests: 60, windowMs: 60000 })
 */
export function withRateLimit(
  handler: (request: Request | NextRequest) => Promise<NextResponse>,
  options: { maxRequests?: number; windowMs?: number } = {}
): (request: Request | NextRequest) => Promise<NextResponse> {
  const { maxRequests = 60, windowMs = 60000 } = options
  
  // Simple in-memory rate limiting (use Redis in production for distributed)
  const requestCounts = new Map<string, { count: number; resetAt: number }>()
  
  return async (request: Request | NextRequest): Promise<NextResponse> => {
    // Get identifier from IP or auth
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') ||
               'anonymous'
    
    const identifier = `${ip}:${new URL(request.url).pathname}`
    const now = Date.now()
    
    // Check and update rate limit
    let record = requestCounts.get(identifier)
    
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs }
      requestCounts.set(identifier, record)
    }
    
    record.count++
    
    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000)
      return rateLimitExceeded(retryAfter)
    }
    
    // Execute handler
    return handler(request)
  }
}

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize a string to prevent XSS, SQLi, and other injection attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Escape special characters
    .replace(/[<>'"`;\\]/g, '')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Deep sanitize an object (recursive)
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(v => 
        typeof v === 'string' ? sanitizeInput(v) : v
      )
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized as T
}

// ============================================
// SQL INJECTION PREVENTION
// ============================================

/**
 * Check if a string contains SQL injection patterns
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
    /(--|#|\/\*|\*\/)/,  // SQL comments
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,  // OR 1=1
    /(\bAND\b\s+\d+\s*=\s*\d+)/i, // AND 1=1
    /(SLEEP\s*\()/i,  // Time-based injection
    /(BENCHMARK\s*\()/i,
    /(\bEXEC\b)/i,
    /(xp_cmdshell)/i,
  ]
  
  return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * Validate input doesn't contain SQL injection
 */
export function validateNoSqlInjection(input: string): void {
  if (containsSqlInjection(input)) {
    throw new ValidationError('Invalid characters in input')
  }
}

// ============================================
// XSS PREVENTION
// ============================================

/**
 * Check if a string contains potential XSS patterns
 */
export function containsXss(input: string): boolean {
  const xssPatterns = [
    /<script\b[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i,  // onclick=, onerror=, etc.
    /data:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /vbscript:/i,
    /expression\s*\(/i,  // CSS expression
  ]
  
  return xssPatterns.some(pattern => pattern.test(input))
}

/**
 * HTML encode string for safe rendering
 */
export function htmlEncode(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// ============================================
// CSV INJECTION PREVENTION
// ============================================

/**
 * Sanitize a value for safe CSV output
 * Prevents formula injection attacks
 */
export function sanitizeCsvValue(value: string): string {
  if (typeof value !== 'string') return String(value)
  
  // Prefix dangerous characters with a single quote
  // This prevents Excel/Sheets from interpreting as formula
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r', '\n']
  
  if (dangerousChars.some(char => value.startsWith(char))) {
    return `'${value}`
  }
  
  // Escape quotes for CSV format
  return value.replace(/"/g, '""')
}

// ============================================
// PATH TRAVERSAL PREVENTION
// ============================================

/**
 * Validate a filename is safe (no path traversal)
 */
export function validateFilename(filename: string): boolean {
  const dangerousPatterns = [
    /\.\./,  // Parent directory
    /^\//, // Absolute path
    /^\\/, // Windows absolute
    /[<>:"|?*]/, // Invalid filename chars
    /\x00/, // Null byte
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(filename))
}

/**
 * Get safe filename from user input
 */
export function getSafeFilename(filename: string): string {
  // Remove directory components
  const basename = filename.split(/[\/\\]/).pop() || 'file'
  
  // Remove dangerous characters
  return basename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 100)
}

// ============================================
// ADMIN AUTHENTICATION
// ============================================

function parseAdminEmails(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

const ADMIN_EMAILS = (
  parseAdminEmails(process.env.ADMIN_EMAILS).length > 0
    ? parseAdminEmails(process.env.ADMIN_EMAILS)
    : [
        'saravanavijay.v1986@gmail.com',
      ]
)

/**
 * Check if request has admin header (for internal use only)
 * Note: This relies on x-user-email header - use in conjunction with Clerk auth
 */
export function isAdminRequest(request: NextRequest): boolean {
  const email = request.headers.get('x-user-email')
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * Check if user is admin (use with Clerk session, not headers)
 */
export async function isAdminUser(request?: NextRequest): Promise<boolean> {
  try {
    const { userId, sessionClaims } = await auth()
    
    if (!userId) return false
    
    // Get email from session claims (set by Clerk)
    const email = sessionClaims?.email as string | undefined
    
    if (!email) return false
    
    return ADMIN_EMAILS.includes(email.toLowerCase())
  } catch {
    return false
  }
}

/**
 * Protect admin routes
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const isAdmin = await isAdminUser(request)
  
  if (!isAdmin) {
    return securityError('Admin access required', 403)
  }
  
  return null // Continue to handler
}

// ============================================
// CORS HEADERS
// ============================================

const ALLOWED_ORIGINS = [
  'https://suburbintel.com',
  'https://www.suburbintel.com',
  'https://suburb-intel-web-*.run.app', // Cloud Run preview URLs
]

// Add localhost for development
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://127.0.0.1:3000')
}

/**
 * Check if origin is allowed
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  
  return ALLOWED_ORIGINS.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$')
      return pattern.test(origin)
    }
    return origin === allowed
  })
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: NextResponse, origin: string | null): NextResponse {
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
  }
  return response
}
