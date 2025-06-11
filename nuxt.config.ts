// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-05',
  ssr: true, // ou 'false' si tu vises 100 % SPA
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: [
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
  ],
  runtimeConfig: {
    public: {
      googlePlacesApiKey: process.env.NUXT_PUBLIC_GOOGLE_PLACES_API_KEY
    }
  }
})