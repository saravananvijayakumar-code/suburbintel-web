/**
 * Victorian Property Data XLSX Parser
 * Parses the official Victorian Property Sales Report Excel file
 * Source: Victorian Valuer-General via discover.data.vic.gov.au
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

export interface VICSuburbData {
  suburbName: string;
  postcode?: string;
  state: 'VIC';
  medianPrice: number;
  salesCount: number;
  yearlyData: {
    year: number;
    medianPrice: number;
    salesCount: number;
  }[];
  dataSource: 'VIC Valuer-General';
  dataQuality: 'high';
  lastUpdated: Date;
}

/**
 * Parse Victorian Property Sales XLSX file
 * Expected file: Houses-by-suburb-2013-2023.xlsx
 */
export async function parseVICPropertyXLSX(filePath: string): Promise<VICSuburbData[]> {
  console.log('📊 Parsing Victorian Property Sales Report...');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}\n\nPlease download from:\nhttps://www.land.vic.gov.au/__data/assets/excel_doc/0029/709751/Houses-by-suburb-2013-2023.xlsx`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // First sheet
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`✅ Found ${data.length} rows in Excel file`);

  const suburbsMap = new Map<string, VICSuburbData>();

  for (const row of data) {
    try {
      // Extract suburb name (adjust column names based on actual Excel file)
      const suburbName = cleanSuburbName(
        row['Suburb'] || 
        row['suburb'] || 
        row['SUBURB'] ||
        row['Locality'] ||
        row['locality']
      );
      
      if (!suburbName || suburbName.length < 2) continue;

      // Extract postcode if available
      const postcode = extractPostcode(
        row['Postcode'] || 
        row['postcode'] || 
        row['Post Code'] ||
        row['post_code']
      );

      // Get most recent year's data (last column with data)
      const years = Object.keys(row).filter(key => /^\d{4}$/.test(key));
      const latestYear = Math.max(...years.map(Number));
      const latestPrice = parseFloat(row[latestYear.toString()]);

      if (!latestPrice || isNaN(latestPrice) || latestPrice <= 0) continue;

      // Extract yearly data
      const yearlyData = years.map(year => ({
        year: parseInt(year),
        medianPrice: parseFloat(row[year]) || 0,
        salesCount: parseInt(row[`${year}_sales`]) || 0
      })).filter(y => y.medianPrice > 0);

      // Create or update suburb data
      if (!suburbsMap.has(suburbName)) {
        suburbsMap.set(suburbName, {
          suburbName,
          postcode,
          state: 'VIC',
          medianPrice: latestPrice,
          salesCount: parseInt(row[`${latestYear}_sales`]) || 0,
          yearlyData,
          dataSource: 'VIC Valuer-General',
          dataQuality: 'high',
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      // Skip invalid rows
      console.warn(`⚠️ Skipping invalid row:`, error);
    }
  }

  const suburbs = Array.from(suburbsMap.values());
  
  console.log(`✅ Successfully parsed ${suburbs.length} Victorian suburbs`);
  console.log(`📍 Sample suburbs: ${suburbs.slice(0, 5).map(s => s.suburbName).join(', ')}`);
  
  return suburbs;
}

/**
 * Alternative parser for quarterly data files
 * Expected file: median-house-q1-2025.xls
 */
export async function parseVICQuarterlyXLS(filePath: string): Promise<VICSuburbData[]> {
  console.log('📊 Parsing Victorian Quarterly Property Sales Report...');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`✅ Found ${data.length} rows in quarterly file`);

  const suburbs: VICSuburbData[] = [];

  for (const row of data) {
    try {
      const suburbName = cleanSuburbName(
        row['Suburb'] || 
        row['suburb'] || 
        row['Locality']
      );
      
      if (!suburbName) continue;

      const medianPrice = parseFloat(
        row['Median Price'] || 
        row['median_price'] ||
        row['Median'] ||
        row['Price']
      );

      if (!medianPrice || isNaN(medianPrice) || medianPrice <= 0) continue;

      const salesCount = parseInt(
        row['Sales'] || 
        row['sales'] ||
        row['Number of Sales'] ||
        row['Count']
      ) || 0;

      suburbs.push({
        suburbName,
        postcode: extractPostcode(row['Postcode'] || row['postcode']),
        state: 'VIC',
        medianPrice,
        salesCount,
        yearlyData: [{
          year: new Date().getFullYear(),
          medianPrice,
          salesCount
        }],
        dataSource: 'VIC Valuer-General',
        dataQuality: 'high',
        lastUpdated: new Date()
      });
    } catch (error) {
      console.warn(`⚠️ Skipping invalid row:`, error);
    }
  }

  console.log(`✅ Successfully parsed ${suburbs.length} Victorian suburbs from quarterly data`);
  
  return suburbs;
}

/**
 * Clean suburb name (remove extra whitespace, special chars)
 */
function cleanSuburbName(name: any): string {
  if (!name) return '';
  
  return String(name)
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s-']/g, '') // Remove special chars except dash and apostrophe
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extract postcode from various formats
 */
function extractPostcode(value: any): string | undefined {
  if (!value) return undefined;
  
  const str = String(value).trim();
  
  // Match 4-digit Australian postcode
  const match = str.match(/\b(\d{4})\b/);
  return match ? match[1] : undefined;
}

/**
 * Estimate rental yield for Victorian properties
 */
export function estimateVICRentalYield(medianPrice: number, region: string): number {
  // Melbourne metro vs regional Victoria
  const isMelbourne = ['melbourne', 'metro'].some(term => 
    region.toLowerCase().includes(term)
  );

  if (isMelbourne) {
    // Melbourne metro: 2.5-3.5%
    if (medianPrice > 1500000) return 2.5;
    if (medianPrice > 1000000) return 2.8;
    if (medianPrice > 700000) return 3.2;
    return 3.5;
  } else {
    // Regional VIC: 3.5-5.0%
    if (medianPrice > 800000) return 3.5;
    if (medianPrice > 500000) return 4.0;
    if (medianPrice > 300000) return 4.5;
    return 5.0;
  }
}

/**
 * Calculate annual growth from yearly data
 */
export function calculateGrowthRate(yearlyData: VICSuburbData['yearlyData']): number {
  if (yearlyData.length < 2) return 0;

  const sorted = [...yearlyData].sort((a, b) => a.year - b.year);
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  
  const years = newest.year - oldest.year;
  if (years === 0) return 0;

  const totalGrowth = ((newest.medianPrice - oldest.medianPrice) / oldest.medianPrice) * 100;
  return totalGrowth / years; // Annual growth rate
}

// Example usage:
/*
const suburbs = await parseVICPropertyXLSX('./data/Houses-by-suburb-2013-2023.xlsx');

for (const suburb of suburbs) {
  console.log(`${suburb.suburbName}, VIC ${suburb.postcode || ''}`);
  console.log(`  Median Price: $${suburb.medianPrice.toLocaleString()}`);
  console.log(`  Sales Count: ${suburb.salesCount}`);
  console.log(`  Annual Growth: ${calculateGrowthRate(suburb.yearlyData).toFixed(2)}%`);
  console.log(`  Rental Yield: ${estimateVICRentalYield(suburb.medianPrice, suburb.suburbName).toFixed(2)}%`);
}
*/
