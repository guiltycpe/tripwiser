import { defineEventHandler, readBody } from 'h3'
import { requireAuth } from '~/server/utils/auth'

/**
 * POST /api/refresh-trip-image
 * Body: { tripId: string, destination: string }
 *
 * Fetches a fresh Mapbox image for a trip and updates the destination_image_url in Supabase.
 * Used to replace stale Unsplash URLs with Mapbox static images.
 */
export default defineEventHandler(async (event) => {
  const { userId, supabase } = await requireAuth(event)

  const body = await readBody(event)
  const { tripId, destination } = body

  if (!tripId || !destination) {
    throw createError({
      statusCode: 400,
      statusMessage: 'tripId and destination are required',
    })
  }

  const config = useRuntimeConfig()
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN || config.mapboxAccessToken

  if (!accessToken) {
    return { url: null }
  }

  try {
    // Geocode destination
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${accessToken}&limit=1`
    const geocodeRes = await fetch(geocodeUrl)

    if (!geocodeRes.ok) {
      return { url: null }
    }

    const geocodeData = await geocodeRes.json()
    const feature = geocodeData.features?.[0]

    if (!feature?.center) {
      return { url: null }
    }

    const [lng, lat] = feature.center

    // Build Mapbox Static Image URL
    const zoom = 10
    const width = 800
    const height = 400
    const style = 'mapbox/outdoors-v12'
    const url = `https://api.mapbox.com/styles/v1/${style}/static/${lng},${lat},${zoom},0/${width}x${height}@2x?access_token=${accessToken}`

    // Update the trip in Supabase
    const { error } = await supabase
      .from('trips')
      .update({ destination_image_url: url })
      .eq('id', tripId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating trip image:', error)
      return { url: null }
    }

    return { url }
  } catch (error) {
    console.error('Error refreshing trip image:', error)
    return { url: null }
  }
})
