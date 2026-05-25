import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/marketplace/search
 * Public API to search property listings with filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50 results
    
    // Filters
    const suburb = searchParams.get('suburb');
    const state = searchParams.get('state');
    const listingType = searchParams.get('listingType'); // Sale, Rent, Sold
    const propertyType = searchParams.get('propertyType'); // House, Apartment, etc.
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minWeeklyRent = searchParams.get('minWeeklyRent');
    const maxWeeklyRent = searchParams.get('maxWeeklyRent');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const carSpaces = searchParams.get('carSpaces');
    const isFeatured = searchParams.get('featured') === 'true';
    
    // Sorting
    const sortBy = searchParams.get('sort') || 'newest';
    
    // Search query
    const query = searchParams.get('q');

    // Build where clause
    const where: any = {
      status: 'active',
      isPublished: true,
      moderationStatus: 'approved'
    };

    if (suburb) {
      where.suburb = {
        contains: suburb,
        mode: 'insensitive'
      };
    }

    if (state) {
      where.state = state.toUpperCase();
    }

    if (listingType) {
      where.listingType = listingType;
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (bedrooms) {
      where.bedrooms = { gte: parseInt(bedrooms) };
    }

    if (bathrooms) {
      where.bathrooms = { gte: parseInt(bathrooms) };
    }

    if (carSpaces) {
      where.carSpaces = { gte: parseInt(carSpaces) };
    }

    if (isFeatured) {
      where.isFeatured = true;
      where.featuredUntil = { gte: new Date() };
    }

    // Price filters for sales
    if (listingType === 'Sale' || !listingType) {
      if (minPrice) {
        where.price = { ...where.price, gte: parseInt(minPrice) };
      }
      if (maxPrice) {
        where.price = { ...where.price, lte: parseInt(maxPrice) };
      }
    }

    // Rent filters
    if (listingType === 'Rent' || !listingType) {
      if (minWeeklyRent) {
        where.weeklyRent = { ...where.weeklyRent, gte: parseInt(minWeeklyRent) };
      }
      if (maxWeeklyRent) {
        where.weeklyRent = { ...where.weeklyRent, lte: parseInt(maxWeeklyRent) };
      }
    }

    // Text search
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { suburb: { contains: query, mode: 'insensitive' } },
        { features: { has: query } }
      ];
    }

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' }; // Default: newest first
    
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'popular':
        orderBy = { views: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'featured':
        orderBy = [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ];
        break;
    }

    // Execute query
    const [listings, total, featuredCount] = await Promise.all([
      prisma.property_listings.findMany({
        where,
        include: {
          suburbData: {
            select: {
              id: true,
              name: true,
              state: true,
              median_price: true,
              median_rent: true,
              population: true,
              median_age: true,
              growth_rate: true
            }
          },
          media: {
            where: {
              isPrimary: true
            },
            take: 1,
            orderBy: {
              orderIndex: 'asc'
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.property_listings.count({ where }),
      prisma.property_listings.count({
        where: {
          ...where,
          isFeatured: true,
          featuredUntil: { gte: new Date() }
        }
      })
    ]);

    // Get aggregations for filters
    const aggregations = await prisma.property_listings.groupBy({
      by: ['propertyType', 'state'],
      where: {
        status: 'active',
        isPublished: true,
        moderationStatus: 'approved'
      },
      _count: true
    });

    // Price ranges
    const priceStats = await prisma.property_listings.aggregate({
      where: {
        ...where,
        price: { not: null }
      },
      _min: { price: true },
      _max: { price: true },
      _avg: { price: true }
    });

    // Format response
    const formattedListings = listings.map(listing => ({
      id: listing.id,
      slug: listing.slug,
      title: listing.title,
      description: listing.description.substring(0, 200) + (listing.description.length > 200 ? '...' : ''),
      suburb: listing.suburb,
      state: listing.state,
      postcode: listing.postcode,
      propertyType: listing.propertyType,
      listingType: listing.listingType,
      price: listing.price,
      priceDisplay: listing.priceDisplay,
      weeklyRent: listing.weeklyRent,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      carSpaces: listing.carSpaces,
      landSize: listing.landSize,
      features: listing.features,
      isFeatured: listing.isFeatured,
      featuredUntil: listing.featuredUntil,
      primaryImage: listing.media[0]?.url || listing.images[0] || null,
      views: listing.views,
      createdAt: listing.createdAt,
      suburbIntel: listing.suburbData ? {
        id: listing.suburbData.id,
        medianPrice: listing.suburbData.median_price,
        medianRent: listing.suburbData.median_rent,
        population: listing.suburbData.population,
        growthRate: listing.suburbData.growth_rate
      } : null
    }));

    return NextResponse.json({
      listings: formattedListings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      },
      filters: {
        featuredCount,
        aggregations,
        priceRange: {
          min: priceStats._min.price || 0,
          max: priceStats._max.price || 0,
          avg: Math.round(priceStats._avg.price || 0)
        }
      }
    });

  } catch (error) {
    console.error('Marketplace search error:', error);
    return NextResponse.json(
      { error: 'Failed to search listings' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/marketplace/search/suggestions
 * Get autocomplete suggestions for search
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Get suburb suggestions
    const suburbSuggestions = await prisma.suburbs.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { postcode: { startsWith: query } }
        ]
      },
      select: {
        id: true,
        name: true,
        state: true,
        postcode: true
      },
      take: 5
    });

    // Get property type suggestions based on active listings
    const propertyTypes = await prisma.property_listings.groupBy({
      by: ['propertyType'],
      where: {
        status: 'active',
        isPublished: true,
        propertyType: {
          contains: query,
          mode: 'insensitive'
        }
      },
      _count: true,
      orderBy: {
        _count: {
          propertyType: 'desc'
        }
      },
      take: 5
    });

    return NextResponse.json({
      suggestions: {
        suburbs: suburbSuggestions.map(s => ({
          type: 'suburb',
          label: `${s.name}, ${s.state} ${s.postcode}`,
          value: s.name,
          id: s.id
        })),
        propertyTypes: propertyTypes.map(pt => ({
          type: 'propertyType',
          label: pt.propertyType,
          value: pt.propertyType,
          count: pt._count
        }))
      }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  }
}
