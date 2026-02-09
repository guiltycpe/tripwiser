import type { H3Event } from 'h3'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/shared-trip?token=xxx
 * 
 * Public endpoint — returns trip data for a shared token.
 * No auth required.
 * 
 * Uses a dedicated anon client with the public key (no service role needed).
 * Relies on a RLS policy that allows SELECT on trips when share_token matches.
 * See: database/migrations/002_add_share_token.sql
 */
export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const token = query.token as string

  if (!token || token.length < 16) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid share token' })
  }

  // Create a standalone anon client (not tied to any user session)
  // This works because we have a RLS policy: "allow select where share_token is not null"
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase configuration missing' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

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
