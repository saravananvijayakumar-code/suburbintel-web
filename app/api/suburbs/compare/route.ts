import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from '@/lib/rate-limiter';
import { sanitizeInput, containsSqlInjection } from '@/lib/security/middleware';

const prisma = new PrismaClient();

// Maximum suburbs for comparison
const MAX_COMPARE_SUBURBS = 5;

export async function GET(request: NextRequest) {
  // Rate limiting
  const identifier = getIdentifier(request);
  const rateLimitResult = await checkRateLimit(identifier, 'api:general');
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
      { 
        status: 429, 
        headers: { 'Retry-After': String(rateLimitResult.retryAfter || 60) } 
      }
    );
  }
  
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');
  const namesParam = searchParams.get('names'); // Support name-based lookup

  if (!idsParam && !namesParam) {
    return NextResponse.json({ error: 'Missing ids or names parameter' }, { status: 400 });
  }

  try {
    let suburbs: any[] = [];
    
    if (idsParam) {
      // Validate and sanitize IDs
      const ids = idsParam.split(',').filter(Boolean).slice(0, MAX_COMPARE_SUBURBS);
      
      // Validate ID format (CUID format)
      const validIdPattern = /^[a-z0-9]{20,30}$/i;
      const validIds = ids.filter(id => {
        const sanitized = sanitizeInput(id);
        return validIdPattern.test(sanitized) && !containsSqlInjection(sanitized);
      });
      
      if (validIds.length === 0) {
        return NextResponse.json(
          { error: 'Please provide 1-5 valid suburb IDs' },
          { status: 400 }
        );
      }
      
      suburbs = await prisma.suburbs.findMany({
        where: { id: { in: validIds } },
        select: getSuburbSelectFields(),
      });
    } else if (namesParam) {
      // Validate input length and patterns
      if (namesParam.length > 500) {
        return NextResponse.json({ error: 'Query too long' }, { status: 400 });
      }
      
      if (containsSqlInjection(namesParam)) {
        return NextResponse.json({ error: 'Invalid characters' }, { status: 400 });
      }
      
      // Format: "Sydney,NSW,2000|Melbourne,VIC,3000"
      const suburbQueries = namesParam.split('|').filter(Boolean).slice(0, MAX_COMPARE_SUBURBS);
      
      // Validate Australian states
      const validStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
      
      const whereConditions = suburbQueries
        .map(q => {
          const parts = q.split(',');
          const name = sanitizeInput(parts[0] || '');
          const state = (parts[1] || '').toUpperCase().trim();
          const postcode = sanitizeInput(parts[2] || '');
          
          // Validate name (alphanumeric + spaces + hyphens + apostrophes)
          if (!name || !/^[a-zA-Z0-9\s\-']+$/.test(name)) {
            return null;
          }
          
          // Validate state if provided
          if (state && !validStates.includes(state)) {
            return null;
          }
          
          // Validate postcode if provided (4 digits)
          if (postcode && !/^\d{4}$/.test(postcode)) {
            return null;
          }
          
          return {
            name: { equals: name, mode: 'insensitive' as const },
            ...(state && { state }),
            ...(postcode && { postcode }),
          };
        })
        .filter(Boolean);
      
      if (whereConditions.length === 0) {
        return NextResponse.json(
          { error: 'Invalid suburb query format' },
          { status: 400 }
        );
      }
      
      suburbs = await prisma.suburbs.findMany({
        where: { OR: whereConditions },
        select: getSuburbSelectFields(),
      });
    }

    const response = NextResponse.json({ 
      success: true,
      suburbs,
      count: suburbs?.length || 0
    });
    
    // Add rate limit headers
    const headers = getRateLimitHeaders(rateLimitResult);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error: any) {
    console.error('Error fetching suburbs for comparison:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suburbs' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function getSuburbSelectFields() {
  return {
    id: true,
    name: true,
    state: true,
    postcode: true,
    
    // Pricing
    medianPrice: true,
    weeklyRent: true,
    rentalYield: true,
    growth3m: true,
    growth6m: true,
    growth12m: true,
    investmentScore: true,
    
    // Demographics
    population: true,
    medianAge: true,
    medianIncome: true,
    ownerOccupierPercentage: true,
    renterPercentage: true,
    unemploymentRate: true,
    averageHouseholdSize: true,
    medianHouseholdSize: true,
    
    // Livability
    walkabilityScore: true,
    publicTransportScore: true,
    schoolQualityScore: true,
    crimeRateIndex: true,
    
    // Environmental
    bushfireRisk: true,
    floodRisk: true,
    
    // Infrastructure
    trainStations: true,
    busStops: true,
    primarySchools: true,
    secondarySchools: true,
    healthcareFacilities: true,
    shoppingCentres: true,
    parks: true,
    
    // Meta
    dataSource: true,
    dataQuality: true,
    lastUpdated: true,
  };
}

