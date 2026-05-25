import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/listings/[id]/edit
 * Get listing details for editing
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'guest'; // Auth removed
    
    

    const listing = await prisma.property_listings.findUnique({
      where: { id: params.id },
      include: {
        suburbData: {
          select: {
            id: true,
            name: true,
            state: true,
            medianPrice: true
          }
        }
      }
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (listing.agentId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only edit your own listings' },
        { status: 403 }
      );
    }

    return NextResponse.json({ listing });

  } catch (error) {
    console.error('Get listing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/listings/[id]/edit
 * Update listing details
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    

    // Verify listing ownership
    const existingListing = await prisma.property_listings.findUnique({
      where: { id: params.id }
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (existingListing.agentId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only edit your own listings' },
        { status: 403 }
      );
    }

    // Can't edit suspended listings
    if (existingListing.status === 'suspended') {
      return NextResponse.json(
        { error: 'Cannot edit suspended listing. Please contact support.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      streetAddress,
      price,
      priceDisplay,
      weeklyRent,
      bedrooms,
      bathrooms,
      carSpaces,
      landSize,
      buildingSize,
      features,
      availableFrom,
      inspectionTimes,
      propertyType,
      listingType
    } = body;

    // Update listing
    const updatedListing = await prisma.property_listings.update({
      where: { id: params.id },
      data: {
        title: title || existingListing.title,
        description: description || existingListing.description,
        address: streetAddress !== undefined ? streetAddress : existingListing.address,
        propertyType: propertyType || existingListing.propertyType,
        listingType: listingType || existingListing.listingType,
        price: price !== undefined ? price : existingListing.price,
        priceDisplay: priceDisplay !== undefined ? priceDisplay : existingListing.priceDisplay,
        weeklyRent: weeklyRent !== undefined ? weeklyRent : existingListing.weeklyRent,
        bedrooms: bedrooms !== undefined ? bedrooms : existingListing.bedrooms,
        bathrooms: bathrooms !== undefined ? bathrooms : existingListing.bathrooms,
        carSpaces: carSpaces !== undefined ? carSpaces : existingListing.carSpaces,
        landSize: landSize !== undefined ? landSize : existingListing.landSize,
        buildingSize: buildingSize !== undefined ? buildingSize : existingListing.buildingSize,
        features: features !== undefined ? features : existingListing.features,
        availableFrom: availableFrom ? new Date(availableFrom) : existingListing.availableFrom,
        inspectionTimes: inspectionTimes !== undefined ? inspectionTimes : existingListing.inspectionTimes
      }
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: 'listing_updated',
        entityType: 'property_listing',
        entityId: updatedListing.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: {
          updatedFields: Object.keys(body)
        },
        status: 'success'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing
    });

  } catch (error) {
    console.error('Update listing error:', error);
    
    // Log failed attempt
    const { userId } = await auth();
    if (userId) {
      await prisma.audit_logs.create({
        data: {
          userId,
          action: 'listing_update_failed',
          entityType: 'property_listing',
          entityId: params.id,
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }

    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/listings/[id]/edit
 * Delete/withdraw listing
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    

    // Verify listing ownership
    const listing = await prisma.property_listings.findUnique({
      where: { id: params.id }
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (listing.agentId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Soft delete - mark as withdrawn instead of deleting
    const updatedListing = await prisma.property_listings.update({
      where: { id: params.id },
      data: {
        status: 'withdrawn',
        isPublished: false
      }
    });

    // Update agent stats
    if (listing.status === 'active') {
      await prisma.agent_profiles.update({
        where: { userId },
        data: {
          activeListings: { decrement: 1 }
        }
      });
    }

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: 'listing_withdrawn',
        entityType: 'property_listing',
        entityId: params.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        status: 'success'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Listing withdrawn successfully'
    });

  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw listing' },
      { status: 500 }
    );
  }
}
