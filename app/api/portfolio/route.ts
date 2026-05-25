import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { 
  SuburbNameSchema,
  StateSchema,
  IdSchema 
} from '@/lib/security/validation'
import { 
  sanitizeInput, 
  securityError,
  containsSqlInjection 
} from '@/lib/security/middleware'

// Portfolio item validation schema
const PortfolioAddSchema = z.object({
  suburbName: SuburbNameSchema,
  state: StateSchema,
  purchasePrice: z.number().positive().max(100_000_000).optional(),
  purchaseDate: z.string().optional(),
  notes: z.string().max(1000).transform(sanitizeInput).optional()
})

// GET: Fetch user's portfolio
export async function GET(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    

    // Find or create user
    const user = await prisma.users.upsert({
      where: { id: userId },
      update: { updatedAt: new Date() },
      create: {
        id: userId,
        email: `${userId}@clerk.user`,
        updatedAt: new Date(),
      }
    })

    

    // Fetch portfolio with suburb data
    const portfolio = await prisma.portfolios.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Enrich with current suburb data
    const enrichedPortfolio = await Promise.all(
      portfolio.map(async (item: any) => {
        const suburb = await prisma.suburbs.findFirst({
          where: {
            name: item.suburb,
            state: item.state
          }
        })

        return {
          id: item.id,
          suburbName: item.suburb,
          state: item.state,
          purchasePrice: item.purchasePrice,
          currentValue: suburb?.medianPrice || item.currentValue || item.purchasePrice,
          notes: item.notes,
          addedAt: item.createdAt
        }
      })
    )

    return NextResponse.json({
      success: true,
      items: enrichedPortfolio
    })
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch portfolio',
      items: []
    }, { status: 500 })
  }
}

// POST: Add suburb to portfolio
export async function POST(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    

    const body = await request.json()
    
    // Validate input with Zod schema
    const validated = PortfolioAddSchema.safeParse(body)
    if (!validated.success) {
      return securityError(validated.error.errors[0].message)
    }
    
    const { suburbName, state, purchasePrice, purchaseDate, notes } = validated.data

    // Check for SQL injection
    if (containsSqlInjection(suburbName) || containsSqlInjection(state)) {
      return securityError('Invalid input detected')
    }

    // Find or create user
    const user = await prisma.users.upsert({
      where: { id: userId },
      update: { updatedAt: new Date() },
      create: {
        id: userId,
        email: `${userId}@clerk.user`,
        updatedAt: new Date(),
      }
    })

    

    // Check if suburb exists in database
    const suburb = await prisma.suburbs.findFirst({
      where: {
        name: suburbName,
        state: state
      }
    })

    if (!suburb) {
      return NextResponse.json({ 
        error: 'Suburb not found in database' 
      }, { status: 404 })
    }

    // Check if already in portfolio
    const existing = await prisma.portfolios.findFirst({
      where: {
        userId: user.id,
        suburb: suburbName,
        state: state
      }
    })

    if (existing) {
      return NextResponse.json({ 
        error: 'Suburb already in portfolio' 
      }, { status: 409 })
    }

    // Add to portfolio
    const portfolioItem = await prisma.portfolios.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        name: 'My Portfolio',
        address: `${sanitizeInput(suburbName)}, ${state}`,
        suburb: sanitizeInput(suburbName),
        state,
        postcode: suburb.postcode,
        purchasePrice: purchasePrice ?? suburb.medianPrice ?? 0,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        notes: notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      item: {
        id: portfolioItem.id,
        suburbName: portfolioItem.suburb,
        state: portfolioItem.state,
        purchasePrice: portfolioItem.purchasePrice,
        currentValue: suburb.medianPrice || portfolioItem.purchasePrice,
        notes: portfolioItem.notes,
        addedAt: portfolioItem.createdAt
      }
    })
  } catch (error) {
    console.error('Portfolio add error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to add to portfolio' 
    }, { status: 500 })
  }
}

// DELETE: Remove suburb from portfolio
export async function DELETE(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        error: 'Portfolio item ID required' 
      }, { status: 400 })
    }

    // Validate ID format and check for injection
    if (containsSqlInjection(id) || id.length < 20 || id.length > 30) {
      return securityError('Invalid portfolio item ID')
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    

    // Verify ownership and delete
    const item = await prisma.portfolios.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json({ 
        error: 'Portfolio item not found' 
      }, { status: 404 })
    }

    if (item.userId !== user.id) {
      return NextResponse.json({ 
        error: 'Not authorized to delete this item' 
      }, { status: 403 })
    }

    await prisma.portfolios.delete({
      where: { id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Portfolio item deleted'
    })
  } catch (error) {
    console.error('Portfolio delete error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete from portfolio' 
    }, { status: 500 })
  }
}

