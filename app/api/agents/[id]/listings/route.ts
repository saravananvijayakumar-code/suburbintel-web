import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    // Fetch agent's active listings
    const agent = await prisma.agent_profiles.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const listings = await prisma.property_listings.findMany({
      where: {
        agentId: agent.id,
        status: 'active',
        moderationStatus: 'approved',
      },
      select: {
        id: true,
        title: true,
        suburb: true,
        state: true,
        postcode: true,
        propertyType: true,
        listingType: true,
        price: true,
        priceDisplay: true,
        weeklyRent: true,
        bedrooms: true,
        bathrooms: true,
        carSpaces: true,
        views: true,
        createdAt: true,
        listing_media: {
          where: { isPrimary: true },
          select: { url: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Map to include primaryImage
    const listingsWithImages = listings.map(listing => ({
      ...listing,
      primaryImage: listing.listing_media[0]?.url || null,
      listing_media: undefined,
    }));

    return NextResponse.json({ listings: listingsWithImages });
  } catch (error) {
    console.error('Error fetching agent listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
