import { defineEventHandler, getQuery } from 'h3'
import { requireAuth } from '~/server/utils/auth'

/**
 * GET /api/get-destination-image?destination=...
 *
 * Returns a high-quality Unsplash photo URL for the destination.
 * Falls back to Mapbox static image if Unsplash fails.
 */
export default defineEventHandler(async (event) => {
    await requireAuth(event)

    const query = getQuery(event)
    const destination = query.destination as string
    const config = useRuntimeConfig()

    if (!destination) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Destination is required',
        })
    }

    // Try Unsplash first
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY || config.unsplashAccessKey
    if (unsplashKey) {
        try {
            const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination + ' travel landscape')}&per_page=1&orientation=landscape`
            const res = await fetch(searchUrl, {
                headers: {
                    'Authorization': `Client-ID ${unsplashKey}`,
                    'Accept-Version': 'v1'
                }
            })

            if (res.ok) {
                const data = await res.json()
                const photo = data.results?.[0]
                if (photo?.urls?.regular) {
                    return {
                        url: photo.urls.regular,
                        alt: photo.alt_description || destination
                    }
                }
            }
        } catch {
            // Fall through to Mapbox
        }
    }

    // Fallback: Mapbox static image
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || config.mapboxAccessToken
    if (mapboxToken) {
        try {
            const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${mapboxToken}&limit=1`
            const geocodeRes = await fetch(geocodeUrl)

            if (geocodeRes.ok) {
                const geocodeData = await geocodeRes.json()
                const feature = geocodeData.features?.[0]
                if (feature?.center) {
                    const [lng, lat] = feature.center
                    const url = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${lng},${lat},10,0/800x400@2x?access_token=${mapboxToken}`
                    return { url, alt: destination }
                }
            }
        } catch {
            // Fall through to null
        }
    }

    return { url: null }
})
