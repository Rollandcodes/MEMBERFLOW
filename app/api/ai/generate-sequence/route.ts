import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

type GenerateSequenceRequest = {
  prompt?: string
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

  let body: GenerateSequenceRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const prompt = (body.prompt || '').trim()
  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }

  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      stream: true,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert lifecycle marketer. Produce a concise 3-step drip sequence. Format exactly as plain text with this structure for each step: "Step X", "Subject:", "Delay (days):", "Message:".',
        },
        {
          role: 'user',
          content: `User context: ${prompt}\n\nGenerate a 3-step onboarding drip sequence with subject, delay in days, and message body for each step.`,
        },
      ],
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '')
    console.error('[AI Sequence] OpenAI request failed with status', upstream.status)
    return NextResponse.json(
      { error: 'Failed to generate sequence', detail: detail.slice(0, 300) },
      { status: 502 }
    )
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue

            const payload = trimmed.replace(/^data:\s*/, '')
            if (payload === '[DONE]') {
              controller.close()
              return
            }

            try {
              const json = JSON.parse(payload)
              const chunk = json?.choices?.[0]?.delta?.content
              if (chunk) {
                controller.enqueue(encoder.encode(chunk))
              }
            } catch {
              // Ignore malformed SSE JSON chunks.
            }
          }
        }

        controller.close()
      } catch (error) {
        console.error('[AI Sequence] Streaming parse failure', error)
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
