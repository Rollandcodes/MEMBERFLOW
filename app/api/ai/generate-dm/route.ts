import { NextRequest, NextResponse } from 'next/server'

type GenerateDmRequest = {
  communityName?: string
  niche?: string
  tone?: 'friendly' | 'professional' | 'hype'
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 })
  }

  let body: GenerateDmRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const communityName = (body.communityName || '').trim()
  const niche = (body.niche || '').trim()
  const tone = body.tone || 'friendly'

  if (!['friendly', 'professional', 'hype'].includes(tone)) {
    return NextResponse.json(
      { error: 'tone must be one of: friendly, professional, hype' },
      { status: 400 }
    )
  }

  if (!communityName || !niche) {
    return NextResponse.json(
      { error: 'communityName and niche are required' },
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
        model: 'gpt-4o',
        temperature: 0.8,
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert community manager who writes high-converting welcome DMs for online communities. Write short, punchy, personalized messages that feel human not robotic.',
          },
          {
            role: 'user',
            content: `Write 3 different welcome DM messages for a ${niche} community called ${communityName}. Tone: ${tone}. Each message should be 2-4 sentences max. Return ONLY a JSON array of 3 strings, no other text.`,
          },
        ],
      }),
    })

    if (!completionRes.ok) {
      const errorText = await completionRes.text()
      console.error('[AI DM] OpenAI completion failed with status', completionRes.status)
      return NextResponse.json(
        { error: 'Failed to generate DM suggestions', detail: errorText.slice(0, 300) },
        { status: 502 }
      )
    }

    const completion = await completionRes.json()
    const content = completion?.choices?.[0]?.message?.content

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'OpenAI returned no content' }, { status: 502 })
    }

    let suggestions: string[] = []
    try {
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        suggestions = parsed
          .map((item: unknown) => (typeof item === 'string' ? item.trim() : ''))
          .filter(Boolean)
          .slice(0, 3)
      }
    } catch {
      suggestions = content
        .split('\n')
        .map((line: string) => line.replace(/^[-*\d.\s]+/, '').trim().replace(/^"|"$/g, ''))
        .filter(Boolean)
        .slice(0, 3)
    }

    if (suggestions.length < 3) {
      return NextResponse.json(
        { error: 'Could not parse 3 suggestions from model output' },
        { status: 502 }
      )
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('[AI DM] Unexpected generation error', error)
    return NextResponse.json({ error: 'Unexpected generation error' }, { status: 500 })
  }
}
