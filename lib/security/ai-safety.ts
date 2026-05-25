/**
 * AI Security Library
 * 
 * Protects against prompt injection, jailbreaking,
 * and other LLM-specific attacks
 */

import { sanitizeInput } from './middleware'

// ============================================
// PROMPT INJECTION DETECTION
// ============================================

const PROMPT_INJECTION_PATTERNS = [
  // Direct instruction override attempts
  /ignore\s+(all\s+)?(previous|above|prior)\s+instructions?/i,
  /disregard\s+(all\s+)?(previous|above|prior)\s+instructions?/i,
  /forget\s+(all\s+)?(previous|above|prior)\s+instructions?/i,
  /override\s+(all\s+)?(previous|system)/i,
  
  // System prompt extraction
  /what\s+(are|is)\s+your\s+(instructions?|system\s+prompt|rules?)/i,
  /reveal\s+your\s+(instructions?|system\s+prompt|rules?)/i,
  /show\s+me\s+your\s+(instructions?|system\s+prompt)/i,
  /repeat\s+(your\s+)?(initial|first|system)\s+(prompt|instructions?)/i,
  /print\s+(your\s+)?system\s+prompt/i,
  
  // Role manipulation
  /you\s+are\s+now\s+(a|an|the)/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /act\s+as\s+(if\s+you\s+are|a|an)/i,
  /roleplay\s+as/i,
  /from\s+now\s+on\s+you\s+(are|will)/i,
  
  // DAN/Jailbreak attempts
  /\bDAN\b/i,
  /do\s+anything\s+now/i,
  /jailbreak/i,
  /bypass\s+(your\s+)?(safety|restrictions?|filters?)/i,
  /without\s+(any\s+)?(restrictions?|limitations?|filters?)/i,
  
  // Code execution attempts
  /execute\s+(this\s+)?(code|command|script)/i,
  /run\s+(this\s+)?(code|command|script)/i,
  /eval\s*\(/i,
  /import\s+(os|subprocess|sys)/i,
  
  // Encoding tricks
  /base64\s+(decode|encode)/i,
  /hex\s+(decode|encode)/i,
  /rot13/i,
  
  // Multi-turn manipulation
  /in\s+your\s+next\s+response/i,
  /respond\s+with\s+only/i,
  /output\s+(only|just)\s+the/i,
  
  // API/Tool abuse
  /call\s+(the\s+)?(api|function|tool)/i,
  /access\s+(the\s+)?(database|api|backend)/i,
]

/**
 * Check if input contains prompt injection attempts
 */
export function detectPromptInjection(input: string): {
  detected: boolean
  patterns: string[]
  riskLevel: 'low' | 'medium' | 'high'
} {
  const detectedPatterns: string[] = []
  
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      detectedPatterns.push(pattern.source)
    }
  }
  
  const detected = detectedPatterns.length > 0
  let riskLevel: 'low' | 'medium' | 'high' = 'low'
  
  if (detectedPatterns.length >= 3) {
    riskLevel = 'high'
  } else if (detectedPatterns.length >= 1) {
    riskLevel = 'medium'
  }
  
  return { detected, patterns: detectedPatterns, riskLevel }
}

// ============================================
// INPUT SANITIZATION FOR AI
// ============================================

/**
 * Sanitize user input before sending to AI
 */
export function sanitizeAiInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  let sanitized = input
  
  // Remove potential control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s{3,}/g, '  ')
  
  // Limit length
  sanitized = sanitized.substring(0, 2000)
  
  // Remove markdown that could confuse the model
  sanitized = sanitized
    .replace(/```[\s\S]*?```/g, '[code block removed]')
    .replace(/\[INST\]/gi, '')
    .replace(/\[\/INST\]/gi, '')
    .replace(/<\|im_start\|>/gi, '')
    .replace(/<\|im_end\|>/gi, '')
    .replace(/<<SYS>>/gi, '')
    .replace(/<\/SYS>>/gi, '')
  
  return sanitized.trim()
}

/**
 * Validate and sanitize AI input with injection detection
 */
export function validateAiInput(input: string): {
  valid: boolean
  sanitized: string
  reason?: string
} {
  // Check for prompt injection
  const injectionCheck = detectPromptInjection(input)
  
  if (injectionCheck.riskLevel === 'high') {
    return {
      valid: false,
      sanitized: '',
      reason: 'Input rejected for security reasons'
    }
  }
  
  // Sanitize the input
  const sanitized = sanitizeAiInput(input)
  
  // Check length
  if (sanitized.length < 2) {
    return {
      valid: false,
      sanitized: '',
      reason: 'Query is too short'
    }
  }
  
  return {
    valid: true,
    sanitized,
    reason: injectionCheck.riskLevel === 'medium' ? 'Input modified for safety' : undefined
  }
}

// ============================================
// SAFE PROMPT CONSTRUCTION
// ============================================

/**
 * Safely construct a prompt with user input
 * Uses structured format to separate system and user content
 */
export function buildSafePrompt(config: {
  systemPrompt: string
  userQuery: string
  context?: Record<string, any>
}): string {
  const { systemPrompt, userQuery, context } = config
  
  // Validate user query
  const validation = validateAiInput(userQuery)
  if (!validation.valid) {
    throw new Error(validation.reason || 'Invalid input')
  }
  
  // Build context string safely
  let contextStr = ''
  if (context) {
    const safeContext: Record<string, string> = {}
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        safeContext[key] = sanitizeInput(value).substring(0, 500)
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        safeContext[key] = String(value)
      }
    }
    contextStr = '\n\nContext:\n' + JSON.stringify(safeContext, null, 2)
  }
  
  // Use clear delimiters to separate instructions from user input
  return `${systemPrompt}

---BEGIN USER QUERY---
${validation.sanitized}
---END USER QUERY---${contextStr}`
}

// ============================================
// OUTPUT SANITIZATION
// ============================================

/**
 * Sanitize AI output before returning to user
 */
export function sanitizeAiOutput(output: string): string {
  if (!output || typeof output !== 'string') return ''
  
  let sanitized = output
  
  // Remove any accidentally leaked system prompts
  sanitized = sanitized
    .replace(/system\s*prompt\s*:/gi, '')
    .replace(/instructions\s*:/gi, '')
  
  // Remove potential harmful links
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/data:/gi, '')
  
  // Ensure no HTML injection
  sanitized = sanitized
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  
  return sanitized
}

// Alias for consistent naming
export { sanitizeAiOutput as sanitizeAIOutput }

// ============================================
// ERROR LOGGING SANITIZATION
// ============================================

/**
 * Sanitize error object for safe logging
 * Prevents leaking sensitive information in logs
 */
export function sanitizeForLog(error: unknown): string {
  if (!error) return 'Unknown error'
  
  if (error instanceof Error) {
    // Don't expose stack traces in production
    if (process.env.NODE_ENV === 'production') {
      return error.message.substring(0, 200)
    }
    return `${error.message}\n${error.stack}`.substring(0, 1000)
  }
  
  if (typeof error === 'string') {
    return error.substring(0, 200)
  }
  
  if (typeof error === 'object') {
    try {
      return JSON.stringify(error).substring(0, 200)
    } catch {
      return 'Error object (unable to stringify)'
    }
  }
  
  return String(error).substring(0, 200)
}

// ============================================
// RATE LIMITING FOR AI REQUESTS
// ============================================

// Track expensive AI operations per user
const AI_OPERATION_COSTS: Record<string, number> = {
  'chat': 1,
  'analyze': 5,
  'report': 10,
  'compare-summary': 3,
}

/**
 * Get AI operation cost for rate limiting
 */
export function getAiOperationCost(operation: string): number {
  return AI_OPERATION_COSTS[operation] || 1
}
