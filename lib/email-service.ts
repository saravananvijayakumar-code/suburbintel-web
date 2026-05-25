/**
 * Email Service
 * 
 * Handles sending emails via SendGrid/AWS SES
 * Templates for alerts, digests, and notifications
 */

import nodemailer from 'nodemailer'

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@suburbintelweb.com',
  fromName: 'Suburb Intel Web',
  
  // SendGrid configuration
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  
  // AWS SES configuration (alternative)
  awsSesRegion: process.env.AWS_SES_REGION || 'ap-southeast-2',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'apikey',
    pass: EMAIL_CONFIG.sendgridApiKey || process.env.SMTP_PASSWORD
  }
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html)
    })

    console.log(`[Email] Sent to ${options.to}: ${options.subject}`)
    return true
  } catch (error) {
    console.error('[Email] Send error:', error)
    return false
  }
}

/**
 * Send price change alert
 */
export async function sendPriceChangeAlert(
  email: string,
  suburbName: string,
  oldPrice: number,
  newPrice: number,
  percentChange: number
): Promise<boolean> {
  const changeDirection = percentChange > 0 ? 'increased' : 'decreased'
  const changeColor = percentChange > 0 ? '#16a34a' : '#dc2626'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Price Change Alert</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🚨 Price Change Alert</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-top: 20px;">
        <h2 style="color: #333; margin-top: 0;">${suburbName}</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #666; margin: 0 0 10px 0;">Median House Price</p>
          <p style="font-size: 32px; font-weight: bold; color: ${changeColor}; margin: 0;">
            $${newPrice.toLocaleString()}
          </p>
          <p style="color: #666; margin: 10px 0 0 0;">
            Previously: $${oldPrice.toLocaleString()}
          </p>
        </div>
        
        <div style="background: ${changeColor}; color: white; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 24px; font-weight: bold;">
            ${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}% ${changeDirection}
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/suburb/${suburbName}" 
             style="background: #667eea; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">
            View Full Details
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>You're receiving this because you set up price alerts for ${suburbName}.</p>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/alerts/unsubscribe?email=${encodeURIComponent(email)}" style="color: #667eea;">Unsubscribe</a></p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Price Alert: ${suburbName} ${changeDirection} ${Math.abs(percentChange).toFixed(1)}%`,
    html
  })
}

/**
 * Send daily market digest
 */
export async function sendDailyDigest(
  email: string,
  suburbs: Array<{
    name: string
    priceChange?: number
    newListings?: number
    smartScoreChange?: number
  }>
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Daily Market Digest</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white;">
        <h1 style="margin: 0; font-size: 28px;">📊 Daily Market Digest</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">${new Date().toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-top: 20px;">
        <h2 style="color: #333; margin-top: 0;">Your Watched Suburbs</h2>
        
        ${suburbs.map(suburb => `
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">${suburb.name}</h3>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
              ${suburb.priceChange !== undefined ? `
                <div style="text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #666;">PRICE CHANGE</p>
                  <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: ${suburb.priceChange >= 0 ? '#16a34a' : '#dc2626'};">
                    ${suburb.priceChange >= 0 ? '+' : ''}${suburb.priceChange.toFixed(1)}%
                  </p>
                </div>
              ` : ''}
              
              ${suburb.newListings !== undefined ? `
                <div style="text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #666;">NEW LISTINGS</p>
                  <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #667eea;">
                    ${suburb.newListings}
                  </p>
                </div>
              ` : ''}
              
              ${suburb.smartScoreChange !== undefined ? `
                <div style="text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #666;">SCORE CHANGE</p>
                  <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: ${suburb.smartScoreChange >= 0 ? '#16a34a' : '#dc2626'};">
                    ${suburb.smartScoreChange >= 0 ? '+' : ''}${suburb.smartScoreChange}
                  </p>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
             style="background: #667eea; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">
            View Dashboard
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>You're receiving this daily digest for your watched suburbs.</p>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/alerts/unsubscribe?email=${encodeURIComponent(email)}" style="color: #667eea;">Unsubscribe</a></p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Daily Market Digest - ${new Date().toLocaleDateString('en-AU')}`,
    html
  })
}

/**
 * Send weekly market summary
 */
export async function sendWeeklySummary(
  email: string,
  topGainers: Array<{ name: string; growth: number }>,
  topYielders: Array<{ name: string; yield: number }>,
  marketInsight: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Weekly Market Summary</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white;">
        <h1 style="margin: 0; font-size: 28px;">📈 Weekly Market Summary</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Week ending ${new Date().toLocaleDateString('en-AU')}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-top: 20px;">
        <h2 style="color: #333; margin-top: 0;">🏆 Top Performers This Week</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #16a34a;">Top Growth Suburbs</h3>
          ${topGainers.map((suburb, i) => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <span>${i + 1}. ${suburb.name}</span>
              <span style="font-weight: bold; color: #16a34a;">+${suburb.growth.toFixed(1)}%</span>
            </div>
          `).join('')}
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: #7c3aed;">Top Rental Yields</h3>
          ${topYielders.map((suburb, i) => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <span>${i + 1}. ${suburb.name}</span>
              <span style="font-weight: bold; color: #7c3aed;">${suburb.yield.toFixed(1)}%</span>
            </div>
          `).join('')}
        </div>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">Market Insight</h3>
          <p style="margin: 0; color: #334155; line-height: 1.6;">${marketInsight}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/opportunities" 
             style="background: #667eea; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">
            Explore Opportunities
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>You're receiving this weekly summary from Suburb Intel Web.</p>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/alerts/unsubscribe?email=${encodeURIComponent(email)}" style="color: #667eea;">Unsubscribe</a></p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Weekly Market Summary - ${new Date().toLocaleDateString('en-AU')}`,
    html
  })
}

/**
 * Send confirmation email
 */
export async function sendAlertConfirmation(
  email: string,
  suburbNames: string[]
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Alert Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">✓ Alerts Activated</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-top: 20px;">
        <p style="font-size: 16px; color: #333;">You've successfully set up alerts for:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${suburbNames.map(name => `
              <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">📍 ${name}</li>
            `).join('')}
          </ul>
        </div>
        
        <p style="color: #666;">You'll receive notifications when significant changes occur in these suburbs.</p>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/alerts/manage" 
             style="background: #667eea; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">
            Manage Alerts
          </a>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Alert Confirmation - Suburb Intel Web',
    html
  })
}

/**
 * Utility: Strip HTML tags from string
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim()
}

export default {
  sendEmail,
  sendPriceChangeAlert,
  sendDailyDigest,
  sendWeeklySummary,
  sendAlertConfirmation
}
