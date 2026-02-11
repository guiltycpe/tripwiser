import { serverSupabaseClient } from '#supabase/server'

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

        const form = await readFormData(event)
        const file = form.get('avatar') as File

        if (!file) {
            throw createError({
                statusCode: 400,
                statusMessage: 'No file provided'
            })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
            })
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            throw createError({
                statusCode: 400,
                statusMessage: 'File too large. Maximum size is 5MB.'
            })
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to upload avatar'
            })
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)

        // Update user profile with new avatar URL
        const { error: updateError } = await (supabase
            .from('user_profiles' as any)
            .update({ avatar_url: publicUrl } as any)
            .eq('user_id', user.id) as any)

        if (updateError) {
            // If profile update fails, delete the uploaded file
            await supabase.storage.from('avatars').remove([fileName])
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update profile with avatar URL'
            })
        }

        return {
            success: true,
            avatar_url: publicUrl
        }
    } catch (error: any) {
        console.error('Error in upload-avatar:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Internal server error'
        })
    }
})
