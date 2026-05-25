import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    // Fetch agent profile by userId
    const profile = await prisma.agent_profiles.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        agencyName: true,
        licenseNumber: true,
        state: true,
        bio: true,
        websiteUrl: true,
        phoneNumber: true,
        areasServed: true,
        verificationStatus: true,
        subscriptionTier: true,
        activeListings: true,
        totalInquiries: true,
        createdAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Only show public profiles of verified agents
    if (profile.verificationStatus !== 'verified') {
      return NextResponse.json(
        { error: 'Agent profile not available' },
        { status: 403 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching agent profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent profile' },
      { status: 500 }
    );
  }
}
