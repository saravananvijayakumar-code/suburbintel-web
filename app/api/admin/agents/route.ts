import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Admin user IDs (in production, use role-based access with Clerk)
const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',') || [];

/**
 * GET /api/admin/agents
 * Get all agents with optional status filter
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
    const status = searchParams.get('status'); // pending, verified, rejected, suspended
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status) {
      where.verificationStatus = status;
    }

    const [agents, total, statusCounts] = await Promise.all([
      prisma.agent_profiles.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              imageUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.agent_profiles.count({ where }),
      prisma.agent_profiles.groupBy({
        by: ['verificationStatus'],
        _count: true
      })
    ]);

    const formattedStatusCounts = statusCounts.reduce((acc, item) => {
      acc[item.verificationStatus] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      agents,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      statusCounts: {
        pending: formattedStatusCounts.pending || 0,
        verified: formattedStatusCounts.verified || 0,
        rejected: formattedStatusCounts.rejected || 0,
        suspended: formattedStatusCounts.suspended || 0
      }
    });

  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/agents/[id]/verify
 * Approve or reject agent verification
 */
export async function POST(
  req: NextRequest
) {
  try {
    const userId = 'guest'; // Auth removed

    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const agent = await prisma.agent_profiles.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
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
      approve: 'verified',
      reject: 'rejected',
      suspend: 'suspended'
    };

    const updatedAgent = await prisma.agent_profiles.update({
      where: { id: id },
      data: {
        verificationStatus: statusMap[action as keyof typeof statusMap],
        verificationNotes: notes || null,
        verifiedAt: action === 'approve' ? new Date() : agent.verifiedAt,
        verifiedBy: action === 'approve' ? userId : agent.verifiedBy
      }
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: `agent_${action}`,
        entityType: 'agent_profile',
        entityId: id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: {
          agentUserId: agent.userId,
          notes,
          previousStatus: agent.verificationStatus
        },
        status: 'success'
      }
    });

    // TODO: Send email notification to agent
    // await sendVerificationResultEmail(agent.user.email, action, notes);

    return NextResponse.json({
      success: true,
      message: `Agent ${action}d successfully`,
      agent: updatedAgent
    });

  } catch (error) {
    console.error('Verify agent error:', error);
    return NextResponse.json(
      { error: 'Failed to verify agent' },
      { status: 500 }
    );
  }
}
