import Anthropic from '@anthropic-ai/sdk'

// Initialized lazily so the file loads fine when ANTHROPIC_API_KEY is not yet set
let client

function getClient() {
  if (!client) client = new Anthropic() // reads ANTHROPIC_API_KEY from env
  return client
}

const SYSTEM_PROMPT = `You are a content moderator for an 8th-grade student election campaign site for Caleigh Elliott, running for Amistad House Leader at Ron Clark Academy. The site accepts public "shoutout" submissions — short messages of support, congratulation, or kindness from friends, family, and the school community.

Your job is to decide whether each submission is appropriate to publish.

APPROVE submissions that are:
- Kind, supportive, or celebratory (e.g. "Go Caleigh!", "Proud of you!", "Amistad family!")
- Sincere compliments, well-wishes, blessings, or jokes that are clearly in good spirit
- Short but meaningful messages of support
- In Caleigh's tone: community, family, love for House of Amistad

REJECT submissions that contain:
- Profanity, slurs, or crude language
- Bullying, mean-spirited, sarcastic, or passive-aggressive tone
- Personal attacks on anyone (Caleigh, other candidates, students, faculty)
- Spam, links, advertising, or off-topic promotion
- Obvious placeholder / test content ("hey", "what up", "asdf", "test", gibberish, single random words)
- Sexual content or innuendo
- Threats, hate speech, or discriminatory language
- Content that clearly isn't a shoutout (a question, a complaint, an insult in disguise)

Be somewhat permissive — err on the side of approval for sincere borderline cases. A short but heartfelt "Let's go Amistad!" is fine. Only reject when something is clearly problematic, generic throwaway content, or not a shoutout at all.

Always use the moderate_shoutout tool to return your decision.`

// POST /api/moderate-shoutout  { name, message }
// Returns { ok: true, decision: 'approve'|'reject', reason, rephrase_hint }
export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[moderate-shoutout] ANTHROPIC_API_KEY not set')
    // Fail open so the form isn't blocked before env vars are configured
    return Response.json({ ok: true, decision: 'approve', reason: 'Moderation not configured' })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, message } = body || {}
  if (typeof message !== 'string' || !message.trim()) {
    return Response.json({ error: 'Missing message' }, { status: 400 })
  }
  if (message.length > 500) {
    return Response.json({ error: 'Message too long' }, { status: 400 })
  }

  try {
    const response = await getClient().messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: 'moderate_shoutout',
          description: 'Record the moderation decision for this shoutout.',
          input_schema: {
            type: 'object',
            properties: {
              decision: {
                type: 'string',
                enum: ['approve', 'reject'],
                description: 'Whether to allow this shoutout to be posted.',
              },
              reason: {
                type: 'string',
                description: 'One-sentence reason for the decision (for logs).',
              },
              rephrase_hint: {
                type: 'string',
                description:
                  'If decision is "reject", a short friendly suggestion for the submitter (e.g. "Keep it kind — try sharing a specific memory?"). Empty string when approved.',
              },
            },
            required: ['decision', 'reason', 'rephrase_hint'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'moderate_shoutout' },
      messages: [
        {
          role: 'user',
          content: `Submitter name: ${String(name || 'anonymous').slice(0, 50)}\nMessage: ${message.slice(0, 500)}`,
        },
      ],
    })

    const toolUse = response.content.find((c) => c.type === 'tool_use')
    if (!toolUse) {
      console.warn('[moderate-shoutout] Response had no tool_use block, failing open')
      return Response.json({ ok: true, decision: 'approve', reason: 'Malformed moderation response' })
    }

    const { decision, reason, rephrase_hint } = toolUse.input || {}
    const normalized = decision === 'reject' ? 'reject' : 'approve'
    console.log(`[moderate-shoutout] ${normalized}: ${reason}`)

    return Response.json({
      ok: true,
      decision: normalized,
      reason: reason || '',
      rephrase_hint: rephrase_hint || '',
    })
  } catch (err) {
    console.error('[moderate-shoutout] API error:', err?.message || err)
    // Fail open: don't block legitimate users when the moderation service is down
    return Response.json({
      ok: true,
      decision: 'approve',
      reason: 'Moderation service unavailable',
    })
  }
}
