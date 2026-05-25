'use client'

import { ReactNode } from 'react'

/**
 * FeatureGate is now a transparent pass-through. Every feature is free.
 * Kept as a component so the dozens of consumer pages keep compiling.
 */

type FeatureType =
  | 'aiAssistant'
  | 'heatmaps'
  | 'forecasting'
  | 'historicalCharts'
  | 'advancedMetrics'
  | 'exports'
  | 'priceAlerts'
  | 'unlimitedComparisons'
  | 'unlimitedWatchlist'
  | 'unlimitedPortfolios'

interface FeatureGateProps {
  feature?: FeatureType
  children: ReactNode
  fallback?: 'blur' | 'lock' | 'teaser' | 'none'
  showUpgradePrompt?: boolean
  teaserContent?: ReactNode
  className?: string
}

export default function FeatureGate({ children, className = '' }: FeatureGateProps) {
  return <div className={className}>{children}</div>
}

export function useFeatureAccess(_feature: FeatureType): boolean {
  return true
}

interface ProOnlyPageProps {
  children: ReactNode
  feature?: FeatureType
  title?: string
  description?: string
}

export function ProOnlyPage({ children }: ProOnlyPageProps) {
  return <>{children}</>
}
