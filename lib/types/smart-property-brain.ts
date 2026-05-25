/**
 * Smart Property Brain - Comprehensive Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the upgraded
 * SuburbIntelAU Smart Property Brain platform.
 */

// ============================================================================
// CORE SUBURB METRICS
// ============================================================================

export interface SuburbMetrics {
  // Basic Info
  id: string
  name: string
  state: string
  postcode: string
  
  // 1. PRICING METRICS
  pricing: {
    medianHousePrice: number | null
    medianUnitPrice: number | null
    priceGrowth6m: number | null
    priceGrowth12m: number | null
    priceGrowth3y: number | null
    priceGrowth5y: number | null
    priceGrowth10y: number | null
    priceVolatilityScore: number | null // 0-100 (lower = more stable)
  }
  
  // 2. RENT & YIELD METRICS
  rental: {
    medianHouseRent: number | null
    medianUnitRent: number | null
    grossYieldHouse: number | null
    grossYieldUnit: number | null
    rentalYield: number | null // Overall yield
    rentalGrowth12m: number | null
    vacancyRate: number | null
    rentalRiskScore: number | null // 0-100 (lower = less risky)
  }
  
  // 3. SUPPLY & DEMAND METRICS
  market: {
    listingsCurrent: number | null
    listingsTrend3m: 'up' | 'down' | 'stable' | null
    stockOnMarketPct: number | null
    daysOnMarket: number | null
    salesVolumeMonthly: number | null
    salesVolumeTrend3m: 'up' | 'down' | 'stable' | null
    auctionClearance: number | null
    demandScore: number | null // 0-100 (higher = more demand)
  }
  
  // 4. DEVELOPMENT & OVERSUPPLY
  development: {
    dwellingApprovalsYTD: number | null
    apartmentPipeline: number | null
    landSubdivisionActivity: number | null
    oversupplyRiskScore: number | null // 0-100 (lower = less risk)
    developmentActivity: string | null
  }
  
  // 5. DEMOGRAPHICS
  demographics: {
    population: number | null
    populationGrowthRate: number | null
    medianIncome: number | null
    medianAge: number | null
    medianHouseholdSize: number | null
    renterPercentage: number | null
    ownerOccupierPercentage: number | null
    ageDistribution: AgeDistribution | null
    educationLevelIndex: number | null // 0-100
    unemploymentRate: number | null
    employmentRate: number | null
    bachelorDegree: number | null
    familiesPercent: number | null
  }
  
  // 6. LIFESTYLE & INFRASTRUCTURE
  lifestyle: {
    crimeRateIndex: number | null // 0-100 (lower = safer)
    crimeRate: string | null
    crimeScore: number | null
    schoolQualityScore: number | null // 0-100
    primarySchools: number | null
    secondarySchools: number | null
    universities: number | null
    publicTransportScore: number | null // 0-100
    trainStations: number | null
    busStops: number | null
    transportScore: number | null
    greenspaceScore: number | null // 0-100
    parks: number | null
    distanceToCBD: number | null // km
    cbdDistanceKm: number | null
    walkabilityScore: number | null // 0-100
    bikeabilityScore: number | null // 0-100
    cafesAndRestaurants: number | null
    restaurants: number | null
    shoppingCentres: number | null
    healthcareFacilities: number | null
    hospitals: number | null
    gyms: number | null
    childcareCentres: number | null
    futureInfrastructureProjects: string[]
    plannedInfra: string | null
    commercialPrecinct: string | null
    airQuality: string | null
    nbnAvailability: string | null
    internetConnectivity: string | null
    zoningCode: string | null
    heritageOverlay: boolean
    floodRisk: string | null
    bushfireRisk: string | null
    councilName: string | null
    councilRates: number | null
  }
  
  // 7. AFFORDABILITY METRICS
  affordability: {
    mortgageRepaymentEstimate: number | null // Monthly
    priceToIncomeRatio: number | null
    timeToSaveDepositYears: number | null
    rentVsBuyRecommendation: 'rent' | 'buy' | 'neutral' | null
  }
  
  // 8. INVESTMENT SCORES (all 0-100)
  scores: {
    suburbGrowthScore: number | null
    suburbRiskScore: number | null // Lower is better
    suburbOpportunityScore: number | null
    overallSmartPropertyScore: number | null // Primary score
    investmentScore: number | null // Legacy
    growthScore: number | null // Legacy
    affordabilityScore: number | null
    lifestyleScore: number | null
  }
  
  // 9. AI INSIGHTS
  ai: {
    aiShortSummary: string | null
    aiInvestmentExplanation: string | null
    aiRiskWarning: string | null
    aiFuturePrediction: string | null
    aiComparableSuburbs: string[]
    aiBuyerPersona: BuyerPersona | null
    aiInvestmentStrategy: string | null
  }
  
  // Metadata
  metadata: {
    dataSource: string
    dataQuality: 'high' | 'medium' | 'low'
    lastUpdated: Date
    lastApiCallDate: Date | null
    updateFrequency: string
    createdAt: Date
    updatedAt: Date
  }
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface AgeDistribution {
  '0-14': number
  '15-24': number
  '25-34': number
  '35-44': number
  '45-54': number
  '55-64': number
  '65+': number
}

export type BuyerPersona = 
  | 'first-home-buyer'
  | 'investor-growth'
  | 'investor-yield'
  | 'upsizer-family'
  | 'downsizer-retiree'
  | 'lifestyle-seachange'
  | 'lifestyle-treechange'

export type InvestmentRecommendation = 
  | 'strong-buy'
  | 'buy'
  | 'hold'
  | 'sell'
  | 'avoid'

export type RiskLevel = 'low' | 'medium' | 'high' | 'very-high'
export type GrowthTrend = 'strong-growth' | 'moderate-growth' | 'slow-growth' | 'stable' | 'declining'
export type MarketTrend = 'up' | 'down' | 'stable'

// ============================================================================
// SMART PROPERTY SCORE CALCULATION
// ============================================================================

export interface SmartPropertyScoreComponents {
  growthMomentum: {
    score: number // 0-20
    weight: number // 20%
    factors: {
      growth12m: number
      growth6m: number
      trend: GrowthTrend
    }
  }
  supplyPressure: {
    score: number // 0-20
    weight: number // 20%
    factors: {
      listingsTrend: MarketTrend
      daysOnMarket: number
      stockLevel: number
      oversupplyRisk: number
    }
  }
  rentalStrength: {
    score: number // 0-20
    weight: number // 20%
    factors: {
      yield: number
      vacancyRate: number
      rentalGrowth: number
    }
  }
  socioEconomicUplift: {
    score: number // 0-20
    weight: number // 20%
    factors: {
      incomeGrowth: number
      educationLevel: number
      employmentRate: number
      populationGrowth: number
    }
  }
  developmentRisk: {
    score: number // 0-10
    weight: number // 10%
    factors: {
      oversupply: number
      approvals: number
      pipeline: number
    }
  }
  affordability: {
    score: number // 0-10
    weight: number // 10%
    factors: {
      priceToIncome: number
      timeToSaveDeposit: number
      mortgageStress: number
    }
  }
  totalScore: number // 0-100
}

// ============================================================================
// AI ANALYSIS TYPES
// ============================================================================

export interface AISuburbAnalysis {
  // Executive Summary
  executiveSummary: {
    overallGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F'
    investmentRecommendation: InvestmentRecommendation
    shortSummary: string // 2-3 sentences
    keyStrengths: string[]
    keyWeaknesses: string[]
  }
  
  // Growth Analysis
  growthAnalysis: {
    historicalPerformance: string
    currentTrend: GrowthTrend
    futurePrediction: string
    growthDrivers: string[]
    growthRisks: string[]
    comparedToRegion: 'outperforming' | 'inline' | 'underperforming'
  }
  
  // Investment Fundamentals
  investmentFundamentals: {
    cashFlowProjection: {
      monthlyRent: number
      monthlyExpenses: number
      netCashFlow: number
      annualReturn: number
    }
    roiScenarios: {
      conservative: number
      moderate: number
      optimistic: number
    }
    breakEvenAnalysis: string
    taxImplications: string
  }
  
  // Location Intelligence
  locationIntelligence: {
    demographicProfile: string
    amenitiesScore: number
    infrastructureRating: number
    lifestyleSuitability: BuyerPersona[]
    proximityAdvantages: string[]
    proximityDisadvantages: string[]
  }
  
  // Supply & Demand
  supplyDemand: {
    currentBalance: 'undersupplied' | 'balanced' | 'oversupplied'
    demandDrivers: string[]
    supplyPipeline: string
    populationTrends: string
    migrationPatterns: string
  }
  
  // Growth Catalysts
  growthCatalysts: {
    confirmedProjects: InfrastructureProject[]
    plannedDevelopments: string[]
    economicDrivers: string[]
    governmentInitiatives: string[]
  }
  
  // Risk Assessment
  riskAssessment: {
    overallRiskLevel: RiskLevel
    marketRisks: string[]
    locationRisks: string[]
    economicRisks: string[]
    environmentalRisks: string[]
    mitigationStrategies: string[]
  }
  
  // Investment Verdict
  investmentVerdict: {
    recommendation: InvestmentRecommendation
    targetBuyerType: BuyerPersona[]
    investmentHorizon: 'short-term' | 'medium-term' | 'long-term'
    exitStrategy: string
    specificAdvice: {
      firstHomeBuyer: string
      investor: string
      upsizer: string
    }
  }
  
  // Comparable Suburbs
  comparableSuburbs: {
    name: string
    state: string
    similarityScore: number
    priceComparison: number
    strengthsVsTarget: string[]
  }[]
  
  // Generated metadata
  generatedAt: Date
  dataVersion: string
  confidenceLevel: number // 0-100
}

export interface InfrastructureProject {
  name: string
  type: 'transport' | 'commercial' | 'residential' | 'mixed-use' | 'public'
  status: 'confirmed' | 'planned' | 'under-construction' | 'completed'
  completionDate: string | null
  impact: 'high' | 'medium' | 'low'
  distanceKm: number | null
}

// ============================================================================
// SUBURB COMPARISON TYPES
// ============================================================================

export interface SuburbComparison {
  suburbs: {
    suburb1: SuburbMetrics
    suburb2: SuburbMetrics
  }
  comparison: {
    pricing: ComparisonCategory
    rental: ComparisonCategory
    growth: ComparisonCategory
    demographics: ComparisonCategory
    lifestyle: ComparisonCategory
    investment: ComparisonCategory
  }
  winner: {
    overall: 1 | 2 | 'tie'
    byCategory: {
      pricing: 1 | 2 | 'tie'
      rental: 1 | 2 | 'tie'
      growth: 1 | 2 | 'tie'
      risk: 1 | 2 | 'tie'
      lifestyle: 1 | 2 | 'tie'
    }
  }
  recommendation: string
}

export interface ComparisonCategory {
  suburb1Value: number | string
  suburb2Value: number | string
  difference: number
  differencePercent: number
  winner: 1 | 2 | 'tie'
  insight: string
}

// ============================================================================
// OPPORTUNITY MAP TYPES
// ============================================================================

export interface OpportunityMapData {
  topOpportunities: SuburbOpportunity[]
  filters: {
    maxPrice: number | null
    minYield: number | null
    minGrowth: number | null
    state: string | null
    persona: BuyerPersona | null
  }
  sortBy: 'score' | 'growth' | 'yield' | 'price'
}

export interface SuburbOpportunity {
  suburb: {
    name: string
    state: string
    postcode: string
  }
  metrics: {
    smartScore: number
    medianPrice: number
    growth12m: number
    yield: number
    riskScore: number
  }
  highlights: string[]
  matchReason: string
}

// ============================================================================
// PERSONA-BASED RECOMMENDATIONS
// ============================================================================

export interface PersonaRecommendations {
  persona: BuyerPersona
  recommendations: {
    topSuburbs: SuburbOpportunity[]
    searchCriteria: {
      priceRange: [number, number]
      targetYield: number
      targetGrowth: number
      lifestyleFactors: string[]
    }
    strategyAdvice: string
    riskProfile: RiskLevel
    investmentHorizon: string
  }
}

// ============================================================================
// DATA INTEGRATION TYPES
// ============================================================================

export interface DataSourceConfig {
  name: string
  type: 'abs' | 'nsw-vg' | 'vic-prop' | 'da-approvals' | 'infrastructure' | 'transport'
  endpoint: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  lastFetch: Date | null
  status: 'active' | 'inactive' | 'error'
  creditsUsed: number
  isFree: boolean
}

export interface ETLJobResult {
  jobId: string
  source: string
  startTime: Date
  endTime: Date
  recordsProcessed: number
  recordsSucceeded: number
  recordsFailed: number
  errors: ETLError[]
  status: 'success' | 'partial' | 'failed'
}

export interface ETLError {
  record: string
  error: string
  timestamp: Date
}

// ============================================================================
// EMAIL ALERT TYPES
// ============================================================================

export interface EmailAlertConfig {
  userId: string
  suburbIds: string[]
  frequency: 'daily' | 'weekly' | 'instant'
  triggers: {
    priceChange: number // percentage
    rentChange: number // percentage
    vacancyChange: number // percentage
    newProjects: boolean
    investmentSignals: boolean
  }
  lastSent: Date | null
  active: boolean
}

export interface EmailAlertPayload {
  suburb: {
    name: string
    state: string
  }
  changes: {
    type: 'price' | 'rent' | 'vacancy' | 'project' | 'signal'
    oldValue: number | string | null
    newValue: number | string
    percentChange: number | null
    impact: 'positive' | 'negative' | 'neutral'
  }[]
  recommendation: string
  actionRequired: boolean
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    took?: number // ms
  }
}

export interface PaginatedResponse<T> extends APIResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// CHART DATA TYPES
// ============================================================================

export interface GrowthChartData {
  periods: ('6m' | '1y' | '3y' | '5y' | '10y')[]
  data: {
    period: string
    growth: number
    medianPrice: number
    label: string
  }[]
}

export interface RentVsBuyCalculation {
  purchasePrice: number
  deposit: number
  loanAmount: number
  interestRate: number
  loanTerm: number
  monthlyMortgage: number
  monthlyRent: number
  breakEvenYears: number
  totalCostBuy: number
  totalCostRent: number
  recommendation: 'buy' | 'rent'
  savings: number
}

export interface SuburbScoreGauge {
  score: number
  label: string
  color: string
  rating: 'excellent' | 'good' | 'average' | 'fair' | 'poor'
}
