/**
 * Simple secret/env accessor.
 * Stripe / OpenAI / Clerk / GCP Secret Manager have all been removed.
 * Vercel-style: read everything from process.env.
 */
export class SecretManager {
  static getSecret(envVarName: string): string {
    const key = envVarName.toUpperCase().replace(/-/g, '_')
    return process.env[key] || ''
  }

  static get databaseUrl(): string {
    return process.env.DATABASE_URL || ''
  }

  static get domainApiKey(): string {
    return process.env.DOMAIN_API_KEY || ''
  }
}
