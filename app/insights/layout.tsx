import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Australian Property Market Insights & Investment Trends 2025',
  description: 'Real-time property market analysis for NSW & VIC. Track median prices, growth hotspots, rental yields & emerging investment opportunities. Updated daily.',
  keywords: [
    'australian property market insights',
    'property investment trends 2025',
    'nsw property market analysis',
    'vic real estate trends',
    'property market forecast',
    'suburb growth analysis',
    'real estate market intelligence'
  ],
  openGraph: {
    title: 'Property Market Insights | Australian Real Estate Trends',
    description: 'Expert analysis of Australian property markets. Discover high-growth suburbs, market trends & investment opportunities.',
  },
  alternates: {
    canonical: '/insights',
  },
}

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
