import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/listings/create
 * Create a new property listing (draft status)
 */
export async function POST(req: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    

    // Verify agent profile exists and is verified
    const agentProfile = await prisma.agent_profiles.findUnique({
      where: { userId }
    });

    if (!agentProfile) {
      return NextResponse.json(
        { error: 'Agent profile not found. Please create an agent profile first.' },
        { status: 403 }
      );
    }

    if (agentProfile.verificationStatus !== 'verified') {
      return NextResponse.json(
        { error: 'Your agent profile must be verified before creating listings.' },
        { status: 403 }
      );
    }

    // Check listing limits based on tier
    const tierLimits = {
      basic: 5,
      premium: 20,
      enterprise: 999
    };

    const currentActiveListings = await prisma.property_listings.count({
      where: {
        agentId: userId,
        status: { in: ['active', 'pending_review'] }
      }
    });

    const maxListings = tierLimits[agentProfile.subscriptionTier as keyof typeof tierLimits] || 5;

    if (currentActiveListings >= maxListings) {
      return NextResponse.json(
        { 
          error: `Listing limit reached. Your ${agentProfile.subscriptionTier} plan allows ${maxListings} active listings. Upgrade to increase your limit.`,
          upgrade: true,
          currentPlan: agentProfile.subscriptionTier
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      suburb,
      state,
      postcode,
      streetAddress,
      propertyType,
      listingType,
      price,
      priceDisplay,
      weeklyRent,
      bedrooms,
      bathrooms,
      carSpaces,
      landSize,
      buildingSize,
      features,
      contentOwnership,
      availableFrom,
      inspectionTimes
    } = body;

    // Validate required fields
    if (!title || !description || !suburb || !state || !propertyType || !listingType) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, suburb, state, propertyType, listingType' },
        { status: 400 }
      );
    }

    // Validate content ownership confirmation
    if (!contentOwnership) {
      return NextResponse.json(
        { error: 'You must confirm ownership of the content and right to list this property' },
        { status: 400 }
      );
    }

    // Get user details from Clerk
    const user = await clerkClient.users.getUser(userId);
    const agentEmail = user.emailAddresses[0]?.emailAddress || '';
    const agentName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Agent';

    // Find matching suburb in database
    const suburbData = await prisma.suburbs.findFirst({
      where: {
        name: suburb,
        state: state
      }
    });

    // Generate slug
    const baseSlug = `${suburb}-${state}-${propertyType}-${Date.now()}`.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create listing
    const listing = await prisma.property_listings.create({
      data: {
        agentId: userId,
        agentName,
        agentEmail,
        agentPhone: agentProfile.phoneNumber || null,
        agencyName: agentProfile.agencyName,
        
        // Property details
        address: streetAddress || null,
        suburb,
        state,
        postcode,
        propertyType,
        
        // Suburb intelligence link
        suburbId: suburbData?.id || null,
        
        // Listing details
        listingType,
        price: price || null,
        priceDisplay: priceDisplay || null,
        weeklyRent: weeklyRent || null,
        
        // Features
        bedrooms: bedrooms || null,
        bathrooms: bathrooms || null,
        carSpaces: carSpaces || null,
        landSize: landSize || null,
        buildingSize: buildingSize || null,
        
        // Content
        title,
        description,
        features: features || [],
        
        // Compliance
        contentOwnership: true,
        dataSource: 'agent_submitted',
        
        // Dates
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        inspectionTimes: inspectionTimes || null,
        
        // Status
        status: 'draft',
        isPublished: false,
        moderationStatus: 'pending',
        
        // Metadata
        slug: baseSlug,
        metaTitle: title,
        metaDescription: description.substring(0, 160)
      }
    });

    // Update agent stats
    await prisma.agent_profiles.update({
      where: { userId },
      data: {
        totalListings: { increment: 1 }
      }
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: 'listing_created',
        entityType: 'property_listing',
        entityId: listing.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: {
          suburb,
          state,
          propertyType,
          listingType
        },
        status: 'success'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Listing created successfully',
      listing: {
        id: listing.id,
        status: listing.status,
        title: listing.title,
        suburb: listing.suburb,
        state: listing.state
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create listing error:', error);
    
    // Log failed attempt
    const userId = 'guest'; // Auth removed
    if (userId) {
      await prisma.audit_logs.create({
        data: {
          userId,
          action: 'listing_creation_failed',
          entityType: 'property_listing',
          entityId: '',
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }

    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/listings/create
 * Get agent's all listings (for dashboard)
 */
export async function GET(req: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    

    // Verify agent profile
    const agentProfile = await prisma.agent_profiles.findUnique({
      where: { userId }
    });

    if (!agentProfile) {
      return NextResponse.json(
        { error: 'Agent profile not found' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { agentId: userId };
    if (status) {
      where.status = status;
    }

    const [listings, total] = await Promise.all([
      prisma.property_listings.findMany({
        where,
        include: {
          suburbData: {
            select: {
              id: true,
              name: true,
              state: true,
              medianPrice: true,
              population: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.property_listings.count({ where })
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
