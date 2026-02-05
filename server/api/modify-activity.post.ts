import type { H3Event } from 'h3'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * POST /api/modify-activity
 * 
 * Accepts an activity object + user instruction,
 * returns a modified version of the activity via Gemini.
 */
export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { activity, instruction } = body

  if (!activity || !instruction) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing activity or instruction in request body'
    })
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GOOGLE_AI_API_KEY is not configured'
    })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `
You are modifying a single travel itinerary activity based on user feedback.

=== CURRENT ACTIVITY ===
${JSON.stringify(activity, null, 2)}

=== USER INSTRUCTION ===
"${instruction}"

=== RULES ===
1. Return ONLY valid JSON — no markdown, no explanation, no code fences.
2. Preserve the exact same JSON structure and field names.
3. Modify ONLY the fields relevant to the user's instruction.
4. Keep place_id, lat, lng, google_maps_link if the location doesn't change.
5. If the user asks for a different place, set has_physical_location: true and provide realistic coordinates.
6. Keep the tone conversational and friendly.
7. Ensure estimated_cost_usd is a reasonable number.
8. Return the complete activity object with all original fields.

Return the modified activity JSON now:
`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Extract JSON from response
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No valid JSON in AI response')
    }

    cleaned = cleaned.substring(firstBrace, lastBrace + 1)
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1')

    const modified = JSON.parse(cleaned)

    // Ensure cost is a number
    if (modified.estimated_cost_usd !== undefined) {
      modified.estimated_cost_usd = Number(modified.estimated_cost_usd) || 0
    }

    return modified
  } catch (error: any) {
    console.error('AI Modify Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to modify activity: ' + error.message
    })
  }
})
