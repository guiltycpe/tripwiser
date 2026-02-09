export default defineNuxtRouteMiddleware(async () => {
    const user = useSupabaseUser()

    // On client-side, check if user is authenticated
    if (!user.value) {
        return navigateTo('/auth/login')
    }
})
