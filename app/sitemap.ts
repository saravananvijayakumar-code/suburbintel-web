import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://suburbintel-web.vercel.app'

  // Generate suburb URLs from database
  let suburbPages: MetadataRoute.Sitemap = []

  try {
    const suburbs = await prisma.suburbs.findMany({
      where: { state: 'NSW' }, // Start with NSW, expand later
      select: { name: true, state: true, postcode: true, updatedAt: true },
      orderBy: { medianPrice: 'desc' },
      take: 5000, // Limit to avoid timeout
    })

    suburbPages = suburbs.map((suburb) => ({
      url: `${baseUrl}/suburb/${encodeURIComponent(suburb.name)}?state=${suburb.state}&postcode=${suburb.postcode}`,
      lastModified: suburb.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Sitemap: Database error', error)
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/insights`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/market-trends`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/heatmap`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/best-suburbs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/best-suburbs/sydney`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/best-suburbs/melbourne`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/best-suburbs/under-500k`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/best-suburbs/high-yield`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/best-suburbs/first-home-buyers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/state/nsw`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/state/vic`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/watchlist`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/mortgage-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/risk-analysis`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/data-sources`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  return [...staticPages, ...suburbPages]
}
