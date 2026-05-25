function parseAdminEmails(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

// Admin user configuration (env override)
export const ADMIN_EMAILS = (
  parseAdminEmails(process.env.ADMIN_EMAILS).length > 0
    ? parseAdminEmails(process.env.ADMIN_EMAILS)
    : ['saravanavijay.v1986@gmail.com']
)

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// Subscription removed — every visitor effectively has full access.
export function getEffectiveSubscriptionTier(
  _userEmail: string | null | undefined,
  _actualTier: 'free' | 'pro'
): 'free' | 'pro' {
  return 'pro'
}
