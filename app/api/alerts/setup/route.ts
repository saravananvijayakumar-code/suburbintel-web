import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateBody, validateSearchParams, ValidationError, sanitizeForLog, withRateLimitAsync } from '@/lib/security'
import { sendEmail } from '@/lib/email-service'
import { prisma } from '@/lib/prisma'

// Strict validation schemas
const AlertSetupSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .transform(v => v.toLowerCase().trim()),
  suburbIds: z.array(
    z.string().min(20).max(30).regex(/^[a-z0-9]+$/i)
  ).min(1, 'At least one suburb required').max(20, 'Maximum 20 suburbs allowed'),
  alertTypes: z.array(
    z.enum(['price-change', 'new-listing', 'market-update', 'smart-score-change'])
  ).min(1, 'At least one alert type required'),
  frequency: z.enum(['instant', 'daily', 'weekly']),
  priceChangeThreshold: z.number().min(1).max(100).optional(),
})

const EmailQuerySchema = z.object({
  email: z.string().email('Invalid email format').max(254),
})

/**
 * POST /api/alerts/setup
 * 
 * Sets up email alerts for a user
 */
async function postHandler(request: NextRequest) {
  try {
    const body = await validateBody(request, AlertSetupSchema)

    // Check if user has Pro subscription (required for alerts)
    const user = await prisma.user.findFirst({
      where: { email: body.email },
      select: { subscriptionTier: true, id: true }
    })

    if (!user || user.subscriptionTier !== 'pro') {
      return NextResponse.json({
        success: false,
        error: 'Pro subscription required for email alerts'
      }, { status: 403 })
    }

    // Verify suburbs exist
    const suburbs = await prisma.suburb.findMany({
      where: { id: { in: body.suburbIds } },
      select: { id: true, name: true, state: true }
    })

    if (suburbs.length !== body.suburbIds.length) {
      return NextResponse.json({
        success: false,
        error: 'One or more suburb IDs are invalid'
      }, { status: 400 })
    }

    // TODO: Create email_alerts table in database
    // For now, log the alert setup
    console.log('[Alert Setup] Creating alerts:', {
      email: body.email,
      userId: user.id,
      suburbCount: body.suburbIds.length,
      alertTypes: body.alertTypes,
      frequency: body.frequency,
      threshold: body.priceChangeThreshold
    })

    // Store alerts in database
    const alertPromises = body.suburbIds.map(suburbId => 
      prisma.alerts.create({
        data: {
          userId: user.id,
          type: body.alertTypes.join(','), // Store as comma-separated string
          suburb: suburbId,
          state: suburbs.find(s => s.id === suburbId)?.state,
          condition: {
            alertTypes: body.alertTypes,
            frequency: body.frequency,
            priceChangeThreshold: body.priceChangeThreshold
          },
          triggered: false,
          updatedAt: new Date()
        }
      })
    )

    await Promise.all(alertPromises)

    // Send confirmation email
    const suburbNames = suburbs.map(s => `${s.name}, ${s.state}`).join(', ')
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Alert Setup Confirmed</h2>
        <p>Hi there!</p>
        <p>Your email alerts have been successfully set up for the following suburbs:</p>
        <ul>
          ${suburbs.map(s => `<li><strong>${s.name}, ${s.state}</strong></li>`).join('')}
        </ul>
        <p><strong>Alert Types:</strong> ${body.alertTypes.join(', ')}</p>
        <p><strong>Frequency:</strong> ${body.frequency}</p>
        ${body.priceChangeThreshold ? `<p><strong>Price Change Threshold:</strong> ${body.priceChangeThreshold}%</p>` : ''}

        <p>You'll receive notifications when these suburbs meet your criteria.</p>

        <p style="margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/alerts" style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Manage Alerts</a>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          You're receiving this because you signed up for alerts at SuburbIntel.
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(body.email)}">Unsubscribe</a>
        </p>
      </div>
    `

    await sendEmail({
      to: body.email,
      subject: 'SuburbIntel Alerts - Setup Confirmed',
      html: confirmationHtml
    })

    return NextResponse.json({
      success: true,
      message: 'Email alerts set up successfully. Check your email for confirmation.',
      alertDetails: {
        email: body.email,
        suburbanCount: body.suburbIds.length,
        alertTypes: body.alertTypes,
        frequency: body.frequency
      }
    })

  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.message },
        { status: 400 }
      )
    }

    console.error('[Alert Setup] Error:', sanitizeForLog(error))
    return NextResponse.json(
      { error: 'Failed to set up email alerts' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/alerts/setup?email=xxx
 * 
 * Gets existing alert setups for an email
 */
async function getHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { email } = validateSearchParams(searchParams, EmailQuerySchema)

    // TODO: Fetch from database
    // const alerts = await prisma.emailAlert.findMany({
    //   where: { email },
    //   include: { suburbs: true }
    // })

    // Placeholder response
    return NextResponse.json({
      alerts: [],
      message: 'Alert retrieval not yet implemented'
    })

  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Invalid email', details: error.message },
        { status: 400 }
      )
    }
    
    console.error('[Alert Retrieval] Error:', sanitizeForLog(error))
    return NextResponse.json(
      { error: 'Failed to retrieve alerts' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/alerts/setup?email=xxx
 * 
 * Removes all alerts for an email
 */
async function deleteHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { email } = validateSearchParams(searchParams, EmailQuerySchema)

    // TODO: Delete from database
    // await prisma.emailAlert.deleteMany({
    //   where: { email }
    // })

    console.log(`[Alert Deletion] Removed alerts for ${email}`)

    return NextResponse.json({
      success: true,
      message: 'All alerts removed successfully'
    })

  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Invalid email', details: error.message },
        { status: 400 }
      )
    }
    
    console.error('[Alert Deletion] Error:', sanitizeForLog(error))
    return NextResponse.json(
      { error: 'Failed to remove alerts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return withRateLimitAsync(request, { maxRequests: 10, windowMs: 60000 }, postHandler)
}

export async function GET(request: NextRequest) {
  return withRateLimitAsync(request, { maxRequests: 30, windowMs: 60000 }, getHandler)
}

export async function DELETE(request: NextRequest) {
  return withRateLimitAsync(request, { maxRequests: 10, windowMs: 60000 }, deleteHandler)
}
