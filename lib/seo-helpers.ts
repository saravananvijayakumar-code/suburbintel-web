/**
 * SEO Helper Functions
 * Provides Schema.org structured data and meta enhancements for suburb pages
 */

import { Metadata } from 'next'

export interface SuburbSEOData {
  name: string
  state: string
  postcode: string
  medianPrice: number
  rentalYield: number
  growth12m: number
  investmentScore: number
  population?: number
  description?: string
}

/**
 * Top 20 high-traffic suburbs for enhanced SEO
 * Based on major metro areas and investment hotspots
 */
export const TOP_SUBURBS = [
  // Sydney Metro
  { name: 'Sydney', state: 'NSW', postcode: '2000', keywords: ['CBD', 'waterfront', 'prestige'] },
  { name: 'Parramatta', state: 'NSW', postcode: '2150', keywords: ['growth corridor', 'infrastructure'] },
  { name: 'Bondi', state: 'NSW', postcode: '2026', keywords: ['beach', 'lifestyle', 'premium'] },
  { name: 'Chatswood', state: 'NSW', postcode: '2067', keywords: ['family', 'schools', 'transport'] },
  { name: 'Liverpool', state: 'NSW', postcode: '2170', keywords: ['affordable', 'growth', 'western sydney'] },
  
  // Melbourne Metro
  { name: 'Melbourne', state: 'VIC', postcode: '3000', keywords: ['CBD', 'culture', 'apartments'] },
  { name: 'Brunswick', state: 'VIC', postcode: '3056', keywords: ['inner city', 'lifestyle', 'trendy'] },
  { name: 'Glen Waverley', state: 'VIC', postcode: '3150', keywords: ['schools', 'asian precinct', 'family'] },
  { name: 'Werribee', state: 'VIC', postcode: '3030', keywords: ['affordable', 'growth', 'first home buyer'] },
  { name: 'Box Hill', state: 'VIC', postcode: '3128', keywords: ['transport', 'development', 'hospitals'] },
  
  // Brisbane Metro
  { name: 'Brisbane', state: 'QLD', postcode: '4000', keywords: ['CBD', 'river', 'olympics 2032'] },
  { name: 'Fortitude Valley', state: 'QLD', postcode: '4006', keywords: ['nightlife', 'apartments', 'entertainment'] },
  { name: 'Chermside', state: 'QLD', postcode: '4032', keywords: ['shopping', 'northern suburbs', 'infrastructure'] },
  { name: 'Logan', state: 'QLD', postcode: '4114', keywords: ['affordable', 'growth', 'investment'] },
  
  // Perth Metro
  { name: 'Perth', state: 'WA', postcode: '6000', keywords: ['CBD', 'mining', 'lifestyle'] },
  { name: 'Joondalup', state: 'WA', postcode: '6027', keywords: ['northern suburbs', 'beaches', 'university'] },
  
  // Adelaide & Other Capitals
  { name: 'Adelaide', state: 'SA', postcode: '5000', keywords: ['CBD', 'affordable', 'wine'] },
  { name: 'Canberra', state: 'ACT', postcode: '2600', keywords: ['capital', 'government', 'stable'] },
  
  // High Growth Regional
  { name: 'Newcastle', state: 'NSW', postcode: '2300', keywords: ['coastal', 'regional', 'lifestyle'] },
  { name: 'Wollongong', state: 'NSW', postcode: '2500', keywords: ['coastal', 'university', 'sydney commuter'] },
]

/**
 * Generate comprehensive metadata for suburb pages
 */
export function generateSuburbMetadata(suburb: SuburbSEOData): Metadata {
  const { name, state, postcode, medianPrice, rentalYield, growth12m, investmentScore } = suburb
  const fullName = `${name}, ${state} ${postcode}`
  
  // Check if this is a top suburb for enhanced SEO
  const isTopSuburb = TOP_SUBURBS.some(
    s => s.name.toLowerCase() === name.toLowerCase() && s.state === state
  )
  
  const topSuburb = TOP_SUBURBS.find(
    s => s.name.toLowerCase() === name.toLowerCase() && s.state === state
  )
  
  // Safety checks for undefined values
  if (!medianPrice || !rentalYield || growth12m === undefined || !investmentScore) {
    // Return basic metadata if data is incomplete
    return {
      title: `${fullName} - Property Analysis | SuburbIntel`,
      description: `Property market data and investment insights for ${fullName}.`,
    }
  }
  
  // Format price nicely
  const priceFormatted = medianPrice ? new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(medianPrice) : '$0'
  
  // Generate keyword-rich title
  const title = isTopSuburb
    ? `${fullName} Property Market Report 2025 | Investment Analysis & Forecast`
    : `${fullName} - Property Investment Analysis | SuburbIntel`
  
  // Generate compelling meta description with key data
  const keywordPhrase = topSuburb?.keywords?.join(', ') || 'property investment'
  const yieldStr = rentalYield ? rentalYield.toFixed(1) : '0.0'
  const growthStr = growth12m ? growth12m.toFixed(1) : '0.0'
  const scoreStr = investmentScore || 0
  
  const description = isTopSuburb
    ? `${fullName} property market analysis: ${priceFormatted} median, ${yieldStr}% rental yield, ${growth12m && growth12m > 0 ? '+' : ''}${growthStr}% annual growth. Investment score ${scoreStr}/100. ${keywordPhrase}. Updated 2025.`
    : `Comprehensive property market data for ${fullName}. Median price ${priceFormatted}, rental yield ${yieldStr}%, growth ${growth12m && growth12m > 0 ? '+' : ''}${growthStr}%. Investment insights updated 2025.`
  
  // Rich keywords for top suburbs
  const keywords = isTopSuburb
    ? [
        `${name} property market`,
        `${name} real estate`,
        `${name} investment`,
        `${name} house prices`,
        `${name} rental yield`,
        `${state} property investment`,
        ...(topSuburb?.keywords || []),
        'property forecast 2025',
        'suburb analysis',
        'investment score'
      ].join(', ')
    : `${name} property, ${state} real estate, ${name} house prices, rental yield, investment analysis`
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://suburbintel.com/suburb/${name.toLowerCase()}-${state.toLowerCase()}-${postcode}`,
      siteName: 'SuburbIntel',
      images: [
        {
          url: `https://suburbintel.com/api/og/suburb?name=${encodeURIComponent(name)}&state=${state}&price=${encodeURIComponent(priceFormatted)}&yield=${yieldStr}&growth=${growthStr}`,
          width: 1200,
          height: 630,
          alt: `${fullName} Property Market Data`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://suburbintel.com/api/og/suburb?name=${encodeURIComponent(name)}&state=${state}&price=${encodeURIComponent(priceFormatted)}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://suburbintel.com/suburb/${name.toLowerCase()}-${state.toLowerCase()}-${postcode}`,
    },
  }
}

/**
 * Generate Schema.org structured data for suburb pages
 */
export function generateSuburbSchema(suburb: SuburbSEOData) {
  const { name, state, postcode, medianPrice, rentalYield, growth12m, investmentScore, population } = suburb
  const fullName = `${name}, ${state} ${postcode}`
  
  // Place schema with real estate data
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: fullName,
    address: {
      '@type': 'PostalAddress',
      addressLocality: name,
      addressRegion: state,
      postalCode: postcode,
      addressCountry: 'AU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Note: Would need actual lat/lng from geocoding API
      addressCountry: 'AU',
    },
    ...(population && {
      population: {
        '@type': 'QuantitativeValue',
        value: population,
      },
    }),
  }
  
  // Real Estate Market Report as Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${fullName} Property Market Report 2025`,
    description: `Comprehensive property market analysis for ${fullName} including median prices, rental yields, growth trends, and investment insights.`,
    author: {
      '@type': 'Organization',
      name: 'SuburbIntel',
      url: 'https://suburbintel.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SuburbIntel',
      logo: {
        '@type': 'ImageObject',
        url: 'https://suburbintel.com/logo.png',
      },
    },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://suburbintel.com/suburb/${name.toLowerCase()}-${state.toLowerCase()}-${postcode}`,
    },
  }
  
  // Aggregate Rating based on investment score
  const ratingSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${fullName} Property Market`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: name,
      addressRegion: state,
      postalCode: postcode,
      addressCountry: 'AU',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (investmentScore / 20).toFixed(1), // Convert 0-100 to 0-5 scale
      bestRating: '5',
      worstRating: '1',
      ratingCount: '100', // Mock review count
    },
  }
  
  // FAQ Schema for top suburbs (with safety checks)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the median house price in ${name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: medianPrice ? `The median house price in ${fullName} is approximately ${new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(medianPrice)} as of 2025.` : `Median house price data for ${fullName} is being updated.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the rental yield in ${name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: rentalYield ? `The rental yield in ${fullName} is approximately ${rentalYield.toFixed(1)}%, which ${rentalYield > 4 ? 'is considered strong' : 'is typical'} for the area.` : `Rental yield data for ${fullName} is being updated.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${name} a good investment?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: (investmentScore && growth12m !== undefined && rentalYield) ? `${fullName} has an investment score of ${investmentScore}/100 with ${growth12m > 0 ? 'positive' : 'negative'} annual growth of ${growth12m.toFixed(1)}%. Consider factors like rental yield (${rentalYield.toFixed(1)}%), infrastructure, and your investment strategy.` : `Investment analysis for ${fullName} is being updated.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the property growth trends in ${name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: growth12m !== undefined ? `${fullName} has experienced ${growth12m > 0 ? 'growth' : 'decline'} of ${Math.abs(growth12m).toFixed(1)}% over the past 12 months. Historical trends and forecasts are available in our detailed analysis.` : `Growth trend data for ${fullName} is being updated.`,
        },
      },
    ],
  }
  
  return {
    place: placeSchema,
    article: articleSchema,
    rating: ratingSchema,
    faq: faqSchema,
  }
}

/**
 * Check if suburb qualifies for enhanced SEO
 */
export function isTopSuburb(name: string, state: string): boolean {
  return TOP_SUBURBS.some(
    s => s.name.toLowerCase() === name.toLowerCase() && s.state === state
  )
}
