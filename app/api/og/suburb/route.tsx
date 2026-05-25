/**
 * Dynamic Open Graph Image Generator for Suburb Pages
 * Generates social media preview images with key suburb data
 */

import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const name = searchParams.get('name') || 'Suburb'
    const state = searchParams.get('state') || 'NSW'
    const price = searchParams.get('price') || '$0'
    const yieldVal = searchParams.get('yield') || '0'
    const growth = searchParams.get('growth') || '0'
    
    const growthNum = parseFloat(growth)
    const growthColor = growthNum > 5 ? '#10b981' : growthNum > 0 ? '#3b82f6' : '#ef4444'
    const growthEmoji = growthNum > 5 ? '📈' : growthNum > 0 ? '📊' : '📉'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e293b',
            backgroundImage: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
          }}
        >
          {/* Logo/Branding */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              📊
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: 'white',
              }}
            >
              SuburbIntel
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 80px',
            }}
          >
            {/* Suburb Name */}
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: 'white',
                marginBottom: 10,
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {name}, {state}
            </h1>
            
            <div
              style={{
                fontSize: 28,
                color: '#94a3b8',
                marginBottom: 60,
              }}
            >
              Property Market Analysis 2025
            </div>

            {/* Stats Grid */}
            <div
              style={{
                display: 'flex',
                gap: 40,
                marginTop: 20,
              }}
            >
              {/* Median Price */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '30px 40px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: 16,
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    color: '#94a3b8',
                    marginBottom: 8,
                  }}
                >
                  💰 Median Price
                </div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: '#3b82f6',
                  }}
                >
                  {price}
                </div>
              </div>

              {/* Rental Yield */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '30px 40px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: 16,
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    color: '#94a3b8',
                    marginBottom: 8,
                  }}
                >
                  🏠 Rental Yield
                </div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: '#10b981',
                  }}
                >
                  {yieldVal}%
                </div>
              </div>

              {/* Annual Growth */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '30px 40px',
                  background: `rgba(${growthNum > 0 ? '59, 130, 246' : '239, 68, 68'}, 0.1)`,
                  borderRadius: 16,
                  border: `2px solid rgba(${growthNum > 0 ? '59, 130, 246' : '239, 68, 68'}, 0.3)`,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    color: '#94a3b8',
                    marginBottom: 8,
                  }}
                >
                  {growthEmoji} Annual Growth
                </div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: growthColor,
                  }}
                >
                  {growthNum > 0 ? '+' : ''}{growth}%
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              fontSize: 18,
              color: '#64748b',
            }}
          >
            suburbintel.com - Australian Property Intelligence
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('Error generating OG image:', e)
    return new NextResponse('Failed to generate image', { status: 500 })
  }
}
