/**
 * Australian Bureau of Statistics (ABS) API Integration
 * Data Source: https://api.data.abs.gov.au/
 * Demographics, population, income, employment data
 */

export interface ABSDemographicData {
  suburbName: string;
  state: string;
  population: number;
  medianAge: number;
  medianIncome: number;
  employmentRate: number;
  medianRent: number;
  dwellingCount: number;
  familyCount: number;
  seifaIndex: number; // Socio-Economic Indexes for Areas
  lastCensusYear: number;
  lastUpdated: Date;
}

/**
 * Fetch demographic data from ABS for a specific suburb
 * ABS API is free and unlimited for public use
 */
export async function fetchABSDemographics(
  suburbName: string,
  state: string
): Promise<ABSDemographicData | null> {
  try {
    // ABS Data API endpoint for Census data
    const baseUrl = 'https://api.data.abs.gov.au/data';
    
    // Census 2021 data series (most recent)
    // ABS uses SAL (Suburb and Locality) codes
    const dataflow = 'ABS,C21_G02_LGA,1.0.0'; // General Community Profile
    
    // Build query for suburb
    // In production, you'd need to map suburb names to SAL codes
    const suburbCode = await getSuburbSALCode(suburbName, state);
    
    if (!suburbCode) {
      console.warn(`No SAL code found for ${suburbName}, ${state}`);
      return null;
    }

    const response = await fetch(`${baseUrl}/${dataflow}/${suburbCode}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`ABS API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    // Parse ABS response structure
    const observations = data.data?.dataSets?.[0]?.observations || {};
    
    // Extract demographic metrics
    // ABS data structure is complex, this is simplified
    const demographics: ABSDemographicData = {
      suburbName,
      state,
      population: extractMetric(observations, 'population') || 0,
      medianAge: extractMetric(observations, 'median_age') || 0,
      medianIncome: extractMetric(observations, 'median_income') || 0,
      employmentRate: extractMetric(observations, 'employment_rate') || 0,
      medianRent: extractMetric(observations, 'median_rent') || 0,
      dwellingCount: extractMetric(observations, 'dwelling_count') || 0,
      familyCount: extractMetric(observations, 'family_count') || 0,
      seifaIndex: extractMetric(observations, 'seifa_index') || 1000, // Default middle index
      lastCensusYear: 2021,
      lastUpdated: new Date(),
    };

    return demographics;
  } catch (error) {
    console.error('Error fetching ABS demographics:', error);
    return null;
  }
}

/**
 * Get SAL (Suburb and Locality) code for a suburb
 * This would ideally be from a mapping table
 */
async function getSuburbSALCode(suburbName: string, state: string): Promise<string | null> {
  // In production, this would query a mapping table of suburb names to SAL codes
  // For now, return a placeholder
  // You'd need to download the ABS correspondence files
  return null;
}

/**
 * Extract specific metric from ABS observations object
 */
function extractMetric(observations: any, metricKey: string): number | null {
  // ABS observations are structured as key-value pairs
  // This is a simplified extraction
  for (const [key, value] of Object.entries(observations)) {
    if (key.includes(metricKey)) {
      return typeof value === 'number' ? value : parseFloat(String(value));
    }
  }
  return null;
}

/**
 * Fetch all suburbs with demographics
 * Returns comprehensive list from Census data
 */
export async function fetchAllABSSuburbs(): Promise<ABSDemographicData[]> {
  try {
    console.log('📊 Fetching all suburbs from ABS Census data...');
    
    // ABS provides bulk download files for Census data
    // For production, download and parse the CSV files
    const censusDataUrl = 'https://www.abs.gov.au/census/find-census-data/datapacks';
    
    // For now, return empty array
    // In production, you'd download and parse Census DataPacks
    console.warn('ABS bulk download requires manual CSV processing');
    console.log('Download from: https://www.abs.gov.au/census/find-census-data/datapacks');
    
    return [];
  } catch (error) {
    console.error('Error fetching ABS suburbs:', error);
    return [];
  }
}

/**
 * Calculate SEIFA decile (1-10, 10 = most advantaged)
 * SEIFA = Socio-Economic Indexes for Areas
 */
export function calculateSEIFADecile(seifaScore: number): number {
  // SEIFA scores typically range from 800-1200
  // Convert to decile (1-10)
  if (seifaScore >= 1150) return 10;
  if (seifaScore >= 1100) return 9;
  if (seifaScore >= 1050) return 8;
  if (seifaScore >= 1000) return 7;
  if (seifaScore >= 950) return 6;
  if (seifaScore >= 900) return 5;
  if (seifaScore >= 850) return 4;
  if (seifaScore >= 800) return 3;
  if (seifaScore >= 750) return 2;
  return 1;
}

/**
 * Estimate median rent from median income
 * Rule of thumb: 30% of income goes to rent
 */
export function estimateMedianRent(medianIncome: number): number {
  // Median income is typically annual
  // Calculate weekly rent (30% of annual / 52 weeks)
  return Math.round((medianIncome * 0.30) / 52);
}

export default {
  fetchABSDemographics,
  fetchAllABSSuburbs,
  calculateSEIFADecile,
  estimateMedianRent,
};
