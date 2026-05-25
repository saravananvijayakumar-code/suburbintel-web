import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/agents/profile
 * Get agent profile with statistics
 */
export async function GET(req: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    

    const agentProfile = await prisma.agent_profiles.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            imageUrl: true
          }
        }
      }
    });

    if (!agentProfile) {
      return NextResponse.json(
        { error: 'Agent profile not found. Please create an agent profile first.' },
        { status: 404 }
      );
    }

    // Get listing statistics
    const listings = await prisma.property_listings.findMany({
      where: { agentId: userId },
      select: {
        id: true,
        status: true,
        moderationStatus: true,
        views: true,
        inquiries: true,
        isFeatured: true,
        featuredUntil: true,
        createdAt: true,
        isPublished: true
      }
    });

    const stats = {
      totalListings: listings.length,
      activeListings: listings.filter(l => l.status === 'active' && l.isPublished).length,
      draftListings: listings.filter(l => l.status === 'draft').length,
      pendingReview: listings.filter(l => l.moderationStatus === 'pending').length,
      featuredListings: listings.filter(l => 
        l.isFeatured && 
        l.featuredUntil && 
        new Date(l.featuredUntil) > new Date()
      ).length,
      totalViews: listings.reduce((sum, l) => sum + l.views, 0),
      totalInquiries: listings.reduce((sum, l) => sum + l.inquiries, 0),
      averageViewsPerListing: listings.length > 0 
        ? Math.round(listings.reduce((sum, l) => sum + l.views, 0) / listings.length)
        : 0,
      conversionRate: listings.length > 0
        ? ((listings.reduce((sum, l) => sum + l.inquiries, 0) / listings.reduce((sum, l) => sum + l.views, 0)) * 100).toFixed(2)
        : '0.00'
    };

    // Get recent inquiries
    const recentInquiries = await prisma.listing_inquiries.findMany({
      where: {
        listing: {
          agentId: userId
        }
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            suburb: true,
            state: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Calculate tier limits
    const tierLimits = {
      basic: { maxListings: 5, maxFeatured: 0 },
      premium: { maxListings: 20, maxFeatured: 3 },
      enterprise: { maxListings: 999, maxFeatured: 10 }
    };

    const currentLimits = tierLimits[agentProfile.subscriptionTier as keyof typeof tierLimits];
    const isAtLimit = stats.activeListings >= currentLimits.maxListings;

    return NextResponse.json({
      agentProfile,
      stats,
      recentInquiries: recentInquiries.slice(0, 5), // Only return 5 most recent
      limits: {
        current: currentLimits,
        usage: {
          listings: `${stats.activeListings} / ${currentLimits.maxListings}`,
          featured: `${stats.featuredListings} / ${currentLimits.maxFeatured}`,
          isAtLimit
        }
      }
    });

  } catch (error) {
    console.error('Get agent profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/agents/profile
 * Update agent profile information
 */
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    

    const body = await req.json();
    const {
      agencyName,
      bio,
      websiteUrl,
      phoneNumber,
      areasServed,
      licenseNumber,
      state
    } = body;

    // Verify agent profile exists
    const existingProfile = await prisma.agent_profiles.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Agent profile not found' },
        { status: 404 }
      );
    }

    // If license number is being updated, check for duplicates
    if (licenseNumber && licenseNumber !== existingProfile.licenseNumber) {
      const duplicateLicense = await prisma.agent_profiles.findFirst({
        where: {
          licenseNumber,
          state: state || existingProfile.state,
          id: { not: existingProfile.id }
        }
      });

      if (duplicateLicense) {
        return NextResponse.json(
          { error: 'License number already in use' },
          { status: 400 }
        );
      }
    }

    // Update profile
    const updatedProfile = await prisma.agent_profiles.update({
      where: { userId },
      data: {
        agencyName: agencyName || existingProfile.agencyName,
        bio: bio !== undefined ? bio : existingProfile.bio,
        websiteUrl: websiteUrl !== undefined ? websiteUrl : existingProfile.websiteUrl,
        phoneNumber: phoneNumber || existingProfile.phoneNumber,
        areasServed: areasServed !== undefined ? areasServed : existingProfile.areasServed,
        licenseNumber: licenseNumber || existingProfile.licenseNumber,
        state: state || existingProfile.state
      }
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: 'agent_profile_updated',
        entityType: 'agent_profile',
        entityId: updatedProfile.id,
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
      message: 'Profile updated successfully',
      agentProfile: updatedProfile
    });

  } catch (error) {
    console.error('Update agent profile error:', error);
    
    // Log failed attempt
    const { userId } = await auth();
    if (userId) {
      await prisma.audit_logs.create({
        data: {
          userId,
          action: 'agent_profile_update_failed',
          entityType: 'agent_profile',
          entityId: '',
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
