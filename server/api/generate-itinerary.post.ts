import type { H3Event } from 'h3'

interface ItineraryActivity {
    time: string;
    description: string;
    lat: number;
    lng: number;
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

    // 1. Fetch real coordinates for the destination
    let baseLat = 48.8566 // Default to Paris
    let baseLng = 2.3522

    try {
        const geoUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(destination)}&limit=1`
        const geoResponse = await $fetch<any>(geoUrl)
        if (geoResponse.features && geoResponse.features.length > 0) {
            const coords = geoResponse.features[0].geometry.coordinates
            baseLng = coords[0]
            baseLat = coords[1]
            console.log(`Resolved ${destination} to: ${baseLat}, ${baseLng}`)
        }
    } catch (err) {
        console.error('Failed to geocode destination, using fallback Paris:', err)
    }

    // Exemple de génération dynamique "maison"
    const days = 3
    const itinerary: ItineraryDay[] = []

    for (let i = 1; i <= days; i++) {
        itinerary.push({
            day: i,
            title: i === 1 ? `Bienvenue à ${destination}` : `Découverte de ${destination} - Jour ${i}`,
            activities: [
                {
                    time: "09:00",
                    description: `Petit-déjeuner local et préparation`,
                    lat: baseLat + (Math.random() - 0.5) * 0.05,
                    lng: baseLng + (Math.random() - 0.5) * 0.05
                },
                {
                    time: "11:00",
                    description: `Visite d'un site emblématique de ${destination}`,
                    lat: baseLat + (Math.random() - 0.5) * 0.05,
                    lng: baseLng + (Math.random() - 0.5) * 0.05
                },
                {
                    time: "14:00",
                    description: `Pause déjeuner (${budget})`,
                    lat: baseLat + (Math.random() - 0.5) * 0.05,
                    lng: baseLng + (Math.random() - 0.5) * 0.05
                },
                {
                    time: "16:00",
                    description: `Activité style ${travel_style}`,
                    lat: baseLat + (Math.random() - 0.5) * 0.05,
                    lng: baseLng + (Math.random() - 0.5) * 0.05
                },
                {
                    time: "20:00",
                    description: `Dîner et soirée libre`,
                    lat: baseLat + (Math.random() - 0.5) * 0.05,
                    lng: baseLng + (Math.random() - 0.5) * 0.05
                }
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
