/**
 * Australian Bureau of Statistics (ABS) Census CSV Parser
 * Parses ABS 2021 Census DataPacks for suburb demographics
 * Source: abs.gov.au
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export interface ABSSuburbData {
  suburbName: string;
  state: string;
  population: number;
  medianAge: number;
  medianIncome: number;
  medianRent: number;
  unemploymentRate: number;
  seifaScore?: number;
  seifaDecile?: number;
  dataSource: 'ABS Census 2021';
  dataQuality: 'high';
}

/**
 * Parse ABS Census G02 - Demographics by Suburb
 * File: 2021Census_G02_AUS_SAL.csv
 */
export async function parseABSDemographics(filePath: string): Promise<Map<string, ABSSuburbData>> {
  console.log('📊 Parsing ABS Census Demographics (G02)...');
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filePath}`);
    console.warn(`Download from: https://www.abs.gov.au/census/find-census-data/datapacks`);
    return new Map();
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`✅ Found ${records.length} records in demographics file`);

  const suburbsMap = new Map<string, ABSSuburbData>();

  for (const row of records) {
    try {
      // Extract suburb name from SAL (Statistical Area Level 2)
      const salName = (row as any)['SAL_NAME_2021'] || (row as any)['SAL_NAME'] || (row as any)['Suburb'];
      if (!salName) continue;

      const { suburbName, state } = extractSuburbAndState(salName);
      if (!suburbName || !state) continue;

      // Parse population (Males + Females)
      const malePopulation = parseInt((row as any)['Tot_P_M'] || (row as any)['Male']) || 0;
      const femalePopulation = parseInt((row as any)['Tot_P_F'] || (row as any)['Female']) || 0;
      const population = malePopulation + femalePopulation;

      if (population < 100) continue; // Skip very small areas

      // Parse median age
      const medianAge = parseFloat((row as any)['Median_age_persons'] || (row as any)['Median_Age']) || 0;

      // Create suburb data
      suburbsMap.set(`${suburbName}|${state}`, {
        suburbName,
        state,
        population,
        medianAge,
        medianIncome: 0, // Will be filled from G17
        medianRent: 0, // Will be filled from G43
        unemploymentRate: 0, // Will be calculated
        dataSource: 'ABS Census 2021',
        dataQuality: 'high'
      });
    } catch (error) {
      console.warn(`⚠️ Skipping invalid row:`, error);
    }
  }

  console.log(`✅ Parsed ${suburbsMap.size} suburbs from demographics data`);
  
  return suburbsMap;
}

/**
 * Parse ABS Census G17 - Income Data
 * File: 2021Census_G17_AUS_SAL.csv
 */
export async function parseABSIncome(
  filePath: string, 
  suburbsMap: Map<string, ABSSuburbData>
): Promise<void> {
  console.log('📊 Parsing ABS Census Income Data (G17)...');
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filePath}`);
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`✅ Found ${records.length} income records`);

  let updated = 0;

  for (const row of records) {
    try {
      const salName = (row as any)['SAL_NAME_2021'] || (row as any)['SAL_NAME'];
      if (!salName) continue;

      const { suburbName, state } = extractSuburbAndState(salName);
      const key = `${suburbName}|${state}`;

      const suburb = suburbsMap.get(key);
      if (!suburb) continue;

      // Parse median weekly income
      const medianIncome = parseInt(
        (row as any)['Median_tot_hhd_inc_weekly'] || 
        (row as any)['Median_Household_Income'] ||
        (row as any)['Median_Income']
      ) || 0;

      if (medianIncome > 0) {
        suburb.medianIncome = medianIncome * 52; // Convert to annual
        updated++;
      }
    } catch (error) {
      console.warn(`⚠️ Error parsing income row:`, error);
    }
  }

  console.log(`✅ Updated income data for ${updated} suburbs`);
}

/**
 * Parse ABS Census G43 - Housing and Rent Data
 * File: 2021Census_G43_AUS_SAL.csv
 */
export async function parseABSHousing(
  filePath: string,
  suburbsMap: Map<string, ABSSuburbData>
): Promise<void> {
  console.log('📊 Parsing ABS Census Housing Data (G43)...');
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filePath}`);
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`✅ Found ${records.length} housing records`);

  let updated = 0;

  for (const row of records) {
    try {
      const salName = (row as any)['SAL_NAME_2021'] || (row as any)['SAL_NAME'];
      if (!salName) continue;

      const { suburbName, state } = extractSuburbAndState(salName);
      const key = `${suburbName}|${state}`;

      const suburb = suburbsMap.get(key);
      if (!suburb) continue;

      // Parse median weekly rent
      const medianRent = parseInt(
        (row as any)['Median_rent_weekly'] || 
        (row as any)['Median_Rent'] ||
        (row as any)['Rent']
      ) || 0;

      if (medianRent > 0) {
        suburb.medianRent = medianRent * 52; // Convert to annual
        updated++;
      }
    } catch (error) {
      console.warn(`⚠️ Error parsing housing row:`, error);
    }
  }

  console.log(`✅ Updated housing data for ${updated} suburbs`);
}

/**
 * Extract suburb name and state from ABS SAL name
 * Format examples: 
 * - "Oakville (NSW)" 
 * - "Melbourne (Vic.)"
 * - "Brisbane - CBD"
 */
function extractSuburbAndState(salName: string): { suburbName: string; state: string } {
  // Clean the name
  let cleaned = salName.trim();

  // Extract state from parentheses
  const stateMatch = cleaned.match(/\(([^)]+)\)$/);
  let state = '';
  
  if (stateMatch) {
    state = normalizeState(stateMatch[1]);
    cleaned = cleaned.replace(/\([^)]+\)$/, '').trim();
  } else {
    // Try to find state abbreviation at the end
    const endStateMatch = cleaned.match(/\b(NSW|VIC|QLD|SA|WA|TAS|NT|ACT)\b$/i);
    if (endStateMatch) {
      state = endStateMatch[1].toUpperCase();
      cleaned = cleaned.replace(/\b(NSW|VIC|QLD|SA|WA|TAS|NT|ACT)\b$/i, '').trim();
    }
  }

  // Clean suburb name
  const suburbName = cleaned
    .replace(/\s+-\s+/g, ' ') // Replace " - " with space
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return { suburbName, state };
}

/**
 * Normalize state abbreviations
 */
function normalizeState(state: string): string {
  const normalized = state.toUpperCase().replace(/\./g, '');
  
  const stateMap: Record<string, string> = {
    'NEW SOUTH WALES': 'NSW',
    'VICTORIA': 'VIC',
    'QUEENSLAND': 'QLD',
    'SOUTH AUSTRALIA': 'SA',
    'WESTERN AUSTRALIA': 'WA',
    'TASMANIA': 'TAS',
    'NORTHERN TERRITORY': 'NT',
    'AUSTRALIAN CAPITAL TERRITORY': 'ACT'
  };

  return stateMap[normalized] || normalized;
}

/**
 * Calculate SEIFA decile from score
 * SEIFA = Socio-Economic Indexes for Areas
 * Score 900-1100 typical range, decile 1-10
 */
export function calculateSEIFADecile(seifaScore: number): number {
  if (seifaScore < 850) return 1;
  if (seifaScore < 900) return 2;
  if (seifaScore < 950) return 3;
  if (seifaScore < 980) return 4;
  if (seifaScore < 1000) return 5;
  if (seifaScore < 1020) return 6;
  if (seifaScore < 1050) return 7;
  if (seifaScore < 1100) return 8;
  if (seifaScore < 1150) return 9;
  return 10;
}

/**
 * Estimate median rent from median income if rent data unavailable
 * Rule of thumb: Rent = 30% of household income
 */
export function estimateMedianRentFromIncome(medianIncome: number): number {
  return Math.round((medianIncome * 0.30) / 52); // Weekly rent
}

/**
 * Load all ABS Census data from CSV files
 */
export async function loadAllABSData(dataDir: string): Promise<ABSSuburbData[]> {
  console.log('📊 Loading ABS Census Data from CSVs...');
  console.log(`📁 Data directory: ${dataDir}`);

  // Step 1: Load demographics (G02)
  const g02Path = path.join(dataDir, '2021Census_G02_AUS_SAL.csv');
  const suburbsMap = await parseABSDemographics(g02Path);

  if (suburbsMap.size === 0) {
    console.warn('⚠️ No demographics data loaded. Check file path and format.');
    return [];
  }

  // Step 2: Add income data (G17)
  const g17Path = path.join(dataDir, '2021Census_G17_AUS_SAL.csv');
  if (fs.existsSync(g17Path)) {
    await parseABSIncome(g17Path, suburbsMap);
  } else {
    console.warn(`⚠️ Income data file not found: ${g17Path}`);
  }

  // Step 3: Add housing/rent data (G43)
  const g43Path = path.join(dataDir, '2021Census_G43_AUS_SAL.csv');
  if (fs.existsSync(g43Path)) {
    await parseABSHousing(g43Path, suburbsMap);
  } else {
    console.warn(`⚠️ Housing data file not found: ${g43Path}`);
  }

  // Convert to array
  const suburbs = Array.from(suburbsMap.values());

  // Estimate missing rent data from income
  let estimatedRent = 0;
  for (const suburb of suburbs) {
    if (suburb.medianRent === 0 && suburb.medianIncome > 0) {
      suburb.medianRent = estimateMedianRentFromIncome(suburb.medianIncome);
      estimatedRent++;
    }
  }

  console.log(`✅ Loaded ${suburbs.length} suburbs from ABS Census data`);
  console.log(`📍 Estimated rent for ${estimatedRent} suburbs from income data`);
  console.log(`📍 Sample: ${suburbs.slice(0, 3).map(s => `${s.suburbName}, ${s.state}`).join('; ')}`);

  return suburbs;
}

// Example usage:
/*
const absData = await loadAllABSData('./data');

for (const suburb of absData.slice(0, 5)) {
  console.log(`${suburb.suburbName}, ${suburb.state}`);
  console.log(`  Population: ${suburb.population.toLocaleString()}`);
  console.log(`  Median Age: ${suburb.medianAge} years`);
  console.log(`  Median Income: $${suburb.medianIncome.toLocaleString()}/year`);
  console.log(`  Median Rent: $${suburb.medianRent.toLocaleString()}/year`);
}
*/
