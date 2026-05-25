import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RiskAnalysisSchema, validateSearchParams, ValidationError, sanitizeForLog, withRateLimit } from '@/lib/security';

async function handler(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Validate and sanitize query params
        const { state, riskType, search, page, limit } = validateSearchParams(
            searchParams,
            RiskAnalysisSchema
        );

        // Build where clause
        const where: any = {
            AND: [
                // Only suburbs with risk data
                {
                    OR: [
                        { bushfireRisk: { not: null } },
                        { floodRisk: { not: null } },
                        { suburbRiskScore: { gt: 0 } }
                    ]
                }
            ]
        };

        // State filter
        if (state && state !== 'all') {
            where.AND.push({ state });
        }

        // Search filter
        if (search) {
            where.AND.push({
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            });
        }

        // Risk type filter
        if (riskType && riskType !== 'all') {
            if (riskType === 'bushfire') {
                where.AND.push({
                    bushfireRisk: { in: ['medium', 'high', 'extreme'] }
                });
            } else if (riskType === 'flood') {
                where.AND.push({
                    floodRisk: { in: ['medium', 'high', 'extreme'] }
                });
            } else if (riskType === 'coastal') {
                where.AND.push({
                    name: {
                        in: await getCoastalSuburbs()
                    }
                });
            }
        }

        // Get total count
        const total = await prisma.suburbs.count({ where });

        // Fetch suburbs
        const suburbs = await prisma.suburbs.findMany({
            where,
            select: {
                id: true,
                name: true,
                state: true,
                postcode: true,
                bushfireRisk: true,
                floodRisk: true,
                suburbRiskScore: true,
                dataSource: true
            },
            orderBy: [
                { suburbRiskScore: 'desc' },
                { name: 'asc' }
            ],
            skip: (page - 1) * limit,
            take: limit
        });

        // Transform data for frontend
        const transformedData = suburbs.map(suburb => {
            // Determine if coastal based on known coastal suburbs
            const coastalSuburbs = ['Bondi', 'Manly', 'Cronulla', 'Newcastle', 'Wollongong', 'Port Macquarie',
                'Coffs Harbour', 'Byron Bay', 'Ballina', 'Tweed Heads', 'Nowra', 'Batemans Bay', 'Kiama',
                'Shellharbour', 'Northern Beaches', 'Palm Beach', 'Avalon', 'Mona Vale', 'Dee Why', 'Narrabeen',
                'Mosman', 'Randwick', 'Waverley', 'Rockdale', 'Botany', 'St Kilda', 'Brighton', 'Sandringham',
                'Frankston', 'Mornington', 'Portsea', 'Sorrento', 'Geelong', 'Torquay', 'Lorne', 'Apollo Bay',
                'Warrnambool', 'Point Cook', 'Altona', 'Williamstown'];

            const isCoastal = coastalSuburbs.includes(suburb.name);

            return {
                suburb: suburb.name,
                state: suburb.state,
                bushfireRisk: suburb.bushfireRisk,
                floodRisk: suburb.floodRisk,
                coastalErosion: isCoastal,
                overallRiskScore: suburb.suburbRiskScore || 0,
                dataSource: suburb.dataSource
            };
        });

        return NextResponse.json({
            data: transformedData,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json(
                { error: 'Invalid parameters', details: error.message },
                { status: 400 }
            );
        }
        
        console.error('Error fetching risk analysis data:', sanitizeForLog(error));
        return NextResponse.json(
            { error: 'Failed to fetch risk analysis data' },
            { status: 500 }
        );
    }
}

// Helper function to get coastal suburbs
async function getCoastalSuburbs(): Promise<string[]> {
    return [
        'Bondi', 'Manly', 'Cronulla', 'Newcastle', 'Wollongong', 'Port Macquarie',
        'Coffs Harbour', 'Byron Bay', 'Ballina', 'Tweed Heads', 'Nowra', 'Batemans Bay',
        'Kiama', 'Shellharbour', 'Northern Beaches', 'Palm Beach', 'Avalon', 'Mona Vale',
        'Dee Why', 'Narrabeen', 'Mosman', 'Randwick', 'Waverley', 'Rockdale', 'Botany',
        'St Kilda', 'Brighton', 'Sandringham', 'Frankston', 'Mornington', 'Portsea',
        'Sorrento', 'Geelong', 'Torquay', 'Lorne', 'Apollo Bay', 'Warrnambool',
        'Point Cook', 'Altona', 'Williamstown'
    ];
}

export const GET = withRateLimit(handler, { maxRequests: 60, windowMs: 60000 });

