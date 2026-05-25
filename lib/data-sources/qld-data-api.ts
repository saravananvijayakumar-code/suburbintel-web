/**
 * Queensland Valuer-General API Integration
 * Data Source: https://data.qld.gov.au/
 * Official property valuations for Queensland suburbs
 */

export interface QLDPropertyData {
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
 * Fetch Queensland suburb property data
 * Free access via QLD Government Open Data Portal
 */
export async function fetchQLDSuburbData(
  suburbName: string,
  postcode?: string
): Promise<QLDPropertyData | null> {
  try {
    // Queensland Data Portal API
    const baseUrl = 'https://data.qld.gov.au/api/3/action/datastore_search';
    
    // QLD property valuation dataset
    const resourceId = 'qld-property-valuations'; // Placeholder
    
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
      console.error(`QLD API error: ${response.status}`);
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
    console.error('Error fetching QLD data:', error);
    return null;
  }
}

/**
 * Fetch all Queensland suburbs
 */
export async function fetchAllQLDSuburbs(): Promise<QLDPropertyData[]> {
  try {
    console.log('🌴 Fetching Queensland suburbs from Valuer-General...');
    
    const allSuburbs: QLDPropertyData[] = [];
    let offset = 0;
    const limit = 1000;
    let hasMore = true;

    const baseUrl = 'https://data.qld.gov.au/api/3/action/datastore_search';
    const resourceId = 'qld-property-valuations'; // Placeholder

    while (hasMore) {
      const params = new URLSearchParams({
        resource_id: resourceId,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`${baseUrl}?${params}`);
      
      if (!response.ok) {
        console.error(`QLD API error at offset ${offset}`);
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

    console.log(`✅ Fetched ${allSuburbs.length} QLD suburbs`);
    return allSuburbs;
  } catch (error) {
    console.error('Error fetching QLD suburbs:', error);
    return [];
  }
}

/**
 * Estimate rental yield for Queensland properties
 */
export function estimateRentalYield(medianPrice: number, region: string = 'metro'): number {
  // Brisbane/Gold Coast: 3.5-4.5%
  // Regional QLD: 5-7%
  const baseYield = region.toLowerCase().includes('brisbane') || 
                     region.toLowerCase().includes('gold coast') ? 4.0 : 5.5;
  
  if (medianPrice > 1000000) {
    return baseYield - 0.5;
  } else if (medianPrice < 400000) {
    return baseYield + 1.5;
  }
  
  return baseYield;
}

export default {
  fetchQLDSuburbData,
  fetchAllQLDSuburbs,
  estimateRentalYield,
};
