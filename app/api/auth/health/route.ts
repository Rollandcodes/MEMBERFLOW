import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    client_id: Boolean(process.env.WHOP_CLIENT_ID),
    client_secret: Boolean(process.env.WHOP_CLIENT_SECRET),
    redirect_uri: Boolean(process.env.WHOP_REDIRECT_URI),
  }

  const isHealthy = checks.client_id && checks.client_secret && checks.redirect_uri

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'error',
      checks,
    },
    { status: isHealthy ? 200 : 500 }
  )
}
