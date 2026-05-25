import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/listings/[id]/inquire
 * Submit inquiry for a property listing with rate limiting
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'guest'; // Auth removed
    
    // Get IP address for rate limiting
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Check rate limit (5 inquiries per hour per IP)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentInquiries = await prisma.listing_inquiries.count({
      where: {
        ipAddress,
        createdAt: { gte: oneHourAgo }
      }
    });

    if (recentInquiries >= 5) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again in an hour.',
          rateLimited: true
        },
        { status: 429 }
      );
    }

    // Verify listing exists and is published
    const listing = await prisma.property_listings.findUnique({
      where: { id: params.id },
      include: {
        agent: {
          select: {
            email: true,
            firstName: true,
            lastName: true
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

    if (!listing.isPublished || listing.status !== 'active') {
      return NextResponse.json(
        { error: 'This listing is not available for inquiries' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create inquiry
    const inquiry = await prisma.listing_inquiries.create({
      data: {
        listingId: params.id,
        userId: userId || null,
        name,
        email,
        phone: phone || null,
        message,
        status: 'new',
        ipAddress,
        userAgent
      }
    });

    // Update listing inquiry count
    await prisma.property_listings.update({
      where: { id: params.id },
      data: {
        inquiries: { increment: 1 }
      }
    });

    // Update agent total inquiries
    await prisma.agent_profiles.update({
      where: { userId: listing.agentId },
      data: {
        totalInquiries: { increment: 1 }
      }
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        userId: userId || 'anonymous',
        action: 'inquiry_submitted',
        entityType: 'listing_inquiry',
        entityId: inquiry.id,
        ipAddress,
        userAgent,
        metadata: {
          listingId: params.id,
          agentId: listing.agentId
        },
        status: 'success'
      }
    });

    // TODO: Send email notification to agent
    // await sendInquiryNotification(listing.agent.email, inquiry, listing);

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been sent successfully! The agent will contact you soon.',
      inquiryId: inquiry.id
    }, { status: 201 });

  } catch (error) {
    console.error('Submit inquiry error:', error);
    
    // Log failed attempt
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    await prisma.audit_logs.create({
      data: {
        userId: 'anonymous',
        action: 'inquiry_submission_failed',
        entityType: 'listing_inquiry',
        entityId: '',
        ipAddress,
        userAgent: req.headers.get('user-agent') || 'unknown',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
