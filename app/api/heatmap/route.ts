import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit, sanitizeForLog } from '@/lib/security'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Calculate investment score from available data
function calculateInvestmentScore(suburb: any): number | null {
    let score = 50 // Base score
    let factors = 0

    // Rental yield contribution (up to 25 points)
    if (suburb.rentalYield != null && suburb.rentalYield > 0) {
        const yieldScore = Math.min(25, (suburb.rentalYield / 8) * 25)
        score += yieldScore
        factors++
    }

    // Growth contribution (up to 25 points)
    if (suburb.growth12m != null) {
        const growthScore = Math.min(25, Math.max(-25, (suburb.growth12m / 20) * 25))
        score += growthScore
        factors++
    }

    // Price affordability (inverse - lower prices get higher scores, up to 15 points)
    if (suburb.medianPrice != null && suburb.medianPrice > 0) {
        const priceScore = Math.max(0, 15 - (suburb.medianPrice / 2000000) * 15)
        score += priceScore
        factors++
    }

    // Population density bonus (up to 10 points for larger populations)
    if (suburb.population != null && suburb.population > 0) {
        const popScore = Math.min(10, (suburb.population / 50000) * 10)
        score += popScore
        factors++
    }

    if (factors === 0) return null

    return Math.min(100, Math.max(0, score))
}

// Calculate demand score from available data
function calculateDemandScore(suburb: any): number | null {
    let score = 50 // Base score
    let factors = 0

    // High rental yield suggests high demand (up to 30 points)
    if (suburb.rentalYield != null && suburb.rentalYield > 0) {
        const yieldScore = Math.min(30, (suburb.rentalYield / 6) * 30)
        score += yieldScore
        factors++
    }

    // Positive growth suggests demand (up to 25 points)
    if (suburb.growth12m != null && suburb.growth12m > 0) {
        const growthScore = Math.min(25, (suburb.growth12m / 15) * 25)
        score += growthScore
        factors++
    }

    // Population indicates demand (up to 20 points)
    if (suburb.population != null && suburb.population > 0) {
        const popScore = Math.min(20, (suburb.population / 30000) * 20)
        score += popScore
        factors++
    }

    if (factors === 0) return null

    return Math.min(100, Math.max(0, score))
}

async function handler() {
    try {
        // First, try to get suburbs with investment data
        const suburbs = await prisma.suburbs.findMany({
            select: {
                id: true,
                name: true,
                state: true,
                postcode: true,
                medianPrice: true,
                rentalYield: true,
                growth12m: true,
                growth5y: true,
                investmentScore: true,
                population: true,
                demandScore: true,
            },
            where: {
                OR: [
                    { medianPrice: { not: null } },
                    { investmentScore: { not: null } },
                    { rentalYield: { not: null } },
                ]
            },
            orderBy: [
                { investmentScore: 'desc' },
                { medianPrice: 'desc' }
            ],
            take: 1000,
        })

        // Calculate scores on-the-fly if not set in database
        const enrichedSuburbs = suburbs.map(suburb => ({
            ...suburb,
            investmentScore: suburb.investmentScore ?? calculateInvestmentScore(suburb),
            demandScore: suburb.demandScore ?? calculateDemandScore(suburb),
        }))

        // If no suburbs with investment data, get all suburbs
        if (suburbs.length === 0) {
            const allSuburbs = await prisma.suburbs.findMany({
                select: {
                    id: true,
                    name: true,
                    state: true,
                    postcode: true,
                    medianPrice: true,
                    rentalYield: true,
                    growth12m: true,
                    growth5y: true,
                    investmentScore: true,
                    population: true,
                    demandScore: true,
                },
                take: 1000,
            })

            const enrichedAllSuburbs = allSuburbs.map(suburb => ({
                ...suburb,
                investmentScore: suburb.investmentScore ?? calculateInvestmentScore(suburb),
                demandScore: suburb.demandScore ?? calculateDemandScore(suburb),
            }))

            return NextResponse.json({ 
                suburbs: enrichedAllSuburbs,
                count: enrichedAllSuburbs.length,
                timestamp: new Date().toISOString(),
                message: 'Showing all suburbs (no filtered data available)'
            })
        }

        return NextResponse.json({ 
            suburbs: enrichedSuburbs,
            count: enrichedSuburbs.length,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Error fetching heatmap data:', sanitizeForLog(error))
        
        // Don't expose internal error details
        return NextResponse.json(
            { 
                error: 'Failed to fetch heatmap data', 
                suburbs: [] 
            },
            { status: 500 }
        )
    }
}

export const GET = withRateLimit(handler, { maxRequests: 60, windowMs: 60000 })

