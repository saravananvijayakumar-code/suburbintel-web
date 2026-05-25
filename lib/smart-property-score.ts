/**
 * Smart Property Score Calculator
 * 
 * Calculates the Overall Smart Property Score (0-100) based on 6 key components:
 * - Growth Momentum (20%)
 * - Supply Pressure (20%)
 * - Rental Strength (20%)
 * - Socio-Economic Uplift (20%)
 * - Development Risk (10%)
 * - Affordability (10%)
 */

import type { SmartPropertyScoreComponents, GrowthTrend, MarketTrend, SuburbMetrics } from './types/smart-property-brain'

export interface ScoreInputs {
  // Pricing
  priceGrowth3m?: number | null
  priceGrowth6m?: number | null
  priceGrowth12m?: number | null
  priceGrowth3y?: number | null
  priceGrowth5y?: number | null
  medianPrice?: number | null
  medianIncome?: number | null
  
  // Rental
  grossYieldHouse?: number | null
  grossYieldUnit?: number | null
  rentalYield?: number | null
  vacancyRate?: number | null
  rentalGrowth12m?: number | null
  
  // Market
  listingsTrend3m?: string | null
  daysOnMarket?: number | null
  stockOnMarketPct?: number | null
  salesVolumeTrend3m?: string | null
  auctionClearance?: number | null
  
  // Development
  oversupplyRiskScore?: number | null
  dwellingApprovalsYTD?: number | null
  apartmentPipeline?: number | null
  
  // Demographics
  populationGrowthRate?: number | null
  educationLevelIndex?: number | null
  employmentRate?: number | null
  unemploymentRate?: number | null
  
  // Affordability
  priceToIncomeRatio?: number | null
  timeToSaveDepositYears?: number | null
}

/**
 * Calculate the Overall Smart Property Score
 */
export function calculateSmartPropertyScore(inputs: ScoreInputs): SmartPropertyScoreComponents {
  const growthMomentum = calculateGrowthMomentum(inputs)
  const supplyPressure = calculateSupplyPressure(inputs)
  const rentalStrength = calculateRentalStrength(inputs)
  const socioEconomicUplift = calculateSocioEconomicUplift(inputs)
  const developmentRisk = calculateDevelopmentRisk(inputs)
  const affordability = calculateAffordability(inputs)
  
  const totalScore = 
    growthMomentum.score +
    supplyPressure.score +
    rentalStrength.score +
    socioEconomicUplift.score +
    developmentRisk.score +
    affordability.score
  
  return {
    growthMomentum,
    supplyPressure,
    rentalStrength,
    socioEconomicUplift,
    developmentRisk,
    affordability,
    totalScore: Math.round(totalScore)
  }
}

/**
 * Component 1: Growth Momentum (0-20 points, 20% weight)
 */
function calculateGrowthMomentum(inputs: ScoreInputs): SmartPropertyScoreComponents['growthMomentum'] {
  const growth12m = inputs.priceGrowth12m ?? 0
  const growth6m = inputs.priceGrowth6m ?? 0
  const growth3m = inputs.priceGrowth3m ?? 0
  
  let score = 0
  let trend: GrowthTrend = 'stable'
  
  // Score based on 12-month growth
  if (growth12m > 15) {
    score += 10
    trend = 'strong-growth'
  } else if (growth12m > 10) {
    score += 8
    trend = 'strong-growth'
  } else if (growth12m > 5) {
    score += 6
    trend = 'moderate-growth'
  } else if (growth12m > 0) {
    score += 4
    trend = 'slow-growth'
  } else if (growth12m < -5) {
    score += 0
    trend = 'declining'
  } else {
    score += 2
    trend = 'stable'
  }
  
  // Bonus for accelerating growth (3m > 6m > 12m)
  if (growth3m > growth6m && growth6m > growth12m) {
    score += 5
    trend = 'strong-growth'
  } else if (growth6m > growth12m) {
    score += 3
  }
  
  // Bonus for sustained long-term growth
  const growth3y = inputs.priceGrowth3y ?? 0
  const growth5y = inputs.priceGrowth5y ?? 0
  if (growth5y > 30 || growth3y > 20) {
    score += 5
  } else if (growth5y > 20 || growth3y > 15) {
    score += 3
  }
  
  return {
    score: Math.min(20, Math.max(0, score)),
    weight: 20,
    factors: {
      growth12m,
      growth6m,
      trend
    }
  }
}

/**
 * Component 2: Supply Pressure (0-20 points, 20% weight)
 */
function calculateSupplyPressure(inputs: ScoreInputs): SmartPropertyScoreComponents['supplyPressure'] {
  let score = 10 // Base score
  
  const listingsTrend = inputs.listingsTrend3m as MarketTrend || 'stable'
  const daysOnMarket = inputs.daysOnMarket ?? 45
  const stockOnMarket = inputs.stockOnMarketPct ?? 3
  const oversupply = inputs.oversupplyRiskScore ?? 50
  
  // Listings trend (favorable = down)
  if (listingsTrend === 'down') {
    score += 5 // Low listings = high demand
  } else if (listingsTrend === 'up') {
    score -= 3 // High listings = lower demand
  }
  
  // Days on market (lower is better)
  if (daysOnMarket < 20) {
    score += 5
  } else if (daysOnMarket < 30) {
    score += 3
  } else if (daysOnMarket > 60) {
    score -= 3
  } else if (daysOnMarket > 45) {
    score -= 1
  }
  
  // Stock on market (lower is better)
  if (stockOnMarket < 2) {
    score += 5
  } else if (stockOnMarket < 3) {
    score += 3
  } else if (stockOnMarket > 5) {
    score -= 3
  }
  
  // Oversupply risk (lower is better)
  if (oversupply < 30) {
    score += 5
  } else if (oversupply < 50) {
    score += 2
  } else if (oversupply > 70) {
    score -= 5
  }
  
  return {
    score: Math.min(20, Math.max(0, score)),
    weight: 20,
    factors: {
      listingsTrend,
      daysOnMarket,
      stockLevel: stockOnMarket,
      oversupplyRisk: oversupply
    }
  }
}

/**
 * Component 3: Rental Strength (0-20 points, 20% weight)
 */
function calculateRentalStrength(inputs: ScoreInputs): SmartPropertyScoreComponents['rentalStrength'] {
  let score = 0
  
  const yield_ = inputs.rentalYield ?? inputs.grossYieldHouse ?? inputs.grossYieldUnit ?? 3.5
  const vacancy = inputs.vacancyRate ?? 3
  const rentalGrowth = inputs.rentalGrowth12m ?? 0
  
  // Yield scoring (3-6% is optimal range for Australian property)
  if (yield_ >= 5) {
    score += 10 // Excellent cash flow
  } else if (yield_ >= 4) {
    score += 8
  } else if (yield_ >= 3.5) {
    score += 6
  } else if (yield_ >= 3) {
    score += 4
  } else {
    score += 2 // Low yield but may be capital growth focused
  }
  
  // Vacancy rate (lower is better)
  if (vacancy < 1.5) {
    score += 7 // Extremely tight market
  } else if (vacancy < 2.5) {
    score += 5 // Healthy rental market
  } else if (vacancy < 3.5) {
    score += 3 // Balanced
  } else if (vacancy > 5) {
    score -= 2 // Oversupplied rental market
  }
  
  // Rental growth
  if (rentalGrowth > 8) {
    score += 5
  } else if (rentalGrowth > 5) {
    score += 3
  } else if (rentalGrowth < 0) {
    score -= 2
  }
  
  return {
    score: Math.min(20, Math.max(0, score)),
    weight: 20,
    factors: {
      yield: yield_,
      vacancyRate: vacancy,
      rentalGrowth
    }
  }
}

/**
 * Component 4: Socio-Economic Uplift (0-20 points, 20% weight)
 */
function calculateSocioEconomicUplift(inputs: ScoreInputs): SmartPropertyScoreComponents['socioEconomicUplift'] {
  let score = 5 // Base score
  
  const popGrowth = inputs.populationGrowthRate ?? 1
  const education = inputs.educationLevelIndex ?? 50
  const employment = inputs.employmentRate ?? 95
  const unemployment = inputs.unemploymentRate ?? 5
  
  // Population growth
  if (popGrowth > 3) {
    score += 6 // Rapid growth
  } else if (popGrowth > 2) {
    score += 5
  } else if (popGrowth > 1) {
    score += 3
  } else if (popGrowth < 0) {
    score -= 3 // Declining population
  }
  
  // Education level (proxy for income growth potential)
  if (education > 70) {
    score += 5
  } else if (education > 60) {
    score += 4
  } else if (education > 50) {
    score += 3
  } else if (education < 30) {
    score -= 2
  }
  
  // Employment rate
  const actualEmployment = unemployment ? 100 - unemployment : employment
  if (actualEmployment > 96) {
    score += 5
  } else if (actualEmployment > 94) {
    score += 3
  } else if (actualEmployment < 90) {
    score -= 2
  }
  
  // Income growth proxy (using median income if available)
  if (inputs.medianIncome && inputs.medianIncome > 80000) {
    score += 4
  } else if (inputs.medianIncome && inputs.medianIncome > 70000) {
    score += 2
  }
  
  return {
    score: Math.min(20, Math.max(0, score)),
    weight: 20,
    factors: {
      incomeGrowth: 0, // TODO: Calculate from historical data
      educationLevel: education,
      employmentRate: actualEmployment,
      populationGrowth: popGrowth
    }
  }
}

/**
 * Component 5: Development Risk (0-10 points, 10% weight)
 */
function calculateDevelopmentRisk(inputs: ScoreInputs): SmartPropertyScoreComponents['developmentRisk'] {
  let score = 5 // Base score
  
  const oversupply = inputs.oversupplyRiskScore ?? 50
  const approvals = inputs.dwellingApprovalsYTD ?? 0
  const pipeline = inputs.apartmentPipeline ?? 0
  
  // Oversupply risk (inverted - lower risk = higher score)
  if (oversupply < 30) {
    score += 5 // Very low risk
  } else if (oversupply < 50) {
    score += 3 // Low risk
  } else if (oversupply > 70) {
    score -= 3 // High risk
  }
  
  // Development approvals relative to population
  // High approvals can indicate either growth opportunity OR oversupply
  // Context matters - we penalize if already high oversupply
  if (oversupply > 60 && approvals > 500) {
    score -= 2 // Too much supply coming
  }
  
  // Large apartment pipeline in areas with high oversupply
  if (oversupply > 60 && pipeline > 1000) {
    score -= 2
  }
  
  return {
    score: Math.min(10, Math.max(0, score)),
    weight: 10,
    factors: {
      oversupply,
      approvals,
      pipeline
    }
  }
}

/**
 * Component 6: Affordability (0-10 points, 10% weight)
 */
function calculateAffordability(inputs: ScoreInputs): SmartPropertyScoreComponents['affordability'] {
  let score = 5 // Base score
  
  const priceToIncome = inputs.priceToIncomeRatio ?? 8
  const timeToSave = inputs.timeToSaveDepositYears ?? 5
  const medianPrice = inputs.medianPrice ?? 600000
  const medianIncome = inputs.medianIncome ?? 75000
  
  // Price to income ratio (lower is more affordable)
  if (priceToIncome < 6) {
    score += 5 // Highly affordable
  } else if (priceToIncome < 8) {
    score += 3 // Affordable
  } else if (priceToIncome < 10) {
    score += 1 // Moderate
  } else if (priceToIncome > 12) {
    score -= 2 // Unaffordable
  }
  
  // Time to save deposit
  if (timeToSave < 3) {
    score += 3
  } else if (timeToSave < 5) {
    score += 2
  } else if (timeToSave > 8) {
    score -= 1
  }
  
  // Mortgage stress indicator
  const monthlyMortgage = (medianPrice * 0.8 * 0.065) / 12 // 80% LVR, 6.5% interest
  const monthlyIncome = medianIncome / 12
  const mortgageStress = (monthlyMortgage / monthlyIncome) * 100
  
  if (mortgageStress < 30) {
    score += 2 // Low stress
  } else if (mortgageStress > 40) {
    score -= 2 // High stress
  }
  
  return {
    score: Math.min(10, Math.max(0, score)),
    weight: 10,
    factors: {
      priceToIncome,
      timeToSaveDeposit: timeToSave,
      mortgageStress
    }
  }
}

/**
 * Get score rating based on total score
 */
export function getScoreRating(score: number): {
  rating: string
  label: string
  color: string
  description: string
} {
  if (score >= 85) {
    return {
      rating: 'A+',
      label: 'Excellent',
      color: 'green',
      description: 'Outstanding investment opportunity with strong fundamentals across all metrics'
    }
  } else if (score >= 75) {
    return {
      rating: 'A',
      label: 'Very Good',
      color: 'green',
      description: 'Strong investment opportunity with good growth potential and low risk'
    }
  } else if (score >= 65) {
    return {
      rating: 'B+',
      label: 'Good',
      color: 'blue',
      description: 'Solid investment choice with balanced growth and yield characteristics'
    }
  } else if (score >= 55) {
    return {
      rating: 'B',
      label: 'Above Average',
      color: 'blue',
      description: 'Reasonable investment with some strengths, monitor market conditions'
    }
  } else if (score >= 45) {
    return {
      rating: 'C+',
      label: 'Average',
      color: 'yellow',
      description: 'Mixed signals - suitable for specific investment strategies only'
    }
  } else if (score >= 35) {
    return {
      rating: 'C',
      label: 'Below Average',
      color: 'orange',
      description: 'Proceed with caution - significant risks or limited growth potential'
    }
  } else {
    return {
      rating: 'D',
      label: 'Poor',
      color: 'red',
      description: 'Not recommended for investment - multiple risk factors present'
    }
  }
}

/**
 * Helper to calculate all derived metrics
 */
export function calculateDerivedMetrics(suburb: Partial<SuburbMetrics>): Partial<ScoreInputs> {
  const medianPrice = suburb.pricing?.medianHousePrice ?? suburb.pricing?.medianUnitPrice
  const medianIncome = suburb.demographics?.medianIncome
  
  return {
    priceToIncomeRatio: medianPrice && medianIncome ? medianPrice / medianIncome : undefined,
    timeToSaveDepositYears: medianPrice && medianIncome ? 
      (medianPrice * 0.2) / (medianIncome * 0.15) : undefined,
  }
}
