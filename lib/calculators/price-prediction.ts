// Price Prediction & Valuation Engine
// Compares listing price to suburb median and forecasts future value

interface PricePrediction {
  listingPrice: number
  suburbMedian: number
  variance: number
  variancePercentage: number
  isUndervalued: boolean
  isOvervalued: boolean
  verdict: string
  futureValue3y?: number
  futureValue5y?: number
  futureValue10y?: number
  expectedGrowth3y?: number
  expectedGrowth5y?: number
  expectedGrowth10y?: number
  confidence: 'high' | 'medium' | 'low'
}

export function analyzePricing(
  listingPrice: number,
  suburbData?: {
    medianPrice?: number
    medianUnitPrice?: number
    growth12m?: number
    growth3y?: number
    growth5y?: number
    priceVolatilityScore?: number
  },
  propertyType?: string
): PricePrediction {
  // Determine which median to use
  const isApartment = propertyType === 'Apartment' || propertyType === 'Townhouse'
  const suburbMedian = isApartment 
    ? (suburbData?.medianUnitPrice || suburbData?.medianPrice || 0)
    : (suburbData?.medianPrice || 0)

  if (!suburbMedian || suburbMedian === 0) {
    return {
      listingPrice,
      suburbMedian: 0,
      variance: 0,
      variancePercentage: 0,
      isUndervalued: false,
      isOvervalued: false,
      verdict: 'Insufficient data for price analysis',
      confidence: 'low'
    }
  }

  const variance = listingPrice - suburbMedian
  const variancePercentage = (variance / suburbMedian) * 100

  // Determine valuation
  let isUndervalued = variancePercentage < -10
  let isOvervalued = variancePercentage > 15
  let verdict = ''

  if (variancePercentage < -20) {
    verdict = '🔥 Significantly undervalued - Excellent opportunity!'
  } else if (variancePercentage < -10) {
    verdict = '✅ Below market value - Good opportunity'
  } else if (variancePercentage < -5) {
    verdict = '👍 Slightly below market value'
  } else if (variancePercentage <= 10) {
    verdict = '📊 Fairly priced for the suburb'
  } else if (variancePercentage <= 20) {
    verdict = '⚠️ Above market value'
  } else {
    verdict = '❌ Significantly overpriced'
  }

  // Calculate future value predictions
  let futureValue3y, futureValue5y, futureValue10y
  let expectedGrowth3y, expectedGrowth5y, expectedGrowth10y
  let confidence: 'high' | 'medium' | 'low' = 'medium'

  if (suburbData?.growth3y !== undefined) {
    expectedGrowth3y = suburbData.growth3y
    futureValue3y = listingPrice * (1 + expectedGrowth3y / 100)
  } else if (suburbData?.growth12m !== undefined) {
    // Estimate 3-year based on 12-month
    expectedGrowth3y = suburbData.growth12m * 2.5 // Conservative multiplier
    futureValue3y = listingPrice * (1 + expectedGrowth3y / 100)
    confidence = 'medium'
  }

  if (suburbData?.growth5y !== undefined) {
    expectedGrowth5y = suburbData.growth5y
    futureValue5y = listingPrice * (1 + expectedGrowth5y / 100)
  } else if (suburbData?.growth12m !== undefined) {
    expectedGrowth5y = suburbData.growth12m * 4 // Conservative multiplier
    futureValue5y = listingPrice * (1 + expectedGrowth5y / 100)
    confidence = 'medium'
  }

  // 10-year forecast (extrapolate from available data)
  if (suburbData?.growth12m !== undefined) {
    expectedGrowth10y = suburbData.growth12m * 7 // Conservative long-term
    futureValue10y = listingPrice * (1 + expectedGrowth10y / 100)
    confidence = 'low' // Lower confidence for longer forecasts
  }

  // Adjust confidence based on volatility
  if (suburbData?.priceVolatilityScore) {
    if (suburbData.priceVolatilityScore > 70) {
      confidence = 'low'
    } else if (suburbData.priceVolatilityScore < 30) {
      confidence = confidence === 'low' ? 'medium' : 'high'
    }
  }

  return {
    listingPrice,
    suburbMedian,
    variance,
    variancePercentage,
    isUndervalued,
    isOvervalued,
    verdict,
    futureValue3y,
    futureValue5y,
    futureValue10y,
    expectedGrowth3y,
    expectedGrowth5y,
    expectedGrowth10y,
    confidence
  }
}

// Rental yield calculator
export interface RentalYieldAnalysis {
  weeklyRent: number
  annualRent: number
  purchasePrice: number
  grossYield: number
  estimatedExpenses: number
  netRent: number
  netYield: number
  verdict: string
  isGoodInvestment: boolean
}

export function analyzeRentalYield(
  weeklyRent: number,
  purchasePrice: number,
  propertyType: string,
  hasStrataFees: boolean = false
): RentalYieldAnalysis {
  const annualRent = weeklyRent * 52
  const grossYield = (annualRent / purchasePrice) * 100

  // Estimate expenses (as % of rent)
  const managementFees = annualRent * 0.08 // 8% property management
  const councilRates = 1800
  const insurance = propertyType === 'Apartment' ? 600 : 1200
  const strataFees = hasStrataFees ? 4000 : 0
  const maintenance = purchasePrice * 0.01 // 1% of property value
  
  const estimatedExpenses = managementFees + councilRates + insurance + strataFees + maintenance
  const netRent = annualRent - estimatedExpenses
  const netYield = (netRent / purchasePrice) * 100

  let verdict = ''
  let isGoodInvestment = false

  if (grossYield >= 6) {
    verdict = '🔥 Excellent rental yield - Strong cash flow property'
    isGoodInvestment = true
  } else if (grossYield >= 4.5) {
    verdict = '✅ Good rental yield - Positive cash flow likely'
    isGoodInvestment = true
  } else if (grossYield >= 3.5) {
    verdict = '📊 Fair rental yield - Break-even or slight positive'
    isGoodInvestment = false
  } else if (grossYield >= 2.5) {
    verdict = '⚠️ Below average yield - Likely negative gearing'
    isGoodInvestment = false
  } else {
    verdict = '❌ Poor rental yield - Significant negative gearing'
    isGoodInvestment = false
  }

  return {
    weeklyRent,
    annualRent,
    purchasePrice,
    grossYield,
    estimatedExpenses,
    netRent,
    netYield,
    verdict,
    isGoodInvestment
  }
}

// Cash flow calculator
export interface CashFlowAnalysis {
  monthlyRentIncome: number
  monthlyMortgagePayment: number
  monthlyExpenses: number
  monthlyCashFlow: number
  annualCashFlow: number
  isCashFlowPositive: boolean
  breakEvenRent: number
}

export function analyzeCashFlow(
  weeklyRent: number,
  purchasePrice: number,
  deposit: number,
  interestRate: number,
  loanTermYears: number = 30,
  propertyType: string,
  hasStrataFees: boolean = false
): CashFlowAnalysis {
  const loanAmount = purchasePrice - deposit
  const monthlyRate = interestRate / 100 / 12
  const totalPayments = loanTermYears * 12

  // Calculate monthly mortgage payment (principal + interest)
  const monthlyMortgagePayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)

  const monthlyRentIncome = (weeklyRent * 52) / 12

  // Monthly expenses
  const managementFees = monthlyRentIncome * 0.08
  const councilRates = 1800 / 12
  const insurance = (propertyType === 'Apartment' ? 600 : 1200) / 12
  const strataFees = hasStrataFees ? 4000 / 12 : 0
  const maintenance = (purchasePrice * 0.01) / 12

  const monthlyExpenses = managementFees + councilRates + insurance + strataFees + maintenance

  const monthlyCashFlow = monthlyRentIncome - monthlyMortgagePayment - monthlyExpenses
  const annualCashFlow = monthlyCashFlow * 12
  const isCashFlowPositive = monthlyCashFlow >= 0

  // Calculate break-even rent
  const totalMonthlyOutgoings = monthlyMortgagePayment + monthlyExpenses
  const breakEvenRent = (totalMonthlyOutgoings * 12) / 52

  return {
    monthlyRentIncome,
    monthlyMortgagePayment,
    monthlyExpenses,
    monthlyCashFlow,
    annualCashFlow,
    isCashFlowPositive,
    breakEvenRent
  }
}
