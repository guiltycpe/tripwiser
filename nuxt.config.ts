// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: { enabled: true },
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/global.css',
    'leaflet/dist/leaflet.css'
  ],
  modules: [
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
  ],
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' }
    ],
    defaultLocale: 'en'
  },
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/',
      exclude: ['/', '/auth/*', '/features', '/pricing', '/about', '/about'], // Removing /plan to force redirect
    }
  },
  runtimeConfig: {
    // Private keys (server-only)
    googlePlacesApiKey: '',
    geoapifyApiKey: '',
    // Public keys (exposed to client)
    public: {
      googlePlacesApiKey: ''
    }
  }
})