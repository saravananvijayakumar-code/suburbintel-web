import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Australian Suburbs | Side-by-Side Property Analysis',
  description: 'Compare up to 4 suburbs side-by-side. Analyze median prices, growth trends, rental yields, demographics & investment potential. Data-driven property comparison.',
  keywords: [
    'compare suburbs australia',
    'suburb comparison tool',
    'side by side suburb analysis',
    'property comparison australia',
    'nsw vic suburb comparison',
    'real estate comparison tool'
  ],
  openGraph: {
    title: 'Suburb Comparison Tool | Australian Property Analytics',
    description: 'Make smarter investment decisions. Compare suburbs across 20+ metrics including price trends, yields & growth forecasts.',
  },
  alternates: {
    canonical: '/compare',
  },
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
