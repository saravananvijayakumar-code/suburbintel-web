/**
 * Single source of truth for suburb coverage counts.
 * UPDATE THESE NUMBERS WHEN DATA CHANGES - NO EXCEPTIONS.
 */

export const COVERAGE = {
  // Full government dataset (NSW Valuer General + VIC Land Victoria + ABS)
  nsw_full: 628,
  vic_full: 544,
  
  // ABS Census data only (no state valuation data)
  national_abs: 1087,
  
  // Total suburbs in Australia (target market)
  total_addressable: 2259,
  
  // Computed values
  get full_coverage() {
    return this.nsw_full + this.vic_full;
  },
  
  get searchable() {
    return this.full_coverage + this.national_abs;
  },
  
  get coverage_percentage() {
    return Math.round((this.full_coverage / this.total_addressable) * 100);
  }
} as const;

/**
 * Canonical messaging for coverage counts.
 * Use these EVERYWHERE - homepage, pricing, FAQ, search, etc.
 */
export const COVERAGE_MESSAGING = {
  // Hero/headline messaging
  hero: `${COVERAGE.full_coverage.toLocaleString()} suburbs with complete investment data`,
  
  // Detailed breakdown
  details: `${COVERAGE.nsw_full} NSW suburbs + ${COVERAGE.vic_full} VIC suburbs with full government datasets | ${COVERAGE.national_abs} additional suburbs with ABS demographic data`,
  
  // Short version for UI
  short: `${COVERAGE.full_coverage.toLocaleString()} suburbs analyzed`,
  
  // Roadmap messaging
  roadmap: `${COVERAGE.total_addressable - COVERAGE.searchable} suburbs coming Q1 2026`,
  
  // Search page filter text
  search_filter_full: `Complete data (${COVERAGE.full_coverage.toLocaleString()} suburbs)`,
  search_filter_all: `All searchable (${COVERAGE.searchable.toLocaleString()} suburbs)`,
  
  // FAQ answer
  faq_which_suburbs: `We have complete investment data for ${COVERAGE.full_coverage.toLocaleString()} suburbs across NSW (${COVERAGE.nsw_full}) and VIC (${COVERAGE.vic_full}). This includes median prices, rental yields, growth rates, infrastructure, demographics, and risk factors from official government sources. An additional ${COVERAGE.national_abs} suburbs have basic demographic data from the Australian Bureau of Statistics.`
} as const;

/**
 * Data completeness levels for suburb cards/badges
 */
export enum DataCompleteness {
  COMPLETE = 'complete',  // Full government dataset
  BASIC = 'basic',        // ABS only
  COMING_SOON = 'coming'  // Not yet available
}

export const DATA_COMPLETENESS_CONFIG = {
  [DataCompleteness.COMPLETE]: {
    label: 'Complete Data',
    badge_color: 'green',
    icon: '🟢',
    description: 'Full government dataset including prices, yields, growth, infrastructure, and risk factors'
  },
  [DataCompleteness.BASIC]: {
    label: 'Basic Data',
    badge_color: 'yellow',
    icon: '🟡',
    description: 'Demographic data from ABS Census. Price and yield data limited.'
  },
  [DataCompleteness.COMING_SOON]: {
    label: 'Coming Soon',
    badge_color: 'blue',
    icon: '🔵',
    description: 'Suburb data collection in progress. Expected Q1 2026.'
  }
} as const;
