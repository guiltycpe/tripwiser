
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const destination = query.destination as string
    const config = useRuntimeConfig()

    if (!destination) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Destination is required',
        })
    }

    // Use the env variable directly or from runtime config if set up there
    const accessKey = process.env.UNSPLASH_ACCESS_KEY || config.unsplashAccessKey

    if (!accessKey) {
        console.error('UNSPLASH_ACCESS_KEY is missing')
        // Return null or a default/error to handle gracefully on client
        return { url: null, error: 'Configuration error' }
    }

    try {
        // Try cityscape first
        let searchUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(destination + ' cityscape')}&client_id=${accessKey}&orientation=landscape`

        let response = await fetch(searchUrl)

        if (!response.ok && response.status === 404) {
            // Fallback to landmark
            searchUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(destination + ' landmark')}&client_id=${accessKey}&orientation=landscape`
            response = await fetch(searchUrl)
        }

        if (!response.ok) {
            console.error(`Unsplash API error: ${response.status} ${response.statusText}`)
            return { url: null }
        }

        const data = await response.json()
        // Return the regular url (good quality but not raw)
        return { url: data.urls?.regular, alt: data.alt_description }

    } catch (error) {
        console.error('Error fetching image from Unsplash:', error)
        return { url: null, error: 'Failed to fetch image' }
    }
})
