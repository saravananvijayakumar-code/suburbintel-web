import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.email || !data.name || !data.phone || !data.agencyName || !data.licenseNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Set plan to professional (only option)
    const selectedPlan = 'professional'

    // Check if agent already exists
    const existing = await prisma.users.findUnique({
      where: { email: data.email }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Agent with this email already exists' },
        { status: 400 }
      )
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-10)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Create agent user
    const agent = await prisma.users.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        updatedAt: new Date()
        // TODO: Add agency details and subscription plan to user metadata
      }
    })

    // TODO: Create subscription record with trial period
    // TODO: Send welcome email with trial details and temp password
    console.log(`Agent created: ${data.email}`)
    console.log(`Plan: Professional - $99/month (14-day trial)`)
    console.log(`Temp password: ${tempPassword}`)

    return NextResponse.json({
      success: true,
      message: 'Agent account created successfully',
      agentId: agent.id,
      plan: selectedPlan,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    })

  } catch (error) {
    console.error('Agent signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create agent account' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
