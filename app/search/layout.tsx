import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search 2,259 Australian Suburbs | Property Investment Finder',
  description: 'Search and filter NSW & VIC suburbs by median price, growth rate, rental yield & investment score. Free property data from government sources. Find your next investment.',
  keywords: [
    'australian suburb search',
    'property finder australia',
    'nsw suburbs',
    'vic suburbs',
    'median price search',
    'property investment finder',
    'suburb filter tool',
    'real estate search australia'
  ],
  openGraph: {
    title: 'Australian Suburb Search & Property Investment Tool',
    description: 'Instantly search 2,259 suburbs with real-time market data, growth forecasts & investment rankings.',
  },
  alternates: {
    canonical: '/search',
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
