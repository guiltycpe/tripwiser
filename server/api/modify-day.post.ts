import type { H3Event } from 'h3'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * POST /api/modify-day
 *
 * Accepts an array of activities for a full day + user instruction,
 * returns a modified set of activities via Gemini 2.5 Flash.
 */
export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)
  const { activities, instruction, dayTitle, dayNumber } = body

  if (!activities || !instruction) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing activities or instruction in request body',
    })
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GOOGLE_AI_API_KEY is not configured',
    })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `
You are modifying a complete day of a travel itinerary based on user feedback.

=== DAY ${dayNumber ?? '?'}: "${dayTitle ?? 'Untitled'}" ===

=== CURRENT ACTIVITIES ===
${JSON.stringify(activities, null, 2)}

=== USER INSTRUCTION ===
"${instruction}"

=== RULES ===
1. Return ONLY a valid JSON object with a single key "activities" containing an array — no markdown, no explanation, no code fences.
2. Preserve the exact same JSON structure and field names for each activity.
3. Modify, add, remove, or reorder activities as the instruction requires.
4. Keep place_id, lat, lng, google_maps_link for locations that don't change.
5. For new places, set has_physical_location: true and provide realistic coordinates.
6. Keep estimated_cost_usd as reasonable numbers.
7. Keep time_flexible in "HH:MM" 24-hour format and ensure chronological order.
8. Keep the tone conversational and friendly in descriptions.
9. Return ALL fields for every activity (don't drop optional fields).
10. The response must be parseable JSON: { "activities": [ ... ] }

Return the modified day JSON now:
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

    const parsed = JSON.parse(cleaned)
    const modifiedActivities: any[] = parsed.activities ?? parsed

    // Ensure costs are numbers
    for (const act of modifiedActivities) {
      if (act.estimated_cost_usd !== undefined) {
        act.estimated_cost_usd = Number(act.estimated_cost_usd) || 0
      }
    }

    return { activities: modifiedActivities }
  } catch (error: any) {
    console.error('AI Modify Day Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to modify day: ' + error.message,
    })
  }
})
