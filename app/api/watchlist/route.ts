import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  WatchlistSchema, 
  IdSchema,
  ValidationError 
} from '@/lib/security/validation'
import { 
  sanitizeInput, 
  securityError,
  containsSqlInjection 
} from '@/lib/security/middleware'

// GET - List user's watchlist
export async function GET(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    
    
    const watchlistRows = await prisma.watchlists.findMany({
      where: { userId },
      include: {
        suburbs: {
          select: {
            id: true,
            name: true,
            state: true,
            postcode: true,
            medianPrice: true,
            weeklyRent: true,
            rentalYield: true,
            growth12m: true,
            growth6m: true,
            growth3m: true,
            investmentScore: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const watchlist = watchlistRows.map(row => ({
      id: row.id,
      suburb: row.suburbs,
      emailAlerts: row.emailAlerts,
      notes: '',
      createdAt: row.createdAt.toISOString(),
    }))
    
    return NextResponse.json({
      success: true,
      watchlist,
      count: watchlist.length
    })
    
  } catch (error: any) {
    console.error('Watchlist GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch watchlist' },
      { status: 500 }
    )
  }
}

// POST - Add suburb to watchlist
export async function POST(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    
    
    const body = await request.json()
    console.log('Watchlist POST body:', JSON.stringify(body))
    
    // Validate input with Zod schema
    const validated = WatchlistSchema.safeParse(body)
    if (!validated.success) {
      console.log('Watchlist validation error:', JSON.stringify(validated.error.errors))
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { suburbId, suburbName, state, postcode } = validated.data
    const { emailAlerts, priceAlerts, weeklyDigest } = body
    
    // Check for SQL injection in IDs
    if (containsSqlInjection(suburbId)) {
      return securityError('Invalid suburb ID')
    }
    
    // Verify suburb exists in database
    const suburbExists = await prisma.suburbs.findUnique({
      where: { id: suburbId }
    })
    
    if (!suburbExists) {
      console.log('Suburb not found with ID:', suburbId)
      return NextResponse.json(
        { success: false, error: 'Suburb not found in database' },
        { status: 404 }
      )
    }
    
    // Ensure user exists in database (guest user)
    const userEmail = 'guest@suburbintel.com.au'
    const userName = 'Guest'
    
    await prisma.users.upsert({
      where: { id: userId },
      update: { 
        email: userEmail,
        name: userName,
        updatedAt: new Date(),
      },
      create: {
        id: userId,
        email: userEmail,
        name: userName,
        updatedAt: new Date(),
      },
    })
    
    // Subscription removed — unlimited watchlist for everyone
    
    const existingCount = await prisma.watchlists.count({
      where: { userId }
    })
    
    // No watchlist limits — unlimited for all users
    
    // Check if already in watchlist
    const existing = await prisma.watchlists.findUnique({
      where: {
        userId_suburbId: { userId, suburbId }
      }
    })
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Suburb already in watchlist' },
        { status: 400 }
      )
    }
    
    const watchlistItem = await prisma.watchlists.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        suburbId,
        suburbName,
        state,
        postcode,
        emailAlerts: emailAlerts ?? true,
        priceAlerts: priceAlerts ?? true,
        weeklyDigest: weeklyDigest ?? true,
        updatedAt: new Date(),
      }
    })
    
    return NextResponse.json({
      success: true,
      watchlistItem,
      message: 'Suburb added to watchlist'
    })
    
  } catch (error: any) {
    console.error('Watchlist POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add to watchlist' },
      { status: 500 }
    )
  }
}

// DELETE - Remove from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const suburbId = searchParams.get('suburbId')
    
    if (!id && !suburbId) {
      return NextResponse.json(
        { success: false, error: 'Watchlist item ID or Suburb ID required' },
        { status: 400 }
      )
    }
    
    // Validate IDs to prevent injection
    if (id && containsSqlInjection(id)) {
      return securityError('Invalid watchlist ID')
    }
    if (suburbId && containsSqlInjection(suburbId)) {
      return securityError('Invalid suburb ID')
    }
    
    // Delete by watchlist item ID or by suburbId
    if (id) {
      await prisma.watchlists.deleteMany({
        where: { id, userId }
      })
    } else {
      await prisma.watchlists.deleteMany({
        where: {
          userId_suburbId: { userId, suburbId: suburbId! }
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Suburb removed from watchlist'
    })
    
  } catch (error: any) {
    console.error('Watchlist DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove from watchlist' },
      { status: 500 }
    )
  }
}
