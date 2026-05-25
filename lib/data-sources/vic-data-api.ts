/**
 * Victorian Valuer-General API Integration
 * Data Source: https://discover.data.vic.gov.au/
 * Official property valuations for Victorian suburbs
 */

export interface VICPropertyData {
  suburbName: string;
  postcode: string;
  medianHousePrice: number;
  medianUnitPrice: number;
  landValue: number;
  quarterlyGrowth: number;
  annualGrowth: number;
  salesVolume: number;
  lastUpdated: Date;
}

/**
 * Fetch Victorian suburb property data
 * Free access via Victorian Government Open Data Portal
 */
export async function fetchVICSuburbData(
  suburbName: string,
  postcode?: string
): Promise<VICPropertyData | null> {
  try {
    // Victorian Data Portal API
    const baseUrl = 'https://discover.data.vic.gov.au/api/3/action/datastore_search';
    
    // Victorian property sales dataset
    const resourceId = 'vic-property-sales'; // Placeholder - update with real ID
    
    const params = new URLSearchParams({
      resource_id: resourceId,
      q: suburbName,
    });

    if (postcode) {
      params.append('filters', JSON.stringify({ postcode }));
    }

    const response = await fetch(`${baseUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`VIC API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.result?.records || data.result.records.length === 0) {
      return null;
    }

    const record = data.result.records[0];
    
    return {
      suburbName: record.suburb || suburbName,
      postcode: record.postcode || postcode || '',
      medianHousePrice: parseFloat(record.median_house_price) || 0,
      medianUnitPrice: parseFloat(record.median_unit_price) || 0,
      landValue: parseFloat(record.land_value) || 0,
      quarterlyGrowth: parseFloat(record.quarterly_growth) || 0,
      annualGrowth: parseFloat(record.annual_growth) || 0,
      salesVolume: parseInt(record.sales_volume) || 0,
      lastUpdated: new Date(record.date_updated || Date.now()),
    };
  } catch (error) {
    console.error('Error fetching VIC data:', error);
    return null;
  }
}

/**
 * Fetch all Victorian suburbs
 */
export async function fetchAllVICSuburbs(): Promise<VICPropertyData[]> {
  try {
    console.log('📍 Fetching Victorian suburbs from Valuer-General...');
    
    const allSuburbs: VICPropertyData[] = [];
    let offset = 0;
    const limit = 1000;
    let hasMore = true;

    const baseUrl = 'https://discover.data.vic.gov.au/api/3/action/datastore_search';
    const resourceId = 'vic-property-sales'; // Placeholder

    while (hasMore) {
      const params = new URLSearchParams({
        resource_id: resourceId,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`${baseUrl}?${params}`);
      
      if (!response.ok) {
        console.error(`VIC API error at offset ${offset}`);
        break;
      }

      const data = await response.json();
      const records = data.result?.records || [];

      if (records.length === 0) {
        hasMore = false;
        break;
      }

      for (const record of records) {
        allSuburbs.push({
          suburbName: record.suburb,
          postcode: record.postcode || '',
          medianHousePrice: parseFloat(record.median_house_price) || 0,
          medianUnitPrice: parseFloat(record.median_unit_price) || 0,
          landValue: parseFloat(record.land_value) || 0,
          quarterlyGrowth: parseFloat(record.quarterly_growth) || 0,
          annualGrowth: parseFloat(record.annual_growth) || 0,
          salesVolume: parseInt(record.sales_volume) || 0,
          lastUpdated: new Date(record.date_updated || Date.now()),
        });
      }

      offset += limit;
      
      if (records.length < limit) {
        hasMore = false;
      }
    }

    console.log(`✅ Fetched ${allSuburbs.length} VIC suburbs`);
    return allSuburbs;
  } catch (error) {
    console.error('Error fetching VIC suburbs:', error);
    return [];
  }
}

/**
 * Estimate rental yield for Victorian properties
 */
export function estimateRentalYield(medianPrice: number, region: string = 'metro'): number {
  // Melbourne metro: 2.8-3.8%
  // Regional VIC: 4.5-6%
  const baseYield = region.toLowerCase().includes('melbourne') ? 3.3 : 5.0;
  
  if (medianPrice > 1200000) {
    return baseYield - 0.5;
  } else if (medianPrice < 400000) {
    return baseYield + 1.0;
  }
  
  return baseYield;
}

export default {
  fetchVICSuburbData,
  fetchAllVICSuburbs,
  estimateRentalYield,
};
