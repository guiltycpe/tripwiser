import type { H3Event } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { serverSupabaseClient } from '#supabase/server'
import crypto from 'crypto'

/**
 * POST /api/share-trip
 * 
 * Generates or retrieves a share token for a trip.
 * The token allows public read-only access to the trip.
 */
export default defineEventHandler(async (event: H3Event) => {
  const { user, supabase } = await requireAuth(event)

  const body = await readBody(event)
  const { tripId } = body

  if (!tripId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing tripId' })
  }

  // Verify ownership
  const { data: trip, error: fetchErr } = await supabase
    .from('trips')
    .select('id, share_token')
    .eq('id', tripId)
    .eq('user_id', user.id)
    .single() as { data: { id: string; share_token: string | null } | null; error: any }

  if (fetchErr || !trip) {
    throw createError({ statusCode: 404, statusMessage: 'Trip not found' })
  }

  // If already has a share token, return it
  if (trip.share_token) {
    return { shareToken: trip.share_token }
  }

  // Generate a new share token
  const shareToken = crypto.randomBytes(16).toString('hex')

  const { error: updateErr } = await (supabase
    .from('trips') as any)
    .update({ share_token: shareToken })
    .eq('id', tripId)

  if (updateErr) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create share link' })
  }

  return { shareToken }
})
