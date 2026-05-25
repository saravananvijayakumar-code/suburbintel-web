/**
 * CSV Security Library
 * 
 * Protects against:
 * - CSV formula injection
 * - Path traversal
 * - Malicious file uploads
 */

import { ValidationError } from './validation'

// ============================================
// FILE VALIDATION
// ============================================

const ALLOWED_MIME_TYPES = [
  'text/csv',
  'text/plain',
  'application/csv',
  'application/vnd.ms-excel', // Some systems report this for CSV
]

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB max

/**
 * Validate an uploaded CSV file
 */
export function validateCsvFile(file: File): void {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new ValidationError(`Invalid file type: ${file.type}. Only CSV files allowed.`)
  }
  
  // Check file extension
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext !== 'csv') {
    throw new ValidationError('Invalid file extension. Only .csv files allowed.')
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
  }
  
  // Check filename for path traversal
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    throw new ValidationError('Invalid filename.')
  }
}

// ============================================
// CSV FORMULA INJECTION PREVENTION
// ============================================

// Characters that trigger formula interpretation in Excel/Sheets
const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r', '\n']

// Dangerous formula patterns
const DANGEROUS_PATTERNS = [
  /^=cmd\|/i,
  /^=\|/,
  /^=IMPORTXML/i,
  /^=IMPORTDATA/i,
  /^=IMPORTHTML/i,
  /^=IMPORTFEED/i,
  /^=IMPORTRANGE/i,
  /^=IMAGE/i,
  /^=WEBSERVICE/i,
  /^=HYPERLINK/i,
  /^=DDE/i,
]

/**
 * Check if a value contains dangerous formula patterns
 */
export function isDangerousFormula(value: string): boolean {
  if (!value || typeof value !== 'string') return false
  
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(value.trim()))
}

/**
 * Sanitize a single CSV cell value
 * Prevents formula injection by prefixing dangerous characters
 */
export function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return ''
  
  const str = String(value)
  
  // Check for dangerous formula patterns
  if (isDangerousFormula(str)) {
    console.warn(`Blocked dangerous CSV formula: ${str.substring(0, 50)}...`)
    return "'[BLOCKED]"
  }
  
  // Prefix dangerous first characters with single quote
  // This prevents Excel from interpreting as formula
  if (FORMULA_TRIGGERS.some(char => str.startsWith(char))) {
    return `'${str}`
  }
  
  // Escape double quotes for CSV format
  return str.replace(/"/g, '""')
}

/**
 * Sanitize an entire row of CSV data
 */
export function sanitizeCsvRow(row: any[]): string[] {
  return row.map(sanitizeCsvCell)
}

/**
 * Sanitize CSV content from a parsed file
 */
export function sanitizeCsvContent(rows: any[][]): any[][] {
  return rows.map(row => sanitizeCsvRow(row))
}

// ============================================
// CSV PARSING WITH SECURITY
// ============================================

/**
 * Parse CSV content safely
 * Limits rows and validates content
 */
export function safeParseCsv(content: string, options: {
  maxRows?: number
  maxColumns?: number
  skipHeader?: boolean
} = {}): string[][] {
  const { maxRows = 100000, maxColumns = 100, skipHeader = false } = options
  
  const lines = content.split(/\r?\n/).filter(line => line.trim())
  
  if (lines.length > maxRows) {
    throw new ValidationError(`CSV exceeds maximum rows (${maxRows})`)
  }
  
  const rows: string[][] = []
  
  for (let i = skipHeader ? 1 : 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Simple CSV parsing (handles quoted values)
    const cells: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      const nextChar = line[j + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          j++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        cells.push(sanitizeCsvCell(current))
        current = ''
      } else {
        current += char
      }
    }
    
    cells.push(sanitizeCsvCell(current))
    
    if (cells.length > maxColumns) {
      throw new ValidationError(`CSV row ${i + 1} exceeds maximum columns (${maxColumns})`)
    }
    
    rows.push(cells)
  }
  
  return rows
}

// ============================================
// SAFE CSV EXPORT
// ============================================

/**
 * Generate safe CSV content from data
 */
export function generateSafeCsv(
  headers: string[],
  rows: any[][],
  options: {
    includeHeaders?: boolean
    delimiter?: string
  } = {}
): string {
  const { includeHeaders = true, delimiter = ',' } = options
  
  const lines: string[] = []
  
  // Add headers
  if (includeHeaders) {
    const safeHeaders = headers.map(h => sanitizeCsvCell(h))
    lines.push(safeHeaders.map(h => `"${h}"`).join(delimiter))
  }
  
  // Add data rows
  for (const row of rows) {
    const safeRow = sanitizeCsvRow(row)
    lines.push(safeRow.map(cell => `"${cell}"`).join(delimiter))
  }
  
  return lines.join('\n')
}

// ============================================
// FILE STORAGE SECURITY
// ============================================

/**
 * Generate a safe storage path for uploaded files
 * Prevents path traversal and uses random filenames
 */
export function getSafeStoragePath(
  originalFilename: string,
  uploadDir: string = '/tmp/uploads'
): string {
  // Generate random filename to prevent overwriting
  const randomId = crypto.randomUUID()
  const safeDir = uploadDir.replace(/\.\./g, '').replace(/\/+$/, '')
  
  // Get safe extension
  const ext = originalFilename.split('.').pop()?.toLowerCase() || 'csv'
  const safeExt = ext === 'csv' ? 'csv' : 'txt'
  
  return `${safeDir}/${randomId}.${safeExt}`
}

/**
 * Validate that a file path is within allowed directories
 */
export function isPathAllowed(filePath: string, allowedDirs: string[]): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase()
  
  // Check for path traversal
  if (normalizedPath.includes('..')) {
    return false
  }
  
  // Check if path is within allowed directories
  return allowedDirs.some(dir => {
    const normalizedDir = dir.replace(/\\/g, '/').toLowerCase()
    return normalizedPath.startsWith(normalizedDir)
  })
}
