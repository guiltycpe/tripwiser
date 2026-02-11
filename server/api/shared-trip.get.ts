import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

/**
 * GET /api/shared-trip?token=xxx
 *
 * Public endpoint — returns trip data for a shared token.
 * No auth required.
 *
 * Uses service role client to bypass RLS, then filters by exact token match.
 * This prevents enumeration of all shared trips (see migration 003).
 */
export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const token = query.token as string

  if (!token || token.length < 16) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid share token' })
  }

  const supabase = serverSupabaseServiceRole(event)

  const { data: trip, error } = await supabase
    .from('trips')
    .select('destination, departure_date, return_date, travelers, budget, itinerary, destination_image_url')
    .eq('share_token', token)
    .single()

  if (error || !trip) {
    throw createError({ statusCode: 404, statusMessage: 'Shared trip not found' })
  }

  return trip
})
