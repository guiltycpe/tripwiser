import { serverSupabaseClient } from '#supabase/server'
import type { UserProfile } from '~/types/profile.types'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await serverSupabaseClient(event)
        
        // Get user from session using supabase client directly
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user || !user.id) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized - Please log in again'
            })
        }

        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error) {
            // If profile doesn't exist, create one
            if (error.code === 'PGRST116') {
                // @ts-ignore - Supabase types not yet generated for user_profiles table
                const { data: newProfile, error: insertError } = await supabase
                    .from('user_profiles')
                    // @ts-ignore
                    .insert({
                        user_id: user.id,
                        full_name: user.user_metadata?.full_name || '',
                        preferred_languages: ['en']
                    })
                    .select()
                    .single()

                if (insertError) {
                    throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to create profile: ' + insertError.message
                    })
                }

                return newProfile as UserProfile
            }

            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch profile: ' + error.message
            })
        }

        return profile as UserProfile
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Internal server error'
        })
    }
})
