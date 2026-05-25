import { Metadata } from 'next'

// This will be overridden by dynamic metadata generation
export const metadata: Metadata = {
  title: 'Suburb Analysis | SuburbIntel',
  description: 'Comprehensive property market analysis and investment insights for Australian suburbs.',
}

export default function SuburbLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
