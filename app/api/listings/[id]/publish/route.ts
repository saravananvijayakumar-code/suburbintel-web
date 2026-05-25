import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/listings/[id]/publish
 * Submit listing for moderation and publish
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'guest'; // Auth removed
    
    

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

    // Validation checks before publishing
    const validationErrors: string[] = [];

    // Check required fields
    if (!listing.title || listing.title.trim().length < 10) {
      validationErrors.push('Title must be at least 10 characters');
    }

    if (!listing.description || listing.description.trim().length < 50) {
      validationErrors.push('Description must be at least 50 characters');
    }

    if (!listing.propertyType) {
      validationErrors.push('Property type is required');
    }

    if (!listing.listingType) {
      validationErrors.push('Listing type (Sale/Rent) is required');
    }

    // Check pricing info
    if (listing.listingType === 'Sale' && !listing.price && !listing.priceDisplay) {
      validationErrors.push('Price or price display is required for sale listings');
    }

    if (listing.listingType === 'Rent' && !listing.weeklyRent && !listing.priceDisplay) {
      validationErrors.push('Weekly rent or price display is required for rental listings');
    }

    // Check media (at least one image required)
    if (!listing.images || listing.images.length === 0) {
      validationErrors.push('At least one image is required');
    }

    // Check content ownership
    if (!listing.contentOwnership) {
      validationErrors.push('Content ownership confirmation is required');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Listing validation failed',
          validationErrors
        },
        { status: 400 }
      );
    }

    // Check if already published
    if (listing.status === 'active' && listing.isPublished) {
      return NextResponse.json(
        { 
          message: 'Listing is already published',
          listing: {
            id: listing.id,
            status: listing.status,
            isPublished: listing.isPublished
          }
        },
        { status: 200 }
      );
    }

    // Auto-approve for verified agents with good standing
    // In production, this would check agent reputation, history, etc.
    const agentProfile = await prisma.agent_profiles.findUnique({
      where: { userId }
    });

    const autoApprove = agentProfile?.verificationStatus === 'verified' && 
                        agentProfile.totalListings > 5 && // Has published 5+ listings before
                        agentProfile.rating && agentProfile.rating >= 4.0; // Good rating

    const newStatus = autoApprove ? 'active' : 'pending_review';
    const newModerationStatus = autoApprove ? 'approved' : 'pending';

    // Update listing
    const updatedListing = await prisma.property_listings.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        isPublished: autoApprove,
        moderationStatus: newModerationStatus,
        moderatedAt: autoApprove ? new Date() : null,
        listedAt: autoApprove ? new Date() : listing.listedAt
      }
    });

    // Update agent active listings count if auto-approved
    if (autoApprove && listing.status !== 'active') {
      await prisma.agent_profiles.update({
        where: { userId },
        data: {
          activeListings: { increment: 1 }
        }
      });
    }

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: autoApprove ? 'listing_published' : 'listing_submitted_for_review',
        entityType: 'property_listing',
        entityId: params.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: {
          autoApproved: autoApprove,
          previousStatus: listing.status
        },
        status: 'success'
      }
    });

    // TODO: Send notification email based on outcome
    // if (autoApprove) {
    //   await sendListingPublishedEmail(userId, listing);
    // } else {
    //   await sendListingUnderReviewEmail(userId, listing);
    // }

    const estimatedReviewTime = new Date();
    estimatedReviewTime.setHours(estimatedReviewTime.getHours() + 24); // 24 hour estimate

    return NextResponse.json({
      success: true,
      message: autoApprove 
        ? 'Listing published successfully!' 
        : 'Listing submitted for review. We will review it within 24 hours.',
      listing: {
        id: updatedListing.id,
        status: updatedListing.status,
        isPublished: updatedListing.isPublished,
        moderationStatus: updatedListing.moderationStatus,
        autoApproved: autoApprove,
        estimatedReview: autoApprove ? null : estimatedReviewTime
      }
    });

  } catch (error) {
    console.error('Publish listing error:', error);
    
    // Log failed attempt
    const { userId } = await auth();
    if (userId) {
      await prisma.audit_logs.create({
        data: {
          userId,
          action: 'listing_publish_failed',
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
      { error: 'Failed to publish listing' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/listings/[id]/publish
 * Unpublish listing (take it offline)
 */
export async function PUT(
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

    // Update listing to draft
    const updatedListing = await prisma.property_listings.update({
      where: { id: params.id },
      data: {
        status: 'draft',
        isPublished: false
      }
    });

    // Update agent active listings count
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
        action: 'listing_unpublished',
        entityType: 'property_listing',
        entityId: params.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        status: 'success'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Listing unpublished successfully',
      listing: {
        id: updatedListing.id,
        status: updatedListing.status,
        isPublished: updatedListing.isPublished
      }
    });

  } catch (error) {
    console.error('Unpublish listing error:', error);
    return NextResponse.json(
      { error: 'Failed to unpublish listing' },
      { status: 500 }
    );
  }
}
