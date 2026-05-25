import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  EmailSchema,
  ValidationError 
} from '@/lib/security/validation'
import { 
  sanitizeInput, 
  securityError,
  containsXss 
} from '@/lib/security/middleware'

/**
 * Newsletter Subscription API
 * 
 * Handles email subscriptions for blog updates and property insights
 * Can integrate with: Resend, SendGrid, Mailchimp, or ConvertKit
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source = 'blog' } = body

    // Validate and sanitize email
    const emailValidation = EmailSchema.safeParse(body.email)
    if (!emailValidation.success) {
      return securityError('Please provide a valid email address')
    }
    const email = emailValidation.data

    // Sanitize source
    const safeSource = sanitizeInput(String(source)).substring(0, 50)

    // Check if already subscribed
    const existing = await prisma.newsletter_subscribers.findUnique({
      where: { email: email }
    })

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { success: false, error: 'This email is already subscribed' },
          { status: 409 }
        )
      } else if (existing.status === 'unsubscribed') {
        // Resubscribe
        await prisma.newsletter_subscribers.update({
          where: { email: email },
          data: { 
            status: 'active',
            resubscribedAt: new Date(),
            source: safeSource
          }
        })

        // Send welcome email
        await sendWelcomeEmail(email)

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.',
          subscriber: { email: email }
        })
      }
    }

    // Create new subscriber
    const subscriber = await prisma.newsletter_subscribers.create({
      data: {
        email: email,
        status: 'active',
        source: safeSource,
        subscribedAt: new Date(),
        ipAddress: sanitizeInput(request.headers.get('x-forwarded-for') || 'unknown').substring(0, 45),
        userAgent: sanitizeInput(request.headers.get('user-agent') || 'unknown').substring(0, 500),
      }
    })

    // Send welcome email
    await sendWelcomeEmail(email)

    // Optional: Add to email service provider (Resend, SendGrid, Mailchimp)
    // await addToEmailService(email)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
      subscriber: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * Unsubscribe endpoint
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate email
    const emailValidation = EmailSchema.safeParse(body.email)
    if (!emailValidation.success) {
      return securityError('Invalid email address')
    }
    const email = emailValidation.data

    const subscriber = await prisma.newsletter_subscribers.findUnique({
      where: { email: email }
    })

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Email not found in our list' },
        { status: 404 }
      )
    }

    await prisma.newsletter_subscribers.update({
      where: { email: email },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    })

  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
}

/**
 * Email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Send welcome email using your email service
 * 
 * Options:
 * 1. Resend (recommended - modern, simple)
 * 2. SendGrid (enterprise)
 * 3. AWS SES (cost-effective)
 * 4. Mailchimp (marketing focused)
 */
async function sendWelcomeEmail(email: string) {
  // Example with Resend (uncomment when you have API key)
  
  // const { Resend } = await import('resend')
  // const resend = new Resend(process.env.RESEND_API_KEY)
  
  // await resend.emails.send({
  //   from: 'Suburb Intel AU <hello@suburbintel.au>',
  //   to: email,
  //   subject: 'Welcome to Suburb Intel AU Newsletter!',
  //   html: `
  //     <h1>Welcome to Suburb Intel AU!</h1>
  //     <p>Thank you for subscribing to our newsletter.</p>
  //     <p>You'll receive:</p>
  //     <ul>
  //       <li>ðŸ“Š Weekly market insights and analysis</li>
  //       <li>ðŸ˜ï¸ New blog articles on investment strategies</li>
  //       <li>ðŸš€ Trending suburbs and opportunities</li>
  //       <li>ðŸ’¡ Data-driven investment tips</li>
  //     </ul>
  //     <p>Best regards,<br>The Suburb Intel AU Team</p>
  //     <p style="font-size: 12px; color: #666;">
  //       <a href="https://suburbintelau.smartcalculatorhubs.com/unsubscribe?email=${email}">Unsubscribe</a>
  //     </p>
  //   `
  // })

  console.log(`Welcome email would be sent to: ${email}`)
  return true
}

/**
 * Optional: Add to external email service provider
 */
async function addToEmailService(email: string) {
  // Example with Mailchimp
  // const mailchimp = require('@mailchimp/mailchimp_marketing')
  // mailchimp.setConfig({
  //   apiKey: process.env.MAILCHIMP_API_KEY,
  //   server: process.env.MAILCHIMP_SERVER_PREFIX
  // })
  
  // await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
  //   email_address: email,
  //   status: 'subscribed'
  // })

  return true
}
