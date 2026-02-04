import type { H3Event } from 'h3'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { validateBatch } from '~/server/utils/placesValidator'

interface ItineraryActivity {
    time_flexible: string;
    activity_type: string;
    description: string;
    has_physical_location: boolean;
    place_id?: string;
    name?: string;
    location?: string;
    lat?: number;
    lng?: number;
    address?: string;
    google_maps_link?: string;
    rating?: number;
    opening_hours?: Record<string, string[] | string> | null;
    estimated_travel_time_from_previous?: {
        minutes: string | number;
        method: string;
    };
    duration_minutes: number | null;
    estimated_cost_usd: number;
    notes?: string;
    type?: string;
}

interface DailyPlan {
    day: number;
    date: string;
    title: string;
    daily_pace: string;
    activities: ItineraryActivity[];
}

interface ItinerarySection {
    section_title: string;
    days: number[];
    geographic_focus: string;
    accommodation_base: string;
    daily_plans: DailyPlan[];
}

interface AccommodationBase {
    neighborhood: string;
    check_in: string;
    check_out: string;
    nights: number;
    booking_link: string;
    estimated_cost_per_night_usd: number;
    total_cost_usd: number;
    why_here: string;
}

interface AccommodationStrategy {
    total_bases: number;
    reasoning: string;
    bases: AccommodationBase[];
}

interface FlightDetails {
    kayak_link: string;
    date?: string;
    departure_date?: string;
    return_date?: string;
    estimated_cost_range_usd: string;
}

interface ItineraryTransport {
    outbound_flight: FlightDetails;
    return_flight: FlightDetails;
}

interface CostBreakdown {
    accommodation_total: number;
    food_total: number;
    activities_total: number;
    souvenirs_budget: number;
    per_person_total: number;
}

interface ItinerarySummary {
    destination: string;
    duration_days: number;
    budget_tier: string;
    total_estimated_cost_usd: number;
    cost_breakdown: CostBreakdown;
}

interface GenerateItineraryResponse {
    trip_summary: ItinerarySummary;
    transport: ItineraryTransport;
    accommodation_strategy: AccommodationStrategy;
    itinerary_sections: ItinerarySection[];
}

const getBudgetRange = (budget: string) => {
    switch (budget) {
        case 'Low': return '$30-80';
        case 'Medium': return '$80-200';
        case 'High': return '$200+';
        default: return '$80-200';
    }
}

/**
 * Cleans and extracts valid JSON from LLM response
 */
function extractJSON(text: string): string {
    // Remove markdown code blocks
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Find the first { and last } to extract JSON object
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('No valid JSON object found in response');
    }
    
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    
    // Fix common JSON issues from LLMs
    // Remove trailing commas before } or ]
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
    
    // Fix unquoted property names (rare but possible)
    cleaned = cleaned.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
    
    return cleaned;
}

/**
 * Normalizes the itinerary data to ensure consistent types
 */
function normalizeItinerary(data: any): GenerateItineraryResponse {
    if (data.itinerary_sections) {
        for (const section of data.itinerary_sections) {
            if (section.daily_plans) {
                for (const plan of section.daily_plans) {
                    if (plan.activities) {
                        for (const activity of plan.activities) {
                            // Normalize opening_hours - convert string values to arrays
                            if (activity.opening_hours && typeof activity.opening_hours === 'object') {
                                const normalized: Record<string, string[]> = {};
                                for (const [key, value] of Object.entries(activity.opening_hours)) {
                                    if (Array.isArray(value)) {
                                        normalized[key] = value;
                                    } else if (typeof value === 'string') {
                                        normalized[key] = [value];
                                    }
                                }
                                // If it's just a "note" field, move to notes and clear opening_hours
                                if (Object.keys(normalized).length === 0 || 
                                    (Object.keys(activity.opening_hours).length === 1 && activity.opening_hours.note)) {
                                    if (activity.opening_hours.note) {
                                        activity.notes = activity.notes 
                                            ? `${activity.notes} | Hours: ${activity.opening_hours.note}`
                                            : `Hours: ${activity.opening_hours.note}`;
                                    }
                                    activity.opening_hours = null;
                                } else {
                                    activity.opening_hours = normalized;
                                }
                            }
                            
                            // Normalize travel time minutes to string
                            if (activity.estimated_travel_time_from_previous?.minutes) {
                                activity.estimated_travel_time_from_previous.minutes = 
                                    String(activity.estimated_travel_time_from_previous.minutes);
                            }
                            
                            // Ensure duration_minutes is number or null
                            if (activity.duration_minutes !== null && activity.duration_minutes !== undefined) {
                                activity.duration_minutes = Number(activity.duration_minutes) || null;
                            }
                            
                            // Ensure estimated_cost_usd is number
                            activity.estimated_cost_usd = Number(activity.estimated_cost_usd) || 0;
                        }
                    }
                }
            }
        }
    }
    return data as GenerateItineraryResponse;
}

const validatePlaceFunction = {
    name: 'validate_place',
    description: 'Validates that a place exists and returns its verified details (ID, coords, etc.). MUST be called for EVERY suggested place.',
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            place_name: {
                type: SchemaType.STRING,
                description: 'Complete name of the place (e.g., "Tokyo Tower", "Senso-ji Temple")'
            },
            location: {
                type: SchemaType.STRING,
                description: 'City, Country (e.g., "Tokyo, Japan")'
            },
            type: {
                type: SchemaType.STRING,
                description: 'Type of place',
                enum: ['tourist_attraction', 'restaurant', 'hotel', 'museum', 'park', 'shopping', 'nightlife', 'cafe']
            }
        },
        required: ['place_name', 'location', 'type']
    }
};

export default defineEventHandler(async (event: H3Event): Promise<GenerateItineraryResponse> => {
    console.log('API call: generate-itinerary (Gemini + Validation)')
    const body = await readBody(event)
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

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        tools: [{ functionDeclarations: [validatePlaceFunction as any] }]
    })

    const start = new Date(departure_date)
    const end = new Date(return_date)
    const durationMs = end.getTime() - start.getTime()
    const days = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1
    const tripDuration = (days > 0 && days <= 90) ? days : 5

    // Dynamic safety limit: 4 activities/day * 2 attempts margin * duration
    const maxFunctionCalls = tripDuration * 4 * 2;
    console.log(`Trip duration: ${tripDuration} days. Safety limit: ${maxFunctionCalls} calls.`);

    const prompt = `
    Role: Expert local travel planner for TripWiser. Plan as a knowledgeable local who understands realistic travel logistics.

    === TRIP CONTEXT ===
    Destination: ${destination} | Origin: ${departure} | Duration: ${tripDuration} days
    Dates: ${departure_date} to ${return_date} | Budget: ${budget} (${getBudgetRange(budget)}/person/day)
    Travel Style: ${travel_style} | Travelers: ${travelers} | Road Trip: ${road_trip ? 'Yes' : 'No'}

    === BUDGET BREAKDOWN (per person/day) ===
    Budget Friendly ($30-80): 40% accommodation, 35% food, 20% activities, 5% souvenirs
    Balanced Comfort ($80-200): 45% accommodation, 30% food, 20% activities, 5% souvenirs
    Luxury Experience ($200+): 50% accommodation, 25% food, 20% activities, 5% souvenirs

    Calculate: total budget = (daily budget × ${tripDuration} days × ${travelers} travelers)
    Distribute across categories using percentages above.

    === PLANNING METHODOLOGY (EXECUTE IN ORDER) ===

    PHASE 1: Geographic Clustering
    1. Identify 2-4 main neighborhoods/areas based on ${travel_style}
    2. List must-see attractions within walking distance or <20min transit per area
    3. Group activities by district for same-day execution

    PHASE 2: Strategic Accommodation Planning
    Determine optimal bases:
    - <7 days: 1 base
    - 7-14 days: 1-2 bases (change only if >45min apart)
    - 15-30 days: 2-3 bases max
    - >30 days: +1 base per 2 weeks
    Select neighborhoods minimizing daily travel. Calculate nights strategically.

    PHASE 3: Activity Validation
    1. Call validate_place() for ALL specific venues (restaurants, attractions, shops)
    2. BATCH all validate_place() calls in ONE response
    3. Check opening hours compatibility with planned timing
    4. Filter closed venues, suggest alternatives if validation fails

    PHASE 4: Day-by-Day Distribution
    Activity pacing by ${travel_style}:
    - Relaxation: 2-3 activities/day + rest time
    - Balanced: 3-4 activities/day, mixed intensity
    - Adventure: 4-5 activities/day, optimized routes
    Alternate intense/light days for trips >5 days. Use flexible timing ("around 14:00"). Account for realistic travel but avoid rigid schedules.

    === VALIDATION & UX RULES ===

    Transport Links (use Kayak for pre-filled search results):
    You MUST use IATA airport codes (3 letters). Common codes: Paris=PAR, Lyon=LYS, Tokyo=TYO, Osaka=OSA, New York=NYC, London=LON, etc.
    For outbound flight: https://www.kayak.fr/flights/[DEPARTURE_IATA_CODE]-[DESTINATION_IATA_CODE]/[departure_date as YYYY-MM-DD]?sort=bestflight_a&adults=${travelers}
    For return flight: https://www.kayak.fr/flights/[LAST_DESTINATION_IATA_CODE]-[DEPARTURE_IATA_CODE]/[return_date as YYYY-MM-DD]?sort=bestflight_a&adults=${travelers}
    
    Example for Lyon to Tokyo on 2026-03-07, return from Osaka on 2026-03-21, 2 travelers:
    outbound: https://www.kayak.fr/flights/LYS-TYO/2026-03-07?sort=bestflight_a&adults=2
    return: https://www.kayak.fr/flights/OSA-LYS/2026-03-21?sort=bestflight_a&adults=2
    
    IMPORTANT: Generate separate one-way flight links. For multi-destination trips, use the LAST destination city for the return flight origin.

    Accommodation Links:
    https://www.booking.com/searchresults.html?ss=[neighborhood],${destination}&checkin=[check_in_date]&checkout=[check_out_date]&group_adults=${travelers}&no_rooms=1&group_children=0

    Place Validation Rules:
    - Validate: restaurants, cafes, museums, shops, specific attractions
    - Skip: "rest at hotel", "explore neighborhood", "breakfast at accommodation"
    - If has coordinates: include google_maps_link, set has_physical_location: true
    - If generic activity: has_physical_location: false, no maps link

    Opening Hours:
    - opening_hours field is OPTIONAL - only include if you have reliable data
    - If included, use format: {"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"]} 
    - If hours are uncertain, OMIT opening_hours entirely and add note in "notes" field instead

    Travel Time Display:
    Show estimated_travel_time_from_previous between activities if >10 min. Format: {"minutes": "15-20", "method": "walk"}

    === TONE ===
    Write conversationally like a local friend. Use actionable imperatives: "Start at...", "Head to...", "Perfect spot for..."
    Add insider tips: "Lines move fast - worth it", "Skip weekends, too crowded"
    Vary structure, show personality. No robotic lists.

    === JSON OUTPUT ===

    Return valid JSON after ALL validate_place() calls:

    {
    "trip_summary": {
        "destination": "${destination}",
        "duration_days": ${tripDuration},
        "budget_tier": "${budget}",
        "total_estimated_cost_usd": 0,
        "cost_breakdown": {
        "accommodation_total": 0,
        "food_total": 0,
        "activities_total": 0,
        "souvenirs_budget": 0,
        "per_person_total": 0
        }
    },
    
    "transport": {
        "outbound_flight": {
        "kayak_link": "https://www.kayak.fr/flights/LYS-TYO/2026-03-07?sort=bestflight_a&adults=2",
        "departure_date": "${departure_date}",
        "estimated_cost_range_usd": "400-800"
        },
        "return_flight": {
        "kayak_link": "https://www.kayak.fr/flights/TYO-LYS/2026-03-21?sort=bestflight_a&adults=2",
        "return_date": "${return_date}",
        "estimated_cost_range_usd": "400-800"
        }
    },

    "accommodation_strategy": {
        "total_bases": 2,
        "reasoning": "Two bases minimize packing/unpacking while covering different areas efficiently",
        "bases": [
        {
            "neighborhood": "Shinjuku",
            "check_in": "${departure_date}",
            "check_out": "YYYY-MM-DD",
            "nights": 5,
            "booking_link": "https://www.booking.com/searchresults.html?ss=...",
            "estimated_cost_per_night_usd": 120,
            "total_cost_usd": 600,
            "why_here": "Central location for exploring western Tokyo, close to major train lines"
        }
        ]
    },

    "itinerary_sections": [
        {
        "section_title": "Arrival & Shinjuku Exploration",
        "days": [1, 2],
        "geographic_focus": "Shinjuku & Surrounding Areas",
        "accommodation_base": "Shinjuku",
        
        "daily_plans": [
            {
            "day": 1,
            "date": "${departure_date}",
            "title": "Touchdown in Tokyo",
            "daily_pace": "Light - Recovery from flight",
            
            "activities": [
                {
                "time_flexible": "Afternoon (around 15:00)",
                "activity_type": "arrival_logistics",
                "description": "Land at Narita/Haneda, grab Suica card, take Narita Express to Shinjuku (~90 min)",
                "has_physical_location": false,
                "duration_minutes": 120,
                "estimated_cost_usd": 30,
                "notes": "Download Google Maps offline before leaving airport"
                },
                {
                "time_flexible": "Evening (around 18:00)",
                "activity_type": "dining",
                "description": "Dinner at cozy izakaya in Omoide Yokocho - tiny alleyways packed with locals",
                "has_physical_location": true,
                "place_id": "ChIJ...",
                "name": "Omoide Yokocho",
                "location": "Shinjuku, Tokyo",
                "lat": 35.6938,
                "lng": 139.7001,
                "address": "1 Chome Nishishinjuku...",
                "google_maps_link": "https://maps.google.com/?q=...",
                "rating": 4.3,
                "estimated_travel_time_from_previous": {
                    "minutes": "15-20",
                    "method": "walk"
                },
                "duration_minutes": 90,
                "estimated_cost_usd": 25,
                "type": "restaurant_area",
                "notes": "Open evenings only, verify hours before visiting"
                },
                {
                "time_flexible": "Night (around 21:00)",
                "activity_type": "accommodation",
                "description": "Check in and rest - tomorrow brings adventure",
                "has_physical_location": false,
                "duration_minutes": null,
                "estimated_cost_usd": 0
                }
            ]
            }
        ]
        }
    ]
    }

    Generate complete itinerary following this methodology.
    `


    try {
        const chat = model.startChat();
        let result = await chat.sendMessage(prompt);
        let functionCallRounds = 0;

        while (result.response.functionCalls() && functionCallRounds < maxFunctionCalls) {
            const calls = result.response.functionCalls();
            if (!calls || calls.length === 0) break;

            console.log(`[Gemini] Processing batch of ${calls.length} validations...`);

            const responses = await validateBatch(calls, 10, 100);

            result = await chat.sendMessage(
                responses.map((r, i) => ({
                    functionResponse: {
                        name: 'validate_place',
                        response: r || { error: 'Place not found', found: false },
                        id: (calls[i] as any).id
                    }
                }))
            );

            functionCallRounds += calls.length;
            if (functionCallRounds > maxFunctionCalls * 2) {
                console.warn("Hit safety limit for function calls");
                break;
            }
        }

        const response = await result.response;
        const text = response.text();
        console.log('Gemini Final Response (first 500 chars):', text.substring(0, 500));

        if (!text || text.trim().length === 0) {
            throw new Error('Received empty response from Gemini');
        }

        let jsonData: GenerateItineraryResponse;
        try {
            const cleanJson = extractJSON(text);
            console.log('Extracted JSON length:', cleanJson.length);
            
            const rawData = JSON.parse(cleanJson);
            jsonData = normalizeItinerary(rawData);
            
            console.log('✅ Successfully parsed and normalized itinerary');
        } catch (e: any) {
            console.error('JSON Parse Error:', e.message);
            console.error('Raw text (first 1000 chars):', text.substring(0, 1000));
            console.error('Raw text (last 500 chars):', text.substring(text.length - 500));
            throw new Error(`Failed to parse itinerary JSON: ${e.message}`);
        }

        return jsonData;

    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to generate itinerary: ' + error.message
        })
    }
})
