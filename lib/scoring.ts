/**
 * Advanced AI-Powered Investment Scoring Algorithm
 * Calculates comprehensive investment scores based on multiple factors
 */

interface ScoringFactors {
  // Price metrics
  medianPrice: number
  priceGrowth12m: number
  priceGrowth6m?: number
  priceGrowth3m?: number
  
  // Rental metrics
  weeklyRent: number
  rentalYield: number
  
  // Market metrics
  demandScore?: number
  supplyScore?: number
  
  // Location metrics
  distanceToCBD?: number
  infrastructureScore?: number
  
  // Market conditions
  state: string
}

interface ScoreBreakdown {
  totalScore: number
  yieldScore: number
  growthScore: number
  momentumScore: number
  affordabilityScore: number
  marketScore: number
  grade: string
  category: string
}

/**
 * Calculate comprehensive investment score using advanced weighting
 * Returns score 0-100 with detailed breakdown
 */
export function calculateInvestmentScore(factors: ScoringFactors): ScoreBreakdown {
  // 1. Rental Yield Score (25 points max)
  // Excellent: 5%+, Good: 4-5%, Fair: 3-4%, Poor: <3%
  const yieldScore = calculateYieldScore(factors.rentalYield)
  
  // 2. Growth Score (30 points max)
  // Based on 12-month growth with diminishing returns
  const growthScore = calculateGrowthScore(factors.priceGrowth12m)
  
  // 3. Momentum Score (20 points max)
  // Recent trends (3m, 6m) weighted against 12m
  const momentumScore = calculateMomentumScore(
    factors.priceGrowth12m,
    factors.priceGrowth6m,
    factors.priceGrowth3m
  )
  
  // 4. Affordability Score (15 points max)
  // Sweet spot: $400k-$800k gets highest score
  const affordabilityScore = calculateAffordabilityScore(factors.medianPrice, factors.state)
  
  // 5. Market Conditions Score (10 points max)
  // Demand vs supply, infrastructure, location
  const marketScore = calculateMarketScore(factors)
  
  // Total score
  const totalScore = Math.round(
    yieldScore + growthScore + momentumScore + affordabilityScore + marketScore
  )
  
  // Determine grade
  const grade = getInvestmentGrade(totalScore)
  const category = getInvestmentCategory(totalScore)
  
  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    yieldScore,
    growthScore,
    momentumScore,
    affordabilityScore,
    marketScore,
    grade,
    category,
  }
}

/**
 * Yield Score: 0-25 points
 * 5%+ = 25pts, 4-5% = 20pts, 3-4% = 15pts, 2-3% = 10pts, <2% = 5pts
 */
function calculateYieldScore(rentalYield: number): number {
  if (rentalYield >= 5.0) return 25
  if (rentalYield >= 4.5) return 23
  if (rentalYield >= 4.0) return 20
  if (rentalYield >= 3.5) return 17
  if (rentalYield >= 3.0) return 15
  if (rentalYield >= 2.5) return 12
  if (rentalYield >= 2.0) return 10
  if (rentalYield >= 1.5) return 7
  return Math.max(0, Math.round(rentalYield * 3))
}

/**
 * Growth Score: 0-30 points
 * Uses logarithmic scaling to prevent extreme values dominating
 */
function calculateGrowthScore(growth12m: number): number {
  if (growth12m >= 15) return 30 // Exceptional growth
  if (growth12m >= 10) return 28 // Excellent growth
  if (growth12m >= 7) return 25  // Very good growth
  if (growth12m >= 5) return 22  // Good growth
  if (growth12m >= 3) return 18  // Moderate growth
  if (growth12m >= 1) return 14  // Slight growth
  if (growth12m >= 0) return 10  // Stable
  if (growth12m >= -2) return 7  // Minor decline
  if (growth12m >= -5) return 4  // Moderate decline
  return 0 // Significant decline
}

/**
 * Momentum Score: 0-20 points
 * Analyzes trend acceleration/deceleration
 */
function calculateMomentumScore(
  growth12m: number,
  growth6m: number = growth12m / 2,
  growth3m: number = growth12m / 4
): number {
  // Check if growth is accelerating or decelerating
  const annualized3m = growth3m * 4
  const annualized6m = growth6m * 2
  
  // Momentum indicators
  const isAccelerating = annualized3m > annualized6m && annualized6m > growth12m
  const isStrongPositive = growth3m > 0 && growth6m > 0 && growth12m > 0
  const isConsistent = Math.abs(growth3m - growth6m / 2) < 1
  
  let score = 10 // Base score
  
  if (isAccelerating) score += 5
  if (isStrongPositive) score += 3
  if (isConsistent) score += 2
  
  // Penalty for decelerating growth
  if (annualized3m < growth12m && growth12m > 0) score -= 3
  
  // Penalty for negative momentum
  if (growth3m < 0) score -= 2
  
  return Math.max(0, Math.min(20, score))
}

/**
 * Affordability Score: 0-15 points
 * Sweet spot differs by state (NSW vs VIC)
 */
function calculateAffordabilityScore(medianPrice: number, state: string): number {
  // NSW sweet spot: $500k-$900k
  // VIC sweet spot: $450k-$850k
  const sweetSpot = state === 'NSW' 
    ? { min: 500000, ideal: 700000, max: 900000 }
    : { min: 450000, ideal: 650000, max: 850000 }
  
  if (medianPrice < 200000) return 3  // Too cheap, likely issues
  if (medianPrice > 2000000) return 5 // Premium market, lower yields
  
  // Within sweet spot range
  if (medianPrice >= sweetSpot.min && medianPrice <= sweetSpot.max) {
    // Closest to ideal gets 15 points
    const deviation = Math.abs(medianPrice - sweetSpot.ideal)
    const maxDeviation = sweetSpot.max - sweetSpot.ideal
    const score = 15 - (deviation / maxDeviation) * 5
    return Math.round(score)
  }
  
  // Below sweet spot (more affordable but may have less growth)
  if (medianPrice < sweetSpot.min) {
    const ratio = medianPrice / sweetSpot.min
    return Math.round(8 + ratio * 4) // 8-12 points
  }
  
  // Above sweet spot (less affordable)
  if (medianPrice > sweetSpot.max && medianPrice <= 1500000) {
    return 10 // Still viable but premium
  }
  
  return 7 // High-end market
}

/**
 * Market Conditions Score: 0-10 points
 * Based on supply/demand dynamics and location factors
 */
function calculateMarketScore(factors: ScoringFactors): number {
  let score = 5 // Base score
  
  // Demand indicators (if available)
  if (factors.demandScore) {
    if (factors.demandScore > 75) score += 2
    else if (factors.demandScore > 50) score += 1
    else if (factors.demandScore < 30) score -= 1
  }
  
  // Supply indicators (if available)
  if (factors.supplyScore) {
    if (factors.supplyScore < 30) score += 1.5 // Low supply = good
    else if (factors.supplyScore > 70) score -= 1 // Oversupply risk
  }
  
  // Location factors
  if (factors.distanceToCBD !== undefined) {
    if (factors.distanceToCBD < 20) score += 1.5 // Close to CBD
    else if (factors.distanceToCBD < 40) score += 0.5
  }
  
  if (factors.infrastructureScore) {
    score += Math.min(2, factors.infrastructureScore / 50)
  }
  
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10))
}

/**
 * Convert score to letter grade
 */
function getInvestmentGrade(score: number): string {
  if (score >= 90) return 'A+'
  if (score >= 85) return 'A'
  if (score >= 80) return 'A-'
  if (score >= 75) return 'B+'
  if (score >= 70) return 'B'
  if (score >= 65) return 'B-'
  if (score >= 60) return 'C+'
  if (score >= 55) return 'C'
  if (score >= 50) return 'C-'
  if (score >= 45) return 'D+'
  if (score >= 40) return 'D'
  return 'F'
}

/**
 * Categorize investment opportunity
 */
function getInvestmentCategory(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Very Good'
  if (score >= 60) return 'Good'
  if (score >= 50) return 'Fair'
  if (score >= 40) return 'Below Average'
  return 'Poor'
}

/**
 * Batch calculate scores for multiple suburbs
 */
export function batchCalculateScores(suburbs: Array<{
  medianPrice: number
  weeklyRent: number
  rentalYield: number
  growth12m: number
  growth6m?: number
  growth3m?: number
  state: string
}>): Array<ScoreBreakdown & { index: number }> {
  return suburbs.map((suburb, index) => ({
    ...calculateInvestmentScore({
      medianPrice: suburb.medianPrice,
      weeklyRent: suburb.weeklyRent,
      rentalYield: suburb.rentalYield,
      priceGrowth12m: suburb.growth12m || 0,
      priceGrowth6m: suburb.growth6m,
      priceGrowth3m: suburb.growth3m,
      state: suburb.state,
    }),
    index,
  }))
}
