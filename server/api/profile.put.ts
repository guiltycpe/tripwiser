import { serverSupabaseClient } from '#supabase/server'
import type { UpdateProfilePayload } from '~/types/profile.types'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await serverSupabaseClient(event)
        
        // Get user from session
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user || !user.id) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized - Please log in again'
            })
        }

        const body = await readBody<UpdateProfilePayload>(event)

        // Validate and sanitize input
        const updateData: Partial<UpdateProfilePayload> = {}
        
        if (body.full_name !== undefined) updateData.full_name = body.full_name
        if (body.bio !== undefined) updateData.bio = body.bio
        if (body.travel_preferences !== undefined) updateData.travel_preferences = body.travel_preferences
        if (body.dietary_restrictions !== undefined) updateData.dietary_restrictions = body.dietary_restrictions
        if (body.preferred_languages !== undefined) updateData.preferred_languages = body.preferred_languages
        if (body.currency_preference !== undefined) updateData.currency_preference = body.currency_preference

        // @ts-ignore - Supabase types not yet generated for user_profiles table
        const { data: profile, error } = await supabase
            .from('user_profiles')
            // @ts-ignore
            .update(updateData)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update profile'
            })
        }

        return profile
    } catch (error: any) {
        console.error('Error in profile.put:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Internal server error'
        })
    }
})
