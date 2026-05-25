import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email-service'

/**
 * POST /api/cron/process-alerts
 *
 * Cron job to process email alerts for price changes and other triggers
 * Should be run daily via Cloud Scheduler or similar
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  // Verify cron job is authenticated
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('[Process Alerts] Starting alert processing...')

    // Get all active alerts
    const alerts = await prisma.alerts.findMany({
      where: {
        triggered: false // Only process untriggered alerts
      },
      include: {
        users: {
          select: {
            email: true,
            subscriptionTier: true
          }
        },
        suburbs: {
          select: {
            id: true,
            name: true,
            state: true,
            medianPrice: true,
            growth12m: true,
            growth6m: true,
            growth3m: true,
            rentalYield: true,
            lastUpdated: true
          }
        }
      }
    })

    console.log(`[Process Alerts] Found ${alerts.length} alerts to process`)

    let processedCount = 0
    let triggeredCount = 0

    for (const alert of alerts) {
      try {
        // Skip if user doesn't have pro subscription
        if (alert.users.subscriptionTier !== 'pro') {
          continue
        }

        const condition = alert.condition as any
        const alertTypes = condition?.alertTypes || []
        const frequency = condition?.frequency || 'daily'
        const threshold = condition?.priceChangeThreshold || 5

        // Check if alert should trigger based on frequency
        const shouldProcess = checkFrequency(alert.createdAt, frequency)
        if (!shouldProcess) {
          continue
        }

        // Check each alert type
        let shouldTrigger = false
        let triggerReason = ''

        for (const alertType of alertTypes) {
          switch (alertType) {
            case 'price-change':
              const priceChange = await checkPriceChange(alert.suburbs?.id, threshold)
              if (priceChange.hasChanged) {
                shouldTrigger = true
                triggerReason = `Price change detected: ${priceChange.changePercent > 0 ? '+' : ''}${priceChange.changePercent.toFixed(1)}%`
              }
              break

            case 'new-listing':
              // TODO: Implement new listing detection
              break

            case 'market-update':
              // TODO: Implement market update detection
              break

            case 'smart-score-change':
              // TODO: Implement smart score change detection
              break
          }

          if (shouldTrigger) break
        }

        if (shouldTrigger) {
          // Send alert email
          await sendAlertEmail(alert, triggerReason)
          triggeredCount++

          // Mark alert as triggered
          await prisma.alerts.update({
            where: { id: alert.id },
            data: {
              triggered: true,
              triggeredAt: new Date()
            }
          })
        }

        processedCount++

      } catch (error) {
        console.error(`[Process Alerts] Error processing alert ${alert.id}:`, error)
      }
    }

    console.log(`[Process Alerts] Processed ${processedCount} alerts, triggered ${triggeredCount} notifications`)

    return NextResponse.json({
      success: true,
      processed: processedCount,
      triggered: triggeredCount
    })

  } catch (error) {
    console.error('[Process Alerts] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process alerts' },
      { status: 500 }
    )
  }
}

/**
 * Check if alert should be processed based on frequency
 */
function checkFrequency(createdAt: Date, frequency: string): boolean {
  const now = new Date()
  const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

  switch (frequency) {
    case 'instant':
      return true // Process immediately
    case 'daily':
      return hoursSinceCreation >= 24
    case 'weekly':
      return hoursSinceCreation >= 168 // 7 days
    default:
      return false
  }
}

/**
 * Check for price changes in a suburb
 */
async function checkPriceChange(suburbId: string | undefined, threshold: number) {
  if (!suburbId) return { hasChanged: false, changePercent: 0 }

  // Get recent price history
  const priceHistory = await prisma.price_history.findMany({
    where: { suburbId },
    orderBy: { date: 'desc' },
    take: 2 // Get last 2 entries to compare
  })

  if (priceHistory.length < 2) {
    return { hasChanged: false, changePercent: 0 }
  }

  const latest = priceHistory[0]
  const previous = priceHistory[1]

  if (!latest.medianPrice || !previous.medianPrice) {
    return { hasChanged: false, changePercent: 0 }
  }

  const changePercent = ((latest.medianPrice - previous.medianPrice) / previous.medianPrice) * 100

  return {
    hasChanged: Math.abs(changePercent) >= threshold,
    changePercent
  }
}

/**
 * Send alert email to user
 */
async function sendAlertEmail(alert: any, triggerReason: string) {
  const suburb = alert.suburbs
  const user = alert.users

  if (!suburb || !user?.email) return

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">SuburbIntel Alert</h2>

      <p><strong>Alert Triggered:</strong> ${triggerReason}</p>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1e40af;">${suburb.name}, ${suburb.state}</h3>
        <p><strong>Current Median Price:</strong> $${suburb.medianPrice?.toLocaleString()}</p>
        <p><strong>12M Growth:</strong> ${suburb.growth12m ? `${suburb.growth12m.toFixed(1)}%` : 'N/A'}</p>
        <p><strong>Rental Yield:</strong> ${suburb.rentalYield ? `${suburb.rentalYield.toFixed(1)}%` : 'N/A'}</p>
      </div>

      <p style="margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/suburb/${suburb.name.toLowerCase()}" style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Suburb Details</a>
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">
        You're receiving this alert because you set up notifications for this suburb.
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/alerts">Manage Alerts</a> |
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(user.email)}">Unsubscribe</a>
      </p>
    </div>
  `

  await sendEmail({
    to: user.email,
    subject: `SuburbIntel Alert: ${suburb.name} - ${triggerReason}`,
    html: emailHtml
  })
}