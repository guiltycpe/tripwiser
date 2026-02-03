import type { H3Event } from 'h3'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface ItineraryActivity {
    time: string;
    description: string;
    lat: number;
    lng: number;
    location: string;
}

interface ItineraryDay {
    day: number;
    title: string;
    activities: ItineraryActivity[];
}

interface GenerateItineraryResponse {
    success: boolean;
    itinerary: ItineraryDay[];
    meta: {
        destination: string;
        budget: string;
        style: string;
    }
}

export default defineEventHandler(async (event: H3Event): Promise<GenerateItineraryResponse> => {
    console.log('API call: generate-itinerary (Gemini)')
    const body = await readBody(event)
    // destructuring with defaults
    const {
        departure,
        destination,
        departure_date,
        return_date,
        budget,
        travel_style,
        road_trip,
        travelers
    } = body

    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'GOOGLE_AI_API_KEY is not configured on the server.'
        })
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Calculate duration in days
    const start = new Date(departure_date)
    const end = new Date(return_date)
    const durationMs = end.getTime() - start.getTime()
    const days = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1

    // Safety check for duration
    const tripDuration = (days > 0 && days <= 30) ? days : 5

    const prompt = `
    Role: You are an expert travel planner AI for the app TripWiser.
    Task: Generate a detailed ${tripDuration}-day travel itinerary for a trip to ${destination}.
    
    Context:
    - Origin: ${departure}
    - Budget: ${budget}
    - Travel Style: ${travel_style}
    - Travelers: ${travelers}
    - Road Trip: ${road_trip ? 'Yes' : 'No'}
    - Dates: ${departure_date} to ${return_date}

    Output Format:
    You MUST return ONLY a valid JSON array of objects. Do not include markdown formatting (like \`\`\`json).
    Structure:
    [
        {
            "day": 1,
            "title": "Day theme or title",
            "activities": [
                {
                    "time": "09:00",
                    "description": "Activity description",
                    "location": "Name of the place",
                    "lat": 0.00, // Approximate latitude
                    "lng": 0.00  // Approximate longitude
                }
            ]
        }
    ]

    Requirements:
    - Plan for exactly ${tripDuration} days.
    - Suggest 3-4 distinct activities per day (Morning, Afternoon, Evening).
    - Ensure coordinates (lat/lng) are somewhat accurate for the specific location mentioned.
    - Tailor the activities to the "${travel_style}" style.
    `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Cleanup potential markdown formatting if the model disregards instructions
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()

        const itinerary: ItineraryDay[] = JSON.parse(cleanJson)

        return {
            success: true,
            itinerary: itinerary,
            meta: {
                destination,
                budget,
                style: travel_style
            }
        }

    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to generate itinerary: ' + error.message
        })
    }
})
