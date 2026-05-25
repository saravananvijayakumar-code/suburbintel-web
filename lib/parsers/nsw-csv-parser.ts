import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'

export interface NSWPropertySale {
  address: string
  suburb: string
  postcode: string
  salePrice: number
  saleDate: Date
  propertyType: string
  landArea?: number
}

export interface NSWSuburbStats {
  suburb: string
  state: 'NSW'
  postcode: string
  medianPrice: number
  salesCount: number
  avgLandArea?: number
  propertyTypes: Record<string, number>
  lastUpdated: Date
}

/**
 * Parse NSW Valuer General property sales CSV file
 * Format: Pipe-delimited (|) or comma-delimited
 * 
 * @param filePath - Absolute path to NSW property sales CSV file
 * @param delimiter - Delimiter used in file (default: '|')
 * @returns Array of parsed property sales
 */
export async function parseNSWPropertyData(
  filePath: string,
  delimiter: string = '|'
): Promise<NSWPropertySale[]> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    // Parse CSV with specified delimiter
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter,
      trim: true,
      relax_column_count: true, // Handle inconsistent column counts
      relax_quotes: true, // Allow malformed quotes
      escape: '\\', // Handle escape characters
      skip_records_with_error: true, // Skip problematic rows
      on_skip: (error: any) => {
        console.log(`⚠️  Skipped row at line ${error.lines}: ${error.message}`)
      },
    })

    const sales: NSWPropertySale[] = []

    for (const row of records) {
      try {
        // NSW Valuer General CSV format:
        // Property locality = suburb, Property post code = postcode
        // Purchase price = sale price, Settlement date = sale date
        const houseNumber = (row as any)['Property house number'] || ''
        const streetName = (row as any)['Property street name'] || ''
        const suburb = ((row as any)['Property locality'] || '').trim()
        const postcode = ((row as any)['Property post code'] || '').trim()
        const priceStr = (row as any)['Purchase price'] || '0'
        const dateStr = (row as any)['Settlement date'] || (row as any)['Contract date'] || ''
        const propertyType = (row as any)['Primary purpose'] || 'Residence'
        const landAreaStr = (row as any)['Area'] || ''
        
        // Skip if no suburb or postcode
        if (!suburb || !postcode) {
          continue
        }

        // Parse sale price
        const salePrice = parseFloat(priceStr.toString().replace(/[$,]/g, ''))
        
        if (isNaN(salePrice) || salePrice <= 0 || salePrice > 20000000) {
          continue // Skip invalid prices or outliers > $20M
        }

        // Parse date
        let saleDate: Date
        try {
          saleDate = new Date(dateStr)
          if (isNaN(saleDate.getTime())) {
            saleDate = new Date()
          }
        } catch {
          saleDate = new Date()
        }

        // Parse land area
        let landArea: number | undefined
        if (landAreaStr) {
          const areaNum = parseFloat(landAreaStr.toString().replace(/,/g, ''))
          if (!isNaN(areaNum) && areaNum > 0) {
            landArea = areaNum
          }
        }

        // Construct address
        const address = `${houseNumber} ${streetName}, ${suburb}`.trim()

        sales.push({
          address,
          suburb: suburb.toUpperCase(), // Standardize to uppercase
          postcode: postcode.toString(),
          salePrice,
          saleDate,
          propertyType: propertyType.trim(),
          landArea,
        })
      } catch (err) {
        console.warn('Error parsing row:', err)
        continue
      }
    }

    return sales
  } catch (error) {
    console.error('Error reading NSW property data:', error)
    throw new Error(`Failed to parse NSW property data: ${error}`)
  }
}

/**
 * Extract suburb from full address string
 * NSW addresses typically formatted as: "123 MAIN ST, SYDNEY NSW 2000"
 */
function extractSuburb(address: string): string {
  if (!address) return ''
  
  // Remove state codes and postcodes
  let cleaned = address
    .replace(/\s+NSW\s+\d{4}$/i, '') // Remove " NSW 2000"
    .replace(/\s+\d{4}$/i, '') // Remove postcode only
  
  // Split by comma and take second-to-last part (suburb)
  const parts = cleaned.split(',').map(p => p.trim())
  
  if (parts.length >= 2) {
    // Usually: "street address, SUBURB, NSW"
    return parts[parts.length - 1]
  } else if (parts.length === 1) {
    // Extract last word(s) that look like suburb (all caps)
    const words = parts[0].split(/\s+/)
    const suburbWords = []
    for (let i = words.length - 1; i >= 0; i--) {
      if (words[i].toUpperCase() === words[i] && words[i].length > 2) {
        suburbWords.unshift(words[i])
      } else {
        break
      }
    }
    return suburbWords.join(' ')
  }
  
  return ''
}

/**
 * Aggregate sales data by suburb and calculate statistics
 * 
 * @param sales - Array of NSW property sales
 * @param minSalesCount - Minimum sales required for valid median (default: 3)
 * @returns Array of suburb statistics
 */
export function aggregateNSWSuburbData(
  sales: NSWPropertySale[],
  minSalesCount: number = 3
): NSWSuburbStats[] {
  // Group by suburb + postcode combo (some suburbs span multiple postcodes)
  const suburbMap = new Map<string, {
    prices: number[]
    landAreas: number[]
    postcodes: Set<string>
    propertyTypes: Record<string, number>
    latestDate: Date
  }>()

  for (const sale of sales) {
    if (!sale.suburb) continue

    const key = sale.suburb.toUpperCase()
    
    if (!suburbMap.has(key)) {
      suburbMap.set(key, {
        prices: [],
        landAreas: [],
        postcodes: new Set(),
        propertyTypes: {},
        latestDate: sale.saleDate,
      })
    }

    const data = suburbMap.get(key)!
    data.prices.push(sale.salePrice)
    if (sale.landArea) {
      data.landAreas.push(sale.landArea)
    }
    data.postcodes.add(sale.postcode)
    
    // Count property types
    const type = sale.propertyType || 'Unknown'
    data.propertyTypes[type] = (data.propertyTypes[type] || 0) + 1
    
    // Track latest date
    if (sale.saleDate > data.latestDate) {
      data.latestDate = sale.saleDate
    }
  }

  // Calculate statistics for each suburb
  const results: NSWSuburbStats[] = []

  for (const [suburb, data] of suburbMap.entries()) {
    // Skip suburbs with insufficient sales
    if (data.prices.length < minSalesCount) {
      continue
    }

    // Calculate median price
    const sortedPrices = [...data.prices].sort((a, b) => a - b)
    const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)]

    // Calculate average land area
    let avgLandArea: number | undefined
    if (data.landAreas.length > 0) {
      avgLandArea = data.landAreas.reduce((sum, area) => sum + area, 0) / data.landAreas.length
    }

    // Use most common postcode
    const postcodeCounts = new Map<string, number>()
    for (const postcode of data.postcodes) {
      const count = sales.filter(s => s.suburb.toUpperCase() === suburb && s.postcode === postcode).length
      postcodeCounts.set(postcode, count)
    }
    const primaryPostcode = Array.from(postcodeCounts.entries())
      .sort((a, b) => b[1] - a[1])[0][0]

    results.push({
      suburb,
      state: 'NSW',
      postcode: primaryPostcode,
      medianPrice,
      salesCount: data.prices.length,
      avgLandArea,
      propertyTypes: data.propertyTypes,
      lastUpdated: data.latestDate,
    })
  }

  // Sort by suburb name
  return results.sort((a, b) => a.suburb.localeCompare(b.suburb))
}

/**
 * Load and process NSW property data from file
 * 
 * @param filePath - Path to NSW CSV file
 * @param delimiter - CSV delimiter (default: '|')
 * @returns Aggregated suburb statistics
 */
export async function loadNSWSuburbData(
  filePath: string,
  delimiter: string = '|'
): Promise<NSWSuburbStats[]> {
  console.log(`Loading NSW property data from: ${filePath}`)
  
  const sales = await parseNSWPropertyData(filePath, delimiter)
  console.log(`Parsed ${sales.length} property sales`)
  
  const suburbs = aggregateNSWSuburbData(sales)
  console.log(`Aggregated ${suburbs.length} suburbs`)
  
  return suburbs
}

/**
 * Export suburb data to JSON file
 */
export function exportSuburbDataToJSON(
  suburbs: NSWSuburbStats[],
  outputPath: string
): void {
  const data = {
    generatedAt: new Date().toISOString(),
    source: 'NSW Valuer General',
    suburbCount: suburbs.length,
    suburbs: suburbs.map(s => ({
      name: s.suburb,
      state: s.state,
      postcode: s.postcode,
      medianPrice: s.medianPrice,
      salesCount: s.salesCount,
      avgLandArea: s.avgLandArea,
      lastUpdated: s.lastUpdated.toISOString(),
    }))
  }

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`Exported ${suburbs.length} suburbs to: ${outputPath}`)
}
