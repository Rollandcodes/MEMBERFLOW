import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

type ChurnInsightsRequest = {
  lastActiveDate?: string
  messageOpenRate?: number
}

function normalizeInsights(raw: string): string[] {
  const lines = raw
    .split('\n')
    .map((line) => line.replace(/^[-*\d).\s]+/, '').trim())
    .filter(Boolean)

  return lines.slice(0, 3)
}

export async function POST(request: NextRequest) {
  const companyId = cookies().get('memberflow_company_id')?.value
  if (!companyId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 })
  }

  let body: ChurnInsightsRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { lastActiveDate, messageOpenRate } = body

  if (!lastActiveDate || typeof messageOpenRate !== 'number') {
    return NextResponse.json(
      { error: 'lastActiveDate and messageOpenRate are required' },
      { status: 400 }
    )
  }

  if (messageOpenRate < 0 || messageOpenRate > 100) {
    return NextResponse.json(
      { error: 'messageOpenRate must be a percentage between 0 and 100' },
      { status: 400 }
    )
  }

  try {
    const completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content:
              'You are a retention strategist for online communities. Return exactly 3 concise bullet points, each with a churn risk and one actionable recommendation.',
          },
          {
            role: 'user',
            content: `Analyze churn risk from these stats:\n- Last active date: ${lastActiveDate}\n- Message open rate: ${messageOpenRate}%\n\nReturn exactly 3 bullets with actionable recommendations.`,
          },
        ],
      }),
    })

    if (!completionRes.ok) {
      const errorText = await completionRes.text()
      console.error('[AI Churn] OpenAI completion failed with status', completionRes.status)
      return NextResponse.json(
        { error: 'Failed to generate churn insights', detail: errorText.slice(0, 300) },
        { status: 502 }
      )
    }

    const completion = await completionRes.json()
    const content = completion?.choices?.[0]?.message?.content

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'OpenAI returned no content' }, { status: 502 })
    }

    const insights = normalizeInsights(content)
    if (insights.length !== 3) {
      return NextResponse.json(
        { error: 'Model response did not contain exactly 3 insights' },
        { status: 502 }
      )
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('[AI Churn] Unexpected churn insights error', error)
    return NextResponse.json({ error: 'Unexpected generation error' }, { status: 500 })
  }
}
