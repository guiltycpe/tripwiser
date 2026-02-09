/**
 * Shared JSON extraction utility for AI responses
 * Used by generate-itinerary, modify-activity, and modify-day endpoints
 */

/**
 * Cleans and extracts valid JSON from LLM response text.
 * Handles markdown code fences, trailing commas, etc.
 */
export function extractJSON(text: string): string {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

  // Find the first { and last } to extract JSON object
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('No valid JSON object found in response')
  }

  cleaned = cleaned.substring(firstBrace, lastBrace + 1)

  // Fix common JSON issues from LLMs — only remove trailing commas
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1')

  return cleaned
}

/**
 * Safely parse JSON from an AI response and return the parsed object.
 * Throws a descriptive error on failure.
 */
export function parseAIResponse<T = any>(text: string): T {
  const jsonStr = extractJSON(text)
  try {
    return JSON.parse(jsonStr) as T
  } catch (e: any) {
    throw new Error(`Failed to parse AI JSON: ${e.message}`)
  }
}
