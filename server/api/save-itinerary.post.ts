/**
 * POST /api/save-itinerary
 * Autosave endpoint — saves the current itinerary state to the database.
 */
import type { H3Event } from 'h3'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  const { supabase, user } = await requireAuth(event)
  const body = await readBody(event)
  const { tripId, itinerary } = body

  if (!tripId || !itinerary) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tripId or itinerary' })
  }

  // Verify the trip belongs to this user
  const { data: trip, error: fetchError } = await (supabase
    .from('trips' as any)
    .select('id, user_id')
    .eq('id', tripId)
    .eq('user_id', user.id)
    .single() as any)

  if (fetchError || !trip) {
    throw createError({ statusCode: 404, statusMessage: 'Trip not found or access denied' })
  }

  const { error: updateError } = await (supabase
    .from('trips' as any)
    .update({ itinerary } as any)
    .eq('id', tripId) as any)

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to save itinerary' })
  }

  return { success: true, saved_at: new Date().toISOString() }
})
