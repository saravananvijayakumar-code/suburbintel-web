/**
 * Data provenance types - tracks where data comes from and how trustworthy it is.
 * This is what separates us from BS AI property tools.
 */

export type DataSource =
  | 'abs_census'           // Australian Bureau of Statistics Census
  | 'nsw_valgen'          // NSW Valuer General
  | 'vic_land_vic'        // VIC Land Victoria
  | 'domain_api'          // Domain.com.au API
  | 'realestate_api'      // REA Group API
  | 'infrastructure_au'   // Infrastructure Australia
  | 'nsw_flood_data'      // NSW Flood Data Portal
  | 'rfs_bushfire'        // Rural Fire Service Bushfire Atlas
  | 'nsw_crime_stats'     // NSW Bureau of Crime Statistics
  | 'estimated';          // Our modelled/estimated data

export type DataConfidence = 
  | 'official'      // Government data - highest trust
  | 'commercial'    // Major real estate platforms - high trust
  | 'modelled';     // Our estimates/predictions - show methodology

export interface DataProvenance {
  source: DataSource;
  last_updated: string;  // ISO date string
  confidence: DataConfidence;
  methodology_url?: string;  // Link to how we calculate/estimate
  notes?: string;  // Optional context
}

/**
 * Map data sources to human-readable labels
 */
export const DATA_SOURCE_LABELS: Record<DataSource, string> = {
  abs_census: 'Australian Bureau of Statistics',
  nsw_valgen: 'NSW Valuer General',
  vic_land_vic: 'VIC Land Victoria',
  domain_api: 'Domain.com.au',
  realestate_api: 'REA Group',
  infrastructure_au: 'Infrastructure Australia',
  nsw_flood_data: 'NSW Flood Data Portal',
  rfs_bushfire: 'RFS Bushfire Atlas',
  nsw_crime_stats: 'NSW Crime Statistics',
  estimated: 'Modelled Estimate'
};

/**
 * Map confidence levels to visual styling
 */
export const CONFIDENCE_CONFIG: Record<DataConfidence, {
  label: string;
  color: string;
  bg_color: string;
  border_color: string;
  text_color: string;
  icon: string;
}> = {
  official: {
    label: 'Official Data',
    color: 'green',
    bg_color: 'bg-green-50',
    border_color: 'border-green-200',
    text_color: 'text-green-700',
    icon: '✓'
  },
  commercial: {
    label: 'Commercial Data',
    color: 'blue',
    bg_color: 'bg-blue-50',
    border_color: 'border-blue-200',
    text_color: 'text-blue-700',
    icon: '●'
  },
  modelled: {
    label: 'Estimated',
    color: 'orange',
    bg_color: 'bg-orange-50',
    border_color: 'border-orange-200',
    text_color: 'text-orange-700',
    icon: '≈'
  }
};

/**
 * Suburb data with provenance metadata
 */
export interface SuburbDataWithProvenance {
  // Price data
  median_price_house?: {
    value: number;
    provenance: DataProvenance;
  };
  median_price_unit?: {
    value: number;
    provenance: DataProvenance;
  };
  
  // Rental data
  median_rent_house?: {
    value: number;
    provenance: DataProvenance;
  };
  median_rent_unit?: {
    value: number;
    provenance: DataProvenance;
  };
  
  // Growth data
  growth_12m?: {
    value: number;
    provenance: DataProvenance;
  };
  
  // Yield data
  gross_yield?: {
    value: number;
    provenance: DataProvenance;
  };
  
  // Demographics
  population?: {
    value: number;
    provenance: DataProvenance;
  };
  median_household_income?: {
    value: number;
    provenance: DataProvenance;
  };
  
  // Risk factors
  flood_risk?: {
    value: 'low' | 'medium' | 'high';
    provenance: DataProvenance;
  };
  bushfire_risk?: {
    value: 'low' | 'medium' | 'high';
    provenance: DataProvenance;
  };
  crime_index?: {
    value: number;
    provenance: DataProvenance;
  };
  
  // Infrastructure
  train_stations?: {
    value: number;
    provenance: DataProvenance;
  };
  schools?: {
    value: number;
    provenance: DataProvenance;
  };
}
