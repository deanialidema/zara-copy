import { NextRequest, NextResponse } from 'next/server'

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "6LdML9grAAAAADJSZYcSVDYmQAKvkTvbcOQifpb9"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No reCAPTCHA token provided' },
        { status: 400 }
      )
    }

    // Verify the reCAPTCHA token with Google
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const verificationData = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token,
      remoteip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    })

    const verificationResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: verificationData
    })

    const verificationResult = await verificationResponse.json()

    if (verificationResult.success) {
      return NextResponse.json({
        success: true,
        score: verificationResult.score,
        action: verificationResult.action
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'reCAPTCHA verification failed',
          errorCodes: verificationResult['error-codes']
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
