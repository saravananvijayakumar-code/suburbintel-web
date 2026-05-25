/**
 * Security Validation Library
 * 
 * Centralized Zod schemas for API input validation
 * to prevent injection attacks and malformed data
 */

import { z } from 'zod'

// ============================================
// COMMON SANITIZATION & VALIDATORS
// ============================================

// Strip dangerous characters that could be used for injection
const sanitizeString = (val: string) => 
  val
    .replace(/[<>'"`;\\]/g, '') // Remove XSS/SQLi chars
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()

// Custom string type that auto-sanitizes
const SafeString = z.string().transform(sanitizeString)

// Suburb name - alphanumeric, spaces, hyphens, apostrophes only
export const SuburbNameSchema = z.string()
  .min(2, 'Suburb name too short')
  .max(100, 'Suburb name too long')
  .regex(/^[a-zA-Z0-9\s\-']+$/, 'Invalid characters in suburb name')
  .transform(sanitizeString)

// Australian state validation
export const StateSchema = z.enum(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'])

// Postcode - 4 digits for Australia
export const PostcodeSchema = z.string()
  .regex(/^\d{4}$/, 'Invalid Australian postcode')

// Email - strict validation
export const EmailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long')
  .transform(v => v.toLowerCase().trim())

// UUID/CUID validation for IDs
export const IdSchema = z.string()
  .min(20, 'Invalid ID format')
  .max(30, 'Invalid ID format')
  .regex(/^[a-z0-9]+$/i, 'Invalid ID characters')

// Pagination with hard limits
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20), // Hard limit of 50
  offset: z.coerce.number().int().min(0).max(10000).optional(),
})

// ============================================
// API ROUTE SCHEMAS
// ============================================

// /api/suburbs/search
export const SuburbSearchSchema = z.object({
  q: z.string()
    .min(1, 'Search query required')
    .max(100, 'Search query too long')
    .transform(sanitizeString),
  state: StateSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

// /api/suburbs/compare
export const SuburbCompareSchema = z.object({
  ids: z.string()
    .transform(v => v.split(',').filter(Boolean))
    .pipe(z.array(IdSchema).min(1).max(5)),
}).or(z.object({
  names: z.string()
    .transform(v => v.split('|').filter(Boolean).slice(0, 5)),
}))

// /api/suburbs/[id]
export const SuburbDetailSchema = z.object({
  id: z.string().min(1).max(100),
  state: StateSchema.optional(),
  postcode: PostcodeSchema.optional(),
})

// /api/brain/chat
export const BrainChatSchema = z.object({
  query: z.string()
    .max(2000, 'Query too long')
    .transform(sanitizeString)
    .optional(),
  suburbName: SuburbNameSchema.optional(),
  state: StateSchema.optional(),
  conversationId: z.string().max(50).optional(),
  persona: z.enum(['first-home-buyer', 'investor', 'family', 'downsizer', 'developer']).optional(),
  budget: z.number().int().min(0).max(100_000_000).optional(),
  investmentGoal: z.string().max(200).transform(sanitizeString).optional(),
  action: z.enum(['chat', 'analyze']).default('chat'),
})

// /api/analyze
export const PropertyAnalyzeSchema = z.object({
  address: z.string().max(200).transform(sanitizeString).optional(),
  suburb: SuburbNameSchema,
  state: StateSchema,
  zipCode: PostcodeSchema.optional(),
})

// /api/forecast
export const ForecastSchema = z.object({
  suburb: SuburbNameSchema,
  state: StateSchema,
  propertyType: z.enum(['house', 'unit', 'all']).default('all'),
  years: z.coerce.number().int().min(1).max(10).default(5),
})

// /api/news
export const NewsQuerySchema = z.object({
  state: StateSchema.optional(),
  category: z.string().max(50).transform(sanitizeString).optional(),
  suburb: SuburbNameSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export const NewsCreateSchema = z.object({
  title: z.string().min(5).max(200).transform(sanitizeString),
  description: z.string().min(10).max(500).transform(sanitizeString),
  content: z.string().min(20).max(10000).transform(sanitizeString),
  source: z.string().max(100).transform(sanitizeString),
  sourceUrl: z.string().url().max(500).optional(),
  publishedAt: z.string().datetime().optional(),
  category: z.enum(['market', 'policy', 'development', 'economy', 'analysis']),
  state: StateSchema.optional(),
  suburbs: z.array(SuburbNameSchema).max(10).optional(),
  impactType: z.enum(['positive', 'negative', 'neutral']),
  impactScore: z.number().int().min(1).max(10).default(5),
  tags: z.array(z.string().max(30)).max(10).optional(),
  imageUrl: z.string().url().max(500).optional(),
})

// /api/watchlist
export const WatchlistSchema = z.object({
  suburbId: IdSchema,
  suburbName: SuburbNameSchema,
  state: StateSchema,
  postcode: PostcodeSchema,
  notes: z.string().max(1000).transform(sanitizeString).optional(),
})

// /api/alerts/setup
export const AlertSetupSchema = z.object({
  email: EmailSchema,
  suburbIds: z.array(IdSchema).min(1).max(20),
  alertTypes: z.array(z.enum(['price-change', 'new-listing', 'market-update'])).min(1),
  frequency: z.enum(['instant', 'daily', 'weekly']).default('daily'),
})

// /api/newsletter/subscribe
export const NewsletterSchema = z.object({
  email: EmailSchema,
  name: z.string().max(100).transform(sanitizeString).optional(),
  interests: z.array(z.string().max(50)).max(10).optional(),
})

// /api/portfolio
export const PortfolioSchema = z.object({
  properties: z.array(z.object({
    address: z.string().max(300).transform(sanitizeString),
    suburb: SuburbNameSchema,
    state: StateSchema,
    postcode: PostcodeSchema,
    purchasePrice: z.number().positive().max(100_000_000),
    purchaseDate: z.string().datetime(),
    propertyType: z.enum(['house', 'unit', 'townhouse', 'land']),
  })).max(50),
})

// /api/risk-analysis
export const RiskAnalysisSchema = z.object({
  state: z.string().max(10).transform(sanitizeString).optional(),
  riskType: z.enum(['all', 'bushfire', 'flood', 'coastal']).default('all'),
  search: z.string().max(100).transform(sanitizeString).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
})

// /api/opportunity-map
export const OpportunityMapSchema = z.object({
  persona: z.string().max(50).transform(sanitizeString).optional(),
  minBudget: z.coerce.number().min(0).max(100_000_000).optional(),
  maxBudget: z.coerce.number().min(0).max(100_000_000).optional(),
  minYield: z.coerce.number().min(0).max(100).optional(),
  minGrowth: z.coerce.number().min(-100).max(1000).optional(),
  state: StateSchema.optional(),
  sortBy: z.enum(['score', 'growth', 'yield', 'price']).default('score'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// /api/ai-insights
export const AIInsightsSchema = z.object({
  suburbId: IdSchema,
  analysisType: z.enum(['PREDICTION', 'INVESTMENT', 'MARKET_TRENDS', 'GENERAL']).default('GENERAL'),
})

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate request body with a Zod schema
 * Returns parsed data or throws formatted error
 */
export async function validateBody<T extends z.ZodSchema>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      throw new ValidationError(messages.join(', '))
    }
    throw new ValidationError('Invalid request body')
  }
}

/**
 * Validate URL search params with a Zod schema
 */
export function validateSearchParams<T extends z.ZodSchema>(
  searchParams: URLSearchParams,
  schema: T
): z.infer<T> {
  const obj: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    obj[key] = value
  })
  
  try {
    return schema.parse(obj)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      throw new ValidationError(messages.join(', '))
    }
    throw new ValidationError('Invalid query parameters')
  }
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
