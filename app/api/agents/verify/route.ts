import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * POST /api/agents/verify
 * Create agent profile and initiate verification process
 */
export async function POST(req: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    

    // Check if user already has an agent profile
    const existingProfile = await prisma.agent_profiles.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Agent profile already exists', profile: existingProfile },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      agencyName,
      licenseNumber,
      state,
      websiteUrl,
      bio,
      phoneNumber,
      areasServed
    } = body;

    // Validate required fields
    if (!agencyName || !licenseNumber || !state) {
      return NextResponse.json(
        { error: 'Missing required fields: agencyName, licenseNumber, state' },
        { status: 400 }
      );
    }

    // Check if license number already exists
    const existingLicense = await prisma.agent_profiles.findFirst({
      where: {
        licenseNumber,
        state,
        verificationStatus: { not: 'suspended' }
      }
    });

    if (existingLicense) {
      return NextResponse.json(
        { error: 'License number already registered' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 72); // 72 hour expiry

    // Create agent profile with pending status
    const agentProfile = await prisma.agent_profiles.create({
      data: {
        userId,
        agencyName,
        licenseNumber,
        state,
        websiteUrl: websiteUrl || null,
        bio: bio || null,
        phoneNumber,
        areasServed: areasServed || [],
        subscriptionTier: 'basic',
        verificationStatus: 'pending',
        totalListings: 0,
        activeListings: 0,
        totalInquiries: 0
      }
    });

    // Create audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: 'agent_profile_created',
        entityType: 'agent_profile',
        entityId: agentProfile.id,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        status: 'success'
      }
    });

    // TODO: Send verification email with token
    // await sendVerificationEmail(userId, verificationToken);

    return NextResponse.json({
      success: true,
      message: 'Agent profile created. Please check your email for verification instructions.',
      agentProfile: {
        id: agentProfile.id,
        agencyName: agentProfile.agencyName,
        status: agentProfile.verificationStatus,
        tier: agentProfile.subscriptionTier,
        verificationRequired: true
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Agent verification error:', error);
    
    // Log failed attempt
    const { userId } = await auth();
    if (userId) {
      await prisma.audit_logs.create({
        data: {
          userId,
          action: 'agent_profile_creation_failed',
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
      { error: 'Failed to create agent profile' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agents/verify
 * Get current agent profile
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    

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
        { error: 'Agent profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      agentProfile
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
 * PUT /api/agents/verify
 * Confirm email verification with token
 */
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token required' },
        { status: 400 }
      );
    }

    const agentProfile = await prisma.agent_profiles.findFirst({
      where: {
        userId
      }
    });

    if (!agentProfile) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if token expired
    if (agentProfile.verificationExpiry && new Date() > agentProfile.verificationExpiry) {
      return NextResponse.json(
        { error: 'Verification token expired' },
        { status: 400 }
      );
    }

    // Update status to verified
    const updatedProfile = await prisma.agent_profiles.update({
      where: { id: agentProfile.id },
      data: {
        verificationStatus: 'verified',
        verifiedAt: new Date()
      }
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId,
        action: 'agent_verified',
        entityType: 'agent_profile',
        entityId: updatedProfile.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        status: 'success'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Agent profile verified successfully',
      agentProfile: updatedProfile
    });

  } catch (error) {
    console.error('Agent verification confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to verify agent profile' },
      { status: 500 }
    );
  }
}
