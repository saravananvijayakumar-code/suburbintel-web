import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/agents/leads
 * Get all inquiries/leads for the authenticated agent
 */
export async function GET(req: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    

    // Verify agent profile exists
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
    const status = searchParams.get('status'); // new, contacted, converted, closed
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {
      listing: {
        agentId: userId
      }
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get inquiries with listing details
    const [inquiries, total, statusCounts] = await Promise.all([
      prisma.listing_inquiries.findMany({
        where,
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              suburb: true,
              state: true,
              postcode: true,
              propertyType: true,
              listingType: true,
              price: true,
              weeklyRent: true,
              images: true,
              status: true
            }
          },
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.listing_inquiries.count({ where }),
      prisma.listing_inquiries.groupBy({
        by: ['status'],
        where: {
          listing: {
            agentId: userId
          }
        },
        _count: true
      })
    ]);

    // Format status counts
    const formattedStatusCounts = statusCounts.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      leads: inquiries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      statusCounts: {
        new: formattedStatusCounts.new || 0,
        contacted: formattedStatusCounts.contacted || 0,
        converted: formattedStatusCounts.converted || 0,
        closed: formattedStatusCounts.closed || 0
      }
    });

  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/agents/leads/[id]
 * Update inquiry status
 */
export async function PUT(
  req: NextRequest
) {
  try {
    const { userId } = await auth();
    
    

    // Verify inquiry belongs to this agent
    const inquiry = await prisma.listing_inquiries.findUnique({
      where: { id: id },
      include: {
        listing: {
          select: {
            agentId: true
          }
        }
      }
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    if (inquiry.listing.agentId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only update your own leads' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, status } = body;

    // Validate status
    const validStatuses = ['new', 'contacted', 'converted', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Update inquiry
    const updatedInquiry = await prisma.listing_inquiries.update({
      where: { id: id },
      data: {
        status: status || inquiry.status
      }
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: 'lead_status_updated',
        entityType: 'listing_inquiry',
        entityId: id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: {
          oldStatus: inquiry.status,
          newStatus: status
        },
        status: 'success'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Lead status updated successfully',
      inquiry: updatedInquiry
    });

  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}
