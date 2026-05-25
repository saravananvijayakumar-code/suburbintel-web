import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',') || [];

/**
 * GET /api/admin/listings
 * Get all listings with optional status filter for moderation
 */
export async function GET(req: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const moderationStatus = searchParams.get('moderationStatus'); // pending, approved, rejected
    const status = searchParams.get('status'); // active, suspended, etc.
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (moderationStatus) {
      where.moderationStatus = moderationStatus;
    }
    if (status) {
      where.status = status;
    }

    const [listings, total, moderationCounts] = await Promise.all([
      prisma.property_listings.findMany({
        where,
        include: {
          agent: {
            select: {
              email: true,
              firstName: true,
              lastName: true
            }
          },
          suburbData: {
            select: {
              name: true,
              state: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.property_listings.count({ where }),
      prisma.property_listings.groupBy({
        by: ['moderationStatus'],
        _count: true
      })
    ]);

    const formattedModerationCounts = moderationCounts.reduce((acc, item) => {
      acc[item.moderationStatus] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      listings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      moderationCounts: {
        pending: formattedModerationCounts.pending || 0,
        approved: formattedModerationCounts.approved || 0,
        rejected: formattedModerationCounts.rejected || 0
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

/**
 * POST /api/admin/listings/[id]/moderate
 * Approve, reject, or suspend a listing
 */
export async function POST(
  req: NextRequest
) {
  try {
    const { userId } = await auth();

    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const listing = await prisma.property_listings.findUnique({
      where: { id: id },
      include: {
        agent: {
          select: {
            email: true
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

    const body = await req.json();
    const { id, action, notes } = body; // action: 'approve' | 'reject' | 'suspend'

    if (!['approve', 'reject', 'suspend'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: approve, reject, or suspend' },
        { status: 400 }
      );
    }

    const statusMap = {
      approve: 'active',
      reject: 'withdrawn',
      suspend: 'suspended'
    };

    const moderationStatusMap = {
      approve: 'approved',
      reject: 'rejected',
      suspend: 'rejected'
    };

    const updatedListing = await prisma.property_listings.update({
      where: { id: id },
      data: {
        status: statusMap[action as keyof typeof statusMap],
        moderationStatus: moderationStatusMap[action as keyof typeof moderationStatusMap],
        moderationNotes: notes || null,
        moderatedAt: new Date(),
        moderatedBy: userId,
        isPublished: action === 'approve',
        listedAt: action === 'approve' ? new Date() : listing.listedAt
      }
    });

    // Update agent active listings count
    if (action === 'approve' && listing.status !== 'active') {
      await prisma.agent_profiles.update({
        where: { userId: listing.agentId },
        data: {
          activeListings: { increment: 1 }
        }
      });
    } else if (action !== 'approve' && listing.status === 'active') {
      await prisma.agent_profiles.update({
        where: { userId: listing.agentId },
        data: {
          activeListings: { decrement: 1 }
        }
      });
    }

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: `listing_${action}`,
        entityType: 'property_listing',
        entityId: id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: {
          agentId: listing.agentId,
          notes,
          previousStatus: listing.status,
          previousModerationStatus: listing.moderationStatus
        },
        status: 'success'
      }
    });

    // TODO: Send email notification to agent
    // await sendModerationResultEmail(listing.agent.email, action, notes);

    return NextResponse.json({
      success: true,
      message: `Listing ${action}d successfully`,
      listing: updatedListing
    });

  } catch (error) {
    console.error('Moderate listing error:', error);
    return NextResponse.json(
      { error: 'Failed to moderate listing' },
      { status: 500 }
    );
  }
}
