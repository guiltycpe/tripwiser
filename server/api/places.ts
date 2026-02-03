// server/api/places.ts
import type { H3Event } from 'h3'

interface PhotonFeature {
    properties: {
        city?: string;
        name?: string;
        state?: string;
        country?: string;
        street?: string;
        osm_id?: string | number;
    }
}

interface PhotonResponse {
    features: PhotonFeature[];
}

interface PlaceResult {
    description: string;
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    }
}

/**
 * Alternative gratuite à Google Places utilisant Photon (OpenStreetMap)
 * Ne nécessite PAS de clé API.
 */
export default defineEventHandler(async (event: H3Event): Promise<PlaceResult[]> => {
    const query = getQuery(event)
    const text = query.input as string
    const config = useRuntimeConfig(event)
    const geoapifyKey = config.geoapifyApiKey

    if (!text || text.length < 2) { return [] }

    const lang = getHeader(event, 'accept-language')?.substring(0, 2) || 'en'

    if (geoapifyKey) {
        // Geoapify Autocomplete API
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&limit=5&lang=${lang}&apiKey=${geoapifyKey}`

        try {
            const response = await $fetch<any>(url)
            if (response.features && response.features.length > 0) {
                return response.features.map((f: any): PlaceResult => {
                    const props = f.properties
                    return {
                        description: props.formatted,
                        place_id: props.place_id,
                        structured_formatting: {
                            main_text: props.name || props.city || props.street,
                            secondary_text: `${props.city ? props.city + ', ' : ''}${props.country}`
                        }
                    }
                })
            }
        } catch (error) {
            console.error('Error fetching from Geoapify:', error)
            // Fallback to Photon if Geoapify fails
        }
    }

    // Fallback: Photon endpoint (OpenStreetMap Geocoding)
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=10&lang=${lang}`

    try {
        const response = await $fetch<PhotonResponse>(url)

        if (response.features && response.features.length > 0) {
            return response.features.map((f: PhotonFeature): PlaceResult => {
                const props = f.properties
                const city = props.city || props.name || props.state || 'Unknown'
                const country = props.country || 'Unknown'
                const street = props.street

                let description = city
                if (street) description = `${street}, ${description}`
                if (country) description = `${description}, ${country}`

                return {
                    description: description,
                    place_id: String(props.osm_id || Math.random()),
                    structured_formatting: {
                        main_text: city,
                        secondary_text: country
                    }
                }
            }).slice(0, 5)
        }

        return []
    } catch (error) {
        console.error('Error fetching from Photon:', error)
        return []
    }
})
