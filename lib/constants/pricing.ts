/**
 * Subscription removed — all features are free and unlimited.
 * This file is kept so existing imports keep compiling.
 */

export const PRICING = {
  monthly: {
    standard: 0,
    promo: 0,
    promo_duration: 'Always',
    promo_expires: new Date('2099-12-31'),
    currency: 'AUD',
    stripe_price_id_standard: '',
    stripe_price_id_promo: '',
  },
  annual: {
    standard: 0,
    promo: 0,
    savings_percent: 0,
    savings_text: 'Free forever',
    promo_expires: new Date('2099-12-31'),
    currency: 'AUD',
    stripe_price_id_standard: '',
    stripe_price_id_promo: '',
  },
  free: {
    search_limit: -1,
    comparison_limit: -1,
    exports_allowed: true,
    alerts_allowed: true,
  },
} as const

export function isPromoActive(): boolean {
  return false
}

export function getPromoDaysRemaining(): number {
  return 0
}

export const PRICING_MESSAGING = {
  monthly_with_promo: {
    headline: 'Free',
    subheadline: 'All features included',
    fine_print: 'No subscription, no signup, no limits.',
    promo_badge: 'FREE',
    cta: 'Get Started',
  },
  monthly_standard: {
    headline: 'Free',
    subheadline: 'All features included',
    fine_print: 'No subscription, no signup, no limits.',
    cta: 'Get Started',
  },
  annual_with_promo: {
    headline: 'Free',
    subheadline: 'All features included',
    fine_print: 'No subscription, no signup, no limits.',
    promo_badge: 'FREE',
    cta: 'Get Started',
  },
  annual_standard: {
    headline: 'Free',
    subheadline: 'All features included',
    fine_print: 'No subscription, no signup, no limits.',
    cta: 'Get Started',
  },
  comparison: {
    monthly_savings: 'Free forever',
    monthly_equivalent: 'No payment required',
  },
} as const

export function getPricingMessage(_plan: 'monthly' | 'annual') {
  return PRICING_MESSAGING.monthly_standard
}
