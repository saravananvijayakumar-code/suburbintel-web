/**
 * NSW Valuer-General API Integration
 * Data Source: https://data.nsw.gov.au/
 * Official property valuations for NSW suburbs
 */

export interface NSWPropertyData {
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
 * Fetch NSW suburb property data from NSW Valuer-General
 * Free, no API key required for public data
 */
export async function fetchNSWSuburbData(
  suburbName: string,
  postcode?: string
): Promise<NSWPropertyData | null> {
  try {
    // NSW Data Portal API endpoint
    // Using publicly available property sales data
    const baseUrl = 'https://data.nsw.gov.au/data/api/3/action/datastore_search';
    
    // For now, we'll use a static dataset identifier
    // In production, this would be the actual NSW Valuer-General dataset
    const resourceId = 'property-sales-data'; // Placeholder - update with real resource ID
    
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
      console.error(`NSW API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.result?.records || data.result.records.length === 0) {
      return null;
    }

    // Transform NSW data to our format
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
    console.error('Error fetching NSW data:', error);
    return null;
  }
}

/**
 * Fetch all NSW suburbs data
 * Returns array of all available NSW suburbs
 */
export async function fetchAllNSWSuburbs(): Promise<NSWPropertyData[]> {
  try {
    // For bulk fetch, we'll use a different endpoint or paginate
    const baseUrl = 'https://data.nsw.gov.au/data/api/3/action/datastore_search';
    const resourceId = 'property-sales-data'; // Placeholder
    
    const allSuburbs: NSWPropertyData[] = [];
    let offset = 0;
    const limit = 1000; // Fetch 1000 records at a time
    let hasMore = true;

    while (hasMore) {
      const params = new URLSearchParams({
        resource_id: resourceId,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`${baseUrl}?${params}`);
      
      if (!response.ok) {
        console.error(`NSW API error at offset ${offset}: ${response.status}`);
        break;
      }

      const data = await response.json();
      const records = data.result?.records || [];

      if (records.length === 0) {
        hasMore = false;
        break;
      }

      // Transform each record
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
      
      // If we got fewer than limit, we've reached the end
      if (records.length < limit) {
        hasMore = false;
      }
    }

    console.log(`✅ Fetched ${allSuburbs.length} NSW suburbs from Valuer-General`);
    return allSuburbs;
  } catch (error) {
    console.error('Error fetching all NSW suburbs:', error);
    return [];
  }
}

/**
 * Calculate rental yield estimate based on median price
 * NSW typical rental yields by region
 */
export function estimateRentalYield(medianPrice: number, region: string = 'metro'): number {
  // Conservative estimates based on NSW property market
  // Metro Sydney: 2.5-3.5%
  // Regional NSW: 4-6%
  const baseYield = region.toLowerCase().includes('sydney') ? 3.0 : 4.5;
  
  // Adjust for price range
  if (medianPrice > 1500000) {
    return baseYield - 0.5; // Expensive properties typically lower yield
  } else if (medianPrice < 500000) {
    return baseYield + 1.0; // Cheaper properties typically higher yield
  }
  
  return baseYield;
}

export default {
  fetchNSWSuburbData,
  fetchAllNSWSuburbs,
  estimateRentalYield,
};
