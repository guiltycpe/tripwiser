import type { H3Event } from 'h3'

interface ItineraryActivity {
    time: string;
    description: string;
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
    console.log('API call: generate-itinerary')
    const body = await readBody(event)
    const { destination, budget, travel_style } = body

    // Exemple de génération dynamique "maison"
    const days = 3
    const itinerary: ItineraryDay[] = []

    for (let i = 1; i <= days; i++) {
        itinerary.push({
            day: i,
            title: i === 1 ? `Bienvenue à ${destination}` : `Découverte de ${destination} - Jour ${i}`,
            activities: [
                { time: "09:00", description: `Petit-déjeuner local et préparation` },
                { time: "11:00", description: `Visite d'un site emblématique de ${destination}` },
                { time: "14:00", description: `Pause déjeuner (${budget})` },
                { time: "16:00", description: `Activité style ${travel_style}` },
                { time: "20:00", description: `Dîner et soirée libre` }
            ]
        })
    }

    return {
        success: true,
        itinerary: itinerary,
        meta: {
            destination,
            budget,
            style: travel_style
        }
    }
})
