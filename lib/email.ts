import { Resend } from 'resend'

let resendInstance: Resend | null = null
function getResend() {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export async function sendTrialReminderEmail(to: string, trialEndsAtIso: string) {
  const from = process.env.EMAIL_FROM || 'noreply@suburbintel.com.au'
  const subject = `Your Suburb Intel Starter trial ends on ${new Date(trialEndsAtIso).toLocaleDateString('en-AU')}`
  const html = `<div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
    <h3 style="color:#111827">Your 7-day Starter trial ends soon</h3>
    <p style="color:#374151">Hi,</p>
    <p style="color:#374151">This is a reminder that your 7-day Starter trial will end on <strong>${new Date(trialEndsAtIso).toLocaleString('en-AU')}</strong>.</p>
    <p style="color:#374151">If you would like to keep uninterrupted access, your subscription will continue and your payment method will be charged on that date. You can manage or cancel your subscription anytime from your account.</p>
    <p style="color:#374151">Need help? Reply to this email or contact our support team.</p>
    <p style="color:#374151">— Suburb Intel AU</p>
  </div>`

  const resendClient = getResend()
  if (!resendClient) return { error: 'Resend not available' }
  return resendClient.emails.send({ from, to, subject, html })
}

/**
 * HTML email template for password reset
 */
function getPasswordResetEmailTemplate(resetUrl: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #2563eb;
      margin: 0;
      font-size: 28px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .expiry {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .security-notice {
      background-color: #f3f4f6;
      padding: 16px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 14px;
    }
    .link-copy {
      background-color: #f9fafb;
      padding: 12px;
      border-radius: 4px;
      word-break: break-all;
      font-family: monospace;
      font-size: 12px;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>🏘️ Suburb Intel AU</h1>
    </div>
    
    <div class="content">
      <h2>Reset Your Password</h2>
      
      <p>Hello${userName ? ` ${userName}` : ''},</p>
      
      <p>We received a request to reset your password for your Suburb Intel AU account. Click the button below to create a new password:</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <div class="expiry">
        <strong>⏰ Important:</strong> This link will expire in <strong>1 hour</strong> for security reasons.
      </div>
      
      <div class="security-notice">
        <strong>🔒 Security Tips:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Never share your password with anyone</li>
          <li>Use a unique password for Suburb Intel AU</li>
          <li>Enable two-factor authentication if available</li>
          <li>If you didn't request this reset, ignore this email</li>
        </ul>
      </div>
      
      <p><strong>Can't click the button?</strong> Copy and paste this link into your browser:</p>
      <div class="link-copy">${resetUrl}</div>
      
      <p style="margin-top: 30px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    </div>
    
    <div class="footer">
      <p><strong>Suburb Intel AU</strong><br>
      Australian Property Intelligence Platform</p>
      <p>
        <a href="https://suburbintel.com" style="color: #2563eb;">Visit Website</a> | 
        <a href="https://suburbintel.com/support" style="color: #2563eb;">Get Support</a>
      </p>
      <p style="font-size: 12px; color: #9ca3af;">
        This is an automated email. Please do not reply to this message.<br>
        © ${new Date().getFullYear()} Suburb Intel AU. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Plain text version of password reset email
 */
function getPasswordResetEmailText(resetUrl: string, userName?: string): string {
  return `
Reset Your Password - Suburb Intel AU

Hello${userName ? ` ${userName}` : ''},

We received a request to reset your password for your Suburb Intel AU account.

To reset your password, click this link:
${resetUrl}

⏰ IMPORTANT: This link will expire in 1 hour for security reasons.

🔒 Security Tips:
- Never share your password with anyone
- Use a unique password for Suburb Intel AU
- If you didn't request this reset, ignore this email

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

---
Suburb Intel AU - Australian Property Intelligence Platform
Visit: https://suburbintel.com
Support: https://suburbintel.com/support

This is an automated email. Please do not reply to this message.
© ${new Date().getFullYear()} Suburb Intel AU. All rights reserved.
  `
}

/**
 * Send password reset email via Resend
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  userName?: string
) {
  try {
    const resendClient = getResend()
    if (!resendClient) {
      console.error('Resend not available for password reset email')
      return { error: 'Email service not available' }
    }
    const { data, error } = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@suburbintel.com',
      to: email,
      subject: 'Reset Your Password - Suburb Intel AU',
      text: getPasswordResetEmailText(resetUrl, userName),
      html: getPasswordResetEmailTemplate(resetUrl, userName),
    })

    if (error) {
      console.error('Failed to send password reset email:', error)
      throw error
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Password reset email error:', error)
    throw error
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, userName: string) {
  try {
    const resendClient = getResend()
    if (!resendClient) {
      console.error('Resend not available for welcome email')
      return { error: 'Email service not available' }
    }
    const { data, error } = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@suburbintel.com',
      to: email,
      subject: 'Welcome to Suburb Intel AU! 🏘️',
      html: getWelcomeEmailTemplate(userName),
    })

    if (error) {
      console.error('Failed to send welcome email:', error)
      throw error
    }

    console.log('Welcome email sent successfully:', data?.id)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Welcome email error:', error)
    throw error
  }
}

function getWelcomeEmailTemplate(userName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .features { background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .features ul { margin: 0; padding-left: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏘️ Welcome to Suburb Intel AU!</h1>
    </div>
    <div class="content">
      <p>Hello ${userName},</p>
      
      <p>Thank you for joining Suburb Intel AU - your trusted partner for Australian property intelligence!</p>
      
      <p>You now have access to:</p>
      
      <div class="features">
        <ul>
          <li>🔍 Search across 850+ Australian suburbs</li>
          <li>📊 Real-time market trends and analytics</li>
          <li>🤖 AI-powered property insights</li>
          <li>📈 Investment opportunity scoring</li>
          <li>💰 Property valuation tools</li>
          <li>🗺️ Interactive heatmaps</li>
          <li>And much more!</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="https://suburbintel.com/dashboard" class="button">Get Started</a>
      </div>
      
      <p>Need help? Our support team is here for you at <a href="mailto:saravananvijayakumar@quantumleapventures.com.au">saravananvijayakumar@quantumleapventures.com.au</a></p>
      
      <p>Happy investing!<br>
      <strong>The Suburb Intel AU Team</strong></p>
    </div>
  </div>
</body>
</html>
  `
}

// ============================================================
// ALTERNATIVE: SendGrid Implementation (if you prefer SendGrid)
// ============================================================

/*
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function sendPasswordResetEmailSendGrid(
  email: string,
  resetUrl: string,
  userName?: string
) {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || 'noreply@suburbintel.com',
      subject: 'Reset Your Password - Suburb Intel AU',
      text: getPasswordResetEmailText(resetUrl, userName),
      html: getPasswordResetEmailTemplate(resetUrl, userName),
    }

    await sgMail.send(msg)
    console.log('Password reset email sent via SendGrid')
    return { success: true }
  } catch (error) {
    console.error('SendGrid error:', error)
    throw error
  }
}
*/

// ============================================================
// Export the appropriate function based on configuration
// ============================================================

export default {
  sendPasswordResetEmail,
  sendTrialReminderEmail,
  sendWelcomeEmail,
}
