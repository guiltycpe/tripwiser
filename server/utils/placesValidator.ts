
export interface PlaceValidationResult {
    place_id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    rating: number | null;
    google_maps_link: string;
    types: string[];
}

export interface PlaceValidationError {
    error: string;
}

const PLACES_API_BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

/**
 * Validates a single place using Google Places API (New)
 */
export async function validatePlace(
    placeName: string,
    location: string,
    type: string
): Promise<PlaceValidationResult | null> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        console.error('GOOGLE_PLACES_API_KEY is not configured');
        return null;
    }

    const query = `${type} ${placeName} ${location}`;

    console.log(`[Validation] Checking "${placeName}" in "${location}"...`);

    try {
        const response = await fetch(PLACES_API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.types'
            },
            body: JSON.stringify({
                textQuery: query,
                languageCode: 'en'
            })
        });

        const data = await response.json();

        if (data.places && data.places.length > 0) {
            const place = data.places[0];

            const result: PlaceValidationResult = {
                place_id: place.id,
                name: place.displayName?.text || placeName,
                lat: place.location?.latitude || 0,
                lng: place.location?.longitude || 0,
                address: place.formattedAddress || '',
                rating: place.rating || null,
                google_maps_link: `https://www.google.com/maps/place/?q=place_id:${place.id}`,
                types: place.types || []
            };

            console.log(`✅ Success: Found "${result.name}" (${result.place_id})`);
            return result;
        } else {
            console.warn(`❌ Failed: No places found for "${placeName}" in "${location}"`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error validating place "${placeName}":`, error);
        return null;
    }
}

/**
 * Validates a batch of places handling concurrency limits and throttling
 */
export async function validateBatch(
    calls: any[],
    concurrencyLimit = 10,
    throttleMs = 100
): Promise<any[]> {
    const results = [];

    // Helper to chunk array
    const chunkArray = (arr: any[], size: number) => {
        return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    };

    const chunks = chunkArray(calls, concurrencyLimit);

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (!chunk) continue;

        // Execute chunk in parallel
        const chunkResults = await Promise.all(
            chunk.map(async (call: any) => {
                const { place_name, location, type } = call.args;
                return await validatePlace(place_name, location, type);
            })
        );

        results.push(...chunkResults);

        // Throttle between chunks (but not after the last one)
        if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, throttleMs));
        }
    }

    return results;
}
