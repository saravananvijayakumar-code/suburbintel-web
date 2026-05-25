'use client'

/**
 * Subscription removed — UpgradeModal is now a no-op kept for backward compatibility.
 */

interface UpgradeModalProps {
  isOpen?: boolean
  onClose?: () => void
  feature?: string
  featureKey?: string
  currentTier?: string
  suggestedTier?: string
}

export default function UpgradeModal(_props: UpgradeModalProps) {
  return null
}
