import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Invest in Australia 2025 | Suburb Intel',
  description: 'Discover the best suburbs for property investment across Australia. Data-driven rankings based on growth potential, rental yields, and market fundamentals.',
}

export default function BestSuburbsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
