import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get the news article
    const news = await prisma.property_news.findUnique({
      where: { id }
    })

    if (!news) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Get related news (same category or state)
    const related = await prisma.property_news.findMany({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { category: news.category },
              { state: news.state }
            ]
          }
        ]
      },
      orderBy: { publishedAt: 'desc' },
      take: 3
    })

    return NextResponse.json({
      success: true,
      news,
      related
    })
  } catch (error) {
    console.error('Error fetching news article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}
