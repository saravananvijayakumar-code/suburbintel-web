import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import PWAInstall from '@/components/PWAInstall'

const manrope = Manrope({ 
  subsets: ['latin'], 
  weight: ['400', '500', '700', '800'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://suburbintel.com'),
  title: {
    default: 'Suburb Intel | Australia\'s #1 Property Investment Intelligence Platform',
    template: '%s | Suburb Intel'
  },
  description: 'Find high-growth Australian property investments using ABS Census data and market analytics for 14,500+ suburbs across all states. 100% free suburb search & reports.',
  keywords: [
    'Australian property investment',
    'suburb analysis tool',
    'best suburbs to invest',
    'property market forecasting',
    'suburb comparison Australia',
    'real estate investment calculator',
    'property growth predictions',
    'Australian housing market trends',
    'property portfolio tracker',
    'suburb median price',
    'investment property finder',
    'real estate data platform',
    'property analytics Australia',
    'suburb investment score',
    'rental yield calculator',
    'first home buyer suburbs'
  ],
  authors: [{ name: 'Suburb Intel', url: 'https://suburbintel.com' }],
  creator: 'Suburb Intel',
  publisher: 'Suburb Intel',
  applicationName: 'Suburb Intel',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://suburbintel.com',
    title: 'Suburb Intel | Australia\'s #1 Property Investment Intelligence Platform',
    description: 'Property intelligence for 14,500+ Australian suburbs. ABS Census data, market trends & investment scoring. 100% free, no signup.',
    siteName: 'Suburb Intel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suburb Intel | Australian Property Investment Intelligence',
    description: 'Find your next high-growth property investment. 14,500+ suburbs analyzed with government data. Free and unlimited.',
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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SSKYSG5STM"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SSKYSG5STM');
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Suburb Intel AU",
              "alternateName": "SuburbIntel",
              "url": "https://suburbintel.com",
              "description": "Australia's leading property intelligence platform providing data-driven suburb analysis and investment insights for NSW and Victoria.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "AU"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "saravananvijayakumar@quantumleapventures.com.au",
                "contactType": "Customer Service",
                "areaServed": ["AU"],
                "availableLanguage": ["English"]
              },
              "foundingDate": "2024",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": "5"
              }
            })
          }}
        />
        
        {/* SoftwareApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Suburb Intel AU",
              "applicationCategory": "BusinessApplication",
              "applicationSubCategory": "Real Estate Analytics",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "AUD",
                "availability": "https://schema.org/InStock"
              },
              "description": "Free property intelligence platform for Australian investors. Search 2,259+ suburbs, compare markets, track portfolios.",
              "featureList": [
                "Suburb search and filtering",
                "Market trend analysis",
                "Property portfolio tracking",
                "Suburb comparison tool",
                "Investment scoring",
                "Demographic insights",
                "Rental yield calculator"
              ]
            })
          }}
        />
      </head>
      <body className={manrope.className}>
        <SubscriptionProvider>
          <PWAInstall />
          <Header />
          {children}
          <Footer />
        </SubscriptionProvider>
      </body>
    </html>
  )
}
