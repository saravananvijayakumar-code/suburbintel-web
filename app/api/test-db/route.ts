// DELETED: Debug endpoint removed for production security.
// Use proper monitoring/observability tools instead of exposing DB internals.
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { error: 'Endpoint removed for security. Use /api/health for status checks.' },
    { status: 410 }
  )
}

