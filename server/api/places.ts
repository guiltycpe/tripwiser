// server/api/places.ts
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const query = getQuery(event)
    const text = query.input as string

    if (!text) { return [] }

    const config = useRuntimeConfig(event)
    const apiKey = config.geoapifyApiKey
    const lang = getHeader(event, 'accept-language')?.substring(0, 2) || 'en'

    const params = new URLSearchParams({
        text: text,
        apiKey: apiKey,
        type: 'city',
        lang: lang,
        // On demande un peu plus de résultats pour avoir de la marge après le filtrage
        limit: '10',
        format: 'json',
    })

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`

    try {
        const response = await $fetch<{ results: any[] }>(url)

        if (response.results && response.results.length > 0) {

            // --- C'EST ICI QUE LA MAGIE OPÈRE ---

            const uniqueResults = response.results.reduce((accumulator, currentItem) => {
                // 1. On formate la description comme on veut l'afficher
                const city = currentItem.city || currentItem.name
                const country = currentItem.country
                const description = [city, country].filter(Boolean).join(', ')

                // 2. On vérifie si un lieu avec la même description existe déjà dans notre liste finale
                const isDuplicate = accumulator.some(item => item.description === description)

                // 3. Si ce n'est PAS un doublon, on l'ajoute à notre liste !
                if (!isDuplicate) {
                    accumulator.push({
                        description: description,
                        place_id: currentItem.place_id,
                        structured_formatting: {
                            main_text: city,
                            secondary_text: country
                        }
                    })
                }

                // 4. On retourne la liste (potentiellement mise à jour) pour la prochaine itération
                return accumulator
            }, [] as any[]) // On commence avec un tableau vide

            // On renvoie la liste propre et dédupliquée
            // On la coupe à 5 résultats pour garder une liste courte et pertinente
            return uniqueResults.slice(0, 5)
        }

        return []
    } catch (error) {
        console.error('Error fetching from Geoapify:', error)
        return []
    }
})