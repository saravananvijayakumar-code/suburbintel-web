'use client'

import { createContext, useContext, ReactNode } from 'react'
import { SubscriptionTier, PRICING_PLANS } from '@/lib/pricing'

/**
 * Subscription system removed — every visitor gets full unlimited access.
 * This file is kept as a pass-through so existing consumers keep compiling.
 */

interface User {
  id: string
  email: string
  name?: string
  subscriptionTier: SubscriptionTier
}

interface SubscriptionContextType {
  user: User | null
  loading: boolean
  subscriptionTier: SubscriptionTier
  hasProAccess: boolean
  isEndingSoon: boolean
  canAccess: (feature: keyof typeof PRICING_PLANS.free.limits) => boolean
  getComparisonLimit: () => number
  getPortfolioLimit: () => number
  isFeatureLocked: (feature: keyof typeof PRICING_PLANS.free.limits) => boolean
  upgradeUrl: (targetTier?: SubscriptionTier) => string
  refreshSubscription: () => Promise<void>
  logout: () => void
}

const GUEST_USER: User = {
  id: 'guest',
  email: 'guest@suburbintel.com.au',
  subscriptionTier: 'pro',
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  // All features are free and unlimited.
  const value: SubscriptionContextType = {
    user: GUEST_USER,
    loading: false,
    subscriptionTier: 'pro',
    hasProAccess: true,
    isEndingSoon: false,
    canAccess: () => true,
    getComparisonLimit: () => -1,
    getPortfolioLimit: () => -1,
    isFeatureLocked: () => false,
    upgradeUrl: () => '/',
    refreshSubscription: async () => {},
    logout: () => {},
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

// Helper hook kept for backward compatibility
export function useFeatureAccess(_feature: keyof typeof PRICING_PLANS.free.limits) {
  return {
    canAccess: true,
    isLocked: false,
    upgradeUrl: '/',
  }
}
