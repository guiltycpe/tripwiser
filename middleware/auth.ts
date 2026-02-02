export default defineNuxtRouteMiddleware((to) => {
    // Note: Supabase user check is done client-side via composable in pages
    // This middleware is a placeholder and the real check happens in the page setup

    // For server-side rendering, we let the page handle the redirect
    // to avoid hydration issues
    return
})
