import { NextRequest, NextResponse } from 'next/server'

type GenerateDmRequest = {
  communityName?: string
  niche?: string
  tone?: string
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
  const tone = (body.tone || '').trim() || 'friendly'

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
        model: 'gpt-4o-mini',
        temperature: 0.8,
        max_tokens: 500,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You write short, high-converting community welcome DMs. Return strict JSON only with shape {"suggestions":["...","...","..."]}. Exactly 3 suggestions, no markdown.',
          },
          {
            role: 'user',
            content: `Generate 3 DM welcome message suggestions for community "${communityName}" in niche "${niche}" with a ${tone} tone. Include {{first_name}} naturally. Keep each between 140 and 240 characters.`,
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
      if (Array.isArray(parsed?.suggestions)) {
        suggestions = parsed.suggestions
          .map((item: unknown) => (typeof item === 'string' ? item.trim() : ''))
          .filter(Boolean)
          .slice(0, 3)
      }
    } catch {
      suggestions = content
        .split('\n')
        .map((line: string) => line.replace(/^[-*\d.\s]+/, '').trim())
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
