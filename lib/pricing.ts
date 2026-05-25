// Subscription tiers removed — every feature is free and unlimited.
// Types and a minimal PRICING_PLANS constant are kept so existing imports compile.

export type SubscriptionTier = 'free' | 'pro'

export interface PricingPlan {
  id: SubscriptionTier
  name: string
  displayName: string
  price: number
  originalPrice?: number
  billingCycle: 'monthly' | 'one-time'
  stripePriceId?: string
  features: string[]
  limits: {
    comparisons: number
    portfolios: number
    watchlist: number
    aiReportsPerMonth: number
    exports: boolean
    aiAssistant: boolean
    advancedMetrics: boolean
    heatmaps: boolean
    forecasting: boolean
    priceAlerts: boolean
    historicalCharts: boolean
  }
  popular?: boolean
  cta: string
}

const UNLIMITED_LIMITS: PricingPlan['limits'] = {
  comparisons: -1,
  portfolios: -1,
  watchlist: -1,
  aiReportsPerMonth: -1,
  exports: true,
  aiAssistant: true,
  advancedMetrics: true,
  heatmaps: true,
  forecasting: true,
  priceAlerts: true,
  historicalCharts: true,
}

export const PRICING_PLANS: Record<SubscriptionTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    displayName: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: ['All features included', 'Unlimited usage', 'No signup required'],
    limits: UNLIMITED_LIMITS,
    cta: 'Get Started',
  },
  pro: {
    id: 'pro',
    name: 'Free',
    displayName: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: ['All features included', 'Unlimited usage', 'No signup required'],
    limits: UNLIMITED_LIMITS,
    cta: 'Get Started',
  },
}

export const TIER_ORDER: SubscriptionTier[] = ['free', 'pro']

export function canAccessFeature(
  _userTier: SubscriptionTier,
  _feature: keyof PricingPlan['limits']
): boolean {
  return true
}

export function getComparisonLimit(_userTier: SubscriptionTier): number {
  return -1
}

export function getPortfolioLimit(_userTier: SubscriptionTier): number {
  return -1
}

export function getWatchlistLimit(_userTier: SubscriptionTier): number {
  return -1
}

export function getAiReportsLimit(_userTier: SubscriptionTier): number {
  return -1
}

export function hasUnlimitedAiReports(_userTier: SubscriptionTier): boolean {
  return true
}

export function hasUnlimitedComparisons(_userTier: SubscriptionTier): boolean {
  return true
}

export function hasUnlimitedPortfolios(_userTier: SubscriptionTier): boolean {
  return true
}

export function getMinimumTierForFeature(
  _feature: keyof PricingPlan['limits']
): SubscriptionTier {
  return 'free'
}

export function needsUpgrade(
  _userTier: SubscriptionTier,
  _feature: keyof PricingPlan['limits']
): boolean {
  return false
}

export function getSuggestedUpgradeTier(
  _currentTier: SubscriptionTier,
  _feature: keyof PricingPlan['limits']
): SubscriptionTier | null {
  return null
}
