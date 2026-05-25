import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// No-op middleware — no auth or subscription checks needed.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
