import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/admin'

export async function GET() {
  // Health check with minimal info for public, detailed for admin
  const userId = 'guest'; // Auth removed
  const isAdminUser = false; // Auth removed - all requests are public

  try {
    // Always test connection
    await prisma.$queryRaw`SELECT 1`
    
    // Public response: just status
    if (!isAdminUser) {
      return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
      })
    }

    // Admin response: detailed diagnostics
    const suburbCount = await prisma.suburbs.count()
    return NextResponse.json({
      status: 'ok',
      database: {
        connected: true,
        suburbCount,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseHost: process.env.DATABASE_URL?.includes('cloudsql') ? 'Cloud SQL' : 'Other',
      },
      timestamp: new Date().toISOString(),
      service: 'suburb-intel-web',
      version: '1.0.0'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

