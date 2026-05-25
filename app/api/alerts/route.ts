import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/admin'

// GET - List user's alerts
export async function GET(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    
    
    const alerts = await prisma.alerts.findMany({
      where: { userId },
      include: {
        suburbs: {
          select: {
            name: true,
            state: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Transform the data to match the expected format
    const transformedAlerts = alerts.map(alert => ({
      id: alert.id,
      suburbName: alert.suburbs?.name || 'Unknown',
      state: alert.suburbs?.state || 'Unknown',
      alertTypes: alert.type.split(','), // Convert back to array
      frequency: (alert.condition as any)?.frequency || 'daily',
      priceChangeThreshold: (alert.condition as any)?.priceChangeThreshold,
      isActive: true, // For now, assume all are active
      lastTriggered: alert.triggeredAt?.toISOString(),
      createdAt: alert.createdAt.toISOString()
    }))
    
    return NextResponse.json({
      success: true,
      alerts,
      count: alerts.length
    })
    
  } catch (error: any) {
    console.error('Alerts GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

// POST - Create a new alert
export async function POST(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    
    
    // Check if user has Pro access
    const user = null; // Auth removed
    const userEmail = user?.emailAddresses?.[0]?.emailAddress
    const hasProAccess = isAdmin(userEmail) // TODO: Check actual subscription
    
    if (!hasProAccess) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Pro subscription required for price alerts',
          upgradeRequired: true
        },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { type, suburb, state, condition } = body
    
    // Validate alert type
    const validTypes = ['price_drop', 'price_increase', 'yield_change', 'new_listing', 'market_update']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid alert type' },
        { status: 400 }
      )
    }
    
    const alert = await (prisma as any).alert.create({
      data: {
        userId,
        type,
        suburb,
        state,
        condition: condition || {},
      }
    })
    
    return NextResponse.json({
      success: true,
      alert,
      message: 'Alert created successfully'
    })
    
  } catch (error: any) {
    console.error('Alerts POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an alert
export async function DELETE(request: NextRequest) {
  try {
    const userId = 'guest'; // Auth removed
    
    
    
    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get('id')
    
    if (!alertId) {
      return NextResponse.json(
        { success: false, error: 'Alert ID required' },
        { status: 400 }
      )
    }
    
    // Verify ownership
    const alert = await prisma.alerts.findFirst({
      where: { id: alertId, userId }
    })
    
    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      )
    }
    
    await prisma.alerts.delete({
      where: { id: alertId }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Alert deleted successfully'
    })
    
  } catch (error: any) {
    console.error('Alerts DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert' },
      { status: 500 }
    )
  }
}
