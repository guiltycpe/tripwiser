import type { H3Event } from 'h3'
import { createEventStream } from 'h3'
import { requireAuth, rateLimit } from '~/server/utils/auth'
import { generateItinerary } from '~/server/utils/itineraryGenerator'
import { getFactsForDestination } from '~/server/utils/destinationFacts'

export default defineEventHandler(async (event: H3Event) => {
    const { user } = await requireAuth(event)
    rateLimit(user.id, { maxRequests: 5, windowMs: 60_000 })

    const body = await readBody(event)

    const stream = createEventStream(event)

    const emit = (eventType: string, data: object) => {
        stream.push({ event: eventType, data: JSON.stringify(data) })
    }

    // Send fun facts for the destination
    const facts = getFactsForDestination(body.destination || '')
    for (const fact of facts) {
        emit('fun_fact', { fact })
    }

    // Heartbeat to prevent proxy timeouts
    const heartbeat = setInterval(() => {
        stream.push(':heartbeat\n')
    }, 15_000)

    // Run generation in background
    ;(async () => {
        try {
            const result = await generateItinerary(
                {
                    departure: body.departure,
                    destination: body.destination,
                    departure_date: body.departure_date,
                    return_date: body.return_date,
                    budget: body.budget,
                    travel_style: body.travel_style,
                    road_trip: body.road_trip,
                    travelers: body.travelers,
                    user_preferences: body.user_preferences
                },
                {
                    onPhaseStart(phase, progress) {
                        emit('phase_start', { phase, progress })
                    },
                    onPhaseComplete(phase, progress) {
                        emit('phase_complete', { phase, progress })
                    },
                    onValidationProgress(validated, total, progress) {
                        emit('validation_progress', { validated, total, progress })
                    }
                }
            )

            emit('result', { result, progress: 100 })
        } catch (err: any) {
            console.error('SSE generation error:', err)
            emit('error', { error: err.message || 'Generation failed' })
        } finally {
            clearInterval(heartbeat)
            setTimeout(() => stream.close(), 500)
        }
    })()

    return stream.send()
})
