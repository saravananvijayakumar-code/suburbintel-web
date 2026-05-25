// Stamp Duty Calculator for All Australian States
// Based on 2025 rates - real government formulas

interface StampDutyResult {
  stampDuty: number
  firstHomeBuyerConcession: number
  netStampDuty: number
  state: string
}

export function calculateStampDuty(
  price: number,
  state: string,
  isFirstHomeBuyer: boolean = false
): StampDutyResult {
  let stampDuty = 0
  let concession = 0

  switch (state.toUpperCase()) {
    case 'NSW':
      stampDuty = calculateNSWStampDuty(price)
      if (isFirstHomeBuyer && price <= 800000) {
        concession = stampDuty // Full exemption up to $800k
      } else if (isFirstHomeBuyer && price <= 1000000) {
        // Concessional rate between $800k-$1m
        concession = stampDuty - ((price - 800000) * 0.04)
      }
      break

    case 'VIC':
      stampDuty = calculateVICStampDuty(price)
      if (isFirstHomeBuyer && price <= 600000) {
        concession = stampDuty // Full exemption up to $600k
      } else if (isFirstHomeBuyer && price <= 750000) {
        // Concessional rate between $600k-$750k
        const fullDuty = calculateVICStampDuty(price)
        const concessionDuty = calculateVICStampDuty(600000)
        concession = fullDuty - concessionDuty
      }
      break

    case 'QLD':
      stampDuty = calculateQLDStampDuty(price)
      if (isFirstHomeBuyer && price <= 550000) {
        concession = stampDuty // Full exemption up to $550k
      }
      break

    case 'SA':
      stampDuty = calculateSAStampDuty(price)
      if (isFirstHomeBuyer && price <= 650000) {
        concession = stampDuty // Full exemption up to $650k
      }
      break

    case 'WA':
      stampDuty = calculateWAStampDuty(price)
      if (isFirstHomeBuyer && price <= 530000) {
        concession = stampDuty // Full exemption up to $530k
      }
      break

    case 'TAS':
      stampDuty = calculateTASStampDuty(price)
      if (isFirstHomeBuyer && price <= 600000) {
        concession = Math.min(stampDuty, 7000) // Up to $7k concession
      }
      break

    case 'NT':
      stampDuty = calculateNTStampDuty(price)
      // NT has different concessions
      break

    case 'ACT':
      stampDuty = calculateACTStampDuty(price)
      if (isFirstHomeBuyer && price <= 500000) {
        concession = stampDuty // Full exemption up to $500k
      }
      break

    default:
      stampDuty = price * 0.055 // Default 5.5%
  }

  return {
    stampDuty,
    firstHomeBuyerConcession: concession,
    netStampDuty: stampDuty - concession,
    state
  }
}

function calculateNSWStampDuty(price: number): number {
  if (price <= 16000) return price * 0.0125
  if (price <= 35000) return 200 + (price - 16000) * 0.015
  if (price <= 93000) return 485 + (price - 35000) * 0.0175
  if (price <= 351000) return 1500 + (price - 93000) * 0.035
  if (price <= 1168000) return 10530 + (price - 351000) * 0.045
  return 47295 + (price - 1168000) * 0.055
}

function calculateVICStampDuty(price: number): number {
  if (price <= 25000) return price * 0.014
  if (price <= 130000) return 350 + (price - 25000) * 0.024
  if (price <= 960000) return 2870 + (price - 130000) * 0.06
  return 52670 + (price - 960000) * 0.065
}

function calculateQLDStampDuty(price: number): number {
  if (price <= 5000) return 0
  if (price <= 75000) return (price - 5000) * 0.015
  if (price <= 540000) return 1050 + (price - 75000) * 0.035
  if (price <= 1000000) return 17325 + (price - 540000) * 0.045
  return 38025 + (price - 1000000) * 0.0575
}

function calculateSAStampDuty(price: number): number {
  if (price <= 12000) return price * 0.01
  if (price <= 30000) return 120 + (price - 12000) * 0.02
  if (price <= 50000) return 480 + (price - 30000) * 0.03
  if (price <= 100000) return 1080 + (price - 50000) * 0.035
  if (price <= 200000) return 2830 + (price - 100000) * 0.04
  if (price <= 250000) return 6830 + (price - 200000) * 0.0425
  if (price <= 300000) return 8955 + (price - 250000) * 0.045
  if (price <= 500000) return 11205 + (price - 300000) * 0.0475
  return 20705 + (price - 500000) * 0.055
}

function calculateWAStampDuty(price: number): number {
  if (price <= 120000) return price * 0.019
  if (price <= 150000) return 2280 + (price - 120000) * 0.029
  if (price <= 360000) return 3150 + (price - 150000) * 0.038
  if (price <= 725000) return 11130 + (price - 360000) * 0.049
  return 29005 + (price - 725000) * 0.051
}

function calculateTASStampDuty(price: number): number {
  if (price <= 3000) return price * 0.0175
  if (price <= 25000) return 52.50 + (price - 3000) * 0.0225
  if (price <= 75000) return 547.50 + (price - 25000) * 0.035
  if (price <= 200000) return 2297.50 + (price - 75000) * 0.04
  if (price <= 375000) return 7297.50 + (price - 200000) * 0.0425
  if (price <= 725000) return 14735 + (price - 375000) * 0.045
  return 30485 + (price - 725000) * 0.0475
}

function calculateNTStampDuty(price: number): number {
  if (price <= 525000) return price * 0.0675
  if (price <= 3000000) return 35437.50 + (price - 525000) * 0.049
  return 156787.50 + (price - 3000000) * 0.05
}

function calculateACTStampDuty(price: number): number {
  // ACT is transitioning to land tax, simplified calculation
  if (price <= 200000) return price * 0.007
  if (price <= 300000) return 1400 + (price - 200000) * 0.022
  if (price <= 500000) return 3600 + (price - 300000) * 0.04
  if (price <= 750000) return 11600 + (price - 500000) * 0.065
  if (price <= 1000000) return 27850 + (price - 750000) * 0.067
  if (price <= 1455000) return 44600 + (price - 1000000) * 0.068
  return 75540 + (price - 1455000) * 0.069
}

// Additional costs calculator
export interface PropertyCosts {
  stampDuty: number
  firstHomeBuyerConcession: number
  netStampDuty: number
  legalFees: number
  buildingInspection: number
  pestInspection: number
  mortgageRegistration: number
  transferFee: number
  lendersInsurance?: number
  totalUpfrontCosts: number
  councilRates: number
  strataFees?: number
  insurance: number
  maintenance: number
  totalOngoingAnnual: number
}

export function calculatePropertyCosts(
  price: number,
  state: string,
  propertyType: string,
  isFirstHomeBuyer: boolean = false,
  loanAmount?: number
): PropertyCosts {
  const stampDutyResult = calculateStampDuty(price, state, isFirstHomeBuyer)
  
  // Upfront costs
  const legalFees = 1500 + (price * 0.001) // Base + percentage
  const buildingInspection = propertyType === 'Land' ? 0 : 500
  const pestInspection = propertyType === 'Land' ? 0 : 300
  const mortgageRegistration = 150
  const transferFee = state === 'NSW' ? 135 : state === 'VIC' ? 100 : 120
  const lendersInsurance = loanAmount && (loanAmount / price > 0.8) ? (loanAmount * 0.02) : undefined

  const totalUpfrontCosts = 
    stampDutyResult.netStampDuty +
    legalFees +
    buildingInspection +
    pestInspection +
    mortgageRegistration +
    transferFee +
    (lendersInsurance || 0)

  // Ongoing costs (annual estimates)
  const councilRates = state === 'NSW' ? 1800 : state === 'VIC' ? 1500 : 1600
  const strataFees = (propertyType === 'Apartment' || propertyType === 'Townhouse') 
    ? 4000 
    : undefined
  const insurance = propertyType === 'Apartment' ? 600 : 1200
  const maintenance = price * 0.01 // 1% of property value per year

  const totalOngoingAnnual = 
    councilRates +
    (strataFees || 0) +
    insurance +
    maintenance

  return {
    stampDuty: stampDutyResult.stampDuty,
    firstHomeBuyerConcession: stampDutyResult.firstHomeBuyerConcession,
    netStampDuty: stampDutyResult.netStampDuty,
    legalFees,
    buildingInspection,
    pestInspection,
    mortgageRegistration,
    transferFee,
    lendersInsurance,
    totalUpfrontCosts,
    councilRates,
    strataFees,
    insurance,
    maintenance,
    totalOngoingAnnual
  }
}
