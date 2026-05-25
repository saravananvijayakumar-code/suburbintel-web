import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRateLimit, sanitizeForLog } from '@/lib/security';

async function handler() {
  try {
    // Filter for NSW and VIC states only with valid market data
    const stateFilter = { state: { in: ['NSW', 'VIC'] } };
    const baseWhereClause = {
      ...stateFilter,
      medianPrice: { not: null, gt: 0 },
    };

    // Parallelize queries for performance - combined NSW + VIC stats
    const [
      aggregates,
      hottest,
      coolest,
      highYield,
      bestValue,
      totalSuburbs,
      nswSuburbs,
      vicSuburbs
    ] = await Promise.all([
      // 1. Aggregates - Combined NSW + VIC averages
      prisma.suburbs.aggregate({
        where: baseWhereClause,
        _avg: {
          medianPrice: true,
          growth12m: true,
          rentalYield: true,
        },
      }),
      // 2. Hottest - Top growth across NSW + VIC combined
      prisma.suburbs.findMany({
        where: { ...stateFilter, growth12m: { not: null } },
        orderBy: { growth12m: 'desc' },
        take: 25,
        select: {
          id: true, name: true, state: true, postcode: true,
          medianPrice: true, growth12m: true, growth3m: true,
          investmentScore: true, rentalYield: true
        }
      }),
      // 3. Coolest - Biggest declines across NSW + VIC combined
      prisma.suburbs.findMany({
        where: { ...stateFilter, growth12m: { not: null } },
        orderBy: { growth12m: 'asc' },
        take: 25,
        select: {
          id: true, name: true, state: true, postcode: true,
          medianPrice: true, growth12m: true, growth3m: true,
          investmentScore: true
        }
      }),
      // 4. High Yield - Best rental yields across NSW + VIC combined
      prisma.suburbs.findMany({
        where: { ...stateFilter, rentalYield: { not: null, gt: 0 } },
        orderBy: { rentalYield: 'desc' },
        take: 25,
        select: {
          id: true, name: true, state: true, postcode: true,
          rentalYield: true, medianPrice: true, weeklyRent: true
        }
      }),
      // 5. Best Value - Top investment scores across NSW + VIC combined
      prisma.suburbs.findMany({
        where: { ...stateFilter, investmentScore: { not: null, gt: 0 } },
        orderBy: { investmentScore: 'desc' },
        take: 25,
        select: {
          id: true, name: true, state: true, postcode: true,
          investmentScore: true, medianPrice: true, rentalYield: true,
          growth12m: true
        }
      }),
      // 6. Total Count - NSW + VIC combined
      prisma.suburbs.count({ where: baseWhereClause }),
      // 7. NSW Count
      prisma.suburbs.count({ where: { ...baseWhereClause, state: 'NSW' } }),
      // 8. VIC Count
      prisma.suburbs.count({ where: { ...baseWhereClause, state: 'VIC' } }),
    ]);

    return NextResponse.json({
      hottest,
      coolest,
      highYield,
      bestValue,
      avgMedianPrice: aggregates._avg.medianPrice || 0,
      avgGrowth12m: aggregates._avg.growth12m || 0,
      avgYield: aggregates._avg.rentalYield || 0,
      totalSuburbs,
      nswSuburbs,
      vicSuburbs,
    });
  } catch (error) {
    console.error('Error fetching market trends:', sanitizeForLog(error));
    return NextResponse.json(
      { error: 'Failed to fetch market trends' },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handler, { maxRequests: 60, windowMs: 60000 });

