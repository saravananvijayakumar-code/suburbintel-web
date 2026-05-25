import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Property Portfolio Tracker | Monitor Your Australian Investments',
  description: 'Track unlimited properties across NSW & VIC. Real-time valuations, performance analytics, growth projections & automated reporting. Free portfolio tool.',
  keywords: [
    'property portfolio tracker',
    'investment property tracking',
    'real estate portfolio management',
    'property performance analytics',
    'australian property tracker',
    'portfolio monitoring tool'
  ],
  openGraph: {
    title: 'Australian Property Portfolio Management Tool',
    description: 'Monitor your property investments in real-time. Track performance, equity, yields & capital growth across your portfolio.',
  },
  alternates: {
    canonical: '/portfolio',
  },
}

// This ensures the /portfolio page is not statically generated
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
