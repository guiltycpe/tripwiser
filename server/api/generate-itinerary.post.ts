import type { H3Event } from 'h3'
import { requireAuth, rateLimit } from '~/server/utils/auth'
import { generateItinerary } from '~/server/utils/itineraryGenerator'
import type { GenerateItineraryResponse } from '~/server/utils/itineraryGenerator'

export default defineEventHandler(async (event: H3Event): Promise<GenerateItineraryResponse> => {
    const { user } = await requireAuth(event)
    rateLimit(user.id, { maxRequests: 5, windowMs: 60_000 })

    const body = await readBody(event)

    try {
        return await generateItinerary({
            departure: body.departure,
            destination: body.destination,
            departure_date: body.departure_date,
            return_date: body.return_date,
            budget: body.budget,
            travel_style: body.travel_style,
            road_trip: body.road_trip,
            travelers: body.travelers,
            user_preferences: body.user_preferences
        })
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to generate itinerary: ' + error.message
        })
    }
})
