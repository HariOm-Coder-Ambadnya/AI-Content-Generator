// src/lib/groq.js (Updated to support AbortController signal)
// Groq API integration replacing Gemini for faster/better structured responses

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key')
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPTS = {
  blog: `You are an expert blog writer and content strategist. Write compelling, well-structured blog posts with engaging headings, clear paragraphs, and a strong narrative flow. Include an introduction, body sections with subheadings, and a conclusion. Use markdown formatting.`,
  social: `You are a social media expert. Write punchy, engaging social media captions that stop the scroll. Include relevant emojis, hashtags, and a strong call-to-action. Tailor the tone to be conversational and platform-native. Format clearly with the caption followed by hashtags.`,
  marketing: `You are a senior copywriter at a world-class creative agency. Write persuasive, benefit-driven marketing copy that converts. Focus on emotional triggers, value propositions, and clear CTAs. Use power words and create urgency where appropriate.`,
  code: `You are a senior software engineer and technical writer. Write clear, well-commented technical documentation and code. Include explanations of what the code does, usage examples, and any important caveats. Use proper markdown code blocks with language hints.`,
}

const TONE_HINTS = {
  professional: 'Maintain a professional, authoritative tone.',
  casual: 'Keep the tone conversational, friendly, and approachable.',
  witty: 'Be clever, humorous, and entertaining while staying on point.',
  inspirational: 'Be uplifting, motivating, and emotionally resonant.',
}

const LENGTH_MAP = {
  blog: {
    short: '150-250 words',
    medium: '400-600 words',
    long: '800-1200 words',
  },
  social: {
    short: '1-2 sentences or up to 150 characters',
    medium: '3-5 sentences with hashtags',
    long: 'A full caption with storytelling, 8-10 sentences + hashtags',
  },
  marketing: {
    short: 'Brief and punchy (copy for a small ad)',
    medium: 'Balanced and persuasive (email or landing page section)',
    long: 'Comprehensive sales copy or long-form sales letter',
  },
  code: {
    short: 'A single function or concise snippet',
    medium: 'A complete class or multi-file example',
    long: 'A full module or detailed technical guide',
  }
}

export async function* streamGenerateContent({ type, topic, tone, length, audience, additionalContext, signal }) {
  const systemPrompt = SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.blog
  const toneHint = TONE_HINTS[tone] || ''
  const lengthDesc = LENGTH_MAP[type]?.[length] || 'medium length'

  const userPrompt = `
Topic/Brief: ${topic}
Target Audience: ${audience || 'General audience'}
Desired Length: ${lengthDesc}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}
${toneHint}

Generate the content now. Do not include meta-commentary, just the content itself.
  `.trim()

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      signal, // Pass the AbortController signal
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: tone === 'witty' ? 0.9 : 0.7,
        max_tokens: length === 'long' ? 3072 : length === 'medium' ? 1536 : 768,
        stream: true
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: { message: 'Groq API error' } }))
      throw new Error(err.error?.message || 'Groq Stream error')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(l => l.trim().startsWith('data: '))

      for (const line of lines) {
        const dataStr = line.replace(/^data: /, '').trim()
        if (dataStr === '[DONE]') return

        try {
          const json = JSON.parse(dataStr)
          const text = json.choices?.[0]?.delta?.content
          if (text) yield text
        } catch (_) { }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error
    console.error('Groq Generation Error:', error)
    throw error
  }
}

export async function generateContent(params) {
  const gen = streamGenerateContent(params)
  let fullContent = ''
  for await (const chunk of gen) {
    fullContent += chunk
  }
  return fullContent
}
